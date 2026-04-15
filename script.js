// Ініціалізація Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Розгортаємо гру на весь екран
tg.ready();  // Повідомляємо Telegram, що додаток готовий

// Набір карток (пари)
const cardsArray = ['🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍉', '🍉', '🍓', '🍓', '🍒', '🍒'];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matches = 0;

const gameBoard = document.getElementById('game-board');

// Перемішування масиву
function shuffle(array) {
    array.sort(() => 0.5 - Math.random());
}

// Створення ігрового поля
function createBoard() {
    shuffle(cardsArray);
    cardsArray.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.emoji = item;

        card.innerHTML = `
            <div class="front-face">${item}</div>
            <div class="back-face">❓</div>
        `;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Логіка перевертання картки
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // Перший клік
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Другий клік
    secondCard = this;
    checkForMatch();
}

// Перевірка на збіг
function checkForMatch() {
    let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    isMatch ? disableCards() : unflipCards();
}

// Якщо картки збіглися
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    matches += 2;
    
    // Перевірка на перемогу
    if (matches === cardsArray.length) {
        setTimeout(() => {
            // Використовуємо нативне спливаюче вікно Telegram
            tg.showAlert('Вітаю! Ти знайшов усі пари! 🎉', () => {
                tg.close(); // Закриваємо міні-апп після натискання "ОК"
            });
        }, 500);
    }
}

// Якщо картки різні — перевертаємо назад
function unflipCards() {
    lockBoard = true; // Блокуємо поле на час анімації
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

// Скидання змінних
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Запуск гри
createBoard();