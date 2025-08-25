document.addEventListener("DOMContentLoaded", function () {
  const colorDots = document.querySelectorAll(".color-dot");
  const ringImages = document.querySelectorAll(".ring-image");
  const colorInfo = document.querySelector(".color-info");
  const colors = [
    "silver",
    "black",
    "brushed-silver",
    "stealth",
    "gold",
    "rose-gold",
  ];
  const colorNames = {
    silver: "Silver",
    black: "Black",
    "brushed-silver": "Brushed Silver",
    stealth: "Stealth",
    gold: "Gold",
    "rose-gold": "Rose Gold",
  };

  let currentIndex = 0;
  let isAnimating = false;

  colorInfo.textContent = colorNames[colors[currentIndex]];

  colorDots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      if (isAnimating) return;

      const selectedColor = this.getAttribute("data-color");
      const newIndex = colors.indexOf(selectedColor);

      if (newIndex === currentIndex) return;

      isAnimating = true;

      colorDots.forEach((d) => d.classList.remove("active"));
      this.classList.add("active");

      colorInfo.textContent = colorNames[selectedColor];

      const currentActive = document.querySelector(".ring-image.active");
      const newImage = document.querySelector(
        `.ring-image[data-color="${selectedColor}"]`
      );

      if (currentActive && newImage) {
        const slideFromRight = newIndex > currentIndex;

        currentActive.classList.add("transitioning");
        newImage.classList.add("transitioning");

        if (slideFromRight) {
          newImage.classList.add("slide-right");
          newImage.style.opacity = "1";

          void newImage.offsetWidth;

          currentActive.classList.add("slide-left");
          newImage.classList.remove("slide-right");
        } else {
          newImage.classList.add("slide-left");
          newImage.style.opacity = "1";

          void newImage.offsetWidth;

          currentActive.classList.add("slide-right");
          newImage.classList.remove("slide-left");
        }

        setTimeout(() => {
          currentActive.classList.remove(
            "active",
            "transitioning",
            "slide-left",
            "slide-right"
          );
          currentActive.style.opacity = "0";

          newImage.classList.add("active");
          newImage.classList.remove(
            "transitioning",
            "slide-left",
            "slide-right"
          );

          isAnimating = false;
        }, 800);
      }

      currentIndex = newIndex;
    });
  });
});
