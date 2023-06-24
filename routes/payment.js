const router = require("express").Router();
const moment = require("moment");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECREY_KEY);
const paypal = require('paypal-rest-sdk');

const nodemailer = require("nodemailer");
const verifyToken = require("../middelwares/verify-token");
const Order = require("../models/order");

const SHIPMENT = {
  normal: {
    price: 13.98,
    days: 7
  },
  fast: {
    price: 49.98,
    days: 3
  }
};
// Set up PayPal configuration
paypal.configure({
  mode: 'sandbox', // Change to 'live' for production
  client_id: 'AVdgDF7t8yR-fGoYp7vjWiCiUe6xPOUpSYnc-HWIT2thaTXW0TdEBuziCJXcv_l_3yygWLr9U0AdHQQI',
  client_secret: 'EMw3O41rAe2fNJVUkFzLGATbRQVCGdr4fTj9oTQwyjo8QFF4U6aPAaeG5wDoaSBhPybtlv2176mY2pmh'
});

function shipmentPrice(shipmentOption) {
  let estimated = moment()
    .add(shipmentOption.days, "d")
    .format("dddd MMMM Do");

  return {
    estimated,
    price: shipmentOption.price
  };
}

router.post("/shipment", (req, res) => {
  let shipment;
  if (req.body.shipment === "normal") {
    shipment = shipmentPrice(SHIPMENT.normal);
  } else {
    shipment = shipmentPrice(SHIPMENT.fast);
  }

  res.json({
    success: true,
    shipment: shipment
  });
});
router.post("/payment", (req, res) => {
  let totalPrice = Math.round(req.body.totalPrice * 100);

  //let totalPrice = 500 * 100
  stripe.customers
    .create({
      email: "toluarejibadey@gmail.com"
    })
    .then(customer => {
      return stripe.customers.createSource(customer.id, {
        source: "tok_visa"
      });
    })
    .then(source => {
      return stripe.charges.create({
          amount: totalPrice,
          currency: "usd",
          customer: source.customer,
        },
        function (err, charge) {
          if (err) {
            console.log(err);
          } else {
            var emailTemplate = `Hello , \n
  thank you for your order! \n
  Amount: ${charge.amount / 100} \n
 `;
            let mailTransporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.GOOGLE_APP_EMAIL,
                pass: process.env.GOOGLE_APP_PW
              }
            });

            let details = {
              from: process.env.GOOGLE_APP_EMAIL,
              to: `toluarejibadey@gmail.com`,
              subject: "shipping",
              text: emailTemplate
            };
            mailTransporter.sendMail(details, err => {
              if (err) {
                console.log(err);
              } else {
                console.log("email sent");
              }
            });
          }
        }
      );

    })
    .then(async charge => {
      console.log("charge>", charge);
      res.json({
        success: true,
        message: "Successfully made a payment"
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: err.message
      });
    });
});
router.post("/pay", verifyToken, (req, res) => {
  const { token, totalPrice, productId, quantity } = req.body;

  const totalPriceInCents = Math.round(totalPrice * 100);

  stripe.customers
    .create({
      email: req.decoded.email
    })
    .then(customer => {
      return stripe.customers.createSource(customer.id, {
        source: "tok_visa"
      });
    })
    .then(source => {
      return stripe.charges.create({
        amount: totalPriceInCents,
        currency: "usd",
        customer: source.customer,
        email: req.body.email
      });
    })
    .then(async charge => {
      const emailTemplate = `Hello ${req.decoded.name}, \n
        thank you for your order! \n
        Amount: ${charge.amount / 100} \n
        Your full order details are available at ecart.io/#/order-complete/${
          charge.id
        } \n
        For questions, contact your_support_email@gmail.com \n
        Thank you!`;

      const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GOOGLE_APP_EMAIL,
          pass: process.env.GOOGLE_APP_PW
        }
      });

      const details = {
        from: process.env.GOOGLE_APP_EMAIL,
        to: `${req.decoded.email}`,
        subject: "shipping",
        text: emailTemplate
      };
     // console.log(details)

      mailTransporter.sendMail(details, err => {
        if (err) {
          console.log(err);
        } else {
          console.log("email sent");
        }
      });

      const order = new Order({
        products: [
          {
            productID: productId,
            quantity: quantity,
            totalPrice: totalPrice
          }
        ],
        status: "New Order",

      });
      order.owner = req.decoded._id;

      await order.save();

      res.json({
        success: true,
        message: "Successfully made a payment"
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: err.message
      });
    });
});

router.post('/paym', async (req, res) => {
  try {
    const { email, estimatedDelivery, price } = req.body;
    const productID = '6452bba224d63e39c56602c3'; // Hardcoded product ID

    // Create a customer with the provided email
    const customer = await stripe.customers.create({
      email: email
    });

    // Create a payment source for the customer using a test card token
    const source = await stripe.customers.createSource(customer.id, {
      source: 'tok_visa'
    });

    // Charge the customer for the total amount
    const charge = await stripe.charges.create({
      amount: price,
      currency: 'usd',
      customer: source.customer,
      email: email
    });

    // Create a new order and set the status to "new"
    const order = new Order();

    order.products.push({
      productID: productID,
      quantity: 1, // You can adjust the quantity as needed
      price: price // Use the price passed from the frontend
    });

    order.estimatedDelivery = estimatedDelivery;
    order.status = 'New Order'; // Set the status to "new"

    // Save the order to the database
    const savedOrder = await order.save();

    res.json({
      success: true,
      message: 'Successfully made a payment',
      order: savedOrder
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// get data for charge by id
router.get("/charge/:id", function (req, res) {
  stripe.charges.retrieve(req.params.id, function (err, charge) {
    if (err) {
      res.json({
        error: err,
        charge: false
      });
    } else {
      res.json({
        error: false,
        charge: charge
      });
    }
  });
});


module.exports = router;