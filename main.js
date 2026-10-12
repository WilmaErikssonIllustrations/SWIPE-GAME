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
  const petCards = document.querySelectorAll(".pet-card");
  const swipeThreshold = 100;
  const swipeDuration = 300;
  const desktopBreakpoint = 1024;
  const offscreenDistance = 1000;
  const exitRotation = 30;

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
    {
      img: "assets/energetic-dog.webp",
      text: "min hund är en riktig energikick precis som jag",
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

  function updateCardContent() {
    resetStamps();
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
    const [winningCategory] = Object.entries(scores).reduce((winner, entry) =>
      entry[1] > winner[1] ? entry : winner,
    );
    const result = profiles[winningCategory];

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
    const opacity = Math.min(Math.abs(currentX) / swipeThreshold, 1);

    if (currentX > 0) {
      stampLike.style.opacity = opacity;
      stampNope.style.opacity = 0;
    } else {
      stampNope.style.opacity = opacity;
      stampLike.style.opacity = 0;
    }
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

  function registerChoice(isLike) {
    if (!isLike || currentCardIndex >= currentCards.length) return;

    const category = currentCards[currentCardIndex].category;
    if (Object.hasOwn(scores, category)) {
      scores[category]++;
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

  function handleButtonChoice(isLike) {
    swipeHint.classList.add("hidden");
    registerChoice(isLike);

    if (window.innerWidth < desktopBreakpoint) {
      swipeCard.classList.remove("animate-in");
      swipeCard.style.transition = "none";
      swipeCard.style.transform = "translateX(0px) rotate(0deg)";
      void swipeCard.offsetWidth;
      animateCardOut(isLike);
      nextCard(swipeDuration);
      return;
    }

    nextCard();
  }

  likeBtn.addEventListener("click", () => handleButtonChoice(true));
  rejectBtn.addEventListener("click", () => handleButtonChoice(false));
});
