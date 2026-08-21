/* =========================================
   MATHLAB — CALCULUS ENGINE
   VERSION 2
========================================= */

(() => {

    "use strict";


    /* =========================================
       DOM ELEMENTS
    ========================================= */

    const operation =
        document.getElementById("calculus-operation");

    const functionInput =
        document.getElementById("calculus-function");

    const xInput =
        document.getElementById("calculus-x");

    const xContainer =
        document.getElementById("calculus-x-container");

    const integralContainer =
        document.getElementById(
            "calculus-integral-container"
        );

    const limitContainer =
        document.getElementById(
            "calculus-limit-container"
        );

    const lowerInput =
        document.getElementById("calculus-lower");

    const upperInput =
        document.getElementById("calculus-upper");

    const calculateButton =
        document.getElementById("calculus-calculate");

    const result =
        document.getElementById("calculus-result");


    /* =========================================
       VERIFY HTML
    ========================================= */

    if (
        !operation ||
        !functionInput ||
        !xInput ||
        !xContainer ||
        !integralContainer ||
        !limitContainer ||
        !lowerInput ||
        !upperInput ||
        !calculateButton ||
        !result
    ) {

        console.error(
            "MathLab Calculus: Required HTML elements are missing."
        );

        return;
    }


    /* =========================================
       NUMBER FORMATTER
    ========================================= */

    function formatNumber(value) {

        if (
            Math.abs(value) < 1e-12
        ) {

            return "0";

        }

        return Number(
            value.toPrecision(12)
        ).toString();

    }


    /* =========================================
       FUNCTION EVALUATOR
    ========================================= */

    function evaluateFunction(expression, x) {

        let formula =
            expression.trim();


        if (
            formula === ""
        ) {

            throw new Error(
                "Please enter a function."
            );

        }


        /* Powers */

        formula =
            formula.replace(
                /\^/g,
                "**"
            );


        /* Constants */

        formula =
            formula.replace(
                /\bpi\b/gi,
                "Math.PI"
            );


        /* Functions */

        formula =
            formula.replace(
                /\bsin\s*\(/gi,
                "Math.sin("
            );

        formula =
            formula.replace(
                /\bcos\s*\(/gi,
                "Math.cos("
            );

        formula =
            formula.replace(
                /\btan\s*\(/gi,
                "Math.tan("
            );

        formula =
            formula.replace(
                /\bsqrt\s*\(/gi,
                "Math.sqrt("
            );

        formula =
            formula.replace(
                /\bln\s*\(/gi,
                "Math.log("
            );

        formula =
            formula.replace(
                /\blog\s*\(/gi,
                "Math.log10("
            );

        formula =
            formula.replace(
                /\babs\s*\(/gi,
                "Math.abs("
            );

        formula =
            formula.replace(
                /\bexp\s*\(/gi,
                "Math.exp("
            );


        /* Implicit multiplication */

        formula =
            formula.replace(
                /(\d)\s*x\b/gi,
                "$1*x"
            );

        formula =
            formula.replace(
                /(\d)\s*\(/g,
                "$1*("
            );

        formula =
            formula.replace(
                /\)\s*\(/g,
                ")*("
            );


        /* Evaluate */

        const evaluator =
            Function(
                "x",
                `"use strict"; return (${formula});`
            );


        const answer =
            evaluator(x);


        if (
            typeof answer !== "number" ||
            !Number.isFinite(answer)
        ) {

            throw new Error(
                "The function produced an invalid result."
            );

        }


        return answer;

    }


    /* =========================================
       INPUT DISPLAY
    ========================================= */

    function updateCalculusInputs() {

    const selectedOperation = operation.value;

    /* Hide operation-specific containers */

    xContainer.style.display = "none";

    integralContainer.style.display = "none";

    limitContainer.style.display = "none";


    /* Evaluate Function */

    if (selectedOperation === "evaluate") {

        xContainer.style.display = "block";

    }


    /* Numerical Derivative */

    else if (selectedOperation === "derivative") {

        xContainer.style.display = "block";

    }


    /* Definite Integral */

    else if (selectedOperation === "integral") {

        integralContainer.style.display = "block";

    }


    /* Numerical Limit */

    else if (selectedOperation === "limit") {

        limitContainer.style.display = "block";

    }

}


    /* =========================================
       FUNCTION EVALUATION
    ========================================= */

    function calculateFunction() {

        const expression =
            functionInput.value.trim();

        const x =
            Number(xInput.value);


        if (
            expression === ""
        ) {

            result.innerHTML =
                "<p>Please enter a function.</p>";

            return;

        }


        if (
            !Number.isFinite(x)
        ) {

            result.innerHTML =
                "<p>Please enter a valid value for x.</p>";

            return;

        }


        try {

            const answer =
                evaluateFunction(
                    expression,
                    x
                );


            result.innerHTML = `

                <p>
                    <strong>
                        f(${formatNumber(x)})
                        =
                        ${formatNumber(answer)}
                    </strong>
                </p>

                <p>
                    Function:
                    <code>${expression}</code>
                </p>

            `;

        }

        catch (error) {

            result.innerHTML = `

                <p>
                    <strong>
                        Calculation error
                    </strong>
                </p>

                <p>
                    ${error.message}
                </p>

            `;

            console.error(
                "Calculus:",
                error
            );

        }

    }


    /* =========================================
       NUMERICAL DIFFERENTIATION
    ========================================= */

    function calculateDerivative() {

        const expression =
            functionInput.value.trim();

        const x =
            Number(xInput.value);


        if (
            expression === ""
        ) {

            result.innerHTML =
                "<p>Please enter a function.</p>";

            return;

        }


        if (
            !Number.isFinite(x)
        ) {

            result.innerHTML =
                "<p>Please enter a valid value for x.</p>";

            return;

        }


        try {

            const h =
                0.000001;


            const forward =
                evaluateFunction(
                    expression,
                    x + h
                );


            const backward =
                evaluateFunction(
                    expression,
                    x - h
                );


            const derivative =
                (
                    forward -
                    backward
                ) /
                (2 * h);


            result.innerHTML = `

                <p>
                    <strong>
                        f'(${formatNumber(x)})
                        ≈
                        ${formatNumber(derivative)}
                    </strong>
                </p>

                <p>
                    Function:
                    <code>${expression}</code>
                </p>

                <p>
                    Method:
                    Central Difference
                </p>

            `;

        }

        catch (error) {

            result.innerHTML = `

                <p>
                    <strong>
                        Differentiation error
                    </strong>
                </p>

                <p>
                    ${error.message}
                </p>

            `;

            console.error(
                "Calculus differentiation:",
                error
            );

        }

    }


    /* =========================================
       DEFINITE INTEGRATION
       SIMPSON'S RULE
    ========================================= */

    function calculateIntegral() {

        const expression =
            functionInput.value.trim();


        const lower =
            Number(
                lowerInput.value
            );


        const upper =
            Number(
                upperInput.value
            );


        if (
            expression === ""
        ) {

            result.innerHTML =
                "<p>Please enter a function.</p>";

            return;

        }


        if (
            !Number.isFinite(lower) ||
            !Number.isFinite(upper)
        ) {

            result.innerHTML =
                "<p>Please enter valid integration limits.</p>";

            return;

        }


        if (
            lower === upper
        ) {

            result.innerHTML = `

                <p>
                    <strong>
                        Integral = 0
                    </strong>
                </p>

            `;

            return;

        }


        try {

            /*
             * Simpson's Rule
             *
             * n must be even.
             */

            const n = 1000;


            const h =
                (upper - lower) / n;


            let sum =
                evaluateFunction(
                    expression,
                    lower
                )
                +
                evaluateFunction(
                    expression,
                    upper
                );


            /* Odd terms */

            for (
                let i = 1;
                i < n;
                i += 2
            ) {

                const x =
                    lower + i * h;


                sum +=
                    4 *
                    evaluateFunction(
                        expression,
                        x
                    );

            }


            /* Even terms */

            for (
                let i = 2;
                i < n;
                i += 2
            ) {

                const x =
                    lower + i * h;


                sum +=
                    2 *
                    evaluateFunction(
                        expression,
                        x
                    );

            }


            const integral =
                (h / 3) * sum;


            if (
                !Number.isFinite(integral)
            ) {

                throw new Error(
                    "The integral produced an invalid result."
                );

            }


            result.innerHTML = `

                <p>
                    <strong>
                        ∫ f(x) dx
                        ≈
                        ${formatNumber(integral)}
                    </strong>
                </p>

                <p>
                    Function:
                    <code>${expression}</code>
                </p>

                <p>
                    Interval:
                    [
                    ${formatNumber(lower)},
                    ${formatNumber(upper)}
                    ]
                </p>

                <p>
                    Method:
                    Simpson's Rule
                </p>

            `;

        }

        catch (error) {

            result.innerHTML = `

                <p>
                    <strong>
                        Integration error
                    </strong>
                </p>

                <p>
                    ${error.message}
                </p>

            `;

            console.error(
                "Calculus integration:",
                error
            );

        }

    }


    /* =========================================
     NUMERICAL LIMIT
    ========================================= */

    function calculateLimit() {

    const expression =
        functionInput.value.trim();

    const limitPoint =
        Number(
            document.getElementById(
                "calculus-limit-point"
            ).value
        );


    if (expression === "") {

        result.innerHTML =
            "<p>Please enter a function.</p>";

        return;
    }


    if (!Number.isFinite(limitPoint)) {

        result.innerHTML =
            "<p>Please enter a valid limit point.</p>";

        return;
    }


    try {

        /*
         * Approach the limit point from
         * both sides using progressively
         * smaller values of h.
         */

        const steps = [
            1e-2,
            1e-3,
            1e-4,
            1e-5,
            1e-6
        ];


        let leftValue;
        let rightValue;


        for (const h of steps) {

            leftValue =
                evaluateFunction(
                    expression,
                    limitPoint - h
                );

            rightValue =
                evaluateFunction(
                    expression,
                    limitPoint + h
                );

        }


        /*
         * Difference between the two
         * one-sided approximations.
         */

        const difference =
            Math.abs(
                leftValue -
                rightValue
            );


        /*
         * If the two sides are sufficiently
         * close, treat them as the same limit.
         */

        const tolerance = 1e-5;


        if (difference <= tolerance) {

            const limit =
                (
                    leftValue +
                    rightValue
                ) / 2;


            result.innerHTML = `

                <p>
                    <strong>
                        Limit exists
                    </strong>
                </p>

                <p>
                    lim x → ${formatNumber(limitPoint)}
                    f(x)
                    ≈
                    <strong>
                        ${formatNumber(limit)}
                    </strong>
                </p>

                <p>
                    Left-hand limit:
                    ${formatNumber(leftValue)}
                </p>

                <p>
                    Right-hand limit:
                    ${formatNumber(rightValue)}
                </p>

                <p>
                    Difference:
                    ${formatNumber(difference)}
                </p>

                <p>
                    Method:
                    Numerical approximation
                </p>

            `;

        }

        else {

            result.innerHTML = `

                <p>
                    <strong>
                        Two-sided limit does not exist
                    </strong>
                </p>

                <p>
                    lim x → ${formatNumber(limitPoint)}
                    f(x)
                </p>

                <p>
                    Left-hand limit:
                    ${formatNumber(leftValue)}
                </p>

                <p>
                    Right-hand limit:
                    ${formatNumber(rightValue)}
                </p>

                <p>
                    Difference:
                    ${formatNumber(difference)}
                </p>

                <p>
                    The left and right-hand
                    limits do not agree.
                </p>

            `;

        }

    }

    catch (error) {

        result.innerHTML = `

            <p>
                <strong>
                    Limit calculation error
                </strong>
            </p>

            <p>
                ${error.message}
            </p>

        `;

        console.error(
            "Calculus limit:",
            error
        );

    }

}


    /* =========================================
       MAIN CALCULATE BUTTON
    ========================================= */

    calculateButton.addEventListener(
        "click",
        function () {

            const selectedOperation =
                operation.value;


            if (
                selectedOperation === "evaluate"
            ) {

                calculateFunction();

            }

            else if (
                selectedOperation === "derivative"
            ) {

                calculateDerivative();

            }

            else if (
                selectedOperation === "integral"
            ) {

                calculateIntegral();

            }

            else if (
    selectedOperation === "limit"
) {

    calculateLimit();

}

            else {

                result.innerHTML = `

                    <p>
                        This operation has not
                        been implemented yet.
                    </p>

                `;

            }

        }
    );


    /* =========================================
       OPERATION CHANGE
    ========================================= */

    operation.addEventListener(
        "change",
        updateCalculusInputs
    );


    /* =========================================
       ENTER KEY
    ========================================= */

    functionInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                if (
                    operation.value === "evaluate"
                ) {

                    calculateFunction();

                }

                else if (
                    operation.value === "derivative"
                ) {

                    calculateDerivative();

                }

            }

        }
    );


    xInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                if (
                    operation.value === "evaluate"
                ) {

                    calculateFunction();

                }

                else if (
                    operation.value === "derivative"
                ) {

                    calculateDerivative();

                }

            }

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    updateCalculusInputs();


    console.log(
        "MathLab Calculus Engine loaded successfully."
    );

})();