// 临时测试：验证题目生成逻辑是否符合需求
const fs = require('fs');
const src = fs.readFileSync('E:/work/mathPractice/script.js', 'utf8');

// 提取生成逻辑（DOM 相关代码之前），用 eval 加载（去掉 use strict 以便函数声明进入当前作用域）
const genPart = src.slice(0, src.indexOf("const $ = id =>")).replace("'use strict';", '');
eval(genPart);

let fail = 0;
function assert(cond, msg) {
  if (!cond) { fail++; console.error('FAIL:', msg); }
}

function evalQ(q) {
  // 用真实运算验证 answer 字段
  let v = q.nums[0];
  q.ops.forEach((op, i) => {
    const n = q.nums[i + 1];
    if (op === '+') v += n;
    else if (op === '-') v -= n;
    else if (op === '×') v *= n;
    else if (op === '÷') { if (v % n !== 0) throw new Error('非整除: ' + seqKey(q.nums, q.ops)); v /= n; }
  });
  return v;
}

const types = ['add', 'sub', 'addsub', 'mul', 'div', 'muldiv'];
const ranges = [10, 20, 100];

for (const opType of types) {
  for (const range of ranges) {
    for (const operands of [2, 3]) {
      for (const carry of [false, true]) {
        // 乘除法 carry 无意义，跳过组合
        if (carry && ['mul', 'div', 'muldiv'].includes(opType)) continue;
        const cfg = { count: 100, opType, range, operands, carry };
        const qs = generateQuestions(cfg);
        assert(qs.length === 100, `${opType}/${range}/${operands}/carry=${carry} 题数=${qs.length}`);

        // 空间足够时（加减法 20/100 以内）不允许重复
        if (['add', 'sub', 'addsub'].includes(opType) && range >= 20 && !carry) {
          const keys = new Set(qs.map(q => q.key));
          assert(keys.size === 100, `${opType}/${range}/${operands} 出现重复题: ${keys.size}/100`);
        }

        for (const q of qs) {
          const real = evalQ(q);
          assert(real === q.answer, `答案错误: ${seqKey(q.nums, q.ops)} = ${real}，题目标记 ${q.answer}`);
          assert(Number.isInteger(real) && real >= 0, `结果非负整数: ${seqKey(q.nums, q.ops)}=${real}`);
          assert(real <= range, `结果超范围: ${seqKey(q.nums, q.ops)}=${real} > ${range}`);

          const isAddSub = q.ops.every(o => o === '+' || o === '-');
          if (isAddSub) {
            for (const n of q.nums) assert(n >= 1, `加减法出现0: ${seqKey(q.nums, q.ops)}`);
            if (carry) {
              // “仅加法+三个数+10以内+进位”物理无解（4+4+4=12>10），程序会放宽加数下限兜底
              const relaxed = opType === 'add' && operands === 3 && range < 12;
              if (!relaxed) for (const n of q.nums) assert(n >= 4, `进位模式加数<4: ${seqKey(q.nums, q.ops)}`);
            }
          }
          // 两数减法结果不允许为0
          if (q.ops.length === 1 && q.ops[0] === '-') {
            assert(q.answer !== 0, `两数减法结果为0: ${seqKey(q.nums, q.ops)}`);
          }
          // 乘除法：乘数/除数（运算符右侧的数）取 2~9；被除数不超过 range
          if (!isAddSub) {
            q.ops.forEach((op, i) => {
              const right = q.nums[i + 1];
              assert(right >= 2 && right <= 9, `乘数/除数越界: ${seqKey(q.nums, q.ops)}`);
            });
            assert(q.nums[0] >= 2 && q.nums[0] <= range, `被除数/首数越界: ${seqKey(q.nums, q.ops)}`);
          }
        }
      }
    }
  }
}

// 进位模式概率验证：加法 100 以内两数，勾选后应有明显进位占比
{
  const qs = generateQuestions({ count: 100, opType: 'add', range: 100, operands: 2, carry: true });
  const carryCount = qs.filter(q => (q.nums[0] % 10) + (q.nums[1] % 10) >= 10).length;
  console.log(`进位题占比: ${carryCount}%`);
  assert(carryCount >= 55, '进位概率未明显加大');
}
// 不勾选时进位占比应较低（自然随机）
{
  const qs = generateQuestions({ count: 100, opType: 'add', range: 100, operands: 2, carry: false });
  const carryCount = qs.filter(q => (q.nums[0] % 10) + (q.nums[1] % 10) >= 10).length;
  console.log(`未勾选时进位题占比: ${carryCount}%`);
}

// 减法退位验证
{
  const qs = generateQuestions({ count: 100, opType: 'sub', range: 100, operands: 2, carry: true });
  const borrowCount = qs.filter(q => (q.nums[0] % 10) < (q.nums[1] % 10)).length;
  console.log(`退位题占比: ${borrowCount}%`);
  assert(borrowCount >= 55, '退位概率未明显加大');
}

console.log(fail === 0 ? '\n全部测试通过 ✅' : `\n${fail} 项失败 ❌`);
process.exit(fail === 0 ? 0 : 1);
