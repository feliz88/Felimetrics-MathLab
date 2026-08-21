/* =========================================
   STATISTICS MODULE
========================================= */

const statisticsButton =
    document.getElementById("statistics-calculate");

const statisticsInput =
    document.getElementById("statistics-data");

const statisticsResult =
    document.getElementById("statistics-result");

const fiveNumberSummary =
    document.getElementById("five-number-summary");


statisticsButton.addEventListener(
    "click",
    analyzeStatistics
);


function analyzeStatistics() {

    const input =
        statisticsInput.value.trim();


    /* -----------------------------
       VALIDATION
    ----------------------------- */

    if (input === "") {

        statisticsResult.innerHTML =
            "<p>Please enter some data.</p>";

        return;
    }


    const data = input
        .split(",")
        .map(value => Number(value.trim()));


    if (
        data.some(value =>
            Number.isNaN(value)
        )
    ) {

        statisticsResult.innerHTML = `
            <p>
                Invalid data.
                Please enter numbers separated by commas.
            </p>
        `;

        return;
    }


    if (data.length < 2) {

        statisticsResult.innerHTML = `
            <p>
                Please enter at least two values.
            </p>
        `;

        return;
    }


    /* -----------------------------
       SORT DATA
    ----------------------------- */

    const sortedData =
        [...data].sort(
            (a, b) => a - b
        );


    const count =
        sortedData.length;


    /* -----------------------------
       SUM
    ----------------------------- */

    const sum =
        sortedData.reduce(
            (total, value) =>
                total + value,
            0
        );


    /* -----------------------------
       MEAN
    ----------------------------- */

    const mean =
        sum / count;


    /* -----------------------------
       MEDIAN
    ----------------------------- */

    const median =
        calculateMedian(sortedData);


    /* -----------------------------
       QUARTILES
    ----------------------------- */

    const lowerHalf =
        sortedData.slice(
            0,
            Math.floor(count / 2)
        );


    const upperHalf =
        sortedData.slice(
            Math.ceil(count / 2)
        );


    const q1 =
        calculateMedian(lowerHalf);


    const q3 =
        calculateMedian(upperHalf);


    const iqr =
        q3 - q1;


    /* -----------------------------
       RANGE
    ----------------------------- */

    const minimum =
        sortedData[0];

    const maximum =
        sortedData[count - 1];

    const range =
        maximum - minimum;


    /* -----------------------------
       POPULATION VARIANCE
    ----------------------------- */

    const squaredDifferences =
        sortedData.map(
            value =>
                Math.pow(
                    value - mean,
                    2
                )
        );


    const populationVariance =
        squaredDifferences.reduce(
            (total, value) =>
                total + value,
            0
        ) / count;


    /* -----------------------------
       SAMPLE VARIANCE
    ----------------------------- */

    const sampleVariance =
        squaredDifferences.reduce(
            (total, value) =>
                total + value,
            0
        ) / (count - 1);


    /* -----------------------------
       STANDARD DEVIATION
    ----------------------------- */

    const populationSD =
        Math.sqrt(
            populationVariance
        );


    const sampleSD =
        Math.sqrt(
            sampleVariance
        );


    /* -----------------------------
       MODE
    ----------------------------- */

    const frequency = {};


    sortedData.forEach(value => {

        frequency[value] =
            (frequency[value] || 0) + 1;

    });


    const highestFrequency =
        Math.max(
            ...Object.values(frequency)
        );


    let modes =
        Object.keys(frequency)
            .filter(
                value =>
                    frequency[value] ===
                    highestFrequency
            );


    if (highestFrequency === 1) {

        modes = ["No mode"];

    }


    /* -----------------------------
       DISPLAY RESULTS
    ----------------------------- */

    statisticsResult.innerHTML = `

        <p>
            <strong>Count:</strong>
            ${count}
        </p>

        <p>
            <strong>Sum:</strong>
            ${sum}
        </p>

        <p>
            <strong>Mean:</strong>
            ${mean.toFixed(4)}
        </p>

        <p>
            <strong>Median:</strong>
            ${median}
        </p>

        <p>
            <strong>Mode:</strong>
            ${modes.join(", ")}
        </p>

        <p>
            <strong>Minimum:</strong>
            ${minimum}
        </p>

        <p>
            <strong>Maximum:</strong>
            ${maximum}
        </p>

        <p>
            <strong>Range:</strong>
            ${range}
        </p>

        <p>
            <strong>Population Variance:</strong>
            ${populationVariance.toFixed(4)}
        </p>

        <p>
            <strong>Population SD:</strong>
            ${populationSD.toFixed(4)}
        </p>

        <p>
            <strong>Sample Variance:</strong>
            ${sampleVariance.toFixed(4)}
        </p>

        <p>
            <strong>Sample SD:</strong>
            ${sampleSD.toFixed(4)}
        </p>

        <p>
            <strong>Q1:</strong>
            ${q1}
        </p>

        <p>
            <strong>Q3:</strong>
            ${q3}
        </p>

        <p>
            <strong>IQR:</strong>
            ${iqr}
        </p>

    `;


    /* -----------------------------
       FIVE-NUMBER SUMMARY
    ----------------------------- */

    fiveNumberSummary.innerHTML = `

        <p>
            <strong>Minimum:</strong>
            ${minimum}
        </p>

        <p>
            <strong>Q1:</strong>
            ${q1}
        </p>

        <p>
            <strong>Median:</strong>
            ${median}
        </p>

        <p>
            <strong>Q3:</strong>
            ${q3}
        </p>

        <p>
            <strong>Maximum:</strong>
            ${maximum}
        </p>

    `;

}


/* =========================================
   MEDIAN FUNCTION
========================================= */

function calculateMedian(data) {

    const length =
        data.length;


    if (length === 0) {

        return 0;

    }


    const middle =
        Math.floor(length / 2);


    if (length % 2 === 0) {

        return (
            data[middle - 1] +
            data[middle]
        ) / 2;

    }


    return data[middle];
}