import { Contract } from '../models/contract.model.js';
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";
// AI-powered contract audit
export const auditContract = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Contract text is required' });
    }

    // Analyze contract using AI
    const auditResult = await analyzeContractWithAI(text);
    
    // Save audit to database
    const contract = new Contract({
      text,
      riskFlags: auditResult.riskFlags,
      insights: auditResult.insights
    });
    
    await contract.save();
    
    res.json(auditResult);
  } catch (error) {
    res.status(500).json({ message: 'Error auditing contract', error: error.message });
  }
};


// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Utility: safely extract JSON from AI text
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/); // grab first JSON object in text
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}

// Main function
export async function analyzeContractWithAI(contractText) {
  try {
    const prompt = `Analyze this procurement contract and identify:
1. Risk flags (potential issues, unfavorable terms, missing clauses)
2. Key insights (recommendations, strengths, areas of concern)

Return strictly valid JSON with no extra text:
{"riskFlags":["flag1"],"insights":["insight1"]}

Contract:
${contractText}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      temperature: 0.1 // deterministic output
    });

    // Extract JSON safely
    const result = extractJSON(response.text);

    if (!result) {
      throw new Error("AI returned invalid JSON");
    }

    return {
      text: contractText,
      riskFlags: result.riskFlags || [],
      insights: result.insights || []
    };

  } catch (error) {
    console.error("AI contract analysis error:", error);

    // Fallback: simple keyword-based analysis
    const risks = [];
    const insights = [];

    if (!contractText.toLowerCase().includes("termination")) {
      risks.push("Missing termination clause");
    }
    if (!contractText.toLowerCase().includes("liability")) {
      risks.push("No liability terms specified");
    }
    if (!contractText.toLowerCase().includes("payment")) {
      risks.push("Payment terms unclear");
    }

    insights.push("Consider adding specific delivery milestones");
    insights.push("Review indemnification clauses carefully");
    insights.push("Ensure compliance requirements are clearly stated");

    return { text: contractText, riskFlags: risks, insights };
  }
}
