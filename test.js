// test_vn_date.js
const today = new Date();
const vnDate = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
vnDate.setDate(vnDate.getDate() + 1);
const weekday = vnDate.toLocaleDateString('vi-VN', { weekday: 'long' });
const dateStr = `${String(vnDate.getDate()).padStart(2, '0')}/${String(vnDate.getMonth() + 1).padStart(2, '0')}/${vnDate.getFullYear()}`;
const header = `#### Nhắc nhở trực nhật ngày mai📢:${weekday}, ${dateStr}`;
console.log(header);