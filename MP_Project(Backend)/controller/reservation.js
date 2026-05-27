import ErrorHandler from "../error/error.js";
import { Reservation } from "../models/reservationSchema.js";

export const sendReservation = async (req, res, next) => {
    const { firstName, lastName, email, phone, date, time } = req.body || {}; // agar req.body undefined h to empty object le lo
    if(!firstName || !lastName || !email || !phone || !date || !time) {  // agar kuch bhi missing h to
        return next(new ErrorHandler("Please fill all the fields", 400)); // 400 = getrequest
    }
    try{
        await Reservation.create({firstName, lastName, email, phone, date, time}); // jab tak ye data create nahi ho jata tab tak wait karna padega
        res.status(201).json({
            success: true,
            message: "Reservation created successfully"
        });
    }catch(error){
        if (error.name == "ValidationError") {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            return next(new ErrorHandler(validationErrors.join(", "), 400));
        }
        return next(error);
    }
};
