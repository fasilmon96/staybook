import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },

    checkInDate: {
        type: Date,
        required: true
    },

    checkOutDate: {
         type: Date,
         required : true
    },

    totalPrice : {
        type: Number,
        required: true
    },

    bookingStatus : {
        type: String,
        enum : ["Booked" , "Cancelled" , "Completed"],
        default : "Booked"
    }
}, 
 {
    timestamps : true
 }

)

const Booking = mongoose.model("Booking" , bookingSchema);
export default Booking;