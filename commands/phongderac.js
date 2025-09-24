module.exports = async function handlePhongderac(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const attachmentsArr = [
      {
        filename: "phongderac.mov",
        size: 29842935,
        url: "https://cdn.mezon.ai/0/1840699689087799296/1940048388468772900/1758685937671_H__ng_d_n_t_i_ph_ng____r_c.mov",
        filetype: "video/quicktime",
        width: 1080,
        height: 1920
      }
    ];
    await message.reply({
      t: "Bộ phân nhân sự - Văn phòng HN1 gửi hướng dẫn tới phòng đổ rác",
    }, [], attachmentsArr);
  } catch (err) {
    console.error('Lỗi khi gửi hướng dẫn tới phòng đổ rác:', err);
  }
}
