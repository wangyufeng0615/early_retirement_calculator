import React from 'react';
import { useTranslation } from 'react-i18next';

const Results = (props) => {
    const { t } = useTranslation();
    
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const { savingsProgress } = props;

    return (
        <div className="results">
            {/* 进度条 */}
            <div className="progress-section">
                <p className="progress-text">
                    {t('results.progressText', { progress: savingsProgress })}
                </p>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${savingsProgress}%` }}
                    ></div>
                </div>
            </div>

            {/* 结果表格 */}
            <table className="result-table">
                <tbody>
                    <tr>
                        <td>{t('results.requiredSavings')}</td>
                        <td>{formatCurrency(props.requiredSavings)}</td>
                    </tr>
                    <tr>
                        <td className="highlight">{t('results.monthlySavings')}</td>
                        <td className="highlight">{formatCurrency(props.monthlySavings)}</td>
                    </tr>
                    {/* 移除"需要的年收入"行 */}
                    {/* 其他结果 */}
                </tbody>
            </table>
        </div>
    );
};

export default Results;
