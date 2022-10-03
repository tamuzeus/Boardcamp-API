import express from 'express';
import categoriesRouter from './categoriesRouters.js';
import gamesRouter from './gamesRouters.js'
import customersRouter from './customersRouters.js'
import rentalsRouter from './rentalsRouters.js'

const router = express.Router()
router.use(categoriesRouter)
router.use(gamesRouter)
router.use(customersRouter)
router.use(rentalsRouter)

export default router;