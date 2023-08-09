const passContainer = document.querySelector("input[type=text]");
const lengthContainer = document.querySelector(".length");
const sliderValue = document.querySelector("input[type=range]");
const generatePass = document.querySelector("#generate-btn");
const checkBoxes = document.getElementsByClassName("checkbox");
const upperCheck = document.getElementById("uppercase");
const lowerCheck = document.getElementById("lowercase");
const numbersCheck = document.getElementById("numbers");
const symbolsCheck = document.getElementById("symbols");
const indicator = document.getElementById("indicator");
const copyBtn = document.getElementById("copy-btn");
const copyMsg = document.getElementById("copy-msg");
const symbols = "!@#$%^&*()_-+=;:'\\\"{}[]?/.,><|`~"

let length = lengthContainer.innerText;
let password = "";
let checkCount = 1;

function handleSlider() {
    lengthContainer.innerText = length;
    // const min = sliderValue.min;
    const max = sliderValue.max;
    sliderValue.style.background = `linear-gradient(90deg, rgb(255, 0, 255) ${(length / max) * 100}%, rgb(59, 19, 59) 0)`;
}

function randomDigit(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateNumber() {
    return randomDigit(0,9);
}

function generateUpper() {
    return String.fromCharCode(randomDigit(65, 90));
}

function generateLower() {
    return String.fromCharCode(randomDigit(97, 122));
}

function generateSymbol() {
    return symbols.charAt(randomDigit(0, symbols.length));
}

function passStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCheck.checked) hasUpper = true;
    if(lowerCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && hasNum && hasSym && length >= 8) {
        setIndicator("#0f0")
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && length >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 5px 2px ${color}`;
}

function copyPassword() {
    navigator.clipboard.writeText(passContainer.value);
    copyMsg.style.opacity = "1";
    setTimeout(() => copyMsg.style.opacity = "0", 2000);
}

function calcCheckCount() {
    checkCount = 0;
    for(let box of checkBoxes) {
        if (box.checked) {
            checkCount++;
        }
    }
    if (length < checkCount) {
        length = checkCount;
        sliderValue.value = length;
        handleSlider();
    }
}

function generatePassword() {
    let tempLen = length;
    let tempPass = "";
    let functionCalls = [];
    if (upperCheck.checked) {
        tempPass += generateUpper();
        tempLen--;
        functionCalls.push(generateUpper);
    }

    if (lowerCheck.checked) {
        tempPass += generateLower();
        tempLen--;
        functionCalls.push(generateLower);
    }

    if (numbersCheck.checked) {
        tempPass += generateNumber();
        tempLen--;
        functionCalls.push(generateNumber);
    }

    if (symbolsCheck.checked) {
        tempPass += generateSymbol();
        tempLen--;
        functionCalls.push(generateSymbol);
    }

    while (tempLen) {
        let index = randomDigit(0, functionCalls.length - 2);
        let call = functionCalls[index];
        console.log(index);
        tempPass += call();
        tempLen--;
    }

    password = shufflePass(tempPass);
    passContainer.value = password;

    // console.log(password);

    passStrength();
}

function shufflePass(str) {
    let arr = str.split("");
    // console.log(arr);
    for(let i = 0; i < arr.length; i++) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp; 
    }
    // console.log(arr);
    return arr.join("");
}

for(let box of checkBoxes) {
    box.addEventListener("input", calcCheckCount);
}

sliderValue.addEventListener("input", () => {
    length = sliderValue.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if(passContainer.value) {
        copyPassword();
    }
})

generatePass.addEventListener("click", () => {
    if (checkCount) {
        calcCheckCount();
        generatePassword();
    } else {
        alert("Check atleat one rule");
    }
});