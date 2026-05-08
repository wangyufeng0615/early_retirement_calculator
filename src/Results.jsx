import React from 'react';
import { useTranslation } from 'react-i18next';

const ResultRow = ({ label, value, detail, emphasis = false }) => (
    <div className={`result-row ${emphasis ? 'emphasis' : ''}`}>
        <div>
            <span className="result-row-label">{label}</span>
            {detail && <p className="result-row-detail">{detail}</p>}
        </div>
        <strong>{value}</strong>
    </div>
);

const Results = (props) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'en' ? 'en-US' : 'zh-CN';

    const formatCurrency = (value) => {
        if (value === null || value === undefined || Number.isNaN(value)) {
            return t('results.notAvailable');
        }

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'CNY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatSignedCurrency = (value) => {
        if (value === null || value === undefined || Number.isNaN(value)) {
            return t('results.notAvailable');
        }

        const formatted = formatCurrency(Math.abs(value));
        return value > 0 ? `+${formatted}` : value < 0 ? `-${formatted}` : formatted;
    };

    const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;
    const {
        status,
        validationErrors = [],
        savingsProgress,
        sensitivity = []
    } = props;

    if (status === 'invalid') {
        return (
            <div className="results">
                <div className="status-banner error">
                    <strong>{t('results.invalidTitle')}</strong>
                    <ul>
                        {validationErrors.map((error) => (
                            <li key={error}>{t(`results.validationErrors.${error}`, { defaultValue: error })}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="results">
            <div className={`status-banner ${status === 'solved' ? 'success' : 'warning'}`}>
                <strong>
                    {status === 'solved' ? t('results.solvedTitle') : t('results.infeasibleTitle')}
                </strong>
                <span>
                    {status === 'solved'
                        ? t('results.solvedMessage')
                        : t('results.infeasibleMessage', { shortfall: formatCurrency(props.shortfall) })}
                </span>
            </div>

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

            <div className="result-answer">
                <span>{t('results.monthlySavings')}</span>
                <strong>{formatCurrency(props.monthlySavings)}</strong>
                <p>{t('results.monthlySavingsHelp')}</p>
            </div>

            <div className="result-section">
                <h3>{t('results.actionTitle')}</h3>
                <div className="result-list">
                    <ResultRow
                        label={t('results.requiredSavings')}
                        value={formatCurrency(props.requiredSavings)}
                        detail={t('results.requiredSavingsHelp')}
                        emphasis
                    />
                    <ResultRow
                        label={t('results.requiredSalary')}
                        value={formatCurrency(props.requiredSalary)}
                        detail={t('results.requiredSalaryHelp')}
                    />
                </div>
            </div>

            <div className="result-section">
                <h3>{t('results.checkpointTitle')}</h3>
                <div className="result-list">
                    <ResultRow
                        label={t('results.legalCheckpoint')}
                        value={`${formatCurrency(props.remainingSavings)} / ${formatCurrency(props.legalRetirementTarget)}`}
                        detail={t('results.legalCheckpointHelp', {
                            todayValue: formatCurrency(props.remainingSavingsTodayValue)
                        })}
                    />
                    <ResultRow
                        label={t('results.planningEndSavings')}
                        value={formatCurrency(props.planningEndSavings)}
                        detail={t('results.planningEndSavingsHelp', {
                            todayValue: formatCurrency(props.planningEndSavingsTodayValue)
                        })}
                    />
                    <ResultRow
                        label={t('results.realAnnualReturn')}
                        value={formatPercent(props.realAnnualReturn)}
                        detail={t('results.realAnnualReturnHelp')}
                    />
                </div>
            </div>

            {sensitivity.length > 0 && (
                <div className="sensitivity-section">
                    <h3>{t('results.sensitivityTitle')}</h3>
                    <p>{t('results.sensitivityDesc')}</p>
                    <table className="result-table">
                        <tbody>
                            {sensitivity.map((item) => (
                                <tr key={item.key}>
                                    <td>{t(`results.sensitivity.${item.key}`)}</td>
                                    <td>{formatCurrency(item.monthlySavings)}</td>
                                    <td className={item.deltaMonthlySavings > 0 ? 'risk-delta' : ''}>
                                        {formatSignedCurrency(item.deltaMonthlySavings)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="assumption-note">{t('results.assumptionNote')}</p>
        </div>
    );
};

export default Results;
