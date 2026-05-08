import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
    const [planningEndAge, setPlanningEndAge] = useState(85);

    const [status, setStatus] = useState('solved');
    const [validationErrors, setValidationErrors] = useState([]);
    const [requiredSavings, setRequiredSavings] = useState(0);
    const [monthlySavings, setMonthlySavings] = useState(0);
    const [requiredSalary, setRequiredSalary] = useState(0);
    const [savingsProgress, setSavingsProgress] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [remainingSavings, setRemainingSavings] = useState(0);
    const [remainingSavingsTodayValue, setRemainingSavingsTodayValue] = useState(0);
    const [legalRetirementTarget, setLegalRetirementTarget] = useState(0);
    const [planningEndSavings, setPlanningEndSavings] = useState(0);
    const [planningEndSavingsTodayValue, setPlanningEndSavingsTodayValue] = useState(0);
    const [realAnnualReturn, setRealAnnualReturn] = useState(0);
    const [shortfall, setShortfall] = useState(0);
    const [sensitivity, setSensitivity] = useState([]);

    useEffect(() => {
        calculateRetirementData();
    }, [currentAge, earlyRetirementAge, legalRetirementAge, monthlyExpenses, currentSavings, annualReturn, inflationRate, expectedSavingsAtLegalRetirement, monthlyPension, planningEndAge]);


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
            monthlyPension,
            planningEndAge
        );

        if (results) {
            setStatus(results.status);
            setValidationErrors(results.validationErrors || []);
            setRequiredSavings(results.requiredSavings);
            setMonthlySavings(results.monthlySavings);
            setRequiredSalary(results.requiredSalary);
            setSavingsProgress(results.savingsProgress);
            setChartData(results.chartData);
            setRemainingSavings(results.remainingSavings);
            setRemainingSavingsTodayValue(results.remainingSavingsTodayValue);
            setLegalRetirementTarget(results.legalRetirementTarget);
            setPlanningEndSavings(results.planningEndSavings);
            setPlanningEndSavingsTodayValue(results.planningEndSavingsTodayValue);
            setRealAnnualReturn(results.realAnnualReturn);
            setShortfall(results.shortfall);
            setSensitivity(results.sensitivity || []);
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
        setPlanningEndAge(preset.planningEndAge || 85);
    };

    return (
        <div className="calculator-container">
            <div className="card">
                <div className="description">
                    <h2>{t('description.title')}</h2>
                    <p>{t('description.body')}</p>
                    <p className="description-note">{t('description.note')}</p>
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
                    planningEndAge={planningEndAge}
                    setPlanningEndAge={setPlanningEndAge}
                />
            </div>
            <div className="module results-module">
                <div className="card">
                    <h2 className="module-title">{t('results.title')}</h2>
                    <Results
                        status={status}
                        validationErrors={validationErrors}
                        requiredSavings={requiredSavings}
                        monthlySavings={monthlySavings}
                        requiredSalary={requiredSalary}
                        savingsProgress={savingsProgress}
                        remainingSavings={remainingSavings}
                        remainingSavingsTodayValue={remainingSavingsTodayValue}
                        legalRetirementTarget={legalRetirementTarget}
                        planningEndSavings={planningEndSavings}
                        planningEndSavingsTodayValue={planningEndSavingsTodayValue}
                        realAnnualReturn={realAnnualReturn}
                        shortfall={shortfall}
                        sensitivity={sensitivity}
                    />
                </div>
            </div>
            <div className="module chart-module">
                <div className="card">
                <h2 className="module-title">{t('chart.title')}</h2>
                <Chart
                    data={chartData}
                    earlyRetirementAge={earlyRetirementAge}
                    legalRetirementAge={legalRetirementAge}
                    currentAge={currentAge}
                    status={status}
                />
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
