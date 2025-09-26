

const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Hằng số chung cho clan/channel
const CLAN_ID = '1779484504377790464';
const CHANNEL_ID = '1829449968461549568';
// Hàm lấy ngày dd/mm/yyyy theo múi giờ VN
function getVNDateString(offset = 0) {
  const now = new Date();
  const vnDate = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
  vnDate.setDate(vnDate.getDate() + offset);
  return `${String(vnDate.getDate()).padStart(2, '0')}/${String(vnDate.getMonth() + 1).padStart(2, '0')}/${vnDate.getFullYear()}`;
}

// Hàm lấy thứ tiếng Việt theo múi giờ VN
function getVNWeekday(offset = 0) {
  const now = new Date();
  const vnDate = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
  vnDate.setDate(vnDate.getDate() + offset);
  return vnDate.toLocaleDateString('vi-VN', { weekday: 'long' });
}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function startReminderCron(client) {
  console.log('🕐 Khởi tạo cron jobs với timezone:', new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'}));
  
  // Cron: Nhắc nhở trực nhật hôm nay:cả DM lẫn user - 7:30 sáng giờ VN
  cron.schedule('30 07 * * *', async () => {
    console.log('🔔 [7:30 SÁNG] Cron chạy lúc:', new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'}));
    try {
      await remindGeneralCleaning(client);
      await sleep(2000);
      await remindTodayDuty(client);
    } catch (err) {
      console.error('Lỗi cronjob nhắc trực nhật:', err);
    }
  }, {
    timezone: "Asia/Ho_Chi_Minh"
  });

  //Cron: nhắc nhở trực nhật lần 2 - 4:30 chiều giờ VN
  cron.schedule('30 16 * * *', async () => {
    console.log('🔔 [4:30 CHIỀU] Cron chạy lúc:', new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'}));
    try {
      await remindTodayDuty(client);
    } catch (err) {
      console.error('Lỗi cronjob nhắc trực nhật chiều:', err);
    }
  }, {
    timezone: "Asia/Ho_Chi_Minh"
  });

  // Cron: nhắc nhở ngày mai - 5:00 chiều giờ VN
  cron.schedule('00 17 * * *', async () => {
    console.log('🔔 [5:00 CHIỀU] Cron chạy lúc:', new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'}));
    try {
      await remindTomorrowDuty(client);
    } catch (err) {
      console.error('Lỗi cronjob nhắc trực nhật ngày mai:', err);
    }
  }, {
    timezone: "Asia/Ho_Chi_Minh"
  });

  cron.schedule('01 17 * * *', async () => {
    console.log('🔔 [5:01 CHIỀU] Cron chạy lúc:', new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'}));
    try {
      await remindThrowGarbage(client);
    } catch (err) {
      console.error('Lỗi cronjob nhắc đổ rác:', err);
    }
  }, {
    timezone: "Asia/Ho_Chi_Minh"
  });

}

// Ví dụ handler nhắc nhở trực nhật hôm nay
async function remindTodayDuty(client) {
  const todayStr = getVNDateString(0);
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
  const header = `#### Nhắc nhở trực nhật hôm nay 📢: ${getVNWeekday(0)}, ${getVNDateString(0)}`;
  const footer = 'Anh/chị/em nhớ hoàn thành nhiệm vụ trực nhật nhé, mình xin nhắc lại các đầu mục công việc dưới đây!';
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
  const channel = await client.channels.fetch(CHANNEL_ID);
  // Embed checklist công việc trực nhật chung
  const checklistEmbed = {
    color: "#3498db",
    title: "🧹 Checklist công việc trực nhật chung",
    description: [
      "```",
      "✅ 1. Cho đồ sạch (cốc, chén, bát, đũa, dao kéo) từ MRB ra kệ để",
      "✅ 2. Đổ rác và thay túi rác (thùng rác và thùng đồ thừa)",
      "✅ 3. Tưới cây (vừa đủ nước)",
      "✅ 4. Đổ nước thải từ máy rửa bát và máy lọc nước vào WC",
      "⚠️ Lưu ý: ACE nhớ đến sớm trước 8h30 sáng để xếp đồ sạch ra khỏi MRB, để mọi người có thể bỏ đồ bẩn vào nhé",
      "```"
    ].join('\n'),
    footer: { text: "📝 Bộ phận nhân sự HN1 - Hãy hoàn thành đầy đủ các mục trên!" }
  };
  await channel.send({ t: fullMsg, embed: [checklistEmbed] }, mentionsArr);

 
  for (const user of todayRows) {
    try {
      const clan = await client.clans.fetch(CLAN_ID);
      const userObj = await clan.users.fetch(user.mezon_user_id);
      await userObj.sendDM({ t: fullMsg, embed: [checklistEmbed] }, mentionsArr);
    } catch (err) {
      console.error(`Lỗi gửi DM cho user ${user.name}:`, err);
    }
  }

}

async function remindTomorrowDuty(client) {
  const tomorrowStr = getVNDateString(1);
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
  const header = `#### Nhắc nhở trực nhật ngày mai 📢: ${getVNWeekday(1)}, ${getVNDateString(1)}`;
  const footer = 'Anh/chị/em nhớ chuẩn bị cho nhiệm vụ trực nhật ngày mai nhé, mình xin nhắc lại các đầu mục công việc dưới đây!';
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
  const channel = await client.channels.fetch(CHANNEL_ID);
  const checklistEmbed = {
    color: "#3498db",
    title: "🧹 Checklist công việc trực nhật chung",
    description: [
      "```",
      "✅ 1. Cho đồ sạch (cốc, chén, bát, đũa, dao kéo) từ MRB ra kệ để",
      "✅ 2. Đổ rác và thay túi rác (thùng rác và thùng đồ thừa)",
      "✅ 3. Tưới cây (vừa đủ nước)",
      "✅ 4. Đổ nước thải từ máy rửa bát và máy lọc nước vào WC",
      "⚠️ Lưu ý: ACE nhớ đến sớm trước 8h sáng để xếp đồ sạch ra khỏi MRB, để mọi người có thể bỏ đồ bẩn vào nhé",
      "```"
    ].join('\n'),
    footer: { text: "📝 Bộ phận nhân sự HN1 - Hãy hoàn thành đầy đủ các mục trên!" }
  };
  await channel.send({ t: fullMsg, embed: [checklistEmbed] }, mentionsArr);
  for (const user of tomorrowRows) {
    try {
      const clan = await client.clans.fetch(CLAN_ID);
      const userObj = await clan.users.fetch(user.mezon_user_id);
      await userObj.sendDM({ t: fullMsg, embed: [checklistEmbed] }, mentionsArr);
    } catch (err) {
      console.error(`Lỗi gửi DM cho user ${user.name}:`, err);
    }
  }
}




// Handler nhắc vệ sinh chung
async function remindGeneralCleaning(client) {
  const channel = await client.channels.fetch(CHANNEL_ID);
  const embed = [{
    color: "#e67e22",
    title: "Hãy đảm bảo khu vực làm việc và khu vực chung luôn sạch sẽ, gọn gàng!",
    description: [
      '```',
      '✅ Đổ rác đúng nơi quy định',
      '✅ Lau dọn khu vực cá nhân',
      '✅ Sắp xếp bát đũa vào máy rửa bát trước 17h30',
      '✅ Nhắc nhở đồng nghiệp cùng thực hiện',
      '',
      'Cảm ơn mọi người đã giữ gìn văn phòng sạch đẹp, chúc mọi người có một ngày mới làm việc phấn khởi!',
      '```'
    ].join('\n'),
    footer: { text: "Bộ phận Nhân sự - Văn phòng HN1" }
  }];
  await channel.send({ t: '@HANOI1 🧹 Chào buổi sáng văn phòng HN1 ạ, em xin vài giây nhắc nhở vệ sinh chung ạ!', embed }, [{ role_id: "1832751219488067584", s: 0, e: 7 }] );
}


async function remindThrowGarbage(client) {
  const channel = await client.channels.fetch(CHANNEL_ID);
  const embed = [{
    color: "#c3053bff",
    title: "Cả nhà ai còn rác thừa thì đổ vào thùng để ban trực nhật dọn nhé; Ai còn cốc chén thừa mà không dùng nữa thì cho vào máy rửa bát luôn ạ!",
    image: {
      // url: "https://cdn.mezon.ai/1969101240251977728/1971006617226842112/1940048388468772900/1758823251378_dragged_drag.gif"
      url: "https://cdn.mezon.ai/1969101240251977728/1969101240306503680/1940048388468772900/1758820742467_computer_monday.gif"
    },
    footer: { text: "Bộ phận Nhân sự - Văn phòng HN1" }
  }];
  await channel.send({ t: '@HANOI1 LOA LOA LOA, CẢ NHÀ ƠI!!! ĐÃ ĐẾN GIỜ ĐỔ RÁC, KHỞI ĐỘNG MÁY RỬA BÁT!', embed }, [{ role_id: "1832751219488067584", s: 0, e: 7 }] );
}

module.exports = { startReminderCron, remindTodayDuty, remindTomorrowDuty, remindGeneralCleaning, remindThrowGarbage };

