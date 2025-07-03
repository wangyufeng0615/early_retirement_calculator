import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Tooltip组件
const Tooltip = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    // 检测是否为移动设备
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 监听点击外部区域
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setIsVisible(false);
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isVisible]);

    const handleTriggerClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(!isVisible);
    };

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsVisible(false);
        }
    };

    return (
        <div className="tooltip-container" ref={tooltipRef}>
            <div 
                className="tooltip-trigger"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleTriggerClick}
            >
                {children}
            </div>
            {isVisible && (
                <div className="tooltip-content">
                    {content}
                </div>
            )}
        </div>
    );
};

// 问号图标组件
const QuestionIcon = ({ tooltip }) => (
    <Tooltip content={tooltip}>
        <span className="question-icon">?</span>
    </Tooltip>
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
        });
    }, [currentAge, earlyRetirementAge, legalRetirementAge, monthlyExpenses, currentSavings, annualReturn, inflationRate, expectedSavingsAtLegalRetirement, monthlyPension]);

    const handleInputChange = (setter, validator, field) => (e) => {
        const value = e.target.value;
        
        // 更新输入框显示值
        setInputValues(prev => ({ ...prev, [field]: value }));
        
        // 验证并设置错误状态
        if (validator(value)) {
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        } else {
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: true }));
        }
        
        // 立即更新计算值，确保实时计算
        if (value === '' || value === '.') {
            setter(0);  // 空值设为0
        } else {
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue >= 0) {
                setter(numValue);  // 传递数字类型
            } else {
                // 对于无效值，不更新计算值，保持原值
                // setter保持不变，这样计算不会受到影响
            }
        }
    };

    const handleInputBlur = (setter, validator, field) => (e) => {
        const inputValue = e.target.value;
        
        // 如果输入为空，设置为0
        if (inputValue === '' || inputValue === '.') {
            setter(0);
            setInputValues(prev => ({ ...prev, [field]: '0' }));
            setInputErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
            return;
        }
        
        const numValue = parseFloat(inputValue);
        if (isNaN(numValue) || !validator(numValue)) {
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
    
    const integerValidator = (value) => {
        // 允许空字符串（正在输入时）
        if (value === '') return true;
        const num = parseFloat(value);
        return Number.isInteger(num) && num >= 0;
    };

    return (
        <div className="input-form">
            {/* 第一组：年龄信息 */}
            <div className="form-section">
                <h3 className="section-title">{t('inputForm.ageSettings')}</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="currentAge">
                            {t('inputForm.currentAge')}
                        </label>
                        <div className="input-group">
                            <button onClick={handleDecrement(setCurrentAge, currentAge, integerValidator, 'currentAge')}>-</button>
                            <input
                                type="text"
                                id="currentAge"
                                value={inputValues.currentAge}
                                onChange={handleInputChange(setCurrentAge, numberValidator, 'currentAge')}
                                onBlur={handleInputBlur(setCurrentAge, integerValidator, 'currentAge')}
                                className={inputErrors.currentAge ? 'input-error' : ''}
                            />
                            <button onClick={handleIncrement(setCurrentAge, currentAge, integerValidator, 'currentAge')}>+</button>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="earlyRetirementAge" className="important-label">
                            {t('inputForm.earlyRetirementAge')}
                            <QuestionIcon tooltip={t('inputForm.earlyRetirementTooltip')} />
                        </label>
                        <p className="note">{t('inputForm.earlyRetirementDesc')}</p>
                        <div className="input-group">
                            <button onClick={handleDecrement(setEarlyRetirementAge, earlyRetirementAge, integerValidator, 'earlyRetirementAge')}>-</button>
                            <input
                                type="text"
                                id="earlyRetirementAge"
                                value={inputValues.earlyRetirementAge}
                                onChange={handleInputChange(setEarlyRetirementAge, numberValidator, 'earlyRetirementAge')}
                                onBlur={handleInputBlur(setEarlyRetirementAge, integerValidator, 'earlyRetirementAge')}
                                className={inputErrors.earlyRetirementAge ? 'input-error' : ''}
                            />
                            <button onClick={handleIncrement(setEarlyRetirementAge, earlyRetirementAge, integerValidator, 'earlyRetirementAge')}>+</button>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="legalRetirementAge">
                            {t('inputForm.legalRetirementAge')}
                            <QuestionIcon tooltip={t('inputForm.legalRetirementTooltip')} />
                        </label>
                        <p className="note">{t('inputForm.legalRetirementDesc')}</p>
                        <div className="input-group">
                            <button onClick={handleDecrement(setLegalRetirementAge, legalRetirementAge, integerValidator, 'legalRetirementAge')}>-</button>
                            <input
                                type="text"
                                id="legalRetirementAge"
                                value={inputValues.legalRetirementAge}
                                onChange={handleInputChange(setLegalRetirementAge, numberValidator, 'legalRetirementAge')}
                                onBlur={handleInputBlur(setLegalRetirementAge, integerValidator, 'legalRetirementAge')}
                                className={inputErrors.legalRetirementAge ? 'input-error' : ''}
                            />
                            <button onClick={handleIncrement(setLegalRetirementAge, legalRetirementAge, integerValidator, 'legalRetirementAge')}>+</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 第二组：财务信息 */}
            <div className="form-section">
                <h3 className="section-title">{t('inputForm.financialStatus')}</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="monthlyExpenses">
                            {t('inputForm.monthlyExpenses')}
                            <QuestionIcon tooltip={t('inputForm.monthlyExpensesTooltip')} />
                        </label>
                        <p className="note">{t('inputForm.monthlyExpensesDesc')}</p>
                        <div className="input-group">
                            <input
                                id="monthlyExpenses"
                                type="text"
                                value={inputValues.monthlyExpenses}
                                onChange={handleInputChange(setMonthlyExpenses, numberValidator, 'monthlyExpenses')}
                                onBlur={handleInputBlur(setMonthlyExpenses, numberValidator, 'monthlyExpenses')}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="currentSavings">
                            {t('inputForm.currentSavings')}
                            <QuestionIcon tooltip={t('inputForm.currentSavingsTooltip')} />
                        </label>
                        <p className="note">{t('inputForm.currentSavingsDesc')}</p>
                        <div className="input-group">
                            <input
                                id="currentSavings"
                                type="text"
                                value={inputValues.currentSavings}
                                onChange={handleInputChange(setCurrentSavings, numberValidator, 'currentSavings')}
                                onBlur={handleInputBlur(setCurrentSavings, numberValidator, 'currentSavings')}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="monthlyPension">
                            {t('inputForm.monthlyPension')}
                            <QuestionIcon tooltip={t('inputForm.monthlyPensionTooltip')} />
                        </label>
                        <p className="note">{t('inputForm.monthlyPensionDesc')}</p>
                        <div className="input-group">
                            <input
                                id="monthlyPension"
                                type="text"
                                value={inputValues.monthlyPension}
                                onChange={handleInputChange(setMonthlyPension, numberValidator, 'monthlyPension')}
                                onBlur={handleInputBlur(setMonthlyPension, numberValidator, 'monthlyPension')}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="expectedSavingsAtLegalRetirement">
                            {t('inputForm.expectedSavingsAtLegalRetirement')}
                            <QuestionIcon tooltip={t('inputForm.expectedSavingsTooltip')} />
                        </label>
                        <p className="note">{t('inputForm.expectedSavingsDesc')}</p>
                        <div className="input-group">
                            <input
                                id="expectedSavingsAtLegalRetirement"
                                type="text"
                                value={inputValues.expectedSavingsAtLegalRetirement}
                                onChange={handleInputChange(setExpectedSavingsAtLegalRetirement, numberValidator, 'expectedSavingsAtLegalRetirement')}
                                onBlur={handleInputBlur(setExpectedSavingsAtLegalRetirement, numberValidator, 'expectedSavingsAtLegalRetirement')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 第三组：投资参数 */}
            <div className="form-section">
                <h3 className="section-title">{t('inputForm.investmentParams')}</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="annualReturn">
                            {t('inputForm.annualReturn')}
                            <QuestionIcon tooltip={t('inputForm.annualReturnTooltip')} />
                        </label>
                        <p className="note">{t('inputForm.annualReturnDesc')}</p>
                        <div className="input-group">
                            <input
                                id="annualReturn"
                                type="text"
                                value={inputValues.annualReturn}
                                onChange={handleInputChange(setAnnualReturn, numberValidator, 'annualReturn')}
                                onBlur={handleInputBlur(setAnnualReturn, numberValidator, 'annualReturn')}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="inflationRate">
                            {t('inputForm.inflationRate')}
                            <QuestionIcon tooltip={t('inputForm.inflationRateTooltip')} />
                        </label>
                        <p className="note">{t('inputForm.inflationRateDesc')}</p>
                        <div className="input-group">
                            <input
                                id="inflationRate"
                                type="text"
                                value={inputValues.inflationRate}
                                onChange={handleInputChange(setInflationRate, numberValidator, 'inflationRate')}
                                onBlur={handleInputBlur(setInflationRate, numberValidator, 'inflationRate')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputForm;
