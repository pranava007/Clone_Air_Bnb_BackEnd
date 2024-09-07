// controllers/reviewController.js
import Review from '../Models/review.js';
import Property from '../Models/propertyModele.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { userId, propertyId, rating, comment } = req.body;

    // Check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const newReview = new Review({
      userId,
      propertyId,
      rating,
      comment,
    });

    const savedReview = await newReview.save();

    // Update property average rating
    const reviews = await Review.find({ propertyId });
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    property.averageRating = averageRating;
    await property.save();

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Controller function to get reviews for a specific property
export const getReviews = async (req, res) => {
  try {
    const { propertyId } = req.params; // Get the propertyId from request parameters

    // Find all reviews for the given property and populate the userId field to get the user's name
    const reviews = await Review.find({ propertyId }).populate('userId', 'name');

    // Return the reviews with a 200 OK status
    res.status(200).json(reviews);
  } catch (error) {
    // Handle any errors and send a 500 Internal Server Error status
    res.status(500).json({ message: error.message });
  }
};





// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(reviewId, { rating, comment }, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Recalculate average rating of the property
    const property = await Property.findById(deletedReview.propertyId);
    const reviews = await Review.find({ propertyId: deletedReview.propertyId });
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    property.averageRating = averageRating || 0;
    await property.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
