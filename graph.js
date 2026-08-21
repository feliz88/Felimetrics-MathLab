/* =========================================
   MATHLAB — GRAPH ENGINE
   VERSION 2
   Function + Derivative
========================================= */

(() => {

    "use strict";


    /* =========================================
       HTML ELEMENTS
    ========================================== */

    const canvas =
        document.getElementById("calculus-graph");

    const resetButton =
        document.getElementById("graph-reset");

    const zoomInButton =
        document.getElementById("graph-zoom-in");

    const zoomOutButton =
        document.getElementById("graph-zoom-out");

    const derivativeCheckbox =
        document.getElementById("show-derivative");


    if (!canvas) {

        console.error(
            "Graph Engine: canvas not found."
        );

        return;
    }


    const ctx =
        canvas.getContext("2d");


    if (!ctx) {

        console.error(
            "Graph Engine: canvas context unavailable."
        );

        return;
    }


    /* =========================================
       GRAPH SETTINGS
    ========================================== */

    let xMin = -10;
    let xMax = 10;

    let yMin = -10;
    let yMax = 10;


    /* =========================================
       FUNCTION EVALUATOR
    ========================================== */

    function evaluateGraphFunction(
        expression,
        x
    ) {

        let formula =
            expression.trim();


        if (formula === "") {

            throw new Error(
                "Empty function."
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


        /* Mathematical functions */

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
                "Function produced an invalid result."
            );

        }


        return answer;

    }


    /* =========================================
       NUMERICAL DERIVATIVE
    ========================================== */

    function numericalDerivative(
        expression,
        x
    ) {

        const h =
            0.000001;


        const forward =
            evaluateGraphFunction(
                expression,
                x + h
            );


        const backward =
            evaluateGraphFunction(
                expression,
                x - h
            );


        return (
            forward - backward
        ) / (2 * h);

    }


    /* =========================================
       DRAW GRAPH
    ========================================== */

    function drawGraph() {

        /* Clear canvas */

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        const width =
            canvas.width;

        const height =
            canvas.height;


        /* =====================================
           COORDINATE CONVERSION
        ====================================== */

        function screenX(x) {

            return (
                (x - xMin) /
                (xMax - xMin)
            ) * width;

        }


        function screenY(y) {

            return (
                height -
                (
                    (y - yMin) /
                    (yMax - yMin)
                ) * height
            );

        }


        /* =====================================
           GRID
        ====================================== */

        ctx.beginPath();


        for (
            let x = Math.ceil(xMin);
            x <= xMax;
            x++
        ) {

            const px =
                screenX(x);

            ctx.moveTo(
                px,
                0
            );

            ctx.lineTo(
                px,
                height
            );

        }


        for (
            let y = Math.ceil(yMin);
            y <= yMax;
            y++
        ) {

            const py =
                screenY(y);

            ctx.moveTo(
                0,
                py
            );

            ctx.lineTo(
                width,
                py
            );

        }


        ctx.strokeStyle =
            "#dddddd";

        ctx.lineWidth =
            1;

        ctx.stroke();


        /* =====================================
           AXES
        ====================================== */

        ctx.beginPath();


        /* X-axis */

        if (
            yMin <= 0 &&
            yMax >= 0
        ) {

            const axisY =
                screenY(0);

            ctx.moveTo(
                0,
                axisY
            );

            ctx.lineTo(
                width,
                axisY
            );

        }


        /* Y-axis */

        if (
            xMin <= 0 &&
            xMax >= 0
        ) {

            const axisX =
                screenX(0);

            ctx.moveTo(
                axisX,
                0
            );

            ctx.lineTo(
                axisX,
                height
            );

        }


        ctx.strokeStyle =
            "#000000";

        ctx.lineWidth =
            2;

        ctx.stroke();


        /* =====================================
           AXIS LABELS
        ====================================== */

        ctx.fillStyle =
            "#000000";

        ctx.font =
            "12px Arial";


        for (
            let x = Math.ceil(xMin);
            x <= xMax;
            x++
        ) {

            if (x === 0) continue;


            const px =
                screenX(x);

            const axisY =
                screenY(0);


            if (
                axisY >= 0 &&
                axisY <= height
            ) {

                ctx.fillText(
                    x,
                    px + 3,
                    axisY + 15
                );

            }

        }


        for (
            let y = Math.ceil(yMin);
            y <= yMax;
            y++
        ) {

            if (y === 0) continue;


            const py =
                screenY(y);

            const axisX =
                screenX(0);


            if (
                axisX >= 0 &&
                axisX <= width
            ) {

                ctx.fillText(
                    y,
                    axisX + 5,
                    py - 3
                );

            }

        }


        /* =====================================
           GET FUNCTION
        ====================================== */

        const expressionInput =
            document.getElementById(
                "calculus-function"
            );


        if (!expressionInput) {

            return;

        }


        const expression =
            expressionInput.value.trim();


        if (expression === "") {

            return;

        }


        /* =====================================
           DRAW ORIGINAL FUNCTION
        ====================================== */

        ctx.beginPath();


        let firstPoint =
            true;


        for (
            let pixel = 0;
            pixel <= width;
            pixel++
        ) {

            const x =
                xMin +
                (
                    pixel / width
                ) *
                (xMax - xMin);


            try {

                const y =
                    evaluateGraphFunction(
                        expression,
                        x
                    );


                if (
                    !Number.isFinite(y)
                ) {

                    firstPoint = true;

                    continue;

                }


                const px =
                    screenX(x);

                const py =
                    screenY(y);


                if (
                    py < -10000 ||
                    py > 10000
                ) {

                    firstPoint = true;

                    continue;

                }


                if (firstPoint) {

                    ctx.moveTo(
                        px,
                        py
                    );

                    firstPoint = false;

                }

                else {

                    ctx.lineTo(
                        px,
                        py
                    );

                }

            }

            catch {

                firstPoint = true;

            }

        }


        ctx.strokeStyle =
            "#0066cc";

        ctx.lineWidth =
            2;

        ctx.stroke();


        /* =====================================
           DRAW DERIVATIVE
        ====================================== */

        if (
            derivativeCheckbox &&
            derivativeCheckbox.checked
        ) {

            ctx.beginPath();


            let firstDerivativePoint =
                true;


            for (
                let pixel = 0;
                pixel <= width;
                pixel++
            ) {

                const x =
                    xMin +
                    (
                        pixel / width
                    ) *
                    (xMax - xMin);


                try {

                    const derivative =
                        numericalDerivative(
                            expression,
                            x
                        );


                    if (
                        !Number.isFinite(
                            derivative
                        )
                    ) {

                        firstDerivativePoint =
                            true;

                        continue;

                    }


                    const px =
                        screenX(x);

                    const py =
                        screenY(derivative);


                    if (
                        py < -10000 ||
                        py > 10000
                    ) {

                        firstDerivativePoint =
                            true;

                        continue;

                    }


                    if (
                        firstDerivativePoint
                    ) {

                        ctx.moveTo(
                            px,
                            py
                        );

                        firstDerivativePoint =
                            false;

                    }

                    else {

                        ctx.lineTo(
                            px,
                            py
                        );

                    }

                }

                catch {

                    firstDerivativePoint =
                        true;

                }

            }


            ctx.strokeStyle =
                "#cc0000";

            ctx.lineWidth =
                2;

            ctx.stroke();

        }

    }


    /* =========================================
       ZOOM
    ========================================== */

    function zoom(factor) {

        const xCenter =
            (xMin + xMax) / 2;

        const yCenter =
            (yMin + yMax) / 2;


        const xRange =
            (xMax - xMin) * factor;

        const yRange =
            (yMax - yMin) * factor;


        xMin =
            xCenter -
            xRange / 2;

        xMax =
            xCenter +
            xRange / 2;


        yMin =
            yCenter -
            yRange / 2;

        yMax =
            yCenter +
            yRange / 2;


        drawGraph();

    }


    /* =========================================
       RESET GRAPH
    ========================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                xMin = -10;
                xMax = 10;

                yMin = -10;
                yMax = 10;

                drawGraph();

            }
        );

    }


    /* =========================================
       ZOOM IN
    ========================================== */

    if (zoomInButton) {

        zoomInButton.addEventListener(
            "click",
            () => {

                zoom(0.5);

            }
        );

    }


    /* =========================================
       ZOOM OUT
    ========================================== */

    if (zoomOutButton) {

        zoomOutButton.addEventListener(
            "click",
            () => {

                zoom(2);

            }
        );

    }


    /* =========================================
       DERIVATIVE CHECKBOX
    ========================================== */

    if (derivativeCheckbox) {

        derivativeCheckbox.addEventListener(
            "change",
            drawGraph
        );

    }


    /* =========================================
       CALCULATE BUTTON
    ========================================== */

    const calculateButton =
        document.getElementById(
            "calculus-calculate"
        );


    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            () => {

                setTimeout(
                    drawGraph,
                    50
                );

            }
        );

    }


    /* =========================================
       INITIAL GRAPH
    ========================================== */

    console.log(
        "MathLab Graph Engine loaded successfully."
    );


    drawGraph();

})();

/* =========================================
   BINOMIAL DISTRIBUTION GRAPH
   POLISHED VERSION
========================================= */

const binomialCanvas =
    document.getElementById("binomial-graph");

const binomialGraphCard =
    document.getElementById("binomial-graph-card");

const binomialResetButton =
    document.getElementById("binomial-graph-reset");

    const binomialLegend =
    document.getElementById(
        "binomial-legend"
    );


const binomialLegendState = {

    selected: true,

    distribution: true,

    mean: true,

    sd: true

};


if (
    binomialCanvas &&
    binomialGraphCard &&
    binomialResetButton
) {

    const binomialCtx =
        binomialCanvas.getContext("2d");


    /* =========================================
       DRAW BINOMIAL GRAPH
    ========================================= */

    function drawBinomialGraph() {

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

        const type =
            document.getElementById(
                "binomial-type"
            ).value;


        /* =====================================
           VALIDATION
        ===================================== */

        if (
            !Number.isInteger(n) ||
            n < 0 ||
            n > 100 ||
            !Number.isInteger(k) ||
            k < 0 ||
            k > n ||
            !Number.isFinite(p) ||
            p < 0 ||
            p > 1
        ) {

            binomialCtx.clearRect(
                0,
                0,
                binomialCanvas.width,
                binomialCanvas.height
            );

            return;
        }


        /* =====================================
           CANVAS
        ===================================== */

        const width =
            binomialCanvas.width;

        const height =
            binomialCanvas.height;


        binomialCtx.clearRect(
            0,
            0,
            width,
            height
        );


        /* =====================================
           GRAPH DIMENSIONS
        ===================================== */

        const left = 70;
        const right = 30;
        const top = 65;
        const bottom = 65;


        const graphWidth =
            width - left - right;

        const graphHeight =
            height - top - bottom;


        /* =====================================
           BINOMIAL PROBABILITIES
        ===================================== */

        const probabilities = [];


        for (
            let x = 0;
            x <= n;
            x++
        ) {

            const probability =
                combination(n, x) *
                Math.pow(p, x) *
                Math.pow(1 - p, n - x);


            probabilities.push(
                probability
            );

        }


        const maxProbability =
            Math.max(...probabilities);


        /* =====================================
           DISTRIBUTION PARAMETERS
        ===================================== */

        const mean =
            n * p;

        const variance =
            n * p * (1 - p);

        const standardDeviation =
            Math.sqrt(variance);


        /* =====================================
           TITLE
        ===================================== */

        binomialCtx.font =
            "bold 18px Arial";

        binomialCtx.fillStyle =
            "#000";

        binomialCtx.textAlign =
            "center";

        binomialCtx.fillText(
            "Binomial Distribution",
            width / 2,
            25
        );


        /* =====================================
           SUBTITLE
        ===================================== */

        binomialCtx.font =
            "13px Arial";

        binomialCtx.fillText(
            `n = ${n}    p = ${p}`,
            width / 2,
            45
        );


        /* =====================================
           GRIDLINES
        ===================================== */

        binomialCtx.strokeStyle =
            "rgba(0,0,0,0.10)";

        binomialCtx.lineWidth = 1;


        const gridSteps = 5;


        for (
            let i = 0;
            i <= gridSteps;
            i++
        ) {

            const y =
                height -
                bottom -
                (
                    i /
                    gridSteps
                ) *
                graphHeight;


            binomialCtx.beginPath();

            binomialCtx.moveTo(
                left,
                y
            );

            binomialCtx.lineTo(
                width - right,
                y
            );

            binomialCtx.stroke();

        }


        /* =====================================
           AXES
        ===================================== */

        binomialCtx.strokeStyle =
            "#000";

        binomialCtx.lineWidth = 1.5;


        binomialCtx.beginPath();

        binomialCtx.moveTo(
            left,
            top
        );

        binomialCtx.lineTo(
            left,
            height - bottom
        );

        binomialCtx.lineTo(
            width - right,
            height - bottom
        );

        binomialCtx.stroke();


        /* =====================================
           Y-AXIS LABEL
        ===================================== */

        binomialCtx.save();

        binomialCtx.translate(
            18,
            height / 2
        );

        binomialCtx.rotate(
            -Math.PI / 2
        );

        binomialCtx.font =
            "14px Arial";

        binomialCtx.textAlign =
            "center";

        binomialCtx.fillText(
            "Probability",
            0,
            0
        );

        binomialCtx.restore();


        /* =====================================
           X-AXIS LABEL
        ===================================== */

        binomialCtx.font =
            "14px Arial";

        binomialCtx.textAlign =
            "center";

        binomialCtx.fillText(
            "Number of successes (x)",
            width / 2,
            height - 18
        );


        /* =====================================
           Y-AXIS SCALE
        ===================================== */

        binomialCtx.font =
            "11px Arial";

        binomialCtx.textAlign =
            "right";


        for (
            let i = 0;
            i <= gridSteps;
            i++
        ) {

            const value =
                maxProbability *
                i /
                gridSteps;


            const y =
                height -
                bottom -
                (
                    value /
                    maxProbability
                ) *
                graphHeight;


            binomialCtx.fillText(
                value.toFixed(3),
                left - 8,
                y + 4
            );

        }


        /* =====================================
           BAR DIMENSIONS
        ===================================== */

        const spacing =
            graphWidth /
            (n + 1);


        const barWidth =
            Math.max(
                3,
                spacing * 0.65
            );


    /* =====================================
   STANDARD DEVIATION REGION
===================================== */

if (binomialLegendState.sd) {

    const lowerSD =
        Math.max(
            0,
            Math.ceil(
                mean - standardDeviation
            )
        );

    const upperSD =
        Math.min(
            n,
            Math.floor(
                mean + standardDeviation
            )
        );


    const lowerX =
        left +
        lowerSD * spacing;


    const upperX =
        left +
        (upperSD + 1) * spacing;


    binomialCtx.fillStyle =
        "rgba(0,0,0,0.06)";


    binomialCtx.fillRect(
        lowerX,
        top,
        upperX - lowerX,
        graphHeight
    );

}
        /* =====================================
           DRAW DISTRIBUTION
        ===================================== */

        probabilities.forEach(
            (probability, x) => {

                const barHeight =
                    (
                        probability /
                        maxProbability
                    ) *
                    graphHeight;


                const barX =
                    left +
                    x * spacing +
                    (
                        spacing -
                        barWidth
                    ) / 2;


                const barY =
                    height -
                    bottom -
                    barHeight;


                /* =============================
                   HIGHLIGHT LOGIC
                ============================= */

                let highlighted = false;


                if (type === "exact") {

                    highlighted =
                        x === k;

                }

                else if (type === "less") {

                    highlighted =
                        x <= k;

                }

                else if (type === "greater") {

                    highlighted =
                        x >= k;

                }


                /* =============================
                   BAR
                ============================= */

                if (
    highlighted &&
    binomialLegendState.selected
) {

    binomialCtx.fillStyle =
        "rgba(0,0,0,0.75)";

}
else if (
    !highlighted &&
    binomialLegendState.distribution
) {

    binomialCtx.fillStyle =
        "rgba(0,0,0,0.25)";

}
else {

    return;

}


                binomialCtx.fillRect(
                    barX,
                    barY,
                    barWidth,
                    barHeight
                );


                /* =============================
                   BAR BORDER
                ============================= */

                binomialCtx.strokeStyle =
                    "rgba(0,0,0,0.35)";

                binomialCtx.strokeRect(
                    barX,
                    barY,
                    barWidth,
                    barHeight
                );


                /* =============================
                   X LABELS
                ============================= */

                /*
                 * Avoid overcrowding when
                 * n becomes large.
                 */

                if (
                    n <= 20 ||
                    x % Math.ceil(n / 10) === 0
                ) {

                    binomialCtx.fillStyle =
                        "#000";

                    binomialCtx.font =
                        "11px Arial";

                    binomialCtx.textAlign =
                        "center";

                    binomialCtx.fillText(
                        x,
                        barX +
                        barWidth / 2,
                        height -
                        bottom +
                        18
                    );

                }

            }
        );

if (binomialLegendState.mean) {

        /* =====================================
           MEAN MARKER
        ===================================== */

        const meanX =
            left +
            mean *
            spacing +
            spacing / 2;


        if (
            meanX >= left &&
            meanX <= width - right
        ) {

            binomialCtx.setLineDash(
                [6, 5]
            );

            binomialCtx.strokeStyle =
                "rgba(0,0,0,0.65)";

            binomialCtx.lineWidth = 1.5;


            binomialCtx.beginPath();

            binomialCtx.moveTo(
                meanX,
                top
            );

            binomialCtx.lineTo(
                meanX,
                height - bottom
            );

            binomialCtx.stroke();


            binomialCtx.setLineDash([]);


            binomialCtx.font =
                "12px Arial";

            binomialCtx.textAlign =
                "center";

            binomialCtx.fillStyle =
                "#000";

            binomialCtx.fillText(
                `μ = ${mean.toFixed(2)}`,
                meanX,
                top - 8
            );

        }
    }

        /* =====================================
           INFORMATION PANEL
        ===================================== */

        binomialCtx.textAlign =
            "left";

        binomialCtx.font =
            "12px Arial";


        binomialCtx.fillText(
            `Mean: ${mean.toFixed(4)}`,
            left + 10,
            top + 18
        );


        binomialCtx.fillText(
            `SD: ${standardDeviation.toFixed(4)}`,
            left + 10,
            top + 34
        );

    }


    /* =========================================
       UPDATE GRAPH
    ========================================= */

    function updateBinomialGraph() {

        const operation =
            document.getElementById(
                "probability-operation"
            );


        if (
            operation &&
            operation.value === "binomial"
        ) {

            binomialGraphCard.style.display =
                "block";

            drawBinomialGraph();

        }

        else {

            binomialGraphCard.style.display =
                "none";

        }

    }


    /* =========================================
       INPUT LISTENERS
    ========================================= */

    const binomialInputIds = [

        "binomial-n",
        "binomial-k",
        "binomial-p",
        "binomial-type"

    ];


    binomialInputIds.forEach(
        id => {

            const input =
                document.getElementById(id);


            if (input) {

                input.addEventListener(
                    "input",
                    updateBinomialGraph
                );

                input.addEventListener(
                    "change",
                    updateBinomialGraph
                );

            }

        }
    );


    /* =========================================
       OPERATION LISTENER
    ========================================= */

    const probabilityOperation =
        document.getElementById(
            "probability-operation"
        );


    if (probabilityOperation) {

        probabilityOperation.addEventListener(
            "change",
            updateBinomialGraph
        );

    }


    /* =========================================
       RESET
    ========================================= */

    binomialResetButton.addEventListener(
        "click",
        () => {

            document.getElementById(
                "binomial-n"
            ).value = "";

            document.getElementById(
                "binomial-k"
            ).value = "";

            document.getElementById(
                "binomial-p"
            ).value = "";

            binomialCtx.clearRect(
                0,
                0,
                binomialCanvas.width,
                binomialCanvas.height
            );

        }
    );
    /* =========================================
   INTERACTIVE LEGEND
========================================= */

if (binomialLegend) {

    const legendItems =
        binomialLegend.querySelectorAll(
            ".legend-item"
        );


    legendItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const key =
                    item.dataset.legend;


                binomialLegendState[key] =
                    !binomialLegendState[key];


                item.classList.toggle(
                    "active",
                    binomialLegendState[key]
                );


                drawBinomialGraph();

            }
        );

    });

}


    /* =========================================
       INITIAL STATE
    ========================================= */

    binomialGraphCard.style.display =
        "none";

}