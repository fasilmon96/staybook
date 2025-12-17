import mongoose from 'mongoose';


const roomSchema = new mongoose.Schema({
    hotelName: {
        type: String,
        required: true
    },

    hotelLocation: {
        type: String,
        required: true
    },

    pricePerNight: {
        type: Number,
        required: true,
    },

    capacity: {
        type: Number,
        required: true,
    },

    amenities: [
        {
            type: String
        }
    ],

    images: [
        {
            type: String
        }
    ],

    isAvailable: {
        type: Boolean,
        default: true
    },

    description: {
        type: String,
    },

},
    {
        timestamps: true,
        toJSON : {virtuals : true},
        toObject : {virtuals : true}
    }

);

roomSchema.virtual("bookings" , {
    ref : "Booking" ,
    localField : "_id",
    foreignField : "room",
    justOne : false
})

const Room = mongoose.model("Room", roomSchema);

export default Room;