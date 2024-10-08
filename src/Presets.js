import React from 'react';

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
    return (
        <div className="presets">
            {presets.map((preset, index) => (
                <button
                    key={index}
                    className="preset-button"
                    onClick={() => onSelectPreset(preset)}
                >
                    {preset.name}
                </button>
            ))}
        </div>
    );
};

export default Presets;