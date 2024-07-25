import React from 'react';

const Results = ({
    requiredSavings,
    monthlySavings,
    requiredSalary,
    savingsProgress,
    remainingSavings,
    remainingSavingsTodayValue,
}) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="results">
            <div className="result-item full-width">
                <label>提前退休时所需总储蓄（考虑通胀后）</label>
                <p className="value">{formatCurrency(requiredSavings)}</p>
                <progress value={savingsProgress} max="100" className="progress" />
                <p className="progress-text">已完成 {savingsProgress}%</p>
            </div>
            <table className="result-table">
                <tbody>
                    <tr>
                        <th>项目</th>
                        <th>金额</th>
                    </tr>
                    <tr className="highlight">
                        <td>提前退休前所需月收入（到手）</td>
                        <td>{formatCurrency(requiredSalary)}</td>
                    </tr>
                    <tr>
                        <td>提前退休前每月需储蓄（到手减去开销）</td>
                        <td>{formatCurrency(monthlySavings)}</td>
                    </tr>
                    <tr>
                        <td>法定退休年龄时剩余储蓄</td>
                        <td>{formatCurrency(remainingSavings)}</td>
                    </tr>
                    <tr>
                        <td>法定退休年龄时剩余储蓄（折算为今天的购买力）</td>
                        <td>{formatCurrency(remainingSavingsTodayValue)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Results;
