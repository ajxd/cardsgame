$(function() {
  const cardImages = [
    "images/card_1.png",
    "images/card_2.png",
    "images/card_3.png",
    "images/card_4.png",
    "images/card_5.png",
    "images/card_6.png",
    "images/card_7.png",
    "images/card_8.png",
    "images/card_9.png",
    "images/card_10.png",
    "images/card_11.png",
    "images/card_12.png",
    "images/card_13.png",
    "images/card_14.png",
    "images/card_15.png",
    "images/card_16.png",
    "images/card_17.png",
    "images/card_18.png",
    "images/card_19.png",
    "images/card_20.png",
    "images/card_21.png",
    "images/card_22.png",
    "images/card_23.png",
    "images/card_24.png",
    "images/back.png",
    "images/blank.png"
  ];

  const shuffleArray = (array) => {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  let highScore = 0;
  let numCards = 0;
  let totalPairs = 0;
  let attempts = 0;
  let successfulMatches = 0;
  let flippedCards = [];
  let isAnimating = false; // Flag to track animation status

  const loadCards = () => {
    console.log("Loading cards...");
    const cardsContainer = $("#cards");
    cardsContainer.empty();

    numCards = parseInt(sessionStorage.getItem("numCards"));
    totalPairs = numCards / 2;

    // Shuffling the card images
    const shuffledImages = shuffleArray(cardImages.slice(0, totalPairs));

    const cards = [];
    for (let i = 0; i < totalPairs; i++) {
      cards.push(shuffledImages[i]);
      cards.push(shuffledImages[i]);
    }

    // Shuffling the cards array
    const shuffledCards = shuffleArray(cards);

    const numRows = Math.ceil(numCards / 8);
    const numCardsPerRow = Math.ceil(numCards / numRows);

    for (let i = 0; i < numRows; i++) {
      const rowDiv = $("<div>").addClass("row");
      for (let j = 0; j < numCardsPerRow; j++) {
        const cardSrc = shuffledCards[i * numCardsPerRow + j];

        const cardLink = $("<a></a>").attr("href", "#").attr("id", cardSrc);

        const cardImage = $("<img>").attr("src", "images/back.png").attr("alt", "");

        cardLink.append(cardImage);
        rowDiv.append(cardLink);
      }
      cardsContainer.append(rowDiv);
    }
  };

  $("#tabs").tabs({
    activate: function(event, ui) {
      if (ui.newPanel.attr("id") === "tabs-1") {
        loadCards();
      }
    }
  });

  $("#tabs-3").on("click", "#save_settings", function() {
    const playerName = $("#player_name").val();
    numCards = parseInt($("#num_cards").val());

    sessionStorage.setItem("playerName", playerName);
    sessionStorage.setItem("numCards", numCards.toString());

    loadCards();

    $("#tabs").tabs("option", "active", 0);
    $("#player").text("Player: " + playerName);
  });

  const playerName = sessionStorage.getItem("playerName");
  $("#player").text("Player: " + playerName);

  const storedHighScore = localStorage.getItem("highScore");
  if (storedHighScore) {
    highScore = parseFloat(storedHighScore);
    $("#high_score").text("High Score: " + highScore.toFixed(2) + "%");
  }

  loadCards();
  $("#tabs").tabs("option", "active", 0);

  const handleCardClick = function() {
    if (isAnimating) {
      return;
    }

    const card = $(this);
    const cardImage = card.find("img");

    if (cardImage.attr("src") !== "images/back.png" || card.hasClass("matched")) {
      return;
    }

    cardImage.fadeOut(500, () => {
      cardImage.attr("src", card.attr("id")).fadeIn(500);
    });

    flippedCards.push(card);

    if (flippedCards.length === 2) {
      attempts++;

      const card1 = flippedCards[0];
      const card2 = flippedCards[1];

      if (card1.attr("id") === card2.attr("id")) {
        isAnimating = true;

        setTimeout(() => {
          flippedCards.forEach((flippedCard) => {
            flippedCard.slideUp(500, () => {
              $(this).addClass("matched").remove();
            });
          });

          successfulMatches++;
          const accuracy = (successfulMatches / attempts) * 100;
          if (accuracy >= highScore) {
            highScore = accuracy;
            localStorage.setItem("highScore", highScore);
          }

          $("#high_score").text("High Score: " + highScore.toFixed(2) + "%");
          $("#accuracy").text("Correct: " + accuracy.toFixed(2) + "%");

          flippedCards = [];
          isAnimating = false;
        }, 1000);
      } else {
        isAnimating = true;

        setTimeout(() => {
          card1.find("img").fadeOut(500, () => {
            $(this).attr("src", "images/back.png").fadeIn(400);
          });
          card2.find("img").fadeOut(500, () => {
            $(this).attr("src", "images/back.png").fadeIn(400, () => {
              isAnimating = false;
            });
          });

          flippedCards = [];
          isAnimating = false;
        }, 2000);
      }
    }
  };

  $("#cards").on("click", "a", handleCardClick);

  $("#new_game a").click((event) => {
    event.preventDefault();
    sessionStorage.clear();
    attempts = 0;
    successfulMatches = 0;
    $("#high_score").text("High Score: " + highScore.toFixed(2) + "%");
    $("#accuracy").text("Correct: 0.00%");
    flippedCards = [];
    isAnimating = false;
    loadCards();
  });
});
