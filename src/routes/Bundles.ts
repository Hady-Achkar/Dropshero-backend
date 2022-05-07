import express from 'express'
import {GetAllBundles, GetSingleBundle} from "../controllers";


const router = express.Router()

router.route('/').get(GetAllBundles)
router.route('/bundle').get(GetSingleBundle)
export default router
