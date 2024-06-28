const list = document.querySelector(".list");
const buttonAnswer = document.querySelector(".button-answer");
const buttonCreate = document.querySelector(".button-create");
const select = document.querySelector("#select");
const symbols = ["+", "-"];
const range = 100;
let questions = 20;

let htmlDomArray = "";

function createList(type) {
  htmlDomArray = "";
  document.querySelector(".list").innerHTML = "";

  for (let i = 0; i < questions; i++) {
    if (type === "1") {
      createStepOne();
    } else {
      createStepTwo();
    }
  }
  document.querySelector(".list").innerHTML = htmlDomArray;
  
}

function createStepOne() {
  let number1 = getRandomNumber(range);
  let number2 = 0;

  const symbol = getSymbol();

  if (symbol === "+") {
    number2 = getRandomNumber(range - number1);
  } else {
    number2 = getRandomNumber(number1);
  }

  htmlDomArray += `<li><span class="number">${number1}</span> <span class = "symbol">${
    symbol === "+" ? "+" : "-"
  }</span> <span class="number">${number2}</span> <span class = "symbol">=</span> 
    <span class="answer">${
      symbol === "+" ? number1 + number2 : number1 - number2
    }</span>  </li>`;
}

function createStepTwo() {
  let number1 = getRandomNumber(range - 3);
  let number2 = 1;
  let number3 = 1;

  const symbol1 = getSymbol();
  const symbol2 = getSymbol();
  console.log(symbol1, symbol2);

  const type1 = symbol1 === "+" && symbol2 === "+";
  const type2 = symbol1 === "+" && symbol2 === "-";
  const type3 = symbol1 === "-" && symbol2 === "+";
  const type4 = symbol1 === "-" && symbol2 === "-";

  let result = 0;

  if (type1) {
    number2 = getRandomNumber(range - number1);
    number3 = getRandomNumber(range - number1 - number2);
    result = number1 + number2 + number3;
  } else if (type2) {
    number2 = getRandomNumber(range - number1);
    number3 = getRandomNumber(number1 + number2);
    result = number1 + number2 - number3;
  } else if (type3) {
    number2 = getRandomNumber(number1);
    number3 = getRandomNumber(range - number1 + number2);
    result = number1 - number2 + number3;
  } else if (type4) {
    number2 = getRandomNumber(number1);
    number3 = getRandomNumber(number1 - number2);
    result = number1 - number2 - number3;
  }


  htmlDomArray += `<li>
  <span class = "number">${number1}</span> 
  <span class = "symbol">${symbol1 === "+" ? "+" : "-"}</span> 
  <span class="number">${number2}</span> 
  <span class = "symbol">${symbol2 === "+" ? "+" : "-"}</span> 
  <span class="number">${number3}</span> 
  <span class = "symbol">=</span> 
  <span class="answer">${result}</span>  </li>`;
}

function getRandomNumber(max) {
  const index = Math.floor(Math.random() * (max - 2 + 1) + 1);
  return index;
}

function getSymbol() {
  return symbols[(Math.random() * symbols.length) | 0];
}

select.addEventListener("change", function () {
  console.log(this.value);
});

buttonAnswer.addEventListener("click", () => {
  list.classList.add("is-show");
});

buttonCreate.addEventListener("click", () => {
  const type = select.value;
  console.log(type);
  createList(type);
  buttonAnswer.style.display = 'block'
  document.querySelector(".list").classList.remove('is-show')
});
