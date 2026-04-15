const tg = window.Telegram.WebApp;
tg.expand();

const gameBoard = document.getElementById('game-board');

// Створюємо масив з номерами картинок (від 1 до 25) по два рази
let cardsIcons = [];
for (let i = 1; i <= 25; i++) {
    cardsIcons.push(i, i);
}

// Перемішуємо
cardsIcons.sort(() => 0.5 - Math.random());

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matches = 0;

function createBoard() {
    let cardIndex = 0;

    // Цикл на 54 ітерації (9x6)
    for (let i = 1; i <= 54; i++) {
        const item = document.createElement('div');

        // Перевірка, чи це кут (1-ша, 9-та, 46-та або 54-та клітинка)
        if (i === 1 || i === 9 || i === 46 || i === 54) {
            item.classList.add('spacer');
        } else {
            // Це звичайна картка
            const iconNum = cardsIcons[cardIndex];
            item.classList.add('memory-card');
            item.dataset.icon = iconNum;

            item.innerHTML = `
                <div class="front-face">
                    <img src="images/${iconNum}.png" alt="card">
                </div>
                <div class="back-face">?</div>
            `;
            item.addEventListener('click', flipCard);
            cardIndex++;
        }
        gameBoard.appendChild(item);
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matches += 2;
    if (matches === 50) {
        setTimeout(() => {
            tg.showAlert('Перемога! Всі пари знайдено!');
        }, 500);
    }
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 800);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

createBoard();