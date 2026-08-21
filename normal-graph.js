/* =========================================
   MATHLAB — NORMAL DISTRIBUTION GRAPH
========================================= */

(() => {

    "use strict";


    /* =========================================
       HTML ELEMENTS
    ========================================== */

    const canvas =
        document.getElementById(
            "normal-distribution-graph"
        );

    const container =
        document.getElementById(
            "normal-graph-container"
        );

    const probabilityOperation =
        document.getElementById(
            "probability-operation"
        );

    const probabilityButton =
        document.getElementById(
            "probability-calculate"
        );

    const resetButton =
        document.getElementById(
            "normal-graph-reset"
        );


    if (
        !canvas ||
        !container ||
        !probabilityOperation ||
        !probabilityButton
    ) {

        console.error(
            "Normal Graph: required elements not found."
        );

        return;
    }


    const ctx =
        canvas.getContext("2d");


    /* =========================================
       NORMAL PDF
    ========================================== */

    function normalPDF(
        x,
        mean,
        sd
    ) {

        const coefficient =
            1 /
            (
                sd *
                Math.sqrt(
                    2 * Math.PI
                )
            );


        const exponent =
            -0.5 *
            Math.pow(
                (x - mean) / sd,
                2
            );


        return (
            coefficient *
            Math.exp(exponent)
        );

    }


    /* =========================================
       DRAW NORMAL DISTRIBUTION
    ========================================== */

    function drawNormalGraph() {

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

        const type =
            document.getElementById(
                "normal-type"
            ).value;


        /* Validation */

        if (
            !Number.isFinite(mean) ||
            !Number.isFinite(sd) ||
            !Number.isFinite(x) ||
            sd <= 0
        ) {

            return;

        }


        /* Show graph */

        container.style.display =
            "block";


        const width =
            canvas.width;

        const height =
            canvas.height;


        /* =====================================
           GRAPH RANGE
        ====================================== */

        let xMin =
            mean - 4 * sd;

        let xMax =
            mean + 4 * sd;


        /*
         * Make sure selected x
         * is visible.
         */

        xMin =
            Math.min(
                xMin,
                x - sd
            );

        xMax =
            Math.max(
                xMax,
                x + sd
            );


        /* =====================================
           CLEAR
        ====================================== */

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /* =====================================
           GRAPH PARAMETERS
        ====================================== */

        const padding = 55;

        const graphWidth =
            width -
            2 * padding;

        const graphHeight =
            height -
            2 * padding;


        const peak =
            normalPDF(
                mean,
                mean,
                sd
            );


        const yMax =
            peak * 1.15;


        function screenX(value) {

            return (
                padding +
                (
                    (value - xMin) /
                    (xMax - xMin)
                ) *
                graphWidth
            );

        }


        function screenY(value) {

            return (
                height -
                padding -
                (
                    value / yMax
                ) *
                graphHeight
            );

        }


        /* =====================================
           GRID
        ====================================== */

        ctx.beginPath();


        for (
            let i = 0;
            i <= 8;
            i++
        ) {

            const value =
                xMin +
                (
                    i / 8
                ) *
                (xMax - xMin);


            const px =
                screenX(value);


            ctx.moveTo(
                px,
                padding
            );

            ctx.lineTo(
                px,
                height - padding
            );

        }


        for (
            let i = 0;
            i <= 4;
            i++
        ) {

            const value =
                (
                    i / 4
                ) *
                yMax;


            const py =
                screenY(value);


            ctx.moveTo(
                padding,
                py
            );

            ctx.lineTo(
                width - padding,
                py
            );

        }


        ctx.strokeStyle =
            "#e0e0e0";

        ctx.lineWidth =
            1;

        ctx.stroke();


        /* =====================================
           AXES
        ====================================== */

        ctx.beginPath();


        ctx.moveTo(
            padding,
            height - padding
        );

        ctx.lineTo(
            width - padding,
            height - padding
        );


        ctx.strokeStyle =
            "#000000";

        ctx.lineWidth =
            2;

        ctx.stroke();


        /* =====================================
           SHADED PROBABILITY
        ====================================== */

        let shadeStart =
            xMin;

        let shadeEnd =
            x;


        if (type === "greater") {

            shadeStart =
                x;

            shadeEnd =
                xMax;

        }


        if (type === "between") {

            const upper =
                Number(
                    document.getElementById(
                        "normal-upper"
                    ).value
                );


            if (
                Number.isFinite(upper)
            ) {

                shadeStart =
                    x;

                shadeEnd =
                    upper;

            }

        }


        ctx.beginPath();


        const shadeSteps = 500;


        for (
            let i = 0;
            i <= shadeSteps;
            i++
        ) {

            const value =
                shadeStart +
                (
                    i / shadeSteps
                ) *
                (
                    shadeEnd -
                    shadeStart
                );


            const px =
                screenX(value);

            const py =
                screenY(
                    normalPDF(
                        value,
                        mean,
                        sd
                    )
                );


            if (i === 0) {

                ctx.moveTo(
                    px,
                    height - padding
                );

                ctx.lineTo(
                    px,
                    py
                );

            }

            else {

                ctx.lineTo(
                    px,
                    py
                );

            }

        }


        ctx.lineTo(
            screenX(shadeEnd),
            height - padding
        );

        ctx.closePath();


        ctx.fillStyle =
            "rgba(0, 102, 204, 0.25)";

        ctx.fill();


        /* =====================================
           NORMAL CURVE
        ====================================== */

        ctx.beginPath();


        const curveSteps =
            700;


        for (
            let i = 0;
            i <= curveSteps;
            i++
        ) {

            const value =
                xMin +
                (
                    i / curveSteps
                ) *
                (
                    xMax -
                    xMin
                );


            const px =
                screenX(value);

            const py =
                screenY(
                    normalPDF(
                        value,
                        mean,
                        sd
                    )
                );


            if (i === 0) {

                ctx.moveTo(
                    px,
                    py
                );

            }

            else {

                ctx.lineTo(
                    px,
                    py
                );

            }

        }


        ctx.strokeStyle =
            "#0066cc";

        ctx.lineWidth =
            3;

        ctx.stroke();


        /* =====================================
           MEAN LINE
        ====================================== */

        ctx.beginPath();


        const meanX =
            screenX(mean);


        ctx.moveTo(
            meanX,
            height - padding
        );

        ctx.lineTo(
            meanX,
            screenY(peak)
        );


        ctx.strokeStyle =
            "#555555";

        ctx.lineWidth =
            1.5;

        ctx.stroke();


        /* =====================================
           SELECTED X LINE
        ====================================== */

        ctx.beginPath();


        const selectedX =
            screenX(x);


        ctx.moveTo(
            selectedX,
            height - padding
        );

        ctx.lineTo(
            selectedX,
            screenY(
                normalPDF(
                    x,
                    mean,
                    sd
                )
            )
        );


        ctx.strokeStyle =
            "#cc0000";

        ctx.lineWidth =
            2;

        ctx.stroke();


        /* =====================================
           LABELS
        ====================================== */

        ctx.fillStyle =
            "#000000";

        ctx.font =
            "14px Arial";


        ctx.fillText(
            `μ = ${mean}`,
            meanX + 5,
            padding + 15
        );


        ctx.fillText(
            `x = ${x}`,
            selectedX + 5,
            padding + 35
        );


        /* =====================================
           TITLE
        ====================================== */

        ctx.font =
            "16px Arial";

        ctx.fillText(
            `Normal Distribution: μ = ${mean}, σ = ${sd}`,
            padding,
            25
        );

    }


    /* =========================================
       CALCULATE BUTTON
    ========================================== */

    probabilityButton.addEventListener(
        "click",
        () => {

            if (
                probabilityOperation.value ===
                "normal"
            ) {

                setTimeout(
                    drawNormalGraph,
                    50
                );

            }

        }
    );


    /* =========================================
       OPERATION CHANGE
    ========================================== */

    probabilityOperation.addEventListener(
        "change",
        () => {

            if (
                probabilityOperation.value !==
                "normal"
            ) {

                container.style.display =
                    "none";

            }

        }
    );


    /* =========================================
       RESET
    ========================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            drawNormalGraph
        );

    }


    console.log(
        "MathLab Normal Distribution Graph loaded successfully."
    );

})();