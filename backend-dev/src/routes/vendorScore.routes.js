import express from 'express';
const router = express.Router();
import {getVendorScore} from '../controllers/vendorScore.controller.js';


router.get('/', getVendorScore);

export default router;
