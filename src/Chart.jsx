import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

const Chart = ({ data, earlyRetirementAge, currentAge }) => {
    const [showYAxis, setShowYAxis] = useState(true);
    const [chartHeight, setChartHeight] = useState(350);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const updateChartConfig = () => {
            const width = window.innerWidth;
            const mobile = width <= 600;
            const tablet = width > 600 && width <= 768;
            
            setIsMobile(mobile);
            setIsTablet(tablet);
            
            if (mobile) {
                setChartHeight(280); // 移动端使用更小的高度
            } else if (tablet) {
                setChartHeight(320); // 平板端使用中等高度
            } else {
                setChartHeight(350); // 桌面端使用原始高度
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
        return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 }).format(value);
    };

    const formatYAxis = (value) => {
        if (value >= 10000000) {
            return `${(value / 10000000).toFixed(1)}千万`;
        } else if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}百万`;
        } else if (value >= 10000) {
            return `${(value / 10000).toFixed(1)}万`;
        }
        return `${(value / 1000).toFixed(0)}千`;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const { savings, expenses, assetReturn } = payload[0].payload;
            const isCurrentAge = label === currentAge;
            const isRetirementAge = label === earlyRetirementAge;

            return (
                <div className="custom-tooltip" style={{ 
                    backgroundColor: 'white', 
                    padding: isMobile ? '8px' : '12px', 
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: isMobile ? '12px' : '14px',
                    maxWidth: isMobile ? '250px' : '300px'
                }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#2c3e50' }}>
                        {`年龄: ${label} 岁`}
                        {isCurrentAge && <span style={{ color: '#e74c3c', marginLeft: '8px' }}>← 当前</span>}
                        {isRetirementAge && <span style={{ color: '#3498db', marginLeft: '8px' }}>← 提前退休</span>}
                    </p>
                    <p style={{ margin: '4px 0', color: '#27ae60', fontWeight: '500' }}>
                        {`💰 累计储蓄: ${formatCurrency(savings)}`}
                    </p>
                    <p style={{ margin: '4px 0', color: '#8e44ad' }}>
                        {`💸 年度开销: ${formatCurrency(expenses)}`}
                    </p>
                    <p style={{ margin: '4px 0 0 0', color: '#3498db', fontSize: isMobile ? '11px' : '13px' }}>
                        {`📈 投资回报: ${formatCurrency(assetReturn)}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    // 根据屏幕尺寸动态配置
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
        if (isMobile) return 50; // 增加移动端Y轴宽度
        if (isTablet) return 55;
        return 60;
    };

    const getXAxisConfig = () => {
        const baseFontSize = isMobile ? 10 : isTablet ? 11 : 12;
        return {
            dataKey: "age",
            label: { 
                value: '年龄 (岁)', 
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
            tickFormatter: formatYAxis,
            label: showYAxis ? { 
                value: '储蓄金额', 
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

    return (
        <div className="chart-container">
            <div className="chart-header">
                <div className="chart-controls">
                    <button onClick={toggleYAxis} className="toggle-button">
                        {showYAxis ? '🙈 隐藏金额刻度' : '👁️ 显示金额刻度'}
                    </button>
                </div>
                <div className="chart-legend">
                    <div className="legend-item">
                        <span className="legend-dot" style={{backgroundColor: '#e74c3c'}}></span>
                        <span>当前年龄</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot" style={{backgroundColor: '#3498db'}}></span>
                        <span>提前退休</span>
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
                    
                    {/* 背景区域：工作期 */}
                    <ReferenceArea 
                        x1={currentAge} 
                        x2={earlyRetirementAge} 
                        fill="#e67e22" 
                        fillOpacity={0.05}
                    />
                    
                    {/* 背景区域：退休期 */}
                    <ReferenceArea 
                        x1={earlyRetirementAge} 
                        x2={data[data.length - 1]?.age || 65} 
                        fill="#3498db" 
                        fillOpacity={0.05}
                    />
                    
                    {/* 储蓄变化线 */}
                    <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="#27ae60" 
                        strokeWidth={isMobile ? 2.5 : 3}
                        name="累计储蓄" 
                        dot={false}
                        activeDot={{ 
                            r: isMobile ? 4 : 6, 
                            stroke: '#27ae60', 
                            strokeWidth: 2, 
                            fill: '#fff' 
                        }}
                    />
                    
                    {/* 当前年龄参考线 */}
                    <ReferenceLine {...getReferenceLineConfig(
                        currentAge, 
                        `当前 ${currentAge}岁`, 
                        '#e74c3c', 
                        '5 5'
                    )} />
                    
                    {/* 提前退休年龄参考线 */}
                    <ReferenceLine {...getReferenceLineConfig(
                        earlyRetirementAge, 
                        `退休 ${earlyRetirementAge}岁`, 
                        '#3498db', 
                        '8 4',
                        isMobile ? 15 : 20
                    )} />
                </LineChart>
            </ResponsiveContainer>
            
            <div className="chart-footer">
                <div className="chart-phases">
                    <div className="phase-item">
                        <span className="phase-color" style={{backgroundColor: '#e67e22'}}></span>
                        <span className="phase-text">工作储蓄期</span>
                    </div>
                    <div className="phase-item">
                        <span className="phase-color" style={{backgroundColor: '#3498db'}}></span>
                        <span className="phase-text">提前退休期</span>
                    </div>
                </div>
                <p className="chart-hint">
                    💡 {isMobile ? '长按查看详情' : '点击数据点查看详情'}
                </p>
            </div>
        </div>
    );
};

export default Chart;
