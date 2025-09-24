module.exports = async function handleMRB_DONUOCTHAI(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const attachmentsArr = [
      {
        filename: "donuocthai.mov",
        size: 29842935,
        url: "https://cdn.mezon.ai/0/1840699689087799296/1940048388468772900/1758614829876_1758614405126____n__c_th_i.mov",
        filetype: "video/quicktime",
        width: 1080,
        height: 1920
      }
    ];
    await message.reply({
      t: "Bộ phân nhân sự - Văn phòng HN1 gửi hướng dẫn cách đổ nước thải trong MRB",
    }, [], attachmentsArr);
  } catch (err) {
    console.error('Lỗi khi gửi hướng dẫn đổ nước thải:', err);
  }
}
