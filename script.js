class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Example
const phrases = [
  "Hello,",
  "My name is Denis Roeder,",
  "I am a Web Developer,",
  "Creating amazing websites,",
  "One line of code at a time.",
];

const el = document.querySelector(".text");
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 800);
  });
  counter = (counter + 1) % phrases.length;
};

next();

// Hide the intro after the text scramble effect
setTimeout(() => {
  const intro = document.querySelector(".intro");
  intro.classList.add("hidden");
  setTimeout(() => {
    intro.style.display = "none";
  }, 1000); // Allow time for the transition
}, 10000); // Total duration for text scramble effect

// Show game container after text scramble effect
setTimeout(() => {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.style.display = "block";
}, 10000); // Total duration for text scramble effect

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const resultsDisplay = document.querySelector(".results");
  const musicToggle = document.getElementById("music-toggle");
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
