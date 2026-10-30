/* ==================================================
   台灣保育類動物探查
   p5.js 遊戲程式
   背景：#A8DADC
   每答對一題，解鎖動物圖片的四分之一
   ================================================== */

const BG = "#A8DADC";

const animalNames = [
  "台灣黑熊",
  "石虎",
  "櫻花鉤吻鮭",
  "台灣山椒魚"
];

// 請將四張圖片放在 images 資料夾，檔名需完全一致
const IMAGE_PATHS = [
  "images/台灣黑熊.jpg",
  "images/石虎.jpg",
  "images/櫻花鉤吻鮭.jpg",
  "images/台灣山椒魚.jpg"
];

let gameState = "start";
let selectedAnimal = 0;
let questionIndex = 0;

let unlockedPieces = [0, 0, 0, 0];
let answeredCorrectly = false;
let selectedAnswer = -1;
let showWrongAnswer = false;
let completedAnimals = [false, false, false, false];

let animalImages = [];

// ============================================
// 題目資料：每種動物四道題目
// ============================================

const questions = [
  // 台灣黑熊
  [
    {
      type: "圖文配對題",
      title: "猜猜我是誰？",
      description: "胸前有白色V字形記號的動物是誰？",
      options: ["石虎", "台灣黑熊", "台灣山椒魚", "櫻花鉤吻鮭"],
      answer: 1,
      explain: "答對了！台灣黑熊胸前有明顯的白色V字形斑紋！"
    },
    {
      type: "四選一選擇題",
      title: "台灣黑熊喜歡吃什麼？",
      description: "請選出正確答案！",
      options: ["水果和昆蟲", "只有青草", "只有魚", "只有糖果"],
      answer: 0,
      explain: "太棒了！台灣黑熊是雜食性動物，會吃水果、昆蟲等食物。"
    },
    {
      type: "四選一選擇題",
      title: "台灣黑熊主要住在哪裡？",
      description: "請幫黑熊找到牠的家！",
      options: ["海洋", "沙漠", "森林", "城市大樓"],
      answer: 2,
      explain: "正確！台灣黑熊主要生活在台灣的森林山區。"
    },
    {
      type: "四選一選擇題",
      title: "我們應該如何保護黑熊？",
      description: "哪個方法最好呢？",
      options: ["破壞森林", "隨意餵食", "追逐黑熊", "保護森林、不亂丟垃圾"],
      answer: 3,
      explain: "答對了！保護森林和維護環境，就是保護黑熊！"
    }
  ],

  // 石虎
  [
    {
      type: "圖文配對題",
      title: "猜猜我是誰？",
      description: "身上有黑褐色斑點，長得像小貓的動物是誰？",
      options: ["台灣黑熊", "石虎", "台灣山椒魚", "櫻花鉤吻鮭"],
      answer: 1,
      explain: "答對了！石虎身上有漂亮的黑褐色斑點！"
    },
    {
      type: "四選一選擇題",
      title: "石虎通常什麼時候活動？",
      description: "請選出正確答案！",
      options: ["只有中午", "只有早上", "夜晚和黃昏", "完全不活動"],
      answer: 2,
      explain: "正確！石虎主要在夜晚活動，白天常躲起來休息。"
    },
    {
      type: "四選一選擇題",
      title: "石虎喜歡吃什麼？",
      description: "幫石虎選出食物！",
      options: ["老鼠和小動物", "樹葉", "石頭", "花朵"],
      answer: 0,
      explain: "答對了！石虎是肉食性動物，會捕捉老鼠等小動物。"
    },
    {
      type: "四選一選擇題",
      title: "我們可以如何保護石虎？",
      description: "哪個行動最適合？",
      options: ["隨意捕捉", "破壞草地", "亂丟垃圾", "保護淺山環境，注意行車安全"],
      answer: 3,
      explain: "太棒了！保護石虎的棲地，也要留意道路上的石虎。"
    }
  ],

  // 櫻花鉤吻鮭
  [
    {
      type: "圖文配對題",
      title: "猜猜我是誰？",
      description: "生活在台灣高山溪流中的魚是誰？",
      options: ["台灣黑熊", "石虎", "櫻花鉤吻鮭", "台灣山椒魚"],
      answer: 2,
      explain: "答對了！牠就是珍貴的櫻花鉤吻鮭！"
    },
    {
      type: "四選一選擇題",
      title: "櫻花鉤吻鮭喜歡住在哪裡？",
      description: "請選出牠最喜歡的環境！",
      options: ["溫暖的沙漠", "清涼乾淨的溪流", "鹹鹹的大海", "游泳池"],
      answer: 1,
      explain: "正確！櫻花鉤吻鮭喜歡清涼、乾淨的高山溪流。"
    },
    {
      type: "四選一選擇題",
      title: "櫻花鉤吻鮭吃什麼？",
      description: "牠是魚，喜歡吃哪一種食物？",
      options: ["蛋糕", "青草", "糖果", "水生昆蟲"],
      answer: 3,
      explain: "答對了！櫻花鉤吻鮭會吃水生昆蟲等小動物。"
    },
    {
      type: "四選一選擇題",
      title: "如何保護櫻花鉤吻鮭？",
      description: "哪一種行為是正確的？",
      options: ["保持溪流乾淨", "往溪流倒垃圾", "隨意抓魚", "污染溪水"],
      answer: 0,
      explain: "完全正確！保持溪水乾淨，才能守護櫻花鉤吻鮭！"
    }
  ],

  // 台灣山椒魚
  [
    {
      type: "圖文配對題",
      title: "猜猜我是誰？",
      description: "身體細長，喜歡躲在石頭和腐木下的動物是誰？",
      options: ["台灣黑熊", "石虎", "櫻花鉤吻鮭", "台灣山椒魚"],
      answer: 3,
      explain: "答對了！這就是生活在台灣高山的山椒魚！"
    },
    {
      type: "四選一選擇題",
      title: "台灣山椒魚喜歡住在哪裡？",
      description: "幫牠找到舒適的家！",
      options: ["炎熱沙漠", "潮濕陰涼的高山環境", "城市馬路", "乾燥的海灘"],
      answer: 1,
      explain: "答對了！台灣山椒魚喜歡陰涼、潮濕的高山環境。"
    },
    {
      type: "四選一選擇題",
      title: "台灣山椒魚喜歡吃什麼？",
      description: "請選出牠的食物！",
      options: ["糖果", "水果", "蚯蚓和小昆蟲", "麵包"],
      answer: 2,
      explain: "正確！山椒魚會吃蚯蚓及小型無脊椎動物。"
    },
    {
      type: "四選一選擇題",
      title: "我們應該怎麼保護山椒魚？",
      description: "選出最好的保育方法！",
      options: ["踩踏牠的生活環境", "把牠帶回家", "翻開石頭抓牠", "保持高山環境乾淨，不打擾牠"],
      answer: 3,
      explain: "太棒了！不打擾山椒魚，才能讓牠安心生活！"
    }
  ]
];

// ============================================
// 載入四張動物圖片
// ============================================

function preload() {
  for (let i = 0; i < IMAGE_PATHS.length; i++) {
    animalImages[i] = loadImage(
      IMAGE_PATHS[i],
      () => console.log("圖片載入成功：" + IMAGE_PATHS[i]),
      () => console.error("圖片載入失敗，請檢查路徑：" + IMAGE_PATHS[i])
    );
  }
}

// ============================================
// 初始化畫布
// ============================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Microsoft JhengHei, sans-serif");
  textAlign(CENTER, CENTER);
}

// ============================================
// 遊戲主畫面
// ============================================

function draw() {
  background(BG);

  if (gameState === "start") drawStartScreen();
  if (gameState === "menu") drawAnimalMenu();
  if (gameState === "quiz") drawQuizScreen();
  if (gameState === "complete") drawCompleteScreen();
}

// ============================================
// 顯示完整動物圖片（等比例）
// ============================================

function showAnimalImage(index, x, y, w, h) {
  const img = animalImages[index];

  if (!img || !img.width || !img.height) {
    fill("#457B9D");
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    text("圖片載入中", x, y, w, h);
    return;
  }

  const scale = min(w / img.width, h / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;

  imageMode(CORNER);
  image(
    img,
    x + (w - drawW) / 2,
    y + (h - drawH) / 2,
    drawW,
    drawH
  );
}

// ============================================
// 拼圖圖片：答對一題解鎖圖片的四分之一
// 解鎖順序：左上、右上、左下、右下
// ============================================

function drawPuzzleImage(index, x, y, w, h) {
  const img = animalImages[index];

  const pieceW = w / 2;
  const pieceH = h / 2;

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = floor(i / 2);

    const px = x + col * pieceW;
    const py = y + row * pieceH;

    // 尚未解鎖的拼圖區塊
    if (i >= unlockedPieces[index]) {
      fill("#D8E2DC");
      stroke("#457B9D");
      strokeWeight(2);
      rect(px, py, pieceW, pieceH);

      fill("#457B9D");
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(14);
      text("尚未解鎖", px, py, pieceW, pieceH);
    } else if (img && img.width > 0 && img.height > 0) {
      // 已解鎖：顯示原圖對應的四分之一
      const sourceW = img.width / 2;
      const sourceH = img.height / 2;

      const sourceX = col * sourceW;
      const sourceY = row * sourceH;

      imageMode(CORNER);
      image(
        img,
        px,
        py,
        pieceW,
        pieceH,
        sourceX,
        sourceY,
        sourceW,
        sourceH
      );

      noFill();
      stroke("#457B9D");
      strokeWeight(2);
      rect(px, py, pieceW, pieceH);
    } else {
      fill("#D8E2DC");
      stroke("#457B9D");
      rect(px, py, pieceW, pieceH);
    }
  }

  noStroke();
}

// ============================================
// 共用標題
// ============================================

function drawTitle(title, y = 48) {
  fill("#1D3557");
  noStroke();
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(min(34, width * 0.035));
  text(title, 20, y - 30, width - 40, 60);
  textStyle(NORMAL);
}

// ============================================
// 共用按鈕
// ============================================

function drawButton(x, y, w, h, label, colorValue, textColor = "#1D3557") {
  noStroke();
  fill(colorValue);
  rect(x, y, w, h, 13);

  fill(textColor);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(min(19, h * 0.32));
  text(label, x + 8, y + 4, w - 16, h - 8);
  textStyle(NORMAL);
}

// ============================================
// 判斷滑鼠是否點擊指定範圍
// ============================================

function pointInRect(px, py, x, y, w, h) {
  return px >= x && px <= x + w && py >= y && py <= y + h;
}

// ============================================
// 開始畫面
// ============================================

function drawStartScreen() {
  drawTitle("台灣保育類動物探查", height * 0.20);

  fill("#285943");
  textAlign(CENTER, CENTER);
  textSize(min(22, width * 0.025));
  text(
    "認識四種台灣珍貴的保育動物！",
    20,
    height * 0.34 - 25,
    width - 40,
    50
  );

  const cardW = min(width * 0.18, 190);
  const cardH = cardW * 0.82;
  const gap = 18;
  const totalW = cardW * 4 + gap * 3;
  const startX = (width - totalW) / 2;

  for (let i = 0; i < 4; i++) {
    const x = startX + i * (cardW + gap);

    fill("#F1FAEE");
    noStroke();
    rect(x, height * 0.43, cardW, cardH, 16);

    showAnimalImage(
      i,
      x + 10,
      height * 0.43 + 8,
      cardW - 20,
      cardH - 16
    );

    fill("#1D3557");
    textSize(16);
    text(
      animalNames[i],
      x,
      height * 0.43 + cardH + 5,
      cardW,
      30
    );
  }

  drawButton(
    width / 2 - 125,
    height * 0.78,
    250,
    62,
    "進入動物選擇",
    "#F4A261"
  );
}

// ============================================
// 動物選擇畫面
// ============================================

function drawAnimalMenu() {
  drawTitle("請選擇想挑戰的動物", 48);

  fill("#285943");
  textAlign(CENTER, CENTER);
  textSize(17);
  text(
    "可以自由選擇順序，每種動物有四道題目",
    20,
    83,
    width - 40,
    50
  );

  const cardW = min(width * 0.38, 360);
  const cardH = min(height * 0.31, 220);
  const gapX = 28;
  const gapY = 22;

  const startX = (width - (cardW * 2 + gapX)) / 2;
  const startY = max(145, height * 0.17);

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = floor(i / 2);

    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);

    fill("#F1FAEE");
    stroke("#457B9D");
    strokeWeight(2);
    rect(x, y, cardW, cardH, 18);
    noStroke();

    drawPuzzleImage(
      i,
      x + 12,
      y + 12,
      cardW * 0.43,
      cardH - 55
    );

    const textX = x + cardW * 0.47;
    const textW = cardW * 0.48;
    const textCenter = textX + textW / 2;

    fill("#1D3557");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(min(22, cardW * 0.065));
    text(animalNames[i], textX, y + cardH * 0.23, textW, 48);
    textStyle(NORMAL);

    fill("#457B9D");
    textSize(15);
    text(
      completedAnimals[i]
        ? "已完成！"
        : `拼圖進度：${unlockedPieces[i]} / 4`,
      textX,
      y + cardH * 0.43,
      textW,
      36
    );

    drawButton(
      textCenter - cardW * 0.23,
      y + cardH - 53,
      cardW * 0.46,
      40,
      completedAnimals[i] ? "再玩一次" : "繼續挑戰",
      "#F4A261"
    );
  }

  drawButton(
    width / 2 - 112,
    height - 58,
    224,
    42,
    "查看完成成果",
    "#D8E2DC"
  );
}

// ============================================
// 測驗畫面
// ============================================

function drawQuizScreen() {
  const q = questions[selectedAnimal][questionIndex];

  drawTitle(animalNames[selectedAnimal] + "知識挑戰", 38);

  fill("#285943");
  textAlign(CENTER, CENTER);
  textSize(16);
  text(`第 ${questionIndex + 1} 題 / 共 4 題`, 20, 57, width - 40, 50);

  const panelX = width * 0.07;
  const panelY = height * 0.19;
  const panelW = width * 0.32;
  const panelH = height * 0.70;

  fill("#F1FAEE");
  noStroke();
  rect(panelX, panelY, panelW, panelH, 20);

  drawPuzzleImage(
    selectedAnimal,
    panelX + 18,
    panelY + 20,
    panelW - 36,
    panelH * 0.48
  );

  fill("#1D3557");
  textStyle(BOLD);
  textSize(18);
  text(
    `已解鎖 ${unlockedPieces[selectedAnimal]} / 4 塊拼圖`,
    panelX + 10,
    panelY + panelH * 0.59,
    panelW - 20,
    42
  );
  textStyle(NORMAL);

  fill("#457B9D");
  textSize(14);
  text(
    "答對一題，就能拼回圖片的四分之一！",
    panelX + 12,
    panelY + panelH * 0.67,
    panelW - 24,
    42
  );

  const qx = width * 0.43;
  const qw = width * 0.50;
  const qy = height * 0.17;
  const qh = height * 0.76;

  fill("#F1FAEE");
  rect(qx, qy, qw, qh, 20);

  fill("#E76F51");
  textSize(17);
  text(q.type, qx + 18, qy + 17, qw - 36, 35);

  fill("#1D3557");
  textStyle(BOLD);
  textSize(min(25, qw * 0.045));
  text(q.title, qx + 22, qy + 55, qw - 44, 65);
  textStyle(NORMAL);

  fill("#457B9D");
  textSize(min(17, qw * 0.03));
  text(q.description, qx + 22, qy + 120, qw - 44, 55);

  const optGap = 12;
  const optW = (qw - 54) / 2;
  const optH = min(66, qh * 0.105);
  const optY = qy + qh * 0.39;

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = floor(i / 2);

    const ox = qx + 18 + col * (optW + optGap);
    const oy = optY + row * (optH + optGap);

    let optionColor = "#D8E2DC";

    if (selectedAnswer === i && answeredCorrectly) {
      optionColor = "#55A630";
    }

    if (selectedAnswer === i && showWrongAnswer) {
      optionColor = "#E63946";
    }

    if (showWrongAnswer && i === q.answer) {
      optionColor = "#55A630";
    }

    drawButton(
      ox,
      oy,
      optW,
      optH,
      ["A. ", "B. ", "C. ", "D. "][i] + q.options[i],
      optionColor,
      optionColor === "#E63946" ? "#FFFFFF" : "#1D3557"
    );
  }

  if (answeredCorrectly) {
    fill("#2D6A4F");
    textSize(16);
    text(q.explain, qx + 20, qy + qh - 112, qw - 40, 42);

    drawButton(
      qx + qw / 2 - 90,
      qy + qh - 55,
      180,
      40,
      questionIndex === 3 ? "回到動物選單" : "下一題",
      "#55A630",
      "#FFFFFF"
    );

  } else if (showWrongAnswer) {
    fill("#B42332");
    textSize(16);
    text(
      `正確答案：${q.options[q.answer]}`,
      qx + 20,
      qy + qh - 112,
      qw - 40,
      42
    );

    drawButton(
      qx + qw / 2 - 90,
      qy + qh - 55,
      180,
      40,
      "再試一次",
      "#F4A261"
    );
  }
}

// ============================================
// 全部完成畫面
// ============================================

function drawCompleteScreen() {
  drawTitle("恭喜完成所有動物挑戰！", height * 0.13);

  fill("#285943");
  textAlign(CENTER, CENTER);
  textSize(20);
  text(
    "你已經認識四種台灣珍貴的保育動物！",
    20,
    height * 0.23 - 25,
    width - 40,
    50
  );

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = floor(i / 2);

    const w = min(width * 0.34, 300);
    const h = height * 0.25;

    const x = width / 2 - w - 15 + col * (w + 30);
    const y = height * 0.31 + row * (h + 20);

    fill("#F1FAEE");
    rect(x, y, w, h, 16);

    showAnimalImage(i, x + 10, y + 8, w - 20, h - 52);

    fill("#1D3557");
    textSize(17);
    text(animalNames[i], x, y + h - 38, w, 30);
  }

  drawButton(
    width / 2 - 110,
    height - 58,
    220,
    42,
    "回到動物選單",
    "#F4A261"
  );
}

// ============================================
// 滑鼠點擊事件
// ============================================

function mousePressed() {

  // 開始畫面
  if (gameState === "start") {
    gameState = "menu";
    return;
  }

  // 動物選單
  if (gameState === "menu") {
    const cardW = min(width * 0.38, 360);
    const cardH = min(height * 0.31, 220);
    const gapX = 28;
    const gapY = 22;

    const startX = (width - (cardW * 2 + gapX)) / 2;
    const startY = max(145, height * 0.17);

    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = floor(i / 2);

      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);

      if (pointInRect(mouseX, mouseY, x, y, cardW, cardH)) {
        selectedAnimal = i;

        // 保留之前已解鎖的拼圖進度
        questionIndex = unlockedPieces[i] >= 4 ? 0 : unlockedPieces[i];

        answeredCorrectly = false;
        selectedAnswer = -1;
        showWrongAnswer = false;

        gameState = "quiz";
        return;
      }
    }

    if (
      pointInRect(
        mouseX,
        mouseY,
        width / 2 - 112,
        height - 58,
        224,
        42
      )
    ) {
      if (completedAnimals.every(Boolean)) {
        gameState = "complete";
      }
    }

    return;
  }

  // 答題畫面
  if (gameState === "quiz") {
    const q = questions[selectedAnimal][questionIndex];

    const qx = width * 0.43;
    const qw = width * 0.50;
    const qy = height * 0.17;
    const qh = height * 0.76;

    const optGap = 12;
    const optW = (qw - 54) / 2;
    const optH = min(66, qh * 0.105);
    const optY = qy + qh * 0.39;

    if (answeredCorrectly) {
      if (
        pointInRect(
          mouseX,
          mouseY,
          qx + qw / 2 - 90,
          qy + qh - 55,
          180,
          40
        )
      ) {
        if (questionIndex < 3) {
          questionIndex++;
          answeredCorrectly = false;
          selectedAnswer = -1;
          showWrongAnswer = false;
        } else {
          completedAnimals[selectedAnimal] = true;

          if (completedAnimals.every(Boolean)) {
            gameState = "complete";
          } else {
            gameState = "menu";
          }
        }
      }

      return;
    }

    if (showWrongAnswer) {
      if (
        pointInRect(
          mouseX,
          mouseY,
          qx + qw / 2 - 90,
          qy + qh - 55,
          180,
          40
        )
      ) {
        selectedAnswer = -1;
        showWrongAnswer = false;
      }

      return;
    }

    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = floor(i / 2);

      const ox = qx + 18 + col * (optW + optGap);
      const oy = optY + row * (optH + optGap);

      if (pointInRect(mouseX, mouseY, ox, oy, optW, optH)) {
        selectedAnswer = i;

        if (i === q.answer) {
          answeredCorrectly = true;
          showWrongAnswer = false;

          // 每答對一題，就增加一塊已解鎖拼圖
          unlockedPieces[selectedAnimal] = max(
            unlockedPieces[selectedAnimal],
            questionIndex + 1
          );
        } else {
          showWrongAnswer = true;
          answeredCorrectly = false;
        }

        return;
      }
    }

    return;
  }

  // 完成畫面
  if (gameState === "complete") {
    if (
      pointInRect(
        mouseX,
        mouseY,
        width / 2 - 110,
        height - 58,
        220,
        42
      )
    ) {
      gameState = "menu";
    }
  }
}

// ============================================
// 視窗尺寸改變時重新調整畫布
// ============================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}