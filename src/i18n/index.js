import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhTranslations from './zh.json';
import enTranslations from './en.json';

const resources = {
  zh: {
    translation: zhTranslations
  },
  en: {
    translation: enTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // 默认语言设置为中文
    fallbackLng: 'zh',
    
    interpolation: {
      escapeValue: false // React 已经默认转义了
    },

    // 调试模式
    debug: false
  });

export default i18n; 