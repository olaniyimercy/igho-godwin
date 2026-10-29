(function () {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const menuLinks = document.getElementById("menuLinks");
  const navBackdrop = document.getElementById("navBackdrop");
  const links = menuLinks.querySelectorAll("a");

  function toggleMenu() {
    const isOpen = menuLinks.classList.toggle("is-open");
    hamburgerBtn.classList.toggle("is-active", isOpen);
    navBackdrop.classList.toggle("is-open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMenu() {
    menuLinks.classList.remove("is-open");
    hamburgerBtn.classList.remove("is-active");
    navBackdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  hamburgerBtn.addEventListener("click", toggleMenu);
  navBackdrop.addEventListener("click", closeMenu);

  // Auto-close when clicking any link
  links.forEach((link) => link.addEventListener("click", closeMenu));
})();

// Optional: adds the .scrolled class only after the user starts scrolling down
window.addEventListener("scroll", () => {
  const header =
    document.querySelector("header") || document.querySelector(".site-header");
  if (header) {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
});

// INTERACTIVE CAROUSEL SCRIPT

(function () {
  const reviews = [
    {
      quote:
        "I am very happy with my visit! Igho was super nice and very good at his job. He took my wishes into account but also gave suggestions on what he thought would suit. I also got the best head massage I have ever had! When I was there I got a great blow out but have now also experienced that my natural curls are nicer than they have been in a long time after the cut.",
      author: "— Lisa Lilja",
    },
    {
      quote:
        "Absolutely fantastic welcome from the owner! As soon as you step in you feel welcome with a cup of tea or coffee. Igho himself is incredibly professional and nice, really has nothing to complain about regarding the haircut itself, the place itself is very nicely organized and cleaned with a nice style, you can tell that he puts his soul into it.",
      author: "— Jonatan Gustavsson",
    },
    {
      quote:
        "Fantastic hairdresser! Uses organic and vegan products without unnecessary chemicals. Both service and treatment/cutting were beyond all expectations and the absolute best I've had in Gothenburg.",
      author: "— Linnea Savik",
    },
    {
      quote:
        "Recommend Igho! Very nice welcome and the service was really top notch! Really good I'm super satisfied and will go there again.",
      author: "— Emilia Mikaelsson",
    },
    {
      quote:
        "Amazing service and super nice and talented staff. Best hairdresser I've been to.",
      author: "— Elin Lokrantz",
    },
    {
      quote:
        "Wow, right there for the first time! Super professionals! Recommend to everyone!!",
      author: "— Peter Runnestig",
    },
    {
      quote:
        "Loved this place! Clean concept with organic products - healthy for both the customer and the environment. Best salon experience I've had in 3 years! Bravo x",
      author: "— Sarah Hedin",
    },
    {
      quote: "Professional, friendly and sustainable! Highly recommended!",
      author: "— Lisa Molin",
    },
    {
      quote:
        "Super salon with the nicest staff in the world. Igho has cut both me and my son and both are super happy and he makes everyone feel welcome and taken care of. Can really be recommended.",
      author: "— Peter Sjöström",
    },
    {
      quote: "Always a pleasure to visit Igho!",
      author: "— Filip Hellander",
    },
    {
      quote: "Absolutely the best hairdresser and great products",
      author: "— Johny Tiikkaja",
    },
  ];

  const quoteEl = document.getElementById("testimonialQuoteText");
  const authorEl = document.getElementById("testimonialAuthorText");
  const buttons = document.querySelectorAll(".testimonial-page-btn");
  let currentIndex = 0;
  let isAnimating = false;

  // Set initial transition styles
  [quoteEl, authorEl].forEach((el) => {
    el.style.transition =
      "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease";
    el.style.willChange = "transform, opacity";
  });

  function slideToReview(nextIndex) {
    if (isAnimating || nextIndex === currentIndex || !reviews[nextIndex])
      return;
    isAnimating = true;

    // Slide out to left if moving forward, right if moving backward
    const direction = nextIndex > currentIndex ? -1 : 1;

    [quoteEl, authorEl].forEach((el) => {
      el.style.transform = `translateX(${direction * 40}px)`;
      el.style.opacity = "0";
    });

    setTimeout(() => {
      quoteEl.textContent = reviews[nextIndex].quote;
      authorEl.textContent = reviews[nextIndex].author;

      // Position incoming review on opposite side instantly
      [quoteEl, authorEl].forEach((el) => {
        el.style.transition = "none";
        el.style.transform = `translateX(${-direction * 40}px)`;
      });

      // Slide in to center smoothly
      requestAnimationFrame(() => {
        setTimeout(() => {
          [quoteEl, authorEl].forEach((el) => {
            el.style.transition =
              "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease";
            el.style.transform = "translateX(0)";
            el.style.opacity = "1";
          });

          buttons[currentIndex]?.classList.remove("active");
          buttons[nextIndex]?.classList.add("active");
          currentIndex = nextIndex;
          isAnimating = false;
        }, 20);
      });
    }, 350);
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetIndex = parseInt(btn.getAttribute("data-index"), 10);
      slideToReview(targetIndex);
    });
  });
})();

// SMOOTH INFINITE AUTO-SLIDE SCRIPT

(function () {
  const track = document.getElementById("salonMarqueeTrack");
  const viewport = document.getElementById("salonMarqueeViewport");
  if (!track || !viewport) return;

  let position = 0;
  const speed = 0.85; // Speed in pixels per frame (adjust up or down as desired)
  let isPaused = false;
  let animId = null;

  function step() {
    if (!isPaused) {
      position -= speed;

      // Loop seamlessly once the first half of slides have scrolled out
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(position) >= halfWidth) {
        position = 0;
      }

      track.style.transform = `translateX(${position}px)`;
    }
    animId = requestAnimationFrame(step);
  }

  // Pause animation when the user interacts or hovers
  function pause() {
    isPaused = true;
  }

  function resume() {
    isPaused = false;
  }

  // Desktop hover events
  viewport.addEventListener("mouseenter", pause);
  viewport.addEventListener("mouseleave", resume);

  // Mobile touch events
  viewport.addEventListener("touchstart", pause, { passive: true });
  viewport.addEventListener("touchend", resume, { passive: true });

  // Start auto-slide loop
  animId = requestAnimationFrame(step);
})();
