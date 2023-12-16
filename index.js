const calculatorLogic = {
    '+': (a, b) => Number(a) + Number(b),
    '-': (a, b) => Number(a) - Number(b),
    '×': (a, b) => Number(a) * Number(b),
    '÷': (a, b) => Number(a) / Number(b),
    '%': (a, b) => Number(a) % Number(b),
}

function operate(arrInput) {
    const precedence = [
        ['×', "÷", "%"],
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

function addNumber(text) {
    if (displayTextContainer.classList.contains('solved')) {
        displayText.innerText = '';
        displayTextContainer.classList.remove('solved')
    }
    if (text === '.') {
        document.querySelector('.btnDecimal').classList.add('disabled');
    }
    if (text === '.' && currentOperand.includes('.')) {
        return
    } else {
        displayText.innerText += text;
        currentOperand += text;
    }
}

function addOperator(text) {
    if (computeArray.length === 0 && !currentOperand) {
        displayText.innerText = 'Calculator';
        return;
    }
    document.querySelector('.btnDecimal').classList.remove('disabled');
    displayText.innerText += text;
    currentOperand && computeArray.push(currentOperand);
    computeArray.push(text);
    currentOperand = '';
}

function flipSign() {
    // console.log(`currentOperandBefore: ${currentOperand}`);
    // console.log(`operandLength: ${currentOperand.length}`);
    const operandLength = currentOperand.length;
    if (!currentOperand) return;
    if (Number(currentOperand) > 0) {
        currentOperand = currentOperand.split('');
        currentOperand.unshift('-');
        currentOperand = currentOperand.join('');
        displayText.innerText = 
            `${displayText.innerText.slice(
                0, 
                displayText.innerText.length - operandLength
            )}(${currentOperand})`;
    } else if (Number(currentOperand) < 0) {
        currentOperand = currentOperand.split('');
        currentOperand.shift();
        currentOperand = currentOperand.join('');
        displayText.innerText = 
            `${displayText.innerText.slice(
                0,
                displayText.innerText.length - operandLength - 2
            )}${currentOperand}`;
    }
    // console.log(`currentOperandAfter: ${currentOperand}`);
    // console.log(`operandLength: ${currentOperand.length}`);
}

function backspace() {
    displayData();   
    displayText.innerText = displayText.innerText.slice(0, displayText.innerText.length - 1);
    if (currentOperand) { // there is a number in progress
        // number is the last negative digit -- remove parentheses and sign
        if (currentOperand[0] === '-' &&
            currentOperand.length === 2) {
            displayText.innerText = 
                `${displayText.innerText.slice(
                    0,
                    displayText.innerText.length - 3
                )}`;
            currentOperand = '';
        } else {
            currentOperand = currentOperand.slice(0, currentOperand.length - 1);
        }
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

function handleBtnClick(text) {
    // console.log('before:');
    // displayData();
    if (displayText.innerText === 'Calculator') {
        displayText.innerText = '';
    }
    if (text === 'C') {
        clearCalculator();
    } else if (text === '=') {
        computeAnswer();
    } else if (
        ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        .includes(text)) 
    {
        addNumber(text);
    } else if (text === '+/-') {
        flipSign();
    } else if (text === '⌫') {
        backspace();
    } else {
        addOperator(text);
    }
    // console.log('after:');
    // displayData();
    // console.log('----------------------------------');
}

function handleKey(event) {
    event.preventDefault();
    // console.log(event.key);
    if (event.key === '/') {
        handleBtnClick('÷');
        triggerBtnUp('btnDivide');
    } else if (event.key === '*') {
        handleBtnClick('×');
        triggerBtnUp('btnMultiply');
    } else if (event.key === '.') {
        handleBtnClick('.');
        triggerBtnUp('btnDecimal');
    } else if (event.key === '=') {
        triggerBtnUp('btnEquals');
        handleBtnClick('=');
    } else if (event.key === '+') {
        triggerBtnUp('btnAdd');
        handleBtnClick('+');
    } else if (event.key === '-') {
        triggerBtnUp('btnSubtract');
        handleBtnClick('-');
    } else if (event.key === '%') {
        triggerBtnUp('btnModulo');
        handleBtnClick('%');
    } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',]
        .includes(event.key)
    ) {
        handleBtnClick(event.key);
        triggerBtnUp(`btn${event.key}`);
    } else if (event.key === 'Backspace') {
        handleBtnClick('⌫');
        triggerBtnUp('btnBackspace');
    } else if (event.key === 'c') {
        handleBtnClick('C');
        triggerBtnUp('btnClear');
    } else if (event.key === 's') {
        handleBtnClick('+/-');
        triggerBtnUp('btnSign');
    } else if (event.key === 'Enter') {
        handleBtnClick('=');
        triggerBtnUp('btnEquals');
    }
}

function triggerBtnDown(btnClass) {
    document.querySelector(`.${btnClass}`).classList.remove('btnAnimateUp');
    document.querySelector(`.${btnClass}`).classList.add('btnAnimateDown');
    setTimeout(() => { // in case the button gets "stuck"
        document.querySelector(`.${btnClass}`).classList.remove('btnAnimateDown');
        document.querySelector(`.${btnClass}`).classList.add('btnAnimateUp');
    }, 1000)
}

function triggerBtnUp(btnClass) {
    document.querySelector(`.${btnClass}`).classList.remove('btnAnimateDown');
    document.querySelector(`.${btnClass}`).classList.add('btnAnimateUp');
}

function handleKeyDown(event) {
    if (event.key === '/') {
        triggerBtnDown('btnDivide');
    } else if (event.key === '*') {
        triggerBtnDown('btnMultiply');
    } else if (event.key === '.') {
        triggerBtnDown('btnDecimal');
    } else if (event.key === '=') {
        triggerBtnDown('btnEquals');
    } else if (event.key === '+') {
        triggerBtnDown('btnAdd');
    } else if (event.key === '-') {
        triggerBtnDown('btnSubtract');
    } else if (event.key === '%') {
        triggerBtnDown('btnModulo');
    } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',]
        .includes(event.key)
    ) {
        triggerBtnDown(`btn${event.key}`);
    } else if (event.key === 'Backspace') {
        triggerBtnDown('btnBackspace');
    } else if (event.key === 'c') {
        triggerBtnDown('btnClear');
    } else if (event.key === 's') {
        triggerBtnDown('btnSign');
    } else if (event.key === 'Enter') {
        triggerBtnDown('btnEquals');
    }
}

document.addEventListener('keydown', e => handleKeyDown(e));

document.addEventListener('keyup', e => handleKey(e));

for(const button of buttons) {
    button.addEventListener('click', (event) => handleBtnClick(event.target.innerText));
}
