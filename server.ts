import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return aiClient;
}

// Helper to prevent undici header timeouts on long generation calls
function withTimeout<T>(promise: Promise<T>, ms: number = 18000, fallbackErrorMsg = 'Operation timed out'): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(fallbackErrorMsg)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing for JSON and large image payloads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // AI Diagnostic Analysis endpoint
  app.post('/api/diagnose', async (req, res) => {
    try {
      const {
        itemName,
        modelNumber,
        category,
        problemDescription,
        symptoms = [],
        itemAgeYears = 3,
        originalCost = 15000,
        imageBase64,
        mimeType = 'image/jpeg',
      } = req.body;

      if (!itemName || !problemDescription) {
        return res.status(400).json({ error: 'Item name and problem description are required' });
      }

      const ai = getGenAI();

      if (!ai) {
        // Fallback calculation if no API key is set in preview
        return res.json({
          success: true,
          source: 'local_engine',
          data: generateLocalDiagnosis(itemName, modelNumber, category, problemDescription, symptoms, itemAgeYears, originalCost),
        });
      }

      const promptText = `
You are the master diagnostic and repair engineer for "RepairConnect — Diagnose, Repair & Reuse".
Analyze this damaged item and its problem report to provide an exhaustive, structured repair assessment.

Item Name: ${itemName}
Model / Part Number: ${modelNumber || 'Not specified (infer from description or label)'}
Category: ${category}
User Problem Description: ${problemDescription}
Reported Symptoms: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms}
Item Age: ${itemAgeYears} years
Original/Current Replacement Cost: ₹${originalCost}

CRITICAL SAFETY & RESPONSIBLE AI RULES:
1. Clearly frame this as an "AI-assisted assessment — not a professional diagnosis".
2. Provide ONLY safe, basic, low-risk troubleshooting checks (e.g. power isolation, external cleaning, balance checks, visual inspection).
3. NEVER provide dangerous instructions involving live high-voltage electrical repair (>50V AC/DC), gas valves/burners, dangerous spring mechanisms, microwave high-voltage capacitors, lithium battery puncture hazards, or hazardous structural load-bearing disassembly.
4. Specify clear "When to Stop & Call a Professional" red-flag conditions.
5. Accurately calculate repair-worthiness comparing estimated repair cost vs replacement cost, product lifespan extension, and carbon/e-waste diversion.

Provide the response in the exact JSON schema requested.
`;

      const contentsParts: Array<any> = [];

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        contentsParts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        });
      }

      contentsParts.push({
        text: promptText,
      });

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: { parts: contentsParts },
          config: {
            systemInstruction:
              'You are RepairConnect AI, an expert electromechanical, appliance, electronics, and product repair diagnostic intelligence that promotes the Right to Repair, product longevity, and safe waste reduction.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                possibleProblem: { type: Type.STRING, description: 'Specific primary diagnosis / failure mechanism' },
                confidence: { type: Type.INTEGER, description: 'Confidence score percentage between 60 and 96' },
                severity: { type: Type.STRING, description: 'low, medium, high, or critical' },
                summary: { type: Type.STRING, description: '2-3 sentence technical diagnostic summary' },
                visibleSymptoms: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Key visible or operational symptoms identified',
                },
                possibleCauses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      cause: { type: Type.STRING },
                      probability: { type: Type.STRING, description: 'High probability, Medium probability, or Low probability' },
                      explanation: { type: Type.STRING },
                    },
                    required: ['cause', 'probability', 'explanation'],
                  },
                },
                safetyAlert: { type: Type.STRING, description: 'Key safety warning for this item type' },
                safeTroubleshooting: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      step: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      instruction: { type: Type.STRING },
                      caution: { type: Type.STRING },
                      toolNeeded: { type: Type.STRING },
                    },
                    required: ['step', 'title', 'instruction'],
                  },
                },
                whenToStopAndCallPro: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3-4 critical criteria when user must stop DIY and contact a professional',
                },
                repairWorthiness: {
                  type: Type.OBJECT,
                  properties: {
                    verdict: { type: Type.STRING, description: 'REPAIR, CONSIDER_REPLACEMENT, RECYCLE_RESPONSIBLY, or SIMPLE_FIX' },
                    verdictTitle: { type: Type.STRING, description: 'e.g. Recommended: REPAIR' },
                    summary: { type: Type.STRING },
                    estimatedRepairCostMin: { type: Type.NUMBER },
                    estimatedRepairCostMax: { type: Type.NUMBER },
                    estimatedReplacementCostMin: { type: Type.NUMBER },
                    estimatedReplacementCostMax: { type: Type.NUMBER },
                    potentialSavingsMin: { type: Type.NUMBER },
                    potentialSavingsMax: { type: Type.NUMBER },
                    sparePartsAvailability: { type: Type.STRING, description: 'Readily Available, Special Order, Scarce, or Not Required / Unlikely' },
                    expectedLifeExtensionYears: { type: Type.NUMBER },
                    carbonAvoidedKg: { type: Type.NUMBER },
                    wasteDivertedKg: { type: Type.NUMBER },
                    financialAssessmentText: { type: Type.STRING },
                  },
                  required: [
                    'verdict',
                    'verdictTitle',
                    'summary',
                    'estimatedRepairCostMin',
                    'estimatedRepairCostMax',
                    'estimatedReplacementCostMin',
                    'estimatedReplacementCostMax',
                    'potentialSavingsMin',
                    'potentialSavingsMax',
                    'sparePartsAvailability',
                    'expectedLifeExtensionYears',
                    'carbonAvoidedKg',
                    'wasteDivertedKg',
                    'financialAssessmentText',
                  ],
                },
                recommendedNextAction: {
                  type: Type.OBJECT,
                  properties: {
                    action: { type: Type.STRING, description: 'Basic troubleshooting, Professional inspection, Repair, Find spare part, Consider replacement, or Recycle responsibly' },
                    badgeColor: { type: Type.STRING, description: 'blue, emerald, amber, or purple' },
                    headline: { type: Type.STRING },
                    reasonWhy: { type: Type.STRING, description: 'Clear rationale why this specific next step is recommended' },
                    secondaryOption: { type: Type.STRING },
                  },
                  required: ['action', 'badgeColor', 'headline', 'reasonWhy'],
                },
                suggestedSpareParts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      partNumberSnippet: { type: Type.STRING },
                      estimatedPriceMin: { type: Type.NUMBER },
                      estimatedPriceMax: { type: Type.NUMBER },
                      availability: { type: Type.STRING },
                      sellerSource: { type: Type.STRING },
                      compatibilityConfidence: { type: Type.INTEGER },
                      compatibilityNote: { type: Type.STRING },
                      purpose: { type: Type.STRING },
                    },
                    required: ['name', 'estimatedPriceMin', 'estimatedPriceMax', 'compatibilityConfidence', 'purpose'],
                  },
                },
              },
              required: [
                'possibleProblem',
                'confidence',
                'severity',
                'summary',
                'visibleSymptoms',
                'possibleCauses',
                'safeTroubleshooting',
                'whenToStopAndCallPro',
                'repairWorthiness',
                'recommendedNextAction',
              ],
            },
          },
        }),
        22000,
        'Gemini diagnostic generation timed out'
      );

      const rawJson = response.text?.trim() || '{}';
      const parsedData = JSON.parse(rawJson);

      // Enhance with id and metadata
      const diagnosisResult = {
        id: `DIAG-${Date.now()}`,
        createdAt: new Date().toISOString(),
        itemName,
        modelNumber: modelNumber || undefined,
        category,
        userProblemDescription: problemDescription,
        userSymptoms: Array.isArray(symptoms) ? symptoms : [symptoms].filter(Boolean),
        itemAgeYears,
        originalCost,
        imageUrl: imageBase64 ? imageBase64 : undefined,
        ...parsedData,
        suggestedSpareParts: (parsedData.suggestedSpareParts || []).map((part: any, idx: number) => ({
          id: `gen-part-${Date.now()}-${idx}`,
          category,
          compatibleWith: `${itemName} compatible variants`,
          currency: '₹',
          rating: 4.8,
          reviewsCount: 45 + idx * 22,
          imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
          ...part,
        })),
      };

      res.json({
        success: true,
        source: 'gemini_3.7_flash',
        data: diagnosisResult,
      });
    } catch (err: any) {
      console.error('Gemini Diagnose API Error:', err);
      // Fall back to robust local diagnostic calculation rather than failing the user experience
      const { itemName, modelNumber, category, problemDescription, symptoms, itemAgeYears, originalCost } = req.body;
      const fallbackData = generateLocalDiagnosis(
        itemName || 'Generic Item',
        modelNumber,
        category || 'other',
        problemDescription || '',
        symptoms || [],
        itemAgeYears || 3,
        originalCost || 10000
      );

      res.json({
        success: true,
        source: 'fallback_engine',
        note: 'Calculated using RepairConnect Rule Engine (Live AI temporarily rate-limited or unavailable)',
        data: fallbackData,
      });
    }
  });

  // AI Chat Advisor for interactive questions
  app.post('/api/chat-advisor', async (req, res) => {
    try {
      const { message, diagnosisContext, chatHistory = [] } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          reply: `For **${diagnosisContext?.itemName || 'your item'}**, safety comes first! Make sure power/fuel is disconnected before attempting any physical inspection. If you notice any electrical burning odors, component looseness, or liquid leaks, we strongly recommend booking a qualified local repair technician.`,
        });
      }

      const systemPrompt = `
You are the "RepairConnect AI Assistant", a friendly, highly knowledgeable, and safety-first repair and circular economy advisor for RepairConnect.

YOUR CORE RESPONSIBILITIES:
1. Explain AI diagnostic assessments in clear, jargon-free language.
2. Provide safe, non-destructive troubleshooting steps (e.g. power isolation, visual inspection, external cleaning, debris clearing, checking connections).
3. Evaluate repair-worthiness comparing repair cost vs replacement cost and environmental longevity.
4. Recommend the right repair category (e.g. Appliance Repair, Electronics, Bicycle, Furniture, Mobile, Computer, Electrician, Plumber) and explain technician estimates.
5. Guide users through spare-part compatibility, booking a technician, tracking an active repair, or finding recycling/e-waste centers.
6. Provide "Proactive Maintenance Tips": Suggest structured preventive care schedules (weekly/monthly/annual routines, descaling, lint filter cleaning, capacitor thermal relief, lubrication, battery cycle health, torque audits) tailored to the specific item category to prevent future issues and extend product lifespan.

SAFETY & RESPONSIBLE AI DIRECTIVES (STRICT MANDATE):
- Always identify your responses as AI-assisted guidance — never claim to be an in-person licensed master engineer or give definitive guarantee.
- NEVER provide hazardous instructions:
  * NO live high-voltage (>50V AC/DC) electrical testing.
  * NO natural gas or propane line disassembly.
  * NO microwave high-voltage capacitor discharging.
  * NO swollen/punctured lithium-ion battery opening.
  * NO high-tension garage spring or pressurized vessel dismantling.
- Whenever an issue involves electrical burning odors, arcing sparks, water/moisture inside electrical circuits, or structural failure, explicitly urge the user to STOP and connect with a certified technician.

ACTIVE USER DIAGNOSIS CONTEXT:
${diagnosisContext ? JSON.stringify({
  itemName: diagnosisContext.itemName,
  category: diagnosisContext.category,
  problemDescription: diagnosisContext.userProblemDescription,
  diagnosedIssue: diagnosisContext.possibleProblem,
  confidence: diagnosisContext.confidence,
  severity: diagnosisContext.severity,
  summary: diagnosisContext.summary,
  possibleCauses: diagnosisContext.possibleCauses,
  repairWorthiness: diagnosisContext.repairWorthiness,
  recommendedNextAction: diagnosisContext.recommendedNextAction,
  whenToStopAndCallPro: diagnosisContext.whenToStopAndCallPro,
  suggestedSpareParts: diagnosisContext.suggestedSpareParts,
}, null, 2) : 'No diagnosis completed yet by user.'}
`;

      const contents: Array<any> = chatHistory.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text || m.content || '' }],
      }));

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents,
          config: {
            systemInstruction: systemPrompt,
          },
        }),
        15000,
        'Chat advisor generation timed out'
      );

      res.json({
        reply: response.text || 'I could not process that question. Please try asking again.',
      });
    } catch (err: any) {
      console.error('Chat Advisor Error:', err);
      res.json({
        reply:
          'Safety notice: Always disconnect power and inspect exterior fasteners first. For complex component replacements, please consult a verified technician on RepairConnect.',
      });
    }
  });

  // Google Maps Grounded Local Search for Real Places
  app.post('/api/maps-search-pros', async (req, res) => {
    try {
      const { query, location, category } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: true,
          source: 'local_directory',
          message: 'Using verified local database',
          places: [],
        });
      }

      const searchQuery = `Find the best rated ${category || 'repair'} shops and technicians near ${location || 'current location'}. Query: ${query || 'repair services'}. Include shop name, address, rating, and specialties.`;

      // Use gemini-2.5-flash with Google Maps tool grounding
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: searchQuery,
          config: {
            tools: [{ googleMaps: {} }],
          },
        }),
        15000,
        'Maps search generation timed out'
      );

      const text = response.text || '';
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

      res.json({
        success: true,
        source: 'google_maps_grounding',
        overview: text,
        groundingMetadata,
      });
    } catch (err: any) {
      console.warn('Maps search API fallback:', err.message);
      res.json({
        success: true,
        source: 'local_directory',
        message: 'Loaded local professional catalog',
      });
    }
  });

  // Vite development / production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RepairConnect server running on http://localhost:${PORT}`);
  });
}

function generateLocalDiagnosis(
  itemName: string,
  modelNumber: string | undefined,
  category: string,
  problemDescription: string,
  symptoms: string[],
  itemAgeYears: number,
  originalCost: number
) {
  const estReplacement = Math.max(originalCost || 12000, 8000);
  const estRepairMin = Math.round(estReplacement * 0.12);
  const estRepairMax = Math.round(estReplacement * 0.28);
  const savingsMin = estReplacement - estRepairMax;
  const savingsMax = estReplacement - estRepairMin;

  return {
    id: `DIAG-LOCAL-${Date.now()}`,
    createdAt: new Date().toISOString(),
    itemName,
    modelNumber: modelNumber || undefined,
    category,
    userProblemDescription: problemDescription,
    userSymptoms: symptoms,
    itemAgeYears,
    originalCost,
    possibleProblem: `Probable mechanical or electrical component wear in ${itemName}`,
    confidence: 83,
    severity: 'medium',
    summary: `Analysis of "${problemDescription}" indicates component fatigue or alignment issue consistent with typical ${itemAgeYears}-year operating cycle.`,
    visibleSymptoms: symptoms.length > 0 ? symptoms : ['Operational irregularity reported', 'Acoustic / functional symptom observed'],
    possibleCauses: [
      {
        cause: 'Internal Component Wear or Friction Loss',
        probability: 'High probability',
        explanation: 'Primary moving part or contact point has reached fatigue threshold under regular cycle usage.',
      },
      {
        cause: 'Fastener Slack or Seal Degradation',
        probability: 'Medium probability',
        explanation: 'Vibration over operational lifespan has loosened internal bracket or degraded protective gasket.',
      },
      {
        cause: 'Minor Electrical / Connection Oxide',
        probability: 'Low probability',
        explanation: 'Terminal micro-corrosion or ribbon cable contact resistance.',
      },
    ],
    safetyAlert: 'Ensure unit is completely unpowered before conducting any surface inspection.',
    safeTroubleshooting: [
      {
        step: 1,
        title: 'Complete Power Isolation',
        instruction: 'Turn off appliance or device power switch and disconnect power cable completely.',
        caution: 'Never open internal chassis when connected to power.',
      },
      {
        step: 2,
        title: 'External Visual & Debris Inspection',
        instruction: 'Inspect ventilation grills, moving linkages, or exterior casing for obstructions or lint buildup.',
      },
      {
        step: 3,
        title: 'Reset & Mechanical Alignment Check',
        instruction: 'Check that the item sits on a level, firm surface and all accessible external thumb-screws are hand-tight.',
      },
    ],
    whenToStopAndCallPro: [
      'Burning smell, scorched discoloration, or spark sounds.',
      'Unit trips household circuit breaker immediately upon powering.',
      'Specialized puller tools or sealed internal chambers require opening.',
    ],
    repairWorthiness: {
      verdict: 'REPAIR',
      verdictTitle: 'Recommended: REPAIR',
      summary: 'Repair is highly economical compared to replacement and extends usable life significantly.',
      estimatedRepairCostMin: estRepairMin,
      estimatedRepairCostMax: estRepairMax,
      estimatedReplacementCostMin: estReplacement,
      estimatedReplacementCostMax: Math.round(estReplacement * 1.3),
      potentialSavingsMin: savingsMin,
      potentialSavingsMax: savingsMax,
      sparePartsAvailability: 'Readily Available',
      expectedLifeExtensionYears: 4.0,
      carbonAvoidedKg: 85,
      wasteDivertedKg: 18.5,
      financialAssessmentText: `Repairing saves up to ₹${savingsMax.toLocaleString()} compared to purchasing new. High environmental and monetary benefit.`,
    },
    recommendedNextAction: {
      action: 'Professional inspection',
      badgeColor: 'blue',
      headline: 'Best Next Step: Book a Professional Inspection',
      reasonWhy: 'A professional inspection will safely verify component tolerances and ensure durable repair.',
      secondaryOption: 'Try basic external cleaning and check for loose parts',
    },
    suggestedSpareParts: [
      {
        id: `part-gen-1`,
        name: `OEM Replacement Component Kit for ${itemName}`,
        category,
        compatibleWith: `Standard ${category} Models`,
        partNumberSnippet: 'OEM-SPEC-KIT',
        estimatedPriceMin: estRepairMin,
        estimatedPriceMax: Math.round(estRepairMin * 1.5),
        currency: '₹',
        availability: 'In Stock',
        sellerSource: 'Verified Parts Network',
        rating: 4.8,
        reviewsCount: 65,
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        compatibilityConfidence: 90,
        compatibilityNote: 'Match model number label before ordering.',
        purpose: 'Restores original operating tolerance and reliability.',
      },
    ],
  };
}

startServer();
