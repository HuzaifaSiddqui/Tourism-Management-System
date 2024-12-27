
const mongoose = require('mongoose');

const AttractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  entryFee: {
    type: Number,
    required: [true, 'Entry fee is required'],
    min: [0, 'Entry fee must be greater than or equal to 0'],
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be between 0 and 5'],
    max: [5, 'Rating must be between 0 and 5'],
  },
});

const VisitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  visitedAttractions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attraction',
    },
  ],
});


const ReviewSchema = new mongoose.Schema({
  attraction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attraction',
    required: [true, 'Attraction reference is required'],
  },
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor',
    required: [true, 'Visitor reference is required'],
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [1, 'Score must be between 1 and 5'],
    max: [5, 'Score must be between 1 and 5'],
  },
  comment: {
    type: String,
  },
});


const Attraction = mongoose.model('Attraction', AttractionSchema);
const Visitor = mongoose.model('Visitor', VisitorSchema);
const Review = mongoose.model('Review', ReviewSchema);


module.exports = {
  Attraction,
  Visitor,
  Review,
};
