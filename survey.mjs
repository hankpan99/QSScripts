export default {
  surveyId: "6a1c8e361c2a428a11fa50f5",
  questions: [
    // ---------- 問卷說明頁 ----------
    {
      type: "text",
      content: `
<h2 style="background-color: #FFF8E1; font-size: 28px;">您的烹飪經驗、偏好、與需求</h2>
<p style="font-size: 20px;">您好，我們是國立陽明交通大學資訊工程學系「人本智慧系統實驗室」。目前正在進行一項關於「備餐情境中使用者對智慧助手的需求與偏好」的研究，誠摯邀請您參與。</p>
<p style="font-size: 20px;"><strong>【實驗流程說明】</strong></p>
<p style="font-size: 20px;">本實驗採「問卷」結合「半結構式訪談」的方式進行。您將填寫一份關於備餐情境中對智慧助手需求與偏好的問卷；在填答過程中，我們會同步進行訪談，以深入了解您的想法與作答原因。</p>
<p style="font-size: 20px;">實驗全程約 45 至 60 分鐘，問卷共分為四個大題：</p>
<ul style="font-size: 20px;">
	<li>第一大題：您的烹飪習慣與經驗（共 5 小題）</li>
	<li>第二大題：情境體驗與想法（共 3 小題）</li>
	<li>第三大題：智慧助手設計遊戲</li>
	<li>第四大題：基本資料（共 4 小題）</li>
</ul>
<p style="font-size: 20px;"><strong>【研究報酬】</strong></p>
<p style="font-size: 20px;">完成本研究的參與者，皆可獲得價值新臺幣 250 元的 7-11 禮券。參與本研究為自願性質，您可於任何時間中止，且不會對您產生任何不利影響。</p>
<p style="font-size: 20px;"><strong>【聯絡方式】</strong></p>
<p style="font-size: 20px;">若您對本研究有任何疑問，歡迎當面提出，或來信與我們聯繫。</p>
<ul style="font-size: 20px;">
	<li>研究計畫聯絡人：潘翰（hankpan99.cs12[at]nycu.edu.tw）</li>
	<li>研究計畫主持人：陳奕廷（ychen[at]cs.nctu.edu.tw）</li>
</ul>
`,
      newPage: true,
    },
    {
      type: "single",
      question: "若您同意參與，請勾選以下選項並前往下一頁：",
      description: "",
      options: ["我已詳閱本問卷說明，並同意參加。"],
    },


    // ---------- 第一大題 ----------
    {
      type: "text",
      content: `
<h2 style="background-color: #FFF8E1; font-size: 28px;">第一大題：您的烹飪習慣、經驗（共5小題）</h2>
<p style="font-size: 20px">根據您的烹飪習慣、經驗，請回答以下問題</p>
`,
      newPage: true,
    },
    {
      type: "single",
      question: "1. 請問您一週大約有幾次，會用生鮮食材自己下廚做正餐？（單選）",
      description: "（指從處理生肉、洗切蔬菜等食材開始，製作燉肉、咖哩飯、或熱炒等料理；不包含只需加熱的調理包或微波食品）",
      options: ["從不", "少於每週一次", "每週一次", "每週 2-3 次", "每週 4-6 次", "每天"],
    },
    {
      type: "multi",
      question: "2. 請勾選您經常使用的廚房電器：（可複選）",
      description: "",
      minSelections: 1,
      options: ["瓦斯爐 / IH爐 / 電磁爐", "烤箱", "微波爐", "電鍋", "氣炸鍋", "多功能料理機 / 萬用電子鍋"],
    },
    {
      type: "single",
      question: "3. 平常的烹飪過程，主要都是：（單選）",
      description: "",
      options: ["由自己單獨完成", "與助手共同完成", "擔任助手與他人共同完成"],
    },
    {
      type: "textinput",
      question: "4. 請列舉三樣您最常烹飪的料理或餐點：（簡答題）",
      description: "內容可以是：一頓完整的餐點（如：咖哩飯）、一道單獨的菜色（如：番茄炒蛋）、簡單的食材組合（如：泡麵加蛋和青菜），但不包含只需加熱的調理包或微波食品。請使用分號分隔您的答案：Ex. 咖哩飯；番茄炒蛋；泡麵加蛋和青菜",
      multiline: true,
      maxLength: 500,
    },
    {
      type: "likert",
      question: "5. 整體而言，您對於「烹飪」這件事的享受程度為何？（單選）",
      description: "",
      points: 6,
      minLabel: "非常不同意",
      maxLabel: "非常同意",
    },


    // ---------- 第二大題 ----------
    {
      type: "text",
      content: `
<h2 style="background-color: #FFF8E1; font-size: 28px;">第二大題：情境體驗與想法（共3小題）</h2>
<p style="font-size: 20px;">想像今天有幾位國外友人即將來訪，您被賦予了一個任務：要在晚上親自下廚，準備一頓豐盛的晚餐來招待他們。</p>
<ul>
  <li style="font-size: 20px;"><strong>目標：</strong>完成一套包含主食（麵或飯）、<span style="color:red">三道菜色</span>、以及甜點的豪華套餐。</li>
  <li style="font-size: 20px;"><strong>挑戰：</strong>為了展現熱情與誠意，並推廣台灣美食特色，您決定在菜單中加入幾道您平時不常製作、或工序較為繁複的「功夫菜」，而不僅僅是端出您已熟練的家常料理。</li>
  <li style="font-size: 20px;"><strong>資源：</strong>您有半天的時間可以進行菜單規劃、備料以及烹飪。</li>
</ul>
<p style="font-size: 20px;">請想像您置身於上述情境中，並依照您的直覺回答下列問題。</p>
`,
      newPage: true,
    },
    {
      type: "text",
      content: `<h2 style="background-color: #EEF2FF; font-size: 26px;">一、您對於完成這項挑戰的把握度</h2>`,
      newPage: false,
    },
    {
      type: "single",
      question: "1. 根據上述「含有功夫菜餐點的」情境，請選出最符合您狀況的敘述：（單選）",
      description: "(以下選項由「依賴程度高、執行較吃力」到「完全不依賴、游刃有餘的執行」排列，請選擇整體上最符合您狀況的描述)",
      options: [
        "我必須全程緊盯食譜與教學影片、逐步跟著操作，但仍感到非常吃力，沒把握能在半天內順利完成這套餐點",
        "我必須全程緊盯食譜與教學影片才能完成，但過程中容易手忙腳亂，成品的風味或外觀與預期有明顯落差",
        "我需要事前參考食譜與教學影片，烹飪過程中需停下來回顧食譜與教學影片，能穩定完成整套餐點，成品大致符合預期，但調味、口感或擺盤等細節仍有落差",
        "我需要事前參考食譜與教學影片，烹飪過程不需停下來，只需偶爾快速瞄一眼食譜或教學影片，就能精準重現菜單中各道菜的風味與外觀",
        "我只需要事前瀏覽食譜或影片確認作法，即使面對較不熟悉的功夫菜，實際烹飪時也完全不需查閱指引，就能流暢執行整套餐點的所有步驟，精準重現每道菜的風味與外觀",
        "我不需要依賴食譜或影片，能憑藉過去累積的烹飪知識與經驗，獨立設計出包含功夫菜的整套菜單，並游刃有餘地完成烹飪，完美呈現心中預期的風味與外觀",
      ],
    },
    {
      type: "text",
      content: `<h2 style="background-color: #EEF2FF; font-size: 26px;">二、您的烹飪風格與偏好</h2>`,
      newPage: false,
    },
    {
      type: "likert",
      question: "1. 即使照著食譜或教學影片的步驟能更有效率，我仍會依照自己習慣的節奏與方式來烹飪這頓餐點",
      description: "（根據上述「含有功夫菜餐點的」情境，請評估您對此敘述的同意程度）",
      points: 6,
      minLabel: "非常不同意",
      maxLabel: "非常同意",
    },
    {
      type: "likert",
      question: "2. 假如烹飪的過程中有助手參與，對於每一個環節（例如：食材拿取與挑選、備料、烹煮與測試，及備餐環境整理）我都會要求助手完全遵照我的指示，且每個步驟我都需要「親自確認」他接下來的動作與「親自把關」每個步驟的成果",
      description: "（根據上述「含有功夫菜餐點的」情境，請評估您對此敘述的同意程度）",
      points: 6,
      minLabel: "非常不同意",
      maxLabel: "非常同意",
    },


    // ---------- 第三大題 ----------
    {
      type: "text",
      content: `
<h2 style="background-color: #FFF8E1; font-size: 28px;">第三大題：智慧助手設計遊戲</h2>
<p style="font-size: 20px;">請先觀看以下影片再開始遊戲</p>
<iframe style="display:block; width:900px; max-width:100%; aspect-ratio:16/9; margin:1.5em auto; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); border:0;" src="https://drive.google.com/file/d/1MfAPK2fSx_fZcA5Jgwmutbh4fbGst-Xs/preview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
`,
      newPage: true,
    },
    {
      type: "qvplus",
      question: "在烹飪過程中，哪些動作您會希望有智慧助手幫忙？",
      description: "...",
      setting: {
        totalCredits: 187,
        version: 1,
        questionType: "qvplus",
        sampleOption: 0,
        showInstructions: false,
        labelOverrides: {
          votePositive: "票 介入",
          voteNegative: "票 不介入",
          voteNone: "未投票",
          sortByVotes: "依票數排序",
          leanPrefix: "傾向",
          binLabels: {
            Positive: "介入(語音/實體)",
            Neutral: "沒意見",
            Negative: "不介入(獨立完成)",
            Undecided: "尚未決定",
            Skip: "我不知道",
          },
        },
        rounds: [
          {
            roundId: "round-1",
            voteTitle: "情境一：日常烹飪情境中，您希望與智慧助手的「協作模式」是什麼？",
            voteDescription: `
### 烹飪過程通常可以分為三個階段：

1. **備料**：開火前的準備（例如：拿、洗、切、削食材）
2. **烹調**：開火加熱（例如：蒸、炒、煎、炸）
3. **清潔**：清潔與整理（例如：擦、刷、洗碗盤）

### 接下來有 13 個烹飪動作，想請您依照下廚的習慣與偏好投票，越多票表示越堅持：

- 🦾 **傾向助手「介入」**：想要語音提醒、教學，或實體動作上的幫助
- 🙅 **傾向助手「不介入」**：希望能自己獨立完成，不受助手打擾

### <span style="color:red">⚠️ 您可以將票數全部投給「介入」或「不介入」，也可以同時分配給兩者；請依照您希望的協作模式進行投票</span> <br><br>
`,
            selectionTitle: "情境一：日常烹飪情境中，您希望智慧助手「多主動」？",
            selectionDescription: `
### 助手介入可分為兩種形式：

1. **語音**：助手透過對話提醒步驟或教學（仍然是您親手做動作）
2. **實體**：助手實際動手做動作

### 針對剛才投票「助手介入」的動作，請選擇您希望的主動程度：

1. ✋ **被動等待**：您下指令它才語音提醒、或是實體介入
2. 🔈 **語音提醒**：偵測到需求時，主動出聲建議或提醒
3. ❓ **詢問後實體介入**：偵測到需求時先問「需要幫忙嗎？」，您同意才動手
4. ⚡ **直接實體介入**：偵測到需求時直接動手，不必等待您同意 <br><br>
`,
            requiredVoteFilter: "upvote",
            followupQuestions: [
              {
                followupId: "fu-1",
                prompt: "希望的主動程度",
                choices: [
                  { choiceId: "c-1a", label: "✋ 被動等待" },
                  { choiceId: "c-1b", label: "🔈 語音提醒" },
                  { choiceId: "c-1c", label: "❓ 詢問後實體介入" },
                  { choiceId: "c-1d", label: "⚡ 直接實體介入" },
                ],
              },
            ],
          },
          {
            roundId: "round-2",
            voteTitle: "情境二：時間有限的烹飪情境中，您對於「協作模式」的偏好是否有改變？",
            voteDescription: `
### 想像以下情境：

您今天忙了一整天，回到家又累又餓<br>
而晚餐後還有事情等著您（可能是要陪小孩、趕作業，或單純想早點休息）<br>
您只想在<span style="color:red">**一小時**</span>內把飯煮好、收拾乾淨

### 接下來有 13 個烹飪動作，想請您依照下廚的習慣與偏好投票，越多票表示越堅持：

- 🦾 **傾向助手介入**：想要語音提醒、教學，或實體動作上的幫助
- 🙅 **傾向助手不要介入**：希望能自己獨立完成，不受助手打擾

### <span style="color:red">⚠️ 您可以將票數全部投給「介入」或「不介入」，也可以同時分配給兩者；請依照您希望的協作模式進行投票</span>

### ⚠️ 下方已帶入您情境一的答案，如果哪些動作的想法變了，請直接修改它們就好，其他可以放著不修改<br><br>
`,
            selectionTitle: "情境二：時間有限的烹飪情境中，您對於「多主動」的偏好是否有改變？",
            selectionDescription: `
### 想像以下情境：

您今天忙了一整天，回到家又累又餓<br>
而晚餐後還有事情等著您（可能是要陪小孩、趕作業，或單純想早點休息）<br>
您只想在<span style="color:red">**一小時**</span>內把飯煮好、收拾乾淨

### 助手介入可分為兩種形式：

1. **語音**：助手透過對話提醒步驟或教學（仍然是您親手做動作）
2. **實體**：助手實際動手做動作

### 針對剛才投票「助手介入」的動作，請選擇您希望的主動程度：

1. ✋ **被動等待**：您下指令它才語音提醒、或是實體介入
2. 🔈 **語音提醒**：偵測到需求時，主動出聲建議或提醒
3. ❓ **詢問後實體介入**：偵測到需求時先問「需要幫忙嗎？」，您同意才動手
4. ⚡ **直接實體介入**：偵測到需求時直接動手，不必等待您同意 <br><br>
`,
            requiredVoteFilter: "upvote",
            followupQuestions: [
              {
                followupId: "fu-2",
                prompt: "希望的主動程度",
                choices: [
                  { choiceId: "c-2a", label: "✋ 被動等待" },
                  { choiceId: "c-2b", label: "🔈 語音提醒" },
                  { choiceId: "c-2c", label: "❓ 詢問後實體介入" },
                  { choiceId: "c-2d", label: "⚡ 直接實體介入" },
                ],
              },
            ],
          },
        ],
      },
      options: [
        {
          optionId: "opt-1",
          optionName: "拿",
          description: "拿起 / 取出（餐具廚具、食材、雜物），舀（食材、液體、粉末）",
        },
        {
          optionId: "opt-2",
          optionName: "放 / 掛",
          description: "放下 / 放進（餐具、食材、雜物），掛（抹布、雜物）",
        },
        {
          optionId: "opt-3",
          optionName: "移位 / 移動",
          description: "移位 / 歸位（餐具、家電、椅子），移動（食材）",
        },
        {
          optionId: "opt-4",
          optionName: "分切 / 分開",
          description: "切 / 削 / 磨 / 搗，掰 / 撕 / 打 / 撥 / 剝 （掰開撕開、打蛋、撥散、剝皮），瀝乾 / 過濾（食材、餐具廚具）",
        },
        {
          optionId: "opt-5",
          optionName: "加入 / 混合",
          description: "倒入 / 加入（水、油、醬料、食材下鍋），混合 / 攪拌 / 沾 / 醃 （食材、醬料、醃料）",
        },
        {
          optionId: "opt-6",
          optionName: "處理",
          description: "搖晃 / 擠 / 按壓（食材、瓶罐），翻面 / 翻動 / 揉（食材、麵團）",
        },
        {
          optionId: "opt-7",
          optionName: "塗 / 撒",
          description: "塗抹（奶油、醬料）、撒（調味料、麵粉、起司）",
        },
        {
          optionId: "opt-8",
          optionName: "打開 / 拆封",
          description: "打開（櫃子抽屜、冰箱、蓋子罐子），開啟（水龍頭、開關、家電），拆開/拆封（食材包裝、袋子）",
        },
        {
          optionId: "opt-9",
          optionName: "關上 / 密封",
          description: "關上（櫃子抽屜、冰箱、蓋子罐子），關閉（水龍頭、開關、家電），包裝 / 密封（食材、袋子）",
        },
        {
          optionId: "opt-10",
          optionName: "清潔",
          description: "清洗（餐具廚具、食材、水槽），擦拭（檯面、地面、爐台），丟（垃圾、廚餘），倒掉（容器內的東西、液體）",
        },
        {
          optionId: "opt-11",
          optionName: "整理",
          description: "折疊（抹布、麵團），排列 / 擺盤（餐具廚具、食材）",
        },
        {
          optionId: "opt-12",
          optionName: "監控",
          description: "調整（火候、溫度、水龍頭），檢查 / 查看（食譜、時間、溫度、食材狀態），尋找、量測（份量）",
        },
        {
          optionId: "opt-13",
          optionName: "感測",
          description: "摸 / 吃 / 喝 / 聞",
        },
      ],
    },


    // ---------- 第四大題 ----------
    {
      type: "text",
      content: `<h2 style="background-color: #EEF2FF; font-size: 26px;">第四大題：基本資料（共4小題）</h2>`,
      newPage: true,
    },
    {
      type: "single",
      question: "1. 請問您的性別認同？（單選）",
      description: "",
      options: ["男性", "女性", "其他", "不願透露"],
    },
    {
      type: "single",
      question: "2. 請問您的年齡區間？（單選）",
      description: "",
      options: ["18 - 24歲", "25 - 34歲", "35 - 44歲", "45 - 54歲", "55 - 64歲", "65歲以上"],
    },
    {
      type: "single",
      question: "3. 請問您在日常生活中，通常會為幾位「成人（18 歲以上）」準備餐食？（單選）",
      description: "",
      options: ["1 - 2位", "3 - 4位", "5位以上"],
    },
    {
      type: "single",
      question: "4. 請問您在日常生活中，通常會為幾位「孩童（18 歲以下）」準備餐食？（單選）",
      description: "",
      options: ["1 - 2位", "3 - 4位", "5位以上"],
    },


    // ---------- 參與者招募 ----------
    {
      type: "text",
      content:`
<h2 style="background-color: #FFF8E1; font-size: 28px;">實體實驗參與者招募</h2>
<p style="font-size: 20px;">非常感謝您今天撥空參與問卷訪談！
<p style="font-size: 20px;">基於今天的訪談結果，我們將進一步邀請 20 位受訪者來到學校，參與<strong>實體烹飪實驗</strong>。</p>
<p style="font-size: 20px;"><strong>【實驗內容】</strong></p>
<p style="font-size: 20px;">整體實驗約 60–90 分鐘，您將完成數項備餐情境任務，體驗與助手協作的人機互動方式。</p>
<p style="font-size: 20px;">【時間與地點】</p>
<p style="font-size: 20px;">國立陽明交通大學光復校區 工程四館 305 教室，預計七月下旬開始。</p>
<p style="font-size: 20px;"><strong>【研究報酬】</strong></p>
<p style="font-size: 20px;">完成者可獲得<strong>價值新臺幣 500 元 7-11 禮券</strong>。新竹市以外地區的參與者，另提供<strong>價值新臺幣 500 元 7-11 禮券</strong>作為車馬費補助。</p>      
`,
      newPage: true
    },
    {
      type: "single",
      question: "若您有興趣參與，請勾選「有興趣參與」，我們將再透過email和您聯絡：",
      description: "",
      required: false,
      options: ["有興趣參與", "暫不參與"],
    },
  ],
};
