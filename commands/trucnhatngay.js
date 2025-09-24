const fs = require('fs');
const path = require('path');

module.exports = async function handleTrucNhatNgay(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const text = event?.content?.t;
    // Lấy ngày từ lệnh: *trucnhatngay_20/11/2025
    const match = text && text.match(/^\*trucnhatngay_(\d{2}\/\d{2}\/\d{4})$/i);
    if (!match) {
      await message.reply({ t: 'Sai cú pháp! Hãy dùng: *trucnhatngay_dd/mm/yyyy' });
      return;
    }
    const dateStr = match[1];
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
    const rows = data.filter(item => item.date === dateStr);
    if (!rows || rows.length === 0) {
      await message.reply({ t: `Không có ai trực nhật vào ngày ${dateStr}!` });
      return;
    }
    let textResult = rows.map(r => `- ${r.name} (${r.email})`).join('\n');
    const embed = [{
      color: "#3498db",
      title: `📅 Danh sách trực nhật ngày ${dateStr}` ,
      description: [
        '```',
        textResult,
        '```'
      ].join('\n'),
      footer: { text: "Bộ phận Nhân sự - Văn phòng HN1" }
    }];
    await message.reply({ t: '', embed });
  } catch (err) {
    console.error('Lỗi khi xử lý command trucnhatngay:', err);
  }
}
