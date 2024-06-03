let fs = require('fs').promises; // 使用fs的promises API以便异步操作

// 异步读取文件内容
const readFile = async (filePath) => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (err) {
    throw err;
  }
};

// 替换特定字符串为文件内容
const insertContentAtSpecificString = async (originalFilePath, insertFilePath, searchString) => {
  try {
    const originalContent = await readFile(originalFilePath); // 读取原始文件内容
    const insertContent = await readFile(insertFilePath); // 读取要插入的文件内容
    
    // 使用正则表达式替换特定字符串
    const newContent = originalContent.replace(
      new RegExp(`(${searchString})`, 'g'), // 使用捕获组确保替换时保留原始字符串
      `\n${insertContent}$1` // 使用$1引用捕获组，即保留"! white hosts end"
    );
    
    console.log(newContent); // 输出新内容，或者写回文件系统
    
    // 如果需要，将新内容写回原始文件
    await fs.writeFile(originalFilePath, newContent, 'utf8');
  } catch (error) {
    console.error('Error replacing content:', error);
  }
};

// 使用示例
const originalFilePath = 'test.txt'; // 原始文本文件路径
const insertFilePath = 'generate.txt';    // 要插入的内容所在的文件路径
const searchString = '! white hosts end'; // 要替换的特定字符串

insertContentAtSpecificString(originalFilePath, insertFilePath, searchString);