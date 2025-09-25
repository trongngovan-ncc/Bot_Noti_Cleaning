const fs = require('fs');
const path = require('path');

function getWeekdayFromDateString(dateStr) {
  const [day, month, year] = dateStr.split('/');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('vi-VN', { weekday: 'long' });
}

module.exports = async function handleMyTrucNhat(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const senderId = event.sender_id;
    const jsonPath = path.join(__dirname, '../data/dutylist.json');
    let rows = [];
    try {
      const fileContent = fs.readFileSync(jsonPath, 'utf8');
      rows = JSON.parse(fileContent);
    } catch (err) {
      await message.reply({
        t: 'Không thể đọc dữ liệu trực nhật từ file JSON!',
        mk: []
      });
      console.error('Lỗi đọc file dutylist.json:', err);
      return;
    }
    // Lọc các ngày trực của user
    const myRows = rows.filter(d => d.mezon_user_id === senderId);
    if (!myRows || myRows.length === 0) {
      await message.reply({
        t: 'Bạn không có lịch trực nhật nào trong hệ thống!',
        mk: []
      });
      return;
    }
    let text = '';
    for (const r of myRows) {
      const teammates = rows.filter(d => d.date === r.date && d.mezon_user_id !== senderId);
      text += `- ${r.name} trực ${getWeekdayFromDateString(r.date)} (${r.date})`;
      if (teammates.length > 0) {
        text += `\n    • Đồng đội cùng trực: ${teammates.map(m => `${m.name} (${m.email})`).join(', ')}`;
      }
      text += '\n';
    }
    const embed = [{
      color: "#3498db",
      title: "🧑‍💼 Lịch trực nhật của bạn",
      description: [
        '```',
        text.trim(),
        '```'
      ].join('\n'),
      footer: { text: "Bộ phận Nhân sự - Văn phòng HN1" }
    }];
    await message.reply({
      t: '',
      embed
    });
  } catch (err) {
    console.error('Lỗi khi xử lý command /mytrucnhat:', err);
  }
// ...existing code...
}
