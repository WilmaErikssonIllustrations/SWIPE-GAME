document.addEventListener("DOMContentLoaded", () => {
  const startView = document.getElementById("start-view");
  const selectView = document.getElementById("select-view");
  const swipeView = document.getElementById("swipe-view");

  const playBtn = document.getElementById("play-btn");

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

  let currentCards = [];
  let currentCardIndex = 0;

  let scores = {
    active: 0,
    "not active": 0,
    tricks: 0,
  };

  const swipeCard = document.getElementById("swipe-card");
  const cardImg = document.getElementById("card-img");
  const swipeText = document.getElementById("swipe-text");
  const actionButtons = document.getElementById("action-buttons");

  function triggerCardAnimation() {
    swipeCard.classList.remove("animate-in");
    void swipeCard.offsetWidth; // Triggar omflyttning (reflow) för att starta om animationen
    swipeCard.classList.add("animate-in");
  }

  // Hjälpfunktion för att blanda en array slumpmässigt
  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // Återställ poängen vid ny spelomgång
  function resetScores() {
    scores.active = 0;
    scores["not active"] = 0;
    scores.tricks = 0;
  }

  // Förladda ALLA bilder i minnet direkt vid start
  function preloadAllImages() {
    const allCards = [...dogCards, ...catCards];
    const extraImages = ["assets/cat2.webp", "assets/dog.webp"];

    [...allCards.map((c) => c.img), ...extraImages].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  // Kör förladdningen direkt när sidan laddas
  preloadAllImages();

  // Uppdaterar innehållet på kortet eller visar resultatet
  function updateCardContent() {
    if (currentCardIndex < currentCards.length) {
      swipeCard.classList.remove("result-mode");
      cardImg.style.display = "block";
      actionButtons.style.display = "flex";

      cardImg.src = currentCards[currentCardIndex].img;
      swipeText.textContent = currentCards[currentCardIndex].text;
      triggerCardAnimation();
    } else {
      showResult();
    }
  }

  // Räkna ut vilken kategori som fick flest "Ja" och visa resultatet
  // Räkna ut vilken kategori som fick flest "Ja" och visa resultatet
  function showResult() {
    let winningCategory = "not active";
    let highestScore = -1;

    for (const [category, count] of Object.entries(scores)) {
      if (count > highestScore) {
        highestScore = count;
        winningCategory = category;
      }
    }

    const result = profiles[winningCategory];

    // Visa bilden för den vinnande profilen istället för att dölja den helt!
    cardImg.style.display = "block";
    cardImg.src = result.img;

    actionButtons.style.display = "none";
    swipeCard.classList.add("result-mode");

    // Sätt texten och lägg till en "Spela igen"-knapp direkt i texten eller under
    swipeText.innerHTML = `
      <strong>Din profil: ${result.title}</strong><br><br>
      ${result.description}<br><br>
      <button id="restart-btn" class="play-btn" style="margin: 12px auto 0 auto; width: 110px; height: 40px; font-size: 14px;">Spela igen</button>
    `;

    triggerCardAnimation();

    // Koppla funktion till starta om-knappen
    document.getElementById("restart-btn")?.addEventListener("click", () => {
      swipeCard.classList.remove("result-mode");
      swipeView.classList.add("hidden");
      startView.classList.remove("hidden"); // Skickar tillbaka till startvyn
    });
  }

  // Gå från startsida till djurval
  playBtn.addEventListener("click", () => {
    startView.classList.add("hidden");
    selectView.classList.remove("hidden");
  });

  // Klicka på djurkort (Hund eller Katt)
  const petCards = document.querySelectorAll(".pet-card");
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

  // --- KONTROLLERA OM SWIPE SKA TILLÅTAS ---
  const isSwipeAllowed = () => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    const isSmallerThanLaptop = window.innerWidth < 1024;

    return isTouch && isSmallerThanLaptop;
  };

  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  swipeCard.addEventListener("touchstart", (e) => {
    if (!isSwipeAllowed() || currentCardIndex >= currentCards.length) return;

    isDragging = true;
    startX = e.touches[0].clientX;
    swipeCard.style.transition = "none";
    swipeCard.classList.remove("animate-in");
  });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || !isSwipeAllowed()) return;
    currentX = e.touches[0].clientX - startX;
    const rotate = currentX * 0.1;
    swipeCard.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
  });

  window.addEventListener("touchend", () => {
    if (!isDragging || !isSwipeAllowed()) return;
    isDragging = false;

    swipeCard.style.transition = "transform 0.3s ease";

    if (currentX > 100) {
      swipeCard.style.transform = "translateX(1000px) rotate(30deg)";
      registerChoice(true);
      nextCard(300);
    } else if (currentX < -100) {
      swipeCard.style.transform = "translateX(-1000px) rotate(-30deg)";
      registerChoice(false);
      nextCard(300);
    } else {
      swipeCard.style.transform = "translateX(0px) rotate(0deg)";
    }
  });

  function registerChoice(isLike) {
    if (isLike && currentCardIndex < currentCards.length) {
      const currentCategory = currentCards[currentCardIndex].category;
      if (scores[currentCategory] !== undefined) {
        scores[currentCategory]++;
      }
    }
  }

  // Går till nästa kort
  function nextCard(delay = 0) {
    if (delay === 0) {
      currentCardIndex++;
      swipeCard.style.transition = "none";
      swipeCard.style.transform = "translateX(0px) rotate(0deg)";
      currentX = 0;
      updateCardContent();
    } else {
      setTimeout(() => {
        currentCardIndex++;
        swipeCard.style.transition = "none";
        swipeCard.style.transform = "translateX(0px) rotate(0deg)";
        currentX = 0;
        updateCardContent();
      }, delay);
    }
  }

  // Klicka på Hjärta (Ja)
  document.getElementById("like-btn")?.addEventListener("click", () => {
    registerChoice(true);
    // Använd swipe-animation på mobil och tablet (< 1024px), men inte på laptop
    if (window.innerWidth < 1024) {
      swipeCard.style.transition = "transform 0.3s ease";
      swipeCard.style.transform = "translateX(1000px) rotate(30deg)";
      nextCard(300);
    } else {
      nextCard(0);
    }
  });

  // Klicka på Kryss (Nej)
  document.getElementById("reject-btn")?.addEventListener("click", () => {
    registerChoice(false);
    // Använd swipe-animation på mobil och tablet (< 1024px), men inte på laptop
    if (window.innerWidth < 1024) {
      swipeCard.style.transition = "transform 0.3s ease";
      swipeCard.style.transform = "translateX(-1000px) rotate(-30deg)";
      nextCard(300);
    } else {
      nextCard(0);
    }
  });
});
