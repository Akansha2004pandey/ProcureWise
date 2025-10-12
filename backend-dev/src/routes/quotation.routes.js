import express from "express";
const router = express.Router();
import 
{getAllQuotations,
    getQuotationById,
    createQuotation,
    updateQuotation,
    deleteQuotation

} from '../controllers/quotation.controller.js';

router.get('/', getAllQuotations);
router.get('/:id', getQuotationById);
router.post('/', createQuotation);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);

export default router;
