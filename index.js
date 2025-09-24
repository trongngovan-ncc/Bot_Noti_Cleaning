

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
const { startReminderCron } = require('./src/reminder_cron');
const registerHealthApi = require('./api/health');


const PORT = process.env.PORT || 8000;
const APP_TOKEN = process.env.APPLICATION_TOKEN;


(async () => {
  const client = new MezonClient(APP_TOKEN);
  await client.login();


  startReminderCron(client);

  
  client.onChannelMessage(async (event) => {
    const text = event?.content?.t?.toLowerCase();
    if (!text) return;

    if(text.startsWith("*crawldata")){
      return handleCrawlData(client, event);
    }


    if(text.startsWith("*trucnhat_ds")){
      return handleList(client, event);
    }

    if(text.startsWith("*trucnhat_cuatoi")){
      return handleMyTrucNhat(client, event);
    }

    if(text.startsWith("*trucnhat_homnay")){
      return handleTodayTrucNhat(client, event);
    }

    if(text.startsWith("*trucnhat_congviec")){
      return handleChecklistVS(client, event);
    }

    if(text.startsWith("*trucnhat")){
      return handleTrucNhat(client, event);
    }

    if(text.startsWith("*mrb_donuocthai")){
      return handleMRB_DONUOCTHAI(client, event);
    }

    if(text.startsWith("*mrb_dorac")){
      return handleMRB_DORAC(client, event);
    }

    if(text.startsWith("*mrb_sapxep")){
      return handleMRB_SAPXEP(client, event);
    }

    if(text.startsWith("*mrb")){
      return handleMRB(client, event);
    }

    if(text.startsWith("*phongderac")){
      return handlePhongderac(client, event);
    }
    

    
});



  // API logic
  const app = express();  
  registerHealthApi(app);
  app.listen(PORT, () => {
    console.log(`🚀 Bot listening on port ${PORT}`);
  });
})();
