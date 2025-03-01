import { Router, Request, Response } from "express";
import { uploadSingleFileMiddleware } from "../middleware/multer";
import { getIPFSData, uploadSingleFileToIPFS } from "../controllers/ipfs";

const router = Router();


router.get("/get_ipfs/:hash", getIPFSData);
router.post("/upload_image", uploadSingleFileMiddleware, uploadSingleFileToIPFS)

export default router;