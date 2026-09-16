const display = document.getElementById("display");

let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

function addValue(value) {
    if (display.value === "0" || display.value === "Error") {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearDisplay() {
    display.value = "0";
}

function deleteLast() {
    if (display.value.length <= 1) {
        display.value = "0";
    } else {
        display.value = display.value.slice(0, -1);
    }
}

function toggleSign() {
    if (display.value !== "0" && display.value !== "Error") {
        if (display.value.startsWith("-")) {
            display.value = display.value.substring(1);
        } else {
            display.value = "-" + display.value;
        }
    }
}

function calculate() {
    try {
        let expression = display.value;

        // Percentage
        expression = expression.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

        // Check division by zero
        if (/\/\s*0(?!\.)/.test(expression)) {
            display.value = "Error";
            return;
        }

        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            display.value = "Error";
            return;
        }

        display.value = result;

        addToHistory(
            display.value,
            result
        );

    } catch (error) {
        display.value = "Error";
    }
}

function addToHistory(expression, result) {
    history.unshift({
        expression: expression,
        result: result
    });

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );

    showHistory();
}

function showHistory() {
    const historyList = document.getElementById("historyList");

    if (!historyList) return;

    historyList.innerHTML = "";

    history.forEach(function(item) {
        const p = document.createElement("p");

        p.innerText =
            item.expression + " = " + item.result;

        historyList.appendChild(p);
    });
}

function clearHistory() {
    history = [];

    localStorage.removeItem("calculatorHistory");

    showHistory();
}

showHistory();
function toggleTheme() {
    document.body.classList.toggle("light-mode");

    const button = document.getElementById("themeButton");

    if (document.body.classList.contains("light-mode")) {
        button.innerText = "🌙 Dark Mode";
    } else {
        button.innerText = "☀️ Light Mode";
    }
}