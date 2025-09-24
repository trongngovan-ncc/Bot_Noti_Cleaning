module.exports = async function handleChecklistVS(client, event) {
    try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const embedElement = {
      color: "#3498db",
      title: "🧹 Checklist công việc trực nhật chung",
      description: [
        "```",
        "1. Cho đồ sạch (cốc, chén, bát, đũa, dao kéo) từ MRB ra kệ để",
        "2. Đổ rác và thay túi rác (thùng rác và thùng đồ thừa)",
        "3. Tưới cây (vừa đủ nước)",
        "4. Đổ nước thải từ máy rửa bát và máy lọc nước vào WC",
        "```"
      ].join('\n'),
      footer: { text: "Bộ phận nhân sự HN1 - Hãy hoàn thành đầy đủ các mục trên!" }
    };
   
    await message.reply({
      t: "",
      embed: [embedElement]
    });
  } catch (err) {
    console.error('Lỗi gửi message:', err);
  }
}
