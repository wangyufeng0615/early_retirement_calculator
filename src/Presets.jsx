import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Presets = ({ onSelectPreset }) => {
    const { t } = useTranslation();
    const [showToast, setShowToast] = useState(false);
    const [selectedPresetName, setSelectedPresetName] = useState('');

    const presets = [
        {
            name: t('presets.profiles.programmer'),
            currentAge: 30,
            earlyRetirementAge: 35,
            legalRetirementAge: 65,
            monthlyExpenses: 15000,
            currentSavings: 500000,
            annualReturn: 7,
            inflationRate: 2,
            expectedSavingsAtLegalRetirement: 200000,
            monthlyPension: 4000,
            planningEndAge: 85
        },
        {
            name: t('presets.profiles.middleIncome'),
            currentAge: 30,
            earlyRetirementAge: 50,
            legalRetirementAge: 65,
            monthlyExpenses: 10000,
            currentSavings: 200000,
            annualReturn: 3,
            inflationRate: 2,
            expectedSavingsAtLegalRetirement: 200000,
            monthlyPension: 3000,
            planningEndAge: 85
        },
        {
            name: t('presets.profiles.extremeLayFlat'),
            currentAge: 23,
            earlyRetirementAge: 35,
            legalRetirementAge: 65,
            monthlyExpenses: 5000,
            currentSavings: 0,
            annualReturn: 4,
            inflationRate: 2,
            expectedSavingsAtLegalRetirement: 0,
            monthlyPension: 2000,
            planningEndAge: 85
        },
        {
            name: t('presets.profiles.stockGod'),
            currentAge: 30,
            earlyRetirementAge: 40,
            legalRetirementAge: 65,
            monthlyExpenses: 15000,
            currentSavings: 200000,
            annualReturn: 8,
            inflationRate: 2,
            expectedSavingsAtLegalRetirement: 1000000,
            monthlyPension: 4000,
            planningEndAge: 85
        }
    ];

    const handlePresetClick = (preset) => {
        onSelectPreset(preset);
        setSelectedPresetName(preset.name);
        setShowToast(true);
        
        // 3秒后自动隐藏提示
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <div className="presets">
            {presets.map((preset, index) => (
                <button
                    key={index}
                    className="preset-button"
                    onClick={() => handlePresetClick(preset)}
                >
                    {preset.name}
                </button>
            ))}
            
            {/* 气泡提示 */}
            {showToast && (
                <div className="toast-notification">
                    <div className="toast-content">
                        <span className="toast-icon">✅</span>
                        <span className="toast-text">
                            {t('presets.applied', { name: selectedPresetName })}
                        </span>
                        <button 
                            className="toast-close"
                            onClick={() => setShowToast(false)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Presets;
