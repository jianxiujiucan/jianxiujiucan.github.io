import { fileNameCompare } from "./fileNameCompare.js";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const area = document.getElementById("area");
const codeWrapper = document.querySelector(".code");
const text = document.getElementById("text");
const spriteImage = document.getElementById("spriteImage");
const animation = document.getElementById('animation')
let spriteArray = [],
  pictureArray = [],
  loadNumber = 0,
  canvasWidth = 0,
  canvasHeight = 0,
  margin = 0,
  total = 0,
  createImageWidth = 0,
  codeString = "";

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
    total = files.length;
    margin = parseFloat(document.querySelector("#inputMargin").value) || 0;
    createImageWidth =
      parseFloat(document.querySelector("#inputWidth").value) || 0;

    // 生成文件数组
    for (let i = 0; i < files.length; i++) {
      pictureArray.push(files[i]);
    }

    // 文件名重新排序
    pictureArray.sort((a, b) => fileNameCompare(a.name, b.name));
    pictureArray.sort((a, b) => fileNameCompare(a.name, b.name));
    console.log(pictureArray)
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

  margin = margin * multiple;
  console.log(margin)

  if (createImageWidth > 0) {
    const numberX = Math.floor(
      createImageWidth / (spriteArray[0].width + margin)
    );
    const numberY = Math.ceil(spriteArray.length / numberX);

    canvas.width = spriteArray[0].width * numberX + margin * numberX - margin;
    canvas.height = spriteArray[0].height * numberY + margin * numberY - margin;
    codeString = `<span class="name">.sprite </span> { <span class="attribute">width:</span><span class="value"> ${spriteArray[0].width / multiple}px</span>; <span class="attribute">height:</span><span class="value">  ${spriteArray[0].height / multiple}px</span>;<span class="attribute">background: </span> <span class="value">url(sprite.png) no-repeat;</span> <span class="attribute">background-size: </span> <span class="value">${
      canvas.width / multiple
    }px auto; </span> }<br>`;
    let mark = 0;
    let iconName = [];
    for (let n = 0; n < spriteArray.length; n++) {
      // 如果大于图片的设置的宽度，则换行绘制
      if (positionX + spriteArray[n].width + mark * margin > createImageWidth) {
        positionX = 0;
        mark = 0;
        positionY += spriteArray[n].height + margin;
      }
      let pointIndex = pictureArray[n].name.lastIndexOf(".");
      let className = pictureArray[n].name.slice(0, pointIndex);
      iconName.push(className);

      codeString += createCSSCode(
        positionX + margin * mark,
        positionY,
        multiple,
        className
      );
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

      positionX += spriteArray[n].width;
      mark++;
    }
    console.log(iconName);
    
  } else {
    codeString = `<span class="name">.sprite </span> { <span class="attribute">background: </span> <span class="value">url(sprite.png) no-repeat;</span> <span class="attribute">background-size: </span> <span class="value">${
      canvasWidth / multiple
    }px auto; </span> }<br>`;

    for (let n = 0; n < spriteArray.length; n++) {
      let pointIndex = pictureArray[n].name.lastIndexOf(".");
      let className = pictureArray[n].name.slice(0, pointIndex);
      codeString += createCSSCode(
        positionX * -1 - margin * n,
        0,
        multiple,
        className
      );

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
  animation.style.width = spriteArray[0].width / multiple
  animation.style.height = spriteArray[0].width / multiple
  animation.cssText = `width: ${spriteArray[0].width}; height: ${spriteArray[0].width}; background: url(${canvas.toDataURL("png")}) no-repeat;`
}

function createCSSCode(x, y, multiple, className) {
  return `<span class="name">.${className}</span> { <span class="attribute">background-position: </span> <span class="value">${
    -x / multiple
  }${x === 0 ? "" : "px"} ${-y / multiple}${y === 0 ? "" : "px"} </span>}<br>`;
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
