import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        i18n.changeLanguage(lang);
    };

    return (
        <header className="header">
            <div className="header-content">
                <h1 className="main-title">{t('header.title')}</h1>
                
                <div className="header-links">
                    <div className="version-info">
                        <a 
                            href="https://github.com/wangyufeng0615/early_retirement_calculator" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="link"
                        >
                            {t('header.github')}
                        </a>
                        <a 
                            href="https://wangyufeng.org" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="link"
                        >
                            {t('header.blog')}
                        </a>
                    </div>
                </div>

                <div className="language-switcher">
                    <button 
                        className={`lang-btn ${language === 'zh' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange('zh')}
                    >
                        {t('header.chinese')}
                    </button>
                    <button 
                        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange('en')}
                    >
                        {t('header.english')}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header; 