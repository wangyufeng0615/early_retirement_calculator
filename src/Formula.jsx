import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { useTranslation } from 'react-i18next';

const Formula = () => {
    const { t } = useTranslation();
    
    return (
        <div className="formula">
            <div className="formula-section">
                <h4>{t('formula.coreAlgorithm')}</h4>
                <p>{t('formula.coreDesc')}</p>
            </div>
            
            <div className="formula-section">
                <h4>{t('formula.realReturnRate')}</h4>
                <p>{t('formula.realReturnDesc')}</p>
                <div className="formula-container">
                    <BlockMath>
                        {"r_{real} = \\frac{1 + r_{nominal}}{1 + r_{inflation}} - 1"}
                    </BlockMath>
                </div>
                <p>{t('formula.realReturnNote')}</p>
            </div>

            <div className="formula-section">
                <h4>{t('formula.savingsTrajectory')}</h4>
                <p>{t('formula.savingsTrajectoryDesc')}</p>
                
                <p><strong>{t('formula.workingPeriod')}</strong></p>
                <div className="formula-container">
                    <BlockMath>
                        {"S_{t+1} = S_t \\times (1 + r) + M_{save} \\times 12"}
                    </BlockMath>
                </div>
                
                <p><strong>{t('formula.earlyRetirementPeriod')}</strong></p>
                <div className="formula-container">
                    <BlockMath>
                        {"S_{t+1} = S_t \\times (1 + r) - E_t"}
                    </BlockMath>
                </div>
                
                <p><strong>{t('formula.legalRetirementPeriod')}</strong></p>
                <div className="formula-container">
                    <BlockMath>
                        {"S_{t+1} = S_t \\times (1 + r) - \\max(0, E_t - P_t)"}
                    </BlockMath>
                </div>
                
                <p>{t('formula.where')}</p>
                <ul>
                    {t('formula.variables', { returnObjects: true }).map((variable, index) => (
                        <li key={index}><InlineMath>{variable.split(' = ')[0]}</InlineMath> = {variable.split(' = ')[1]}</li>
                    ))}
                </ul>
            </div>

            <div className="formula-section">
                <h4>{t('formula.inflationAdjustment')}</h4>
                <div className="formula-container">
                    <BlockMath>
                        {"E_t = E_0 \\times (1 + r_{inflation})^t"}
                    </BlockMath>
                </div>
                <div className="formula-container">
                    <BlockMath>
                        {"P_t = P_0 \\times (1 + r_{inflation})^t"}
                    </BlockMath>
                </div>
                <p>{t('formula.inflationNote')}</p>
            </div>

            <div className="formula-section">
                <h4>{t('formula.constraints')}</h4>
                <p>{t('formula.constraintsDesc')}</p>
                <ul>
                    {t('formula.constraintsList', { returnObjects: true }).map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                    ))}
                </ul>
            </div>

            <div className="formula-section">
                <h4>{t('formula.assumptions')}</h4>
                <ul>
                    {t('formula.assumptionsList', { returnObjects: true }).map((assumption, index) => (
                        <li key={index}>{assumption}</li>
                    ))}
                </ul>
            </div>

            <div className="formula-section">
                <p><em>{t('formula.note')}</em></p>
            </div>
        </div>
    );
};

export default Formula;