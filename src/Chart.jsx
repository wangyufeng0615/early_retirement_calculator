import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

const CHART_COPY_VERSION = 'asset-spend-copy-20260508b';

const Chart = ({ data, earlyRetirementAge, legalRetirementAge, currentAge, status }) => {
    const { t, i18n } = useTranslation();
    const [showYAxis, setShowYAxis] = useState(true);
    const [chartHeight, setChartHeight] = useState(350);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const locale = i18n.language === 'en' ? 'en-US' : 'zh-CN';
    const hasData = Array.isArray(data) && data.length > 0;

    useEffect(() => {
        const updateChartConfig = () => {
            const width = window.innerWidth;
            const mobile = width <= 600;
            const tablet = width > 600 && width <= 768;

            setIsMobile(mobile);
            setIsTablet(tablet);

            if (mobile) {
                setChartHeight(280);
            } else if (tablet) {
                setChartHeight(320);
            } else {
                setChartHeight(350);
            }
        };

        updateChartConfig();
        window.addEventListener('resize', updateChartConfig);
        return () => window.removeEventListener('resize', updateChartConfig);
    }, []);

    const toggleYAxis = () => {
        setShowYAxis(!showYAxis);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'CNY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value || 0);
    };

    const formatCompact = (value) => {
        return new Intl.NumberFormat(locale, {
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value || 0);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const {
                phase,
                savings,
                closingSavings,
                expenses,
                pension,
                assetReturn,
                contribution,
                incomeNeeded,
                withdrawal
            } = payload[0].payload;
            const isWorking = phase === 'working';
            const isLegalRetirement = phase === 'legalRetirement';
            const isCurrentAge = label === currentAge;
            const isRetirementAge = label === earlyRetirementAge;
            const isLegalRetirementAge = label === legalRetirementAge;

            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: 'white',
                    padding: isMobile ? '8px' : '12px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: isMobile ? '12px' : '14px',
                    maxWidth: isMobile ? '260px' : '320px'
                }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#2c3e50' }}>
                        {t('chart.tooltipAge', { age: label })}
                        {isCurrentAge && <span style={{ color: '#e74c3c', marginLeft: '8px' }}>{t('chart.currentMarker')}</span>}
                        {isRetirementAge && <span style={{ color: '#3498db', marginLeft: '8px' }}>{t('chart.earlyMarker')}</span>}
                        {isLegalRetirementAge && <span style={{ color: '#8e44ad', marginLeft: '8px' }}>{t('chart.legalMarker')}</span>}
                    </p>
                    <p style={{ margin: '4px 0', color: '#27ae60', fontWeight: '500' }}>
                        {t('chart.tooltipOpeningSavings', { value: formatCurrency(savings) })}
                    </p>
                    <p style={{ margin: '4px 0', color: '#1f618d' }}>
                        {t('chart.tooltipClosingSavings', { value: formatCurrency(closingSavings) })}
                    </p>
                    <p style={{ margin: '4px 0', color: '#8e44ad' }}>
                        {t(isWorking ? 'chart.tooltipWorkExpenses' : 'chart.tooltipExpenses', { value: formatCurrency(expenses) })}
                    </p>
                    {isLegalRetirement && (
                        <p style={{ margin: '4px 0', color: '#16a085' }}>
                            {t('chart.tooltipPension', { value: formatCurrency(pension) })}
                        </p>
                    )}
                    {isWorking && (
                        <p style={{ margin: '4px 0', color: '#6c3483' }}>
                            {t('chart.tooltipIncomeNeeded', { value: formatCurrency(incomeNeeded) })}
                        </p>
                    )}
                    {isWorking && (
                        <p style={{ margin: '4px 0', color: '#34495e' }}>
                            {t('chart.tooltipContribution', { value: formatCurrency(contribution) })}
                        </p>
                    )}
                    <p style={{ margin: '4px 0', color: '#7f8c8d' }}>
                        {t('chart.tooltipWithdrawal', { value: formatCurrency(withdrawal) })}
                    </p>
                    <p style={{ margin: '4px 0 0 0', color: '#3498db', fontSize: isMobile ? '11px' : '13px' }}>
                        {t('chart.tooltipAssetReturn', { value: formatCurrency(assetReturn) })}
                    </p>
                </div>
            );
        }
        return null;
    };

    const getChartMargin = () => {
        if (isMobile) {
            return { top: 15, right: 5, left: 5, bottom: 35 };
        } else if (isTablet) {
            return { top: 18, right: 10, left: 5, bottom: 40 };
        } else {
            return { top: 20, right: 0, left: 0, bottom: 45 };
        }
    };

    const getYAxisWidth = () => {
        if (!showYAxis) return 15;
        if (isMobile) return 50;
        if (isTablet) return 55;
        return 60;
    };

    const getXAxisConfig = () => {
        const baseFontSize = isMobile ? 10 : isTablet ? 11 : 12;
        return {
            dataKey: "age",
            label: {
                value: t('chart.xAxisLabel'),
                position: 'insideBottomRight',
                offset: isMobile ? -8 : -5,
                style: { fontSize: baseFontSize, textAnchor: 'end' }
            },
            tick: { fontSize: baseFontSize },
            tickLine: { stroke: '#bdc3c7' },
            height: isMobile ? 30 : 40
        };
    };

    const getYAxisConfig = () => {
        const baseFontSize = isMobile ? 9 : isTablet ? 10 : 11;
        const labelOffset = isMobile ? 5 : 10;

        return {
            tickFormatter: formatCompact,
            label: showYAxis ? {
                value: t('chart.yAxisLabel'),
                angle: -90,
                position: isMobile ? 'outside' : 'insideLeft',
                offset: labelOffset,
                style: {
                    fontSize: baseFontSize,
                    textAnchor: 'middle',
                    fill: '#666'
                }
            } : undefined,
            tick: showYAxis ? {
                fontSize: baseFontSize,
                fill: '#666'
            } : false,
            tickLine: { stroke: '#bdc3c7' },
            axisLine: { stroke: '#bdc3c7' },
            width: getYAxisWidth()
        };
    };

    const getReferenceLineConfig = (age, label, color, dashArray, offsetY = 0) => {
        const baseFontSize = isMobile ? 10 : 12;
        return {
            x: age,
            stroke: color,
            strokeWidth: 2,
            strokeDasharray: dashArray,
            label: {
                value: label,
                position: 'topRight',
                offset: isMobile ? 8 + offsetY : 15 + offsetY,
                style: {
                    fontSize: baseFontSize,
                    fontWeight: 'bold',
                    fill: color,
                    textAnchor: 'start'
                }
            }
        };
    };

    if (!hasData || status === 'invalid') {
        return (
            <div className="chart-empty">
                {t('chart.emptyState')}
            </div>
        );
    }

    return (
        <div className="chart-container" data-copy-version={CHART_COPY_VERSION}>
            <div className="chart-header">
                <div className="chart-controls">
                    <button onClick={toggleYAxis} className="toggle-button">
                        {showYAxis ? t('chart.hideYAxis') : t('chart.showYAxis')}
                    </button>
                </div>
                <div className="chart-legend">
                    <div className="legend-item">
                        <span className="legend-dot" style={{backgroundColor: '#e74c3c'}}></span>
                        <span>{t('chart.currentAge')}</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot" style={{backgroundColor: '#3498db'}}></span>
                        <span>{t('chart.earlyRetirement')}</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot" style={{backgroundColor: '#8e44ad'}}></span>
                        <span>{t('chart.legalRetirement')}</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart
                    data={data}
                    margin={getChartMargin()}
                >
                    <XAxis {...getXAxisConfig()} />
                    <YAxis {...getYAxisConfig()} />
                    <Tooltip content={<CustomTooltip />} />

                    <ReferenceArea
                        x1={currentAge}
                        x2={earlyRetirementAge}
                        fill="#e67e22"
                        fillOpacity={0.05}
                    />

                    <ReferenceArea
                        x1={earlyRetirementAge}
                        x2={legalRetirementAge}
                        fill="#3498db"
                        fillOpacity={0.05}
                    />

                    <ReferenceArea
                        x1={legalRetirementAge}
                        x2={data[data.length - 1]?.age || legalRetirementAge}
                        fill="#8e44ad"
                        fillOpacity={0.04}
                    />

                    <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="#27ae60"
                        strokeWidth={isMobile ? 2.5 : 3}
                        name={t('chart.savingsLine')}
                        dot={false}
                        activeDot={{
                            r: isMobile ? 4 : 6,
                            stroke: '#27ae60',
                            strokeWidth: 2,
                            fill: '#fff'
                        }}
                    />

                    <ReferenceLine {...getReferenceLineConfig(
                        currentAge,
                        t('chart.currentAgeLine', { age: currentAge }),
                        '#e74c3c',
                        '5 5'
                    )} />

                    <ReferenceLine {...getReferenceLineConfig(
                        earlyRetirementAge,
                        t('chart.earlyAgeLine', { age: earlyRetirementAge }),
                        '#3498db',
                        '8 4',
                        isMobile ? 15 : 20
                    )} />

                    <ReferenceLine {...getReferenceLineConfig(
                        legalRetirementAge,
                        t('chart.legalAgeLine', { age: legalRetirementAge }),
                        '#8e44ad',
                        '4 4',
                        isMobile ? 30 : 40
                    )} />
                </LineChart>
            </ResponsiveContainer>

            <div className="chart-footer">
                <div className="chart-phases">
                    <div className="phase-item">
                        <span className="phase-color" style={{backgroundColor: '#e67e22'}}></span>
                        <span className="phase-text">{t('chart.workingPhase')}</span>
                    </div>
                    <div className="phase-item">
                        <span className="phase-color" style={{backgroundColor: '#3498db'}}></span>
                        <span className="phase-text">{t('chart.earlyPhase')}</span>
                    </div>
                    <div className="phase-item">
                        <span className="phase-color" style={{backgroundColor: '#8e44ad'}}></span>
                        <span className="phase-text">{t('chart.legalPhase')}</span>
                    </div>
                </div>
                <p className="chart-hint">
                    {isMobile ? t('chart.mobileHint') : t('chart.desktopHint')}
                </p>
            </div>
        </div>
    );
};

export default Chart;
