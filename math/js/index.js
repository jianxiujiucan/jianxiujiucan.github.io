const list = document.querySelector(".list");
const buttonAnswer = document.querySelector(".button-answer");
const buttonCreate = document.querySelector(".button-create");
const select = document.querySelector("#select");
const symbols = ["+", "-"];
const range = 100

let arrList = "";

function createList(type) {
  arrList = "";
  document.querySelector(".list").innerHTML = "";
  
  for (let i = 0; i < range; i++) {
    if (type === "1") {
      createStepOne();
    } else {
      createStepTwo();
    }
  }
  document.querySelector(".list").innerHTML = arrList;
}

function createStepOne() {
  let number1 = getRandom(range);
  let number2 = 1;

  const symbol = getSymbol();

  if (symbol === "+") {
    number2 = getRandom(range - number1);
  } else {
    number2 = getRandom(number1);
  }

  arrList += `<li><span class="number">${number1}</span> <span class = "symbol">${
    symbol === "+" ? "+" : "-"
  }</span> <span class="number">${number2}</span> <span class = "symbol">=</span> 
    <span class="answer">${
      symbol === "+" ? number1 + number2 : number1 - number2
    }</span>  </li>`;
}

function createStepTwo() {
  let number1 = getRandom(range - 3);
  let number2 = 1;
  let number3 = 1;

  const symbol1 = getSymbol();
  const symbol2 = getSymbol();
  console.log(symbol1,symbol2)

  const type1 = symbol1 === "+" && symbol2 === '+'
  const type2 = symbol1 === "+" && symbol2 === '-'
  const type3 = symbol1 === "-" && symbol2 === '+'
  const type4 = symbol1 === "-" && symbol2 === '-'
  let result = 0

  if (type1) {
    number2 = getRandom(range - number1);
    number3 = getRandom(range - number1 - number2);
    result = number1 + number2 + number3
  } else if (type2){
    number2 = getRandom(range - number1);
    number3 = getRandom(number1 + number2)
    result = number1 + number2 - number3

  } else if(type3){
    number2 = getRandom(number1)
    number3 = getRandom(range - number1 + number2)
    result = number1 - number2 + number3
  } else if(type4){
    number2 = getRandom(number1)
    number3 = getRandom(number1 - number2)
    result = number1 - number2 - number3
  }

  arrList += `<li>
  <span class = "number">${number1}</span> 
  <span class = "symbol">${symbol1 === "+" ? "+" : "-"}</span> 
  <span class="number">${number2}</span> 
  <span class = "symbol">${symbol2 === "+" ? "+" : "-"}</span> 
  <span class="number">${number3}</span> 
  <span class = "symbol">=</span> 
  <span class="answer">${result}</span>  </li>`;
}

function getRandom(max) {
  const index = Math.floor(Math.random() * (max - 2 + 1) + 1);
  return index;
}

function getSymbol() {
  return symbols[(Math.random() * symbols.length)  | 0];
}

function getNumber() {
  return Math.floor(Math.random() * 49) + 1;
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
});
