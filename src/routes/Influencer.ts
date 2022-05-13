import express from 'express'
import {GetAllInfluencers, GetInfluencerById} from '../controllers'
import {validateUserAuth} from '../middlewares'

const router = express.Router()
router.route('/').get(GetAllInfluencers)
router.route('/influencer').post(GetInfluencerById)
export default router
