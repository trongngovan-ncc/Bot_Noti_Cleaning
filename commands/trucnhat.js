module.exports = async function handleTrucNhat(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const embedElement = {
      color: "#3498db",
      title: "📢 THÔNG BÁO VỀ VIỆC TRỰC NHẬT VĂN PHÒNG",
      description: [
        "I. ✅ Công việc cá nhân",
        "```",
        "1. 🥢 Bát đũa sử dụng xong phải bỏ hết cặn và cho vào máy rửa bát. Dọn dẹp sạch sẽ sau khi sử dụng khu vực chung. Thùng xanh chỉ để nước thừa, không để bát đũa.",
        "2. ⏰ Trước 17h30 để hết cốc, chén, bát, đũa, dao kéo vào trong MRB, xếp theo hướng dẫn trong video để IT bấm máy start cho mọi người. Sau 17h30 thì cả nhà tự rửa hoặc đợi ngày mai, turn sau nhé.",
        "3. 🧽 Tự lau dọn khu vực làm việc cá nhân và khu vực chung mình sử dụng (pantry)",
        "4. 🔌 Khu vực làm việc cần làm gọn các dây điện để robot dễ đi vào lau, liên hệ IT để lấy dây thít nếu cần.",
        "```",
        '',
        "II. 🧹 Công việc trực nhật chung",
        "```",
        "1. 🍽️ Cho bát, đũa, cốc chén sạch từ MRB ra kệ để",
        "2. 🗑️ Đổ rác và thay túi rác.",
        "3. 💦 Đổ nước thải từ máy MRB ra nhà vệ sinh",
        "4. 🌱 Tưới cây",
        "```",
        '',
        "III. ⚠️ Lưu ý về trách nhiệm trực nhật",
        "```",
        "1. 🤝 Đây là công việc chung, mọi người cần có trách nhiệm tham gia.",
        "2. 🏢 Đến ngày trực nhật của ai thì người đó có trách nhiệm lên văn phòng (không remote).",
        "3. 🔄 Nếu bận, có thể đổi ngày với đồng nghiệp khác.",
        "4. 📢 Chủ động báo HR khi các vật phẩm dọn dẹp hoặc đồ dùng (túi rác, nước uống, nước lau sàn…) sắp hết/thiếu để được bổ sung kịp thời.",
        "```",
        '',
        "IV. 💡 Các lệnh anh/chị/em có thể sử dụng",
        "```",
        "1.  *trucnhat_ds: Danh sách trực nhật",
        "2.  *trucnhat_cuatoi: Xem lịch trực nhật của tôi kèm đồng đội",
        "3.  *trucnhat_homnay: Xem những thành viên trực nhật hôm nay",
        "4.  *trucnhat_congviec: Checklist những đầu mục công việc chính khi trực nhật",
        "5.  *mrb, *mrb_sapxep, *mrb_donuocthai, *mrb_dorac: Xem hướng dẫn sử dụng, sắp xếp bát đũa, đổ nước thải, đổ rác cho máy rửa bát",
        "6.  *phongderac: Xem hướng dẫn đi đến phòng đổ rác.",
        "```",
        "",
      ].join('\n'),
      footer: { text: "Bộ phận HR Văn phòng HN1 - Văn phòng sạch đẹp là trách nhiệm của tất cả!" }
    };
    await message.reply({
      t: "",
      embed: [embedElement]
    });
  } catch (err) {
    console.error('Lỗi gửi thông báo trực nhật:', err);
  }
}
