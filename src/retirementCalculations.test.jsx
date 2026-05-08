import { describe, expect, it } from 'vitest';
import { calculateRetirement } from './retirementCalculations.jsx';

const defaultArgs = {
    currentAge: 30,
    earlyRetirementAge: 40,
    legalRetirementAge: 63,
    monthlyExpenses: 8000,
    currentSavings: 200000,
    annualReturn: 3.5,
    inflationRate: 2,
    expectedSavingsAtLegalRetirement: 0,
    monthlyPension: 3000,
    planningEndAge: 85
};

const calculate = (overrides = {}, options) => {
    const args = { ...defaultArgs, ...overrides };

    return calculateRetirement(
        args.currentAge,
        args.earlyRetirementAge,
        args.legalRetirementAge,
        args.monthlyExpenses,
        args.currentSavings,
        args.annualReturn,
        args.inflationRate,
        args.expectedSavingsAtLegalRetirement,
        args.monthlyPension,
        args.planningEndAge,
        options
    );
};

const expectFiniteNumbers = (result) => {
    [
        'requiredSavings',
        'requiredSalary',
        'savingsProgress',
        'remainingSavings',
        'remainingSavingsTodayValue',
        'legalRetirementSavings',
        'legalRetirementTarget',
        'planningEndSavings',
        'planningEndSavingsTodayValue',
        'realAnnualReturn',
        'requiredSalary',
        'shortfall'
    ].forEach((key) => {
        expect(Number.isFinite(result[key]), key).toBe(true);
    });

    if (result.monthlySavings !== null) {
        expect(Number.isFinite(result.monthlySavings), 'monthlySavings').toBe(true);
    }
};

describe('calculateRetirement validation', () => {
    it('marks reversed age ranges as invalid', () => {
        expect(calculate({ currentAge: 45, earlyRetirementAge: 40 }).validationErrors)
            .toContain('currentAgeAfterEarlyRetirement');
        expect(calculate({ earlyRetirementAge: 70, legalRetirementAge: 63 }).validationErrors)
            .toContain('earlyAfterLegalRetirement');
        expect(calculate({ legalRetirementAge: 90, planningEndAge: 85 }).validationErrors)
            .toContain('legalAfterPlanningEnd');
    });

    it('rejects negative money inputs and impossible rates', () => {
        expect(calculate({ monthlyExpenses: -1 }).validationErrors).toContain('monthlyExpensesNegative');
        expect(calculate({ currentSavings: -1 }).validationErrors).toContain('currentSavingsNegative');
        expect(calculate({ expectedSavingsAtLegalRetirement: -1 }).validationErrors)
            .toContain('expectedSavingsAtLegalRetirementNegative');
        expect(calculate({ monthlyPension: -1 }).validationErrors).toContain('monthlyPensionNegative');
        expect(calculate({ annualReturn: -100 }).validationErrors).toContain('annualReturnTooLow');
        expect(calculate({ inflationRate: -100 }).validationErrors).toContain('inflationRateTooLow');
    });

    it('rejects non-integer ages', () => {
        expect(calculate({ currentAge: 30.5 }).validationErrors).toContain('currentAgeInvalid');
        expect(calculate({ earlyRetirementAge: 40.5 }).validationErrors).toContain('earlyRetirementAgeInvalid');
        expect(calculate({ legalRetirementAge: 63.5 }).validationErrors).toContain('legalRetirementAgeInvalid');
        expect(calculate({ planningEndAge: 85.5 }).validationErrors).toContain('planningEndAgeInvalid');
    });

    it('rejects ages above the supported planning range', () => {
        expect(calculate({ currentAge: 126, earlyRetirementAge: 126, legalRetirementAge: 126, planningEndAge: 126 }).validationErrors)
            .toContain('currentAgeTooHigh');
        expect(calculate({ earlyRetirementAge: 126, legalRetirementAge: 126, planningEndAge: 126 }).validationErrors)
            .toContain('earlyRetirementAgeTooHigh');
        expect(calculate({ legalRetirementAge: 126, planningEndAge: 126 }).validationErrors)
            .toContain('legalRetirementAgeTooHigh');
        expect(calculate({ planningEndAge: 126 }).validationErrors).toContain('planningEndAgeTooHigh');
    });

    it('rejects non-finite values', () => {
        expect(calculate({ monthlyExpenses: NaN }).validationErrors).toContain('monthlyExpensesNotNumber');
        expect(calculate({ annualReturn: Infinity }).validationErrors).toContain('annualReturnNotNumber');
    });
});

describe('calculateRetirement baseline behavior', () => {
    it('returns a solved deterministic result for the default scenario', () => {
        const first = calculate();
        const second = calculate();

        expect(first).toEqual(second);
        expect(first.status).toBe('solved');
        expect(first.monthlySavings).toBe(20864);
        expect(first.requiredSavings).toBe(3219169);
        expect(first.requiredSalary).toBe(first.monthlySavings + defaultArgs.monthlyExpenses);
        expect(first.chartData).toHaveLength(defaultArgs.planningEndAge - defaultArgs.currentAge + 1);
        expect(first.sensitivity.map((item) => item.key)).toEqual([
            'lowerReturn',
            'higherInflation',
            'higherExpenses'
        ]);
    });

    it('can skip sensitivity calculations for nested callers', () => {
        expect(calculate({}, { includeSensitivity: false }).sensitivity).toEqual([]);
    });

    it('computes the real annual return from nominal return and inflation', () => {
        const result = calculate({ annualReturn: 3.5, inflationRate: 2 });
        const expected = ((1.035 / 1.02) - 1) * 100;

        expect(result.realAnnualReturn).toBeCloseTo(expected, 10);
    });

    it('compounds the legal-retirement target from today purchasing power', () => {
        const result = calculate({ expectedSavingsAtLegalRetirement: 100000 });
        const expectedTarget = Math.floor(100000 * Math.pow(1.02, 33));

        expect(result.legalRetirementTarget).toBe(expectedTarget);
        expect(result.legalRetirementSavings).toBeGreaterThanOrEqual(result.legalRetirementTarget);
    });

    it('keeps solved plans non-negative through the planning horizon', () => {
        const result = calculate();

        expect(result.planningEndSavings).toBeGreaterThanOrEqual(0);
        result.chartData
            .filter((year) => year.phase !== 'working')
            .forEach((year) => {
                expect(year.closingSavings).toBeGreaterThanOrEqual(0);
            });
    });

    it('uses the displayed rounded monthly savings in the trajectory', () => {
        const result = calculate({
            currentAge: 30,
            earlyRetirementAge: 32,
            legalRetirementAge: 34,
            monthlyExpenses: 1000,
            currentSavings: 0,
            annualReturn: 0,
            inflationRate: 0,
            expectedSavingsAtLegalRetirement: 50000,
            monthlyPension: 0,
            planningEndAge: 36
        });

        expect(result.monthlySavings).toBe(3084);
        expect(result.chartData[0].contribution).toBe(37008);
        expect(result.legalRetirementSavings).toBe(50016);
        expect(result.legalRetirementSavings).toBeGreaterThanOrEqual(result.legalRetirementTarget);
    });

    it('does not show a negative ending balance for solved rounded plans', () => {
        const result = calculate({
            currentAge: 34,
            earlyRetirementAge: 49,
            legalRetirementAge: 54,
            planningEndAge: 120,
            monthlyExpenses: 1,
            currentSavings: 96000,
            annualReturn: -20,
            inflationRate: 3.07,
            expectedSavingsAtLegalRetirement: 129652828,
            monthlyPension: 0
        });

        expect(result.status).toBe('solved');
        expect(result.shortfall).toBe(0);
        expect(result.planningEndSavings).toBeGreaterThanOrEqual(0);
        expect(result.chartData.at(-1).closingSavings).toBeGreaterThanOrEqual(0);
    });
});

describe('calculateRetirement phase modeling', () => {
    it('records working, early-retirement, and legal-retirement phases', () => {
        const phases = calculate().chartData.map((year) => year.phase);

        expect(phases).toContain('working');
        expect(phases).toContain('earlyRetirement');
        expect(phases).toContain('legalRetirement');
    });

    it('applies pension only from legal retirement onward', () => {
        const result = calculate({ monthlyPension: 3000 });
        const beforeLegal = result.chartData.find((year) => year.age === 62);
        const atLegal = result.chartData.find((year) => year.age === 63);

        expect(beforeLegal.pension).toBe(0);
        expect(atLegal.pension).toBeGreaterThan(0);
        expect(Math.abs(atLegal.netExpenses - (atLegal.expenses - atLegal.pension))).toBeLessThanOrEqual(1);
    });

    it('does not create negative net expenses when pension exceeds spending', () => {
        const result = calculate({ monthlyPension: 100000 });
        const legalYears = result.chartData.filter((year) => year.phase === 'legalRetirement');

        legalYears.forEach((year) => {
            expect(year.netExpenses).toBe(0);
            expect(year.withdrawal).toBe(0);
        });
    });

    it('does not treat work-period living expenses as withdrawals from savings', () => {
        const result = calculate({ currentSavings: 1 });
        const workingYears = result.chartData.filter((year) => year.phase === 'working');

        expect(result.status).toBe('solved');
        workingYears.forEach((year) => {
            expect(year.withdrawal).toBe(0);
            expect(year.netExpenses).toBe(0);
        });
    });

    it('shows work-period income needed as living costs plus savings', () => {
        const result = calculate({
            currentAge: 30,
            earlyRetirementAge: 32,
            legalRetirementAge: 34,
            monthlyExpenses: 1000,
            currentSavings: 0,
            annualReturn: 0,
            inflationRate: 0,
            expectedSavingsAtLegalRetirement: 0,
            monthlyPension: 0,
            planningEndAge: 36
        });

        expect(result.chartData[0].incomeNeeded).toBe(42000);
        expect(result.chartData[2].incomeNeeded).toBe(0);
        expect(result.chartData[2].withdrawal).toBe(12000);
    });

    it('matches a hand-calculated zero-rate plan without pension', () => {
        const result = calculate({
            currentAge: 30,
            earlyRetirementAge: 32,
            legalRetirementAge: 34,
            monthlyExpenses: 1000,
            currentSavings: 0,
            annualReturn: 0,
            inflationRate: 0,
            expectedSavingsAtLegalRetirement: 0,
            monthlyPension: 0,
            planningEndAge: 36
        });

        expect(result.status).toBe('solved');
        expect(result.requiredSavings).toBe(60000);
        expect(result.monthlySavings).toBe(2500);
        expect(result.legalRetirementSavings).toBe(36000);
        expect(result.planningEndSavings).toBe(0);
    });

    it('matches a hand-calculated zero-rate plan with pension starting at legal retirement', () => {
        const result = calculate({
            currentAge: 30,
            earlyRetirementAge: 32,
            legalRetirementAge: 34,
            monthlyExpenses: 1000,
            currentSavings: 0,
            annualReturn: 0,
            inflationRate: 0,
            expectedSavingsAtLegalRetirement: 0,
            monthlyPension: 500,
            planningEndAge: 36
        });

        const legalYear = result.chartData.find((year) => year.age === 34);

        expect(result.requiredSavings).toBe(42000);
        expect(result.monthlySavings).toBe(1750);
        expect(legalYear.pension).toBe(6000);
        expect(legalYear.withdrawal).toBe(6000);
        expect(result.planningEndSavings).toBe(0);
    });

    it('applies annual return before same-year retirement withdrawals', () => {
        const result = calculate({
            currentAge: 30,
            earlyRetirementAge: 31,
            legalRetirementAge: 31,
            monthlyExpenses: 1000,
            currentSavings: 0,
            annualReturn: 10,
            inflationRate: 0,
            expectedSavingsAtLegalRetirement: 0,
            monthlyPension: 0,
            planningEndAge: 31
        });

        const retirementYear = result.chartData.find((year) => year.age === 31);

        expect(result.monthlySavings).toBe(910);
        expect(retirementYear.savings).toBe(10920);
        expect(retirementYear.assetReturn).toBe(1092);
        expect(retirementYear.closingSavings).toBe(12);
    });
});

describe('calculateRetirement monotonic financial behavior', () => {
    it('higher pension lowers required monthly savings', () => {
        const noPension = calculate({ monthlyPension: 0 });
        const normalPension = calculate({ monthlyPension: 3000 });
        const highPension = calculate({ monthlyPension: 10000 });

        expect(noPension.monthlySavings).toBeGreaterThan(normalPension.monthlySavings);
        expect(normalPension.monthlySavings).toBeGreaterThan(highPension.monthlySavings);
    });

    it('higher annual return does not reduce progress and lowers required savings', () => {
        const low = calculate({ annualReturn: 1, currentSavings: 2000000 });
        const middle = calculate({ annualReturn: 3.5, currentSavings: 2000000 });
        const high = calculate({ annualReturn: 7, currentSavings: 2000000 });

        expect(low.savingsProgress).toBeLessThanOrEqual(middle.savingsProgress);
        expect(middle.savingsProgress).toBeLessThanOrEqual(high.savingsProgress);
        expect(low.requiredSavings).toBeGreaterThan(middle.requiredSavings);
        expect(middle.requiredSavings).toBeGreaterThan(high.requiredSavings);
    });

    it('higher annual return lowers required monthly savings until it reaches zero', () => {
        const returns = [1, 3.5, 7, 10, 15].map((annualReturn) => calculate({ annualReturn }));

        for (let index = 1; index < returns.length; index += 1) {
            expect(returns[index].monthlySavings).toBeLessThanOrEqual(returns[index - 1].monthlySavings);
        }
    });

    it('progress saturates at 100 instead of falling when current assets are already enough', () => {
        const middle = calculate({ annualReturn: 3.5, currentSavings: 5000000 });
        const high = calculate({ annualReturn: 10, currentSavings: 5000000 });

        expect(middle.monthlySavings).toBe(0);
        expect(high.monthlySavings).toBe(0);
        expect(middle.savingsProgress).toBe(100);
        expect(high.savingsProgress).toBe(100);
    });

    it('higher inflation increases monthly savings and required savings', () => {
        const low = calculate({ inflationRate: 1 });
        const high = calculate({ inflationRate: 4 });

        expect(high.monthlySavings).toBeGreaterThan(low.monthlySavings);
        expect(high.requiredSavings).toBeGreaterThan(low.requiredSavings);
    });

    it('higher expenses increase monthly savings and required savings', () => {
        const low = calculate({ monthlyExpenses: 5000 });
        const high = calculate({ monthlyExpenses: 12000 });

        expect(high.monthlySavings).toBeGreaterThan(low.monthlySavings);
        expect(high.requiredSavings).toBeGreaterThan(low.requiredSavings);
    });

    it('keeps required savings monotonic in long high-inflation scenarios', () => {
        const base = calculate({
            currentAge: 43,
            earlyRetirementAge: 78,
            legalRetirementAge: 109,
            planningEndAge: 125,
            monthlyExpenses: 86547,
            currentSavings: 200000,
            annualReturn: 1.77,
            inflationRate: 9.81,
            expectedSavingsAtLegalRetirement: 0,
            monthlyPension: 141644
        });
        const higherExpenses = calculate({
            currentAge: 43,
            earlyRetirementAge: 78,
            legalRetirementAge: 109,
            planningEndAge: 125,
            monthlyExpenses: 108184,
            currentSavings: 200000,
            annualReturn: 1.77,
            inflationRate: 9.81,
            expectedSavingsAtLegalRetirement: 0,
            monthlyPension: 141644
        });

        expect(higherExpenses.status).toBe('solved');
        expect(higherExpenses.monthlySavings).toBeGreaterThan(base.monthlySavings);
        expect(higherExpenses.requiredSavings).toBeGreaterThan(base.requiredSavings);
    });

    it('returns the minimal feasible integer monthly savings after rounding', () => {
        const base = calculate({
            currentAge: 61,
            earlyRetirementAge: 65,
            legalRetirementAge: 65,
            planningEndAge: 72,
            monthlyExpenses: 20454,
            currentSavings: 10263777,
            annualReturn: -6.37,
            inflationRate: 3.44,
            expectedSavingsAtLegalRetirement: 20626658,
            monthlyPension: 101666
        });
        const higherCoveredExpenses = calculate({
            currentAge: 61,
            earlyRetirementAge: 65,
            legalRetirementAge: 65,
            planningEndAge: 72,
            monthlyExpenses: 25568,
            currentSavings: 10263777,
            annualReturn: -6.37,
            inflationRate: 3.44,
            expectedSavingsAtLegalRetirement: 20626658,
            monthlyPension: 101666
        });

        expect(base.status).toBe('solved');
        expect(higherCoveredExpenses.status).toBe('solved');
        expect(higherCoveredExpenses.monthlySavings).toBe(base.monthlySavings);
    });

    it('higher current savings lower monthly savings and raise progress', () => {
        const low = calculate({ currentSavings: 0 });
        const high = calculate({ currentSavings: 1000000 });

        expect(high.monthlySavings).toBeLessThan(low.monthlySavings);
        expect(high.savingsProgress).toBeGreaterThan(low.savingsProgress);
        expect(high.requiredSavings).toBe(low.requiredSavings);
    });

    it('longer planning horizons require at least as much monthly savings', () => {
        const shorter = calculate({ planningEndAge: 75 });
        const longer = calculate({ planningEndAge: 90 });

        expect(longer.monthlySavings).toBeGreaterThanOrEqual(shorter.monthlySavings);
        expect(longer.requiredSavings).toBeGreaterThanOrEqual(shorter.requiredSavings);
    });

    it('higher legal-retirement asset targets increase monthly savings', () => {
        const noTarget = calculate({ expectedSavingsAtLegalRetirement: 0 });
        const highTarget = calculate({ expectedSavingsAtLegalRetirement: 2000000 });

        expect(highTarget.monthlySavings).toBeGreaterThan(noTarget.monthlySavings);
        expect(highTarget.legalRetirementTarget).toBeGreaterThan(noTarget.legalRetirementTarget);
    });
});

describe('calculateRetirement edge cases', () => {
    it('solves large targets instead of returning a fixed search cap', () => {
        const result = calculate({
            currentSavings: 0,
            expectedSavingsAtLegalRetirement: 100000000
        });

        expect(result.status).toBe('solved');
        expect(result.monthlySavings).toBeGreaterThan(defaultArgs.monthlyExpenses * 10);
        expect(result.legalRetirementSavings).toBeGreaterThanOrEqual(result.legalRetirementTarget);
    });

    it('solves targets that need more than one hundred million per month', () => {
        const result = calculate({
            currentAge: 30,
            earlyRetirementAge: 31,
            legalRetirementAge: 31,
            monthlyExpenses: 0,
            currentSavings: 0,
            annualReturn: 0,
            inflationRate: 0,
            expectedSavingsAtLegalRetirement: 4000000000,
            monthlyPension: 0,
            planningEndAge: 31
        });

        expect(result.status).toBe('solved');
        expect(result.monthlySavings).toBe(333333334);
        expect(result.legalRetirementSavings).toBeGreaterThanOrEqual(result.legalRetirementTarget);
    });

    it('reports infeasible when there are no saving years and assets are insufficient', () => {
        const result = calculate({
            currentAge: 40,
            earlyRetirementAge: 40,
            currentSavings: 200000
        });

        expect(result.status).toBe('infeasible');
        expect(result.monthlySavings).toBeNull();
        expect(result.shortfall).toBeGreaterThan(0);
    });

    it('allows immediate retirement when existing assets are sufficient', () => {
        const result = calculate({
            currentAge: 40,
            earlyRetirementAge: 40,
            currentSavings: 10000000
        });

        expect(result.status).toBe('solved');
        expect(result.monthlySavings).toBe(0);
        expect(result.savingsProgress).toBe(100);
    });

    it('handles zero expenses and zero target as already complete', () => {
        const result = calculate({
            monthlyExpenses: 0,
            currentSavings: 0,
            expectedSavingsAtLegalRetirement: 0,
            monthlyPension: 0
        });

        expect(result.status).toBe('solved');
        expect(result.monthlySavings).toBe(0);
        expect(result.requiredSavings).toBe(0);
        expect(result.savingsProgress).toBe(100);
    });

    it('handles zero expenses with a future legal-retirement target', () => {
        const result = calculate({
            monthlyExpenses: 0,
            currentSavings: 0,
            expectedSavingsAtLegalRetirement: 1000000,
            monthlyPension: 0
        });

        expect(result.status).toBe('solved');
        expect(result.monthlySavings).toBeGreaterThan(0);
        expect(result.legalRetirementSavings).toBeGreaterThanOrEqual(result.legalRetirementTarget);
    });
});

describe('calculateRetirement invariants across scenario grids', () => {
    it('keeps outputs finite and in range across representative inputs', () => {
        const scenarios = [];

        [25, 30, 40].forEach((currentAge) => {
            [currentAge + 5, currentAge + 10].forEach((earlyRetirementAge) => {
                [63, 70].forEach((legalRetirementAge) => {
                    [0, 5000, 12000].forEach((monthlyExpenses) => {
                        [0, 200000, 2000000].forEach((currentSavings) => {
                            [-2, 0, 3.5, 8].forEach((annualReturn) => {
                                [0, 2, 5].forEach((inflationRate) => {
                                    scenarios.push({
                                        currentAge,
                                        earlyRetirementAge,
                                        legalRetirementAge: Math.max(legalRetirementAge, earlyRetirementAge),
                                        monthlyExpenses,
                                        currentSavings,
                                        annualReturn,
                                        inflationRate,
                                        planningEndAge: 85
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        scenarios.forEach((scenario) => {
            const result = calculate(scenario);

            expect(result.status === 'solved' || result.status === 'infeasible').toBe(true);
            expect(result.savingsProgress).toBeGreaterThanOrEqual(0);
            expect(result.savingsProgress).toBeLessThanOrEqual(100);
            expect(result.chartData).toHaveLength(scenario.planningEndAge - scenario.currentAge + 1);
            expectFiniteNumbers(result);

            if (result.status === 'solved') {
                expect(result.monthlySavings).not.toBeNull();
                expect(result.planningEndSavings).toBeGreaterThanOrEqual(0);
                expect(result.legalRetirementSavings + 1).toBeGreaterThanOrEqual(result.legalRetirementTarget);
            }
        });
    });
});
