import express from 'express'
import {AddNewProduct, GetAllProducts, GetProduct} from '../controllers'
import {ValidateAddProductBody, ValidateAdminAuth} from '../middlewares'

const router = express.Router()
router.route('/').get(GetAllProducts)
router.route('/').post(ValidateAddProductBody, AddNewProduct)
export default router
