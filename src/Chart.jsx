import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceArea } from 'recharts';

const Chart = ({ data, earlyRetirementAge, currentAge }) => {
    const [showYAxis, setShowYAxis] = useState(true);

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
                    padding: '12px', 
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '14px'
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
                    <p style={{ margin: '4px 0 0 0', color: '#3498db', fontSize: '13px' }}>
                        {`📈 投资回报: ${formatCurrency(assetReturn)}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    // 获取不同阶段的颜色
    const getStrokeColor = (age) => {
        if (age < currentAge) {
            return '#95a5a6'; // 过去：灰色
        } else if (age < earlyRetirementAge) {
            return '#e67e22'; // 工作期：橙色
        } else {
            return '#3498db'; // 退休期：蓝色
        }
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
            
            <ResponsiveContainer width="100%" height={350}>
                <LineChart 
                    data={data} 
                    margin={{ top: 20, right: 5, left: 5, bottom: 45 }}
                >
                    <XAxis 
                        dataKey="age" 
                        label={{ value: '年龄 (岁)', position: 'insideBottomRight', offset: -5 }}
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: '#bdc3c7' }}
                        height={40}
                    />
                    <YAxis
                        tickFormatter={formatYAxis}
                        label={{ value: '储蓄金额', angle: -90, position: 'insideLeft', offset: 10 }}
                        tick={showYAxis ? { fontSize: 11 } : false}
                        tickLine={{ stroke: '#bdc3c7' }}
                        axisLine={{ stroke: '#bdc3c7' }}
                        width={showYAxis ? 60 : 20}
                    />
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
                        strokeWidth={3}
                        name="累计储蓄" 
                        dot={false}
                        activeDot={{ r: 6, stroke: '#27ae60', strokeWidth: 2, fill: '#fff' }}
                    />
                    
                    {/* 当前年龄参考线 */}
                    <ReferenceLine 
                        x={currentAge} 
                        stroke="#e74c3c" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        label={{ 
                            value: `当前 ${currentAge}岁`, 
                            position: 'topRight',
                            offset: 15,
                            style: { 
                                fontSize: '12px', 
                                fontWeight: 'bold',
                                fill: '#e74c3c',
                                textAnchor: 'start'
                            }
                        }}
                    />
                    
                    {/* 提前退休年龄参考线 */}
                    <ReferenceLine 
                        x={earlyRetirementAge} 
                        stroke="#3498db" 
                        strokeWidth={2}
                        strokeDasharray="8 4"
                        label={{ 
                            value: `退休 ${earlyRetirementAge}岁`, 
                            position: 'topRight',
                            offset: 35,
                            style: { 
                                fontSize: '12px', 
                                fontWeight: 'bold',
                                fill: '#3498db',
                                textAnchor: 'start'
                            }
                        }}
                    />
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
                    💡 点击数据点查看详情 • 长按移动端查看
                </p>
            </div>
        </div>
    );
};

export default Chart;
