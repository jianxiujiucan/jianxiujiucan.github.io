const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const area = document.getElementById("area");
const codeWrapper = document.querySelector(".code");
const text = document.getElementById("text");
const spriteImage = document.getElementById("spriteImage");
let codeString = "";
let spriteArray = [],
  pictureArray = [],
  loadNumber = 0,
  canvasWidth = 0,
  canvasHeight = 0,
  margin = 0;

area.addEventListener(
  "dragover",
  function (e) {
    e.preventDefault();
  },
  false
);

area.addEventListener(
  "drop",
  function (e) {
    e.preventDefault();
    clearCanvas();
    text.style.display = "none";
    const files = e.dataTransfer.files;
    const total = files.length;
    margin = parseFloat(document.querySelector("#inputMargin").value) || 0;
    spriteWidth = parseFloat(document.querySelector("#inputWidth").value) || 0;

    for (let i = 0; i < files.length; i++) {
      pictureArray.push(files[i]);
    }

    pictureArray.sort(function (a, b) {
      return a.name > b.name ? 1 : -1;
    });

    for (let i = 0; i < total; i++) {
      spriteArray[i] = new Image();

      const reader = new FileReader();
      reader.onload = function (e) {
        spriteArray[i].src = e.target.result;
      };

      reader.readAsDataURL(pictureArray[i]);
    }

    for (let i = 0; i < total; i++) {
      spriteArray[i].onload = function () {
        canvasWidth += spriteArray[i].width + margin;
        loadNumber++;

        if (loadNumber === spriteArray.length) {
          canvasWidth = canvasWidth - margin;
          draw();
        }
      };
    }
  },
  false
);

function draw() {
  maxHeight(spriteArray);
  canvasHeight = maxHeight(spriteArray);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  let positionX = 0;
  let positionY = 0;
  let multiple = 1;

  const radios = document.querySelectorAll(".radio");
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      multiple = radios[i].value;
      break;
    }
  }

  if (spriteWidth > 0) {
    const numberX = Math.floor(spriteWidth / (spriteArray[0].width + margin));
    const numberY = Math.ceil(spriteArray.length / numberX);

    canvas.width = spriteArray[0].height * numberX + margin * numberX - margin;
    canvas.height = spriteArray[0].height * numberY + margin * numberY - margin;
    let mark = 0;
    for (let n = 0; n < spriteArray.length; n++) {
      if (positionX + spriteArray[n].width + mark * margin > spriteWidth) {
        positionX = 0;
        mark = 0;
        positionY += spriteArray[n].height + margin;
      }

      ctx.drawImage(
        spriteArray[n],
        0,
        0,
        spriteArray[n].width,
        spriteArray[n].height,
        positionX + margin * mark,
        positionY,
        spriteArray[n].width,
        spriteArray[n].height
      );
      //console.log(positionX + margin * n, positionY, ">>>");
      positionX += spriteArray[n].width;
      mark++;
    }
  } else {
    codeString = `<span class="name">.sprite </span> { <span class="attribute">background: </span> <span class="value">url(sprite.png) no-repeat;</span> <span class="attribute">background-size: </span> <span class="value">${
      canvasWidth / multiple
    }px auto; </span> }<br>`;

    for (let n = 0; n < spriteArray.length; n++) {
      let pointIndex = pictureArray[n].name.lastIndexOf(".");
      let className = pictureArray[n].name.slice(0, pointIndex);

      codeString += `<span class="name">.${className}</span> { <span class="attribute">width: </span><span class="value">${
        spriteArray[n].width / multiple
      }px</span>; <span class="attribute">height:</span><span class="value">${
        spriteArray[n].height / multiple
      }px; </span><span class="attribute">background-position:</span> <span class="value">${
        (positionX * -1 - margin * n) / multiple
      }px 0 </span>}<br>`;

      ctx.drawImage(
        spriteArray[n],
        0,
        0,
        spriteArray[n].width,
        spriteArray[n].height,
        positionX + margin * n,
        0,
        spriteArray[n].width,
        spriteArray[n].height
      );
      positionX += spriteArray[n].width;
    }
  }

  codeWrapper.innerHTML = codeString;
  spriteImage.src = canvas.toDataURL("png");
}

/**
 * 求最大高度
 * @param {Array} 图片数据数组
 */

function maxHeight(array) {
  let result = -Infinity;
  array.forEach((item) => {
    if (item.height > result) {
      result = item.height;
    }
  });
  return result;
}

function clearCanvas() {
  pictureArray = [];
  spriteArray = [];
  total = 0;
  loadNumber = 0;
  canvasWidth = 0;
  codeWrapper.innerHTML = "";
  codeString = "";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const button = document.querySelector(".button");
button.addEventListener("click", function () {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "sprite.png";
  a.click();
});
