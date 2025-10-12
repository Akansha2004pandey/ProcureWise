import { RFP } from '../models/rfp.model.js';

// Get all RFPs
export const getAllRFPs = async (req, res) => {
  try {
    const rfps = await RFP.find().sort({ createdAt: -1 });
    res.json(rfps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching RFPs', error: error.message });
  }
};

// Get single RFP by ID
export const getRFPById = async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id);
    if (!rfp) {
      return res.status(404).json({ message: 'RFP not found' });
    }
    res.json(rfp);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching RFP', error: error.message });
  }
};

// Create new RFP
export const createRFP = async (req, res) => {
  try {
    const { title, description, items, deadline } = req.body;
    
    if (!title || !description || !items || !deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const rfp = new RFP({
      title,
      description,
      items,
      deadline,
      status: 'open'
    });

    await rfp.save();
    res.status(201).json(rfp);
  } catch (error) {
    res.status(500).json({ message: 'Error creating RFP', error: error.message });
  }
};

// Update RFP
export const updateRFP = async (req, res) => {
  try {
    const rfp = await RFP.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!rfp) {
      return res.status(404).json({ message: 'RFP not found' });
    }
    
    res.json(rfp);
  } catch (error) {
    res.status(500).json({ message: 'Error updating RFP', error: error.message });
  }
};

// Delete RFP
export const deleteRFP = async (req, res) => {
  try {
    const rfp = await RFP.findByIdAndDelete(req.params.id);
    
    if (!rfp) {
      return res.status(404).json({ message: 'RFP not found' });
    }
    
    res.json({ message: 'RFP deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting RFP', error: error.message });
  }
};
