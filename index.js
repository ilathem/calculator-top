const calculatorLogic = {
    '+': (a, b) => Number(a) + Number(b),
    '-': (a, b) => Number(a) - Number(b),
    '*': (a, b) => Number(a) * Number(b),
    '/': (a, b) => Number(a) / Number(b),
}

function operate(arrInput) {
    const precedence = [
        ['*', "/"],
        ["+", "-"],
    ]
    for (const operators of precedence) {
        for (let index = 0; index < arrInput.length; index++) {
            if (operators.includes(arrInput[index])) {
                const result = calculatorLogic[arrInput[index]](arrInput[index - 1], arrInput[index + 1]);
                arrInput.splice(index - 1, 3, String(result));
                index -= 2; // bc we removed 2 elements
            }
        }
    }
    console.log(arrInput[0].split("."))
    if (arrInput[0].split(".")[1] && arrInput[0].split(".")[1].length > 3) {
        return Number(arrInput[0]).toFixed(3);
    } else {
        return Number(arrInput[0]);
    }
}

const displayText = document.querySelector('#text');
const displayTextContainer = document.querySelector(".text-container");

const buttons = document.querySelectorAll(".calc-button")

const computeArray = [];
let currentOperand = '';

buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        if (displayText.innerText === 'Calculator') {
            displayText.innerText = '';
        }
        if (event.target.innerText === 'Clear') {
            displayText.innerText = 'Calculator';
            computeArray.splice(0, computeArray.length);
            currentOperand = '';
            console.clear();
            displayTextContainer.classList.remove('solved');
        } else if (event.target.innerText === '=') {
            if (computeArray.length === 0) {
                displayText.innerText = 'Calculator';
                return;
            }
            if (currentOperand) {
                computeArray.push(currentOperand);
                currentOperand = '';
            } else {
                computeArray.pop();
            }
            currentOperand = '';
            displayText.innerText = operate(computeArray);
            computeArray.splice(0, computeArray.length);
            displayTextContainer.classList.add('solved');
            if (displayText.innerText === 'Infinity') {
                displayText.innerText = 'You fool!';
            }
        } else if (
            ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            .includes(event.target.innerText)) 
        {
            if (displayTextContainer.classList.contains('solved')) {
                displayText.innerText = '';
                displayTextContainer.classList.remove('solved')
            }
            displayText.innerText += button.innerText;
            currentOperand += button.innerText;
        } else {
            if (currentOperand === '') {
                displayText.innerText = 'Calculator';
                return;
            }
            displayText.innerText += button.innerText;
            computeArray.push(currentOperand);
            computeArray.push(button.innerText);
            currentOperand = '';
        }
    })
})