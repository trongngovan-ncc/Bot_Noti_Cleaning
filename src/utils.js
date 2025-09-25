// Hàm lấy thứ tiếng Việt theo múi giờ VN
function getVNWeekday(offset = 0) {
  const now = new Date();
  const vnDate = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
  vnDate.setDate(vnDate.getDate() + offset);
  return vnDate.toLocaleDateString('vi-VN', { weekday: 'long' });
}

// Hàm lấy ngày dd/mm/yyyy theo múi giờ VN
function getVNDateString(offset = 0) {
  const now = new Date();
  const vnDate = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
  vnDate.setDate(vnDate.getDate() + offset);
  return `${String(vnDate.getDate()).padStart(2, '0')}/${String(vnDate.getMonth() + 1).padStart(2, '0')}/${vnDate.getFullYear()}`;
}

module.exports = {
  getVNWeekday,
  getVNDateString
};