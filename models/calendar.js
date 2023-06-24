const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CalendarSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  },
  allDay: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("Calendar", CalendarSchema);
