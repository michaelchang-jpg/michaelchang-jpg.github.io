const axios = require('axios');

async function fixTask() {
  const ip = '192.168.1.186';
  const port = '3001';
  const baseUrl = `http://${ip}:${port}`;

  try {
    // 1. 刪除亂碼的任務
    console.log('Deleting task 1...');
    await axios.delete(`${baseUrl}/api/tasks/1`);

    // 2. 重新發送正確編碼的任務
    console.log('Creating fixed task...');
    await axios.post(`${baseUrl}/api/webhook/message`, {
      text: '✨ 初始化長期記憶：讀取 backend/docs 檔案',
      stage: 'received'
    });

    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

fixTask();
