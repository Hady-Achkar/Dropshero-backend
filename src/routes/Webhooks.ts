import express from 'express'
import {CancelSubWebhook} from "../controllers";

const Router = express.Router()
Router.route('/cancel-subscription').post(express.raw({type: 'application/json'}), CancelSubWebhook)
export default Router
