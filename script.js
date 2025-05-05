document.addEventListener('DOMContentLoaded', function () {
  const cellsBoard = document.querySelector('.cells-board');
  if (!cellsBoard) {
      console.error('Элемент .cells-board не найден.');
      return;
  }

  let originalState = cellsBoard.innerHTML;

  const params = new URLSearchParams(window.location.search);
  const botName = params.get('botName') || 'Unknown';
  const language = params.get('language') || 'en';

  const botNameElement = document.getElementById('botName');
  if (botNameElement) {
      botNameElement.textContent = botName;
      botNameElement.style.display = 'block';
      botNameElement.style.color = 'white';
  }

  function hidePreloader() {
      const preloader = document.querySelector('.preloader');
      if (preloader) {
          preloader.classList.remove('fade-in');
          setTimeout(() => {
              preloader.style.display = 'none';
              document.body.classList.remove('hidden');
              document.body.classList.add('fade-in');
          }, 1000);
      }
  }
  setTimeout(hidePreloader, 3000);

  const trapsOptions = [1, 3, 5, 7];
  const trapsToCellsOpenMapping = {
      1: 10,
      3: 5,
      5: 4,
      7: 3
  };
  let currentPresetIndex = 0;
  const trapsAmountElement = document.getElementById('trapsAmount');
  const prevPresetBtn = document.getElementById('prev_preset_btn');
  const nextPresetBtn = document.getElementById('next_preset_btn');

  function updateTrapsAmount() {
      if (trapsAmountElement) {
          trapsAmountElement.textContent = trapsOptions[currentPresetIndex];
      }
  }

  if (prevPresetBtn) {
      prevPresetBtn.addEventListener('click', function () {
          if (currentPresetIndex > 0) {
              currentPresetIndex--;
              updateTrapsAmount();
          }
      });
  }
  if (nextPresetBtn) {
      nextPresetBtn.addEventListener('click', function () {
          if (currentPresetIndex < trapsOptions.length - 1) {
              currentPresetIndex++;
              updateTrapsAmount();
          }
      });
  }
  updateTrapsAmount();

  function attachCellClickListeners() {
      const cells = document.querySelectorAll('.cells-board .cell');
      cells.forEach(cell => {
          cell.addEventListener('click', () => {
              cell.style.transform = 'scale(0.7)';
              setTimeout(() => {
                  cell.style.transform = 'scale(1)';
              }, 200);
          });
      });
  }

  let isFirstPlay = true;

  const playButton = document.getElementById('playButton');
  const countdownTimer = document.getElementById('countdownTimer');
  const progressBarFill = document.getElementById('progressBarFill');
  const timerContainer = document.querySelector('.timer-container');

  function startTimer(duration) {
      let timeLeft = duration;
      countdownTimer.textContent = timeLeft;
      playButton.disabled = true; // Блокируем кнопку

      // Показываем таймер и текст "Анализ, ожидайте:"
      timerContainer.classList.remove('hidden');
      const timerLabel = document.getElementById('timerLabel');
      if (timerLabel) {
          timerLabel.classList.remove('hidden');
      }

      // Устанавливаем начальное состояние полоски
      progressBarFill.style.transform = 'scaleX(0)';

      const interval = setInterval(() => {
          timeLeft--;
          countdownTimer.textContent = timeLeft;

          // Обновляем ширину полоски прогресса
          const progress = (duration - timeLeft) / duration;
          progressBarFill.style.transform = `scaleX(${progress})`;

          if (timeLeft <= 0) {
              clearInterval(interval);
              playButton.disabled = false; // Разблокируем кнопку
              countdownTimer.textContent = '';
              progressBarFill.style.transform = 'scaleX(0)'; // Сбрасываем полоску

              // Скрываем таймер и текст "Анализ, ожидайте:" после завершения
              timerContainer.classList.add('hidden');
              if (timerLabel) {
                  timerLabel.classList.add('hidden');
              }
          }
      }, 1000);
  }

  if (playButton) {
      playButton.addEventListener('click', function () {
          playButton.disabled = true;

          let cells = document.querySelectorAll('.cells-board .cell');

          if (!isFirstPlay) {
              cellsBoard.innerHTML = originalState;
              attachCellClickListeners();
              cells = document.querySelectorAll('.cells-board .cell');
          }

          const trapsAmount = parseInt(trapsAmountElement.textContent);
          const cellsToOpen = trapsToCellsOpenMapping[trapsAmount] || 0;
          const selectedCells = [];

          while (selectedCells.length < cellsToOpen) {
              const randomIndex = Math.floor(Math.random() * cells.length);
              if (!selectedCells.includes(randomIndex)) {
                  selectedCells.push(randomIndex);
              }
          }

          let starIndex = 0;
          function animateStars() {
              if (starIndex < selectedCells.length) {
                  const index = selectedCells[starIndex];
                  const cell = cells[index];

                  cell.classList.add('cell-fade-out');

                  setTimeout(() => {
                      cell.innerHTML = '';
                      const newImg = document.createElement('img');
                      newImg.setAttribute('width', '40');
                      newImg.setAttribute('height', '40');
                      newImg.style.opacity = '0';
                      newImg.style.transform = 'scale(0)';
                      newImg.src = 'img/stars.svg';
                      newImg.classList.add('star-animation');
                      cell.appendChild(newImg);
                      setTimeout(() => {
                          newImg.classList.add('fade-in');
                      }, 50);
                      cell.classList.remove('cell-fade-out');
                  }, 500);

                  starIndex++;
                  setTimeout(animateStars, 650);
              } else {
                  startTimer(10); // Запускаем таймер после завершения анимации
                  if (isFirstPlay) {
                      isFirstPlay = false;
                  }
              }
          }
          animateStars();
      });
  }

  // Открытие модального окна
  const languageButton = document.querySelector('.language-button');
  const languageModal = document.getElementById('languageModal');
  const languageOptions = document.querySelectorAll('.language-option');

  if (languageButton && languageModal) {
      languageButton.addEventListener('click', () => {
          languageModal.classList.remove('hidden');
      });

      // Закрытие модального окна при выборе языка
      languageOptions.forEach(option => {
          option.addEventListener('click', (e) => {
              const selectedLang = e.target.dataset.lang;
              console.log(`Выбран язык: ${selectedLang}`);
              languageModal.classList.add('hidden');
              // Здесь можно добавить логику для смены языка
          });
      });

      // Закрытие модального окна при клике вне его
      languageModal.addEventListener('click', (e) => {
          if (e.target === languageModal) {
              languageModal.classList.add('hidden');
          }
      });
  }
});