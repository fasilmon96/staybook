import Room from "../models/Room.js";
import cloudinary from '../lib/cloudinary.js';



export const createRoom = async (req, res) => {

    try {
        const {
            hotelName,
            hotelLocation,
            pricePerNight,
            capacity,
            amenities,
            images,
            isAvailable,
            description
        } = req.body;

        if (!hotelName || !hotelLocation || !pricePerNight ||
            !capacity || !amenities || !images || images.length === 0 ||
            isAvailable || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let imageUrls = [];

        if (images && images.length > 0) {
            for (const image of images) {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrls.push(uploadResponse.secure_url);
            }
        }

        await Room.create({
            hotelName,
            hotelLocation,
            pricePerNight,
            capacity,
            amenities,
            images: imageUrls,
            isAvailable,
            description
        })

        return res.status(201).json({ message: "Room created successfully" })


    } catch (error) {
        console.log("Error in createRoom controller", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }

}

export const getAllRooms = async (req, res) => {
    try {

        const rooms = await Room.find().populate("bookings");

        const roomsData = rooms.map((room) => ({
            _id: room._id,
            hotelName: room.hotelName,
            pricePerNight: room.pricePerNight,
            capacity: room.capacity,
            amenities: room.amenities,
            images: room.images,
            isAvailable: room.isAvailable,
            description: room.description,
            booking_count: room.bookings ? room.bookings.length : 0

        }))

        res.status(200).json({ rooms: roomsData });

    } catch (error) {
        console.log("Error in getAllRooms controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getSingleRoom = async (req, res) => {
    try {

        const { id } = req.params;

        const room = await Room.findById(id);

        if (!room) return res.status(400).json({ message: "Room not found" });

        res.status(200).json(room);

    } catch (error) {
        console.log("Error in getSingleRoom Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const updateRoom = async (req, res) => {

    try {

        const { id } = req.params;
        const updates = req.body;

        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        if (!updateRoom) return res.status(400).json({ message: "Room not found" });

        res.status(201).json({ message: "Edit room succesfully" });


    } catch (error) {
        console.log("Error in edit controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteRoom = async (req, res) => {

    try {
        const { id } = req.params;

        const room = await Room.findById(id);

        if (!room) return res.json(401).json({ message: "Room not found" });

        await Room.deleteOne();

        res.staus(201).json({ message: "Room deleted Successfully" });
    } catch (error) {
        console.log("Error in deleted controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}