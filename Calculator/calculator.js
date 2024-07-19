let result = "0";
let hasOperator = false;
let hasError = false;

const setResult = (newResult, type = "replace") => {
    if (hasError) {
        result = newResult;
        hasError = false;
        hasOperator = false;
        textField.textContent = result;
        return;
    }

    if (type === "replace") {
        if (newResult.length > 1 && newResult.charAt(0) === "0" && newResult.charAt(1) !== ".") {
            setResult(newResult.substring(1));
            return;
        }
        result = newResult;
        textField.textContent = result;
    } else if (type === "temporary") {
        result = "0";
        hasOperator = false;
        textField.textContent = newResult;
    }
};

const parse = () => {
    // Extract operator and operands from the result string
    const operatorRegex = /[\+\-\*\/]/;
    const operatorMatch = result.match(operatorRegex);

    if (operatorMatch) {
        const operator = operatorMatch[0];
        const [operand1, operand2] = result.split(operator);

        // Convert operands to numbers
        const num1 = parseFloat(operand1);
        const num2 = parseFloat(operand2);

        let evaluation;

        // Perform calculation based on the operator
        switch (operator) {
            case '+':
                evaluation = num1 + num2;
                break;
            case '-':
                evaluation = num1 - num2;
                break;
            case '*':
                evaluation = num1 * num2;
                break;
            case '/':
                if (num2 !== 0) {
                    evaluation = num1 / num2;
                } else {
                    setResult("Infinity", "temporary");
                    hasError = true;
                    return;
                }
                break;
            default:
                setResult("Error", "temporary");
                hasError = true;
                return;
        }

        // Set the result
        setResult(evaluation.toString());
        hasOperator = false;
    } else {
        setResult("Error", "temporary");
        hasError = true;
    }
};

const textField = document.getElementById("answer");
const clearButton = document.getElementById("clear").addEventListener("click", (event) => {
    setResult("0");
    hasOperator = false;
    hasError = false;
});

const numberButtons = new Array(0);
for (let i = 0; i < 10; ++i) {
    numberButtons.push(document.getElementById(i.toString()).addEventListener("click", (event) => {
        if (hasError) {
            setResult(event.target.id);
        } else {
            setResult(result + event.target.id);
        }
    }));
}

const equalButton = document.getElementById("=").addEventListener("click", (event) => {
    parse();
});

const decimalButton = document.getElementById(".");
decimalButton.addEventListener("click", (event) => {
    if (hasError) {
        setResult("0.");
    } else if (!hasOperator && !result.includes(".")) {
        setResult(result + ".");
    } else if (hasOperator) {
        const operatorRegex = /[\+\-\*\/]/;
        const operatorMatch = result.match(operatorRegex);
        if (operatorMatch) {
            const [operand1, operand2] = result.split(operatorMatch[0]);
            if (!operand2.includes(".")) {
                setResult(result + ".");
            }
        }
    }
});

const utilityButtons = ["+", "-", "*", "/"].map(action => {
    return document.getElementById(action).addEventListener("click", (event) => {
        if (!hasOperator && !hasError) {
            hasOperator = true;
            setResult(result + action);
        } else if (hasError) {
            setResult(result + action);
            hasError = false;
        }
    });
});
