import express from 'express'
import {
    AddNewPaymentMethod,
    CancelSubscriptionManual,
    ChangeDefaultMethod,
    ConfigFront,
    InitBundleSub,
    RemovePaymentMethod,
    UpgradeAccount,
} from '../controllers'
import {validateUserAuth} from '../middlewares'
import ValidatePromo from "../controllers/Payments/ValidatePromo";

const router = express.Router()

router.route('/config').get(ConfigFront)
router.route('/init-sub').post(validateUserAuth, InitBundleSub)
router.route('/payment').post(validateUserAuth, AddNewPaymentMethod)
router.route('/payment').delete(validateUserAuth, RemovePaymentMethod)
router
    .route('/cancel-subscription')
    .delete(validateUserAuth, CancelSubscriptionManual)
router
    .route('/default-payment-method')
    .patch(validateUserAuth, ChangeDefaultMethod)
router.route('/upgrade').put(validateUserAuth, UpgradeAccount)
router.route('/promo').get(validateUserAuth, ValidatePromo)

export default router
