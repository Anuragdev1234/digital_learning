export type SupportedLanguage = 'en' | 'hi';

export interface TranslationDictionary {
  tagline: string;
  dayStreak: string;
  tokens: string;
  myMilestones: string;
  challengeWall: string;
  mySubmissions: string;
  theVault: string;
  communityWiki: string;
  aiCoPilot: string;
  effortPaywall: string;
  completeDailyLesson: string;
  practicalMiniProject: string;
  uploadEvidence: string;
  socraticHint: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    tagline: 'Many traditions. One living India.',
    dayStreak: 'Day Streak',
    tokens: 'Tokens',
    myMilestones: 'My Milestones',
    challengeWall: 'Challenge Wall',
    mySubmissions: 'My Submissions',
    theVault: 'The Vault',
    communityWiki: 'Community Wiki',
    aiCoPilot: 'AI Co-Pilot',
    effortPaywall: 'The Effort Paywall',
    completeDailyLesson: 'Complete 15-Minute Lesson (+10 Tokens)',
    practicalMiniProject: 'Practical Mini-Project',
    uploadEvidence: 'Upload Evidence & Run AI Verification',
    socraticHint: 'Socratic Guidance & Doubts',
  },
  hi: {
    tagline: 'अनेक परंपराएं, एक जीवंत भारत।',
    dayStreak: 'दिन का स्ट्रीक',
    tokens: 'टोकन',
    myMilestones: 'मेरी प्रगति',
    challengeWall: 'चैलेंज वॉल',
    mySubmissions: 'मेरे प्रोजेक्ट्स',
    theVault: 'द वॉल्ट',
    communityWiki: 'कम्युनिटी विकी',
    aiCoPilot: 'एआई मेंटर',
    effortPaywall: 'परिश्रम ही शुल्क है',
    completeDailyLesson: '15-मिनट पाठ पूरा करें (+10 टोकन)',
    practicalMiniProject: 'व्यावहारिक मिनी-प्रोजेक्ट',
    uploadEvidence: 'प्रमाण अपलोड करें और एआई जांचें',
    socraticHint: 'सॉक्रेटीस मार्गदर्शन एवं शंका समाधान',
  },
};
