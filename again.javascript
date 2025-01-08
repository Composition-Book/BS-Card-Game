// HTML elements for the game
const deckElement = document.getElementById('deck');
const playerBoxes = [
    document.getElementById('player1'),
    document.getElementById('player2'),
    document.getElementById('player3')
];
const fieldElement = document.getElementById('field');
const discardPileElement = document.getElementById('discardPile');

// Card suits and values
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
];

let deck = [];
let gameState = {
    playerHands: [[], [], []],
    field: [],
    discardPile: []
};

// Create and shuffle deck
function initializeDeck() {
    deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({ suit, value });
        });
    });
    deck = shuffle(deck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Deal cards to players
function dealCards() {
    initializeDeck();
    gameState.playerHands = [[], [], []];

    for (let i = 0; i < deck.length; i++) {
        gameState.playerHands[i % 3].push(deck[i]);
    }

    renderGameState();
}

// Render the game state
function renderGameState() {
    playerBoxes.forEach((box, index) => {
        box.innerHTML = '';
        gameState.playerHands[index].forEach(card => {
            const cardElement = createCardElement(card, 'player');
            box.appendChild(cardElement);
        });
    });

    fieldElement.innerHTML = '';
    gameState.field.forEach(card => {
        const cardElement = createCardElement(card, 'field');
        fieldElement.appendChild(cardElement);
    });

    discardPileElement.innerHTML = '';
    gameState.discardPile.forEach(() => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card back'; // Hidden cards in discard pile
        discardPileElement.appendChild(cardElement);
    });
}

// Create card elements for rendering
function createCardElement(card, type) {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${type}`;
    cardElement.draggable = true;
    cardElement.dataset.suit = card.suit;
    cardElement.dataset.value = card.value;

    // Show card details for player hands, hide for computer hands
    if (type === 'player') {
        cardElement.innerHTML = `${card.value} <span class="${card.suit}">&${card.suit};</span>`;
    }

    cardElement.addEventListener('dragstart', handleDragStart);
    return cardElement;
}

// Drag-and-drop event handlers
let draggedCard = null;

function handleDragStart(event) {
    draggedCard = event.target;
}

fieldElement.addEventListener('dragover', event => {
    event.preventDefault();
});

fieldElement.addEventListener('drop', event => {
    event.preventDefault();
    if (draggedCard) {
        const card = {
            suit: draggedCard.dataset.suit,
            value: draggedCard.dataset.value
        };
        gameState.field.push(card);
        const playerIndex = playerBoxes.findIndex(box => box.contains(draggedCard));
        if (playerIndex >= 0) {
            gameState.playerHands[playerIndex] = gameState.playerHands[playerIndex].filter(
                c => c.suit !== card.suit || c.value !== card.value
            );
        }
        renderGameState();
    }
});

discardPileElement.addEventListener('dragover', event => {
    event.preventDefault();
});

discardPileElement.addEventListener('drop', event => {
    event.preventDefault();
    if (draggedCard) {
        const card = {
            suit: draggedCard.dataset.suit,
            value: draggedCard.dataset.value
        };
        gameState.discardPile.push(card);
        gameState.field = gameState.field.filter(
            c => c.suit !== card.suit || c.value !== card.value
        );
        renderGameState();
    }
});

// Button actions
document.getElementById('dealButton').addEventListener('click', dealCards);
document.getElementById('playButton').addEventListener('click', () => {
    gameState.discardPile.push(...gameState.field);
    gameState.field = [];
    renderGameState();
});
document.getElementById('resetButton').addEventListener('click', () => {
    gameState = {
        playerHands: [[], [], []],
        field: [],
        discardPile: []
    };
    renderGameState();
});
