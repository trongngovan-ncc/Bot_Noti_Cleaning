module.exports = async function handleMRB_DORAC(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const attachmentsArr = [
      {
        filename: "dorac.mov",
        size: 29842935,
        url: "https://cdn.mezon.ai/0/1840699689087799296/1940048388468772900/1758685162701_C_ch____r_c_trong_MRB.mov",
        filetype: "video/quicktime",
        width: 1080,
        height: 1920
      }
    ];
    await message.reply({
      t: "Bộ phân nhân sự - Văn phòng HN1 gửi hướng dẫn cách đổ rác trong MRB",
    }, [], attachmentsArr);
  } catch (err) {
    console.error('Lỗi khi gửi hướng dẫn đổ nước rác:', err);
  }
}
