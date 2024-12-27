const express = require('express');
const { Attraction, Visitor, Review } = require('../models/userModel');
const router = express.Router();

router.post('/attractions', async (req, res) => {
  try {
    const { name, location, entryFee } = req.body;
    if (!name || !location || entryFee == null || entryFee < 0) {
      return res.status(400).json({ error: 'Invalid attraction data' });
    }
    const attraction = new Attraction({ name, location, entryFee });
    await attraction.save();
    res.status(201).json(attraction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/visitors', async (req, res) => {
  try {
    const { name, email, visitedAttractions } = req.body;
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid visitor data' });
    }
    const existingVisitor = await Visitor.findOne({ email });
    if (existingVisitor) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const visitor = new Visitor({ name, email, visitedAttractions });
    await visitor.save();
    res.status(201).json(visitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const { attraction, visitor, score, comment } = req.body;
    if (!attraction || !visitor || !score || score < 1 || score > 5) {
      return res.status(400).json({ error: 'Invalid review data' });
    }
    const visitorData = await Visitor.findById(visitor).populate('visitedAttractions');
    if (!visitorData || !visitorData.visitedAttractions.some(attr => attr._id.toString() === attraction)) {
      return res.status(400).json({ error: 'Visitor has not visited this attraction' });
    }
    const existingReview = await Review.findOne({ attraction, visitor });
    if (existingReview) {
      return res.status(400).json({ error: 'Visitor has already reviewed this attraction' });
    }
    const review = new Review({ attraction, visitor, score, comment });
    await review.save();
    const attractionReviews = await Review.find({ attraction });
    const totalScore = attractionReviews.reduce((sum, r) => sum + r.score, 0);
    const averageRating = totalScore / attractionReviews.length;
    await Attraction.findByIdAndUpdate(attraction, { rating: averageRating });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/attractions', async (req, res) => {
  try {
    const attractions = await Attraction.find();
    res.status(200).json(attractions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/attractions/top-rated', async (req, res) => {
  try {
    const topAttractions = await Attraction.find().sort({ rating: -1 }).limit(5);
    res.status(200).json(topAttractions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/attractions/:id', async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);
    if (!attraction) return res.status(404).json({ error: 'Attraction not found' });
    res.status(200).json(attraction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/attractions/:id', async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!attraction) return res.status(404).json({ error: 'Attraction not found' });
    res.status(200).json(attraction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/attractions/:id', async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndDelete(req.params.id);
    if (!attraction) return res.status(404).json({ error: 'Attraction not found' });
    res.status(200).json({ message: 'Attraction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/visitors', async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/visitors/activity', async (req, res) => {
  try {
    const visitors = await Visitor.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'visitor',
          as: 'reviews'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          reviewCount: { $size: '$reviews' }
        }
      }
    ]);
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/visitors/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/visitors/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    res.status(200).json(visitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/visitors/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    res.status(200).json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().populate('attraction visitor');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    const attractionReviews = await Review.find({ attraction: review.attraction });
    const totalScore = attractionReviews.reduce((sum, r) => sum + r.score, 0);
    const averageRating = attractionReviews.length > 0 ? totalScore / attractionReviews.length : 0;
    await Attraction.findByIdAndUpdate(review.attraction, { rating: averageRating });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;