import express from 'express'
import {GetAllAmazonProducts} from '../controllers'

const router = express.Router()
router.route('/').get(GetAllAmazonProducts)
export default router
