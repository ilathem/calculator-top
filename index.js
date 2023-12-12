const calculatorLogic = {
    '+': (a, b) => Number(a) + Number(b),
    '-': (a, b) => Number(a) - Number(b),
    '*': (a, b) => Number(a) * Number(b),
    '/': (a, b) => Number(a) / Number(b),
}

function operate(strInput) {
    console.log(strInput);
    const arrInput = strInput.split('')
    const precedence = [
        ['*', "/"],
        ["+", "-"],
    ]
    for (const operators of precedence) {
        console.log(arrInput.join(''));
        arrInput.forEach((value, index, array) => {
            if (operators.includes(value)) {
                const result = calculatorLogic[value](array[index - 1], array[index + 1]);
                console.log(`${array[index - 1]} ${value} ${array[index + 1]} = ${result}`)
                arrInput.splice(index - 1, 3, result);
            }
        })
    }
    return arrInput[0];
}

const displayText = document.querySelector('#text');

const buttons = document.querySelectorAll(".calc-button")

buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        if (displayText.innerText === 'Calculator') {
            displayText.innerText = '';
        }
        if (event.target.innerText === 'Clear') {
            displayText.innerText = 'Calculator';
            console.clear();
        } else if (event.target.innerText === '=') {
            displayText.innerText = operate(displayText.innerText);
        } else {
            displayText.innerText += button.innerText;
        }
    })
})