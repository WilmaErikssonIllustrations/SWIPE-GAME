document.addEventListener("DOMContentLoaded", () => {
  const startView = document.getElementById("start-view");
  const selectView = document.getElementById("select-view");
  const swipeView = document.getElementById("swipe-view");

  const playBtn = document.getElementById("play-btn");

  // Gå från startsida till djurval
  playBtn.addEventListener("click", () => {
    startView.classList.add("hidden");
    selectView.classList.remove("hidden");
  });

  // Klicka på djurkort
  const petCards = document.querySelectorAll(".pet-card");
  petCards.forEach((card) => {
    card.addEventListener("click", () => {
      const selectedPet = card.getAttribute("data-pet");

      if (selectedPet === "hund") {
        selectView.classList.add("hidden");
        swipeView.classList.remove("hidden");
      } else {
        console.log("Katt vald!");
      }
    });
  });

  // --- SWIPE VARSOMHELST PÅ SKÄRMEN (MOBIL) ---
  const swipeCard = document.querySelector(".swipe-card");
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // Lyssna på touch-start på hela swipeView (hela skärmen i den vyn)
  swipeView.addEventListener("touchstart", (e) => {
    // Om man klickar på knapparna vill vi inte starta swipe
    if (e.target.closest(".action-btn")) return;

    isDragging = true;
    startX = e.touches[0].clientX;
    swipeCard.style.transition = "none";
  });

  // Dra var som helst på skärmen
  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX - startX;
    const rotate = currentX * 0.1;
    swipeCard.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
  });

  // Släpp fingret
  window.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;

    swipeCard.style.transition = "transform 0.3s ease";

    if (currentX > 100) {
      // Swipat åt HÖGER (Gilla)
      swipeCard.style.transform = "translateX(1000px) rotate(30deg)";
      console.log("Swipade HÖGER (Gilla)");
      resetCardPosition();
    } else if (currentX < -100) {
      // Swipat åt VÄNSTER (Neka)
      swipeCard.style.transform = "translateX(-1000px) rotate(-30deg)";
      console.log("Swipade VÄNSTER (Neka)");
      resetCardPosition();
    } else {
      // Återställ om man drar för lite
      swipeCard.style.transform = "translateX(0px) rotate(0deg)";
    }
  });

  // Återställer kortets position
  function resetCardPosition() {
    setTimeout(() => {
      swipeCard.style.transition = "none";
      swipeCard.style.transform = "translateX(0px) rotate(0deg)";
      currentX = 0;
    }, 300);
  }

  // --- KNAPPHÄNDELSER ---
  const undoBtn = document.getElementById("undo-btn");
  const rejectBtn = document.getElementById("reject-btn");
  const likeBtn = document.getElementById("like-btn");

  undoBtn?.addEventListener("click", () => {
    swipeView.classList.add("hidden");
    selectView.classList.remove("hidden");
  });

  rejectBtn?.addEventListener("click", () => {
    swipeCard.style.transition = "transform 0.3s ease";
    swipeCard.style.transform = "translateX(-1000px) rotate(-30deg)";
    resetCardPosition();
  });

  likeBtn?.addEventListener("click", () => {
    swipeCard.style.transition = "transform 0.3s ease";
    swipeCard.style.transform = "translateX(1000px) rotate(30deg)";
    resetCardPosition();
  });
});
