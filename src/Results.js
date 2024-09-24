import React from 'react';

const Results = (props) => {
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
                <p className="progress-text">已完成 {savingsProgress}%</p>
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
                        <td>提前退休时所需储蓄</td>
                        <td>{formatCurrency(props.requiredSavings)}</td>
                    </tr>
                    <tr>
                        <td className="highlight">每月需要储蓄</td>
                        <td className="highlight">{formatCurrency(props.monthlySavings)}</td>
                    </tr>
                    {/* 移除“需要的年收入”行 */}
                    {/* 其他结果 */}
                </tbody>
            </table>
        </div>
    );
};

export default Results;
