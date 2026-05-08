import React from 'react';
import { useTranslation } from 'react-i18next';

const Formula = () => {
    const { t } = useTranslation();
    const points = [1, 2, 3].map((number) => t(`formula.point${number}`));
    
    return (
        <div className="formula">
            <p className="formula-lead">{t('formula.lead')}</p>
            <ul className="explanation-list compact">
                {points.map((point) => (
                    <li key={point}>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
            <p className="formula-note">{t('formula.note')}</p>
        </div>
    );
};

export default Formula;
