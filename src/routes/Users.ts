import express from 'express'
import {AddNewFavoriteProduct, EditProfile, GetProfile, RemoveFavoriteProduct} from "../controllers";
import {ValidateFavorites, validateUserAuth} from "../middlewares";

const router = express.Router()


router.route('/favorites').post(validateUserAuth, ValidateFavorites, AddNewFavoriteProduct)
router.route('/favorites').delete(validateUserAuth, ValidateFavorites, RemoveFavoriteProduct)
router.route('/edit-profile').put(validateUserAuth, EditProfile)
router.route('/me').get(validateUserAuth, GetProfile)

export default router
