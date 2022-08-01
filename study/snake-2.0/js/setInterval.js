const handleRequest = {};

/**
 * 重复调用一个函数方法
 * @param {function} fn  要重复调用的函数
 * @param {number} delay 每次延迟的毫秒数
 */
export const mySetInterval =  (fn, delay) => {
  let start = Date.now();

  function loop() {
    const current = Date.now();
    const delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = Date.now();
    }
    handleRequest.value = requestAnimationFrame(loop);
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
