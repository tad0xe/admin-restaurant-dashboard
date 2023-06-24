const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const cors = require('cors');
require('./auth');
const morgan = require("morgan");
const passport = require('passport');
const dotenv = require("dotenv");
const session = require('express-session');
const Stripe = require("stripe");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();
const router = express.Router();
const productsRoutes = require("./routes/product");
const visitRoutes = require("./routes/visit");
const revenueRoutes = require("./routes/revenue");
const categoryRoutes = require("./routes/category");
const ownerRoutes = require("./routes/owner");
const userRoutes = require("./routes/auth");
const searchRoutes = require("./routes/search");
const reviewRoutes = require("./routes/review");
const addressRoutes = require("./routes/address");
const paymentRoutes = require("./routes/payment");
const calenderRoutes = require("./routes/calender");

const orderRoutes = require("./routes/order");
app.use(session({
  secret: 'mmmmm',
  resave: false,
  saveUninitialized: false
}));
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", productsRoutes);
app.use("/api", searchRoutes);
app.use("/api", visitRoutes);
app.use("/api", addressRoutes);

app.use("/api", revenueRoutes);
app.use("/api", reviewRoutes);
app.use("/api", categoryRoutes);
app.use("/api", calenderRoutes);
app.use("/api", ownerRoutes);
app.use("/api", userRoutes);

app.use("/api", paymentRoutes);

app.use("/api", orderRoutes);
app.use(passport.initialize());
app.use(passport.session());
//connect to mongodb
/*
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log(`Listening on ${ PORT }`);
  })
  .catch(err => console.log(err));

*/
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,

    autoIndex: true //make this also true
  })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch(err => {
    console.error("App starting error:", err.stack);
    process.exit(1);
  });

//const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>  console.log(`Listening on port ${PORT}`));
app.get("/h", (req, res) => {
  res.send("Successful response.");
});

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle the error
    }
    res.send('Goodbye!');
  });
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});
app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});
app.use("/", router);
// get data for charge by id

//app.listen(port, function() {
//console.log(`api running on port ${port}`);
//});