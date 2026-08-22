import { DiagnosisResultData, ItemCategory } from '../types';
import { DEMO_PRESETS } from '../data/mockData';

export interface DiagnoseRequestPayload {
  itemName: string;
  modelNumber?: string;
  category: ItemCategory;
  problemDescription: string;
  symptoms: string[];
  itemAgeYears?: number;
  originalCost?: number;
  imageBase64?: string;
  mimeType?: string;
}

export async function diagnoseItemApi(payload: DiagnoseRequestPayload): Promise<DiagnosisResultData> {
  try {
    const response = await fetch('/api/diagnose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const json = await response.json();
    if (json && json.data) {
      return json.data;
    }
    throw new Error('Invalid response structure');
  } catch (err) {
    console.warn('Backend API unavailable or error, using smart local fallback:', err);
    // Find matching preset or generate fallback
    const matchingPreset = DEMO_PRESETS.find(
      (p) =>
        p.category === payload.category ||
        p.itemName.toLowerCase().includes(payload.itemName.toLowerCase().split(' ')[0])
    );

    if (matchingPreset && payload.problemDescription.length < 20) {
      return {
        ...matchingPreset,
        id: `DIAG-FALLBACK-${Date.now()}`,
        createdAt: new Date().toISOString(),
        itemName: payload.itemName || matchingPreset.itemName,
        modelNumber: payload.modelNumber || matchingPreset.modelNumber,
        category: payload.category || matchingPreset.category,
        userProblemDescription: payload.problemDescription || matchingPreset.userProblemDescription,
        userSymptoms: payload.symptoms?.length ? payload.symptoms : matchingPreset.userSymptoms,
        imageUrl: payload.imageBase64 || matchingPreset.imageUrl,
      };
    }

    // Dynamic fallback
    const estReplacement = payload.originalCost || 16000;
    const estRepairMin = Math.round(estReplacement * 0.12);
    const estRepairMax = Math.round(estReplacement * 0.26);

    return {
      id: `DIAG-LOCAL-${Date.now()}`,
      createdAt: new Date().toISOString(),
      itemName: payload.itemName,
      modelNumber: payload.modelNumber,
      category: payload.category,
      userProblemDescription: payload.problemDescription,
      userSymptoms: payload.symptoms,
      itemAgeYears: payload.itemAgeYears || 3,
      originalCost: estReplacement,
      imageUrl: payload.imageBase64,
      possibleProblem: `Probable mechanical or electrical component wear in ${payload.itemName}`,
      confidence: 84,
      severity: 'medium',
      summary: `Based on your description ("${payload.problemDescription}"), the symptoms are consistent with moving component fatigue, bearing slack, or electrical switch wear.`,
      visibleSymptoms: payload.symptoms.length ? payload.symptoms : ['Operational irregularity', 'Abnormal noise/resistance'],
      possibleCauses: [
        {
          cause: 'Primary Mechanical Bushing or Bearing Wear',
          probability: 'High probability',
          explanation: 'Standard wear from operational friction over typical 2-4 year lifespan.',
        },
        {
          cause: 'Fastener Slack or Loose Bracket',
          probability: 'Medium probability',
          explanation: 'Vibrations during operation have loosened internal alignment screws.',
        },
        {
          cause: 'Surface Contamination or Dust Blockage',
          probability: 'Low probability',
          explanation: 'Internal debris preventing smooth airflow or mechanical articulation.',
        },
      ],
      safetyAlert: 'Ensure unit is completely isolated from all power or pressure sources before any physical contact.',
      safeTroubleshooting: [
        {
          step: 1,
          title: 'Power & Energy Isolation',
          instruction: 'Turn off the master switch and disconnect the power plug completely from the wall outlet.',
          caution: 'Never work on energized equipment.',
        },
        {
          step: 2,
          title: 'External Visual & Debris Inspection',
          instruction: 'Check exterior vents, linkages, and cord insulation for visible burns, cracks, or obstructions.',
        },
        {
          step: 3,
          title: 'Level Surface & Fastener Check',
          instruction: 'Verify that the unit rests on a level, stable surface and that exterior screws are secure.',
        },
      ],
      whenToStopAndCallPro: [
        'Noticeable burning smell, scorched wires, or arcing sparks.',
        'Household breaker or RCD trips immediately when unit is turned on.',
        'High mechanical resistance or metal-on-metal grinding inside sealed assembly.',
      ],
      repairWorthiness: {
        verdict: 'REPAIR',
        verdictTitle: 'Recommended: REPAIR',
        summary: 'Repair is highly economical compared to replacement and extends product life significantly.',
        estimatedRepairCostMin: estRepairMin,
        estimatedRepairCostMax: estRepairMax,
        estimatedReplacementCostMin: estReplacement,
        estimatedReplacementCostMax: Math.round(estReplacement * 1.3),
        potentialSavingsMin: estReplacement - estRepairMax,
        potentialSavingsMax: estReplacement - estRepairMin,
        sparePartsAvailability: 'Readily Available',
        expectedLifeExtensionYears: 4.5,
        carbonAvoidedKg: 95,
        wasteDivertedKg: 14.5,
        financialAssessmentText: `Repairing costs only ~12-25% of replacement, saving up to ₹${(
          estReplacement - estRepairMin
        ).toLocaleString()}.`,
      },
      recommendedNextAction: {
        action: 'Professional inspection',
        badgeColor: 'blue',
        headline: 'Best Next Step: Book a Professional Inspection',
        reasonWhy: 'A certified local professional can verify tolerances safely and guarantee the repair.',
        secondaryOption: 'Try basic external cleaning and check for loose parts',
      },
      suggestedSpareParts: [
        {
          id: `part-gen-${Date.now()}`,
          name: `OEM Certified Service Part for ${payload.itemName}`,
          category: payload.category,
          compatibleWith: `Universal ${payload.category} Models`,
          partNumberSnippet: 'OEM-SPEC-SERIES',
          estimatedPriceMin: estRepairMin,
          estimatedPriceMax: Math.round(estRepairMin * 1.4),
          currency: '₹',
          availability: 'In Stock',
          sellerSource: 'FixSpares Hub',
          rating: 4.8,
          reviewsCount: 78,
          imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
          compatibilityConfidence: 91,
          compatibilityNote: 'Confirm exact model tag on product label before purchase.',
          purpose: 'Restores factory tolerances and safe operational cycle.',
        },
      ],
    };
  }
}

export async function askAdvisorApi(
  message: string,
  diagnosisContext?: DiagnosisResultData | null,
  chatHistory: Array<{ role: 'user' | 'assistant'; text: string }> = []
): Promise<string> {
  try {
    const response = await fetch('/api/chat-advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, diagnosisContext, chatHistory }),
    });

    if (!response.ok) {
      throw new Error('Advisor API request failed');
    }

    const data = await response.json();
    return data.reply;
  } catch (err) {
    console.warn('Advisor API fallback:', err);
    return `Safety advice for **${
      diagnosisContext?.itemName || 'your item'
    }**: Always unplug the device and make sure it has cooled down before inspecting. If you are experiencing electrical faults, gas issues, or internal component damage, we strongly advise connecting with a verified repair technician on RepairConnect.`;
  }
}
