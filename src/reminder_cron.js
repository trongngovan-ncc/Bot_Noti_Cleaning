
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

function getTodayString() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
function getTomorrowString() {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }



function startReminderCron(client) {
  // Cron: Nhắc nhở trực nhật hôm nay:cả DM lẫn user
  cron.schedule('30 07 * * *', async () => {
    try {
      await remindTodayDuty(client);
      await remindGeneralCleaning(client);
    } catch (err) {
      console.error('Lỗi cronjob nhắc trực nhật:', err);
    }
  });

  // Cron: nhắc nhở 
  cron.schedule('30 16 * * *', async () => {
    try {
      await remindTodayDuty(client);
    } catch (err) {
      console.error('Lỗi cronjob nhắc vệ sinh chung:', err);
    }
  });

  // Cron: nhắc nhở ngày mai ( cả channel lẫn DM user)
  cron.schedule('00 18 * * *', async () => {
    try {
      await remindTomorrowDuty(client);
    } catch (err) {
      console.error('Lỗi cronjob nhắc vệ sinh chung:', err);
    }
  });

}

// Ví dụ handler nhắc nhở trực nhật hôm nay
async function remindTodayDuty(client) {
  const todayStr = getTodayString();
  const jsonPath = path.join(__dirname, '../data/dutylist.json');
  let rows = [];
  try {
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    rows = JSON.parse(fileContent);
  } catch (err) {
    console.error('Lỗi đọc file dutylist.json:', err);
    return;
  }
  const todayRows = rows.filter(d => d.date === todayStr);
  if (!todayRows || todayRows.length === 0) return;
  const header = '#### Nhắc nhở trực nhật hôm nay 📢';
  const footer = '✅ Anh/chị/em nhớ hoàn thành nhiệm vụ trực nhật nhé, mình xin nhắc lại các đầu mục công việc dưới đây!';
  let tagLine = '';
  let mentionsArr = [];
  const t = `${header}\n`;
  let offset = t.length;
  todayRows.forEach((r, idx) => {
    const mentionTag = `@${r.name}`;
    const s = offset;
    const e = offset + mentionTag.length;
    tagLine += mentionTag;
    mentionsArr.push({ user_id: r.mezon_user_id, s, e });
    offset = e;
    if (idx < todayRows.length - 1) {
      tagLine += ', ';
      offset += 2;
    }
  });
  const fullMsg = `${header}\n${tagLine}\n${footer}`;
  const channelId = '1829449968461549568';
  const channel = await client.channels.fetch(channelId);
  // Embed checklist công việc trực nhật chung
  const checklistEmbed = {
    color: "#3498db",
    title: "🧹 Checklist công việc trực nhật chung",
    description: [
      "```",
      "1. Cho đồ sạch (cốc, chén, bát, đũa, dao kéo) từ MRB ra kệ để",
      "2. Đổ rác và thay túi rác (thùng rác và thùng đồ thừa)",
      "3. Tưới cây (vừa đủ nước)",
      "4. Đổ nước thải từ máy rửa bát vào WC",
      "```"
    ].join('\n'),
    footer: { text: "📝 Bộ phận nhân sự HN1 - Hãy hoàn thành đầy đủ các mục trên!" }
  };
  await channel.send({ t: fullMsg, embed: [checklistEmbed] }, mentionsArr);

 
  for (const user of todayRows) {
    try {
      const clanid = '1779484504377790464';
      const clan = await client.clans.fetch(clanid);
      const userObj = await clan.users.fetch(user.mezon_user_id);
      await userObj.sendDM({ t: fullMsg, embed: [checklistEmbed] }, mentionsArr);
    } catch (err) {
      console.error(`Lỗi gửi DM cho user ${user.name}:`, err);
    }
  }

}

async function remindTomorrowDuty(client) {
  const tomorrowStr = getTomorrowString();
  const jsonPath = path.join(__dirname, '../data/dutylist.json');
  let rows = [];
  try {
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    rows = JSON.parse(fileContent);
  } catch (err) {
    console.error('Lỗi đọc file dutylist.json:', err);
    return;
  }
  const tomorrowRows = rows.filter(d => d.date === tomorrowStr);
  if (!tomorrowRows || tomorrowRows.length === 0) return;
  const header = '#### Nhắc nhở trực nhật ngày mai 📢';
  const footer = '✅ Anh/chị/em nhớ chuẩn bị cho nhiệm vụ trực nhật ngày mai nhé, mình xin nhắc lại các đầu mục công việc dưới đây!';
  let tagLine = '';
  let mentionsArr = [];
  const t = `${header}\n`;
  let offset = t.length;
  tomorrowRows.forEach((r, idx) => {
    const mentionTag = `@${r.name}`;
    const s = offset;
    const e = offset + mentionTag.length;
    tagLine += mentionTag;
    mentionsArr.push({ user_id: r.mezon_user_id, s, e });
    offset = e;
    if (idx < tomorrowRows.length - 1) {
      tagLine += ', ';
      offset += 2;
    }
  });
  const fullMsg = `${header}\n${tagLine}\n${footer}`;
  const channelId = '1829449968461549568';
  const channel = await client.channels.fetch(channelId);
  const checklistEmbed = {
    color: "#3498db",
    title: "🧹 Checklist công việc trực nhật chung",
    description: [
      "```",
      "1. Cho đồ sạch (cốc, chén, bát, đũa, dao kéo) từ MRB ra kệ để",
      "2. Đổ rác và thay túi rác (thùng rác và thùng đồ thừa)",
      "3. Tưới cây (vừa đủ nước)",
      "4. Đổ nước thải từ máy rửa bát vào WC",
      "```"
    ].join('\n'),
    footer: { text: "📝 Bộ phận nhân sự HN1 - Hãy hoàn thành đầy đủ các mục trên!" }
  };
  await channel.send({ t: fullMsg, embed: [checklistEmbed] }, mentionsArr);
  for (const user of tomorrowRows) {
    try {
      const clanid = '1779484504377790464';
      const clan = await client.clans.fetch(clanid);
      const userObj = await clan.users.fetch(user.mezon_user_id);
      await userObj.sendDM({ t: fullMsg, embed: [checklistEmbed] }, mentionsArr);
    } catch (err) {
      console.error(`Lỗi gửi DM cho user ${user.name}:`, err);
    }
  }
}




// Handler nhắc vệ sinh chung
async function remindGeneralCleaning(client) {
  const channelId = process.env.CHANNEL_ID;
  const channel = await client.channels.fetch(channelId);
  const embed = [{
    color: "#e67e22",
    title: "🧹 Tiện thể em xin vài giây nhắc nhở vệ sinh chung cho cả văn phòng ạ!",
    description: [
      '```',
      'Hãy đảm bảo khu vực làm việc và khu vực chung luôn sạch sẽ, gọn gàng!',
      '',
      '• Đổ rác đúng nơi quy định',
      '• Lau dọn khu vực cá nhân',
      '• Sắp xếp bát đũa vào máy rửa bát trước 17h30',
      '• Nhắc nhở đồng nghiệp cùng thực hiện',
      '',
      'Cảm ơn mọi người đã giữ gìn văn phòng sạch đẹp, chúc mọi người có một ngày làm việc phấn khởi!',
      '```'
    ].join('\n'),
    footer: { text: "Bộ phận Nhân sự - Văn phòng HN1" }
  }];
  await channel.send({ t: '', embed });
}

module.exports = { startReminderCron, remindTodayDuty, remindTomorrowDuty, remindGeneralCleaning };

