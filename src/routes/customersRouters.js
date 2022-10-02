import express from "express";
import { getCostumers, putCostumers, postCustomers, getIdCostumers } from "../controllers/customersControllers.js"

const router = express.Router()

router.get("/customers", getCostumers)
router.post("/customers", postCustomers)
router.get("/customers/:id", getIdCostumers)
router.put("/customers/:id", putCostumers)

export default router