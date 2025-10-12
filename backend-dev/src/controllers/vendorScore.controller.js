import { Quotation } from '../models/quotation.model.js';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// GET AI-powered vendor score for a specific RFP
export const getVendorScore = async (req, res) => {
  try {
    const { rfpId } = req.query;

    if (!rfpId) {
      return res.status(400).json({ message: 'rfpId is required' });
    }

    // Fetch all quotations for the RFP
    const quotations = await Quotation.find({ rfpId });

    if (quotations.length === 0) {
      return res.status(404).json({ message: 'No quotations found for this RFP' });
    }

    // Calculate best vendor using AI
    const bestVendor = await calculateBestVendor(quotations);

    res.json(bestVendor);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating vendor score', error: error.message });
  }
};

// Helper: safely extract JSON from AI output
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/); // grab the first JSON object
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

// AI-powered vendor evaluation using Gemini
async function calculateBestVendor(quotations) {
  try {
    // Prepare quotation data
    const quotationData = quotations.map(q => ({
      vendorName: q.vendorName,
      cost: q.cost,
      deliveryTime: q.deliveryTime,
      notes: q.notes || ''
    }));

    const prompt = `Analyze these vendor quotations and recommend the best vendor based on cost, delivery time, and overall value.
Return strictly valid JSON in the format:
{"vendorName":"Best Vendor","score":0-100,"cost":number,"deliveryTime":number,"reasoning":"explanation"}

Quotations:
${JSON.stringify(quotationData, null, 2)}`;

    // Call Gemini via Node.js SDK
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      temperature: 0.1 // deterministic output
    });

    // Safely parse AI response
    let result = extractJSON(response.text);

    if (!result) {
      throw new Error("Failed to parse AI response");
    }

    // Update the score in the database
    await Quotation.findOneAndUpdate(
      { rfpId: quotations[0].rfpId, vendorName: result.vendorName },
      { score: result.score }
    );

    return result;

  } catch (error) {
    console.error('AI evaluation error:', error);

    // Fallback: simple scoring based on cost and delivery time
    const scored = quotations.map(q => {
      const costScore = (1 / q.cost) * 10000;
      const timeScore = (1 / q.deliveryTime) * 100;
      const totalScore = costScore * 0.6 + timeScore * 0.4;

      return {
        vendorName: q.vendorName,
        score: Math.min(100, Math.round(totalScore)),
        cost: q.cost,
        deliveryTime: q.deliveryTime,
        reasoning: 'Score calculated based on cost (60%) and delivery time (40%)'
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0];
  }
}
