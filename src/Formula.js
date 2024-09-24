import React from 'react';
import { BlockMath } from 'react-katex';

const Formula = () => {
    return (
        <div className="formula">
            <p>核心计算逻辑说明：</p>
            <ol>
                <li>
                    <strong>提前退休时所需储蓄：</strong>
                    <div className="formula-container">
                        <BlockMath>
                            {"\\text{所需储蓄} = \\text{年度开支} \\times \\text{退休年数} + \\text{法定退休时的期望储蓄}"}
                        </BlockMath>
                    </div>
                    <p>这个公式考虑了从提前退休到法定退休的总开支，以及您希望在法定退休时保留的储蓄。</p>
                </li>
            </ol>
            <p>
                注意：实际计算中，我们还考虑了投资回报率和通货膨胀的影响，使结果更加准确。
                计算器使用更复杂的算法来优化结果，但核心思想仍基于上述公式。
            </p>
        </div>
    );
};

export default Formula;