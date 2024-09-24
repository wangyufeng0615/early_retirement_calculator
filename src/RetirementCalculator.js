import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';

import InputForm from './InputForm';
import Results from './Results';
import Chart from './Chart';
import Formula from './Formula';
import Presets from './Presets';
import { calculateRetirement } from './retirementCalculations';

const RetirementCalculator = () => {
    const [currentAge, setCurrentAge] = useState(29);
    const [earlyRetirementAge, setEarlyRetirementAge] = useState(40);
    const [legalRetirementAge, setLegalRetirementAge] = useState(65);
    const [monthlyExpenses, setMonthlyExpenses] = useState(8000);
    const [currentSavings, setCurrentSavings] = useState(800000);
    const [annualReturn, setAnnualReturn] = useState(3.5);
    const [inflationRate, setInflationRate] = useState(2);
    const [expectedSavingsAtLegalRetirement, setExpectedSavingsAtLegalRetirement] = useState(0);

    const [requiredSavings, setRequiredSavings] = useState(0);
    const [monthlySavings, setMonthlySavings] = useState(0);
    const [requiredSalary, setRequiredSalary] = useState(0);
    const [savingsProgress, setSavingsProgress] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [remainingSavings, setRemainingSavings] = useState(0);
    const [remainingSavingsTodayValue, setRemainingSavingsTodayValue] = useState(0);

    useEffect(() => {
        calculateRetirementData();
    }, [currentAge, earlyRetirementAge, legalRetirementAge, monthlyExpenses, currentSavings, annualReturn, inflationRate, expectedSavingsAtLegalRetirement]);


    const calculateRetirementData = () => {
        const results = calculateRetirement(
            currentAge,
            earlyRetirementAge,
            legalRetirementAge,
            monthlyExpenses,
            currentSavings,
            annualReturn,
            inflationRate,
            expectedSavingsAtLegalRetirement
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
    };

    return (
        <div className="container">
            <h1 className="title">王工的提前退休计算器</h1>
            <div className="card">
                <div className="description">
                    感觉自己坚持不到法定退休年龄？想主动提前退休？<br /><br />
                    通过这个计算器，你可以算一算，如果你想<strong style={{ color: 'green' }}>主动提前退休</strong>，你需要有多少收入和储蓄。<br /><br />
                    祝大家健康长寿！<br /><br />
                    有需求或疑问欢迎反馈到微信：807103724
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
                />
            </div>
            <div className="module results-module">
                <div className="card">
                    <h2 className="module-title">计算结果</h2>
                    <Results
                        requiredSavings={requiredSavings}
                        monthlySavings={monthlySavings}
                        requiredSalary={requiredSalary}
                        savingsProgress={savingsProgress}
                        remainingSavings={remainingSavings}
                        remainingSavingsTodayValue={remainingSavingsTodayValue}
                    />
                </div>
            </div>
            <div className="chart-module">
                <h2 className="module-title">储蓄变化曲线</h2>
                <Chart data={chartData} earlyRetirementAge={earlyRetirementAge} />
            </div>
            <div className="module">
                <h2 className="module-title">预设情景</h2>
                <Presets onSelectPreset={handleSelectPreset} />
            </div>
            <div className="module">
                <h2 className="module-title">说明</h2>
                <Formula />
            </div>
            <footer className="footer">
                <p>
                    Write with Cursor.
                </p>
                <p>
                    Code: <a href="https://github.com/wangyufeng0615/early_retirement_calculator" target="_blank" rel="noopener noreferrer">GitHub</a>
                </p>
            </footer>
        </div>
    );
};

export default RetirementCalculator;
