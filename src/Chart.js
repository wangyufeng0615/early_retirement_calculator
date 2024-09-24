import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

const Chart = ({ data, earlyRetirementAge }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 }).format(value);
    };

    const formatYAxis = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        }
        return `${(value / 1000).toFixed(0)}k`;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const { savings, expenses, assetReturn } = payload[0].payload;

            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                    <p><strong>{`年龄: ${label}`}</strong></p>
                    <p style={{ color: '#4caf50' }}>{`累计储蓄: ${formatCurrency(savings)}`}</p>
                    <p>{`年度开销: ${formatCurrency(expenses)}`}</p>
                    <p style={{ color: '#2196f3' }}>{`当年资产回报: ${formatCurrency(assetReturn)}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="age" label={{ value: '年龄', position: 'insideBottomRight', offset: -10 }} />
                    <YAxis tickFormatter={formatYAxis} label={{ value: '储蓄金额', angle: -90, position: 'insideLeft', offset: -5 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="savings" stroke="#4caf50" name="累计储蓄" dot={false} />
                    <ReferenceLine x={earlyRetirementAge} stroke="red" />
                </LineChart>
            </ResponsiveContainer>
            <p style={{ textAlign: 'center', color: '#5a6a7e' }}>鼠标/长按可看当年详情</p>
        </div>
    );
};

export default Chart;
