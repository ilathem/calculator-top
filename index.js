const calculatorLogic = {
    '+': (a, b) => Number(a) + Number(b),
    '-': (a, b) => Number(a) - Number(b),
    '×': (a, b) => Number(a) * Number(b),
    '÷': (a, b) => Number(a) / Number(b),
}

function operate(arrInput) {
    const precedence = [
        ['×', "÷"],
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

function displayData() {
    console.log(`displayText: ${displayText.innerText}\ncomputeArray: ${
        computeArray}\ncurrentOperand: ${currentOperand}`);
}

function clearCalculator() {
    displayText.innerText = 'Calculator';
    computeArray.splice(0, computeArray.length);
    currentOperand = '';
    console.clear();
    displayTextContainer.classList.remove('solved');
    document.querySelector('.btnDecimal').classList.remove('disabled');
}

function computeAnswer() {
    if (computeArray.length === 0) {
        displayText.innerText = 'Calculator';
        clearCalculator();
        return;
    }
    if (currentOperand) {
        computeArray.push(currentOperand);
        currentOperand = '';
    } else {
        computeArray.pop();
    }
    document.querySelector('.btnDecimal').classList.remove('disabled');
    currentOperand = '';
    displayText.innerText = operate(computeArray);
    computeArray.splice(0, computeArray.length);
    displayTextContainer.classList.add('solved');
    if (displayText.innerText === 'Infinity') {
        displayText.innerText = 'You fool!';
    }
}

function addNumber(button) {
    if (displayTextContainer.classList.contains('solved')) {
        displayText.innerText = '';
        displayTextContainer.classList.remove('solved')
    }
    if (button.innerText === '.') {
        button.classList.add('disabled');
    }
    if (button.innerText === '.' && currentOperand.includes('.')) {
        return
    } else {
        displayText.innerText += button.innerText;
        currentOperand += button.innerText;
    }
}

function addOperator(button) {
    if (computeArray.length === 0 && !currentOperand) {
        displayText.innerText = 'Calculator';
        return;
    }
    document.querySelector('.btnDecimal').classList.remove('disabled');
    displayText.innerText += button.innerText;
    currentOperand && computeArray.push(currentOperand);
    computeArray.push(button.innerText);
    currentOperand = '';
}

function flipSign() {
    const operandLength = currentOperand.length;
    if (Number(currentOperand) > 0) {
        currentOperand = currentOperand.split('');
        currentOperand.unshift('-');
        currentOperand = currentOperand.join('');
    } else if (Number(currentOperand) < 0) {
        currentOperand = currentOperand.split('');
        currentOperand.unshift('-');
        currentOperand = currentOperand.join('');
    }
    displayText.innerText = 
        `${displayText.innerText.slice(
            0, 
            displayText.innerText.length - operandLength
        )} (${currentOperand})`;
}

function backspace() {
    displayData();   
    displayText.innerText = displayText.innerText.slice(0, displayText.innerText.length - 1);
    if (currentOperand) { // there is a number in progress
        currentOperand = currentOperand.slice(0, currentOperand.length - 1);
    } else { // last thing is an operator
        computeArray.pop();
        currentOperand = computeArray[computeArray.length - 1];
        computeArray.pop();
    }
    if (displayText.innerText === '') {
        clearCalculator()
    } else {
        if (currentOperand.includes('.')) {
            document.querySelector('.btnDecimal').classList.add('disabled');
        } else {
            document.querySelector('.btnDecimal').classList.remove('disabled');
        }
    }
    displayData();   
}

function handleBtnClick(event) {
    console.log('before:');
    displayData();
    if (displayText.innerText === 'Calculator') {
        displayText.innerText = '';
    }
    if (event.target.innerText === 'C') {
        clearCalculator();
    } else if (event.target.innerText === '=') {
        computeAnswer();
    } else if (
        ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        .includes(event.target.innerText)) 
    {
        addNumber(event.target);
    } else if (event.target.innerText === '+/-') {
        flipSign();
    } else if (event.target.innerText === '⌫') {
        backspace();
    } else {
        addOperator(event.target);
    }
    console.log('after:');
    displayData();
    console.log('----------------------------------');
}

for(const button of buttons) {
    button.addEventListener('click', (event) => handleBtnClick(event));
}
