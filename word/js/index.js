const string = "我日月大小多少人爸妈云风起秋";
const wordList = string.split("");
const word = document.getElementById("word");

const buttonNext = document.getElementById("buttonNext");


function createWord() {
  if (wordList.length > 0) {
    const position = getWord();
    console.log(position);
    word.innerHTML = wordList[position];
    wordList.splice(position, 1);
    console.log(wordList);
  } else {
    document.getElementById('tips').style.visibility = 'visible'
  }
}

createWord();

buttonNext.addEventListener("click", function () {
  createWord();
});

function getWord() {
  return (Math.random() * wordList.length) | 0;
}
