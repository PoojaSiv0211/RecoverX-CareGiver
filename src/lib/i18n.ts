/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'English' | 'Tamil' | 'Hindi' | 'Telugu';

export const translations: Record<Language, Record<string, string>> = {
  English: {
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    recovery: 'Recovery',
    profile: 'Profile',
    hello: 'Hello',
    streak: 'Streak',
    recovery_score: 'Recovery',
    today_schedule: 'Today\'s Schedule',
    quick_actions: 'Quick Actions',
    pain_map: 'Pain Map',
    reports: 'Reports',
    upload_prescription: 'Upload Prescription',
    log_intensity: 'Log Intensity',
    view_progress: 'View Progress',
    days: 'Days',
    on_track: 'On Track',
    no_tasks: 'No tasks scheduled for today.',
    view_all: 'View All',
  },
  Tamil: {
    dashboard: 'முகப்பு',
    tasks: 'பணிகள்',
    recovery: 'மீட்பு',
    profile: 'சுயவிவரம்',
    hello: 'வணக்கம்',
    streak: 'தொடர்ச்சி',
    recovery_score: 'மீட்பு நிலை',
    today_schedule: 'இன்றைய அட்டவணை',
    quick_actions: 'விரைவு செயல்கள்',
    pain_map: 'வலி வரைபடம்',
    reports: 'அறிக்கைகள்',
    upload_prescription: 'மருந்துச் சீட்டைப் பதிவேற்றவும்',
    log_intensity: 'தீவிரத்தைப் பதிவு செய்யவும்',
    view_progress: 'முன்னேற்றத்தைப் பார்க்கவும்',
    days: 'நாட்கள்',
    on_track: 'சரியான பாதையில்',
    no_tasks: 'இன்று எந்தப் பணிகளும் திட்டமிடப்படவில்லை.',
    view_all: 'அனைத்தையும் பார்க்கவும்',
  },
  Hindi: {
    dashboard: 'डैशबोर्ड',
    tasks: 'कार्य',
    recovery: 'रिकवरी',
    profile: 'प्रोफ़ाइल',
    hello: 'नमस्ते',
    streak: 'लगातार दिन',
    recovery_score: 'रिकवरी स्कोर',
    today_schedule: 'आज की अनुसूची',
    quick_actions: 'त्वरित कार्रवाई',
    pain_map: 'दर्द का नक्शा',
    reports: 'रिपोर्ट',
    upload_prescription: 'पर्चा अपलोड करें',
    log_intensity: 'तीव्रता दर्ज करें',
    view_progress: 'प्रगति देखें',
    days: 'दिन',
    on_track: 'सही रास्ते पर',
    no_tasks: 'आज के लिए कोई कार्य निर्धारित नहीं है।',
    view_all: 'सभी देखें',
  },
  Telugu: {
    dashboard: 'డాష్‌బోర్డ్',
    tasks: 'పనులు',
    recovery: 'రికవరీ',
    profile: 'ప్రొఫైల్',
    hello: 'నమస్కారం',
    streak: 'నిరంతర రోజులు',
    recovery_score: 'రికవరీ స్కోరు',
    today_schedule: 'నేటి షెడ్యూల్',
    quick_actions: 'త్వరిత చర్యలు',
    pain_map: 'నొప్పి మ్యాప్',
    reports: 'నివేదికలు',
    upload_prescription: 'ప్రిస్క్రిప్షన్ అప్‌లోడ్ చేయండి',
    log_intensity: 'తీవ్రతను నమోదు చేయండి',
    view_progress: 'పురోగతిని చూడండి',
    days: 'రోజులు',
    on_track: 'సరైన మార్గంలో',
    no_tasks: 'నేటి కోసం పనులు ఏవీ షెడ్యూల్ చేయబడలేదు.',
    view_all: 'అన్నీ చూడండి',
  },
};

export const useTranslation = (lang: Language = 'English') => {
  const t = (key: string) => {
    return translations[lang][key] || translations['English'][key] || key;
  };
  return { t };
};
