document.addEventListener("DOMContentLoaded", () => {
  const startView = document.getElementById("start-view");
  const selectView = document.getElementById("select-view");
  const swipeView = document.getElementById("swipe-view");

  const playBtn = document.getElementById("play-btn");

  // --- KORT FÖR HUND ---
  const dogCards = [
    {
      img: "assets/running.jpg",
      text: "jag älskar att ta hunden med på träningspasset",
    },
    {
      img: "assets/eco-food.jpg",
      text: "ekologisk mat är viktigt för både mig och min hund",
    },
  ];

  // --- KORT FÖR KATT ---
  const catCards = [
    {
      img: "assets/cozy.jpg",
      text: "jag föredrar lugna kvällar i soffan med min katt",
    },
    {
      img: "assets/eco-food.jpg",
      text: "ekologisk mat är viktigt för både mig och min katt",
    },
  ];

  let currentCards = [];
  let currentCardIndex = 0;

  const swipeCard = document.querySelector(".swipe-card");
  const cardImg = document.getElementById("card-img");
  const swipeText = document.getElementById("swipe-text");

  // Uppdaterar innehållet på kortet
  function updateCardContent() {
    if (currentCardIndex < currentCards.length) {
      cardImg.src = currentCards[currentCardIndex].img;
      swipeText.textContent = currentCards[currentCardIndex].text;
    } else {
      swipeText.textContent = "Inga fler kort!";
    }
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
        currentCards = dogCards;
      } else if (selectedPet === "katt") {
        currentCards = catCards;
      }

      selectView.classList.add("hidden");
      swipeView.classList.remove("hidden");
      currentCardIndex = 0;
      updateCardContent();
    });
  });

  // --- KONTROLLERA OM SWIPE SKA TILLÅTAS (ENDAST MOBIL & TABLET, DVS UNDER 1024px) ---
  const isSwipeAllowed = () => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    const isSmallerThanLaptop = window.innerWidth < 1024;

    return isTouch && isSmallerThanLaptop;
  };

  // --- SWIPE (MOBIL OCH TABLET) ---
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // Lyssna direkt på kortet istället för hela swipeView
  swipeCard.addEventListener("touchstart", (e) => {
    if (!isSwipeAllowed()) return;

    isDragging = true;
    startX = e.touches[0].clientX;
    swipeCard.style.transition = "none";
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
      nextCard(300);
    } else if (currentX < -100) {
      swipeCard.style.transform = "translateX(-1000px) rotate(-30deg)";
      nextCard(300);
    } else {
      swipeCard.style.transform = "translateX(0px) rotate(0deg)";
    }
  });

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

  // --- KNAPPHÄNDELSER ---
  const undoBtn = document.getElementById("undo-btn");
  const rejectBtn = document.getElementById("reject-btn");
  const likeBtn = document.getElementById("like-btn");

  undoBtn?.addEventListener("click", () => {
    if (currentCardIndex > 0) {
      currentCardIndex--;
      updateCardContent();
    } else {
      swipeView.classList.add("hidden");
      selectView.classList.remove("hidden");
    }
  });

  rejectBtn?.addEventListener("click", () => {
    if (isSwipeAllowed()) {
      swipeCard.style.transition = "transform 0.3s ease";
      swipeCard.style.transform = "translateX(-1000px) rotate(-30deg)";
      nextCard(300);
    } else {
      // Laptop: Byt kort direkt utan animering
      nextCard(0);
    }
  });

  likeBtn?.addEventListener("click", () => {
    if (isSwipeAllowed()) {
      swipeCard.style.transition = "transform 0.3s ease";
      swipeCard.style.transform = "translateX(1000px) rotate(30deg)";
      nextCard(300);
    } else {
      // Laptop: Byt kort direkt utan animering
      nextCard(0);
    }
  });
});
