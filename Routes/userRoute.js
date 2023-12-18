import express from "express";
import UserModel from "../Models/userModel.js"
import upload from "../Accessories/multer.js";

const router = express.Router();

router.post("/create", upload.single('profileImage'), async (req, res) => {
    try {
        console.log("body ==> ", req.body);
        console.log("file ==> ", req.file);
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({ status: 400, message: "Fill all Fields" })
        }
        if (req.file) {
            req.body.profileImage = req.file.filename;
        } else {
            return res.status(400).json({ status: 400, message: "Upload Image" })
        }
        const existingUser = await UserModel.find({ email });
        if (existingUser?.length > 0) {
            return res.status(400).json({ status: 400, message: "Email already Exists" })
        }
        const newUser = await UserModel(req.body);
        newUser.save()
        return res.status(200).json({ status: 200, data: newUser, message: "User Created" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error, message: "Network Error" })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkEmail = await UserModel.findOne({ email });
        if (!checkEmail) {
            return res.status(404).json({ status: 404, message: "Wrong Credentials" })
        }
        if (checkEmail?.password !== password) {
            return res.status(404).json({ status: 404, message: "Wrong Credentials" })
        }
        return res.status(200).json({ status: 200, message: "Loggedin Successfully", data: checkEmail });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error })
    }
})

router.get("/getAll", async (req, res) => {
    try {
        const data = await UserModel.find();
        if (data?.length === 0) {
            return res.status(400).json({ status: 400, message: "No User Found" });
        }
        return res.status(200).json({ status: 200, data, message: "Success" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error })
    }
})

router.put("/update/:id", upload.single('profileImage'), async (req, res) => {
    try {
        const { id } = req.params;
        if (req.file) {
            req.body.profileImage = req.file.filename;
        }
        const updateUser = await UserModel.findByIdAndUpdate(id, req.body);
        if (!updateUser) {
            return res.status(400).json({ status: 400, message: "No User Found" })
        }
        return res.status(200).json({ status: 200, message: "User Updated" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error, message: "Network Error" })
    }
})

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const delUser = await UserModel.findByIdAndDelete(id);
        if (!delUser) {
            return res.status(400).json({ status: 400, message: "No User Found" })
        }
        return res.status(200).json({ status: 200, message: "User Deleted" })
    } catch (error) {
        console.log(error);

    }
})

export default router;