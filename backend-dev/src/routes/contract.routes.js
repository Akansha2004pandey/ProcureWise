import express from 'express';
import {auditContract} from '../controllers/contract.controller.js';
const router = express.Router();

router.post('/',auditContract);

export default router;
