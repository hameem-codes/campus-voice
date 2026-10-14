export type Locale = 'en' | 'hi'

export const translations = {
  en: {
    // Nav
    navHome: 'Home',
    navUpdates: 'Updates',
    navCalendar: 'Calendar',
    navSaved: 'Saved',
    navProfile: 'Profile',
    navAnalytics: 'Analytics',
    navNotices: 'My Notices',
    navCreate: 'New Notice',
    navUsers: 'Users & Roles',
    navSetup: 'System Setup',
    navLogs: 'Audit Logs',

    // Actions & Buttons
    btnMarkRead: 'Mark as read',
    btnMarkUnread: 'Mark unread',
    btnSave: 'Save',
    btnSaved: 'Saved',
    btnShare: 'Share',
    btnAddToCalendar: 'Add to calendar',
    btnSummarize: 'Summarize',
    btnHideAiSummary: 'Hide AI summary',
    btnApprove: 'Approve',
    btnReject: 'Reject',
    btnTurnOnAlerts: 'Turn on alerts',
    btnSearch: 'Search updates',
    btnNewNotice: 'New notice',
    btnSettings: 'Settings',
    btnSignOut: 'Sign out',
    btnDemoTools: 'Demo tools',
    btnResetData: 'Reset demo data',

    // Filters
    filterAll: 'All',
    filterUnread: 'Unread',
    filterUrgent: 'Urgent',
    filterSaved: 'Saved',

    // Titles & Labels
    appTitle: 'Campus Voice',
    urgentBanner: 'Urgent Alert',
    needsAttention: 'Needs Attention',
    recentUpdates: 'Recent Updates',
    upcomingEvents: 'Upcoming Events & Deadlines',
    preferencesTitle: 'Notification Preferences',
    languageLabel: 'Display Language',
    verifiedNotice: 'Official Verified Notice',
    executiveTakeaways: 'Executive Takeaways',
    aiSummaryTag: 'AI summary (demo)',
  },
  hi: {
    // Nav
    navHome: 'होम',
    navUpdates: 'सूचनाएं',
    navCalendar: 'कैलेंडर',
    navSaved: 'सहेजे गए',
    navProfile: 'प्रोफ़ाइल',
    navAnalytics: 'एनालिटिक्स',
    navNotices: 'मेरी सूचनाएं',
    navCreate: 'नई सूचना',
    navUsers: 'उपयोगकर्ता एवं भूमिकाएं',
    navSetup: 'सिस्टम सेटअप',
    navLogs: 'ऑडिट लॉग',

    // Actions & Buttons
    btnMarkRead: 'पढ़ा हुआ चिह्नित करें',
    btnMarkUnread: 'अपठित चिह्नित करें',
    btnSave: 'सहेजें',
    btnSaved: 'सहेजा गया',
    btnShare: 'साझा करें',
    btnAddToCalendar: 'कैलेंडर में जोड़ें',
    btnSummarize: 'सारांश',
    btnHideAiSummary: 'सारांश छिपाएं',
    btnApprove: 'स्वीकृत करें',
    btnReject: 'अस्वीकृत करें',
    btnTurnOnAlerts: 'अलर्ट चालू करें',
    btnSearch: 'सूचनाएं खोजें',
    btnNewNotice: 'नई सूचना बनाएं',
    btnSettings: 'सेटिंग्स',
    btnSignOut: 'लॉग आउट',
    btnDemoTools: 'डेमो टूल्स',
    btnResetData: 'डेमो डेटा रीसेट करें',

    // Filters
    filterAll: 'सभी',
    filterUnread: 'अपठित',
    filterUrgent: 'अति आवश्यक',
    filterSaved: 'सहेजे गए',

    // Titles & Labels
    appTitle: 'कैंपस वॉइस',
    urgentBanner: 'अति आवश्यक सूचना',
    needsAttention: 'ध्यान देने योग्य',
    recentUpdates: 'नवीनतम सूचनाएं',
    upcomingEvents: 'आगामी तिथियां एवं कार्यक्रम',
    preferencesTitle: 'सूचना प्राथमिकताएं',
    languageLabel: 'भाषा चुनें',
    verifiedNotice: 'आधिकारिक सत्यापित सूचना',
    executiveTakeaways: 'मुख्य सारांश',
    aiSummaryTag: 'एआई सारांश (डेमो)',
  },
} as const

export type TranslationKey = keyof typeof translations['en']

export function getTranslation(locale: Locale, key: TranslationKey): string {
  const dict = translations[locale] || translations.en
  return (dict as Record<string, string>)[key] || translations.en[key] || key
}
