export type ItemCategory =
  | 'electronics'
  | 'home_appliances'
  | 'bicycles'
  | 'furniture'
  | 'computers_laptops'
  | 'mobile_phones'
  | 'kitchen_appliances'
  | 'electrician'
  | 'plumber'
  | 'other';

export interface CategoryInfo {
  id: ItemCategory;
  name: string;
  icon: string;
  description: string;
  averageRepairSavings: number; // in percentage e.g. 70
  typicalLifeExtensionYears: number;
}

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type ProbabilityLevel = 'High probability' | 'Medium probability' | 'Low probability';

export type RepairVerdict = 'REPAIR' | 'CONSIDER_REPLACEMENT' | 'RECYCLE_RESPONSIBLY' | 'SIMPLE_FIX';

export type RecommendedActionType =
  | 'Basic troubleshooting'
  | 'Professional inspection'
  | 'Repair'
  | 'Find spare part'
  | 'Consider replacement'
  | 'Recycle responsibly';

export interface PossibleCause {
  cause: string;
  probability: ProbabilityLevel;
  explanation: string;
}

export interface TroubleshootingStep {
  step: number;
  title: string;
  instruction: string;
  caution?: string;
  toolNeeded?: string;
}

export interface RepairWorthiness {
  verdict: RepairVerdict;
  verdictTitle: string;
  summary: string;
  estimatedRepairCostMin: number;
  estimatedRepairCostMax: number;
  estimatedReplacementCostMin: number;
  estimatedReplacementCostMax: number;
  potentialSavingsMin: number;
  potentialSavingsMax: number;
  sparePartsAvailability: 'Readily Available' | 'Special Order' | 'Scarce' | 'Not Required / Unlikely';
  expectedLifeExtensionYears: number;
  carbonAvoidedKg: number;
  wasteDivertedKg: number;
  financialAssessmentText: string;
}

export interface RecommendedNextAction {
  action: RecommendedActionType;
  badgeColor: string;
  headline: string;
  reasonWhy: string;
  secondaryOption?: string;
}

export interface SparePartItem {
  id: string;
  name: string;
  category: ItemCategory;
  compatibleWith: string;
  partNumberSnippet: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  currency: string;
  availability: 'In Stock' | '2-3 Days Delivery' | 'Special Order' | 'Limited Stock';
  sellerSource: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  compatibilityConfidence: number; // e.g. 92%
  compatibilityNote: string;
  purpose: string;
}

export interface ProactiveMaintenanceTip {
  id: string;
  category: ItemCategory;
  title: string;
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Bi-annually' | 'Annual' | 'As Needed';
  impact: 'High Impact' | 'Medium Impact' | 'Critical';
  lifeExtensionEstimate: string;
  description: string;
  actionChecklist: string[];
  commonFailuresPrevented: string[];
  toolsNeeded?: string[];
  proWarning?: string;
}

export interface DiagnosisResultData {
  id: string;
  createdAt: string;
  itemName: string;
  modelNumber?: string;
  brand?: string;
  category: ItemCategory;
  userProblemDescription: string;
  userSymptoms: string[];
  itemAgeYears?: number;
  originalCost?: number;
  imageUrl?: string;
  videoUrl?: string;
  
  // AI Findings
  possibleProblem: string;
  confidence: number; // 0-100
  severity: SeverityLevel;
  summary: string;
  visibleSymptoms: string[];
  possibleCauses: PossibleCause[];
  safetyAlert?: string;
  safeTroubleshooting: TroubleshootingStep[];
  whenToStopAndCallPro: string[];
  
  // Assessment & Next Action
  repairWorthiness: RepairWorthiness;
  recommendedNextAction: RecommendedNextAction;
  suggestedSpareParts: SparePartItem[];
  proactiveMaintenanceTips?: ProactiveMaintenanceTip[];
}

export interface RepairProfessional {
  id: string;
  name: string;
  businessName: string;
  avatarUrl: string;
  categories: ItemCategory[];
  distanceKm: number;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  isVerified: boolean;
  estimatedPriceRange: {
    min: number;
    max: number;
    currency: string;
  };
  availability: 'Today' | 'Tomorrow' | 'In 2 days' | 'Next week';
  servicesOffered: string[];
  warrantyDays: number;
  address: string;
  phone: string;
  email: string;
  bio: string;
  completedRepairsCount: number;
  averageCompletionHours: number;
  badges: string[];
}

export type RepairStatus =
  | 'request_submitted'
  | 'professional_accepted'
  | 'inspection_scheduled'
  | 'repair_in_progress'
  | 'repair_completed'
  | 'ready_for_reuse'
  | 'request_sent'
  | 'accepted'
  | 'in_progress'
  | 'repaired'
  | 'reused'
  | 'closed';

export interface RepairTimelineStep {
  status: RepairStatus | string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface RepairStatusHistory {
  status: RepairStatus;
  timestamp: string;
  note: string;
}

export interface RepairRequest {
  id: string;
  trackingNumber?: string;
  createdAt: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  serviceAddress?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  itemName: string;
  category: ItemCategory;
  problemDescription: string;
  diagnosisSummary: string;
  imageUrl?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  selectedProfessionalId?: string;
  professionalId?: string;
  professionalName?: string;
  professionalAvatar?: string;
  estimatedCost: number;
  finalCost?: number;
  currentStatus?: RepairStatus;
  status: RepairStatus;
  statusHistory?: RepairStatusHistory[];
  timeline: RepairTimelineStep[];
  repairNotes?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  userRating?: number;
  userReviewText?: string;
  warrantyDays?: number;
}

export interface CategoryBreakdownItem {
  categoryName: string;
  repairedCount: number;
  wasteSavedKg: number;
}

export interface SustainabilityStats {
  totalItemsRepaired: number;
  totalEwastePreventedKg: number;
  totalEwasteAvoidedKg?: number;
  totalCo2AvoidedKg: number;
  totalMoneySavedInr: number;
  totalLifeYearsExtended: number;
  userItemsRepaired?: number;
  userEwasteAvoidedKg?: number;
  userCo2AvoidedKg?: number;
  userMoneySavedInr?: number;
  categoryBreakdown: CategoryBreakdownItem[];
}

export interface SparePart {
  id: string;
  name: string;
  category: ItemCategory | string;
  compatibleModels: string[];
  price: number;
  inStock: boolean;
  isOem: boolean;
  compatibilityScore: number;
  difficultyToReplace: 'Easy' | 'Moderate' | 'Advanced' | 'Professional Recommended';
  estimatedDeliveryDays: string;
  imageUrl: string;
  guideUrl?: string;
  videoTutorialUrl?: string;
}

export interface DiyVideoChapter {
  time: string;
  title: string;
}

export interface DiyVideoTutorial {
  title: string;
  duration: string;
  youtubeEmbedUrl?: string;
  thumbnailUrl: string;
  channelName: string;
  viewsCount: string;
  chapters?: DiyVideoChapter[];
}

export interface DiyTutorialStep {
  stepNumber: number;
  title: string;
  instruction: string;
  proTip?: string;
  warning?: string;
  durationMinutes?: number;
  toolsUsed?: string[];
  imageUrl?: string;
}

export interface DiyRepairGuide {
  id: string;
  title: string;
  slug: string;
  category: ItemCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTimeMinutes: number;
  estimatedSavingsInr: number;
  successRate: number; // e.g. 95 for 95%
  summary: string;
  toolsRequired: string[];
  materialsOrParts: string[];
  steps: DiyTutorialStep[];
  videoTutorial: DiyVideoTutorial;
  safetyChecklist: string[];
  troubleshootingTips: string[];
  tags: string[];
  featured?: boolean;
  communityRating: number;
  reviewsCount: number;
}

export type ActiveTab =
  | 'home'
  | 'diagnose'
  | 'find_repairs'
  | 'compare_repairs'
  | 'spare_parts'
  | 'diy_library'
  | 'my_repairs'
  | 'sustainability'
  | 'user_dashboard'
  | 'pro_dashboard'
  | 'admin_dashboard';

export type UserRole = 'customer' | 'professional' | 'admin';
