import express from 'express';
import categoriesRouter from './categoriesRouters.js';
import gamesRouter from './gamesRouters.js'

const router = express.Router()
router.use(categoriesRouter)
router.use(gamesRouter)

export default router;