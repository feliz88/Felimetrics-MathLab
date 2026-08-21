/* =========================================
   MATHLAB — STATISTICS GRAPH ENGINE
   VERSION 1.0

   Supported:
   • Histogram
   • Frequency Polygon
   • Box Plot
   • Ogive — Less Than
   • Ogive — More Than
========================================= */

(() => {

    "use strict";


    /* =========================================
       ELEMENTS
    ========================================= */

    const canvas =
        document.getElementById(
            "statistics-graph"
        );

    const dataInput =
        document.getElementById(
            "statistics-data"
        );

    const graphType =
        document.getElementById(
            "statistics-graph-type"
        );

    const graphButton =
        document.getElementById(
            "statistics-graph-button"
        );

    const clearButton =
        document.getElementById(
            "statistics-graph-clear"
        );


    if (
        !canvas ||
        !dataInput ||
        !graphType ||
        !graphButton ||
        !clearButton
    ) {

        console.error(
            "Statistics Graph: required HTML elements not found."
        );

        return;

    }


    const ctx =
        canvas.getContext("2d");


    /* =========================================
       GRAPH SETTINGS
    ========================================= */

    let padding = 60;

    let width =
        canvas.width;

    let height =
        canvas.height;


    /* =========================================
       READ DATA
    ========================================= */

    function getData() {

        const input =
            dataInput.value.trim();


        if (input === "") {

            throw new Error(
                "Please enter a dataset."
            );

        }


        const data =
            input
                .split(",")
                .map(
                    value =>
                        Number(value.trim())
                );


        if (
            data.length < 2
        ) {

            throw new Error(
                "Please enter at least two values."
            );

        }


        if (
            data.some(
                value =>
                    !Number.isFinite(value)
            )
        ) {

            throw new Error(
                "Dataset contains invalid values."
            );

        }


        return data.sort(
            (a, b) => a - b
        );

    }


    /* =========================================
       CLEAR CANVAS
    ========================================= */

    function clearCanvas() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        ctx.font =
            "16px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "Enter data and select a graph type.",
            width / 2,
            height / 2
        );

    }


    /* =========================================
       DRAW AXES
    ========================================= */

    function drawAxes(
        xMin,
        xMax,
        yMin,
        yMax,
        xLabel,
        yLabel
    ) {

        const graphWidth =
            width -
            2 * padding;

        const graphHeight =
            height -
            2 * padding;


        function xScale(x) {

            return (
                padding +
                (
                    (x - xMin) /
                    (xMax - xMin)
                ) *
                graphWidth
            );

        }


        function yScale(y) {

            return (
                height -
                padding -
                (
                    (y - yMin) /
                    (yMax - yMin)
                ) *
                graphHeight
            );

        }


        ctx.beginPath();

        ctx.moveTo(
            padding,
            padding
        );

        ctx.lineTo(
            padding,
            height - padding
        );

        ctx.lineTo(
            width - padding,
            height - padding
        );

        ctx.stroke();


        /* X LABEL */

        ctx.font =
            "14px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            xLabel,
            width / 2,
            height - 15
        );


        /* Y LABEL */

        ctx.save();

        ctx.translate(
            15,
            height / 2
        );

        ctx.rotate(
            -Math.PI / 2
        );

        ctx.fillText(
            yLabel,
            0,
            0
        );

        ctx.restore();


        return {
            xScale,
            yScale
        };

    }


    /* =========================================
       HISTOGRAM
    ========================================= */

    function drawHistogram(data) {

        clearGraph();


        const min =
            Math.min(...data);

        const max =
            Math.max(...data);


        const range =
            max - min;


        const bins =
            Math.max(
                5,
                Math.ceil(
                    Math.sqrt(data.length)
                )
            );


        const binWidth =
            range === 0
                ? 1
                : range / bins;


        const frequencies =
            new Array(bins).fill(0);


        data.forEach(value => {

            let index =
                Math.floor(
                    (value - min) /
                    binWidth
                );


            if (
                index >= bins
            ) {

                index =
                    bins - 1;

            }


            frequencies[index]++;

        });


        const maxFrequency =
            Math.max(
                ...frequencies
            );


        const graphWidth =
            width -
            2 * padding;

        const graphHeight =
            height -
            2 * padding;


        /* AXES */

        ctx.beginPath();

        ctx.moveTo(
            padding,
            padding
        );

        ctx.lineTo(
            padding,
            height - padding
        );

        ctx.lineTo(
            width - padding,
            height - padding
        );

        ctx.stroke();


        /* BARS */

        const barWidth =
            graphWidth / bins;


        frequencies.forEach(
            (frequency, i) => {

                const barHeight =
                    (
                        frequency /
                        maxFrequency
                    ) *
                    graphHeight;


                const x =
                    padding +
                    i * barWidth;


                const y =
                    height -
                    padding -
                    barHeight;


                ctx.fillRect(
                    x + 1,
                    y,
                    barWidth - 2,
                    barHeight
                );


                /* FREQUENCY LABEL */

                ctx.font =
                    "12px Arial";

                ctx.textAlign =
                    "center";

                ctx.fillText(
                    frequency,
                    x +
                    barWidth / 2,
                    y - 5
                );

            }
        );


        /* X LABELS */

        ctx.font =
            "12px Arial";

        ctx.textAlign =
            "center";


        for (
            let i = 0;
            i <= bins;
            i++
        ) {

            const value =
                min +
                i * binWidth;


            const x =
                padding +
                i * barWidth;


            ctx.fillText(
                value.toFixed(1),
                x,
                height - padding + 20
            );

        }


        ctx.font =
            "15px Arial";

        ctx.fillText(
            "Value",
            width / 2,
            height - 15
        );


        ctx.save();

        ctx.translate(
            15,
            height / 2
        );

        ctx.rotate(
            -Math.PI / 2
        );

        ctx.fillText(
            "Frequency",
            0,
            0
        );

        ctx.restore();

    }


    /* =========================================
       FREQUENCY POLYGON
    ========================================= */

    function drawFrequencyPolygon(data) {

        clearGraph();


        const min =
            Math.min(...data);

        const max =
            Math.max(...data);


        const range =
            max - min;


        const bins =
            Math.max(
                5,
                Math.ceil(
                    Math.sqrt(data.length)
                )
            );


        const binWidth =
            range === 0
                ? 1
                : range / bins;


        const frequencies =
            new Array(bins).fill(0);


        data.forEach(value => {

            let index =
                Math.floor(
                    (value - min) /
                    binWidth
                );


            if (
                index >= bins
            ) {

                index =
                    bins - 1;

            }


            frequencies[index]++;

        });


        const maxFrequency =
            Math.max(
                ...frequencies
            );


        const graphWidth =
            width -
            2 * padding;

        const graphHeight =
            height -
            2 * padding;


        const xScale =
            value =>
                padding +
                (
                    (value - min) /
                    range
                ) *
                graphWidth;


        const yScale =
            value =>
                height -
                padding -
                (
                    value /
                    maxFrequency
                ) *
                graphHeight;


        ctx.beginPath();


        frequencies.forEach(
            (frequency, i) => {

                const midpoint =
                    min +
                    (
                        i + 0.5
                    ) *
                    binWidth;


                const x =
                    xScale(midpoint);


                const y =
                    yScale(frequency);


                if (
                    i === 0
                ) {

                    ctx.moveTo(
                        x,
                        y
                    );

                } else {

                    ctx.lineTo(
                        x,
                        y
                    );

                }

            }
        );


        ctx.stroke();


        /* POINTS */

        frequencies.forEach(
            (frequency, i) => {

                const midpoint =
                    min +
                    (
                        i + 0.5
                    ) *
                    binWidth;


                const x =
                    xScale(midpoint);


                const y =
                    yScale(frequency);


                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    4,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }
        );


        /* AXES */

        ctx.beginPath();

        ctx.moveTo(
            padding,
            padding
        );

        ctx.lineTo(
            padding,
            height - padding
        );

        ctx.lineTo(
            width - padding,
            height - padding
        );

        ctx.stroke();


        ctx.font =
            "14px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "Value",
            width / 2,
            height - 15
        );


        ctx.save();

        ctx.translate(
            15,
            height / 2
        );

        ctx.rotate(
            -Math.PI / 2
        );

        ctx.fillText(
            "Frequency",
            0,
            0
        );

        ctx.restore();

    }


    /* =========================================
       BOX PLOT
    ========================================= */

    function drawBoxPlot(data) {

        clearGraph();


        const n =
            data.length;


        const median =
            getMedian(data);


        const lowerHalf =
            data.slice(
                0,
                Math.floor(n / 2)
            );


        const upperHalf =
            data.slice(
                Math.ceil(n / 2)
            );


        const q1 =
            getMedian(lowerHalf);


        const q3 =
            getMedian(upperHalf);


        const minimum =
            data[0];


        const maximum =
            data[n - 1];


        const range =
            maximum - minimum;


        const xMin =
            minimum -
            range * 0.1;


        const xMax =
            maximum +
            range * 0.1;


        const graphWidth =
            width -
            2 * padding;


        const scale =
            x =>
                padding +
                (
                    (x - xMin) /
                    (xMax - xMin)
                ) *
                graphWidth;


        const y =
            height / 2;


        /* WHISKERS */

        ctx.beginPath();

        ctx.moveTo(
            scale(minimum),
            y
        );

        ctx.lineTo(
            scale(q1),
            y
        );

        ctx.moveTo(
            scale(q3),
            y
        );

        ctx.lineTo(
            scale(maximum),
            y
        );

        ctx.stroke();


        /* MINIMUM / MAXIMUM */

        ctx.beginPath();

        ctx.moveTo(
            scale(minimum),
            y - 25
        );

        ctx.lineTo(
            scale(minimum),
            y + 25
        );

        ctx.moveTo(
            scale(maximum),
            y - 25
        );

        ctx.lineTo(
            scale(maximum),
            y + 25
        );

        ctx.stroke();


        /* BOX */

        const boxHeight =
            80;


        ctx.strokeRect(
            scale(q1),
            y - boxHeight / 2,
            scale(q3) - scale(q1),
            boxHeight
        );


        /* MEDIAN */

        ctx.beginPath();

        ctx.moveTo(
            scale(median),
            y - boxHeight / 2
        );

        ctx.lineTo(
            scale(median),
            y + boxHeight / 2
        );

        ctx.stroke();


        /* LABELS */

        ctx.font =
            "13px Arial";

        ctx.textAlign =
            "center";


        const labels = [
            ["Min", minimum],
            ["Q1", q1],
            ["Median", median],
            ["Q3", q3],
            ["Max", maximum]
        ];


        labels.forEach(
            ([label, value]) => {

                ctx.fillText(
                    `${label}: ${value}`,
                    scale(value),
                    y - 55
                );

            }
        );


        ctx.fillText(
            "Value",
            width / 2,
            height - 20
        );

    }


    /* =========================================
       OGIVE
    ========================================= */

    function drawOgive(data) {

        clearGraph();


        const min =
            Math.min(...data);

        const max =
            Math.max(...data);


        const range =
            max - min;


        const bins =
            Math.max(
                5,
                Math.ceil(
                    Math.sqrt(data.length)
                )
            );


        const binWidth =
            range === 0
                ? 1
                : range / bins;


        const frequencies =
            new Array(bins).fill(0);


        data.forEach(value => {

            let index =
                Math.floor(
                    (value - min) /
                    binWidth
                );


            if (
                index >= bins
            ) {

                index =
                    bins - 1;

            }


            frequencies[index]++;

        });


        /* CUMULATIVE FREQUENCY */

        let cumulative = 0;


        const lessThan = [];


        frequencies.forEach(
            (frequency, i) => {

                cumulative +=
                    frequency;


                lessThan.push({
                    x:
                        min +
                        (i + 1) *
                        binWidth,

                    y:
                        cumulative
                });

            }
        );


        const total =
            data.length;


        /* AXES */

        const graphWidth =
            width -
            2 * padding;

        const graphHeight =
            height -
            2 * padding;


        const xScale =
            x =>
                padding +
                (
                    (x - min) /
                    (max - min)
                ) *
                graphWidth;


        const yScale =
            y =>
                height -
                padding -
                (
                    y /
                    total
                ) *
                graphHeight;


        /* LESS THAN OGIVE */

        ctx.beginPath();


        ctx.moveTo(
            xScale(min),
            yScale(0)
        );


        lessThan.forEach(
            point => {

                ctx.lineTo(
                    xScale(point.x),
                    yScale(point.y)
                );

            }
        );


        ctx.stroke();


        /* POINTS */

        lessThan.forEach(
            point => {

                ctx.beginPath();

                ctx.arc(
                    xScale(point.x),
                    yScale(point.y),
                    4,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }
        );


        /* AXES */

        ctx.beginPath();

        ctx.moveTo(
            padding,
            padding
        );

        ctx.lineTo(
            padding,
            height - padding
        );

        ctx.lineTo(
            width - padding,
            height - padding
        );

        ctx.stroke();


        ctx.font =
            "14px Arial";

        ctx.textAlign =
            "center";


        ctx.fillText(
            "Upper Class Boundary",
            width / 2,
            height - 15
        );


        ctx.save();

        ctx.translate(
            15,
            height / 2
        );

        ctx.rotate(
            -Math.PI / 2
        );

        ctx.fillText(
            "Cumulative Frequency",
            0,
            0
        );

        ctx.restore();


        /* TITLE */

        ctx.font =
            "bold 16px Arial";

        ctx.fillText(
            "Less-Than Ogive",
            width / 2,
            25
        );

    }


    /* =========================================
       MEDIAN
    ========================================= */

    function getMedian(data) {

        const n =
            data.length;


        const middle =
            Math.floor(n / 2);


        if (
            n % 2 === 0
        ) {

            return (
                data[middle - 1] +
                data[middle]
            ) / 2;

        }


        return data[middle];

    }


    /* =========================================
       CLEAR GRAPH
    ========================================= */

    function clearGraph() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

    }


    /* =========================================
       DRAW SELECTED GRAPH
    ========================================= */

    function drawGraph() {

        try {

            const data =
                getData();


            const type =
                graphType.value;


            if (
                type === "histogram"
            ) {

                drawHistogram(data);

            }


            else if (
                type === "frequency"
            ) {

                drawFrequencyPolygon(data);

            }


            else if (
                type === "boxplot"
            ) {

                drawBoxPlot(data);

            }


            else if (
                type === "ogive"
            ) {

                drawOgive(data);

            }


            else {

                clearCanvas();

            }

        }

        catch (error) {

            clearGraph();


            ctx.font =
                "16px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                error.message,
                width / 2,
                height / 2
            );


            console.error(
                "Statistics Graph:",
                error
            );

        }

    }


    /* =========================================
       BUTTON EVENTS
    ========================================= */

    graphButton.addEventListener(
        "click",
        drawGraph
    );


    clearButton.addEventListener(
        "click",
        () => {

            clearGraph();

        }
    );


    /* =========================================
       UPDATE GRAPH WHEN DATA IS ANALYZED
    ========================================= */

    const statisticsCalculate =
        document.getElementById(
            "statistics-calculate"
        );


    if (statisticsCalculate) {

        statisticsCalculate.addEventListener(
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
       INITIAL STATE
    ========================================= */

    clearCanvas();


    console.log(
        "MathLab Statistics Graph Engine loaded successfully."
    );

})();/* =========================================
   STATISTICS GRAPH ENGINE
   HISTOGRAM — v1
========================================= */

(() => {

    "use strict";


    /* =========================================
       HTML ELEMENTS
    ========================================= */

    const graph =
        document.getElementById(
            "statistics-graph"
        );

    const graphType =
        document.getElementById(
            "statistics-graph-type"
        );

    const dataInput =
        document.getElementById(
            "statistics-data"
        );

    const resetButton =
        document.getElementById(
            "statistics-graph-reset"
        );

    const zoomInButton =
        document.getElementById(
            "statistics-graph-zoom-in"
        );

    const zoomOutButton =
        document.getElementById(
            "statistics-graph-zoom-out"
        );

    const legend =
        document.getElementById(
            "statistics-graph-legend"
        );


    /* =========================================
       SAFETY CHECK
    ========================================= */

    if (
        !graph ||
        !graphType ||
        !dataInput ||
        !resetButton ||
        !zoomInButton ||
        !zoomOutButton ||
        !legend
    ) {

        console.error(
            "Statistics Graph: required HTML elements not found."
        );

        return;
    }


    const ctx =
        graph.getContext("2d");


    /* =========================================
       GRAPH STATE
    ========================================= */

    let zoom = 1;


    const defaultZoom = 1;


    /* =========================================
       READ DATASET
    ========================================= */

    function getData() {

        const input =
            dataInput.value.trim();


        if (input === "") {

            return [];

        }


        const data =
            input
                .split(",")
                .map(
                    value =>
                        Number(value.trim())
                );


        if (
            data.some(
                value =>
                    !Number.isFinite(value)
            )
        ) {

            return [];

        }


        return data.sort(
            (a, b) => a - b
        );

    }


    /* =========================================
       CLEAR GRAPH
    ========================================= */

    function clearGraph() {

        ctx.clearRect(
            0,
            0,
            graph.width,
            graph.height
        );

    }


    /* =========================================
       DRAW AXES
    ========================================= */

    function drawAxes(
        min,
        max,
        maxFrequency
    ) {

        const padding = 55;

        const width =
            graph.width -
            padding * 2;

        const height =
            graph.height -
            padding * 2;


        ctx.beginPath();

        ctx.moveTo(
            padding,
            padding
        );

        ctx.lineTo(
            padding,
            graph.height - padding
        );

        ctx.lineTo(
            graph.width - padding,
            graph.height - padding
        );

        ctx.stroke();


        /* X-axis label */

        ctx.font =
            "14px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "Value",
            graph.width / 2,
            graph.height - 15
        );


        /* Y-axis label */

        ctx.save();

        ctx.translate(
            15,
            graph.height / 2
        );

        ctx.rotate(-Math.PI / 2);

        ctx.fillText(
            "Frequency",
            0,
            0
        );

        ctx.restore();


        /* =====================================
           X-AXIS SCALE
        ===================================== */

        const range =
            max - min || 1;


        const step =
            range / 5;


        for (
            let i = 0;
            i <= 5;
            i++
        ) {

            const value =
                min + step * i;


            const x =
                padding +
                (
                    (value - min) /
                    range
                ) *
                width;


            ctx.beginPath();

            ctx.moveTo(
                x,
                graph.height - padding
            );

            ctx.lineTo(
                x,
                graph.height - padding + 5
            );

            ctx.stroke();


            ctx.font =
                "12px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                value.toFixed(2),
                x,
                graph.height - padding + 20
            );

        }


        /* =====================================
           Y-AXIS SCALE
        ===================================== */

        const yStep =
            Math.max(
                1,
                Math.ceil(
                    maxFrequency / 5
                )
            );


        for (
            let value = 0;
            value <= maxFrequency;
            value += yStep
        ) {

            const y =
                graph.height -
                padding -
                (
                    value /
                    maxFrequency
                ) *
                height;


            ctx.beginPath();

            ctx.moveTo(
                padding - 5,
                y
            );

            ctx.lineTo(
                padding,
                y
            );

            ctx.stroke();


            ctx.font =
                "12px Arial";

            ctx.textAlign =
                "right";

            ctx.fillText(
                value,
                padding - 10,
                y + 4
            );

        }

    }


    /* =========================================
       HISTOGRAM
    ========================================= */

    function drawHistogram(data) {

        clearGraph();


        if (data.length === 0) {

            legend.innerHTML = `
                <p>
                    Enter a valid dataset first.
                </p>
            `;

            return;

        }


        /* =====================================
           DETERMINE BINS
        ===================================== */

        const min =
            Math.min(...data);

        const max =
            Math.max(...data);


        const range =
            max - min;


        const numberOfBins =
            Math.max(
                5,
                Math.ceil(
                    Math.sqrt(data.length)
                )
            );


        const binWidth =
            range === 0
                ? 1
                : range / numberOfBins;


        const frequencies =
            new Array(
                numberOfBins
            ).fill(0);


        /* =====================================
           COUNT FREQUENCIES
        ===================================== */

        data.forEach(value => {

            let index =
                Math.floor(
                    (value - min) /
                    binWidth
                );


            if (
                index >= numberOfBins
            ) {

                index =
                    numberOfBins - 1;

            }


            frequencies[index]++;

        });


        const maximumFrequency =
            Math.max(
                ...frequencies
            );


        /* =====================================
           GRAPH DIMENSIONS
        ===================================== */

        const padding = 55;

        const graphWidth =
            graph.width -
            padding * 2;

        const graphHeight =
            graph.height -
            padding * 2;


        drawAxes(
            min,
            max,
            maximumFrequency
        );


        /* =====================================
           DRAW BARS
        ===================================== */

        const barWidth =
            (
                graphWidth /
                numberOfBins
            ) * zoom;


        frequencies.forEach(
            (frequency, index) => {

                const x =
                    padding +
                    (
                        index *
                        graphWidth /
                        numberOfBins
                    );


                const barHeight =
                    (
                        frequency /
                        maximumFrequency
                    ) *
                    graphHeight;


                const y =
                    graph.height -
                    padding -
                    barHeight;


                ctx.fillRect(
                    x,
                    y,
                    barWidth,
                    barHeight
                );


                ctx.strokeRect(
                    x,
                    y,
                    barWidth,
                    barHeight
                );

            }
        );


        /* =====================================
           LEGEND
        ===================================== */

        legend.innerHTML = `

            <p>
                <strong>Histogram</strong>
            </p>

            <p>
                Dataset size:
                ${data.length}
            </p>

            <p>
                Minimum:
                ${min}
            </p>

            <p>
                Maximum:
                ${max}
            </p>

            <p>
                Number of bins:
                ${numberOfBins}
            </p>

        `;

    }


    /* =========================================
       DRAW GRAPH
    ========================================= */

    function drawGraph() {

        const data =
            getData();


        if (
            graphType.value ===
            "histogram"
        ) {

            drawHistogram(data);

        }

        else {

            clearGraph();

            legend.innerHTML = `
                <p>
                    <strong>
                        ${graphType.options[
                            graphType.selectedIndex
                        ].text}
                    </strong>
                    will be added next.
                </p>
            `;

        }

    }


    /* =========================================
       GRAPH TYPE
    ========================================= */

    graphType.addEventListener(
        "change",
        drawGraph
    );


    /* =========================================
       UPDATE WHEN DATA CHANGES
    ========================================= */

    dataInput.addEventListener(
        "input",
        drawGraph
    );


    /* =========================================
       RESET
    ========================================= */

    resetButton.addEventListener(
        "click",
        () => {

            zoom =
                defaultZoom;

            drawGraph();

        }
    );


    /* =========================================
       ZOOM IN
    ========================================= */

    zoomInButton.addEventListener(
        "click",
        () => {

            zoom *= 1.2;

            drawGraph();

        }
    );


    /* =========================================
       ZOOM OUT
    ========================================= */

    zoomOutButton.addEventListener(
        "click",
        () => {

            zoom /= 1.2;

            drawGraph();

        }
    );


    /* =========================================
       INITIAL DRAW
    ========================================= */

    drawGraph();


    console.log(
        "Statistics Graph Engine loaded successfully."
    );

})();