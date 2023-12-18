import express from "express";
import PostModel from "../Models/postModel.js"
import upload from "../Accessories/multer.js";

const router = express.Router();

router.post("/create", upload.array("images"), async (req, res) => {
    try {
        const { owner, heading, description } = req.body;
        const images = req.files.map(file => file.filename);
        const newPost = new PostModel({ owner, heading, description, images });
        const savedPost = await newPost.save();
        return res.status(200).json({ status: 200, data: savedPost, message: "Post Created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error });
    }
})

router.get("/getAll", async (req, res) => {
    try {
        const data = await PostModel.find().populate({
            path: 'owner',
            select: 'name _id profileImage'
        });
        if (data?.length === 0) {
            return res.status(400).json({ status: 400, message: "No Post Found" });
        }
        return res.status(200).json({ status: 200, data, message: "Success" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error })
    }
})

router.get("/get/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await PostModel.find({ owner: id });
        if (posts?.length > 0) {
            return res.status(200).json({ status: 200, data: posts })
        }
        return res.status(404).json({ status: 404, message: "No Posts Yet" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error })
    }
})

router.put("/update/:id", upload.array("images", 3), async (req, res) => {
    try {
        const { id } = req.params;
        if (req.files) {
            req.body.images = req.files.map(file => file.filename);
        }
        const updatedPost = await PostModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ status: 404, message: "Post not found" });
        }
        return res.status(200).json({ status: 200, data: updatedPost, message: "Post Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const delPost = await PostModel.findByIdAndDelete(id);
        if (!delPost) {
            return res.status(404).json({ status: 404, message: "Post Not Found" })
        }
        return res.status(200).json({ status: 200, message: "Post Deleted" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: "Network Error", error })
    }
})

export default router;