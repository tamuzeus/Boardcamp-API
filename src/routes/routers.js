import express from 'express';
import categoriesRouter from './categoriesRouters.js';
import gamesRouter from './gamesRouters.js'
import customersRouter from './customersRouters.js'

const router = express.Router()
router.use(categoriesRouter)
router.use(gamesRouter)
router.use(customersRouter)

export default router;