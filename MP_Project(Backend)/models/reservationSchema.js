import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, "First name is required"],
        minlength : [3, "First name must be at least 3 characters"],
        maxlength : [50, "First name must be less than 50 characters"]
    },
    lastName : {
        type : String,
        required : [true, "Last name is required"],
        minlength : [3, "Last name must be at least 3 characters"],
        maxlength : [50, "Last name must be less than 50 characters"]
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        validate : [validator.isEmail, "Please provide a valid email"]      
    },
    phone: {
        type : String,
        required : true,
        minlength : [10, "Phone Number must contain 10 digits only"],
        maxlength : [10, "Phone Number cannot exceed 10 digits"],
    },
    time : {
        type : String,
        required :true
    },
    date : {
        type : String,
        required : true
    },
});

export const Reservation =  mongoose.model("Reservation", reservationSchema);