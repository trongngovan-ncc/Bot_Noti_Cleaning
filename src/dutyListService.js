const axios = require('axios');

const API_KEY = process.env.API_KEY_GOOGLE_SHEET;
const SHEET_ID = process.env.SHEET_ID;
const RANGE = process.env.RANGE;

async function getDutyList() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`;
  try {
    const response = await axios.get(url);
    const rows = response.data.values || [];
    let lastDate = '';
    return rows.map(row => {
      // Nếu row[4] (ngày) có giá trị thì cập nhật lastDate, nếu không thì dùng lastDate
      if (row[4] && row[4].trim() !== '') {
        lastDate = row[4];
      }
      return {
        stt: row[0] || '',
        name: row[1] || '',
        email: row[2] || '',
        mezon_user_id: row[3] || '',
        date: lastDate,
      };
    });
  } catch (error) {
    throw new Error('Lỗi khi lấy dữ liệu trực nhật: ' + error.message);
  }
}

module.exports = {
  getDutyList
};