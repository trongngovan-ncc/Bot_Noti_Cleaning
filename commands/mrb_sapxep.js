module.exports = async function handleMRB_SAPXEP(client, event) {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const embed = [
      {
        color: "#3498db",
        title: "Ngăn trên cùng - Máy rửa bát",
        description: "Tầng này đặt đũa, thìa, dao, kéo, những vật dụng nhỏ, dài",
        thumbnail: {
          url: "https://cdn.mezon.ai/0/1840699689087799296/1940048388468772900/1758678485496_1758173860964IMG_2781.jpg"
        }
      
      },
      {
        color: "#3498db",
        title: "Ngăn giữa - Máy rửa bát",
        description: "Tầng này đặt cốc, những vật dụng uống nước",
        thumbnail: {
          url: "https://cdn.mezon.ai/0/1840699689087799296/1940048388468772900/1758678485494_11758173861079IMG_2779.jpg"
        }
      
      },
      {
        color: "#3498db",
        title: "Ngăn dưới cùng - Máy rửa bát",
        description: "Tầng này đặt bát, đĩa, những vật dụng lớn",
        thumbnail: {
          url: "https://cdn.mezon.ai/0/1840699689087799296/1940048388468772900/1758678485497_21758173861190IMG_2778.jpg"
        }
        
      }
    ];
    const attachmentsArr = [
      {
        filename: "sapxep.mov",
        size: 29842935,
        url: "https://cdn.mezon.ai/0/1840699689087799296/1940048388468772900/1758685070446_C_ch_x_p_c_c_ch_n_b_t___a.mov",
        filetype: "video/quicktime",
        width: 1080,
        height: 1920
      }
    ];
    await message.reply({
      t: "Bộ phận Nhân sự - Văn phòng HN1 gửi hướng dẫn cách sắp xếp bát đũa trong máy rửa bát",
      embed
    }, [], attachmentsArr);
  } catch (err) {
    console.error('Lỗi khi gửi hướng dẫn sắp xếp bát đũa:', err);
  }
}
