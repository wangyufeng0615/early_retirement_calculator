import React, { useState } from 'react';

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
    const [inputErrors, setInputErrors] = useState({});

    const handleInputChange = (setter, validator, field) => (e) => {
        const value = e.target.value;
        if (validator(value)) {
            setter(value);
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        } else {
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: true }));
        }
    };

    const handleInputBlur = (setter, validator, field) => (e) => {
        const value = parseFloat(e.target.value);
        if (!validator(value)) {
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: true }));
        } else {
            setter(value);
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        }
    };

    const handleIncrement = (setter, value, validator, field) => () => {
        const newValue = value + 1;
        if (validator(newValue)) {
            setter(newValue);
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        } else {
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: true }));
        }
    };

    const handleDecrement = (setter, value, validator, field) => () => {
        const newValue = value - 1;
        if (validator(newValue)) {
            setter(newValue);
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        } else {
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: true }));
        }
    };

    const numberValidator = (value) => /^\d*\.?\d*$/.test(value) && value >= 0;
    const integerValidator = (value) => Number.isInteger(value) && value >= 0;

    return (
        <div className="input-form">
            <div className="form-group">
                <label htmlFor="currentAge">你的当前年龄</label>
                <div className="input-group">
                    <button onClick={handleDecrement(setCurrentAge, currentAge, integerValidator, 'currentAge')}>-</button>
                    <input
                        type="text"
                        id="currentAge"
                        value={currentAge}
                        onChange={handleInputChange(setCurrentAge, numberValidator, 'currentAge')}
                        onBlur={handleInputBlur(setCurrentAge, integerValidator, 'currentAge')}
                        className={inputErrors.currentAge ? 'input-error' : ''}
                    />
                    <button onClick={handleIncrement(setCurrentAge, currentAge, integerValidator, 'currentAge')}>+</button>
                </div>
                <p className="note">请输入你的当前年龄，比如29。</p>
            </div>
            <div className="form-group">
                <label htmlFor="earlyRetirementAge">提前退休年龄</label>
                <div className="input-group">
                    <button onClick={handleDecrement(setEarlyRetirementAge, earlyRetirementAge, integerValidator, 'earlyRetirementAge')}>-</button>
                    <input
                        type="text"
                        id="earlyRetirementAge"
                        value={earlyRetirementAge}
                        onChange={handleInputChange(setEarlyRetirementAge, numberValidator, 'earlyRetirementAge')}
                        onBlur={handleInputBlur(setEarlyRetirementAge, integerValidator, 'earlyRetirementAge')}
                        className={inputErrors.earlyRetirementAge ? 'input-error' : ''}
                    />
                    <button onClick={handleIncrement(setEarlyRetirementAge, earlyRetirementAge, integerValidator, 'earlyRetirementAge')}>+</button>
                </div>
                <p className="note">也就是你打算从多少岁开始就主动提前退休了（或者没班可上了），比如40岁，计算器假设从这年之后，你就没有收入了。比如，你是一个悲观的程序员，可以试试填写35。当然，如果你想中间GAP几年，可以粗略地用「法定退休年龄」减去「你想GAP多少年」然后填入。</p>
            </div>
            <div className="form-group">
                <label htmlFor="legalRetirementAge">法定退休年龄</label>
                <div className="input-group">
                    <button onClick={handleDecrement(setLegalRetirementAge, legalRetirementAge, integerValidator, 'legalRetirementAge')}>-</button>
                    <input
                        type="text"
                        id="legalRetirementAge"
                        value={legalRetirementAge}
                        onChange={handleInputChange(setLegalRetirementAge, numberValidator, 'legalRetirementAge')}
                        onBlur={handleInputBlur(setLegalRetirementAge, integerValidator, 'legalRetirementAge')}
                        className={inputErrors.legalRetirementAge ? 'input-error' : ''}
                    />
                    <button onClick={handleIncrement(setLegalRetirementAge, legalRetirementAge, integerValidator, 'legalRetirementAge')}>+</button>
                </div>
                <p className="note">填写你认为属于你的法定退休年龄，也就是你开始领养老金的年龄。简单起见，本计算器不操心你法定退休后的事，也就是认为你法定退休后，收入是够用的（即替代率为100%）</p>
            </div>
            <div className="form-group">
                <label htmlFor="monthlyExpenses">每月开销 (元)</label>
                <div className="input-group">
                    <input
                        id="monthlyExpenses"
                        type="text"
                        value={monthlyExpenses}
                        onChange={handleInputChange(setMonthlyExpenses, numberValidator)}
                        onBlur={handleInputBlur(setMonthlyExpenses, numberValidator, setMonthlyExpenses)}
                    />
                </div>
                <p className="note">包括你上班和提前退休后每个月的平均开销。虽然时间跨度很大，但可以根据你的消费习惯，尽可能估算一下。</p>
            </div>
            <div className="form-group">
                <label htmlFor="currentSavings">当前储蓄总计 (元)</label>
                <div className="input-group">
                    <input
                        id="currentSavings"
                        type="text"
                        value={currentSavings}
                        onChange={handleInputChange(setCurrentSavings, numberValidator)}
                        onBlur={handleInputBlur(setCurrentSavings, numberValidator, setCurrentSavings)}
                    />
                </div>
                <p className="note">也就是你已经存了多少钱，包括你的存款和中低风险投资，负债就不推荐算进来了。</p>
            </div>
            <div className="form-group">
                <label htmlFor="annualReturn">年投资回报率 (%)</label>
                <div className="input-group">
                    <input
                        id="annualReturn"
                        type="text"
                        value={annualReturn}
                        onChange={handleInputChange(setAnnualReturn, numberValidator)}
                        onBlur={handleInputBlur(setAnnualReturn, numberValidator, setAnnualReturn)}
                    />
                </div>
                <p className="note">你认为你的储蓄和投资的平均年投资回报率。参考数据：余额宝 1.43%；沪深300近十年平均 5%；标普500 15.6%）。</p>
            </div>
            <div className="form-group">
                <label htmlFor="inflationRate">年通货膨胀率 (%)</label>
                <div className="input-group">
                    <input
                        id="inflationRate"
                        type="text"
                        value={inflationRate}
                        onChange={handleInputChange(setInflationRate, numberValidator)}
                        onBlur={handleInputBlur(setInflationRate, numberValidator, setInflationRate)}
                    />
                </div>
                <p className="note">考虑到通胀，你存的钱会变得更不值钱。你可以填写你认为的长期年平均通胀率。暂且设置一个默认值2%。</p>
            </div>
            <div className="form-group">
                <label htmlFor="expectedSavingsAtLegalRetirement">法定退休时的期望储蓄 (元)</label>
                <div className="input-group">
                    <input
                        id="expectedSavingsAtLegalRetirement"
                        type="text"
                        value={expectedSavingsAtLegalRetirement}
                        onChange={handleInputChange(setExpectedSavingsAtLegalRetirement, numberValidator)}
                        onBlur={handleInputBlur(setExpectedSavingsAtLegalRetirement, numberValidator, setExpectedSavingsAtLegalRetirement)}
                    />
                </div>
                <p className="note">到了法定退休年龄时，你希望手里还剩下多少储蓄，按当下的购买力填写即可。一般来说，退休金不一定能满足你的日常开销，所以最好手里存一些钱。如果你认为你的退休金可以完全满足你的日常开销（也就是替代率100%），这里可以填0。</p>
            </div>
        </div>
    );
};

export default InputForm;
