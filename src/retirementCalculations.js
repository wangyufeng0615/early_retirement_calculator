export const calculateRetirement = (
    currentAge,
    earlyRetirementAge,
    legalRetirementAge,
    monthlyExpenses,
    currentSavings,
    annualReturn,
    inflationRate,
    expectedSavingsAtLegalRetirement
) => {
    const yearsUntilEarlyRetirement = Math.max(0, earlyRetirementAge - currentAge);
    const yearsInRetirement = Math.max(0, legalRetirementAge - earlyRetirementAge);
    const realReturnRate = (1 + annualReturn / 100) / (1 + inflationRate / 100) - 1;

    if (yearsUntilEarlyRetirement < 0 || yearsInRetirement < 0) {
        console.error('Invalid age inputs.');
        return {
            requiredSavings: 0,
            monthlySavings: 0,
            requiredSalary: 0,
            savingsProgress: 0,
            remainingSavings: 0,
            remainingSavingsTodayValue: 0,
            chartData: []
        };
    }

    // Convert expected savings at legal retirement to future value
    const futureExpectedSavings = expectedSavingsAtLegalRetirement * Math.pow(1 + inflationRate / 100, yearsUntilEarlyRetirement + yearsInRetirement);

    // Function to calculate savings trajectory given monthly savings
    const calculateSavingsTrajectory = (monthlySavings) => {
        let savings = currentSavings;
        let yearlyExpenses = monthlyExpenses * 12;
        const trajectory = [];

        for (let age = currentAge; age <= legalRetirementAge; age++) {
            if (age <= earlyRetirementAge) {
                savings = savings * (1 + annualReturn / 100) + monthlySavings * 12;
            } else {
                savings = (savings * (1 + annualReturn / 100)) - yearlyExpenses;
            }
            trajectory.push({ age, savings, expenses: yearlyExpenses });
            yearlyExpenses *= (1 + inflationRate / 100);
        }

        return trajectory;
    };

    // Function to check if savings are sufficient throughout retirement
    const isSufficientSavings = (trajectory) => {
        return trajectory.every((year, index) => {
            if (index === trajectory.length - 1) {
                // For the last year, compare with futureExpectedSavings
                return year.savings >= futureExpectedSavings;
            }
            return year.savings >= year.expenses;
        });
    };

    // Binary search to find the minimum monthly savings
    let low = 0;
    let high = monthlyExpenses * 10; // Increased upper limit
    let minMonthlySavings = high;
    let finalTrajectory;

    while (high - low > 1) {
        const mid = (low + high) / 2;
        const trajectory = calculateSavingsTrajectory(mid);

        if (isSufficientSavings(trajectory)) {
            minMonthlySavings = mid;
            finalTrajectory = trajectory;
            high = mid;
        } else {
            low = mid;
        }
    }

    if (!finalTrajectory) {
        // If no solution found, use the highest value
        finalTrajectory = calculateSavingsTrajectory(high);
        minMonthlySavings = high;
    }

    // Ensure finalTrajectory is defined
    if (!finalTrajectory) {
        return {
            requiredSavings: 0,
            monthlySavings: 0,
            requiredSalary: 0,
            savingsProgress: 0,
            remainingSavings: 0,
            remainingSavingsTodayValue: 0,
            chartData: []
        };
    }

    // Generate chart data
    const data = finalTrajectory.map(year => ({
        age: year.age,
        savings: Math.floor(year.savings),
        expenses: Math.floor(year.expenses),
        assetReturn: Math.floor(year.savings * (annualReturn / 100)),
        inflationImpact: Math.floor(year.expenses * (inflationRate / 100)),
        savingsChange: year.age <= earlyRetirementAge ?
            Math.floor(minMonthlySavings * 12) :
            Math.floor(-year.expenses),
        withdrawal: year.age > earlyRetirementAge ? Math.floor(year.expenses) : 0
    }));

    const legalRetirementData = data[data.length - 1] || {};
    const remainingSavings = Math.floor(legalRetirementData.savings || 0);
    const inflationFactor = Math.pow(1 + inflationRate / 100, legalRetirementAge - currentAge);
    const remainingSavingsTodayValue = Math.floor(remainingSavings / inflationFactor);
    const savingsAtEarlyRetirement = data.find(item => item.age === earlyRetirementAge)?.savings || 0;
    const savingsProgress = Math.min(100, Math.floor((currentSavings / savingsAtEarlyRetirement) * 100));

    return {
        requiredSavings: Math.floor(savingsAtEarlyRetirement),
        monthlySavings: Math.ceil(minMonthlySavings),
        requiredSalary: Math.ceil(monthlyExpenses + minMonthlySavings),
        savingsProgress,
        remainingSavings,
        remainingSavingsTodayValue,
        chartData: data
    };
};
