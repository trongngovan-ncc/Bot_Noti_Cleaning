const { updateDutyListDB } = require('../src/update_db');

module.exports = async function handleCrawlData(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const mezonUserId =  event.sender_id;
    if (mezonUserId !== '1940048388468772864') {
      await message.reply({
        t: 'Bạn không có quyền sử dụng lệnh này!',
        mk: []
      });
      return;
    }
    let rowCount = 0;
    try {
      rowCount = await updateDutyListDB();
    } catch (err) {
      await message.reply({
        t: 'Không thể crawl và lưu dữ liệu vào file JSON!',
        mk: []
      });
      console.error('Lỗi khi crawl/lưu dữ liệu:', err);
      return;
    }
    await message.reply({
      t: `Đã crawl và lưu ${rowCount} dòng dữ liệu trực nhật vào file JSON.`,
      mk: []
    });
  } catch (err) {
    console.error('Lỗi khi xử lý command /crawldata:', err);
  }
}