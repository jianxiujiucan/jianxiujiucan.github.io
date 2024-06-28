function generateQuestion(maxValue, maxResult) {
  let num1, num2, operator, question, answer;

  do {
    // 生成1到100之间的随机数
    num1 = Math.floor(Math.random() * maxValue) + 1;
    // 降低个位数的概率：先随机生成一个1到9的数，然后乘以10，再加上1到9的随机数
    num2 =
      Math.floor(Math.random() * 9) * 10 + Math.floor(Math.random() * 9) + 2;
    operator = Math.random() > 0.5 ? "+" : "-"; // 随机选择加号或减号
    if (operator === "+") {
      answer = num1 + num2;
    } else {
      answer = num1 - num2;
    }
    // 构造题目字符串
    question = `<span class = "number">${num1}</span>  <span class = "symbol">${operator}</span>  <span class="number">${num2}</span> `;
  } while (answer > maxResult || answer < 1); // 确保加法结果不超过100，减法结果不低于1

  return { question: question, answer: answer };
}

function generateUniqueQuestions(count, maxValue, maxResult) {
  let questions = [];
  let attempts = 0;
  while (questions.length < count && attempts < count * 5) {
    // 限制尝试次数，避免无限循环
    let question = generateQuestion(maxValue, maxResult);
    if (!questions.some((q) => q.question === question.question)) {
      questions.push(question);
    }
    attempts++;
  }
  // 如果未能生成足够数量的题目，抛出错误或进行其他处理
  if (questions.length < count) {
    throw new Error("Unable to generate enough unique questions");
  }
  return questions;
}

function handleCreate() {
  // 调用函数生成20道不重复的题目，加法结果不超过100，减法结果不低于1
  let uniqueMathQuestions = generateUniqueQuestions(20, 100, 100);

  // 打印题目和答案

  const list = document.querySelector(".list");
  let dom = "";
  uniqueMathQuestions.forEach(function (question, index) {
    // console.log(`题目 ${index + 1}: ${question.question} = ${question.answer}`);
    dom += `<li>${question.question}
<span class = "symbol">=</span> 
<span class="answer">${question.answer}</span>  </li>`;
  });

  list.innerHTML = dom;
}

const list = document.querySelector(".list");
const btnCreate = document.querySelector(".button-create");
const buttonAnswer = document.querySelector(".button-answer");
btnCreate.addEventListener("click", function () {
  handleCreate();
  buttonAnswer.style.display = "block";
  list.classList.remove("is-show");
});

buttonAnswer.addEventListener("click", () => {
  list.classList.add("is-show");
});

handleCreate();
