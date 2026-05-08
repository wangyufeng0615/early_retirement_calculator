import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const FieldInput = ({
    id,
    label,
    note,
    value,
    unit,
    hasError,
    onChange,
    onBlur,
    onIncrement,
    onDecrement,
    inputMode = 'decimal',
    t
}) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <p id={`${id}-note`} className="field-note">{note}</p>
        <div className={`input-group ${onIncrement ? 'with-stepper' : ''}`}>
            {onDecrement && (
                <button
                    type="button"
                    onClick={onDecrement}
                    aria-label={t('inputForm.decrease', { field: label })}
                >
                    -
                </button>
            )}
            <input
                type="text"
                id={id}
                value={value}
                inputMode={inputMode}
                aria-describedby={`${id}-note`}
                onChange={onChange}
                onBlur={onBlur}
                className={hasError ? 'input-error' : ''}
            />
            {onIncrement && (
                <button
                    type="button"
                    onClick={onIncrement}
                    aria-label={t('inputForm.increase', { field: label })}
                >
                    +
                </button>
            )}
            {unit && <span className="input-unit">{unit}</span>}
        </div>
    </div>
);

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
    monthlyPension,
    setMonthlyPension,
    planningEndAge,
    setPlanningEndAge,
}) => {
    const { t } = useTranslation();
    const [inputErrors, setInputErrors] = useState({});
    
    // 维护输入框的显示值（字符串形式）
    const [inputValues, setInputValues] = useState({
        currentAge: currentAge.toString(),
        earlyRetirementAge: earlyRetirementAge.toString(),
        legalRetirementAge: legalRetirementAge.toString(),
        monthlyExpenses: monthlyExpenses.toString(),
        currentSavings: currentSavings.toString(),
        annualReturn: annualReturn.toString(),
        inflationRate: inflationRate.toString(),
        expectedSavingsAtLegalRetirement: expectedSavingsAtLegalRetirement.toString(),
        monthlyPension: monthlyPension.toString(),
        planningEndAge: planningEndAge.toString(),
    });

    // 同步外部props的变化到显示值
    useEffect(() => {
        setInputValues({
            currentAge: currentAge.toString(),
            earlyRetirementAge: earlyRetirementAge.toString(),
            legalRetirementAge: legalRetirementAge.toString(),
            monthlyExpenses: monthlyExpenses.toString(),
            currentSavings: currentSavings.toString(),
            annualReturn: annualReturn.toString(),
            inflationRate: inflationRate.toString(),
            expectedSavingsAtLegalRetirement: expectedSavingsAtLegalRetirement.toString(),
            monthlyPension: monthlyPension.toString(),
            planningEndAge: planningEndAge.toString(),
        });
    }, [currentAge, earlyRetirementAge, legalRetirementAge, monthlyExpenses, currentSavings, annualReturn, inflationRate, expectedSavingsAtLegalRetirement, monthlyPension, planningEndAge]);

    const handleInputChange = (setter, validator, field) => (e) => {
        const value = e.target.value;
        const isValid = validator(value);
        
        // 更新输入框显示值
        setInputValues(prev => ({ ...prev, [field]: value }));
        
        // 验证并设置错误状态
        if (isValid) {
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        } else {
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: true }));
        }
        
        // 立即更新计算值，确保实时计算
        if (value === '' || value === '.' || value === '-' || value === '-.') {
            setter(0);  // 空值设为0
        } else if (isValid) {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                setter(numValue);  // 传递数字类型
            }
        } else {
            setter(NaN);
        }
    };

    const handleInputBlur = (setter, validator, field) => (e) => {
        const inputValue = e.target.value;
        
        // 如果输入为空，设置为0
        if (inputValue === '' || inputValue === '.' || inputValue === '-' || inputValue === '-.') {
            setter(0);
            setInputValues(prev => ({ ...prev, [field]: '0' }));
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
            return;
        }
        
        const numValue = parseFloat(inputValue);
        if (isNaN(numValue) || !validator(numValue)) {
            setter(NaN);
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: true }));
        } else {
            setter(numValue);
            setInputValues(prev => ({ ...prev, [field]: numValue.toString() }));
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        }
    };

    const handleIncrement = (setter, value, validator, field) => () => {
        const newValue = value + 1;
        if (validator(newValue)) {
            setter(newValue);
            setInputValues(prev => ({ ...prev, [field]: newValue.toString() }));
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        } else {
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: true }));
        }
    };

    const handleDecrement = (setter, value, validator, field) => () => {
        const newValue = value - 1;
        if (validator(newValue)) {
            setter(newValue);
            setInputValues(prev => ({ ...prev, [field]: newValue.toString() }));
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        } else {
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: true }));
        }
    };

    const numberValidator = (value) => {
        // 允许空字符串（正在输入时）
        if (value === '') return true;
        // 允许小数点开头或结尾（正在输入时）
        if (value === '.') return true;
        // 验证数字格式并且大于等于0
        return /^\d*\.?\d*$/.test(value) && (value === '' || parseFloat(value) >= 0);
    };

    const rateValidator = (value) => {
        const normalizedValue = String(value);
        if (normalizedValue === '' || normalizedValue === '-' || normalizedValue === '.' || normalizedValue === '-.') {
            return true;
        }

        return /^-?\d*\.?\d*$/.test(normalizedValue) && parseFloat(normalizedValue) > -100;
    };
    
    const integerValidator = (value) => {
        // 允许空字符串（正在输入时）
        if (value === '') return true;
        const num = parseFloat(value);
        return Number.isInteger(num) && num >= 0;
    };

    return (
        <div className="input-form">
            <div className="form-section">
                <h3 className="section-title">{t('inputForm.ageSettings')}</h3>
                <p className="section-intro">{t('inputForm.ageSettingsIntro')}</p>
                <div className="form-row">
                    <FieldInput
                        id="currentAge"
                        label={t('inputForm.currentAge')}
                        note={t('inputForm.currentAgeDesc')}
                        value={inputValues.currentAge}
                        unit={t('inputForm.ageUnit')}
                        hasError={inputErrors.currentAge}
                        onChange={handleInputChange(setCurrentAge, numberValidator, 'currentAge')}
                        onBlur={handleInputBlur(setCurrentAge, integerValidator, 'currentAge')}
                        onDecrement={handleDecrement(setCurrentAge, currentAge, integerValidator, 'currentAge')}
                        onIncrement={handleIncrement(setCurrentAge, currentAge, integerValidator, 'currentAge')}
                        inputMode="numeric"
                        t={t}
                    />
                    <FieldInput
                        id="earlyRetirementAge"
                        label={t('inputForm.earlyRetirementAge')}
                        note={t('inputForm.earlyRetirementDesc')}
                        value={inputValues.earlyRetirementAge}
                        unit={t('inputForm.ageUnit')}
                        hasError={inputErrors.earlyRetirementAge}
                        onChange={handleInputChange(setEarlyRetirementAge, numberValidator, 'earlyRetirementAge')}
                        onBlur={handleInputBlur(setEarlyRetirementAge, integerValidator, 'earlyRetirementAge')}
                        onDecrement={handleDecrement(setEarlyRetirementAge, earlyRetirementAge, integerValidator, 'earlyRetirementAge')}
                        onIncrement={handleIncrement(setEarlyRetirementAge, earlyRetirementAge, integerValidator, 'earlyRetirementAge')}
                        inputMode="numeric"
                        t={t}
                    />
                    <FieldInput
                        id="legalRetirementAge"
                        label={t('inputForm.legalRetirementAge')}
                        note={t('inputForm.legalRetirementDesc')}
                        value={inputValues.legalRetirementAge}
                        unit={t('inputForm.ageUnit')}
                        hasError={inputErrors.legalRetirementAge}
                        onChange={handleInputChange(setLegalRetirementAge, numberValidator, 'legalRetirementAge')}
                        onBlur={handleInputBlur(setLegalRetirementAge, integerValidator, 'legalRetirementAge')}
                        onDecrement={handleDecrement(setLegalRetirementAge, legalRetirementAge, integerValidator, 'legalRetirementAge')}
                        onIncrement={handleIncrement(setLegalRetirementAge, legalRetirementAge, integerValidator, 'legalRetirementAge')}
                        inputMode="numeric"
                        t={t}
                    />
                    <FieldInput
                        id="planningEndAge"
                        label={t('inputForm.planningEndAge')}
                        note={t('inputForm.planningEndDesc')}
                        value={inputValues.planningEndAge}
                        unit={t('inputForm.ageUnit')}
                        hasError={inputErrors.planningEndAge}
                        onChange={handleInputChange(setPlanningEndAge, numberValidator, 'planningEndAge')}
                        onBlur={handleInputBlur(setPlanningEndAge, integerValidator, 'planningEndAge')}
                        onDecrement={handleDecrement(setPlanningEndAge, planningEndAge, integerValidator, 'planningEndAge')}
                        onIncrement={handleIncrement(setPlanningEndAge, planningEndAge, integerValidator, 'planningEndAge')}
                        inputMode="numeric"
                        t={t}
                    />
                </div>
            </div>

            <div className="form-section">
                <h3 className="section-title">{t('inputForm.financialStatus')}</h3>
                <p className="section-intro">{t('inputForm.financialStatusIntro')}</p>
                <div className="form-row">
                    <FieldInput
                        id="monthlyExpenses"
                        label={t('inputForm.monthlyExpenses')}
                        note={t('inputForm.monthlyExpensesDesc')}
                        value={inputValues.monthlyExpenses}
                        unit={t('inputForm.currencyUnit')}
                        hasError={inputErrors.monthlyExpenses}
                        onChange={handleInputChange(setMonthlyExpenses, numberValidator, 'monthlyExpenses')}
                        onBlur={handleInputBlur(setMonthlyExpenses, numberValidator, 'monthlyExpenses')}
                        t={t}
                    />
                    <FieldInput
                        id="currentSavings"
                        label={t('inputForm.currentSavings')}
                        note={t('inputForm.currentSavingsDesc')}
                        value={inputValues.currentSavings}
                        unit={t('inputForm.currencyUnit')}
                        hasError={inputErrors.currentSavings}
                        onChange={handleInputChange(setCurrentSavings, numberValidator, 'currentSavings')}
                        onBlur={handleInputBlur(setCurrentSavings, numberValidator, 'currentSavings')}
                        t={t}
                    />
                    <FieldInput
                        id="monthlyPension"
                        label={t('inputForm.monthlyPension')}
                        note={t('inputForm.monthlyPensionDesc')}
                        value={inputValues.monthlyPension}
                        unit={t('inputForm.currencyUnit')}
                        hasError={inputErrors.monthlyPension}
                        onChange={handleInputChange(setMonthlyPension, numberValidator, 'monthlyPension')}
                        onBlur={handleInputBlur(setMonthlyPension, numberValidator, 'monthlyPension')}
                        t={t}
                    />
                    <FieldInput
                        id="expectedSavingsAtLegalRetirement"
                        label={t('inputForm.expectedSavingsAtLegalRetirement')}
                        note={t('inputForm.expectedSavingsDesc')}
                        value={inputValues.expectedSavingsAtLegalRetirement}
                        unit={t('inputForm.currencyUnit')}
                        hasError={inputErrors.expectedSavingsAtLegalRetirement}
                        onChange={handleInputChange(setExpectedSavingsAtLegalRetirement, numberValidator, 'expectedSavingsAtLegalRetirement')}
                        onBlur={handleInputBlur(setExpectedSavingsAtLegalRetirement, numberValidator, 'expectedSavingsAtLegalRetirement')}
                        t={t}
                    />
                </div>
            </div>

            <div className="form-section">
                <h3 className="section-title">{t('inputForm.investmentParams')}</h3>
                <p className="section-intro">{t('inputForm.investmentParamsIntro')}</p>
                <div className="form-row">
                    <FieldInput
                        id="annualReturn"
                        label={t('inputForm.annualReturn')}
                        note={t('inputForm.annualReturnDesc')}
                        value={inputValues.annualReturn}
                        unit={t('inputForm.percentUnit')}
                        hasError={inputErrors.annualReturn}
                        onChange={handleInputChange(setAnnualReturn, rateValidator, 'annualReturn')}
                        onBlur={handleInputBlur(setAnnualReturn, rateValidator, 'annualReturn')}
                        t={t}
                    />
                    <FieldInput
                        id="inflationRate"
                        label={t('inputForm.inflationRate')}
                        note={t('inputForm.inflationRateDesc')}
                        value={inputValues.inflationRate}
                        unit={t('inputForm.percentUnit')}
                        hasError={inputErrors.inflationRate}
                        onChange={handleInputChange(setInflationRate, rateValidator, 'inflationRate')}
                        onBlur={handleInputBlur(setInflationRate, rateValidator, 'inflationRate')}
                        t={t}
                    />
                </div>
            </div>
        </div>
    );
};

export default InputForm;
