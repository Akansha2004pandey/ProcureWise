import {Quotation} from '../models/quotation.model.js';
// Get all quotations or filter by RFP ID
export const getAllQuotations = async (req, res) => {
  try {
    const { rfpId } = req.query;
    const filter = rfpId ? { rfpId } : {};
    
    const quotations = await Quotation.find(filter)
      .populate('rfpId', 'title')
      .sort({ createdAt: -1 });
    
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quotations', error: error.message });
  }
};

// Get single quotation by ID
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('rfpId');
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quotation', error: error.message });
  }
};

// Create new quotation
export const createQuotation = async (req, res) => {
  try {
    const { rfpId, vendorName, cost, deliveryTime, notes } = req.body;
    
    if (!rfpId || !vendorName || cost === undefined || deliveryTime === undefined) {
      return res.status(400).json({ message: 'Required fields: rfpId, vendorName, cost, deliveryTime' });
    }

    const quotation = new Quotation({
      rfpId,
      vendorName,
      cost,
      deliveryTime,
      notes
    });

    await quotation.save();
    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating quotation', error: error.message });
  }
};

// Update quotation
export const updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating quotation', error: error.message });
  }
};

// Delete quotation
export const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    res.json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quotation', error: error.message });
  }
};
