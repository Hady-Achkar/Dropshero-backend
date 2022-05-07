import express from 'express'
import {AddNewContact, UploadFile} from '../controllers'
import {ValidateAdminAuth} from '../middlewares'

const router = express.Router()

router.route('/upload').post(ValidateAdminAuth, UploadFile)
router.route('/contact').post(AddNewContact)
export default router
