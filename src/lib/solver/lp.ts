import type { LinearBound, LinearConstraint, LinearModel, LinearObjective, LinearTerm } from "./linear-model";

export function getLP(model: LinearModel): string {
    return [
        getObjective(model.objective),
        "Subject To",
        ...model.constraints.map(getConstraint),
        "Bounds",
        ...model.bounds.map(getBound),
        "End",
    ].join("\n");
}

function getObjective(objective: LinearObjective): string {
    return [
        objective.direction === "minimize" ? "Minimize" : "Maximize",
        `  objective: ${getExpression(objective.coefficients)}`,
    ].join("\n");
}

function getConstraint(constraint: LinearConstraint): string {
    const expression = getExpression(constraint.coefficients);
    const { id, lowerBound, upperBound } = constraint;

    if (lowerBound !== undefined && upperBound !== undefined) {
        if (lowerBound === upperBound) {
            return `  ${id}: ${expression} = ${lowerBound}`;
        }

        return `  ${id}: ${lowerBound} <= ${expression} <= ${upperBound}`;
    }

    if (lowerBound !== undefined) {
        return `  ${id}: ${expression} >= ${lowerBound}`;
    }

    if (upperBound !== undefined) {
        return `  ${id}: ${expression} <= ${upperBound}`;
    }

    return `  ${id}: ${expression}`;
}

function getBound(bound: LinearBound): string {
    const { variable, lowerBound, upperBound } = bound;

    if (lowerBound !== undefined && upperBound !== undefined) {
        if (lowerBound === upperBound) {
            return `  ${variable} = ${lowerBound}`;
        }

        return `  ${lowerBound} <= ${variable} <= ${upperBound}`;
    }

    if (lowerBound !== undefined) {
        return `  ${variable} >= ${lowerBound}`;
    }

    if (upperBound !== undefined) {
        return `  ${variable} <= ${upperBound}`;
    }

    return `  ${variable} free`;
}

function getExpression(terms: LinearTerm[]): string {
    return terms
        .map((term, index) => getTerm(term, index === 0))
        .join(" ");
}

function getTerm(term: LinearTerm, first: boolean): string {
    const { variable, coefficient } = term;
    const sign = coefficient < 0 ? "-" : "+";
    const value = Math.abs(coefficient);

    const termValue = value === 1
        ? variable
        : `${value} ${variable}`;

    if (first) {
        return coefficient < 0 ? `- ${termValue}` : termValue;
    }

    return `${sign} ${termValue}`;
}
