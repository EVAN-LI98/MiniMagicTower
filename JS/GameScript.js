document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');
  const healthEl = document.getElementById('health');
  const attackEl = document.getElementById('attack');
  const defenseEl = document.getElementById('defense');
  const floorEl = document.getElementById('floor');
  const goldEl = document.getElementById('gold');
  const monsterInfoEl = document.getElementById('monster-info');
  const itemInfoEl = document.getElementById('item-info');
  const terminalEl = document.getElementById('terminal');
  const langToggle = document.getElementById('lang-toggle');
  const terminalLangToggle = document.getElementById('terminal-lang-toggle');

  let currentLang = 'zh';
  let terminalLang = 'zh';
  let player = {
    health: 100,
    maxHealth: 5000,
    attack: 15,
    defense: 8,
    floor: 1,
    gold: 0,
    position: { x: 0, y: 0 },
    defeatedElite: false
  };

  const symbols = {
    player: '🦸',
    // empty: '・',
    empty: ' ',
    wall: '□',
    slime: '🟢',
    bat: '🦇',
    ghost: '👻',
    dragon: '🐉',
    skeleton: '💀',
    demon: '👹',
    goblin: '👺',
    orc: '👽',
    troll: '🧌',
    wizard: '🧙',
    vampire: '🧛',
    werewolf: '🐺',
    zombie: '🧟',
    mummy: '🧞',
    golem: '🗿',
    potion: '🧪',
    sword: '🗡️',
    shield: '🛡️',
    stairs: '📶',
    trap: '💥',
    merchant: '🤠',
    skeletonking: '🩻',
    greatmagician: '🦹‍♂',
    musketeer: '💂‍♀',
    joker: '🃏'
  };

  const monsters = {
    slime: { symbol: symbols.slime, name: { zh: "史莱姆", en: "Slime" }, health: 20, attack: 5, defense: 1, gold: 5 },
    bat: { symbol: symbols.bat, name: { zh: "蝙蝠", en: "Bat" }, health: 30, attack: 8, defense: 2, gold: 8 },
    ghost: { symbol: symbols.ghost, name: { zh: "幽灵", en: "Ghost" }, health: 40, attack: 12, defense: 3, gold: 12 },
    skeleton: { symbol: symbols.skeleton, name: { zh: "骷髅", en: "Skeleton" }, health: 50, attack: 15, defense: 5, gold: 15 },
    goblin: { symbol: symbols.goblin, name: { zh: "哥布林", en: "Goblin" }, health: 60, attack: 18, defense: 7, gold: 18 },
    demon: { symbol: symbols.demon, name: { zh: "恶魔", en: "Demon" }, health: 80, attack: 22, defense: 10, gold: 25 },
    dragon: { symbol: symbols.dragon, name: { zh: "龙", en: "Dragon" }, health: 100, attack: 25, defense: 15, gold: 50 },
    orc: { symbol: symbols.orc, name: { zh: "兽人", en: "Orc" }, health: 70, attack: 20, defense: 8, gold: 22 },
    troll: { symbol: symbols.troll, name: { zh: "巨魔", en: "Troll" }, health: 90, attack: 23, defense: 12, gold: 30 },
    wizard: { symbol: symbols.wizard, name: { zh: "巫师", en: "Wizard" }, health: 65, attack: 30, defense: 5, gold: 35 },
    vampire: { symbol: symbols.vampire, name: { zh: "吸血鬼", en: "Vampire" }, health: 75, attack: 28, defense: 8, gold: 40 },
    werewolf: { symbol: symbols.werewolf, name: { zh: "狼人", en: "Werewolf" }, health: 85, attack: 26, defense: 9, gold: 38 },
    zombie: { symbol: symbols.zombie, name: { zh: "僵尸", en: "Zombie" }, health: 45, attack: 14, defense: 4, gold: 14 },
    mummy: { symbol: symbols.mummy, name: { zh: "木乃伊", en: "Mummy" }, health: 55, attack: 16, defense: 6, gold: 20 },
    golem: { symbol: symbols.golem, name: { zh: "石头人", en: "Golem" }, health: 110, attack: 20, defense: 18, gold: 45 }
  };

  const eliteMonsters = {
    elite1: { symbol: symbols.skeletonking, name: { zh: "骷髅王", en: "Skeleton King" }, health: 200, attack: 50, defense: 20, gold: 100 },
    elite2: { symbol: symbols.greatmagician, name: { zh: "大魔法师", en: "Great Magician" }, health: 250, attack: 55, defense: 25, gold: 120 },
    elite3: { symbol: symbols.musketeer, name: { zh: "传奇火枪手", en: "Musketeer" }, health: 300, attack: 60, defense: 30, gold: 140 },
    elite4: { symbol: symbols.joker, name: { zh: "小丑皇", en: "Joker" }, health: 350, attack: 65, defense: 35, gold: 160 }
  };

  const items = {
    potion: { symbol: symbols.potion, name: { zh: "药水", en: "Potion" }, effect: { zh: "恢复20点生命", en: "Restore 20 HP" } },
    sword: { symbol: symbols.sword, name: { zh: "剑", en: "Sword" }, effect: { zh: "攻击+5", en: "Attack +5" } },
    shield: { symbol: symbols.shield, name: { zh: "盾", en: "Shield" }, effect: { zh: "防御+3", en: "Defense +3" } },
    stairs: { symbol: symbols.stairs, name: { zh: "门", en: "Door" }, effect: { zh: "下一层", en: "Next Floor" } },
    trap: { symbol: symbols.trap, name: { zh: "陷阱", en: "Trap" }, effect: { zh: "随机伤害", en: "Random Damage" } },
    merchant: { symbol: symbols.merchant, name: { zh: "商人", en: "Merchant" }, effect: { zh: "购买物品", en: "Buy items" } }
  };

  let currentFloorNPC = null;

  function createBoard() {
    gameBoard.innerHTML = '';
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
      }
    }

    if (player.floor % 5 === 0 && player.floor > 0) {
      spawnEliteMonster();
    } else {
      updateBoard();
      if (player.floor < 5 || player.floor % 5 !== 0) {
        const cell = gameBoard.querySelector(`[data-x="14"][data-y="14"]`);
        cell.textContent = symbols.stairs;
      }
    }
    updateMonsterInfo();
    updateItemInfo();
  }

  function spawnEliteMonster() {
    const eliteMonster = Object.values(eliteMonsters)[Math.floor(Math.random() * Object.values(eliteMonsters).length)];
    const elitePositions = [
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 7 },
      { x: 8, y: 8 }
    ];

    elitePositions.forEach(pos => {
      const cell = gameBoard.querySelector(`[data-x="${pos.x}"][data-y="${pos.y}"]`);
      if (cell) {
        cell.style.backgroundColor = 'black'; // 设置背景为黑色
        cell.textContent = eliteMonster.symbol;
        cell.classList.add('elite-monster');
        cell.dataset.monster = JSON.stringify(eliteMonster);
      }
    });

    addToTerminal(terminalLang === 'zh' ? "⚠️ 精英怪物出现！" : "⚠️ An elite monster has appeared!");
  }

  function updateBoard() {
    const cells = gameBoard.getElementsByClassName('cell');
    for (let cell of cells) {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);
      if (!cell.classList.contains('elite-monster')) { // 如果是精英怪物单元格，不修改样式
        cell.classList.remove('monster', 'player', 'trap', 'merchant');
        cell.style.backgroundColor = ''; // 重置背景颜色
        if (x === player.position.x && y === player.position.y) {
          cell.textContent = symbols.player;
          cell.classList.add('player');
        } else if (Math.random() < 0.15) {
          const monster = getRandomMonster();
          cell.textContent = monster.symbol;
          cell.classList.add('monster');
        } else if (Math.random() < 0.05) {
          cell.textContent = symbols.potion;
        } else if (Math.random() < 0.03) {
          cell.textContent = symbols.sword;
        } else if (Math.random() < 0.03) {
          cell.textContent = symbols.shield;
        } else if (Math.random() < 0.05) {
          cell.textContent = symbols.trap;
          cell.classList.add('trap');
        } else if (x === 14 && y === 14) {
          if (player.defeatedElite || player.floor < 5 || player.floor % 5 !== 0) {
            cell.textContent = symbols.stairs;
          }
        } else if (currentFloorNPC && x === currentFloorNPC.x && y === currentFloorNPC.y) {
          cell.textContent = symbols.merchant;
          cell.classList.add('merchant');
        } else {
          cell.textContent = symbols.empty;
        }
      }
    }
  }

  function getFloorFactor(floor) {
    if (floor <= 10) {
      return 1 + floor * 1;
    } else if (floor <= 20) {
      return 1 + floor * 1.5;
    } else if (floor <= 30) {
      return 1 + floor * 2;
    } else if (floor <= 40) {
      return 1 + floor * 2.5;
    } else if (floor <= 50) {
      return 1 + floor * 3;
    } else {
      return 1 + floor * 3.5;
    }
  }

  function getRandomMonster() {
    const monsterTypes = Object.values(monsters);
    const floorFactor = getFloorFactor(player.floor);
    const weightedMonsters = monsterTypes.filter(monster =>
      Math.random() < floorFactor || monsterTypes.indexOf(monster) < 5
    );
    const baseMonster = weightedMonsters[Math.floor(Math.random() * weightedMonsters.length)];

    const scaledMonster = {
      ...baseMonster,
      health: Math.round(baseMonster.health * floorFactor),
      attack: Math.round(baseMonster.attack * floorFactor),
      defense: Math.round(baseMonster.defense * floorFactor),
      gold: Math.round(baseMonster.gold * floorFactor)
    };

    return scaledMonster;
  }

  function handleCellClick(event) {
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    movePlayer(x, y);
  }

  function movePlayer(x, y) {
    const dx = Math.abs(x - player.position.x);
    const dy = Math.abs(y - player.position.y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      const cell = gameBoard.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      const content = cell.textContent;

      if (cell.classList.contains('elite-monster')) {
        fightMonster(JSON.parse(cell.dataset.monster), true);
      } else {
        switch (content) {
          case symbols.empty:
            player.position = { x, y };
            addToTerminal(terminalLang === 'zh' ? "🚶 勇者移动到了新的位置。" : "🚶 The hero moved to a new position.");
            break;
          case symbols.slime:
          case symbols.bat:
          case symbols.ghost:
          case symbols.dragon:
          case symbols.skeleton:
          case symbols.demon:
          case symbols.goblin:
          case symbols.orc:
          case symbols.troll:
          case symbols.wizard:
          case symbols.vampire:
          case symbols.werewolf:
          case symbols.zombie:
          case symbols.mummy:
          case symbols.golem:
            fightMonster(content);
            break;
          case symbols.potion:
            drinkPotion();
            break;
          case symbols.sword:
            getSword();
            break;
          case symbols.shield:
            getShield();
            break;
          case symbols.stairs:
            if (player.defeatedElite || player.floor < 5 || player.floor % 5 !== 0) {
              nextFloor();
            } else {
              addToTerminal(terminalLang === 'zh' ? "你需要先击败精英怪物才能前往下一层。" : "You need to defeat the elite monster first to proceed to the next floor.");
            }
            break;
          case symbols.trap:
            triggerTrap();
            break;
          case symbols.merchant:
            interactWithMerchant();
            break;
        }
      }
      updateBoard();
      updateStatus();
      updateMonsterInfo(); // 更新怪物图鉴
    }
  }

  function fightMonster(monsterData, isElite = false) {
    const monster = isElite ? monsterData : Object.values(monsters).find(m => m.symbol === monsterData);
    const floorFactor = getFloorFactor(player.floor);
    const scaledMonster = isElite ? monster : {
      ...monster,
      health: Math.round(monster.health * floorFactor),
      attack: Math.round(monster.attack * floorFactor),
      defense: Math.round(monster.defense * floorFactor),
      gold: Math.round(monster.gold * floorFactor)
    };
    let monsterHealth = scaledMonster.health;

    addToTerminal(terminalLang === 'zh' ? `⚔️ 你遇到了${scaledMonster.name.zh}！` : `⚔️ You encountered a ${scaledMonster.name.en}!`);
    
    // Debug: Log initial health values
    console.log(`Initial player health: ${player.health}`);
    console.log(`Initial monster health: ${monsterHealth}`);

    while (player.health > 0 && monsterHealth > 0) {
      const playerDamage = Math.max(1, player.attack - scaledMonster.defense);
      monsterHealth -= playerDamage;

      // Debug: Log health after player's attack
      console.log(`After player's attack, monster health: ${monsterHealth}`);

      if (monsterHealth <= 0) {
        player.gold += scaledMonster.gold;
        addToTerminal(terminalLang === 'zh' ?
          `🎉 你击败了${scaledMonster.name.zh}！获得了${scaledMonster.gold}枚金币。` :
          `🎉 You defeated the ${scaledMonster.name.en}! You gained ${scaledMonster.gold} gold.`
        );
        if (isElite) {
          player.defeatedElite = true;
          addToTerminal(terminalLang === 'zh' ? '🚪 通往下一层的楼梯出现了！' : '🚪 The stairs to the next floor have appeared!');
          gameBoard.querySelector(`[data-x="14"][data-y="14"]`).textContent = symbols.stairs;

          // 移除精英怪物
          const elitePositions = [
            { x: 7, y: 7 },
            { x: 7, y: 8 },
            { x: 8, y: 7 },
            { x: 8, y: 8 }
          ];
          elitePositions.forEach(pos => {
            const cell = gameBoard.querySelector(`[data-x="${pos.x}"][data-y="${pos.y}"]`);
            if (cell) {
              cell.textContent = symbols.empty;
              cell.style.backgroundColor = '';
              cell.classList.remove('elite-monster');
              cell.removeAttribute('data-monster');
            }
          });
        }
        updateMonsterInfo(); // 更新怪物图鉴
        return;
      }

      const monsterDamage = Math.max(1, scaledMonster.attack - player.defense);
      player.health -= monsterDamage;

      // Debug: Log health after monster's attack
      console.log(`After monster's attack, player health: ${player.health}`);

      if (player.health <= 0) {
        addToTerminal(terminalLang === 'zh' ? '💀 游戏结束！你被怪物打败了。' : '💀 Game Over! You were defeated by the monster.');
        setTimeout(resetGame, 2000); // 延迟2秒后重置游戏
        return;
      }
    }

    // 输出最终的战斗结果
    addToTerminal(terminalLang === 'zh' ?
      `⚔️ 最终战斗结果: 你的生命值: ${player.health}, ${scaledMonster.name.zh} 的生命值: ${monsterHealth}` :
      `⚔️ Final Battle Result: Your HP: ${player.health}, ${scaledMonster.name.en}'s HP: ${monsterHealth}`
    );
    updateMonsterInfo(); // 更新怪物图鉴
  }

  function drinkPotion() {
    player.health = Math.min(player.maxHealth, player.health + 20);
    addToTerminal(terminalLang === 'zh' ? '🧪 你喝了一瓶药水，恢复了 20 点生命值！' : '🧪 You drank a potion and restored 20 HP!');
    updateMonsterInfo(); // 更新怪物图鉴
  }

  function getSword() {
    player.attack += 5;
    addToTerminal(terminalLang === 'zh' ? '🗡️ 你找到了一把剑，攻击力 +5！' : '🗡️ You found a sword. Attack +5!');
    updateMonsterInfo(); // 更新怪物图鉴
  }

  function getShield() {
    player.defense += 3;
    addToTerminal(terminalLang === 'zh' ? '🛡️ 你找到了一面盾牌，防御力 +3！' : '🛡️ You found a shield. Defense +3!');
    updateMonsterInfo(); // 更新怪物图鉴
  }

  function nextFloor() {
    player.floor++;
    player.position = { x: 0, y: 0 };
    player.defeatedElite = false;
    currentFloorNPC = Math.random() < 0.5 ? { x: Math.floor(Math.random() * 15), y: Math.floor(Math.random() * 15) } : null;
    addToTerminal(terminalLang === 'zh' ? `🎊 恭喜！你到达了第 ${player.floor} 层。` : `🎊 Congratulations! You reached floor ${player.floor}.`);
    createBoard();
    updateMonsterInfo(); // 更新怪物图鉴
  }

  function triggerTrap() {
    const damage = Math.floor(Math.random() * 10) + 5;
    player.health -= damage;
    addToTerminal(terminalLang === 'zh' ? `💥 你触发了陷阱，受到 ${damage} 点伤害！` : `💥 You triggered a trap and took ${damage} damage!`);
    if (player.health <= 0) {
      addToTerminal(terminalLang === 'zh' ? '💀 游戏结束！你被陷阱击败了。' : '💀 Game Over! You were defeated by a trap.');
      setTimeout(resetGame, 2000); // 延迟2秒后重置游戏
    }
    updateMonsterInfo(); // 更新怪物图鉴
  }

  function interactWithMerchant() {
    // Define the base options with initial costs
    const baseOptions = [
      { name: { zh: '恢复生命值', en: 'Restore HP' }, baseCost: 10, effect: () => { player.health = Math.min(player.maxHealth, player.health + 100); } },
      { name: { zh: '增加攻击力', en: 'Increase Attack' }, baseCost: 15, effect: () => { player.attack += 3; } },
      { name: { zh: '增加防御力', en: 'Increase Defense' }, baseCost: 15, effect: () => { player.defense += 3; } }
    ];

    // Open the modal
    const modal = document.getElementById("merchant-modal");
    const span = document.getElementsByClassName("close")[0];
    const message = document.getElementById("merchant-message");

    modal.style.display = "block";
    updateMerchantMessage();

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    function updateMerchantMessage() {
      // Calculate current costs based on the number of transactions
      const options = baseOptions.map(option => {
        const transactions = player.transactions || {};
        const currentCost = option.baseCost * (1 + (transactions[option.name.en] || 0) * 0.2);
        return { ...option, cost: Math.round(currentCost) }; // Round to nearest integer
      });

      message.innerHTML = terminalLang === 'zh' ?
        `你遇到了商人！选择要购买的物品：<br>1. ${options[0].name.zh} (${options[0].cost}金币)<br>2. ${options[1].name.zh} (${options[1].cost}金币)<br>3. ${options[2].name.zh} (${options[2].cost}金币)<br>4. 离开` :
        `You met a merchant! Choose an item to buy:<br>1. ${options[0].name.en} (${options[0].cost} gold)<br>2. ${options[1].name.en} (${options[1].cost} gold)<br>3. ${options[2].name.en} (${options[2].cost} gold)<br>4. Leave`;

      document.getElementById("buy-item-1").onclick = () => buyItem(0, options[0]);
      document.getElementById("buy-item-2").onclick = () => buyItem(1, options[1]);
      document.getElementById("buy-item-3").onclick = () => buyItem(2, options[2]);
      document.getElementById("leave-merchant").onclick = () => modal.style.display = "none";
    }

    function buyItem(index, selectedOption) {
      if (player.gold >= selectedOption.cost) {
        player.gold -= selectedOption.cost;
        selectedOption.effect();

        // Update the transactions count
        player.transactions = player.transactions || {};
        player.transactions[selectedOption.name.en] = (player.transactions[selectedOption.name.en] || 0) + 1;

        addToTerminal(terminalLang === 'zh' ?
          `🛒 你购买了${selectedOption.name.zh}，花费了${selectedOption.cost}金币。` :
          `🛒 You bought ${selectedOption.name.en} for ${selectedOption.cost} gold.`
        );

        updateStatus(); // Update the player status panel
        updateMerchantMessage(); // Update the merchant message with new costs
        updateMonsterInfo(); // 更新怪物图鉴
      } else {
        addToTerminal(terminalLang === 'zh' ? '💰 你没有足够的金币！' : '💰 You don\'t have enough gold!');
      }
    }
  }

  function updateStatus() {
    healthEl.textContent = player.health;
    attackEl.textContent = player.attack;
    defenseEl.textContent = player.defense;
    floorEl.textContent = player.floor;
    goldEl.textContent = player.gold;
  }

  function getColorBasedOnDamage(damage) {
    const damagePercentage = damage / player.health;
    if (damage === 0) {
      return 'green';
    } else if (damagePercentage <= 0.5) {
      return 'yellow';
    } else if (damagePercentage < 1) {
      return 'red';
    } else {
      return 'black';
    }
  }

  function updateMonsterInfo() {
    monsterInfoEl.innerHTML = '';

    // 普通怪物
    const normalMonstersTitle = document.createElement('h4');
    normalMonstersTitle.textContent = currentLang === 'zh' ? '普通怪物' : 'Normal Monsters';
    monsterInfoEl.appendChild(normalMonstersTitle);

    const floorFactor = getFloorFactor(player.floor);
    for (const [key, monster] of Object.entries(monsters)) {
      const scaledMonster = {
        ...monster,
        health: Math.round(monster.health * floorFactor),
        attack: Math.round(monster.attack * floorFactor),
        defense: Math.round(monster.defense * floorFactor),
        gold: Math.round(monster.gold * floorFactor)
      };
      const monsterDamage = Math.max(0, scaledMonster.attack - player.defense);
      const color = getColorBasedOnDamage(monsterDamage);

      const li = document.createElement('li');
      li.className = 'monster-info';
      li.style.color = color;
      li.innerHTML = `${scaledMonster.symbol} ${scaledMonster.name[currentLang]}: <span class="health">${scaledMonster.health}</span>, <span class="attack">${scaledMonster.attack}</span>, <span class="defense">${scaledMonster.defense}</span>, <span class="gold">${scaledMonster.gold}</span>`;
      monsterInfoEl.appendChild(li);
    }

    // 精英怪物
    const eliteMonstersTitle = document.createElement('h4');
    eliteMonstersTitle.textContent = currentLang === 'zh' ? '精英怪物' : 'Elite Monsters';
    monsterInfoEl.appendChild(eliteMonstersTitle);

    for (const [key, eliteMonster] of Object.entries(eliteMonsters)) {
      const scaledEliteMonster = {
        ...eliteMonster,
        health: Math.round(eliteMonster.health * floorFactor),
        attack: Math.round(eliteMonster.attack * floorFactor),
        defense: Math.round(eliteMonster.defense * floorFactor),
        gold: Math.round(eliteMonster.gold * floorFactor)
      };
      const eliteMonsterDamage = Math.max(0, scaledEliteMonster.attack - player.defense);
      const color = getColorBasedOnDamage(eliteMonsterDamage);

      const li = document.createElement('li');
      li.className = 'monster-info';
      li.style.color = color;
      li.innerHTML = `${scaledEliteMonster.symbol} ${scaledEliteMonster.name[currentLang]}: <span class="health">${scaledEliteMonster.health}</span>, <span class="attack">${scaledEliteMonster.attack}</span>, <span class="defense">${scaledEliteMonster.defense}</span>, <span class="gold">${scaledEliteMonster.gold}</span>`;
      monsterInfoEl.appendChild(li);
    }
  }

  function updateItemInfo() {
    itemInfoEl.innerHTML = '';
    for (const [key, item] of Object.entries(items)) {
      const li = document.createElement('li');
      li.textContent = `${item.symbol} ${item.name[currentLang]}: ${item.effect[currentLang]}`;
      itemInfoEl.appendChild(li);
    }
  }

  function resetGame() {
    player = {
      health: 100,
      maxHealth: 5000,
      attack: 10,
      defense: 5,
      floor: 1,
      gold: 0,
      position: { x: 0, y: 0 },
      defeatedElite: false
    };
    currentFloorNPC = Math.random() < 0.5 ? { x: Math.floor(Math.random() * 15), y: Math.floor(Math.random() * 15) } : null;
    createBoard();
    updateStatus();
    addToTerminal(terminalLang === 'zh' ? "🔄 游戏重新开始！" : "🔄 Game restarted!");
  }

  function addToTerminal(message) {
    const p = document.createElement('p');
    p.textContent = message;
    terminalEl.appendChild(p);
    terminalEl.scrollTop = terminalEl.scrollHeight;
  }

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    updateLanguage();
  });

  terminalLangToggle.addEventListener('click', () => {
    terminalLang = terminalLang === 'zh' ? 'en' : 'zh';
    updateTerminalLanguage();
  });

  function updateLanguage() {
    document.getElementById('title').textContent = currentLang === 'zh' ? '🏰 《小小魔塔》 🏰' : '🏰 Mini Magic Tower 🏰';
    document.querySelector('#status h3').textContent = currentLang === 'zh' ? '🦸‍♂️ 勇者状态 🦸‍♂️' : '🦸‍♂️ Hero Status 🦸‍♂️';
    document.querySelector('#status p:nth-child(2)').childNodes[0].textContent = currentLang === 'zh' ? '❤️ 生命值: ' : '❤️ HP: ';
    document.querySelector('#status p:nth-child(3)').childNodes[0].textContent = currentLang === 'zh' ? '⚔️ 攻击力: ' : '⚔️ Attack: ';
    document.querySelector('#status p:nth-child(4)').childNodes[0].textContent = currentLang === 'zh' ? '🛡️ 防御力: ' : '🛡️ Defense: ';
    document.querySelector('#status p:nth-child(5)').childNodes[0].textContent = currentLang === 'zh' ? '🏰 楼层: ' : '🏰 Floor: ';
    document.querySelector('#status p:nth-child(6)').childNodes[0].textContent = currentLang === 'zh' ? '💰 金币: ' : '💰 Gold: ';
    document.querySelector('#monster-list h3').textContent = currentLang === 'zh' ? '🧟 怪物图鉴 🧟' : '🧟 Monster Guide 🧟';
    document.querySelector('#item-list h3').textContent = currentLang === 'zh' ? '🧙 NPC & 道具 🎁' : '🧙 NPC & Items 🎁';
    document.querySelector('#controls h3').textContent = currentLang === 'zh' ? '🈯 操作指南 🈯' : '🈯 Controls 🈯';
    document.querySelector('#controls p:nth-child(2)').textContent = currentLang === 'zh' ? '使用 W A S D 键移动勇者' : 'Use W A S D keys to move the hero';
    document.querySelector('#controls p:nth-child(3)').textContent = currentLang === 'zh' ? '或点击相邻格子来移动' : 'Or click adjacent cells to move';
    updateMonsterInfo();
    updateItemInfo();
  }

  document.getElementById('author-lang-toggle').addEventListener('click', () => {
    const authorMessage = document.getElementById('author-message');
    const currentLang = authorMessage.getAttribute('data-lang');
    if (currentLang === 'en') {
      authorMessage.innerHTML = '🎮 欢迎来到《小小魔塔》，我是作者Evan, 很高兴你来玩我的游戏！🎮<br>🎮游戏当前版本为 V1.01🎮';
      authorMessage.setAttribute('data-lang', 'zh');
    } else {
      authorMessage.innerHTML = '🎮 Welcome to Mini Magic Tower, I am the author Evan, glad to have you play my game! 🎮<br>🎮Game version is V1.01🎮';
      authorMessage.setAttribute('data-lang', 'en');
    }
  });

  function updateTerminalLanguage() {
    terminalEl.innerHTML = '';
    terminalEl.appendChild(terminalLangToggle);
    addToTerminal(terminalLang === 'zh' ? "🎮 欢迎来到《小小魔塔》🎮" : "🎮 Welcome to Mini Magic Tower 🎮");
    addToTerminal(terminalLang === 'zh' ? "🧙‍♂️ 作者: Yifan Li 🧙‍♂️" : "🧙‍♂️ Author: Yifan Li 🧙‍♂️");
    addToTerminal(terminalLang === 'zh' ? "📧 邮箱: arthur19980529@gmail.com 📧" : "📧 Email: arthur19980529@gmail.com 📧");
    addToTerminal(terminalLang === 'zh' ? "🚀 勇者，你的冒险旅程开始了！" : "🚀 Hero, your adventure begins!");
  }

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const { x, y } = player.position;
    switch (key) {
      case 'w':
        movePlayer(x, y - 1);
        break;
      case 's':
        movePlayer(x, y + 1);
        break;
      case 'a':
        movePlayer(x - 1, y);
        break;
      case 'd':
        movePlayer(x + 1, y);
        break;
    }
  });

  createBoard();
  updateStatus();
  updateTerminalLanguage();
});
