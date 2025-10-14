
require('dotenv').config();
const express = require('express');

const { MezonClient } = require('mezon-sdk');
const handleList = require("./commands/list");
const handleCrawlData = require("./commands/crawldata");
const handleMyTrucNhat = require("./commands/mytrucnhat");
const handleTodayTrucNhat = require("./commands/todaytrucnhat");
const handleMRB_DONUOCTHAI = require("./commands/mrb_donuocthai");
const handleChecklistVS = require("./commands/checklist_vs");
const handleMRB_DORAC = require("./commands/mrb_dorac");
const handlePhongderac = require("./commands/phongderac");
const handleMRB_SAPXEP = require("./commands/mrb_sapxep");
const handleMRB = require("./commands/mrb");
const handleTrucNhat = require("./commands/trucnhat");
const handleTrucNhatNgay = require("./commands/trucnhatngay");
const handleTrucNhatNgayMai = require("./commands/trucnhat_ngaymai");
const handleTrucNhatHomQua = require("./commands/trucnhat_homqua");
const { startReminderCron } = require('./src/reminder_cron');
const registerHealthApi = require('./api/health');


const PORT = process.env.PORT || 8000;
const BOT_TOKEN = process.env.APPLICATION_TOKEN;
const BOT_ID = process.env.APPLICATION_ID;

(async () => {
  const client = new MezonClient({ botId: BOT_ID, token: BOT_TOKEN });
  await client.login();


  startReminderCron(client);

  
  client.onChannelMessage(async (event) => {
   
    const text = event?.content?.t?.toLowerCase();
    if (!text) return;

    if(text === "*crawldata"){
      return handleCrawlData(client, event);
    }


    if(text === "*trucnhat_ds"){
      return handleList(client, event);
    }

    if(text === "*trucnhat_cuatoi"){
      return handleMyTrucNhat(client, event);
    }

    if(text === "*trucnhat_homnay"){
      return handleTodayTrucNhat(client, event);
    }

    if(text === "*trucnhat_ngaymai"){     
      return handleTrucNhatNgayMai(client, event);
    }

    if(text === "*trucnhat_homqua"){
      return handleTrucNhatHomQua(client, event);
    }

    if(text === "*trucnhat_congviec"){
      return handleChecklistVS(client, event);
    }

    if(text === "*trucnhat"){
      return handleTrucNhat(client, event);
    }

    if(text === "*mrb_donuocthai"){
      return handleMRB_DONUOCTHAI(client, event);
    }

    if(text === "*mrb_dorac"){
      return handleMRB_DORAC(client, event);
    }

    if(text === "*mrb_sapxep"){
      return handleMRB_SAPXEP(client, event);
    }

    if(text === "*mrb"){
      return handleMRB(client, event);
    }

    if(text === "*phongderac"){
      return handlePhongderac(client, event);
    }


    // Lệnh *trucnhatngay_dd/mm/yyyy
    if(/^\*trucnhatngay_\d{2}\/\d{2}\/\d{4}$/.test(text)){
      return handleTrucNhatNgay(client, event);
    }
    

    
});



  // API logic
  const app = express();  
  registerHealthApi(app);
  app.listen(PORT, () => {
    console.log(`🚀 Bot listening on port ${PORT}`);
  });
})();
