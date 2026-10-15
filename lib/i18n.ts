export type Locale = 'en'

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
} as const

export type TranslationKey = keyof typeof translations['en']

export function getTranslation(_locale: Locale, key: TranslationKey): string {
  return translations.en[key] || key
}
