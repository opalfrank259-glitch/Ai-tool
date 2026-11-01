export type Language = 'en' | 'ur-roman' | 'ur';
export type SkillLevel = 'beginner' | 'basic' | 'intermediate' | 'advanced';
export type AppName = 'photoshop' | 'photopea' | 'other';

export type ProjectMode = 'idea_to_final' | 'reference' | 'improve' | 'practice';
export type ProjectStatus =
  | 'draft'
  | 'brief_approved'
  | 'concept_approved'
  | 'blueprint_ready'
  | 'learning'
  | 'review'
  | 'delivered'
  | 'archived';

export interface BrandKit {
  id: string;
  name: string;
  colors: { name: string; hex: string }[];
  primaryFont: string;
  secondaryFont: string;
  tagline: string;
  contactNumber: string;
  address: string;
  rules: string[];
}

export interface UserProfile {
  id: string;
  displayName: string;
  role: 'user' | 'admin' | 'support';
  language: Language;
  skillLevel: SkillLevel;
  appName: AppName;
  appVersion: string;
  brandKit?: BrandKit;
}

export interface CreditTransaction {
  id: string;
  delta: number;
  reason: string;
  createdAt: string;
}

export interface ProjectBrief {
  facts: Record<string, string>;
  interpreted: {
    category: string;
    businessType: string;
    targetAudience: string;
    primaryGoal: string;
  };
  assumptions: string[];
  placeholders: string[];
  missingRequiredFacts: { key: string; question: string; questionUrdu: string }[];
  optionalPreferences: { key: string; question: string }[];
  deliverables: { kind: string; reason: string; isOptional: boolean; selected: boolean }[];
  approved: boolean;
  version: number;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ConceptDirection {
  id: string;
  title: string;
  oneLineIdea: string;
  mood: string;
  audienceFit: string;
  palette: ColorSwatch[];
  typographyDirection: string;
  layoutDirection: string;
  symbolTreatment: string;
  pros: string[];
  limitations: string[];
  placeholderWarnings: string[];
  previewSvgBg: string;
  approved: boolean;
  revisionNote?: string;
}

export interface CanvasSpec {
  widthPx: number;
  heightPx: number;
  dpi: number;
  unit: string;
  colorMode: string;
  presetName: string;
}

export interface Blueprint {
  id: string;
  projectId: string;
  canvas: CanvasSpec;
  contentChecklist: { item: string; value: string; confirmed: boolean }[];
  palette: ColorSwatch[];
  typographyHierarchy: { role: string; recommendedFont: string; fallback: string; sizePt: string; weight: string }[];
  layerGroups: { groupName: string; purpose: string; layers: string[] }[];
  toolSequence: string[];
  exportFormats: { format: string; settings: string; useCase: string }[];
}

export type StepStatus = 'todo' | 'in_progress' | 'submitted' | 'verified' | 'done' | 'skipped';

export interface LessonStep {
  id: string;
  position: number;
  title: string;
  titleUrdu?: string;
  objective: string;
  toolName: string;
  toolRecognition: string;
  shortcut: { windows: string; mac: string; verified: boolean };
  menuPath: string;
  menuFallback: string;
  whatItDoes: string;
  whyHere: string;
  actions: string[];
  settings: { name: string; value: string }[];
  expectedResult: string;
  commonMistakes: string[];
  practiceTask: string;
  verification: {
    method: VerificationMethod | 'preview' | 'screenshot' | 'editor' | 'user_confirm';
    criteria: string[];
    needsDimensionProof: boolean;
  };
  recovery: string;
  appDifferences?: { photoshop: string; photopea: string };
  sourceChunkIds: string[];
  status: StepStatus;
}

export type VerificationMethod =
  | 'editor_verified'
  | 'screenshot_reviewed'
  | 'preview_reviewed'
  | 'user_confirmed'
  | 'not_verified';

export interface VerificationResult {
  id: string;
  stepId: string;
  method: VerificationMethod;
  timestamp: string;
  clientMetrics?: {
    contrastRatio: number;
    contrastCompliant: boolean;
    aspectMatches: boolean;
    safeMarginsPassed: boolean;
    paletteAdherencePercent: number;
    sharpnessStatus: string;
  };
  passed: { check: string; evidence: string }[];
  failed: {
    check: string;
    where: string;
    why: string;
    severity: 'critical' | 'important' | 'polish';
    fix: string[];
  }[];
  unknown: { check: string; reason: string }[];
  subjectiveNotes: string[];
  needsNewSubmission: boolean;
  limitations: string;
}

export interface QAFinding {
  category: string;
  severity: 'critical' | 'important' | 'polish';
  kind: 'objective' | 'subjective';
  where: string;
  why: string;
  fix: string[];
}

export interface QAReview {
  id: string;
  projectId: string;
  summary: string;
  topFixes: string[];
  findings: QAFinding[];
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  mode: ProjectMode;
  status: ProjectStatus;
  appName: AppName;
  currentStepId: string;
  ideaText: string;
  brief?: ProjectBrief;
  concepts?: ConceptDirection[];
  approvedConceptId?: string;
  blueprint?: Blueprint;
  steps: LessonStep[];
  verifications: Record<string, VerificationResult>;
  qaReview?: QAReview;
  createdAt: string;
  updatedAt: string;
}

export interface ReferenceHotspot {
  id: string;
  label: string;
  box: { x: number; y: number; w: number; h: number }; // normalized percent 0-100
  role: string;
  techniques: string;
  typographyTraits: string;
  layerAdvice: string;
}

export interface ReferenceAnalysis {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  estimatedRatio: string;
  confidence: 'low' | 'medium' | 'high';
  palette: ColorSwatch[];
  hotspots: ReferenceHotspot[];
  hierarchyNotes: string;
  estimateNotice: string;
}

export interface PracticeAssignment {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
  objective: string;
  scenario: string;
  rubric: string[];
  hintLadder: {
    level: 'Nudge' | 'Partial' | 'Targeted' | 'Full Step' | 'Worked Example';
    hint: string;
  }[];
}
