function addElement(
  tagName,
  {
    parent = document.body, classList = [], content = '', attr = {},
  } = {},
) {
  const element = document.createElement(tagName);
  if (content !== '') element.textContent = content;
  for (const [key, value] of Object.entries(attr)) {
    element.setAttribute(key, value);
  }

  element.classList.add(...classList);

  parent.append(element);
  return element;
}

document.addEventListener('DOMContentLoaded', () => {
  function createDialog(setCount, processFirstOpen) {
    let firstDialog = true;
    const dialog = addElement('dialog', { classList: ['modal-dialog'] });

    const content = addElement('form', {
      classList: ['modal-content'],
      parent: dialog,
    });

    const header = addElement('div', {
      classList: ['modal-header'],
      parent: content,
    });

    addElement('h5', {
      classList: ['modal-title'],
      parent: header,
      content: 'Задайте параметры игры',
    });

    const topCloseButton = addElement('button', {
      parent: header,
      classList: ['close'],
      attr: { type: 'button', 'data-dismiss': 'modal' },
    });

    topCloseButton.innerHTML = '<span aria-hidden="true">&times;</span>';

    const body = addElement('div', {
      classList: ['modal-body'],
      parent: content,
    });

    const footer = addElement('div', {
      classList: ['modal-footer'],
      parent: content,
    });

    addElement('label', {
      parent: body,
      attr: { for: 'name' },
      content: ' Введите количество карточек по вертикали/горизонтали',
    });
    const input = addElement('input', {
      parent: body,
      classList: ['form-control'],
      attr: {
        type: 'number',
        placeholder: 'Чётное число от 2 до 10 (по умолчанию 4)',
        autofocus: true,
      },
    });

    addElement('label', {
      parent: body,
      attr: { for: 'name' },
      content: 'введите время игры в секундах',
    });
    const inputTimer = addElement('input', {
      parent: body,
      classList: ['form-control'],
      attr: {
        type: 'number',
        placeholder: `Целое число от 10 до ${24 * 60 * 60} (по умолчанию 60)`,
        autofocus: true,
      },
    });

    addElement('button', {
      parent: footer,
      classList: ['btn'],
      attr: { type: 'submit' },
      content: 'ИГРАТЬ',
    });
    const cancelButton = addElement('button', {
      parent: footer,
      classList: ['btn'],
      attr: { type: 'reset' },
      content: 'ОТМЕНА',
    });

    function closeDialog() {
      dialog.close();
      if (firstDialog) processFirstOpen();
      firstDialog = false;
    }

    cancelButton.addEventListener('click', () => {
      closeDialog();
    });
    topCloseButton.addEventListener('click', () => {
      closeDialog();
    });

    content.addEventListener('submit', (event) => {
      event.preventDefault();
      const countTimer = Math.max(
        Math.min(Number(inputTimer.value) || 60, 24 * 60 * 60),
        10,
      );
      const count = Number(input.value);
      if (
        Number.isNaN(count)
        || count < 2
        || count > 10
        || Math.trunc(count) !== count
        || count % 2 !== 0
      ) {
        setCount(4, countTimer);
        input.value = 4;
      } else setCount(count, countTimer);

      closeDialog();
    });

    return { showDialog: () => dialog.showModal(), closeDialog };
  }

  function addCard(name, { cardSize, fontSize }, memoryGame) {
    // name входит в ['1', '2'...'50']

    const memoryCard = addElement('div', {
      parent: memoryGame,
      classList: ['memory-card'],
      attr: {
        'data-name': name,
        style: `height: ${cardSize}; width : ${cardSize}; font-size: ${fontSize};`,
      },
    });
    addElement('div', {
      parent: memoryCard,
      classList: ['front-face'],
      content: name,
    });
    addElement('img', {
      parent: memoryCard,
      classList: ['back-face'],
      attr: { src: './img/back.jpg', alt: 'рубашка' },
    });
    return memoryCard;
  }

  let count = 4;
  let countTimer = 60;
  const cards = [...document.querySelectorAll('.memory-card')];
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard;
  let secondCard;
  let timer = null;
  let flipCard = () => {};
  let restart = () => {};
  let reshape = () => {};
  let decrementCount = () => {};

  function shuffle() {
    decrementCount();
    cards.forEach((card) => {
      const ramdomPos = Math.floor(Math.random() * 16);
      card.style.order = ramdomPos;
    });
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }
  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
  }

  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');

      resetBoard();
    }, 700);
  }

  function createCards() {
    cards.forEach((card) => card.remove());
    cards.length = 0;
    const memoryGame = document.querySelector('div.memory-game');

    const cardSize = `${640 / count - 20}px`;
    const fontSize = `${350 / count}px`;

    for (let i = 0; i < (count * count) / 2; i++) {
      cards.push(addCard(`${i + 1}`, { cardSize, fontSize }, memoryGame));
      cards.push(addCard(`${i + 1}`, { cardSize, fontSize }, memoryGame));
    }
    restart();
  }

  function initializePage() {
    let button;
    let buttonWrapper;
    function getDialogResult(newCount, newCountTimer) {
      count = newCount;
      countTimer = newCountTimer;
      button.textContent = 'Перемешать заново';
      createCards();
    }

    const { showDialog } = createDialog(getDialogResult,
      () => buttonWrapper.removeAttribute('style'));

    showDialog();

    buttonWrapper = addElement('div', {
      parent: document.body,
      classList: ['input-group-append', 'game-panel'],
      attr: { style: 'display: none;' },
    });

    const divTimer = addElement('div', {
      parent: buttonWrapper,
      classList: ['div-timer'],
    });

    const timerText = addElement('span', {
      parent: divTimer,
    });

    const divProgress = addElement('div', {
      parent: divTimer,
      classList: ['div-progress-timer'],
    });

    const resizeButton = addElement('button', {
      content: 'Изменить размер поля',
      classList: ['btn', 'btn-replay'],
      parent: buttonWrapper,
      attr: { style: 'margin: 0 10px;' },
    });

    button = addElement('button', {
      content: 'Перемешать заново',
      parent: buttonWrapper,
      classList: ['btn', 'btn-replay'],
    });

    resizeButton.addEventListener('click', showDialog);

    return { button, timerText, divProgress };
  }

  const { button, timerText, divProgress } = initializePage();

  function checkWin() {
    for (const card of cards) {
      if (!card.classList.contains('flip')) return;
    }
    clearInterval(timer);
    timerText.textContent = 'УРА!';
    button.textContent = 'Сыграть ещё раз';
  }

  function checkForMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {
      disableCards();
      checkWin();
      return;
    }
    unflipCards();
  }

  flipCard = (event) => {
    if (lockBoard) return;
    if (event.target === firstCard) return;

    event.target.classList.add('flip');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = event.target;
      return;
    }

    secondCard = event.target;
    lockBoard = true;

    checkForMatch();
  };

  restart = () => {
    cards.forEach((card) => {
      card.addEventListener('click', flipCard);
      card.classList.remove('flip');
    });

    resetBoard();
    setTimeout(shuffle, 500);
  };

  reshape = () => {
    lockBoard = true;
    cards.forEach((card) => card.classList.add('flip'));
    setTimeout(restart, button.textContent === 'Перемешать заново' ? 500 : 0);
    button.textContent = 'Перемешать заново';
  };
  decrementCount = () => {
    timerText.textContent = countTimer;
    clearInterval(timer);

    const stopTime = +new Date() + countTimer * 1000;
    timer = setInterval(() => {
      const time = Math.ceil((stopTime - new Date()) / 1000);

      timerText.textContent = time;

      if (time <= 0) {
        clearInterval(timer);
        timerText.textContent = 'время истекло';
        reshape();
      } else {
        divProgress.setAttribute(
          'style',
          `width: ${(100 * (stopTime - new Date())) / countTimer / 1000}%`,
        );
      }
    }, 50);
  };

  button.addEventListener('click', reshape);
});
