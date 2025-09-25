const fs = require('fs');
const path = require('path');
const { getVNDateString, getVNWeekday } = require('../src/utils');

module.exports = async function handleTodayTrucNhat(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const todayStr = getVNDateString(0);
    const jsonPath = path.join(__dirname, '../data/dutylist.json');
    let data = [];
    try {
      const fileContent = fs.readFileSync(jsonPath, 'utf8');
      data = JSON.parse(fileContent);
    } catch (err) {
      await message.reply({
        t: 'Không thể đọc dữ liệu trực nhật từ file JSON!',
        mk: []
      });
      console.error('Lỗi đọc file dutylist.json:', err);
      return;
    }
    const rows = data.filter(item => item.date === todayStr);
    if (!rows || rows.length === 0) {
      await message.reply({
        t: 'Hôm nay không có ai trực nhật trong hệ thống!',
        mk: []
      });
      return;
    }
    let text = rows.map(r => `- ${r.name} (${r.email})`).join('\n');
    const embed = [{
      color: "#3498db",
      title: `📅 Danh sách trực nhật hôm nay - ${getVNWeekday(0)} (${todayStr})` ,
      description: [
        '```',
        text,
        '```'
      ].join('\n'),
      footer: { text: "Bộ phận Nhân sự - Văn phòng HN1" }
    }];
    await message.reply({
      t: '',
      embed
    });
  } catch (err) {
    console.error('Lỗi khi xử lý command /todaytrucnhat:', err);
  }
}
