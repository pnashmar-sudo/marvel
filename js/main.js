/* ============================================
   MARVEL TRAVELS — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // PRELOADER
  // ============================================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hidden');
    }, 600);
  });
  // Fallback: hide preloader after 4 seconds even if load event doesn't fire
  setTimeout(function () {
    preloader.classList.add('hidden');
  }, 4000);

  // ============================================
  // NAVBAR — Scroll Effect & Active Link
  // ============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function updateActiveLink() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', function () {
    handleNavScroll();
    updateActiveLink();
  });

  handleNavScroll();

  // ============================================
  // HAMBURGER MENU
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // PARALLAX HERO
  // ============================================
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
      }
    });
  }

  // ============================================
  // SCROLL REVEAL (IntersectionObserver)
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');
  var revealDelay = 0;

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Stagger siblings for grids
        var parent = entry.target.parentElement;
        var siblings = parent.querySelectorAll('.reveal:not(.revealed)');
        var index = Array.from(siblings).indexOf(entry.target);
        var delay = index >= 0 ? index * 100 : 0;

        setTimeout(function () {
          entry.target.classList.add('revealed');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number');
  var countersStarted = false;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'));
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          statNumbers.forEach(function (num) {
            animateCounter(num);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
  }

  // ============================================
  // TESTIMONIALS SLIDER
  // ============================================
  const slider = document.getElementById('testimonialsSlider');
  const dotsContainer = document.getElementById('testimonialDots');
  var currentSlide = 0;
  var testimonialCount = 0;
  var autoPlayTimer = null;

  if (slider && dotsContainer) {
    var slides = slider.querySelectorAll('.testimonial-slide');
    testimonialCount = slides.length;

    // Create dots
    for (var i = 0; i < testimonialCount; i++) {
      var dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', function () {
        goToSlide(parseInt(this.getAttribute('data-index')));
      });
      dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
      currentSlide = index;
      slider.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
      var dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach(function (d, idx) {
        d.classList.toggle('active', idx === currentSlide);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % testimonialCount;
      goToSlide(currentSlide);
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayTimer);
    }

    startAutoPlay();

    // Pause on hover
    var wrapper = slider.closest('.testimonials-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAutoPlay);
      wrapper.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;

    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left → next
          goToSlide((currentSlide + 1) % testimonialCount);
        } else {
          // Swipe right → prev
          goToSlide((currentSlide - 1 + testimonialCount) % testimonialCount);
        }
      }
      startAutoPlay();
    }, { passive: true });
  }

  // ============================================
  // GALLERY LIGHTBOX
  // ============================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  var galleryImages = [];
  var currentGalleryIndex = 0;

  galleryItems.forEach(function (item, index) {
    var img = item.querySelector('img');
    galleryImages.push(img.src.replace('w=600', 'w=1200'));

    item.addEventListener('click', function () {
      currentGalleryIndex = index;
      openLightbox(currentGalleryIndex);
    });
  });

  function openLightbox(index) {
    lightboxImg.src = galleryImages[index];
    lightboxImg.alt = galleryItems[index].querySelector('img').alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[currentGalleryIndex];
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
      lightboxImg.src = galleryImages[currentGalleryIndex];
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  // ============================================
  // CONTACT FORM VALIDATION
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      // Name validation
      var name = document.getElementById('name');
      var nameError = document.getElementById('nameError');
      if (name.value.trim().length < 2) {
        nameError.textContent = 'Please enter your full name.';
        name.classList.add('error');
        isValid = false;
      } else {
        nameError.textContent = '';
        name.classList.remove('error');
      }

      // Email validation
      var email = document.getElementById('email');
      var emailError = document.getElementById('emailError');
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        email.classList.add('error');
        isValid = false;
      } else {
        emailError.textContent = '';
        email.classList.remove('error');
      }

      // Phone validation (optional, but check format if entered)
      var phone = document.getElementById('phone');
      var phoneError = document.getElementById('phoneError');
      if (phone.value.trim() !== '' && phone.value.trim().length < 7) {
        phoneError.textContent = 'Please enter a valid phone number.';
        phone.classList.add('error');
        isValid = false;
      } else {
        phoneError.textContent = '';
        phone.classList.remove('error');
      }

      // Message validation
      var message = document.getElementById('message');
      var messageError = document.getElementById('messageError');
      if (message.value.trim().length < 10) {
        messageError.textContent = 'Please enter at least 10 characters.';
        message.classList.add('error');
        isValid = false;
      } else {
        messageError.textContent = '';
        message.classList.remove('error');
      }

      if (isValid) {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
      }
    });

    // Remove error styling on input
    var formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(function (input) {
      input.addEventListener('input', function () {
        this.classList.remove('error');
        var errorEl = this.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }

  // ============================================
  // NEWSLETTER FORM
  // ============================================
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = this.querySelector('input');
      var btn = this.querySelector('button');
      var originalHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
      btn.style.background = '#27ae60';
      input.value = '';
      setTimeout(function () {
        btn.innerHTML = originalHtml;
        btn.style.background = '';
      }, 3000);
    });
  }

  // Footer newsletter
  var footerNewsletter = document.getElementById('footerNewsletter');
  if (footerNewsletter) {
    footerNewsletter.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = this.querySelector('input');
      var btn = this.querySelector('button');
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.style.background = '#27ae60';
      input.value = '';
      setTimeout(function () {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
      }, 3000);
    });
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
