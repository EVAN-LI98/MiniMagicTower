document.addEventListener('DOMContentLoaded', () => {
  const moduleBgColorSlider = document.getElementById('module-bg-color-slider');
  const gameContainerBgColorSlider = document.getElementById('game-container-bg-color-slider');
  const gameBoardBgColorSlider = document.getElementById('game-board-bg-color-slider');
  const moduleOpacitySlider = document.getElementById('module-opacity-slider');
  const gameContainerOpacitySlider = document.getElementById('game-container-opacity-slider');
  const gameBoardOpacitySlider = document.getElementById('game-board-opacity-slider');

  const moduleBgColorValue = document.getElementById('module-bg-color-value');
  const gameContainerBgColorValue = document.getElementById('game-container-bg-color-value');
  const gameBoardBgColorValue = document.getElementById('game-board-bg-color-value');

  // 设置初始颜色
  let initialColors = {
    module: '#5d07a3b3',
    gameContainer: '#10457999',
    gameBoard: '#33067b99'
  };

  document.documentElement.style.setProperty('--module-bg-color', initialColors.module);
  document.documentElement.style.setProperty('--game-container-bg-color', initialColors.gameContainer);
  document.documentElement.style.setProperty('--game-board-bg-color', initialColors.gameBoard);
  document.documentElement.style.setProperty('--module-opacity', 1);
  document.documentElement.style.setProperty('--game-container-opacity', 1);
  document.documentElement.style.setProperty('--game-board-opacity', 1);

  moduleBgColorValue.textContent = initialColors.module;
  gameContainerBgColorValue.textContent = initialColors.gameContainer;
  gameBoardBgColorValue.textContent = initialColors.gameBoard;

  moduleBgColorSlider.addEventListener('input', (event) => {
    const hue = event.target.value;
    const color = `hsla(${hue}, 100%, 50%, var(--module-opacity))`;
    document.documentElement.style.setProperty('--module-bg-color', color);
    updateModuleBackground();
    moduleBgColorValue.textContent = color;
  });

  gameContainerBgColorSlider.addEventListener('input', (event) => {
    const hue = event.target.value;
    const color = `hsla(${hue}, 100%, 50%, var(--game-container-opacity))`;
    document.documentElement.style.setProperty('--game-container-bg-color', color);
    document.getElementById('game-container').style.backgroundColor = color;
    gameContainerBgColorValue.textContent = color;
  });

  gameBoardBgColorSlider.addEventListener('input', (event) => {
    const hue = event.target.value;
    const color = `hsla(${hue}, 100%, 50%, var(--game-board-opacity))`;
    document.documentElement.style.setProperty('--game-board-bg-color', color);
    document.getElementById('game-board').style.backgroundColor = color;
    gameBoardBgColorValue.textContent = color;
  });

  moduleOpacitySlider.addEventListener('input', (event) => {
    const opacity = event.target.value / 100;
    document.documentElement.style.setProperty('--module-opacity', opacity);
    updateModuleBackground();
    moduleBgColorValue.textContent = getComputedStyle(document.documentElement).getPropertyValue('--module-bg-color');
  });

  gameContainerOpacitySlider.addEventListener('input', (event) => {
    const opacity = event.target.value / 100;
    document.documentElement.style.setProperty('--game-container-opacity', opacity);
    updateGameContainerBackground();
    gameContainerBgColorValue.textContent = getComputedStyle(document.documentElement).getPropertyValue('--game-container-bg-color');
  });

  gameBoardOpacitySlider.addEventListener('input', (event) => {
    const opacity = event.target.value / 100;
    document.documentElement.style.setProperty('--game-board-opacity', opacity);
    updateGameBoardBackground();
    gameBoardBgColorValue.textContent = getComputedStyle(document.documentElement).getPropertyValue('--game-board-bg-color');
  });

  function updateModuleBackground() {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--module-bg-color');
    document.querySelectorAll('.module').forEach(el => {
      el.style.backgroundColor = color;
    });
  }

  function updateGameContainerBackground() {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--game-container-bg-color');
    document.getElementById('game-container').style.backgroundColor = color;
  }

  function updateGameBoardBackground() {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--game-board-bg-color');
    document.getElementById('game-board').style.backgroundColor = color;
  }

  const colorAdjustmentPanel = document.getElementById('color-adjustment-panel');
  const colorAdjustmentIcon = document.getElementById('color-adjustment-icon');

  colorAdjustmentPanel.addEventListener('mouseenter', () => {
    colorAdjustmentPanel.classList.add('expanded');
    colorAdjustmentIcon.style.display = 'none';
  });

  colorAdjustmentPanel.addEventListener('mouseleave', () => {
    colorAdjustmentPanel.classList.remove('expanded');
    colorAdjustmentIcon.style.display = 'block';
  });
});
