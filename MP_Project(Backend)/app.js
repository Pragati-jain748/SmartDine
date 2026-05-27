import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./error/error.js";
import reservationRoute from "./routes/reservationRoute.js";

const app = express();
dotenv.config({path: "./config/config.env"});

//connect backend and frontend
app.use(cors({
    origin: [process.env.FRONTEND_URL], // path of front end which connect backend 
    methods: ["POST"], // data bhejna h backend me isliye post method use kar rahe h - POST , GET , PUT , DELETE
    credentials: true,
}));
app.use(express.json()); // convert string into object
app.use(express.urlencoded({extended: true})) ; // data kis type ka use hone wala h 
app.use("/api/v1/reservation", reservationRoute); // backend me route use karna h

dbConnection();

app.use(errorMiddleware)

export default app;