import express from 'express'
import {GetAllInfluencers, GetInfluencerById} from '../controllers'
import {validateUserAuth} from '../middlewares'

const router = express.Router()
router.route('/').get(validateUserAuth, GetAllInfluencers)
router.route('/influencer').post(validateUserAuth, GetInfluencerById)
export default router
