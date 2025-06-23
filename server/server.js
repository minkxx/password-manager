import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import cookieParser from 'cookie-parser';

import connectDB from "./config/mongodb.js";

import authRoutes from "./routes/api/authRoutes.js";
import userRoutes from "./routes/api/userRoutes.js";
import passwordRoutes from "./routes/api/passwordRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

await connectDB();

app.use(cors({credentials: true, origin: [process.env.CLIENT_URL, process.env.LOCALHOST_CLIENT_URL]}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("API is running");
})

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/password", passwordRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));