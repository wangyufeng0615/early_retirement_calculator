import React, { useState } from 'react';

const presets = [
    {
        name: "高收入|高支出|追求高投资回报|高失业风险程序员",
        currentAge: 30,
        earlyRetirementAge: 35,
        legalRetirementAge: 65,
        monthlyExpenses: 15000,
        currentSavings: 500000,
        annualReturn: 7,
        inflationRate: 2,
        expectedSavingsAtLegalRetirement: 200000
    },
    {
        name: "中等收入|中等开销|失业低风险|低风险投资|工作耐受度高",
        currentAge: 30,
        earlyRetirementAge: 50,
        legalRetirementAge: 65,
        monthlyExpenses: 10000,
        currentSavings: 200000,
        annualReturn: 3,
        inflationRate: 2,
        expectedSavingsAtLegalRetirement: 200000
    },
    {
        name: "极限躺平年轻人",
        currentAge: 23,
        earlyRetirementAge: 35,
        legalRetirementAge: 65,
        monthlyExpenses: 5000,
        currentSavings: 0,
        annualReturn: 4,
        inflationRate: 2,
        expectedSavingsAtLegalRetirement: 0
    },
    {
        name: "股神",
        currentAge: 30,
        earlyRetirementAge: 40,
        legalRetirementAge: 65,
        monthlyExpenses: 15000,
        currentSavings: 200000,
        annualReturn: 8,
        inflationRate: 2,
        expectedSavingsAtLegalRetirement: 1000000
    }
];

const Presets = ({ onSelectPreset }) => {
    const [showNotification, setShowNotification] = useState(false);

    const handlePresetClick = (preset) => {
        onSelectPreset(preset);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000); // 2秒后隐藏通知
    };

    return (
        <div className="presets">
            {showNotification && (
                <div className="notification">
                    预设已应用
                </div>
            )}
            <p className="preset-description">探索一下不同的输入组合所带来的不同结果</p>
            <div className="preset-buttons">
                {presets.map((preset, index) => (
                    <button key={index} onClick={() => handlePresetClick(preset)} className="preset-button">
                        {preset.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Presets;