module.exports = async function handleDeleteMessage(client,event) {
    try {
    const channel_id = '1971006617226842112';
    const message_id = '1840651252644450304';
    const channel = await client.channels.fetch(channel_id);
    const message = await channel.messages.fetch(message_id);
    await message.delete();
    console.log(`Message ${message.message_id} deleted.`);
    await message.reply({
      t: "oke đã xóa nhé"
    });
  } catch (err) {
    console.error('Lỗi gửi message:', err);
  }
}
