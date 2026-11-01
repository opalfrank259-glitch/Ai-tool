import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    newProject: string;
    referenceAnalyzer: string;
    practice: string;
    admin: string;
    settings: string;
    credits: string;
  };
  stages: {
    brief: string;
    concepts: string;
    blueprint: string;
    learn: string;
    review: string;
    delivery: string;
  };
  dashboard: {
    welcome: string;
    subtitle: string;
    startNew: string;
    myProjects: string;
    noProjects: string;
    resume: string;
    created: string;
    status: string;
  };
  brief: {
    title: string;
    subtitle: string;
    ideaInputPlaceholder: string;
    submitIdea: string;
    analyzing: string;
    confirmedFacts: string;
    placeholders: string;
    assumptions: string;
    essentialQuestions: string;
    approveBrief: string;
    approvedNotice: string;
    generateConcepts: string;
  };
  concepts: {
    title: string;
    subtitle: string;
    disclaimer: string;
    pros: string;
    limitations: string;
    approve: string;
    approved: string;
    proceedToBlueprint: string;
    reviseWithNote: string;
  };
  blueprint: {
    title: string;
    subtitle: string;
    canvasSpecs: string;
    contentChecklist: string;
    palette: string;
    typography: string;
    layerPlan: string;
    startLearning: string;
  };
  learn: {
    stepsChecklist: string;
    interactiveCanvas: string;
    instructions: string;
    mentor: string;
    whatItDoes: string;
    whyUsedHere: string;
    actions: string;
    expectedResult: string;
    commonMistakes: string;
    practiceTask: string;
    verificationCriteria: string;
    previous: string;
    next: string;
    markDone: string;
    verifyStep: string;
    explainSimpler: string;
    stepMismatch: string;
    thinkingMode: string;
    askMentorPlaceholder: string;
    send: string;
  };
  review: {
    title: string;
    subtitle: string;
    findingsTitle: string;
    critical: string;
    important: string;
    polish: string;
    objective: string;
    subjective: string;
    fixGuide: string;
    proceedToDelivery: string;
  };
  delivery: {
    title: string;
    subtitle: string;
    exportGuide: string;
    printNotes: string;
    downloadSummary: string;
    checklistComplete: string;
    backToDashboard: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'AI Design Tutor & Creator',
    tagline: 'Guided design learning & production for Photoshop & Photopea',
    nav: {
      dashboard: 'Dashboard',
      newProject: 'New Project',
      referenceAnalyzer: 'Reference Analyzer',
      practice: 'Practice Challenges',
      admin: 'Admin & Cost Logs',
      settings: 'Settings',
      credits: 'Credits',
    },
    stages: {
      brief: '1. Brief',
      concepts: '2. Concepts',
      blueprint: '3. Blueprint',
      learn: '4. Learn & Build',
      review: '5. QA Review',
      delivery: '6. Delivery',
    },
    dashboard: {
      welcome: 'Welcome to your Design Workshop',
      subtitle: 'Learn Photoshop & Photopea step-by-step with real design projects.',
      startNew: 'Start New Project',
      myProjects: 'Recent Projects',
      noProjects: 'No active projects yet. Start with your design idea!',
      resume: 'Resume Project',
      created: 'Created',
      status: 'Status',
    },
    brief: {
      title: 'Project Brief Builder',
      subtitle: 'Turn a rough idea into a structured, verified design specification without inventing facts.',
      ideaInputPlaceholder: 'e.g. Biryani House opening poster with 20% discount offer for Instagram and flex print...',
      submitIdea: 'Generate Structured Brief',
      analyzing: 'AI is analyzing requirements & identifying essential questions...',
      confirmedFacts: 'Confirmed Facts',
      placeholders: 'Placeholders (Needs User Confirmation)',
      assumptions: 'Design Assumptions',
      essentialQuestions: 'Essential Missing Details (Answer to refine)',
      approveBrief: 'Approve Brief & Proceed',
      approvedNotice: 'Brief Approved! Ready for visual concept generation.',
      generateConcepts: 'Generate 2-3 Visual Concepts (Cost: 2 Credits)',
    },
    concepts: {
      title: 'Concept Gallery',
      subtitle: 'Explore distinct visual directions before touching Photoshop.',
      disclaimer: 'Concept preview — not a final file / not a real photo. Final artwork will be built in layers.',
      pros: 'Advantages',
      limitations: 'Limitations & Caveats',
      approve: 'Select & Approve Direction',
      approved: 'Direction Approved',
      proceedToBlueprint: 'Generate Production Blueprint (Cost: 2 Credits)',
      reviseWithNote: 'Request Revision Note',
    },
    blueprint: {
      title: 'Production Blueprint',
      subtitle: 'Technical canvas setup, layer architecture, and color hierarchy.',
      canvasSpecs: 'Canvas Specifications',
      contentChecklist: 'Content & Copy Checklist',
      palette: 'Approved Brand Palette',
      typography: 'Typography Hierarchy & Roles',
      layerPlan: 'Layer Group Architecture',
      startLearning: 'Generate & Start 12-Step Tutor (Cost: 3 Credits)',
    },
    learn: {
      stepsChecklist: 'Lesson Steps',
      interactiveCanvas: 'Canvas & Layer Studio',
      instructions: 'Step Instructions',
      mentor: 'AI Design Mentor',
      whatItDoes: 'What This Tool Does',
      whyUsedHere: 'Why It Is Used Here',
      actions: 'Ordered Actions',
      expectedResult: 'Expected Result',
      commonMistakes: 'Common Mistakes to Avoid',
      practiceTask: 'Practice Mini-Task',
      verificationCriteria: 'Verification & Recovery',
      previous: 'Previous Step',
      next: 'Next Step',
      markDone: 'Mark as Completed',
      verifyStep: 'Verify Step Submission',
      explainSimpler: 'Explain Simpler (Roman Urdu)',
      stepMismatch: 'Step Didn\'t Match My Screen',
      thinkingMode: 'Enable High Thinking Mode',
      askMentorPlaceholder: 'Ask your AI tutor anything about tools, shortcuts, or design theory...',
      send: 'Ask',
    },
    review: {
      title: 'Design QA & Rubric Review',
      subtitle: 'Objective criteria and subjective aesthetic evaluation.',
      findingsTitle: 'Inspection Findings (Separated by Severity)',
      critical: 'Critical Fixes',
      important: 'Important Improvements',
      polish: 'Aesthetic Polish',
      objective: 'Objective (Technical)',
      subjective: 'Subjective (Aesthetic)',
      fixGuide: 'Step-by-Step Fix Guide',
      proceedToDelivery: 'Proceed to Export & Delivery',
    },
    delivery: {
      title: 'Export & Delivery Guide',
      subtitle: 'Production-ready file preparation for digital platforms and print shops.',
      exportGuide: 'Export Format Matrix',
      printNotes: 'Print Shop Handoff Checklist',
      downloadSummary: 'Download Project Summary (JSON)',
      checklistComplete: 'All Milestones Completed Successfully!',
      backToDashboard: 'Return to Dashboard',
    },
  },
  'ur-roman': {
    appName: 'AI Design Ustaad & Creator',
    tagline: 'Photoshop aur Photopea seekhein aur banayein step-by-step',
    nav: {
      dashboard: 'Dashboard',
      newProject: 'Naya Project',
      referenceAnalyzer: 'Reference Analyzer',
      practice: 'Practice Challenges',
      admin: 'Admin & Cost Logs',
      settings: 'Settings',
      credits: 'Credits',
    },
    stages: {
      brief: '1. Brief',
      concepts: '2. Concepts',
      blueprint: '3. Blueprint',
      learn: '4. Seekhein & Banayein',
      review: '5. QA Review',
      delivery: '6. Delivery & Export',
    },
    dashboard: {
      welcome: 'Aap ki Design Workshop me Khushamdeed',
      subtitle: 'Photoshop aur Photopea step-by-step seekhein mukammal poster project ke sath.',
      startNew: 'Naya Project Shuru Karein',
      myProjects: 'Haal hi ke Projects',
      noProjects: 'Abhi koi project nahi hai. Apna pehla design idea shuru karein!',
      resume: 'Project Jari Rakhein',
      created: 'Banaya gaya',
      status: 'Halat',
    },
    brief: {
      title: 'Project Brief Builder',
      subtitle: 'Apne rough idea ko saaf suthre verified brief me badlein (bina koi jhooti detail invent kiye).',
      ideaInputPlaceholder: 'Misaal: Karachi Biryani ka opening poster jisme 20% discount offer ho Instagram aur Flex banner ke liye...',
      submitIdea: 'Structured Brief Banayein',
      analyzing: 'AI aap ke idea ka jaiza le raha hai aur zaroori sawalat nikal raha hai...',
      confirmedFacts: 'Confirmed Maloomat (Facts)',
      placeholders: 'Placeholders (Aap ki tasdeeq zaroori hai)',
      assumptions: 'Design Assumptions',
      essentialQuestions: 'Zaroori Missing Sawalat (Jawab dein)',
      approveBrief: 'Brief Manzoor Karein & Aage Barhein',
      approvedNotice: 'Brief Manzoor ho gaya! Ab visual concepts tayyar hain.',
      generateConcepts: '2-3 Visual Concepts Banayein (Cost: 2 Credits)',
    },
    concepts: {
      title: 'Concept Gallery',
      subtitle: 'Photoshop kholne se pehle visual directions ka mawazna karein.',
      disclaimer: 'Concept preview — yeh aakhri file ya real photo nahi hai. Asal design layers me banega.',
      pros: 'Fawaid (Pros)',
      limitations: 'Khamiyan / Limits',
      approve: 'Yeh Direction Select Karein',
      approved: 'Direction Manzoor Shuda',
      proceedToBlueprint: 'Production Blueprint Banayein (Cost: 2 Credits)',
      reviseWithNote: 'Revision Note Likhein',
    },
    blueprint: {
      title: 'Production Blueprint',
      subtitle: 'Technical canvas size, layers ka structure, aur colors ki hierarchy.',
      canvasSpecs: 'Canvas Specifications',
      contentChecklist: 'Content aur Text Checklist',
      palette: 'Approved Brand Palette',
      typography: 'Typography & Fonts ka Nizamm',
      layerPlan: 'Layers & Groups Structure',
      startLearning: '12-Step Tutor Shuru Karein (Cost: 3 Credits)',
    },
    learn: {
      stepsChecklist: 'Sabaq ke Steps (Checklist)',
      interactiveCanvas: 'Canvas & Layers Studio',
      instructions: 'Step ki Hidayat',
      mentor: 'AI Design Ustaad (Mentor)',
      whatItDoes: 'Yeh Tool Kya Karta Hai',
      whyUsedHere: 'Yahan Kyun Use Ho Raha Hai',
      actions: 'Aap ko Kya Karna Hai (Steps)',
      expectedResult: 'Expected Result',
      commonMistakes: 'Aam Ghalatiyan (Bachne ke Tareeqe)',
      practiceTask: 'Chhoti Practice Task',
      verificationCriteria: 'Tasdeeq aur Theek Karne ka Tareeqa',
      previous: 'Pichhla Step',
      next: 'Agla Step',
      markDone: 'Mukammal Ho Gaya',
      verifyStep: 'Step Verify Karein (Upload Preview)',
      explainSimpler: 'Asaan Alfaaz me Samjhayein',
      stepMismatch: 'Meri Screen se Match Nahi Ho Raha',
      thinkingMode: 'High Thinking Mode On Karein',
      askMentorPlaceholder: 'Apne AI Ustaad se Photoshop, shortcuts ya design ka koi bhi sawal pochein...',
      send: 'Pochein',
    },
    review: {
      title: 'Design QA & Rubric Review',
      subtitle: 'Objective (technical rules) aur Subjective (khoobsoorti) ka jaiza.',
      findingsTitle: 'Inspection ke Nataij (Severity ke mutabiq)',
      critical: 'Sangeen Ghalatiyan (Critical)',
      important: 'Zaroori Behtariyan (Important)',
      polish: 'Aesthetic Polish',
      objective: 'Objective (Technical)',
      subjective: 'Subjective (Aesthetic)',
      fixGuide: 'Step-by-Step Fix Guide',
      proceedToDelivery: 'Export aur Delivery Par Jayein',
    },
    delivery: {
      title: 'Export & Delivery Guide',
      subtitle: 'Digital platform aur print press ke liye files tayyar karein.',
      exportGuide: 'Export Format Matrix (PNG, JPG, PDF, PSD)',
      printNotes: 'Print Shop Handoff Checklist',
      downloadSummary: 'Project Summary Download Karein (JSON)',
      checklistComplete: 'Tamam Marahil Kamyabi se Mukammal!',
      backToDashboard: 'Dashboard par Wapis Jayein',
    },
  },
  ur: {
    appName: 'اے آئی ڈیزائن استاد و تخلیق کار',
    tagline: 'فوٹوشاپ اور فوٹوپیا مرحلہ وار سیکھیں اور مکمل ڈیزائن بنائیں',
    nav: {
      dashboard: 'ڈیش بورڈ',
      newProject: 'نیا پروجیکٹ',
      referenceAnalyzer: 'ریفرنس کا تجزیہ',
      practice: 'مشقی چیلنجز',
      admin: 'ایڈمن و لاگز',
      settings: 'ترتیبات',
      credits: 'کریڈٹس',
    },
    stages: {
      brief: '1. بریف',
      concepts: '2. کانسیپٹس',
      blueprint: '3. بلیو پرنٹ',
      learn: '4. سیکھیں و بنائیں',
      review: '5. جائزہ و معیار',
      delivery: '6. ڈیلیوری و ایکسپورٹ',
    },
    dashboard: {
      welcome: 'ڈیزائن ورکشاپ میں خوش آمدید',
      subtitle: 'فوٹوشاپ اور فوٹوپیا کو مرحلہ وار مکمل پروجیکٹ کے ساتھ سیکھیں۔',
      startNew: 'نیا پروجیکٹ شروع کریں',
      myProjects: 'حالیہ پروجیکٹس',
      noProjects: 'ابھی کوئی پروجیکٹ موجود نہیں۔ نئے ڈیزائن آئیڈیا سے آغاز کریں!',
      resume: 'جاری رکھیں',
      created: 'تاریخ',
      status: 'حالت',
    },
    brief: {
      title: 'پروجیکٹ بریف بلڈر',
      subtitle: 'اپنے خام خیال کو ایک واضح اور مستند بریف میں تبدیل کریں بغیر کسی غلط دعوے کے۔',
      ideaInputPlaceholder: 'مثال: کراچی بریانی کا افتتاحی پوسٹر مع 20 فیصد رعایت انسٹاگرام اور فلیکس کے لیے...',
      submitIdea: 'بریف تیار کریں',
      analyzing: 'اے آئی ضروری نکات کا جائزہ لے رہا ہے...',
      confirmedFacts: 'تصدیق شدہ معلومات',
      placeholders: 'وضاحت طلب تفصیلات',
      assumptions: 'ڈیزائن کے مفروضے',
      essentialQuestions: 'ضروری سوالات (جواب دیں)',
      approveBrief: 'بریف کی منظوری دیں',
      approvedNotice: 'بریف منظور ہو گیا! اب تصویری تصورات تیار ہیں۔',
      generateConcepts: 'بصری تصورات تیار کریں (لاگت: 2 کریڈٹس)',
    },
    concepts: {
      title: 'کانسیپٹ گیلری',
      subtitle: 'فوٹوشاپ کھولنے سے پہلے مختلف سمتوں کا موازنہ کریں۔',
      disclaimer: 'تصوراتی پیش منظر — یہ حتمی پرنٹ فائل نہیں ہے۔',
      pros: 'فوائد',
      limitations: 'حدود و خامیاں',
      approve: 'یہ سمت منتخب کریں',
      approved: 'منتخب شدہ سمت',
      proceedToBlueprint: 'پروڈکشن بلیو پرنٹ تیار کریں (لاگت: 2 کریڈٹس)',
      reviseWithNote: 'ترمیم کی درخواست کریں',
    },
    blueprint: {
      title: 'پروڈکشن بلیو پرنٹ',
      subtitle: 'کینوس سائز، لیئرز کی ترتیب اور رنگوں کی ہم آہنگی۔',
      canvasSpecs: 'کینوس کی پیمائش و ڈی پی آئی',
      contentChecklist: 'مواد کی چیک لسٹ',
      palette: 'منظور شدہ رنگوں کی پیلیٹ',
      typography: 'فانٹس کا نظام',
      layerPlan: 'لیئرز کا ڈھانچہ',
      startLearning: '12 مرحلہ وار سبق شروع کریں (لاگت: 3 کریڈٹس)',
    },
    learn: {
      stepsChecklist: 'اسباق کے مراحل',
      interactiveCanvas: 'کینوس و لیئرز سٹوڈیو',
      instructions: 'مرحلہ کی ہدایات',
      mentor: 'اے آئی ڈیزائن استاد',
      whatItDoes: 'یہ ٹول کیا کرتا ہے',
      whyUsedHere: 'یہاں کیوں استعمال ہو رہا ہے',
      actions: 'کرنے کے کام (مراحل)',
      expectedResult: 'متوقع نتیجہ',
      commonMistakes: 'عام غلطیاں جن سے بچنا ہے',
      practiceTask: 'چھوٹی مشق',
      verificationCriteria: 'تصدیق کا طریقہ',
      previous: 'پچھلا مرحلہ',
      next: 'اگلا مرحلہ',
      markDone: 'مکمل نشان زد کریں',
      verifyStep: 'تصدیق کریں (پریویو اپلوڈ)',
      explainSimpler: 'آسان الفاظ میں سمجھائیں',
      stepMismatch: 'میری سکرین سے مطابقت نہیں ہے',
      thinkingMode: 'ہائی تھنکنگ موڈ فعال کریں',
      askMentorPlaceholder: 'فوٹوشاپ، شارٹ کٹ یا ڈیزائن کا کوئی بھی سوال استاد سے پوچھیں...',
      send: 'پوچھیں',
    },
    review: {
      title: 'ڈیزائن کوالٹی و جائزہ',
      subtitle: 'تکنیکی اصولوں اور جمالیاتی توازن کا مفصل معائنہ۔',
      findingsTitle: 'معائنے کے نتائج',
      critical: 'سنگین خامیاں',
      important: 'اہم بہتری کے نکات',
      polish: 'جمالیاتی نفاست',
      objective: 'تکنیکی اصول',
      subjective: 'جمالیاتی پہلو',
      fixGuide: 'درست کرنے کا طریقہ',
      proceedToDelivery: 'ایکسپورٹ کی جانب بڑھیں',
    },
    delivery: {
      title: 'ایکسپورٹ و ڈیلیوری گائیڈ',
      subtitle: 'پرنٹ پریس اور سوشل میڈیا کے لیے حتمی فائلز کی تیاری۔',
      exportGuide: 'فائل فارمیٹس (PNG, JPG, PDF, PSD)',
      printNotes: 'پرنٹ پریس ہدایات',
      downloadSummary: 'خلاصہ ڈاؤنلوڈ کریں (JSON)',
      checklistComplete: 'تمام مراحل کامیابی سے مکمل ہو گئے!',
      backToDashboard: 'ڈیش بورڈ پر واپسی',
    },
  },
};
