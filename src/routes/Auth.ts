import express from 'express'
import {Signin, Signup, FacebookLogin, GoogleLogin, ForgotPassword, ResetPassword} from "../controllers";
import {ValidateNormalSignup} from "../middlewares";

const router = express.Router()

router.route('/sign-in').post(Signin)
router.route('/google').post(GoogleLogin)
router.route('/facebook').post(FacebookLogin)
router.route('/sign-up').post(ValidateNormalSignup, Signup)
router.route('/forgot-password').post(ForgotPassword)
router.route('/reset-password').post(ResetPassword)

export default router
