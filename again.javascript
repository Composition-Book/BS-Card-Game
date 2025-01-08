<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Game</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            color: blue;
        }

        .buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        button {
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            background-color: #007BFF;
            color: white;
            cursor: pointer;
        }

        button:hover {
            background-color: #0056b3;
        }

        .container {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .box {
            border: 2px solid black;
            border-radius: 5px;
            margin: 10px;
            padding: 10px;
            width: 300px;
            height: 400px;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            overflow: hidden;
        }

        .discard-box {
            position: relative;
            width: 300px;
            height: 200px;
            background-color: white;
            border: 2px solid red;
            margin: 50px auto;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .discard-counter {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background-color: black;
            border: 2px solid black;
            padding: 5px 10px;
            font-weight: bold;
            font-size: 16px;
            white-space: nowrap;
            min-width: 50px;
            min-height: 20px;
            text-align: center;
            color: white;
            z-index: 10;
        }

        .card {
            margin: 2px;
            padding: 5px;
            border: 1px solid black;
            border-radius: 3px;
            background-color: white;
            text-align: center;
            font-size: 14px;
            cursor: grab;
            user-select: none;
            width: 30px;
            height: 40px;
        }

        .hidden {
            background-color: gray;
            color: gray;
        }

        .red {
            color: red;
        }

        .black {
            color: black;
        }

        .committed-area {
            position: absolute;
            bottom: 10px;
            left: 10px;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
            gap: -20px;
            pointer-events: none;
        }

        .committed-card {
            background-color: gray;
            color: transparent;
            border: 1px solid black;
            width: 30px;
            height: 40px;
        }
    </style>
</head>
<body>
    <!-- Section: Button Controls -->
    <div class="buttons">
        <button id="bsButton">BS!</button>
        <button id="playCardsButton">Play Cards!</button>
        <button id="dealCardsButton">Deal Cards</button>
    </div>

    <!-- Section: Card Containers -->
    <div class="container">
        <div id="box1" class="box"></div>
        <div id="box2" class="box"></div>
        <div id="box3" class="box"></div>
        <div id="discard" class="box discard-box">
            <div class="discard-counter">0</div>
            <div class="committed-area"></div>
        </div>
    </div>

    <div id="currentCardDisplay" style="width: 100px; height: 50px; border: 1px solid #000; text-align: center; font-size: 18px; padding: 10px;">
        Current Card: <span id="currentCard">A</span>
    </div>

    <script>
        const suits = ["♥", "♦", "♣", "♠"];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        const deck = [];

        suits.forEach((suit, suitIndex) => {
            ranks.forEach(rank => {
                const isRed = suitIndex < 2; // Hearts and Diamonds are red
                deck.push({ suit, rank, isRed });
            });
        });

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        let box1Cards = [];
        let box2Cards = [];
        let box3Cards = [];
        let currentCardIndex = 0;

        const renderBox = (boxId, cards, isHidden) => {
            const boxDiv = document.getElementById(boxId);
            boxDiv.innerHTML = "";
            cards.forEach(card => {
                const cardDiv = document.createElement("div");
                cardDiv.className = "card";
                cardDiv.draggable = true;
                if (isHidden) {
                    cardDiv.classList.add("hidden");
                } else {
                    cardDiv.classList.add(card.isRed ? "red" : "black");
                    cardDiv.textContent = `${card.rank}${card.suit}`;
                }
                boxDiv.appendChild(cardDiv);
            });
        };

        document.getElementById("dealCardsButton").addEventListener("click", () => {
            shuffle(deck);
            box1Cards = deck.slice(0, 17);
            box2Cards = deck.slice(17, 34);
            box3Cards = deck.slice(34, 52);
            renderBox("box1", box1Cards, false);
            renderBox("box2", box2Cards, true);
            renderBox("box3", box3Cards, true);
            document.getElementById("dealCardsButton").style.display = "none";
        });

        document.getElementById("playCardsButton").addEventListener("click", () => {
            const discardBox = document.getElementById("discard");
            const discardCounter = discardBox.querySelector(".discard-counter");
            const committedArea = discardBox.querySelector(".committed-area");

            const discardCards = Array.from(discardBox.children).filter(child => child.classList.contains('card'));
            discardCards.forEach(cardDiv => {
                const committedCard = document.createElement("div");
                committedCard.className = "committed-card";
                committedCard.textContent = cardDiv.textContent;
                committedArea.appendChild(committedCard);
                cardDiv.remove();
            });

            discardCounter.textContent = committedArea.children.length;

            if (currentCardIndex < ranks.length - 1) {
                currentCardIndex++;
            } else {
                currentCardIndex = 0;
            }
            document.getElementById("currentCard").textContent = ranks[currentCardIndex];
        });

        document.getElementById("bsButton").addEventListener("click", () => {
            alert('BS! This button would check a move and reset accordingly.');
        });
    </script>
</body>
</html>
