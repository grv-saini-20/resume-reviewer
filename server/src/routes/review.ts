import express from "express";
import reviewResume from "../controllers/reviewController";

const router = express.Router();

router.post("/review", reviewResume);