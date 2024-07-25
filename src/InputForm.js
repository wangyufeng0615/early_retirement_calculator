import React from 'react';

const InputForm = ({
    currentAge,
    setCurrentAge,
    earlyRetirementAge,
    setEarlyRetirementAge,
    legalRetirementAge,
    setLegalRetirementAge,
    monthlyExpenses,
    setMonthlyExpenses,
    currentSavings,
    setCurrentSavings,
    annualReturn,
    setAnnualReturn,
    inflationRate,
    setInflationRate,
    expectedSavingsAtLegalRetirement,
    setExpectedSavingsAtLegalRetirement,
}) => {
    const handleInputChange = (setter) => (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and a single decimal point
            setter(value);
        }
    };

    const handleInputBlur = (setter) => (e) => {
        const value = parseFloat(e.target.value);
        setter(isNaN(value) ? 0 : value);
    };

    const handleIncrement = (setter, value) => () => {
        setter(value + 1);
    };

    const handleDecrement = (setter, value) => () => {
        setter(value - 1);
    };

    return (
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
                        onBlur={handleInputBlur(setCurrentAge)}
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
                        onBlur={handleInputBlur(setEarlyRetirementAge)}
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
                        onBlur={handleInputBlur(setLegalRetirementAge)}
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
                    onBlur={handleInputBlur(setMonthlyExpenses)}
                />
                <p className="note">包括你上班和不上班时每个月的开销。虽然时间跨度很大，但可以尽可能平均估算一下。</p>
            </div>
            <div className="form-group">
                <label htmlFor="currentSavings">当前储蓄和投资总计 (元)</label>
                <input
                    id="currentSavings"
                    type="text"
                    value={currentSavings}
                    onChange={handleInputChange(setCurrentSavings)}
                    onBlur={handleInputBlur(setCurrentSavings)}
                />
                <p className="note">也就是你已经存了多少钱，包括你的存款和投资。</p>
            </div>
            <div className="form-group">
                <label htmlFor="annualReturn">年投资回报率 (%)</label>
                <input
                    id="annualReturn"
                    type="text"
                    value={annualReturn}
                    onChange={handleInputChange(setAnnualReturn)}
                    onBlur={handleInputBlur(setAnnualReturn)}
                />
                <p className="note">你认为你的储蓄和投资的平均年投资回报率（作为参考，余额宝 1.43%；沪深300近十年平均~5%；标普500 15.6%）。</p>
            </div>
            <div className="form-group">
                <label htmlFor="inflationRate">年通货膨胀率 (%)</label>
                <input
                    id="inflationRate"
                    type="text"
                    value={inflationRate}
                    onChange={handleInputChange(setInflationRate)}
                    onBlur={handleInputBlur(setInflationRate)}
                />
                <p className="note">说到存钱，大家都说得考虑通胀的问题，这里你可以填写你认为的长期年平均通胀率，姑且设置一个默认值2%。</p>
            </div>
            <div className="form-group">
                <label htmlFor="expectedSavingsAtLegalRetirement">法定退休时的期望储蓄 (元)</label>
                <input
                    id="expectedSavingsAtLegalRetirement"
                    type="text"
                    value={expectedSavingsAtLegalRetirement}
                    onChange={handleInputChange(setExpectedSavingsAtLegalRetirement)}
                    onBlur={handleInputBlur(setExpectedSavingsAtLegalRetirement)}
                />
                <p className="note">在法定退休年龄时你希望手里还剩下多少储蓄，按今天的购买力填写即可。一般来说，退休金不一定能满足你的日常开销，所以最好手里存一些钱。如果你认为你的退休金可以完全满足你的日常开销，这里可以填0。</p>
            </div>
        </div>
    );
};

export default InputForm;
