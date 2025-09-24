module.exports = async function handleMRB(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const attachmentsArr = [
      {
        filename: "hdsdchung.mov",
        size: 29842935,
        url: "https://cdn.mezon.ai/0/1840699689087799296/1940048388468772900/1758685023532_C_ch_s__d_ng_MRB.mov",
        filetype: "video/quicktime",
        width: 1080,
        height: 1920
      }
    ];
    await message.reply({
      t: "Bộ phận Nhân sự - Văn phòng HN1 gửi hướng dẫn sử dụng chung máy rửa bát",
    }, [], attachmentsArr);
  } catch (err) {
    console.error('Lỗi khi gửi hướng dẫn sử dụng chung rửa bát:', err);
  }
}





