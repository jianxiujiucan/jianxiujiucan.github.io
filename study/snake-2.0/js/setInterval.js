let handleRequest = {};

/**
 * 重复调用一个函数方法
 * @param {function} fn  要重复调用的函数
 * @param {number} delay 每次延迟的毫秒数
 */
export const mySetInterval =  (fn, delay) => {
  let requestAnimationFrame = (function () {
      return (
        window.requestAnimationFrame ||
        function (callback, element) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })(),
    start = new Date().getTime();

  function loop() {
    handleRequest.value = requestAnimationFrame(loop);
    const current = new Date().getTime();
    const delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
  }
  handleRequest.value = requestAnimationFrame(loop);

  return handleRequest;
};

/**
 * 清除重复调用函数
 */
export const cancelMySetInterval = () => {
  cancelAnimationFrame(handleRequest.value);
};
