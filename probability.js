/* =========================================
   PROBABILITY MODULE
========================================= */

const probabilityOperation =
    document.getElementById("probability-operation");

const basicProbabilityInputs =
    document.getElementById("basic-probability-inputs");

const factorialInputs =
    document.getElementById("factorial-inputs");

const nrInputs =
    document.getElementById("nr-inputs");

const conditionalInputs =
    document.getElementById("conditional-inputs");

const binomialInputs =
    document.getElementById("binomial-inputs");

const normalInputs =
    document.getElementById("normal-inputs");

const normalType =
    document.getElementById("normal-type");

const probabilityButton =
    document.getElementById("probability-calculate");

const probabilityResult =
    document.getElementById("probability-result");


/* =========================================
   CHANGE INPUTS WHEN OPERATION CHANGES
========================================= */

if (probabilityOperation) {

    probabilityOperation.addEventListener(
        "change",
        updateProbabilityInputs
    );

}


/* =========================================
   UPDATE PROBABILITY INPUTS
========================================= */

function updateProbabilityInputs() {

    const operation =
        probabilityOperation.value;


    basicProbabilityInputs.style.display = "none";
    factorialInputs.style.display = "none";
    nrInputs.style.display = "none";
    conditionalInputs.style.display = "none";
    binomialInputs.style.display = "none";
    normalInputs.style.display = "none";


    if (operation === "basic") {

        basicProbabilityInputs.style.display = "block";

    }

    else if (operation === "factorial") {

        factorialInputs.style.display = "block";

    }

    else if (
        operation === "combination" ||
        operation === "permutation"
    ) {

        nrInputs.style.display = "block";

    }

    else if (operation === "conditional") {

        conditionalInputs.style.display = "block";

    }

    else if (operation === "binomial") {

        binomialInputs.style.display = "block";

    }

    else if (operation === "normal") {

        normalInputs.style.display = "block";

    }

}


/* =========================================
   NORMAL DISTRIBUTION INPUTS
========================================= */

if (normalType) {

    normalType.addEventListener(
        "change",
        updateNormalInputs
    );

}


function updateNormalInputs() {

    const upper =
        document.getElementById("normal-upper");

    if (!upper) return;


    if (normalType.value === "between") {

        upper.style.display = "block";

    }

    else {

        upper.style.display = "none";

    }

}
/* CALCULATE */

probabilityButton.addEventListener(
    "click",
    calculateProbability
);

/* =========================================
   NORMAL CDF
========================================= */

function normalCDF(z) {

    const sign =
        z < 0 ? -1 : 1;

    const x =
        Math.abs(z) / Math.sqrt(2);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t =
        1 / (1 + p * x);

    const erf =
        1 -
        (
            (
                (
                    (
                        (
                            a5 * t +
                            a4
                        ) * t +
                        a3
                    ) * t +
                    a2
                ) * t +
                a1
            ) * t
        ) *
        Math.exp(-x * x);

    return (
        0.5 *
        (1 + sign * erf)
    );

}


function calculateProbability() {

    const operation =
        probabilityOperation.value;


    try {

        /* BASIC PROBABILITY */

        if (operation === "basic") {

            const favourable =
                Number(
                    document.getElementById(
                        "favourable-outcomes"
                    ).value
                );

            const total =
                Number(
                    document.getElementById(
                        "total-outcomes"
                    ).value
                );


            if (
                total <= 0 ||
                favourable < 0 ||
                favourable > total
            ) {

                throw new Error(
                    "Invalid probability values."
                );

            }


            const probability =
                favourable / total;


            probabilityResult.innerHTML = `
                <strong>P = ${probability}</strong>
                <br>
                Percentage:
                ${(probability * 100).toFixed(2)}%
            `;

        }


        /* FACTORIAL */

        else if (operation === "factorial") {

            const n =
                Number(
                    document.getElementById(
                        "factorial-n"
                    ).value
                );


            if (
                !Number.isInteger(n) ||
                n < 0
            ) {

                throw new Error(
                    "n must be a non-negative integer."
                );

            }


            const answer =
                factorial(n);


            probabilityResult.innerHTML = `
                <strong>${n}! = ${answer}</strong>
            `;

        }


        /* COMBINATION */

        else if (operation === "combination") {

            const n =
                Number(
                    document.getElementById(
                        "probability-n"
                    ).value
                );

            const r =
                Number(
                    document.getElementById(
                        "probability-r"
                    ).value
                );


            validateNR(n, r);


            const answer =
                combination(n, r);


            probabilityResult.innerHTML = `
                <strong>${n}C${r} = ${answer}</strong>
            `;

        }


        /* PERMUTATION */

        else if (operation === "permutation") {

            const n =
                Number(
                    document.getElementById(
                        "probability-n"
                    ).value
                );

            const r =
                Number(
                    document.getElementById(
                        "probability-r"
                    ).value
                );


            validateNR(n, r);


            const answer =
                permutation(n, r);


            probabilityResult.innerHTML = `
                <strong>${n}P${r} = ${answer}</strong>
            `;

        }
        /* BINOMIAL DISTRIBUTION */
       /* BINOMIAL DISTRIBUTION */

else if (operation === "binomial") {

    const type =
        document.getElementById(
            "binomial-type"
        ).value;


    const n =
        Number(
            document.getElementById(
                "binomial-n"
            ).value
        );


    const k =
        Number(
            document.getElementById(
                "binomial-k"
            ).value
        );


    const p =
        Number(
            document.getElementById(
                "binomial-p"
            ).value
        );


    /* VALIDATION */

    if (
        !Number.isInteger(n) ||
        !Number.isInteger(k) ||
        n < 0 ||
        k < 0 ||
        k > n
    ) {

        throw new Error(
            "n and k must be integers with 0 ≤ k ≤ n."
        );

    }


    if (p < 0 || p > 1) {

        throw new Error(
            "Probability p must be between 0 and 1."
        );

    }


    /* EXACT PROBABILITY */

    function binomialProbability(x) {

        return (
            combination(n, x) *
            Math.pow(p, x) *
            Math.pow(1 - p, n - x)
        );

    }


    let probability;


    /* P(X = k) */

    if (type === "exact") {

        probability =
            binomialProbability(k);

    }


    /* P(X ≤ k) */

    else if (type === "less") {

        probability = 0;

        for (
            let x = 0;
            x <= k;
            x++
        ) {

            probability +=
                binomialProbability(x);

        }

    }


    /* P(X ≥ k) */

    else if (type === "greater") {

        probability = 0;

        for (
            let x = k;
            x <= n;
            x++
        ) {

            probability +=
                binomialProbability(x);

        }

    }


    /* DISTRIBUTION PARAMETERS */

    const expectedValue =
        n * p;


    const variance =
        n * p * (1 - p);


    const standardDeviation =
        Math.sqrt(variance);


    /* DISPLAY */

    let probabilityLabel;

    if (type === "exact") {

        probabilityLabel =
            `P(X = ${k})`;

    }

    else if (type === "less") {

        probabilityLabel =
            `P(X ≤ ${k})`;

    }

    else {

        probabilityLabel =
            `P(X ≥ ${k})`;

    }


    probabilityResult.innerHTML = `

        <p>
            <strong>
                ${probabilityLabel}:
            </strong>

            ${probability.toFixed(8)}
        </p>

        <p>
            <strong>Percentage:</strong>
            ${(probability * 100).toFixed(4)}%
        </p>

        <hr>

        <p>
            <strong>Expected Value:</strong>
            ${expectedValue.toFixed(4)}
        </p>

        <p>
            <strong>Variance:</strong>
            ${variance.toFixed(4)}
        </p>

        <p>
            <strong>Standard Deviation:</strong>
            ${standardDeviation.toFixed(4)}
        </p>

    `;

} 
/* NORMAL DISTRIBUTION */

else if (operation === "normal") {

    const type =
        document.getElementById(
            "normal-type"
        ).value;


    const mean =
        Number(
            document.getElementById(
                "normal-mean"
            ).value
        );


    const sd =
        Number(
            document.getElementById(
                "normal-sd"
            ).value
        );


    const x =
        Number(
            document.getElementById(
                "normal-x"
            ).value
        );


    if (
        !Number.isFinite(mean) ||
        !Number.isFinite(sd) ||
        !Number.isFinite(x)
    ) {

        throw new Error(
            "Please enter valid numerical values."
        );

    }


    if (sd <= 0) {

        throw new Error(
            "Standard deviation must be greater than zero."
        );

    }


    let probability;

    let zScore;


    /* P(X ≤ x) */

    if (type === "less") {

        zScore =
            (x - mean) / sd;


        probability =
            normalCDF(zScore);

    }


    /* P(X ≥ x) */

    else if (type === "greater") {

        zScore =
            (x - mean) / sd;


        probability =
            1 - normalCDF(zScore);

    }


    /* P(a ≤ X ≤ b) */

    else if (type === "between") {

        const upper =
            Number(
                document.getElementById(
                    "normal-upper"
                ).value
            );


        if (
            !Number.isFinite(upper) ||
            upper < x
        ) {

            throw new Error(
                "Upper value must be greater than or equal to lower value."
            );

        }


        const lowerZ =
            (x - mean) / sd;


        const upperZ =
            (upper - mean) / sd;


        probability =
            normalCDF(upperZ) -
            normalCDF(lowerZ);


        probabilityResult.innerHTML = `

            <p>
                <strong>
                    P(${x} ≤ X ≤ ${upper}):
                </strong>

                ${probability.toFixed(8)}
            </p>

            <p>
                <strong>Percentage:</strong>

                ${(probability * 100).toFixed(4)}%
            </p>

            <hr>

            <p>
                <strong>Lower Z-score:</strong>
                ${lowerZ.toFixed(4)}
            </p>

            <p>
                <strong>Upper Z-score:</strong>
                ${upperZ.toFixed(4)}
            </p>

        `;

        return;

    }


    probabilityResult.innerHTML = `

        <p>
            <strong>Z-score:</strong>
            ${zScore.toFixed(6)}
        </p>

        <p>
            <strong>Probability:</strong>
            ${probability.toFixed(8)}
        </p>

        <p>
            <strong>Percentage:</strong>
            ${(probability * 100).toFixed(4)}%
        </p>

    `;

}



        /* CONDITIONAL PROBABILITY */

        else if (operation === "conditional") {

            const intersection =
                Number(
                    document.getElementById(
                        "intersection-probability"
                    ).value
                );

            const condition =
                Number(
                    document.getElementById(
                        "condition-probability"
                    ).value
                );


            if (
                intersection < 0 ||
                condition <= 0 ||
                intersection > condition
            ) {

                throw new Error(
                    "Invalid probability values."
                );

            }


            const answer =
                intersection / condition;


            probabilityResult.innerHTML = `
                <strong>
                    P(A|B) = ${answer.toFixed(6)}
                </strong>

                <br>

                Percentage:
                ${(answer * 100).toFixed(2)}%
            `;

        }

    }

    catch (error) {

        probabilityResult.textContent =
            error.message;

    }

}


/* =========================================
   FACTORIAL
========================================= */

function factorial(n) {

    let result = 1;


    for (
        let i = 2;
        i <= n;
        i++
    ) {

        result *= i;

    }


    return result;

}


/* =========================================
   COMBINATION
========================================= */

function combination(n, r) {

    return (
        factorial(n) /
        (
            factorial(r) *
            factorial(n - r)
        )
    );

}


/* =========================================
   PERMUTATION
========================================= */

function permutation(n, r) {

    return (
        factorial(n) /
        factorial(n - r)
    );

}


/* =========================================
   VALIDATE n AND r
========================================= */

function validateNR(n, r) {

    if (
        !Number.isInteger(n) ||
        !Number.isInteger(r)
    ) {

        throw new Error(
            "n and r must be integers."
        );

    }

    if (
        n < 0 ||
        r < 0 ||
        r > n
    ) {

        throw new Error(
            "Make sure n ≥ r ≥ 0."
        );

    }

}
    /* =========================================
   NORMAL DISTRIBUTION
========================================= */

function normalCDF(z) {

    const sign =
        z < 0 ? -1 : 1;

    z = Math.abs(z) / Math.sqrt(2);


    const t =
        1 /
        (
            1 +
            0.3275911 * z
        );


    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;


    const erf =
        1 -
        (
            (
                (
                    (
                        (
                            a5 * t +
                            a4
                        ) * t +
                        a3
                    ) * t +
                    a2
                ) * t +
                a1
            ) * t *
            Math.exp(-z * z)
        );


    return (
        0.5 *
        (1 + sign * erf)
    );

}

