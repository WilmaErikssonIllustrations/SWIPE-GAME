"use strict";

document.addEventListener("DOMContentLoaded", () => {
  function getRequiredElement(id) {
    const element = document.getElementById(id);

    if (!element) {
      throw new Error(`Required element #${id} was not found.`);
    }

    return element;
  }

  const startView = getRequiredElement("start-view");
  const selectView = getRequiredElement("select-view");
  const swipeView = getRequiredElement("swipe-view");
  const playBtn = getRequiredElement("play-btn");
  const swipeCard = getRequiredElement("swipe-card");
  const cardImg = getRequiredElement("card-img");
  const swipeText = getRequiredElement("swipe-text");
  const actionButtons = getRequiredElement("action-buttons");
  const swipeHint = getRequiredElement("swipe-hint");
  const stampLike = getRequiredElement("stamp-like");
  const stampNope = getRequiredElement("stamp-nope");
  const likeBtn = getRequiredElement("like-btn");
  const rejectBtn = getRequiredElement("reject-btn");
  const deck = getRequiredElement("deck");
  const tieResult = getRequiredElement("tie-result");
  const tieHeading = getRequiredElement("tie-heading");
  const tieSubtitle = getRequiredElement("tie-subtitle");
  const tieCards = getRequiredElement("tie-cards");
  const tieRestartBtn = getRequiredElement("tie-restart-btn");
  const deckGhosts = [
    getRequiredElement("deck-ghost-1"),
    getRequiredElement("deck-ghost-2"),
  ];
  const petCards = document.querySelectorAll(".pet-card");
  const swipeThreshold = 100;
  const swipeDuration = 300;
  const desktopBreakpoint = 1024;
  const offscreenDistance = 1000;
  const exitRotation = 30;
  const deckExitDuration = 420;
  const deckAdvanceDuration = 350;
  const deckExitRotation = 26;
  const deckStepY = 14;
  const deckStepScale = 0.05;

  const profiles = {
    active: {
      title: "Äventyraren",
      img: "assets/bike-.webp",
      description:
        "Du och ditt husdjur lever för rörelse och frisk luft! Oavsett om det handlar om utflykter, löprundor eller upptäcktsfärder är aktivitet och samspel er nyckel till lycka.",
    },
    tricks: {
      title: "TassTränaren",
      img: "assets/cute.webp",
      description:
        "Du älskar mental stimulans och kommunikation! För dig är det roligaste som finns att utmana djurets hjärna med konster, klicker, pussel och roliga uppgifter.",
    },
    "not active": {
      title: "MysMaxaren",
      img: "assets/sleep.webp",
      description:
        "Hemmet är er trygga oas och gosa är er främsta hobby! Lugn och ro, mjuka filtar och kravlösa stunder i soffan är vad du och ditt husdjur värdesätter allra mest.",
    },
  };

  // --- KORT FÖR HUND ---
  const dogCards = [
    // active
    {
      img: "assets/running (1).webp",
      text: "jag älskar att ta hunden med på träningspasset",
      category: "active",
    },
    {
      img: "assets/hunt.webp",
      text: "en speciell stund för mig och min hund är när vi jagar tillsammans",
      category: "active",
    },
    {
      img: "assets/long-walk.webp",
      text: "långa promenader i naturen är min bästa återhämtning",
      category: "active",
    },

    // not active
    {
      img: "assets/dog-blanket.webp",
      text: "min hund har nog fler mysiga filtar och gosedjur än de flesta",
      category: "not active",
    },
    {
      img: "assets/calm-dog.webp",
      text: "min hunnd påminner mig om hur viktigt det är att unna sig stunder av lugn och ro",
      category: "not active",
    },
    {
      img: "assets/sofa-dog (1).webp",
      text: "att mysa länge i soffan med min hund är bland det bästa jag vet",
      category: "not active",
    },

    // tricks
    {
      img: "assets/agility.webp",
      text: "jag tränar agility, lydnad eller spår minst en gång i veckan",
      category: "tricks",
    },
    {
      img: "assets/dog-trick.webp",
      text: "jag lär gärna min hund nya konster och kluriga trick",
      category: "tricks",
    },
    {
      img: "assets/dog-puzzle.webp",
      text: "min hund får ofta sin mat i pussel eller aktiveringsleksaker",
      category: "tricks",
    },

    //no category extras
    {
      img: "assets/eco-food.webp",
      text: "ekologisk mat är viktigt för både mig och min hund",
    },
  ];

  // --- KORT FÖR KATT ---
  const catCards = [
    // active
    {
      img: "assets/outdoor-cat (1).webp",
      text: "min katt älskar att vara ute i naturen precis som jag",
      category: "active",
    },
    {
      img: "assets/cat-walk.webp",
      text: "jag går gärna ut med min katt i sele och koppel",
      category: "active",
    },
    {
      img: "assets/active-cat.webp",
      text: "katter ska vara aktiva och röra på sig ordentligt",
      category: "active",
    },

    // not active
    {
      img: "assets/cozy-cat.webp",
      text: "jag föredrar lugna kvällar i soffan med min katt",
      category: "not active",
    },
    {
      img: "assets/cat-lap.webp",
      text: "Om det finns en katt i mitt knä så förblir jag",
      category: "not active",
    },
    {
      img: "assets/inside-cat.webp",
      text: "min katt är en del av familjen och tryggast inomhus",
      category: "not active",
    },

    // tricks
    {
      img: "assets/smart-cat (1).webp",
      text: "med en intelligent katt som min är aktivering viktigt",
      category: "tricks",
    },
    {
      img: "assets/cat-food-toy.webp",
      text: "min katt får ibland lösa foderpussel för att få sina godbitar",
      category: "tricks",
    },
    {
      img: "assets/high-five-cat.webp",
      text: "jag är så stolt över de trick min katt kan göra.",
      category: "tricks",
    },

    // no category extras
    {
      img: "assets/eco-food.webp",
      text: "ekologisk mat är viktigt för både mig och min katt",
    },
  ];

  const scores = {
    active: 0,
    "not active": 0,
    tricks: 0,
  };

  let currentCards = [];
  let currentCardIndex = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let isDeckAnimating = false;

  function triggerCardAnimation() {
    swipeCard.classList.remove("animate-in");
    void swipeCard.offsetWidth;
    swipeCard.classList.add("animate-in");
  }

  function shuffleArray(array) {
    const shuffled = [...array];

    for (let index = shuffled.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[index],
      ];
    }

    return shuffled;
  }

  function resetScores() {
    for (const category of Object.keys(scores)) {
      scores[category] = 0;
    }
  }

  function preloadAllImages() {
    const allCards = [...dogCards, ...catCards];
    const extraImages = ["assets/cat2.webp", "assets/dog.webp"];

    const imageSources = new Set([
      ...allCards.map(({ img }) => img),
      ...extraImages,
    ]);

    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  preloadAllImages();

  function deckTransform(position) {
    return `translateY(${position * deckStepY}px) scale(${1 - position * deckStepScale})`;
  }

  // Ställer tillbaka korten bakom och döljer dem som inte behövs mot slutet av leken
  function resetDeck() {
    const cardsLeft = currentCards.length - currentCardIndex - 1;

    deckGhosts.forEach((ghost, index) => {
      ghost.style.transition = "none";
      ghost.style.transform = "";
      ghost.classList.toggle("is-empty", index >= cardsLeft);
    });
  }

  function updateCardContent() {
    resetStamps();
    resetDeck();
    if (currentCardIndex < currentCards.length) {
      swipeCard.classList.remove("result-mode");
      cardImg.style.display = "block";
      actionButtons.style.display = "flex";

      cardImg.src = currentCards[currentCardIndex].img;
      swipeText.textContent = currentCards[currentCardIndex].text;

      // Visa hand-emojin (swipe hint) endast på allra första kortet
      if (currentCardIndex === 0) {
        swipeHint.classList.remove("hidden");
        swipeHint.style.animation = "none";
        void swipeHint.offsetWidth;
        swipeHint.style.animation = "swipePrompt 3.0s ease-in-out forwards";
      } else {
        swipeHint.classList.add("hidden");
      }

      triggerCardAnimation();
    } else {
      showResult();
    }
  }

  function showResult() {
    swipeHint.classList.add("hidden");
    resetStamps();
    // Andel gillade kort per kategori, så att kategorier med fler kort inte vinner oftare
    const likedShares = Object.fromEntries(
      Object.keys(scores).map((category) => {
        const cardCount = currentCards.filter(
          (card) => card.category === category,
        ).length;
        return [category, cardCount > 0 ? scores[category] / cardCount : 0];
      }),
    );
    const topShare = Math.max(...Object.values(likedShares));

    if (topShare === 0) {
      showNoLikesResult();
      return;
    }

    const winningCategories = Object.keys(likedShares).filter(
      (category) => Math.abs(likedShares[category] - topShare) < 1e-9,
    );

    if (winningCategories.length > 1) {
      showTieResult(winningCategories);
      return;
    }

    const result = profiles[winningCategories[0]];

    cardImg.style.display = "block";
    cardImg.src = result.img;

    actionButtons.style.display = "none";
    swipeCard.classList.add("result-mode");
    swipeText.replaceChildren();

    const resultTitle = document.createElement("strong");
    resultTitle.textContent = `Din profil: ${result.title}`;

    const resultDescription = document.createElement("span");
    resultDescription.textContent = result.description;

    const restartButton = document.createElement("button");
    restartButton.id = "restart-btn";
    restartButton.className = "play-btn restart-btn";
    restartButton.type = "button";
    restartButton.textContent = "Spela igen";

    swipeText.append(resultTitle, resultDescription, restartButton);

    triggerCardAnimation();

    restartButton.addEventListener("click", () => {
      swipeCard.classList.remove("result-mode");
      swipeView.classList.add("hidden");
      startView.classList.remove("hidden");
    });
  }

  // Lika poäng: visa alla profiler som delar förstaplatsen
  function showTieResult(categories) {
    const cards = categories.map((category) => {
      const profile = profiles[category];

      const card = document.createElement("article");
      card.className = "tie-card";

      const img = document.createElement("img");
      img.src = profile.img;
      img.alt = profile.title;

      const text = document.createElement("div");
      text.className = "tie-card-text";

      const title = document.createElement("strong");
      title.textContent = profile.title;

      const description = document.createElement("span");
      description.textContent = profile.description;

      text.append(title, description);
      card.append(img, text);
      return card;
    });

    showMessageResult(
      "Du har många sidor!",
      "Du fick lika många poäng i flera kategorier",
      cards,
    );
  }

  function showNoLikesResult() {
    showMessageResult("Du gillade inga kort", "testa igen!", []);
  }

  function showMessageResult(heading, subtitle, cards) {
    tieHeading.textContent = heading;
    tieSubtitle.textContent = subtitle;
    tieCards.replaceChildren(...cards);
    tieCards.classList.toggle("hidden", cards.length === 0);
    deck.classList.add("hidden");
    tieResult.classList.remove("hidden");
  }

  tieRestartBtn.addEventListener("click", () => {
    tieResult.classList.add("hidden");
    deck.classList.remove("hidden");
    swipeView.classList.add("hidden");
    startView.classList.remove("hidden");
  });

  playBtn.addEventListener("click", () => {
    startView.classList.add("hidden");
    selectView.classList.remove("hidden");
  });

  petCards.forEach((card) => {
    card.addEventListener("click", () => {
      const selectedPet = card.getAttribute("data-pet");

      if (selectedPet === "hund") {
        currentCards = shuffleArray(dogCards);
      } else if (selectedPet === "katt") {
        currentCards = shuffleArray(catCards);
      }

      resetScores();

      selectView.classList.add("hidden");
      swipeView.classList.remove("hidden");
      currentCardIndex = 0;
      updateCardContent();
    });
  });

  const isSwipeAllowed = () => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    return isTouch && window.innerWidth < desktopBreakpoint;
  };

  function animateCardOut(isLike) {
    const direction = isLike ? 1 : -1;
    swipeCard.style.transition = `transform ${swipeDuration / 1000}s ease`;
    swipeCard.style.transform = `translateX(${direction * offscreenDistance}px) rotate(${direction * exitRotation}deg)`;
  }

  swipeCard.addEventListener("touchstart", (e) => {
    if (!isSwipeAllowed() || currentCardIndex >= currentCards.length) return;

    swipeHint.classList.add("hidden");

    isDragging = true;
    startX = e.touches[0].clientX;
    currentX = 0;
    swipeCard.style.transition = "none";
    swipeCard.classList.remove("animate-in");
  });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || !isSwipeAllowed()) return;
    currentX = e.touches[0].clientX - startX;
    const rotate = currentX * 0.1;
    swipeCard.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
    updateStamps(currentX);
  });

  window.addEventListener("touchend", () => {
    if (!isDragging || !isSwipeAllowed()) return;
    isDragging = false;

    if (Math.abs(currentX) > swipeThreshold) {
      const isLike = currentX > 0;
      animateCardOut(isLike);
      (isLike ? stampLike : stampNope).style.opacity = 1;
      registerChoice(isLike);
      nextCard(swipeDuration);
    } else {
      swipeCard.style.transition = `transform ${swipeDuration / 1000}s ease`;
      swipeCard.style.transform = "translateX(0px) rotate(0deg)";
      resetStamps();
    }
  });

  window.addEventListener("touchcancel", () => {
    if (!isDragging) return;

    isDragging = false;
    currentX = 0;
    swipeCard.style.transition = `transform ${swipeDuration / 1000}s ease`;
    swipeCard.style.transform = "translateX(0px) rotate(0deg)";
    resetStamps();
  });

  // --- DRA MED MUSEN (ENDAST DESKTOP) ---
  const mouseDragRotation = 0.06;
  const mouseDragLiftY = 0.25;
  let mouseStartY = 0;
  let mouseOffsetY = 0;
  let isMouseDragging = false;

  const isMouseSwipeAllowed = (e) =>
    e.pointerType === "mouse" &&
    e.button === 0 &&
    window.innerWidth >= desktopBreakpoint &&
    currentCardIndex < currentCards.length &&
    !isDeckAnimating;

  // Hindrar webbläsarens egen bild-drag
  swipeCard.addEventListener("dragstart", (e) => e.preventDefault());

  swipeCard.addEventListener("pointerdown", (e) => {
    if (!isMouseSwipeAllowed(e)) return;

    isMouseDragging = true;
    startX = e.clientX;
    mouseStartY = e.clientY;
    currentX = 0;
    mouseOffsetY = 0;
    swipeCard.setPointerCapture(e.pointerId);
    swipeCard.style.transition = "none";
    swipeCard.classList.remove("animate-in");
    swipeCard.classList.add("is-dragging");
  });

  swipeCard.addEventListener("pointermove", (e) => {
    if (!isMouseDragging) return;

    currentX = e.clientX - startX;
    mouseOffsetY = (e.clientY - mouseStartY) * mouseDragLiftY;
    swipeCard.style.transform = `translate(${currentX}px, ${mouseOffsetY}px) rotate(${currentX * mouseDragRotation}deg)`;
    updateStamps(currentX);
  });

  function endMouseDrag(isCancelled) {
    if (!isMouseDragging) return;

    isMouseDragging = false;
    swipeCard.classList.remove("is-dragging");

    if (!isCancelled && Math.abs(currentX) > swipeThreshold) {
      const isLike = currentX > 0;
      registerChoice(isLike);
      animateDeckCardOut(isLike);
      return;
    }

    // Inte tillräckligt långt: kortet studsar tillbaka
    swipeCard.style.transition = "transform 0.35s cubic-bezier(0.3, 1.5, 0.5, 1)";
    swipeCard.style.transform = "translate(0px, 0px) rotate(0deg)";
    currentX = 0;
    resetStamps();
  }

  swipeCard.addEventListener("pointerup", () => endMouseDrag(false));
  swipeCard.addEventListener("pointercancel", () => endMouseDrag(true));

  function registerChoice(isLike) {
    if (!isLike || currentCardIndex >= currentCards.length) return;

    const category = currentCards[currentCardIndex].category;
    if (Object.hasOwn(scores, category)) {
      scores[category]++;
    }
  }

  // Stämpeln tonas in i takt med hur långt kortet dragits
  function updateStamps(dragX) {
    const opacity = Math.min(Math.abs(dragX) / swipeThreshold, 1);

    if (dragX > 0) {
      stampLike.style.opacity = opacity;
      stampNope.style.opacity = 0;
    } else {
      stampNope.style.opacity = opacity;
      stampLike.style.opacity = 0;
    }
  }

  function resetStamps() {
    stampLike.style.opacity = 0;
    stampNope.style.opacity = 0;
  }

  function nextCard(delay = 0) {
    const advance = () => {
      currentCardIndex++;
      swipeCard.style.transition = "none";
      swipeCard.style.transform = "translateX(0px) rotate(0deg)";
      currentX = 0;
      updateCardContent();
    };

    if (delay > 0) {
      window.setTimeout(advance, delay);
      return;
    }

    advance();
  }

  // Desktop: kortet kastas ut åt sidan medan korten bakom flyttar fram ett steg
  function animateDeckCardOut(isLike) {
    const direction = isLike ? 1 : -1;
    const distance = window.innerWidth + 420;

    isDeckAnimating = true;
    (isLike ? stampLike : stampNope).style.opacity = 1;

    swipeCard.classList.remove("animate-in");
    swipeCard.style.transition = `transform ${deckExitDuration / 1000}s cubic-bezier(0.3, 0.6, 0.4, 1)`;
    swipeCard.style.transform = `translateX(${direction * distance}px) rotate(${direction * deckExitRotation}deg)`;

    deckGhosts.forEach((ghost, index) => {
      ghost.style.transition = `transform ${deckAdvanceDuration / 1000}s ease`;
      ghost.style.transform = deckTransform(index);
    });

    window.setTimeout(() => {
      isDeckAnimating = false;
      nextCard();
    }, deckAdvanceDuration + 10);
  }

  function handleButtonChoice(isLike) {
    if (isDeckAnimating) return;

    swipeHint.classList.add("hidden");
    registerChoice(isLike);

    if (window.innerWidth >= desktopBreakpoint) {
      animateDeckCardOut(isLike);
      return;
    }

    swipeCard.classList.remove("animate-in");
    swipeCard.style.transition = "none";
    swipeCard.style.transform = "translateX(0px) rotate(0deg)";
    void swipeCard.offsetWidth;
    animateCardOut(isLike);
    nextCard(swipeDuration);
  }

  likeBtn.addEventListener("click", () => handleButtonChoice(true));
  rejectBtn.addEventListener("click", () => handleButtonChoice(false));
});
