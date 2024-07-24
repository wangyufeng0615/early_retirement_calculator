import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Latex from 'react-latex-next';
import './index.css';

const RetirementCalculator = () => {
    const [currentAge, setCurrentAge] = useState(29);
    const [earlyRetirementAge, setEarlyRetirementAge] = useState(40);
    const [legalRetirementAge, setLegalRetirementAge] = useState(65);
    const [monthlyExpenses, setMonthlyExpenses] = useState(8000);
    const [currentSavings, setCurrentSavings] = useState(0);
    const [annualReturn, setAnnualReturn] = useState(3.5);
    const [inflationRate, setInflationRate] = useState(2);
    const [desiredLegalRetirementSavings, setDesiredLegalRetirementSavings] = useState(500000);

    const [requiredSavings, setRequiredSavings] = useState(0);
    const [monthlySavings, setMonthlySavings] = useState(0);
    const [requiredSalary, setRequiredSalary] = useState(0);
    const [savingsProgress, setSavingsProgress] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [remainingSavings, setRemainingSavings] = useState(0);

    useEffect(() => {
        calculateRetirement();
    }, [currentAge, earlyRetirementAge, legalRetirementAge, monthlyExpenses, currentSavings, annualReturn, inflationRate, desiredLegalRetirementSavings]);

    const calculateRetirement = () => {
        const yearsUntilEarlyRetirement = earlyRetirementAge - currentAge;
        const yearsInEarlyRetirement = legalRetirementAge - earlyRetirementAge;
        const realReturnRate = (1 + annualReturn / 100) / (1 + inflationRate / 100) - 1;
        const monthlyRealReturnRate = Math.pow(1 + realReturnRate, 1 / 12) - 1;

        const earlyRetirementYearlyExpenses = monthlyExpenses * 12 * Math.pow(1 + inflationRate / 100, yearsUntilEarlyRetirement);

        const inflationAdjustedDesiredSavings = desiredLegalRetirementSavings * Math.pow(1 + inflationRate / 100, yearsUntilEarlyRetirement + yearsInEarlyRetirement);

        let totalNeeded;
        if (Math.abs(realReturnRate) < 1e-6) {
            totalNeeded = earlyRetirementYearlyExpenses * yearsInEarlyRetirement + inflationAdjustedDesiredSavings;
        } else {
            totalNeeded = earlyRetirementYearlyExpenses * ((1 - Math.pow(1 + realReturnRate, -yearsInEarlyRetirement)) / realReturnRate) + inflationAdjustedDesiredSavings * Math.pow(1 + realReturnRate, -yearsInEarlyRetirement);
        }

        setRequiredSavings(Math.floor(totalNeeded));

        const additionalSavingsNeeded = Math.max(0, totalNeeded - currentSavings);
        const monthsUntilEarlyRetirement = yearsUntilEarlyRetirement * 12;

        let pmt;
        if (Math.abs(monthlyRealReturnRate) < 1e-6) {
            pmt = additionalSavingsNeeded / monthsUntilEarlyRetirement;
        } else {
            pmt = additionalSavingsNeeded * (monthlyRealReturnRate / (Math.pow(1 + monthlyRealReturnRate, monthsUntilEarlyRetirement) - 1));
        }
        setMonthlySavings(Math.floor(pmt));

        setRequiredSalary(Math.floor(monthlyExpenses + pmt));
        setSavingsProgress(Math.min(100, Math.floor((currentSavings / totalNeeded) * 100)));

        const data = [];
        let currentSavingsAmount = currentSavings;
        for (let age = currentAge; age <= legalRetirementAge; age++) {
            if (age < earlyRetirementAge) {
                currentSavingsAmount = currentSavingsAmount * (1 + annualReturn / 100) + pmt * 12;
            } else {
                currentSavingsAmount = currentSavingsAmount * (1 + annualReturn / 100) - earlyRetirementYearlyExpenses;
            }
            data.push({
                age: age,
                savings: Math.max(0, Math.floor(currentSavingsAmount)),
                target: Math.floor(totalNeeded)
            });
        }
        setChartData(data);
        setRemainingSavings(Math.max(0, Math.floor(currentSavingsAmount)));
    };

    const handleInputChange = (setter) => (e) => {
        setter(parseFloat(e.target.value) || 0);
    };

    const handleIncrement = (setter, value) => () => {
        setter(value + 1);
    };

    const handleDecrement = (setter, value) => () => {
        setter(value - 1);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 }).format(value);
    };

    const formatYAxis = (value) => {
        return `${(value / 1000).toFixed(0)}k`;
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <div className="card-title">提前退休计算器</div>
                </div>
                <div className="card-content">
                    <div className="description">
                        感觉自己坚持不到法定退休年龄？通过这个计算器，你可以算一算，如果你想主动提前退休，你需要有多少储蓄。<br /><br />
                        有需求请反馈到 alanwang424@gmail.com 谢谢！
                    </div>
                    <div className="grid">
                        <div className="form-group">
                            <label htmlFor="currentAge">你的当前年龄</label>
                            <div className="input-group">
                                <button onClick={handleDecrement(setCurrentAge, currentAge)}>-</button>
                                <input
                                    type="text"
                                    id="currentAge"
                                    value={currentAge}
                                    onChange={handleInputChange(setCurrentAge)}
                                />
                                <button onClick={handleIncrement(setCurrentAge, currentAge)}>+</button>
                            </div>
                            <p className="note">准确填写即可。</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="earlyRetirementAge">提前退休年龄</label>
                            <div className="input-group">
                                <button onClick={handleDecrement(setEarlyRetirementAge, earlyRetirementAge)}>-</button>
                                <input
                                    type="text"
                                    id="earlyRetirementAge"
                                    value={earlyRetirementAge}
                                    onChange={handleInputChange(setEarlyRetirementAge)}
                                />
                                <button onClick={handleIncrement(setEarlyRetirementAge, earlyRetirementAge)}>+</button>
                            </div>
                            <p className="note">也就是你打算从多少岁开始就主动提前退休了（或者没班可上了），比如40岁。计算器假设从这年之后你没有收入。如果你是一个悲观的程序员，可以试试填写35。当然，如果你想中间“GAP退休”几年，可以粗略地用「法定退休年龄 减去 你想GAP退休多少年」，填在这里。</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="legalRetirementAge">法定退休年龄</label>
                            <div className="input-group">
                                <button onClick={handleDecrement(setLegalRetirementAge, legalRetirementAge)}>-</button>
                                <input
                                    type="text"
                                    id="legalRetirementAge"
                                    value={legalRetirementAge}
                                    onChange={handleInputChange(setLegalRetirementAge)}
                                />
                                <button onClick={handleIncrement(setLegalRetirementAge, legalRetirementAge)}>+</button>
                            </div>
                            <p className="note">填写你认为属于你的法定退休年龄，也就是你可以开始领养老金的年龄。</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="monthlyExpenses">每月开销 (元)</label>
                            <input
                                id="monthlyExpenses"
                                type="text"
                                value={monthlyExpenses}
                                onChange={handleInputChange(setMonthlyExpenses)}
                            />
                            <p className="note">包括你上班和不上班时每个月的开销。虽然时间跨度很大，但可以尽可能平均估算一下。</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="currentSavings">当前总储蓄和投资 (元)</label>
                            <input
                                id="currentSavings"
                                type="text"
                                value={currentSavings}
                                onChange={handleInputChange(setCurrentSavings)}
                            />
                            <p className="note">也就是你已经存了多少钱，包括你的存款和（你认为能赚到钱的）投资。</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="annualReturn">年投资回报率 (%)</label>
                            <input
                                id="annualReturn"
                                type="text"
                                value={annualReturn}
                                onChange={handleInputChange(setAnnualReturn)}
                            />
                            <p className="note">你认为你的储蓄的年投资回报率（作为参考，余额宝 1.43%；沪深300近十年平均~5%；标普500 15.6%）。</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inflationRate">年通货膨胀率 (%)</label>
                            <input
                                id="inflationRate"
                                type="text"
                                value={inflationRate}
                                onChange={handleInputChange(setInflationRate)}
                            />
                            <p className="note">说到存钱，大家都说得考虑通胀的问题，这里你可以填写你认为的长期年平均通胀率，姑且设置一个默认值2%。</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="desiredLegalRetirementSavings">法定退休时期望的储蓄金额 (元)</label>
                            <input
                                id="desiredLegalRetirementSavings"
                                type="text"
                                value={desiredLegalRetirementSavings}
                                onChange={handleInputChange(setDesiredLegalRetirementSavings)}
                            />
                            <p className="note">也就是你能领养老金的那天，你希望手里还有多少钱。无需考虑通胀，按今天的购买力来填写就行。<br />
                                通常来说，我们不希望这个数值是0，因为只靠养老金可能不能满足你的生活开销。当然，如果你认为养老金足够维持生活开销，这里可以填0。</p>
                        </div>
                    </div>
                    <div className="results">
                        <div className="result-item">
                            <label>提前退休时所需总储蓄</label>
                            <p className="value">{formatCurrency(requiredSavings)}</p>
                            <progress value={savingsProgress} max="100" className="progress" />
                            <p className="progress-text">已完成 {savingsProgress}%</p>
                        </div>
                        <div className="result-item">
                            <label>提前退休前所需月收入（到手）</label>
                            <p className="value">{formatCurrency(requiredSalary)}</p>
                        </div>
                        <div className="result-item">
                            <label>提前退休前每月需储蓄（到手减去开销）</label>
                            <p className="value">{formatCurrency(monthlySavings)}</p>
                        </div>
                        <div className="result-item">
                            <label>法定退休年龄时剩余储蓄</label>
                            <p className="value">{formatCurrency(remainingSavings)}</p>
                        </div>
                        <div className="result-item">
                            <label>储蓄增长曲线</label>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={chartData}>
                                    <XAxis dataKey="age" />
                                    <YAxis tickFormatter={formatYAxis} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Line type="monotone" dataKey="savings" stroke="#4caf50" name="累计储蓄" dot={false} />
                                    <Line type="monotone" dataKey="target" stroke="#ff7300" name="目标储蓄" strokeDasharray="5 5" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="formula">
                        <p>计算公式说明：</p>
                        <ul>
                            <li>
                                提前退休时所需总储蓄 = <Latex>{"退休时年度开支 \\times \\frac{1 - (1 + 实际回报率)^{-提前退休年数}}{实际回报率} + 法定退休时期望储蓄的现值"}</Latex>
                            </li>
                            <li>
                                提前退休前每月需储蓄 = <Latex>{"\\frac{所需总储蓄 - 当前储蓄 \\times 月复利因子}{1 - (1 + 月复利因子)^{-储蓄月数}}"}</Latex>
                            </li>
                            <li>
                                提前退休前所需月薪 = <Latex>{"每月开销 + 每月需储蓄"}</Latex>
                            </li>
                        </ul>
                        <p>
                            简单来说，这个计算器考虑了从你开始提前退休到法定退休年龄这段时间的储蓄需求，以及你在法定退休年龄时希望剩下的储蓄金额。计算过程中还考虑了通货膨胀率和投资回报率的影响。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <div className="app">
            <RetirementCalculator />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
