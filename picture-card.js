// Picture Card Stack JavaScript - Card Swipe Effect
document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("pictureCardWrapper");
  const stack = document.getElementById("pictureCardStack");
  const cards = stack ? stack.querySelectorAll(".picture-card-item") : [];

  if (!wrapper || !stack || cards.length === 0) {
    return;
  }

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let offsetX = 0;
  let offsetY = 0;
  let rotation = 0;
  let autoRotateInterval = null;

  // Handle image loading
  let loadedCount = 0;
  const totalImages = cards.length;

  function handleImageLoad() {
    loadedCount++;
    if (loadedCount >= totalImages) {
      wrapper.classList.add("loaded");
      startAutoRotate();
    }
  }

  function handleImageError(card) {
    loadedCount++;
    card.style.display = "none";
    if (loadedCount >= totalImages) {
      wrapper.classList.add("loaded");
      startAutoRotate();
    }
  }

  // Check if images are already loaded
  cards.forEach((card) => {
    const img = card.querySelector(".picture-card-image");
    if (img) {
      if (img.complete && img.naturalHeight !== 0) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
        img.addEventListener("error", () => handleImageError(card));
      }
    }
  });

  // Update card positions
  function updateCards() {
    cards.forEach((card, index) => {
      const cardIndex = parseInt(card.dataset.index);
      const relativeIndex =
        (cardIndex - currentIndex + cards.length) % cards.length;

      if (relativeIndex === 0) {
        // Active card
        const rotate = rotation;
        const translateX = offsetX;
        const translateY = offsetY;
        const dragIntensity = Math.min(Math.abs(offsetX) / 200, 1);
        const shadowIntensity = 0.3 + dragIntensity * 0.2;

        card.style.transform = `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(1)`;
        card.style.zIndex = "3";
        card.style.opacity = "1";
        card.style.boxShadow = `0 ${15 + dragIntensity * 10}px ${
          50 + dragIntensity * 20
        }px rgba(98, 80, 57, ${shadowIntensity})`;
        card.classList.add("swiping");
      } else if (relativeIndex === 1) {
        // Next card
        card.style.transform = `translateX(-20px) translateY(-20px) rotate(-3deg) scale(0.96)`;
        card.style.zIndex = "2";
        card.style.opacity = "0.9";
        card.style.boxShadow = `0 10px 40px rgba(98, 80, 57, 0.25)`;
        card.classList.remove("swiping");
      } else {
        // Back card
        card.style.transform = `translateX(-40px) translateY(-40px) rotate(-6deg) scale(0.92)`;
        card.style.zIndex = "1";
        card.style.opacity = "0.8";
        card.style.boxShadow = `0 10px 40px rgba(98, 80, 57, 0.25)`;
        card.classList.remove("swiping");
      }
    });
  }

  // Go to next card
  function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    offsetX = 0;
    offsetY = 0;
    rotation = 0;
    updateCards();
  }

  // Go to previous card
  function prevCard() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    offsetX = 0;
    offsetY = 0;
    rotation = 0;
    updateCards();
  }

  // Start auto rotation
  function startAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
    }
    autoRotateInterval = setInterval(() => {
      if (!isDragging) {
        nextCard();
      }
    }, 4000);
  }

  // Stop auto rotation
  function stopAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
  }

  // Mouse events
  stack.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    stopAutoRotate();
    stack.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    offsetX = currentX;
    offsetY = currentY;
    rotation = (currentX / 10) * 1; // Rotation based on horizontal drag

    updateCards();
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    stack.style.cursor = "grab";

    // Determine if we should switch cards
    const threshold = 100;
    if (Math.abs(offsetX) > threshold) {
      if (offsetX > 0) {
        prevCard();
      } else {
        nextCard();
      }
    } else {
      // Snap back
      offsetX = 0;
      offsetY = 0;
      rotation = 0;
      updateCards();
    }

    // Restart auto rotation after a delay
    setTimeout(startAutoRotate, 2000);
  });

  // Touch events for mobile
  let touchStartX = 0;
  let touchStartY = 0;

  stack.addEventListener("touchstart", (e) => {
    isDragging = true;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    stopAutoRotate();
  });

  stack.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    e.preventDefault();

    currentX = e.touches[0].clientX - touchStartX;
    currentY = e.touches[0].clientY - touchStartY;
    offsetX = currentX;
    offsetY = currentY;
    rotation = (currentX / 10) * 1;

    updateCards();
  });

  stack.addEventListener("touchend", () => {
    if (!isDragging) return;

    isDragging = false;

    const threshold = 100;
    if (Math.abs(offsetX) > threshold) {
      if (offsetX > 0) {
        prevCard();
      } else {
        nextCard();
      }
    } else {
      offsetX = 0;
      offsetY = 0;
      rotation = 0;
      updateCards();
    }

    setTimeout(startAutoRotate, 2000);
  });

  // Intersection Observer for scroll animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("loaded");
        if (!autoRotateInterval) {
          startAutoRotate();
        }
      } else {
        stopAutoRotate();
      }
    });
  }, observerOptions);

  observer.observe(wrapper);

  // Pause on hover
  wrapper.addEventListener("mouseenter", stopAutoRotate);
  wrapper.addEventListener("mouseleave", () => {
    if (wrapper.classList.contains("loaded")) {
      startAutoRotate();
    }
  });

  // Initialize
  updateCards();
});
