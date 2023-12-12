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
        console.log(arrInput);
        for (let index = 0; index < arrInput.length; index++) {
            if (operators.includes(arrInput[index])) {
                const result = calculatorLogic[arrInput[index]](arrInput[index - 1], arrInput[index + 1]);
                arrInput.splice(index - 1, 3, String(result));
                index -= 2; // bc we removed 2 elements
            }
        }
    }
    return arrInput[0];
}

const displayText = document.querySelector('#text');

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
        } else if (event.target.innerText === '=') {
            computeArray.push(currentOperand);
            currentOperand = '';
            if (typeof Number(computeArray[computeArray.length - 1]) !== 'number') {
                computeArray.pop();
            }
            displayText.innerText = operate(computeArray);
            computeArray.splice(0, computeArray.length);
        } else if (
            ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            .includes(event.target.innerText)) 
        {
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