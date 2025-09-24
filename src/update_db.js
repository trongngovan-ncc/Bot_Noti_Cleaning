
const { getDutyList } = require('./dutyListService');
const fs = require('fs');
const path = require('path');

async function updateDutyListDB() {
  // Lấy dữ liệu từ Google Sheet
  const dutyList = await getDutyList();

  // Ghi đè toàn bộ dữ liệu vào file JSON
  const jsonPath = path.join(__dirname, '../data/dutylist.json');
  return new Promise((resolve, reject) => {
    fs.writeFile(jsonPath, JSON.stringify(dutyList, null, 2), 'utf8', (err) => {
      if (err) reject(err);
      else resolve(dutyList.length);
    });
  });
}

module.exports = { updateDutyListDB };
