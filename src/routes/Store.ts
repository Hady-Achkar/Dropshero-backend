import express from 'express'
import {GetStores} from '../controllers'
import {validateUserAuth} from '../middlewares'

const router = express.Router()
router.route('/').get(GetStores)
export default router
