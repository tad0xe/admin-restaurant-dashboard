const express = require('express');
const router = express.Router();

const Calendar = require("../models/calendar");

router.get('/events', (req, res) => {
  Calendar.find({}, (err, events) => {
    if (err) {
      console.error('Failed to fetch events:', err);
      res.status(500).json({ error: 'Failed to fetch events' });
    } else {
      res.json(events);
    }
  });
});

router.post('/events', (req, res) => {
  const { id, title, start, end, allDay } = req.body;
  const event = new Calendar({ id, title, start, end, allDay });

  event.save((err) => {
    if (err) {
      console.error('Failed to save event:', err);
      res.status(500).json({ error: 'Failed to save event' });
    } else {
      console.log('Event saved:', event);
      res.sendStatus(201);
    }
  });
});

router.delete('/events/:id', (req, res) => {
  const eventId = req.params.id;
  Calendar.deleteOne({ id: eventId }, (err) => {
    if (err) {
      console.error('Failed to delete event:', err);
      res.status(500).json({ error: 'Failed to delete event' });
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
