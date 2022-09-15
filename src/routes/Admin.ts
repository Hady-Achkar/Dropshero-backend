import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders'
import express from 'express'
import {
	AddNewProduct,
	AdminSignin,
	AdminSignup,
	DeleteProduct,
	DeleteUser,
	EditMyProfileAdmin,
	EditProduct,
	EditUser,
	GetAdminProducts,
	GetAllUsers,
	GetMyProfileAdmin,
	GetProduct,
	GetUser,
	GetAllAdmins,
	GetSingleAdmin,
	EditAdmin,
	DeleteAdmin,
	GetBalance,
	GetTransactions,
	Statistics,
	ArchiveProduct,
	AddAdminUser,
	AddAdminUsers,
	GetAllInfluencers,
	GetInfluencerById,
	AddNewInfluencer,
	EditInfluencer,
	DeleteInfluencer,
	DeleteStore,
	EditStore,
	CreateStore,
} from '../controllers'
import {ValidateAddProductBody, ValidateAdminAuth, uploadExcel} from '../middlewares'

const router = express.Router()
router.route('/sign-in').post(AdminSignin)
router.route('/sign-up').post(ValidateAdminAuth, AdminSignup)
router.route('/products').get(ValidateAdminAuth, GetAdminProducts)
router.route('/product').get(ValidateAdminAuth, GetProduct)
router
	.route('/product')
	.post(ValidateAdminAuth, ValidateAddProductBody, AddNewProduct)
router
	.route('/product')
	.put(ValidateAdminAuth, ValidateAddProductBody, EditProduct)
router.route('/product').delete(ValidateAdminAuth, DeleteProduct)
router.route('/product/archive').put(ValidateAdminAuth, ArchiveProduct)


//uploadExcel.single('excel')
router.route('/users').post(ValidateAdminAuth, uploadExcel.single('excel'), AddAdminUsers);
router.route('/users').get(ValidateAdminAuth, GetAllUsers)
router.route('/user').delete(ValidateAdminAuth, DeleteUser)
router.route('/user').put(ValidateAdminAuth, EditUser)
router.route('/user').get(ValidateAdminAuth, GetUser)
router.route('/user').post(ValidateAdminAuth, AddAdminUser)
router.route('/profile').get(ValidateAdminAuth, GetMyProfileAdmin)
router.route('/profile').put(ValidateAdminAuth, EditMyProfileAdmin)
router.route('/').post(ValidateAdminAuth, AdminSignup)
router.route('/').get(ValidateAdminAuth, GetAllAdmins)
router.route('/admin').get(ValidateAdminAuth, GetSingleAdmin)
router.route('/admin').put(ValidateAdminAuth, EditAdmin)
router.route('/admin').delete(ValidateAdminAuth, DeleteAdmin)
router.route('/balance').get(ValidateAdminAuth, GetBalance)
router.route('/transactions').get(ValidateAdminAuth, GetTransactions)
router.route('/statistics').get(ValidateAdminAuth, Statistics)
router.route('/influencers').get(ValidateAdminAuth, GetAllInfluencers)
router.route('/influencer').get(ValidateAdminAuth, GetInfluencerById)
router.route('/influencer').post(ValidateAdminAuth, AddNewInfluencer)
router.route('/influencer').put(ValidateAdminAuth, EditInfluencer)
router.route('/influencer').delete(ValidateAdminAuth, DeleteInfluencer)

router.route('/store').post(ValidateAdminAuth, CreateStore)
router.route('/store').put(ValidateAdminAuth, EditStore)
router.route('/store').delete(ValidateAdminAuth, DeleteStore)

export default router
