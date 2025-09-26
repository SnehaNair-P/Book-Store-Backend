import express from "express";
import { getAllBooks  } from "../controller/bookController.js";

const router = express.Router();

router.get("/getAllBooks", getAllBooks);


export default router;
