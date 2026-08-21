/* =========================================
   MODULE NAVIGATION
========================================= */

const moduleButtons = document.querySelectorAll(".module-btn");
const modules = document.querySelectorAll(".module");


moduleButtons.forEach(button => {

    button.addEventListener("click", () => {

        const moduleName = button.dataset.module;


        // Remove active state from buttons

        moduleButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        // Add active state to clicked button

        button.classList.add("active");


        // Hide all modules

        modules.forEach(module => {
            module.classList.remove("active-module");
        });


        // Show selected module

        document
            .getElementById(moduleName)
            .classList.add("active-module");

    });

});


/* =========================================
   BASIC CALCULATOR
========================================= */

const display = document.getElementById("display");
const result = document.getElementById("result");

const basicButtons =
    document.querySelectorAll(".buttons button");


basicButtons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.textContent;


        if (value === "C") {

            display.value = "";

            result.textContent =
                "Your answer will appear here.";

        }


        else if (value === "=") {

            calculateBasic();

        }


        else {

            display.value += value;

        }

    });

});


function calculateBasic() {

    try {

        const expression = display.value;

        const answer = Function(
            `"use strict"; return (${expression})`
        )();

        result.textContent = answer;

    } catch (error) {

        result.textContent = "Invalid calculation.";

    }

}