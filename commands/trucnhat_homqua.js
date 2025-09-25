const fs = require('fs');
const path = require('path');
const { getVNDateString, getVNWeekday } = require('../src/utils');

module.exports = async function handleTrucNhatHomQua(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const yesterdayStr = getVNDateString(-1);
    const jsonPath = path.join(__dirname, '../data/dutylist.json');
    let data = [];
    try {
      const fileContent = fs.readFileSync(jsonPath, 'utf8');
      data = JSON.parse(fileContent);
    } catch (err) {
      await message.reply({ t: 'Không thể đọc dữ liệu trực nhật từ file JSON!' });
      console.error('Lỗi đọc file dutylist.json:', err);
      return;
    }
    const rows = data.filter(item => item.date === yesterdayStr);
    if (!rows || rows.length === 0) {
      await message.reply({ t: `Không có ai trực nhật vào hôm qua - ${getVNWeekday(-1)} (${yesterdayStr})!` });
      return;
    }
    let textResult = rows.map(r => `- ${r.name} (${r.email})`).join('\n');
    const embed = [{
      color: "#3498db",
      title: `📅 Danh sách trực nhật hôm qua - ${getVNWeekday(-1)} (${yesterdayStr})` ,
      description: [
        '```',
        textResult,
        '```'
      ].join('\n'),
      footer: { text: "Bộ phận Nhân sự - Văn phòng HN1" }
    }];
    await message.reply({ t: '', embed });
  } catch (err) {
    console.error('Lỗi khi xử lý command trucnhat_homqua:', err);
  }
}
