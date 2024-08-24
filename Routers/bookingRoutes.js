import express from 'express';
import {
    createBooking,
    updateBookingStatus,
    getBookings,
    getBookingById
} from '../Controllers/bookingController.js'; // Adjust the path as needed

const bookingRouter = express.Router();

// Route to create a new booking
bookingRouter.post('/book', createBooking);

// Route to update the status of a booking
bookingRouter.patch('/bookings/:bookingId/status', updateBookingStatus);

// Route to get all bookings (for admin or general listing)
bookingRouter.get('/bookings', getBookings);

// Route to get a single booking by ID
bookingRouter.get('/bookings/:bookingId', getBookingById);

export default bookingRouter;
