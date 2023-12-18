import express from "express";
import { connectDB } from "./Connection/db.js";
import cors from "cors";
const app = express();
const port = 5000;

import UserRoute from "./Routes/userRoute.js"
import PostRoute from "./Routes/postRoute.js"

connectDB;
app.use(cors());
app.use(express.json());

app.use("/image", express.static("uploads"));
app.use("/user", UserRoute);
app.use("/post", PostRoute)

app.listen(port, () => {
    console.log(`Server listen at port ${port}`)
})