import mongoose from "mongoose";

const connectDB = mongoose.connect('mongodb://127.0.0.1/company-project')
    .then(() => console.log('Connection Successfull with database "company-project"'))
    .catch((err) => console.log(err));


export { connectDB }