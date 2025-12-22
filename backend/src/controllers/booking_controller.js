import Booking from "../models/Booking.js";
import Room from "../models/Room.js";



export const createBooking = async (req, res) => {
    try {
        const { roomId, checkInDate, checkOutDate } = req.body

        const userId = req.user._id;

        if (!roomId || !checkInDate || !checkOutDate) {
            return res.status(401).json({ message: "All fields are required" });
        }

        const room = await Room.findById(roomId);

        if (!room) return res.status(404).json({ message: "Room not found" })

        // Indian date safe conversion
        const checkIn = new Date(`${checkInDate}T00:00:00`);
        const checkOut = new Date(`${checkOutDate}T00:00:00`);

        if (checkIn >= checkOut) {
            return res.status(400).json({ message: "Invalid booking dates" })
        }

        const existingBooking = await Booking.findOne({
            room: roomId,
            bookingStatus: "Booked",
            $or: [
                {
                    checkInDate: { $lt: checkOut },
                    checkOutDate: { $gt: checkIn }
                }
            ]
        });

        if (existingBooking) return res.status(400).json({ message: "Room already booked for selected dates" })

        /// totalPrice

        const one_day = (1000 * 60 * 60 * 24)
        const days = (checkOut - checkIn) / one_day

        const totalPrice = days * room.pricePerNight;

        await Booking.create({
            room: roomId,
            user: userId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalPrice
        });

        res.status(201).json({ message: "Booking created Successfully" })

    } catch (error) {
        console.log("Error in createBooking controller", error);
        return res.status(500).json({ message: "Internal Server Error" })

    }
}

export const getBooking = async (req, res) => {
    try {

        const { userId } = req.params;

        const allBookings = await Booking.find().
            populate("user", "userName , email").
            populate("room", "hotelName , images")

        const userBooking = allBookings.filter(booking => booking.user._id.toString() === userId);

        res.status(200).json({
            booking: userBooking,
            allBooking: allBookings
        })

    } catch (error) {
        console.log("Error in getBooking controller", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}


export const updateBookingStatus = async (req, res) => {
    try {

        const { id } = req.params;

        const { bookingStatus } = req.body;

        if (req.user?.role !== "admin") {
            return res.status(400).json({ message: "only admin can update booking status" });
        }
        if (!bookingStatus) return res.status(400).json({ message: "booking status is required" });

        const booking = await Booking.findByIdAndUpdate(
            id,
            { bookingStatus },
            { new: true }
        );

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        res.status(200).json({ message: "Booking status updated successfully" });

    } catch (error) {
        console.log("Error in updateBookingStatus", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}