
const fs = require('fs');
const path = require('path');

module.exports = async function handleList(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    // Đọc danh sách trực nhật từ file JSON
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
    // Lọc các ngày trong tháng 9 và 10
    const filtered = rows.filter(d => {
      if (!d.date) return false;
      const [dd, mm, yyyy] = d.date.split('/');
      return mm === '09' || mm === '10';
    });
    // Format lại cho đẹp
    let preBlock = filtered.map(d => {
      return `${d.stt.toString().padStart(2, '0')}. ${d.name.padEnd(18)} | ${d.date}`;
    }).join('\n');
    if (!preBlock) preBlock = 'Không có dữ liệu trực nhật Tháng 9 & 10.';
    const embedElement = {
      color: "#1ABC9C",
      title: "📅 Danh sách trực nhật Tháng 9 & 10",
      description: [
        '```',
        preBlock,
        '```'
      ].join('\n'),
      footer: { text: "Bộ phận Nhân Sự Văn Phòng HN1" }
    };
    await message.reply({
      t: '',
      embed: [embedElement]
    });
  } catch (err) {
    await message.reply({
      t: 'Không thể lấy danh sách trực nhật từ file JSON. Vui lòng thử lại sau!',
      mk: []
    });
    console.error('Lỗi khi xử lý command /list:', err);
  }
}