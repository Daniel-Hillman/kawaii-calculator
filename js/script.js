// Kawaii Calculator JavaScript

// DOM Elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const calculatorButtons = document.querySelector('.calculator-buttons');
const calculatorFace = document.querySelector('.calculator-face');
const eyes = document.querySelectorAll('.eye');
const mouth = document.querySelector('.mouth');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

// Initialize calculator
function init() {
    updateDisplay();
    setupEventListeners();
    setupKawaiiInteractions();
}

// Event Listeners
function setupEventListeners() {
    calculatorButtons.addEventListener('click', handleButtonClick);
    document.addEventListener('keydown', handleKeyboardInput);
}

// Handle button clicks
function handleButtonClick(e) {
    const button = e.target;
    
    if (!button.matches('button')) return;
    
    // Add pressed animation
    button.classList.add('pressed');
    setTimeout(() => button.classList.remove('pressed'), 200);
    
    // Handle different button types
    if (button.classList.contains('number')) {
        inputNumber(button.dataset.number);
    } else if (button.classList.contains('operator')) {
        handleOperation(button.dataset.action);
    } else if (button.classList.contains('equals')) {
        calculate();
    } else if (button.dataset.action === 'clear') {
        clear();
    } else if (button.dataset.action === 'delete') {
        deleteNumber();
    } else if (button.dataset.action === 'percent') {
        calculatePercent();
    }
    
    updateDisplay();
    reactToOperation();
}

// Handle keyboard input
function handleKeyboardInput(e) {
    if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
    if (e.key === '.') inputNumber('.');
    if (e.key === '=' || e.key === 'Enter') calculate();
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clear();
    if (e.key === '+') handleOperation('add');
    if (e.key === '-') handleOperation('subtract');
    if (e.key === '*') handleOperation('multiply');
    if (e.key === '/') handleOperation('divide');
    if (e.key === '%') calculatePercent();
    
    updateDisplay();
    reactToOperation();
}

// Input a number
function inputNumber(number) {
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    
    // Handle decimal point
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Handle initial zero
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
}

// Handle operations
function handleOperation(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    shouldResetScreen = true;
}

// Calculate result
function calculate() {
    if (operation === undefined || shouldResetScreen) return;
    
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    let result;
    
    switch (operation) {
        case 'add':
            result = prev + current;
            break;
        case 'subtract':
            result = prev - current;
            break;
        case 'multiply':
            result = prev * current;
            break;
        case 'divide':
            if (current === 0) {
                alert('Cannot divide by zero!');
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Format the result
    currentOperand = formatNumber(result);
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
}

// Calculate percentage
function calculatePercent() {
    if (currentOperand === '') return;
    
    currentOperand = (parseFloat(currentOperand) / 100).toString();
}

// Clear calculator
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    shouldResetScreen = false;
}

// Delete last digit
function deleteNumber() {
    if (shouldResetScreen) return;
    
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
}

// Format number for display
function formatNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

// Update the display
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    
    if (operation != null) {
        let operationSymbol;
        switch (operation) {
            case 'add': operationSymbol = '+'; break;
            case 'subtract': operationSymbol = '−'; break;
            case 'multiply': operationSymbol = '×'; break;
            case 'divide': operationSymbol = '÷'; break;
            default: operationSymbol = '';
        }
        
        previousOperandElement.textContent = `${previousOperand} ${operationSymbol}`;
    } else {
        previousOperandElement.textContent = '';
    }
}

// Kawaii face reactions
function setupKawaiiInteractions() {
    // Make eyes follow cursor
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        eyes.forEach(eye => {
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const deltaX = mouseX - eyeCenterX;
            const deltaY = mouseY - eyeCenterY;
            const angle = Math.atan2(deltaY, deltaX);
            
            const maxMove = 2;
            const moveX = Math.cos(angle) * maxMove;
            const moveY = Math.sin(angle) * maxMove;
            
            eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// React to operations with facial expressions
function reactToOperation() {
    // Reset face
    mouth.style.borderRadius = '50%';
    mouth.style.width = '20px';
    mouth.style.height = '10px';
    mouth.style.borderBottom = '2px solid var(--text-color)';
    mouth.style.borderTop = 'none';
    
    // React based on current state
    if (operation === 'divide' && currentOperand === '0') {
        // Worried face for division by zero
        mouth.style.width = '15px';
        mouth.style.height = '15px';
        mouth.style.borderRadius = '50%';
        mouth.style.borderBottom = '2px solid var(--text-color)';
    } else if (shouldResetScreen && operation === undefined) {
        // Happy face for result
        mouth.style.width = '25px';
        mouth.style.height = '15px';
        mouth.style.borderBottom = '2px solid var(--text-color)';
    } else if (operation !== undefined) {
        // Focused face during operations
        mouth.style.width = '10px';
        mouth.style.height = '5px';
        mouth.style.borderBottom = '2px solid var(--text-color)';
    }
}

// Initialize the calculator
window.addEventListener('DOMContentLoaded', init);