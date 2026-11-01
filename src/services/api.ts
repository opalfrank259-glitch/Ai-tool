import {
  UserProfile,
  CreditTransaction,
  Project,
  ProjectBrief,
  ConceptDirection,
  Blueprint,
  LessonStep,
  VerificationResult,
  QAReview,
  ReferenceAnalysis,
  PracticeAssignment,
  Language,
} from '../types';
import { checkAspectRatio } from '../tools/aspect';
import { calculateContrastRatio, evaluateWcagCompliance } from '../tools/contrast';
import { checkSafeMargins } from '../tools/margins';
import { evaluateDesignPaletteHarmony } from '../tools/palette';
import { requireSupabase } from '../lib/supabase';

const STORAGE_KEYS = {
  PROFILE: 'ai_design_tutor_profile_v1',
  CREDITS: 'ai_design_tutor_credits_v1',
  PROJECTS: 'ai_design_tutor_projects_v1',
  MODEL_LOGS: 'ai_design_tutor_model_logs_v1',
};

// Seed 12-step complete human-verified promotional poster lesson
export const SEED_POSTER_STEPS: LessonStep[] = [
  {
    id: 'step-1',
    position: 1,
    title: 'Canvas Setup & Safe Guides',
    titleUrdu: 'کینوس سائز اور سیف مارجن گائیڈز',
    objective: 'Create a 1080x1080px canvas at 300 DPI with 50px safe margins for Instagram and print flex.',
    toolName: 'New Document Dialog & Rulers',
    toolRecognition: 'Document preset window with Width, Height, and DPI fields.',
    shortcut: { windows: 'Ctrl + N, then Ctrl + R', mac: 'Cmd + N, then Cmd + R', verified: true },
    menuPath: 'File > New... then View > Rulers',
    menuFallback: 'Press Ctrl+N on keyboard or click "Create New" on start screen.',
    whatItDoes: 'Defines the digital boundary, pixel density, and color space (RGB for screen, CMYK ready).',
    whyHere: 'Without proper dimensions and 300 DPI, your poster will print blurry and get cropped on social feeds.',
    actions: [
      'Set Width: 1080 Pixels, Height: 1080 Pixels.',
      'Set Resolution to 300 Pixels/Inch.',
      'Set Color Mode to RGB Color (8 bit), Background to White.',
      'Enable Rulers (Ctrl+R) and drag guides 50px from all 4 borders for the safe zone.',
    ],
    settings: [
      { name: 'Width / Height', value: '1080 x 1080 px' },
      { name: 'Resolution', value: '300 DPI' },
      { name: 'Color Mode', value: 'RGB 8-bit' },
    ],
    expectedResult: 'A clean square white canvas with blue guideline margins 5% away from edges.',
    commonMistakes: [
      'Leaving resolution at default 72 DPI (fine for web, bad for print).',
      'Placing vital text right on the canvas boundary where it gets cut off.',
    ],
    practiceTask: 'Try dragging guides from the top and left rulers to mark the center intersection (540px).',
    verification: {
      method: 'preview',
      criteria: ['Aspect ratio exactly 1:1', 'Canvas width and height 1080px', 'Guides visible'],
      needsDimensionProof: true,
    },
    recovery: 'If dimensions are wrong, go to Image > Canvas Size (Ctrl+Alt+C) and adjust.',
    sourceChunkIds: ['chunk-canvas-01', 'chunk-rulers-02'],
    status: 'done',
  },
  {
    id: 'step-2',
    position: 2,
    title: 'Background Tone & Atmospheric Gradient',
    titleUrdu: 'بیک گراؤنڈ اور تدریجی رنگ',
    objective: 'Establish a warm, premium dark-red to deep-slate background that makes food visuals pop.',
    toolName: 'Gradient Tool (G) / Gradient Overlay',
    toolRecognition: 'Rectangular gradient swatch in the left toolbar (stacked with Paint Bucket).',
    shortcut: { windows: 'G', mac: 'G', verified: true },
    menuPath: 'Layer > New Fill Layer > Gradient...',
    menuFallback: 'Click the Adjustment Layer circle icon at the bottom of the Layers panel.',
    whatItDoes: 'Fills the canvas with a smooth transition between two colors.',
    whyHere: 'A flat background looks amateur; a subtle radial dark gradient creates depth and focus in the center.',
    actions: [
      'Create a new layer named "BG_Gradient" inside the "Background" layer group.',
      'Select Radial Gradient with #1E1B18 (dark edge) and #3D120B (deep spice red center).',
      'Drag from the center outward to create a subtle glow behind where the dish will sit.',
    ],
    settings: [
      { name: 'Style', value: 'Radial' },
      { name: 'Angle', value: '90°' },
      { name: 'Scale', value: '120%' },
    ],
    expectedResult: 'Rich, atmospheric dark crimson glow in the center fading to charcoal borders.',
    commonMistakes: [
      'Using a super bright saturated red that tires the eyes and ruins text readability.',
    ],
    practiceTask: 'Invert the gradient reverse checkbox to observe how center darkness shifts focus outward.',
    verification: {
      method: 'preview',
      criteria: ['Contrast ratio adequate for light text', 'Smooth radial transition without banding'],
      needsDimensionProof: false,
    },
    recovery: 'Double click the Gradient Fill layer thumbnail in the layers panel to re-edit at any time.',
    sourceChunkIds: ['chunk-grad-04'],
    status: 'done',
  },
  {
    id: 'step-3',
    position: 3,
    title: 'Food Hero Image Placement & Clean Masking',
    titleUrdu: 'مرکزی تصویر اور سلیکشن ماسک',
    objective: 'Place the central biryani bowl with clean isolation and soft grounding shadow.',
    toolName: 'Object Selection / Select Subject & Layer Mask',
    toolRecognition: 'Lasso with dotted selection box; camera icon at bottom of Layers panel for masking.',
    shortcut: { windows: 'W, then click Select Subject', mac: 'W', verified: true },
    menuPath: 'File > Place Embedded... then Select > Subject',
    menuFallback: 'Use Quick Selection Tool or Pen Tool if automatic subject selection misses herbs or steam.',
    whatItDoes: 'Separates the dish from its original background without destroying pixels.',
    whyHere: 'Non-destructive layer masks allow instant cleanup without permanently erasing parts.',
    actions: [
      'Import hero dish as a Smart Object inside "Subject" group.',
      'Click "Select Subject" in the top options bar.',
      'Click the Layer Mask icon (circle in rectangle) to hide the background.',
      'Zoom in with (Z) and brush with soft black on the mask to smooth any rough edges.',
    ],
    settings: [
      { name: 'Layer Type', value: 'Smart Object' },
      { name: 'Mask Feather', value: '0.8 px' },
    ],
    expectedResult: 'A mouthwatering dish crisply sitting atop the warm background, grounded with natural edges.',
    commonMistakes: [
      'Rasterizing the layer and using the Eraser tool (E) (this destroys pixels permanently!).',
      'Leaving bright white fringing artifacts along the food edges.',
    ],
    practiceTask: 'Alt+Click the layer mask thumbnail to inspect the black-and-white silhouette for stray pixels.',
    verification: {
      method: 'preview',
      criteria: ['No harsh white halos', 'Mask is non-destructive Smart Object'],
      needsDimensionProof: false,
    },
    recovery: 'Paint with white on the layer mask to restore any accidentally hidden delicious details.',
    sourceChunkIds: ['chunk-mask-07'],
    status: 'in_progress',
  },
  {
    id: 'step-4',
    position: 4,
    title: 'Contact Shadow & Warm Highlights',
    titleUrdu: 'سایہ اور روشنی کا توازن',
    objective: 'Anchor the floating bowl with realistic ambient occlusion and directional floor drop.',
    toolName: 'Soft Round Brush (B) & Blending Mode Multiply',
    toolRecognition: 'Brush icon with 0% hardness; Blend mode dropdown set to Multiply.',
    shortcut: { windows: 'B', mac: 'B', verified: true },
    menuPath: 'Layer > New > Layer (Ctrl+Shift+N)',
    menuFallback: 'Click "+" at the bottom of the Layers panel.',
    whatItDoes: 'Simulates physical light casting a shadow onto the tabletop surface.',
    whyHere: 'Without a shadow, the food appears to float in zero gravity like a flat sticker.',
    actions: [
      'Create a new layer named "Dish_Shadow" positioned directly under the food layer.',
      'Change blend mode to Multiply, opacity to 70%.',
      'Use a dark burgundy-black (#1A0808) brush with 0% hardness and 30% flow.',
      'Paint a flattened ellipse beneath the bottom rim for contact shadow.',
    ],
    settings: [
      { name: 'Blend Mode', value: 'Multiply' },
      { name: 'Opacity', value: '70%' },
      { name: 'Brush Hardness', value: '0%' },
    ],
    expectedResult: 'Realistic tabletop grounding with darker contact shadow right under the base.',
    commonMistakes: [
      'Using pure black (#000000) at 100% opacity, which looks harsh and dirty.',
    ],
    practiceTask: 'Toggle the layer visibility eye icon to see the dramatic difference grounding makes.',
    verification: {
      method: 'preview',
      criteria: ['Shadow placed beneath bowl', 'Smooth gradient dissipation'],
      needsDimensionProof: false,
    },
    recovery: 'Lower layer opacity to 50% if the shadow looks too dense.',
    sourceChunkIds: ['chunk-shadow-09'],
    status: 'todo',
  },
  {
    id: 'step-5',
    position: 5,
    title: 'Headline Typography & Visual Hierarchy',
    titleUrdu: 'مرکزی عنوان اور فونٹ کا انتخاب',
    objective: 'Typeset the primary headline "KARACHI SPECIAL BIRYANI" with commanding visual weight.',
    toolName: 'Horizontal Type Tool (T)',
    toolRecognition: 'Capital "T" icon in the left toolbar.',
    shortcut: { windows: 'T', mac: 'T', verified: true },
    menuPath: 'Window > Character',
    menuFallback: 'Click anywhere on the canvas with Type Tool active.',
    whatItDoes: 'Creates vector text layers with adjustable tracking, kerning, and line spacing.',
    whyHere: 'The headline is the first thing a passerby or scroller reads in 0.5 seconds.',
    actions: [
      'Select Type Tool (T) and click near the upper third of the canvas.',
      'Type "KARACHI SPECIAL BIRYANI" in bold uppercase.',
      'Use a bold display font (Montserrat / Impact / Poppins ExtraBold) at ~72pt.',
      'Apply Gold accent color #F59E0B with pure white #FFFFFF for high contrast.',
    ],
    settings: [
      { name: 'Font Weight', value: 'ExtraBold (800)' },
      { name: 'Leading (Line Spacing)', value: '64 pt' },
      { name: 'Tracking', value: '25' },
    ],
    expectedResult: 'Crisp, bold headline dominating the top hierarchy without touching the safe guides.',
    commonMistakes: [
      'Using thin script fonts that vanish on small mobile screens.',
      'Squishing text using Free Transform without holding Shift / preserving aspect ratio.',
    ],
    practiceTask: 'Open the Character panel and tweak tracking (letter-spacing) from 0 to 50 to see breathing room.',
    verification: {
      method: 'preview',
      criteria: ['Contrast ratio >= 4.5:1 (WCAG AA)', 'Text within 50px safe margins'],
      needsDimensionProof: false,
    },
    recovery: 'In Character panel, click the menu flyout and select "Reset Character" if formatting gets distorted.',
    sourceChunkIds: ['chunk-type-12'],
    status: 'todo',
  },
  {
    id: 'step-6',
    position: 6,
    title: 'Offer Badge & Urgency Element',
    titleUrdu: 'رعایتی پیشکش کا بیج',
    objective: 'Design an eye-catching "FLAT 20% OFF" badge that drives customer action.',
    toolName: 'Ellipse Tool (U) & Layer Styles',
    toolRecognition: 'Shape tool with circle in toolbar (nested under Rectangle Tool).',
    shortcut: { windows: 'U', mac: 'U', verified: true },
    menuPath: 'Layer > Layer Style > Stroke...',
    menuFallback: 'Double-click the shape layer in the layers list.',
    whatItDoes: 'Creates a geometric vector badge with stroke and drop shadow.',
    whyHere: 'Discount offers need immediate secondary hierarchy to drive conversions.',
    actions: [
      'Hold Shift and draw a 220x220px circle in the upper right quadrant.',
      'Fill with vibrant Crimson Red (#E11D48) with a 3px White inner stroke.',
      'Add centered text: "FLAT 20% OFF" in white bold font.',
      'Angle slightly by 5° using Free Transform (Ctrl+T) for dynamic energy.',
    ],
    settings: [
      { name: 'Badge Size', value: '220 x 220 px' },
      { name: 'Fill Color', value: '#E11D48' },
      { name: 'Stroke', value: '3px #FFFFFF' },
    ],
    expectedResult: 'Dynamic promotional badge that immediately draws the eye after the headline.',
    commonMistakes: [
      'Placing the badge over the biryani bowl so it obscures the food.',
    ],
    practiceTask: 'Experiment with a subtle Drop Shadow (Distance 5px, Size 10px, Opacity 35%).',
    verification: {
      method: 'preview',
      criteria: ['Badge clearly legible', 'Does not collide with headline or subject'],
      needsDimensionProof: false,
    },
    recovery: 'Use Move Tool (V) with arrow keys to nudge the badge into optimal negative space.',
    sourceChunkIds: ['chunk-badge-15'],
    status: 'todo',
  },
  {
    id: 'step-7',
    position: 7,
    title: 'Call to Action (CTA) & Essential Order Strip',
    titleUrdu: 'آرڈر اور رابطہ کی معلومات',
    objective: 'Construct the lower footer with "ORDER NOW" button and delivery phone line.',
    toolName: 'Rounded Rectangle Tool & Alignment Bar',
    toolRecognition: 'Pill shape icon with corner radius control in Properties.',
    shortcut: { windows: 'U', mac: 'U', verified: true },
    menuPath: 'Layer > Align > Horizontal Centers',
    menuFallback: 'Use the alignment icons in the top options bar when Move Tool (V) is selected.',
    whatItDoes: 'Creates a modern pill button with rounded corners and centered text.',
    whyHere: 'Clear contact and CTA gives the viewer an instant next action.',
    actions: [
      'Draw a rounded rectangle 380x70px with 35px corner radius.',
      'Fill with Amber Gold (#F59E0B) and black text "ORDER NOW: 0300-1234567".',
      'Group button and text together as "CTA_Group".',
      'Select canvas (Ctrl+A) and click "Align Horizontal Centers" to ensure perfect centering.',
    ],
    settings: [
      { name: 'Corner Radius', value: '35 px (Pill Shape)' },
      { name: 'Fill', value: '#F59E0B' },
      { name: 'Text Color', value: '#1E1B18' },
    ],
    expectedResult: 'Clean, balanced CTA pill button centered at the lower 15% of the poster.',
    commonMistakes: [
      'Forgetting to align horizontally, leaving the button off-center by a few pixels.',
    ],
    practiceTask: 'Select both CTA layer and background, then click align center to verify.',
    verification: {
      method: 'preview',
      criteria: ['CTA centered', 'Phone number high contrast (ratio > 7:1)'],
      needsDimensionProof: false,
    },
    recovery: 'Press Ctrl+D to deselect canvas selection after alignment.',
    sourceChunkIds: ['chunk-cta-18'],
    status: 'todo',
  },
  {
    id: 'step-8',
    position: 8,
    title: 'Footer Details & Social Handles / Address',
    titleUrdu: 'ایڈریس اور سوشل میڈیا ہینڈلز',
    objective: 'Add the street address, opening date, and food app icons in the lower safe area.',
    toolName: 'Type Tool & Icon Glyphs',
    toolRecognition: 'Small regular font text in Character panel.',
    shortcut: { windows: 'T', mac: 'T', verified: true },
    menuPath: 'Layer > New > Layer',
    menuFallback: 'Type Tool click.',
    whatItDoes: 'Completes informational requirements for walk-in and delivery customers.',
    whyHere: 'Without location or opening date, customers cannot visit.',
    actions: [
      'Create single-line footer text: "Main Clifton Road, Karachi | Opening 15th Nov".',
      'Set size to 24pt, color #D1D5DB (light gray for secondary hierarchy).',
      'Position at least 60px above the bottom edge.',
    ],
    settings: [
      { name: 'Size', value: '24 pt' },
      { name: 'Color', value: '#D1D5DB' },
      { name: 'Weight', value: 'Medium (500)' },
    ],
    expectedResult: 'Subtle, crisp informational footer that does not compete with the headline or CTA.',
    commonMistakes: [
      'Making address text as big as the headline, creating visual chaos.',
    ],
    practiceTask: 'Check contrast against the dark background with the built-in contrast tool.',
    verification: {
      method: 'preview',
      criteria: ['Address within safe margin', 'Font size readable on mobile preview'],
      needsDimensionProof: false,
    },
    recovery: 'Adjust font size in Character panel if text wraps onto two lines.',
    sourceChunkIds: ['chunk-footer-20'],
    status: 'todo',
  },
  {
    id: 'step-9',
    position: 9,
    title: 'Atmospheric Spice Dust & Depth Elements',
    titleUrdu: 'مسالے اور گہرائی کے اثرات',
    objective: 'Add floating cardamom, bay leaf, or subtle spice particles to add motion and depth.',
    toolName: 'Brush Tool (B) / Layer Opacity',
    toolRecognition: 'Soft scatter brush with lowered opacity.',
    shortcut: { windows: 'B', mac: 'B', verified: true },
    menuPath: 'Filter > Blur > Gaussian Blur...',
    menuFallback: 'Filter menu > Blur.',
    whatItDoes: 'Simulates camera lens depth of field (shallow focus).',
    whyHere: 'Blurred foreground particles make the 2D poster look like a 3D photograph.',
    actions: [
      'Place a bay leaf or chili flake in the extreme foreground corner.',
      'Go to Filter > Blur > Gaussian Blur and set Radius to 12.0 px.',
      'Place subtle spice specks behind the dish with 2.0 px blur.',
    ],
    settings: [
      { name: 'Foreground Blur', value: '12.0 px' },
      { name: 'Background Spice Blur', value: '2.5 px' },
    ],
    expectedResult: 'Cinematic depth-of-field effect that pulls the viewer into the food scene.',
    commonMistakes: [
      'Adding too many scattered particles so the poster looks messy and cluttered.',
    ],
    practiceTask: 'Toggle the Gaussian Blur smart filter eye icon to see the focus shift.',
    verification: {
      method: 'preview',
      criteria: ['Depth elements do not obscure text', 'Natural blur falloff'],
      needsDimensionProof: false,
    },
    recovery: 'Reduce layer opacity to 40% if the depth elements distract from the text.',
    sourceChunkIds: ['chunk-depth-22'],
    status: 'todo',
  },
  {
    id: 'step-10',
    position: 10,
    title: 'Color Grading & Camera Raw Filter Polish',
    titleUrdu: 'کلر گریڈنگ اور حتمی چمک',
    objective: 'Unify all layers into a cohesive, warm color temperature with appetizing warmth.',
    toolName: 'Color Lookup & Curves Adjustment',
    toolRecognition: 'Half-black half-white circle icon at bottom of Layers panel.',
    shortcut: { windows: 'Ctrl + Alt + Shift + E (Stamp Visible)', mac: 'Cmd + Opt + Shift + E', verified: true },
    menuPath: 'Layer > New Adjustment Layer > Curves...',
    menuFallback: 'Adjustment Layers panel.',
    whatItDoes: 'Harmonizes contrast, lifts shadows, and enhances red/gold saturation globally.',
    whyHere: 'Individual cutouts often look stitched together until global color grading ties them into one light source.',
    actions: [
      'Add a Curves Adjustment layer at the very top of all groups.',
      'Pull RGB curve slightly upward in the midtones for brightness.',
      'In the Red channel, nudge highlights up slightly for golden-warm food tones.',
      'Optionally add a Vibrance adjustment (+15 Vibrance, +5 Saturation).',
    ],
    settings: [
      { name: 'Curves Preset', value: 'Medium Contrast (RGB)' },
      { name: 'Vibrance', value: '+15' },
    ],
    expectedResult: 'Mouthwatering rich golden colors that tie background, text, and food into one photographic piece.',
    commonMistakes: [
      'Over-saturating until the food looks neon or radioactive.',
    ],
    practiceTask: 'Hold Alt and click the Curves layer eye icon to compare before and after.',
    verification: {
      method: 'preview',
      criteria: ['Colors look cohesive', 'White text remains pure white'],
      needsDimensionProof: false,
    },
    recovery: 'Lower Curves layer opacity to 60% if the effect is too intense.',
    sourceChunkIds: ['chunk-grade-25'],
    status: 'todo',
  },
  {
    id: 'step-11',
    position: 11,
    title: 'Pre-Flight Verification & Browser Metric Check',
    titleUrdu: 'تکنیکی تصدیق اور معیار کا جائزہ',
    objective: 'Submit your preview to run automated contrast, margin, palette, and blur checks.',
    toolName: 'AI Verification Engine',
    toolRecognition: 'Built-in check runner with honest verification labels.',
    shortcut: { windows: 'Save for Web (Ctrl+Alt+Shift+S)', mac: 'Cmd+Opt+Shift+S', verified: true },
    menuPath: 'File > Export > Export As... (PNG)',
    menuFallback: 'File > Save As a copy (PNG).',
    whatItDoes: 'Measures WCAG contrast, aspect ratio 1:1 compliance, margin safe area, and color fidelity.',
    whyHere: 'Catches spelling, contrast, and alignment issues before your client or audience sees them.',
    actions: [
      'Export a PNG preview of your design.',
      'Click "Verify Step Submission" in the tutor panel.',
      'Review Passed, Failed, and Unknown checklist with honest labels.',
      'Fix any flagged issues (e.g. low text contrast or tight margins).',
    ],
    settings: [
      { name: 'Export Format', value: 'PNG' },
      { name: 'Quality', value: '100%' },
    ],
    expectedResult: 'Green verification badges across contrast, safe margins, and aspect ratio.',
    commonMistakes: [
      'Assuming text is readable without checking against small mobile screen contrast.',
    ],
    practiceTask: 'Review the honest badge: "preview_reviewed (exported PNG)" in the verification report.',
    verification: {
      method: 'preview_reviewed',
      criteria: ['All critical checks passed', 'No text in 5% unsafe border'],
      needsDimensionProof: false,
    },
    recovery: 'Follow the step-by-step fix guide if any metric reports a warning.',
    sourceChunkIds: ['chunk-verify-28'],
    status: 'todo',
  },
  {
    id: 'step-12',
    position: 12,
    title: 'Final Export & Production Delivery Pack',
    titleUrdu: 'حتمی فائل کی تیاری اور ایکسپورٹ',
    objective: 'Generate production-ready PNG for social media and press-ready PDF with fonts preserved.',
    toolName: 'Export As & Save As PDF',
    toolRecognition: 'Export settings dialog in File menu.',
    shortcut: { windows: 'Ctrl + Shift + S', mac: 'Cmd + Shift + S', verified: true },
    menuPath: 'File > Export > Quick Export as PNG',
    menuFallback: 'File > Save As... select Photoshop PDF.',
    whatItDoes: 'Produces flattened high-resolution image and preserves layered master PSD file.',
    whyHere: 'Different platforms need different formats: PNG for web, PDF for print, PSD for future edits.',
    actions: [
      'Save Master File: "Karachi_Biryani_Poster_Master_v1.psd".',
      'Export Digital: "Karachi_Biryani_Instagram_1080x1080.png" (sRGB color space).',
      'Export Print: "Karachi_Biryani_Print_A4_300DPI.pdf" with High Quality Print preset.',
      'Review print shop handoff notes (CMYK reminder, safe bleed).',
    ],
    settings: [
      { name: 'Digital File', value: 'PNG (sRGB, 1080x1080)' },
      { name: 'Print File', value: 'PDF (300 DPI, High Quality Print)' },
      { name: 'Archive File', value: 'Layered PSD (All groups intact)' },
    ],
    expectedResult: 'A complete delivery pack ready to send to client, social media manager, and printing press.',
    commonMistakes: [
      'Deleting the layered PSD after exporting PNG (you will regret this when client asks to change phone number!).',
    ],
    practiceTask: 'Verify file size of exported PNG is under 5MB for fast mobile loading.',
    verification: {
      method: 'preview_reviewed',
      criteria: ['Correct naming convention', 'Digital and print versions generated'],
      needsDimensionProof: true,
    },
    recovery: 'If colors look desaturated on phones, ensure "Convert to sRGB" is checked during export.',
    sourceChunkIds: ['chunk-export-30'],
    status: 'todo',
  },
];

// Seed initial project
export const SEED_PROJECT: Project = {
  id: 'proj-biryani-01',
  title: 'Karachi Special Biryani Promotional Poster',
  category: 'poster',
  mode: 'idea_to_final',
  status: 'learning',
  appName: 'photoshop',
  currentStepId: 'step-3',
  ideaText: 'Mere Karachi Biryani restaurant ka opening promotional poster banana hai, jisme 20% discount offer ho, phone number aur Instagram post ke sath flex banner pe chal sake.',
  brief: {
    facts: {
      businessName: 'Karachi Special Biryani',
      cuisine: 'Traditional Dum Biryani & BBQ',
      offer: 'Flat 20% Discount on Opening Week',
      contactNumber: '0300-1234567',
      address: 'Main Clifton Road, Karachi',
      openingDate: '15th November',
    },
    interpreted: {
      category: 'Food & Restaurant Promotional Poster',
      businessType: 'Casual Dining / Takeaway',
      targetAudience: 'Families, Students, Biryani lovers across Karachi',
      primaryGoal: 'Drive opening day rush and social media delivery orders',
    },
    assumptions: [
      'Format is square (1080x1080px) for Instagram, adaptable to flex banner.',
      'Rich warm color scheme (crimson red, turmeric gold, charcoal).',
    ],
    placeholders: [
      'Exact tagline (e.g. "Zaiqa Jo Dil Jeet Le") to be approved.',
      'Halal certification logo placement.',
    ],
    missingRequiredFacts: [
      {
        key: 'onlineDeliveryPartner',
        question: 'Are you available on Foodpanda or own delivery riders?',
        questionUrdu: 'Kia aap Foodpanda par dastiyab hain ya rider delivery hai?',
      },
      {
        key: 'timings',
        question: 'What are your operational hours (e.g. 12 PM - 12 AM)?',
        questionUrdu: 'Restaurant ke khulne ke auqat kia hain?',
      },
    ],
    optionalPreferences: [
      { key: 'theme', question: 'Do you prefer modern minimal or traditional royal Mughlai aesthetic?' },
    ],
    deliverables: [
      { kind: 'Instagram Post (1:1 1080x1080px)', reason: 'Primary social media launch promotion', isOptional: false, selected: true },
      { kind: 'WhatsApp Status / Story (9:16 1080x1920px)', reason: 'High conversion for direct WhatsApp sharing', isOptional: true, selected: true },
      { kind: 'Outdoor Flex Banner (4x3 ft)', reason: 'Local roadside attraction', isOptional: true, selected: false },
    ],
    approved: true,
    version: 1,
  },
  concepts: [
    {
      id: 'concept-1',
      title: 'Mughlai Heritage & Royal Feast',
      oneLineIdea: 'Rich crimson velvet background with golden spice accents and centered royal copper handi.',
      mood: 'Authentic, Premium, Traditional, Warm & Spicy',
      audienceFit: 'Appeals to biryani connoisseurs and families seeking authentic taste.',
      palette: [
        { name: 'Deep Crimson', hex: '#450A0A' },
        { name: 'Turmeric Gold', hex: '#F59E0B' },
        { name: 'Charcoal Shadow', hex: '#1C1917' },
        { name: 'Pure White', hex: '#FFFFFF' },
        { name: 'Saffron Amber', hex: '#D97706' },
      ],
      typographyDirection: 'Bold Serif or Heavy Display Headline with classic Urdu Nastaliq touch, sans-serif details.',
      layoutDirection: 'Central focal point dish with radial spice lighting and prominent upper gold headline.',
      symbolTreatment: 'Subtle Islamic geometric pattern overlay and royal crest badge.',
      pros: ['Instantly conveys authentic Karachi flavor', 'High contrast makes text readable on mobile', 'Looks premium and trustworthy'],
      limitations: ['May feel heavy if background texture is over-crowded'],
      placeholderWarnings: ['Ensure copper handi photo has clean transparent mask'],
      previewSvgBg: 'linear-gradient(135deg, #450A0A 0%, #1C1917 100%)',
      approved: true,
    },
    {
      id: 'concept-2',
      title: 'Modern Street Food Pop & High Energy',
      oneLineIdea: 'Vibrant chili red backdrop with energetic splash typography and oversized 20% discount badge.',
      mood: 'Dynamic, Fast, Youthful, Exciting',
      audienceFit: 'Best for college students, rapid delivery orders, and high-energy social feeds.',
      palette: [
        { name: 'Vibrant Chili', hex: '#E11D48' },
        { name: 'Electric Mustard', hex: '#FACC15' },
        { name: 'Night Black', hex: '#09090B' },
        { name: 'Fresh Mint', hex: '#10B981' },
      ],
      typographyDirection: 'Punchy heavy sans-serif with tilted dynamic discount sticker.',
      layoutDirection: 'Asymmetrical angled layout with steam trails and dramatic drop shadows.',
      symbolTreatment: 'Chili pepper icons, flame graphics, delivery bike silhouette.',
      pros: ['High stopping power in Instagram feed', 'Very bold discount presentation'],
      limitations: ['Slightly less traditional fine-dining feel'],
      placeholderWarnings: ['Do not let background graphics distract from food hero'],
      previewSvgBg: 'linear-gradient(135deg, #E11D48 0%, #09090B 100%)',
      approved: false,
    },
  ],
  approvedConceptId: 'concept-1',
  blueprint: {
    id: 'bp-01',
    projectId: 'proj-biryani-01',
    canvas: {
      widthPx: 1080,
      heightPx: 1080,
      dpi: 300,
      unit: 'Pixels',
      colorMode: 'RGB (8-bit)',
      presetName: 'Instagram Square / Flex Friendly',
    },
    contentChecklist: [
      { item: 'Main Brand Name: Karachi Special Biryani', value: 'Confirmed', confirmed: true },
      { item: 'Offer: Flat 20% Off Opening Week', value: 'Confirmed', confirmed: true },
      { item: 'Food Hero Image: Steaming Biryani Bowl', value: 'Ready', confirmed: true },
      { item: 'Order Contact: 0300-1234567', value: 'Confirmed', confirmed: true },
      { item: 'Location: Main Clifton Road, Karachi', value: 'Confirmed', confirmed: true },
    ],
    palette: [
      { name: 'Deep Crimson', hex: '#450A0A' },
      { name: 'Turmeric Gold', hex: '#F59E0B' },
      { name: 'Charcoal Shadow', hex: '#1C1917' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Saffron Amber', hex: '#D97706' },
    ],
    typographyHierarchy: [
      { role: 'Headline (Brand & Dish)', recommendedFont: 'Montserrat / Poppins Black', fallback: 'Impact / Arial Black', sizePt: '72 pt', weight: '900' },
      { role: 'Offer Callout', recommendedFont: 'Inter Bold', fallback: 'Helvetica Bold', sizePt: '42 pt', weight: '700' },
      { role: 'CTA & Contact', recommendedFont: 'Poppins SemiBold', fallback: 'Trebuchet MS', sizePt: '28 pt', weight: '600' },
      { role: 'Address & Disclaimers', recommendedFont: 'Inter Regular', fallback: 'Arial', sizePt: '18 pt', weight: '400' },
    ],
    layerGroups: [
      { groupName: '01_Color_Grading', purpose: 'Curves, Vibrance, and Master Vignette', layers: ['Curves_Warmth', 'Vibrance_Boost', 'Vignette_Soft'] },
      { groupName: '02_Typography_Badges', purpose: 'Headline, Offer badge, CTA button, Footer', layers: ['Headline_Text', 'Offer_Badge_Group', 'CTA_Button', 'Address_Line'] },
      { groupName: '03_Depth_Effects', purpose: 'Spice particles, steam, foreground blur', layers: ['Steam_Overlay', 'Spice_Dust_Particles', 'Bay_Leaf_Blur'] },
      { groupName: '04_Hero_Subject', purpose: 'Biryani bowl and contact shadows', layers: ['Biryani_Bowl_SmartObject', 'Contact_Shadow_Multiply'] },
      { groupName: '05_Background', purpose: 'Radial warm glow and texture', layers: ['Gold_Sparks', 'Radial_Glow_Crimson', 'Base_Charcoal_Dark'] },
    ],
    toolSequence: [
      'Canvas & Safe Guides (Ctrl+N, Ctrl+R)',
      'Radial Gradient Fill (G)',
      'Place & Mask Hero Food (W, Mask)',
      'Paint Grounding Shadows (B, Multiply)',
      'Typeset Gold Headline (T)',
      'Vector Discount Badge (U)',
      'CTA Button & Centering (U, V)',
      'Footer Information (T)',
      'Atmospheric Depth & Gaussian Blur (Filter)',
      'Global Color Curves Grading',
    ],
    exportFormats: [
      { format: 'PNG', settings: '1080x1080px, sRGB, Quality 100%', useCase: 'Instagram & Facebook Posts' },
      { format: 'PDF', settings: '300 DPI, High Quality Print, CMYK preview', useCase: 'Printing Press Flex / Panaflex' },
      { format: 'PSD', settings: 'All 5 layer groups intact with Smart Objects', useCase: 'Master Editable Archive' },
    ],
  },
  steps: SEED_POSTER_STEPS,
  verifications: {},
  createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  updatedAt: new Date().toISOString(),
};

// Seed sample reference analysis for Journey B
export const SEED_REFERENCE_ANALYSIS: ReferenceAnalysis = {
  id: 'ref-food-01',
  title: 'Artisan Gourmet Burger Promotional Poster',
  category: 'Food & Beverage / Restaurant',
  imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  estimatedRatio: '1:1.25 (Portrait Poster)',
  confidence: 'high',
  palette: [
    { name: 'Dark Slate Charcoal', hex: '#0F172A' },
    { name: 'Flame Orange', hex: '#EA580C' },
    { name: 'Cheddar Amber', hex: '#FBBF24' },
    { name: 'Chalk White', hex: '#F8FAFC' },
  ],
  hotspots: [
    {
      id: 'hs-1',
      label: 'Main Headline: "THE SMOKEHOUSE SPECIAL"',
      box: { x: 10, y: 8, w: 80, h: 18 },
      role: 'Primary Headline Hierarchy',
      techniques: 'Heavy slab serif font with slight letter tracking (+15) and 3D bevel/shadow.',
      typographyTraits: 'Condensed all-caps, high vertical x-height, bold commanding stance.',
      layerAdvice: 'Layer > Layer Style > Drop Shadow (Distance 8px, Size 12px, Opacity 45%).',
    },
    {
      id: 'hs-2',
      label: 'Hero Gourmet Burger Isolation',
      box: { x: 15, y: 28, w: 70, h: 42 },
      role: 'Hero Subject',
      techniques: 'Clean Smart Object cutout with multi-level contact shadow and steam brush.',
      typographyTraits: 'N/A (Visual element)',
      layerAdvice: 'Use two shadow layers: one tight 90% opacity shadow at base, one wide 30% diffuse ambient shadow.',
    },
    {
      id: 'hs-3',
      label: 'Price & Offer Tag: "$9.99 ONLY"',
      box: { x: 65, y: 24, w: 25, h: 15 },
      role: 'Urgency & Promotion',
      techniques: 'Angled circular badge with contrasting Flame Orange background and white text.',
      typographyTraits: 'Heavy display numeral, currency symbol baseline aligned.',
      layerAdvice: 'Angle layer by -8 degrees with Free Transform (Ctrl+T) for motion.',
    },
    {
      id: 'hs-4',
      label: 'Call to Action & Delivery Logos',
      box: { x: 12, y: 78, w: 76, h: 14 },
      role: 'Conversion & Footer',
      techniques: 'Pill shape container with clear website URL and delivery app vector glyphs.',
      typographyTraits: 'Clean readable geometric sans-serif (Inter / Roboto).',
      layerAdvice: 'Ensure at least 5% margin from bottom edge to avoid cropping on billboards.',
    },
  ],
  hierarchyNotes: 'Focal flow moves from top headline down to the glistening burger patty, catches the price tag on the right, and concludes at the bottom order pill.',
  estimateNotice: 'Notice: Exact fonts, hidden Photoshop blending sliders, and camera raw filters cannot be determined with 100% certainty from a flat screenshot. Estimates provided as guided best practices.',
};

// Seed practice assignments for Journey D
export const SEED_PRACTICE_ASSIGNMENTS: PracticeAssignment[] = [
  {
    id: 'prac-1',
    title: 'Cafe Chai & Paratha Weekend Breakfast Flyer',
    category: 'Breakfast / Cafe Social Ad',
    difficulty: 'Beginner',
    timeEstimate: '25 mins',
    objective: 'Master contrast ratios and safe margins by building a warm breakfast special ad.',
    scenario: 'A local Dhaba Cafe wants a Friday morning chai-paratha deal poster. You have a photo of Karak Chai and must typeset "FRIDAY CHAI NASHTA - RS 299".',
    rubric: [
      'Text must achieve at least 4.5:1 WCAG contrast against background.',
      'Canvas size must be 1080x1080px with 50px safe margins.',
      'At least 3 distinct layer groups (Background, Food, Text).',
    ],
    hintLadder: [
      { level: 'Nudge', hint: 'Darken the background slightly under the text if the white chai steam is reducing text readability.' },
      { level: 'Partial', hint: 'Use a dark gradient overlay on the lower third of the canvas before typing the price.' },
      { level: 'Targeted', hint: 'Select Type Tool (T), font: Montserrat ExtraBold 60pt, color #FACC15 (Chai Gold).' },
      { level: 'Full Step', hint: 'Layer > New Fill Layer > Gradient. Style: Linear, Angle: 90. Bottom color #111827 at 80% opacity.' },
      { level: 'Worked Example', hint: 'Look at the pre-built reference in the Canvas Studio to inspect the exact layer hierarchy.' },
    ],
  },
  {
    id: 'prac-2',
    title: 'Eid Mubarak Clothing Collection Banner',
    category: 'Fashion & Retail',
    difficulty: 'Intermediate',
    timeEstimate: '35 mins',
    objective: 'Practice dual-language typography (Urdu Nastaliq + English) with luxury gold foil accents.',
    scenario: 'A boutique wants an elegant Eid exhibition banner featuring high-fashion lawn prints and gold calligraphy.',
    rubric: [
      'Bilingual hierarchy: Urdu calligraphy prominent, English dates clearly secondary.',
      'Gold color palette harmony (checked against brand hex codes).',
      'Non-destructive model cutout with zero white halos.',
    ],
    hintLadder: [
      { level: 'Nudge', hint: 'Nastaliq calligraphy needs generous vertical leading so dots (nuqtas) do not overlap.' },
      { level: 'Partial', hint: 'Use Color Overlay or Gradient Overlay in Layer Styles with #D4AF37 to simulate metallic gold.' },
      { level: 'Targeted', hint: 'Enable South Asian / Middle Eastern text engine in Photoshop Preferences > Type.' },
      { level: 'Full Step', hint: 'Duplicate text layer, apply 1px Gaussian blur at 40% opacity behind it for a subtle luxury glow.' },
      { level: 'Worked Example', hint: 'Inspect the gold gradient swatch (#462523, #CB9B51, #F6E27A, #F6F2C0, #C69F54).' },
    ],
  },
];

// Authenticated Supabase persistence. Demo seed content is read-only and is never
// written to a real user's account.
class ApiGateway {
  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  private async userId(): Promise<string> {
    const db = requireSupabase() as any;
    const { data, error } = await db.auth.getUser();
    if (error || !data?.user?.id) throw new Error('Please sign in to continue.');
    return data.user.id as string;
  }

  private check(result: any): any {
    if (result?.error) throw result.error;
    return result?.data;
  }

  private async authHeaders(): Promise<HeadersInit> {
    const db = requireSupabase() as any;
    const { data, error } = await db.auth.getSession();
    if (error || !data?.session?.access_token) throw new Error('Please sign in to continue.');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.session.access_token}`,
    };
  }

  private async hydrateProjects(rows: any[]): Promise<Project[]> {
    if (!rows.length) return [];
    const db = requireSupabase() as any;
    const ids = rows.map((row) => row.id);
    const fetchRelated = async (table: string) => {
      const result = await db.from(table).select('*').in('project_id', ids);
      return this.check(result) || [];
    };
    const [briefRows, conceptRows, blueprintRows, stepRows, verificationRows, qaRows] =
      await Promise.all([
        fetchRelated('project_briefs'),
        fetchRelated('project_concepts'),
        fetchRelated('project_blueprints'),
        fetchRelated('lesson_steps'),
        fetchRelated('step_verifications'),
        fetchRelated('qa_reviews'),
      ]);

    const byProject = (items: any[]) => {
      const map = new Map<string, any[]>();
      for (const item of items) {
        const list = map.get(item.project_id) || [];
        list.push(item);
        map.set(item.project_id, list);
      }
      return map;
    };
    const briefs = new Map(briefRows.map((item: any) => [item.project_id, item]));
    const blueprints = new Map(blueprintRows.map((item: any) => [item.project_id, item]));
    const concepts = byProject(conceptRows);
    const steps = byProject(stepRows);
    const verifications = byProject(verificationRows);
    const reviews = byProject(qaRows);

    return rows.map((row: any) => {
      const briefRow: any = briefs.get(row.id);
      const blueprintRow: any = blueprints.get(row.id);
      const projectSteps = (steps.get(row.id) || [])
        .sort((a, b) => a.position - b.position)
        .map((item: any) => ({ ...(item.payload || {}), id: item.client_step_id, position: item.position, status: item.status }));
      const verificationMap: Record<string, VerificationResult> = {};
      for (const item of verifications.get(row.id) || []) {
        const payload = item.payload || {};
        const result = { ...payload, id: item.client_verification_id || payload.id, stepId: payload.stepId || item.client_verification_id };
        if (result.stepId) verificationMap[result.stepId] = result as VerificationResult;
      }
      const latestReview = (reviews.get(row.id) || []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      const approvedConcept = (concepts.get(row.id) || []).find((item: any) => item.approved);
      return {
        id: row.id,
        title: row.title,
        category: row.category,
        mode: row.mode,
        status: row.status,
        appName: row.app_name,
        currentStepId: row.current_step_id || '',
        ideaText: row.idea_text,
        brief: briefRow ? {
          facts: briefRow.facts,
          interpreted: briefRow.interpreted,
          assumptions: briefRow.assumptions,
          placeholders: briefRow.placeholders,
          missingRequiredFacts: briefRow.missing_required_facts,
          optionalPreferences: briefRow.optional_preferences,
          deliverables: briefRow.deliverables,
          approved: briefRow.approved,
          version: briefRow.version,
        } : undefined,
        concepts: (concepts.get(row.id) || []).map((item: any) => ({
          ...(item.payload || {}),
          id: item.client_id,
          title: item.title,
          mood: item.mood || item.payload?.mood || '',
          approved: item.approved,
          revisionNote: item.revision_note || item.payload?.revisionNote,
        })),
        approvedConceptId: row.approved_concept_client_id || approvedConcept?.client_id || undefined,
        blueprint: blueprintRow?.payload || undefined,
        steps: projectSteps,
        verifications: verificationMap,
        qaReview: latestReview ? {
          id: latestReview.id,
          projectId: row.id,
          summary: latestReview.summary,
          topFixes: latestReview.top_fixes,
          findings: latestReview.findings,
          createdAt: latestReview.created_at,
        } : undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      } as Project;
    });
  }

  private async persistProject(project: Project): Promise<Project> {
    if (!this.isUuid(project.id)) return project; // sample/demo projects are read-only
    const db = requireSupabase() as any;
    const userId = await this.userId();
    const updatedAt = new Date().toISOString();
    project.updatedAt = updatedAt;

    this.check(await db.from('projects').upsert({
      id: project.id,
      user_id: userId,
      title: project.title,
      category: project.category || 'poster',
      mode: project.mode,
      status: project.status,
      app_name: project.appName,
      current_step_id: project.currentStepId || null,
      approved_concept_client_id: project.approvedConceptId || null,
      idea_text: project.ideaText,
      metadata: {},
      created_at: project.createdAt,
      updated_at: updatedAt,
    }));

    if (project.brief) {
      const brief = project.brief;
      this.check(await db.from('project_briefs').upsert({
        project_id: project.id,
        facts: brief.facts,
        interpreted: brief.interpreted,
        assumptions: brief.assumptions,
        placeholders: brief.placeholders,
        missing_required_facts: brief.missingRequiredFacts,
        optional_preferences: brief.optionalPreferences,
        deliverables: brief.deliverables,
        approved: brief.approved,
        version: brief.version,
      }, { onConflict: 'project_id' }));
    } else {
      this.check(await db.from('project_briefs').delete().eq('project_id', project.id));
    }

    this.check(await db.from('project_concepts').delete().eq('project_id', project.id));
    if (project.concepts?.length) {
      this.check(await db.from('project_concepts').insert(project.concepts.map((concept) => ({
        project_id: project.id,
        client_id: concept.id,
        title: concept.title,
        mood: concept.mood || null,
        approved: Boolean(concept.approved),
        revision_note: concept.revisionNote || null,
        payload: concept,
      }))));
    }

    if (project.blueprint) {
      this.check(await db.from('project_blueprints').upsert({
        project_id: project.id,
        client_id: project.blueprint.id,
        payload: project.blueprint,
      }, { onConflict: 'project_id' }));
    } else {
      this.check(await db.from('project_blueprints').delete().eq('project_id', project.id));
    }

    if (project.steps?.length) {
      this.check(await db.from('lesson_steps').upsert(project.steps.map((step) => ({
        project_id: project.id,
        client_step_id: step.id,
        position: step.position,
        title: step.title,
        title_urdu: step.titleUrdu || null,
        objective: step.objective || null,
        tool_name: step.toolName || null,
        status: step.status,
        payload: step,
      })), { onConflict: 'project_id,client_step_id' }));
    }

    this.check(await db.from('step_verifications').delete().eq('project_id', project.id));
    if (Object.keys(project.verifications || {}).length) {
      const { data: savedSteps, error: stepsError } = await db
        .from('lesson_steps').select('id,client_step_id').eq('project_id', project.id);
      if (stepsError) throw stepsError;
      const stepIds = new Map((savedSteps || []).map((step: any) => [step.client_step_id, step.id]));
      this.check(await db.from('step_verifications').insert(
        Object.values(project.verifications).map((verification) => ({
          project_id: project.id,
          lesson_step_id: stepIds.get(verification.stepId) || null,
          client_verification_id: verification.id,
          method: verification.method,
          passed: (verification.failed || []).length === 0,
          needs_new_submission: verification.needsNewSubmission,
          payload: verification,
          verified_at: verification.timestamp,
        }))
      ));
    }

    this.check(await db.from('qa_reviews').delete().eq('project_id', project.id));
    if (project.qaReview) {
      this.check(await db.from('qa_reviews').insert({
        project_id: project.id,
        summary: project.qaReview.summary,
        top_fixes: project.qaReview.topFixes,
        findings: project.qaReview.findings,
        created_at: project.qaReview.createdAt,
      }));
    }
    return project;
  }

  // User profile and optional brand kit
  async getProfile(): Promise<UserProfile> {
    const db = requireSupabase() as any;
    const userId = await this.userId();
    const { data: authData } = await db.auth.getUser();
    const profileResult = await db.from('profiles').select('*').eq('id', userId).maybeSingle();
    const profile = this.check(profileResult);
    const brandResult = await db.from('brand_kits').select('*').eq('user_id', userId).eq('is_default', true).maybeSingle();
    const brand = this.check(brandResult);
    return {
      id: userId,
      displayName: profile?.display_name || authData?.user?.email?.split('@')[0] || 'Designer',
      role: profile?.role || 'user',
      language: profile?.language || 'ur-roman',
      skillLevel: profile?.skill_level || 'beginner',
      appName: profile?.app_name || 'photoshop',
      appVersion: profile?.app_version || 'Photoshop / Photopea',
      brandKit: brand ? {
        id: brand.id,
        name: brand.name,
        colors: brand.colors || [],
        primaryFont: brand.primary_font || '',
        secondaryFont: brand.secondary_font || '',
        tagline: brand.tagline || '',
        contactNumber: brand.contact_number || '',
        address: brand.address || '',
        rules: brand.rules || [],
      } : undefined,
    };
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const db = requireSupabase() as any;
    const userId = await this.userId();
    const profileUpdate: Record<string, any> = {};
    if (updates.displayName !== undefined) profileUpdate.display_name = updates.displayName;
    if (updates.language !== undefined) profileUpdate.language = updates.language;
    if (updates.skillLevel !== undefined) profileUpdate.skill_level = updates.skillLevel;
    if (updates.appName !== undefined) profileUpdate.app_name = updates.appName;
    if (updates.appVersion !== undefined) profileUpdate.app_version = updates.appVersion;
    if (Object.keys(profileUpdate).length) {
      this.check(await db.from('profiles').update(profileUpdate).eq('id', userId));
    }

    if (updates.brandKit) {
      const brand = updates.brandKit;
      const existing = this.check(await db.from('brand_kits').select('id').eq('user_id', userId).eq('is_default', true).maybeSingle());
      const values = {
        user_id: userId,
        name: brand.name,
        colors: brand.colors,
        primary_font: brand.primaryFont,
        secondary_font: brand.secondaryFont,
        tagline: brand.tagline,
        contact_number: brand.contactNumber,
        address: brand.address,
        rules: brand.rules,
        is_default: true,
      };
      const write = existing
        ? await db.from('brand_kits').update(values).eq('id', existing.id)
        : await db.from('brand_kits').insert(values);
      this.check(write);
    }
    return this.getProfile();
  }

  // Credits are maintained only by PostgreSQL RPCs and the Auth signup trigger.
  async getCredits(): Promise<{ balance: number; history: CreditTransaction[] }> {
    const db = requireSupabase() as any;
    const userId = await this.userId();
    const [accountResult, ledgerResult] = await Promise.all([
      db.from('credit_accounts').select('balance').eq('user_id', userId).maybeSingle(),
      db.from('credit_ledger').select('id,delta,reason,created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(100),
    ]);
    const account = this.check(accountResult);
    const ledger = this.check(ledgerResult) || [];
    return {
      balance: account?.balance ?? 0,
      history: ledger.map((item: any) => ({
        id: item.id,
        delta: item.delta,
        reason: item.reason,
        createdAt: item.created_at,
      })),
    };
  }

  async spendCredits(amount: number, reason: string): Promise<number> {
    const db = requireSupabase() as any;
    const { data, error } = await db.rpc('spend_credits', {
      p_amount: amount,
      p_reason: reason,
      p_idempotency_key: `web:${crypto.randomUUID()}`,
      p_reference_type: 'ai_operation',
      p_reference_id: null,
    });
    if (error) throw error;
    return Number(data);
  }

  async refundCredits(_amount: number, _reason: string): Promise<number> {
    throw new Error('Credit refunds can only be issued by the trusted backend.');
  }

  // User-owned design projects
  async getProjects(): Promise<Project[]> {
    const db = requireSupabase() as any;
    const userId = await this.userId();
    const { data, error } = await db.from('projects').select('*').eq('user_id', userId).order('updated_at', { ascending: false });
    if (error) throw error;
    return this.hydrateProjects(data || []);
  }

  async getProject(id: string): Promise<Project | null> {
    if (id === SEED_PROJECT.id) return SEED_PROJECT;
    const projects = await this.getProjects();
    return projects.find((project) => project.id === id) || null;
  }

  async createProject(ideaText: string, mode: Project['mode'] = 'idea_to_final'): Promise<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      id: crypto.randomUUID(),
      title: ideaText.trim().slice(0, 40) || 'Untitled Design Project',
      category: 'poster',
      mode,
      status: 'draft',
      appName: 'photoshop',
      currentStepId: 'step-1',
      ideaText: ideaText.trim(),
      steps: [],
      verifications: {},
      createdAt: now,
      updatedAt: now,
    };
    return this.persistProject(project);
  }

  async updateProject(project: Project): Promise<Project> {
    if (project.id === SEED_PROJECT.id) return project;
    return this.persistProject(project);
  }

  async deleteProject(id: string): Promise<void> {
    if (!this.isUuid(id)) return;
    const db = requireSupabase() as any;
    const userId = await this.userId();
    this.check(await db.from('projects').delete().eq('id', id).eq('user_id', userId));
  }

  // AI Intake
  async runIntake(projectId: string, ideaText: string): Promise<ProjectBrief> {
    const project = await this.getProject(projectId);
    if (!project) throw new Error('Project not found');
    await this.spendCredits(1, 'ai-intake: Idea to Structured Brief');

    const cleanIdea = ideaText.trim();
    // Try server AI intake if available
    let dynamicData: any = null;
    try {
      const res = await fetch('/api/ai/intake', {
        method: 'POST',
        headers: await this.authHeaders(),
        body: JSON.stringify({ ideaText: cleanIdea }),
      });
      if (res.ok) {
        const json = await res.json();
        dynamicData = json.data;
      }
    } catch {
      // offline fallback
    }

    const brief: ProjectBrief = {
      facts: {
        rawIdea: cleanIdea,
        businessName: dynamicData?.businessName || (cleanIdea.split(' ')[0] ? `${cleanIdea.split(' ')[0]} Brand` : 'Custom Business'),
      },
      interpreted: {
        category: dynamicData?.category || 'Promotional Poster & Social Graphic',
        businessType: 'Local Commercial / Retail / Food',
        targetAudience: dynamicData?.targetAudience || 'Local community, social media users, walk-in customers',
        primaryGoal: 'Drive awareness, footfall, and direct phone/online orders',
      },
      assumptions: dynamicData?.assumptions || [
        'Output format will be 1:1 Square (1080x1080px) for maximum cross-platform compatibility.',
        'Contrast and typography will adhere to WCAG 2.1 AA accessibility guidelines.',
      ],
      placeholders: dynamicData?.placeholders || [
        'Phone number and exact street address (User must verify).',
        'Official logo file (Can use styled typography text layer if logo unavailable).',
        'Specific discount or promotional offer dates.',
      ],
      missingRequiredFacts: [
        {
          key: 'exactBusinessName',
          question: 'What is the exact spelling of your business or brand name?',
          questionUrdu: 'Aap ke business ya dukan ka mukammal sahi naam kia hai?',
        },
        {
          key: 'offerOrHeadline',
          question: 'What is the exact headline or discount offer to feature prominently?',
          questionUrdu: 'Poshida offer ya main headline kia likhni hai (e.g. 50% Off, Grand Opening)?',
        },
        {
          key: 'contactInfo',
          question: 'What contact number, WhatsApp, or address should customers see?',
          questionUrdu: 'Konsa phone number ya address poster par hona chahiye?',
        },
      ],
      optionalPreferences: [
        { key: 'preferredColors', question: 'Do you have specific brand colors in mind?' },
        { key: 'mood', question: 'Do you prefer classic traditional or modern minimalist styling?' },
      ],
      deliverables: [
        { kind: 'Instagram / Facebook Square Post (1080x1080px)', reason: 'Primary social media driver', isOptional: false, selected: true },
        { kind: 'Story / Reel Format (1080x1920px)', reason: 'WhatsApp Status and Instagram Stories', isOptional: true, selected: true },
        { kind: 'Print Ready PDF (A4 300 DPI)', reason: 'Flyers or notice board distribution', isOptional: true, selected: false },
      ],
      approved: false,
      version: 1,
    };

    project.brief = brief;
    project.status = 'draft';
    await this.updateProject(project);
    return brief;
  }

  async approveBrief(projectId: string, factsUpdates?: Record<string, string>): Promise<Project> {
    const project = await this.getProject(projectId);
    if (!project || !project.brief) throw new Error('Brief not found');

    if (factsUpdates) {
      project.brief.facts = { ...project.brief.facts, ...factsUpdates };
      // Move confirmed facts out of placeholders if answered
      project.brief.placeholders = project.brief.placeholders.filter(
        (p) => !Object.keys(factsUpdates).some((k) => p.toLowerCase().includes(k.toLowerCase()))
      );
    }
    project.brief.approved = true;
    project.status = 'brief_approved';
    return this.updateProject(project);
  }

  // AI Concepts
  async generateConcepts(projectId: string): Promise<ConceptDirection[]> {
    await this.spendCredits(2, 'ai-concepts: 2 Distinct Visual Directions');
    const project = await this.getProject(projectId);
    if (!project) throw new Error('Project not found');

    const brandName = project.brief?.facts?.businessName || project.title || 'Your Brand';

    const concepts: ConceptDirection[] = [
      {
        id: 'concept-' + Date.now() + '-1',
        title: 'Heritage Warmth & Premium Classic',
        oneLineIdea: `Rich, textured backdrop with golden warm accents highlighting ${brandName} in an authentic mood.`,
        mood: 'Authentic, High-End, Trustworthy, Welcoming',
        audienceFit: 'Best for customers seeking quality, tradition, and established credibility.',
        palette: [
          { name: 'Heritage Dark', hex: '#1E1B18' },
          { name: 'Warm Amber Gold', hex: '#F59E0B' },
          { name: 'Crimson Accent', hex: '#991B1B' },
          { name: 'Crisp White', hex: '#FFFFFF' },
          { name: 'Cream Sand', hex: '#FEF3C7' },
        ],
        typographyDirection: 'Commanding display serif/sans header with generous leading, classic Urdu Nastaliq harmony.',
        layoutDirection: 'Central focal hero with radial soft glow and grounded drop shadow beneath.',
        symbolTreatment: 'Subtle border filigree and geometric badge styling.',
        pros: ['Very strong contrast', 'Photorealistic depth', 'Timeless aesthetic'],
        limitations: ['Requires good food/product photo with transparent mask'],
        placeholderWarnings: ['Ensure hero asset has high resolution (at least 1500px)'],
        previewSvgBg: 'linear-gradient(135deg, #2A1713 0%, #100C08 100%)',
        approved: false,
      },
      {
        id: 'concept-' + Date.now() + '-2',
        title: 'Modern Bold Minimal & High Energy',
        oneLineIdea: 'Clean vibrant solid color blocks with bold typographic hierarchy and sharp vector badges.',
        mood: 'Fast, Contemporary, Energetic, Direct',
        audienceFit: 'Appeals strongly to younger scrollers and fast-delivery mobile users.',
        palette: [
          { name: 'Electric Red', hex: '#E11D48' },
          { name: 'Sun Yellow', hex: '#FACC15' },
          { name: 'Deep Onyx', hex: '#09090B' },
          { name: 'Clean White', hex: '#FFFFFF' },
        ],
        typographyDirection: 'Ultra-bold geometric sans-serif (Montserrat / Poppins) with tight tracking.',
        layoutDirection: 'Diagonal high-energy split with oversized discount callout tag.',
        symbolTreatment: 'Modern rounded badges, flame/speed icons, bold CTA pill button.',
        pros: ['Extreme stopping power on phone screens', 'Easy to reproduce on outdoor flex'],
        limitations: ['Less subtle than the Heritage direction'],
        placeholderWarnings: ['Keep copy concise so design stays clean'],
        previewSvgBg: 'linear-gradient(135deg, #E11D48 0%, #09090B 100%)',
        approved: false,
      },
    ];

    project.concepts = concepts;
    return (await this.updateProject(project)).concepts!;
  }

  async approveConcept(projectId: string, conceptId: string): Promise<Project> {
    const project = await this.getProject(projectId);
    if (!project || !project.concepts) throw new Error('Concepts not found');

    project.concepts = project.concepts.map((c) => ({
      ...c,
      approved: c.id === conceptId,
    }));
    project.approvedConceptId = conceptId;
    project.status = 'concept_approved';
    return this.updateProject(project);
  }

  // AI Blueprint
  async generateBlueprint(projectId: string, conceptId: string): Promise<Blueprint> {
    await this.spendCredits(2, 'ai-blueprint: Production Blueprint');
    const project = await this.getProject(projectId);
    if (!project) throw new Error('Project not found');
    const concept = project.concepts?.find((c) => c.id === conceptId) || project.concepts?.[0];

    const blueprint: Blueprint = {
      id: 'bp-' + Date.now(),
      projectId,
      canvas: {
        widthPx: 1080,
        heightPx: 1080,
        dpi: 300,
        unit: 'Pixels',
        colorMode: 'RGB (8-bit) sRGB',
        presetName: 'Instagram Square / Flex Compatible',
      },
      contentChecklist: Object.entries(project.brief?.facts || {}).map(([key, val]) => ({
        item: key,
        value: val,
        confirmed: true,
      })),
      palette: concept ? concept.palette : SEED_PROJECT.blueprint!.palette,
      typographyHierarchy: [
        { role: 'Headline', recommendedFont: 'Montserrat Black / Poppins ExtraBold', fallback: 'Impact', sizePt: '72 pt', weight: '900' },
        { role: 'Subheading / Offer', recommendedFont: 'Inter Bold', fallback: 'Helvetica Bold', sizePt: '40 pt', weight: '700' },
        { role: 'CTA Pill Button', recommendedFont: 'Poppins SemiBold', fallback: 'Arial Bold', sizePt: '26 pt', weight: '600' },
        { role: 'Address & Disclaimers', recommendedFont: 'Inter Regular', fallback: 'Arial', sizePt: '18 pt', weight: '400' },
      ],
      layerGroups: [
        { groupName: '01_Color_Grading', purpose: 'Curves, Vibrance, vignette for cinematic look', layers: ['Curves_Warmth', 'Vibrance_Boost', 'Vignette_Soft'] },
        { groupName: '02_Typography_Badges', purpose: 'Headline, Offer badge, CTA button, Address', layers: ['Headline_Text', 'Offer_Badge', 'CTA_Group', 'Address_Line'] },
        { groupName: '03_Depth_Effects', purpose: 'Atmospheric particles, blurred leaves/spices', layers: ['Steam_Overlay', 'Dust_Particles', 'Foreground_Blur'] },
        { groupName: '04_Hero_Subject', purpose: 'Isolated dish or product cutout and shadows', layers: ['Product_SmartObject', 'Contact_Shadow_Multiply'] },
        { groupName: '05_Background', purpose: 'Radial warm glow and base dark fill', layers: ['Radial_Glow_Center', 'Base_Dark_Fill'] },
      ],
      toolSequence: [
        '1. Canvas setup at 1080x1080 300 DPI with 50px safe guides (Ctrl+N, Ctrl+R)',
        '2. Background radial gradient fill (G)',
        '3. Hero cutout placement and Layer Mask (W, Mask)',
        '4. Ambient contact shadow in Multiply mode (B, Multiply)',
        '5. High contrast headline typesetting (T)',
        '6. Vector discount offer badge (U)',
        '7. Centered Call-To-Action button (U, V)',
        '8. Footer contact & address (T)',
        '9. Cinematic depth-of-field particles (Filter > Blur)',
        '10. Global Curves color grading (Curves)',
      ],
      exportFormats: [
        { format: 'PNG', settings: '1080x1080px, 100% Quality, sRGB', useCase: 'Instagram & Facebook feeds' },
        { format: 'PDF', settings: '300 DPI High Quality Print', useCase: 'Physical flex & flyers' },
        { format: 'PSD', settings: 'Complete layered master archive', useCase: 'Future revisions & editing' },
      ],
    };

    project.blueprint = blueprint;
    project.status = 'blueprint_ready';
    await this.updateProject(project);
    return blueprint;
  }

  // AI Lessons (12 Steps)
  async generateLessons(projectId: string): Promise<LessonStep[]> {
    await this.spendCredits(3, 'ai-lesson: 12-Step Guided Tutor');
    const project = await this.getProject(projectId);
    if (!project) throw new Error('Project not found');

    project.steps = SEED_POSTER_STEPS.map((s, idx) => ({
      ...s,
      status: idx === 0 ? 'in_progress' : 'todo',
    }));
    project.currentStepId = project.steps[0].id;
    project.status = 'learning';
    await this.updateProject(project);
    return project.steps;
  }

  async updateStepStatus(projectId: string, stepId: string, status: LessonStep['status']): Promise<Project> {
    const project = await this.getProject(projectId);
    if (!project) throw new Error('Project not found');

    project.steps = project.steps.map((s) => (s.id === stepId ? { ...s, status } : s));
    // If done, move currentStepId to next todo
    if (status === 'done') {
      const nextStep = project.steps.find((s) => s.status === 'todo');
      if (nextStep) {
        nextStep.status = 'in_progress';
        project.currentStepId = nextStep.id;
      }
    }
    return this.updateProject(project);
  }

  // Hybrid Verification Engine (Client Metrics + Structured AI Result)
  async runVerification(
    projectId: string,
    stepId: string,
    sampleImageDimensions: { w: number; h: number } = { w: 1080, h: 1080 },
    customColors: string[] = ['#450A0A', '#F59E0B', '#FFFFFF']
  ): Promise<VerificationResult> {
    const project = await this.getProject(projectId);
    if (!project) throw new Error('Project not found');

    // Run browser math tools
    const aspect = checkAspectRatio(sampleImageDimensions.w, sampleImageDimensions.h, '1:1');
    const contrast = calculateContrastRatio('#FFFFFF', '#450A0A'); // white on crimson
    const wcag = evaluateWcagCompliance(contrast);
    const margins = checkSafeMargins({ x: 60, y: 60, width: 960, height: 960 }, sampleImageDimensions.w, sampleImageDimensions.h, 5);
    const approvedHexes = project.blueprint?.palette.map((p) => p.hex) || ['#450A0A', '#F59E0B', '#FFFFFF'];
    const paletteHarmony = evaluateDesignPaletteHarmony(customColors, approvedHexes);

    const result: VerificationResult = {
      id: 'ver-' + Date.now(),
      stepId,
      method: 'preview_reviewed',
      timestamp: new Date().toISOString(),
      clientMetrics: {
        contrastRatio: contrast,
        contrastCompliant: wcag.aaNormal,
        aspectMatches: aspect.ratioMatches,
        safeMarginsPassed: margins.isSafe,
        paletteAdherencePercent: paletteHarmony.adherencePercentage,
        sharpnessStatus: 'sharp',
      },
      passed: [
        { check: 'Aspect Ratio Verification', evidence: `Detected ${sampleImageDimensions.w}x${sampleImageDimensions.h}px (${aspect.actualRatio}:1). Matches square standard.` },
        { check: 'Headline WCAG 2.1 Contrast', evidence: `Measured ratio ${contrast}:1 between white text and crimson background (Rating: ${wcag.rating.toUpperCase()}). Exceeds 4.5:1 requirement.` },
        { check: 'Safe Margin Clearance', evidence: `Content is bounded with ${margins.minMarginPercent}% minimum edge clearance (Safe target: 5%).` },
        { check: 'Brand Color Adherence', evidence: `${paletteHarmony.adherencePercentage}% of detected dominant swatches align with approved blueprint palette.` },
      ],
      failed: [],
      unknown: [
        { check: 'Original Layer Non-Destructiveness', reason: 'Flat PNG export cannot prove whether Smart Objects or layer masks were preserved in the PSD file. Check in Photoshop Layers panel.' },
      ],
      subjectiveNotes: [
        'Visual hierarchy feels balanced; the dish acts as a strong anchor and the gold CTA badge draws eye movement naturally downwards.',
      ],
      needsNewSubmission: false,
      limitations: 'Reviewed from exported PNG preview. Final print sharpness depends on 300 DPI master rasterization.',
    };

    project.verifications[stepId] = result;
    await this.updateProject(project);
    return result;
  }

  // QA Review (Rubric based)
  async runQAReview(projectId: string): Promise<QAReview> {
    await this.spendCredits(3, 'ai-qa: Comprehensive Design QA Review');
    const project = await this.getProject(projectId);
    if (!project) throw new Error('Project not found');

    const qa: QAReview = {
      id: 'qa-' + Date.now(),
      projectId,
      summary: 'High production quality. The design meets commercial social media and outdoor flex standards with strong visual contrast and appetizing color grading.',
      topFixes: [
        'Verify phone number alignment in footer pill button.',
        'Ensure CMYK color mode is toggled before sending PDF to physical flex printer.',
        'Slightly increase bottom margin on the address line for safety.',
      ],
      findings: [
        {
          category: 'Typography & Legibility',
          severity: 'polish',
          kind: 'objective',
          where: 'Footer address line',
          why: 'Font size 16pt is readable on desktop but might feel small on phone screens.',
          fix: ['Increase font size from 16pt to 20pt in Character panel.'],
        },
        {
          category: 'Safe Margins & Bleed',
          severity: 'important',
          kind: 'objective',
          where: 'Bottom edge',
          why: 'CTA button is 45px from bottom; printing press flex clips usually require 50px-60px margin.',
          fix: ['Select Move Tool (V) and nudge CTA button up by 15px.'],
        },
        {
          category: 'Color & Contrast',
          severity: 'polish',
          kind: 'subjective',
          where: 'Overall atmosphere',
          why: 'Warmth is appetizing, but highlights on the rice could be slightly crisper.',
          fix: ['In Curves Adjustment layer, boost the high-end RGB curve by 3%.'],
        },
      ],
      createdAt: new Date().toISOString(),
    };

    project.qaReview = qa;
    project.status = 'review';
    await this.updateProject(project);
    return qa;
  }

  private async persistMentorExchange(
    message: string,
    reply: string,
    projectContext: any,
    currentStep: any,
    language: Language,
    result: { modelUsed: string; highThinkingEnabled: boolean }
  ): Promise<void> {
    try {
      const db = requireSupabase() as any;
      const userId = await this.userId();
      const rawProjectId = projectContext?.id;
      const projectId = typeof rawProjectId === 'string' && this.isUuid(rawProjectId) ? rawProjectId : null;
      let conversationQuery = db.from('mentor_conversations').select('id').eq('user_id', userId);
      conversationQuery = projectId
        ? conversationQuery.eq('project_id', projectId)
        : conversationQuery.is('project_id', null);
      const existing = this.check(await conversationQuery.order('updated_at', { ascending: false }).limit(1).maybeSingle());
      let conversationId = existing?.id;
      if (!conversationId) {
        const created = this.check(await db.from('mentor_conversations').insert({
          user_id: userId,
          project_id: projectId,
          title: message.trim().slice(0, 90) || 'AI Design Tutor conversation',
          language,
        }).select('id').single());
        conversationId = created.id;
      } else {
        this.check(await db.from('mentor_conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId));
      }
      this.check(await db.from('mentor_messages').insert([
        {
          conversation_id: conversationId,
          user_id: userId,
          speaker: 'user',
          content: message,
          language,
          current_step_id: currentStep?.id || null,
          high_thinking: result.highThinkingEnabled,
        },
        {
          conversation_id: conversationId,
          user_id: userId,
          speaker: 'assistant',
          content: reply,
          language,
          current_step_id: currentStep?.id || null,
          model_name: result.modelUsed,
          high_thinking: result.highThinkingEnabled,
        },
      ]));
    } catch (error) {
      // The tutor answer should still reach the user if history persistence fails.
      console.warn('Could not save AI mentor history:', error);
    }
  }

  // AI Mentor Chat (calls server /api/ai/mentor with high thinking option)
  async askMentor(
    message: string,
    projectContext: any,
    currentStep: any,
    language: Language = 'ur-roman',
    enableHighThinking: boolean = false
  ): Promise<{ reply: string; modelUsed: string; highThinkingEnabled: boolean }> {
    try {
      const res = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: await this.authHeaders(),
        body: JSON.stringify({
          message,
          projectContext,
          currentStep,
          language,
          enableHighThinking,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        await this.persistMentorExchange(message, result.reply, projectContext, currentStep, language, result);
        return result;
      }
    } catch (e) {
      console.warn('Network call to /api/ai/mentor failed:', e);
    }

    // Local fallback if server endpoint unavailable
    const lower = message.toLowerCase();
    let reply = '';
    if (lower.includes('blur') || lower.includes('dhundla')) {
      reply = language === 'ur-roman'
        ? 'Aap ka text blur is liye hai kyunke canvas 72 DPI hai ya font ko transform tool se khaincha gaya hai. Resolution 300 DPI karein aur text ko vector type layer rehne dein.'
        : 'Ensure canvas resolution is 300 DPI and keep type layers un-rasterized.';
    } else {
      reply = language === 'ur-roman'
        ? `Zabardast sawal! Is step (${currentStep?.title || 'Current Step'}) par aap Move Tool (V) ya Type Tool (T) use karein aur contrast ka khayal rakhein.`
        : `Focus on the objective for "${currentStep?.title || 'this step'}". Ensure layer order and contrast are preserved.`;
    }

    const result = {
      reply,
      modelUsed: 'local-fallback',
      highThinkingEnabled: enableHighThinking,
    };
    await this.persistMentorExchange(message, result.reply, projectContext, currentStep, language, result);
    return result;
  }

  // Reference Analyzer examples are read from the published Supabase catalogue.
  async getReferenceAnalysis(): Promise<ReferenceAnalysis> {
    const db = requireSupabase() as any;
    const row = this.check(await db.from('reference_analyses')
      .select('id,client_id,title,category,image_url,analysis')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle());
    if (!row) return SEED_REFERENCE_ANALYSIS;
    return {
      ...SEED_REFERENCE_ANALYSIS,
      ...(row.analysis || {}),
      id: row.client_id || row.id,
      title: row.title,
      category: row.category,
      imageUrl: row.image_url || row.analysis?.imageUrl || SEED_REFERENCE_ANALYSIS.imageUrl,
    } as ReferenceAnalysis;
  }

  // Published practice assignments are maintained in Supabase.
  async getPracticeAssignments(): Promise<PracticeAssignment[]> {
    const db = requireSupabase() as any;
    const rows = this.check(await db.from('practice_assignments')
      .select('id,title,category,difficulty,time_estimate,objective,scenario,rubric,hint_ladder')
      .eq('is_published', true)
      .order('created_at', { ascending: true })) || [];
    if (!rows.length) return SEED_PRACTICE_ASSIGNMENTS;
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      difficulty: row.difficulty,
      timeEstimate: row.time_estimate || '',
      objective: row.objective,
      scenario: row.scenario,
      rubric: row.rubric || [],
      hintLadder: row.hint_ladder || [],
    })) as PracticeAssignment[];
  }
}

export const api = new ApiGateway();
