import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { useTranslation, Trans } from 'react-i18next';

import InputForm from './InputForm.jsx';
import Results from './Results.jsx';
import Chart from './Chart.jsx';
import Formula from './Formula.jsx';
import Presets from './Presets.jsx';
import { calculateRetirement } from './retirementCalculations.jsx';

const RetirementCalculator = () => {
    const { t } = useTranslation();
    
    const [currentAge, setCurrentAge] = useState(30);
    const [earlyRetirementAge, setEarlyRetirementAge] = useState(40);
    const [legalRetirementAge, setLegalRetirementAge] = useState(63);
    const [monthlyExpenses, setMonthlyExpenses] = useState(8000);
    const [currentSavings, setCurrentSavings] = useState(200000);
    const [annualReturn, setAnnualReturn] = useState(3.5);
    const [inflationRate, setInflationRate] = useState(2);
    const [expectedSavingsAtLegalRetirement, setExpectedSavingsAtLegalRetirement] = useState(0);
    const [monthlyPension, setMonthlyPension] = useState(3000);

    const [requiredSavings, setRequiredSavings] = useState(0);
    const [monthlySavings, setMonthlySavings] = useState(0);
    const [requiredSalary, setRequiredSalary] = useState(0);
    const [savingsProgress, setSavingsProgress] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [remainingSavings, setRemainingSavings] = useState(0);
    const [remainingSavingsTodayValue, setRemainingSavingsTodayValue] = useState(0);

    useEffect(() => {
        calculateRetirementData();
    }, [currentAge, earlyRetirementAge, legalRetirementAge, monthlyExpenses, currentSavings, annualReturn, inflationRate, expectedSavingsAtLegalRetirement, monthlyPension]);


    const calculateRetirementData = () => {
        const results = calculateRetirement(
            currentAge,
            earlyRetirementAge,
            legalRetirementAge,
            monthlyExpenses,
            currentSavings,
            annualReturn,
            inflationRate,
            expectedSavingsAtLegalRetirement,
            monthlyPension
        );

        if (results) {
            setRequiredSavings(results.requiredSavings);
            setMonthlySavings(results.monthlySavings);
            setRequiredSalary(results.requiredSalary);
            setSavingsProgress(results.savingsProgress);
            setChartData(results.chartData);
            setRemainingSavings(results.remainingSavings);
            setRemainingSavingsTodayValue(results.remainingSavingsTodayValue);
        }
    };

    const handleSelectPreset = (preset) => {
        setCurrentAge(preset.currentAge);
        setEarlyRetirementAge(preset.earlyRetirementAge);
        setLegalRetirementAge(preset.legalRetirementAge);
        setMonthlyExpenses(preset.monthlyExpenses);
        setCurrentSavings(preset.currentSavings);
        setAnnualReturn(preset.annualReturn);
        setInflationRate(preset.inflationRate);
        setExpectedSavingsAtLegalRetirement(preset.expectedSavingsAtLegalRetirement);
        setMonthlyPension(preset.monthlyPension || 3000);
    };

    return (
        <div className="calculator-container">
            <div className="card">
                <div className="description">
                    {t('description.line1')}<br />
                    <Trans 
                        i18nKey="description.line2" 
                        components={{ 
                            fire: <strong style={{ color: '#3498db' }} />
                        }}
                    /><br />
                    <Trans 
                        i18nKey="description.line3" 
                        components={{ 
                            fireCalculator: <strong style={{ color: '#3498db' }} />
                        }}
                    /><br />
                    <strong style={{ color: '#27ae60' }}>{t('description.line4')}</strong><br />
                    {t('description.line5')}
                </div>
            </div>
            <div className="module">
                <InputForm
                    currentAge={currentAge}
                    setCurrentAge={setCurrentAge}
                    earlyRetirementAge={earlyRetirementAge}
                    setEarlyRetirementAge={setEarlyRetirementAge}
                    legalRetirementAge={legalRetirementAge}
                    setLegalRetirementAge={setLegalRetirementAge}
                    monthlyExpenses={monthlyExpenses}
                    setMonthlyExpenses={setMonthlyExpenses}
                    currentSavings={currentSavings}
                    setCurrentSavings={setCurrentSavings}
                    annualReturn={annualReturn}
                    setAnnualReturn={setAnnualReturn}
                    inflationRate={inflationRate}
                    setInflationRate={setInflationRate}
                    expectedSavingsAtLegalRetirement={expectedSavingsAtLegalRetirement}
                    setExpectedSavingsAtLegalRetirement={setExpectedSavingsAtLegalRetirement}
                    monthlyPension={monthlyPension}
                    setMonthlyPension={setMonthlyPension}
                />
            </div>
            <div className="module results-module">
                <div className="card">
                    <h2 className="module-title">{t('results.title')}</h2>
                    <Results
                        requiredSavings={requiredSavings}
                        monthlySavings={monthlySavings}
                        savingsProgress={savingsProgress}
                        remainingSavings={remainingSavings}
                        remainingSavingsTodayValue={remainingSavingsTodayValue}
                    />
                </div>
            </div>
            <div className="module chart-module">
                <div className="card">
                <h2 className="module-title">{t('chart.title')}</h2>
                <Chart data={chartData} earlyRetirementAge={earlyRetirementAge} currentAge={currentAge} />
                </div>
            </div>
            <div className="module">
                <h2 className="module-title">{t('presets.title')}</h2>
                <Presets onSelectPreset={handleSelectPreset} />
            </div>
            <div className="module">
                <h2 className="module-title">{t('formula.title')}</h2>
                <Formula />
            </div>
        </div>
    );
};

export default RetirementCalculator;
