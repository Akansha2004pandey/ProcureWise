import express from 'express';
const router = express.Router();
import {
    getAllRFPs,
    getRFPById,
    createRFP,
    updateRFP,
    deleteRFP
}

    from '../controllers/rfp.controller.js';

router.get('/', getAllRFPs);
router.get('/:id', getRFPById);
router.post('/', createRFP);
router.put('/:id',updateRFP);
router.delete('/:id', deleteRFP);

export default router;
