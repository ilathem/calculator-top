const calculatorLogic = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
}

function operate(operand1, operator, operand2) {
    return calculatorLogic[operator](operand1, operand2);
}