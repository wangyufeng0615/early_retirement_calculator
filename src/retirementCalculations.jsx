const DEFAULT_PLANNING_END_AGE = 85;
const MAX_AGE = 125;
const MONEY_EPSILON = 0.01;
const SEARCH_PRECISION = 0.01;

const toNumber = (value) => Number(value);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const floorMoney = (value) => Math.abs(value) < MONEY_EPSILON ? 0 : Math.floor(value);

const emptyResult = (status, validationErrors = []) => ({
    status,
    isSolvable: false,
    validationErrors,
    requiredSavings: 0,
    monthlySavings: 0,
    requiredSalary: 0,
    savingsProgress: 0,
    remainingSavings: 0,
    remainingSavingsTodayValue: 0,
    legalRetirementSavings: 0,
    legalRetirementTarget: 0,
    planningEndSavings: 0,
    planningEndSavingsTodayValue: 0,
    realAnnualReturn: 0,
    shortfall: 0,
    chartData: [],
    sensitivity: []
});

const normalizeInputs = (
    currentAge,
    earlyRetirementAge,
    legalRetirementAge,
    monthlyExpenses,
    currentSavings,
    annualReturn,
    inflationRate,
    expectedSavingsAtLegalRetirement,
    monthlyPension,
    planningEndAge
) => ({
    currentAge: toNumber(currentAge),
    earlyRetirementAge: toNumber(earlyRetirementAge),
    legalRetirementAge: toNumber(legalRetirementAge),
    monthlyExpenses: toNumber(monthlyExpenses),
    currentSavings: toNumber(currentSavings),
    annualReturn: toNumber(annualReturn),
    inflationRate: toNumber(inflationRate),
    expectedSavingsAtLegalRetirement: toNumber(expectedSavingsAtLegalRetirement),
    monthlyPension: toNumber(monthlyPension),
    planningEndAge: toNumber(planningEndAge ?? DEFAULT_PLANNING_END_AGE)
});

const validateInputs = (inputs) => {
    const validationErrors = [];
    const nonNegativeFields = [
        'monthlyExpenses',
        'currentSavings',
        'expectedSavingsAtLegalRetirement',
        'monthlyPension'
    ];
    const ageFields = [
        'currentAge',
        'earlyRetirementAge',
        'legalRetirementAge',
        'planningEndAge'
    ];

    Object.entries(inputs).forEach(([key, value]) => {
        if (!Number.isFinite(value)) {
            validationErrors.push(`${key}NotNumber`);
        }
    });

    ageFields.forEach((field) => {
        if (Number.isFinite(inputs[field]) && (!Number.isInteger(inputs[field]) || inputs[field] < 0)) {
            validationErrors.push(`${field}Invalid`);
        }

        if (Number.isFinite(inputs[field]) && inputs[field] > MAX_AGE) {
            validationErrors.push(`${field}TooHigh`);
        }
    });

    nonNegativeFields.forEach((field) => {
        if (Number.isFinite(inputs[field]) && inputs[field] < 0) {
            validationErrors.push(`${field}Negative`);
        }
    });

    if (Number.isFinite(inputs.annualReturn) && inputs.annualReturn <= -100) {
        validationErrors.push('annualReturnTooLow');
    }

    if (Number.isFinite(inputs.inflationRate) && inputs.inflationRate <= -100) {
        validationErrors.push('inflationRateTooLow');
    }

    if (Number.isFinite(inputs.currentAge) && Number.isFinite(inputs.earlyRetirementAge) && inputs.currentAge > inputs.earlyRetirementAge) {
        validationErrors.push('currentAgeAfterEarlyRetirement');
    }

    if (Number.isFinite(inputs.earlyRetirementAge) && Number.isFinite(inputs.legalRetirementAge) && inputs.earlyRetirementAge > inputs.legalRetirementAge) {
        validationErrors.push('earlyAfterLegalRetirement');
    }

    if (Number.isFinite(inputs.legalRetirementAge) && Number.isFinite(inputs.planningEndAge) && inputs.legalRetirementAge > inputs.planningEndAge) {
        validationErrors.push('legalAfterPlanningEnd');
    }

    return [...new Set(validationErrors)];
};

const calculateTrajectory = (inputs, monthlySavings) => {
    const nominalReturnRate = inputs.annualReturn / 100;
    const inflationMultiplier = 1 + inputs.inflationRate / 100;
    let savings = inputs.currentSavings;
    let yearlyExpenses = inputs.monthlyExpenses * 12;
    let yearlyPension = inputs.monthlyPension * 12;
    const trajectory = [];

    for (let age = inputs.currentAge; age <= inputs.planningEndAge; age += 1) {
        const phase = age < inputs.earlyRetirementAge
            ? 'working'
            : age < inputs.legalRetirementAge
                ? 'earlyRetirement'
                : 'legalRetirement';
        const pension = phase === 'legalRetirement' ? yearlyPension : 0;
        const netExpenses = phase === 'working' ? 0 : Math.max(0, yearlyExpenses - pension);
        const contribution = phase === 'working' ? monthlySavings * 12 : 0;
        const withdrawal = netExpenses;
        const assetReturn = savings * nominalReturnRate;
        const closingSavings = savings + assetReturn + contribution - withdrawal;

        trajectory.push({
            age,
            phase,
            savings,
            closingSavings,
            expenses: yearlyExpenses,
            pension,
            netExpenses,
            assetReturn,
            contribution,
            withdrawal
        });

        savings = closingSavings;
        yearlyExpenses *= inflationMultiplier;
        yearlyPension *= inflationMultiplier;
    }

    return trajectory;
};

const evaluateTrajectory = (inputs, trajectory) => {
    const inflationToLegalRetirement = Math.pow(
        1 + inputs.inflationRate / 100,
        inputs.legalRetirementAge - inputs.currentAge
    );
    const legalRetirementTarget = inputs.expectedSavingsAtLegalRetirement * inflationToLegalRetirement;
    const legalRetirementYear = trajectory.find((year) => year.age === inputs.legalRetirementAge) || trajectory[trajectory.length - 1];
    const retirementYears = trajectory.filter((year) => year.age >= inputs.earlyRetirementAge);
    const minimumRetirementClosingSavings = retirementYears.length
        ? Math.min(...retirementYears.map((year) => year.closingSavings))
        : 0;
    const legalShortfall = Math.max(0, legalRetirementTarget - (legalRetirementYear?.savings || 0));
    const liquidityShortfall = Math.max(0, -minimumRetirementClosingSavings);
    const shortfall = Math.max(legalShortfall, liquidityShortfall);

    return {
        isFeasible: shortfall <= 0.000001,
        legalRetirementTarget,
        legalRetirementSavings: legalRetirementYear?.savings || 0,
        shortfall
    };
};

const solveMonthlySavings = (inputs) => {
    const zeroTrajectory = calculateTrajectory(inputs, 0);
    const zeroEvaluation = evaluateTrajectory(inputs, zeroTrajectory);

    if (zeroEvaluation.isFeasible) {
        return {
            status: 'solved',
            monthlySavings: 0,
            trajectory: zeroTrajectory,
            evaluation: zeroEvaluation
        };
    }

    if (inputs.currentAge >= inputs.earlyRetirementAge) {
        return {
            status: 'infeasible',
            monthlySavings: 0,
            trajectory: zeroTrajectory,
            evaluation: zeroEvaluation
        };
    }

    let low = 0;
    let high = Math.max(1000, inputs.monthlyExpenses);
    let highTrajectory = calculateTrajectory(inputs, high);
    let highEvaluation = evaluateTrajectory(inputs, highTrajectory);

    while (!highEvaluation.isFeasible && high < Number.MAX_SAFE_INTEGER / 2) {
        low = high;
        high *= 2;
        highTrajectory = calculateTrajectory(inputs, high);
        highEvaluation = evaluateTrajectory(inputs, highTrajectory);
    }

    if (!highEvaluation.isFeasible) {
        return {
            status: 'infeasible',
            monthlySavings: high,
            trajectory: highTrajectory,
            evaluation: highEvaluation
        };
    }

    while (high - low > SEARCH_PRECISION) {
        const mid = (low + high) / 2;
        const trajectory = calculateTrajectory(inputs, mid);
        const evaluation = evaluateTrajectory(inputs, trajectory);

        if (evaluation.isFeasible) {
            high = mid;
            highTrajectory = trajectory;
            highEvaluation = evaluation;
        } else {
            low = mid;
        }
    }

    return {
        status: 'solved',
        monthlySavings: high,
        trajectory: highTrajectory,
        evaluation: highEvaluation
    };
};

const solveRequiredSavingsAtEarlyRetirement = (inputs) => {
    const yearsUntilEarlyRetirement = inputs.earlyRetirementAge - inputs.currentAge;
    const inflationToEarlyRetirement = Math.pow(1 + inputs.inflationRate / 100, yearsUntilEarlyRetirement);
    const retirementInputs = {
        ...inputs,
        currentAge: inputs.earlyRetirementAge,
        currentSavings: 0,
        monthlyExpenses: inputs.monthlyExpenses * inflationToEarlyRetirement,
        monthlyPension: inputs.monthlyPension * inflationToEarlyRetirement,
        expectedSavingsAtLegalRetirement: inputs.expectedSavingsAtLegalRetirement * inflationToEarlyRetirement
    };

    const nominalGrowth = 1 + retirementInputs.annualReturn / 100;
    const inflationMultiplier = 1 + retirementInputs.inflationRate / 100;
    const legalRetirementOffset = retirementInputs.legalRetirementAge - retirementInputs.currentAge;
    const legalRetirementTarget = retirementInputs.expectedSavingsAtLegalRetirement
        * Math.pow(inflationMultiplier, legalRetirementOffset);
    let yearlyExpenses = retirementInputs.monthlyExpenses * 12;
    let yearlyPension = retirementInputs.monthlyPension * 12;
    let requiredSavings = 0;
    let withdrawalPresentValue = 0;

    for (let age = retirementInputs.currentAge; age <= retirementInputs.planningEndAge; age += 1) {
        const offset = age - retirementInputs.currentAge;

        if (age === retirementInputs.legalRetirementAge) {
            requiredSavings = Math.max(
                requiredSavings,
                withdrawalPresentValue + legalRetirementTarget / Math.pow(nominalGrowth, offset)
            );
        }

        const pension = age >= retirementInputs.legalRetirementAge ? yearlyPension : 0;
        const withdrawal = Math.max(0, yearlyExpenses - pension);
        withdrawalPresentValue += withdrawal / Math.pow(nominalGrowth, offset + 1);
        requiredSavings = Math.max(requiredSavings, withdrawalPresentValue);
        yearlyExpenses *= inflationMultiplier;
        yearlyPension *= inflationMultiplier;
    }

    return requiredSavings;
};

const toDisplayData = (trajectory) => trajectory.map((year) => ({
    age: year.age,
    phase: year.phase,
    savings: floorMoney(year.savings),
    closingSavings: floorMoney(year.closingSavings),
    expenses: floorMoney(year.expenses),
    pension: floorMoney(year.pension || 0),
    netExpenses: floorMoney(year.netExpenses),
    assetReturn: floorMoney(year.assetReturn),
    contribution: floorMoney(year.contribution),
    savingsChange: floorMoney(year.contribution - year.withdrawal),
    withdrawal: floorMoney(year.withdrawal)
}));

export const calculateRetirement = (
    currentAge,
    earlyRetirementAge,
    legalRetirementAge,
    monthlyExpenses,
    currentSavings,
    annualReturn,
    inflationRate,
    expectedSavingsAtLegalRetirement,
    monthlyPension,
    planningEndAge = DEFAULT_PLANNING_END_AGE,
    options = {}
) => {
    const inputs = normalizeInputs(
        currentAge,
        earlyRetirementAge,
        legalRetirementAge,
        monthlyExpenses,
        currentSavings,
        annualReturn,
        inflationRate,
        expectedSavingsAtLegalRetirement,
        monthlyPension,
        planningEndAge
    );
    const realAnnualReturn = ((1 + inputs.annualReturn / 100) / (1 + inputs.inflationRate / 100) - 1) * 100;
    const validationErrors = validateInputs(inputs);

    if (validationErrors.length > 0) {
        return {
            ...emptyResult('invalid', validationErrors),
            realAnnualReturn: Number.isFinite(realAnnualReturn) ? realAnnualReturn : 0
        };
    }

    const solution = solveMonthlySavings(inputs);
    let monthlySavings = solution.status === 'solved' ? Math.ceil(solution.monthlySavings) : null;
    let resultTrajectory = solution.status === 'solved'
        ? calculateTrajectory(inputs, monthlySavings)
        : solution.trajectory;
    let resultEvaluation = solution.status === 'solved'
        ? evaluateTrajectory(inputs, resultTrajectory)
        : solution.evaluation;

    if (solution.status === 'solved') {
        let guard = 0;

        while (!resultEvaluation.isFeasible && guard < 1000) {
            monthlySavings += 1;
            resultTrajectory = calculateTrajectory(inputs, monthlySavings);
            resultEvaluation = evaluateTrajectory(inputs, resultTrajectory);
            guard += 1;
        }

        guard = 0;

        while (resultEvaluation.isFeasible && monthlySavings > 0 && guard < 2) {
            const lowerTrajectory = calculateTrajectory(inputs, monthlySavings - 1);
            const lowerEvaluation = evaluateTrajectory(inputs, lowerTrajectory);

            if (!lowerEvaluation.isFeasible) {
                break;
            }

            monthlySavings -= 1;
            resultTrajectory = lowerTrajectory;
            resultEvaluation = lowerEvaluation;
            guard += 1;
        }
    }

    const status = solution.status === 'solved' && !resultEvaluation.isFeasible
        ? 'infeasible'
        : solution.status;
    const displayedMonthlySavings = status === 'solved' ? monthlySavings : null;
    const data = toDisplayData(resultTrajectory);
    const legalRetirementData = data.find((item) => item.age === inputs.legalRetirementAge) || data[data.length - 1] || {};
    const planningEndData = resultTrajectory[resultTrajectory.length - 1] || {};
    const requiredSavingsAtEarlyRetirement = solveRequiredSavingsAtEarlyRetirement(inputs);
    const requiredSavings = Math.max(0, Math.ceil(requiredSavingsAtEarlyRetirement));
    const inflationToLegalRetirement = Math.pow(1 + inputs.inflationRate / 100, inputs.legalRetirementAge - inputs.currentAge);
    const inflationToPlanningEnd = Math.pow(1 + inputs.inflationRate / 100, inputs.planningEndAge - inputs.currentAge);
    const yearsUntilEarlyRetirement = inputs.earlyRetirementAge - inputs.currentAge;
    const projectedCurrentSavingsAtEarlyRetirement = inputs.currentSavings * Math.pow(1 + inputs.annualReturn / 100, yearsUntilEarlyRetirement);
    const planningEndSavings = floorMoney(planningEndData.closingSavings || 0);
    const planningEndSavingsTodayValue = floorMoney(planningEndSavings / inflationToPlanningEnd);
    const legalRetirementSavings = floorMoney(legalRetirementData.savings || 0);
    const legalRetirementTarget = floorMoney(resultEvaluation.legalRetirementTarget || 0);
    const savingsProgress = status === 'infeasible'
        ? clamp(Math.floor((projectedCurrentSavingsAtEarlyRetirement / Math.max(projectedCurrentSavingsAtEarlyRetirement + solution.evaluation.shortfall, 1)) * 100), 0, 100)
        : requiredSavings > 0
            ? clamp(Math.floor((projectedCurrentSavingsAtEarlyRetirement / requiredSavings) * 100), 0, 100)
            : 100;
    const baseResult = {
        status,
        isSolvable: status === 'solved',
        validationErrors: [],
        requiredSavings,
        monthlySavings: displayedMonthlySavings,
        requiredSalary: displayedMonthlySavings === null ? null : Math.ceil(inputs.monthlyExpenses + displayedMonthlySavings),
        savingsProgress,
        remainingSavings: legalRetirementSavings,
        remainingSavingsTodayValue: floorMoney(legalRetirementSavings / inflationToLegalRetirement),
        legalRetirementSavings,
        legalRetirementTarget,
        planningEndSavings,
        planningEndSavingsTodayValue,
        realAnnualReturn,
        shortfall: status === 'solved' ? 0 : Math.ceil(resultEvaluation.shortfall || 0),
        chartData: data,
        sensitivity: []
    };

    if (options.includeSensitivity === false) {
        return baseResult;
    }

    const scenarios = [
        {
            key: 'lowerReturn',
            inputs: {
                ...inputs,
                annualReturn: Math.max(-99, inputs.annualReturn - 1)
            }
        },
        {
            key: 'higherInflation',
            inputs: {
                ...inputs,
                inflationRate: inputs.inflationRate + 1
            }
        },
        {
            key: 'higherExpenses',
            inputs: {
                ...inputs,
                monthlyExpenses: inputs.monthlyExpenses * 1.1
            }
        }
    ];

    baseResult.sensitivity = scenarios.map((scenario) => {
        const scenarioResult = calculateRetirement(
            scenario.inputs.currentAge,
            scenario.inputs.earlyRetirementAge,
            scenario.inputs.legalRetirementAge,
            scenario.inputs.monthlyExpenses,
            scenario.inputs.currentSavings,
            scenario.inputs.annualReturn,
            scenario.inputs.inflationRate,
            scenario.inputs.expectedSavingsAtLegalRetirement,
            scenario.inputs.monthlyPension,
            scenario.inputs.planningEndAge,
            { includeSensitivity: false }
        );

        return {
            key: scenario.key,
            status: scenarioResult.status,
            monthlySavings: scenarioResult.monthlySavings,
            deltaMonthlySavings: scenarioResult.monthlySavings === null || baseResult.monthlySavings === null
                ? null
                : scenarioResult.monthlySavings - baseResult.monthlySavings
        };
    });

    return baseResult;
};
