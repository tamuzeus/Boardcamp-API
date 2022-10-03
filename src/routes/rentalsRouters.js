import express from "express";
import { postRentals, deleteRentals, getRentals, postRentalsReturn } from "../controllers/rentalsControllers.js";

const router = express.Router()

router.post("/rentals", postRentals)
router.get("/rentals", getRentals)
router.delete("/rentals/:id", deleteRentals)
router.post("/rentals/:id/return", postRentalsReturn)

export default router