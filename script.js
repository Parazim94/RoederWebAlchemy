document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const resultsDisplay = document.querySelector(".results");
  const musicToggle = document.getElementById("music-toggle");
  const intro = document.querySelector(".intro");
  const gameContainer = document.querySelector(".game-container");
  let score = 0;

  // Show intro text and then reveal game
  setTimeout(() => {
    intro.style.display = "none";
    gameContainer.style.display = "block";
  }, 5000); // 5 seconds for the intro text

  // Get background music element
  const backgroundMusic = document.getElementById("background-music");

  musicToggle.addEventListener("click", () => {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
  });

  // Create shooter
  const shooter = document.createElement("div");
  shooter.classList.add("shooter");
  grid.appendChild(shooter);

  // Move shooter with mouse
  grid.addEventListener("mousemove", (e) => {
    const gridLeft = grid.getBoundingClientRect().left;
    let x = e.clientX - gridLeft - shooter.offsetWidth / 2;
    x = Math.max(0, Math.min(grid.offsetWidth - shooter.offsetWidth, x));
    shooter.style.left = `${x}px`;
  });

  // Create invaders (letters of "Willkommen", "DENIS", "WEBSITE", and "PORTFOLIO")
  const words = [
    { text: "Welcome", className: "invader-welcome" },
    { text: "to", className: "invader-to" },
    { text: "Denis", className: "invader-denis" },
    { text: "Website-", className: "invader-website" },
    { text: "Portfolio", className: "invader-portfolio" },
  ];
  const invaders = [];

  words.forEach((word, wordIndex) => {
    for (let i = 0; i < word.text.length; i++) {
      const invader = document.createElement("div");
      invader.classList.add("invader", word.className);
      invader.style.left = `${i * 60 + 30}px`;
      invader.style.top = `${wordIndex * 60 + 30}px`;
      invader.textContent = word.text[i];
      invader.dataset.hits = "0";
      grid.appendChild(invader);
      invaders.push(invader);
    }
  });

  // Shoot laser
  grid.addEventListener("click", () => {
    const laser = document.createElement("div");
    laser.classList.add("laser");
    laser.style.left = `${
      shooter.offsetLeft + shooter.offsetWidth / 2 - 2.5
    }px`;
    laser.style.bottom = `60px`;
    grid.appendChild(laser);

    // Play laser sound
    const laserSound = document.getElementById("laser-sound");
    laserSound.play();

    const laserInterval = setInterval(() => {
      laser.style.bottom = `${parseInt(laser.style.bottom) + 10}px`;

      // Check if laser hits an invader
      invaders.forEach((invader, index) => {
        const laserRect = laser.getBoundingClientRect();
        const invaderRect = invader.getBoundingClientRect();
        if (
          laserRect.top < invaderRect.bottom &&
          laserRect.bottom > invaderRect.top &&
          laserRect.left < invaderRect.right &&
          laserRect.right > invaderRect.left
        ) {
          clearInterval(laserInterval);
          grid.removeChild(laser);

          let hits = parseInt(invader.dataset.hits) + 1;
          invader.dataset.hits = hits;
          invader.classList.add("wobble");
          setTimeout(() => invader.classList.remove("wobble"), 300);

          if (hits >= 3) {
            invader.classList.add("boom");
            setTimeout(() => {
              grid.removeChild(invader);
              invaders.splice(index, 1);
            }, 300);

            // Play explosion sound
            const explosionSound = document.getElementById("explosion-sound");
            explosionSound.play();

            score++;
            resultsDisplay.textContent = `Score: ${score}`;
          } else {
            invader.classList.add("hit");
            setTimeout(() => invader.classList.remove("hit"), 300);
          }
        }
      });

      // Remove laser if it goes off screen
      if (parseInt(laser.style.bottom) > grid.offsetHeight) {
        clearInterval(laserInterval);
        grid.removeChild(laser);
      }
    }, 50);
  });
});
