import Booking from '../Models/bookingModle.js'; // Adjust the path as needed
import Property from '../models/propertyModele.js'; // Adjust the path as needed
import User from '../models/userModle.js'; // Adjust the path as needed

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { userId, propertyId, checkInDate, checkOutDate, totalPrice } = req.body;

        // Check if property and user exist
        const property = await Property.findById(propertyId);
        const user = await User.findById(userId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create the booking
        const newBooking = new Booking({
            userId,
            propertyId,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        const booking = await newBooking.save();

        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        if (!['confirmed', 'pending', 'canceled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status;
        const updatedBooking = await booking.save();

        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all bookings (optional, might be used for admin or user profile)
export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('userId').populate('propertyId');
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single booking by ID (optional)
export const getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate('userId').populate('propertyId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
