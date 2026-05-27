import mongoose from "mongoose";
import dns from "dns";

// Force Node.js to use Google DNS (fixes SRV lookup issues on some networks)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "MP_PROJECT",
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
    })
        .then(() => {
            console.log("✅ Connected to MongoDB Atlas successfully!");
        })
        .catch((err) => {
            console.log("❌ MongoDB Atlas Connection Error:", err.message);
            console.log("🔄 Retrying connection in 5 seconds...");
            setTimeout(() => dbConnection(), 5000);
        });
};