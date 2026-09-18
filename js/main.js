
    /**
     * SLV Wings Unisex Salon - Production Vanilla JS Controller
     * Completely framework-free. Handles multi-page routing, service filters,
     * gallery lightbox, testimonial carousel, stats counters, and form validation.
     */

    // Gallery dataset for lightbox preview
    const galleryItems = [
      { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80", caption: "Main Styling Floor & Reception Suite" },
      { src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80", caption: "Soft Honey Balayage & Beach Waves" },
      { src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80", caption: "South Indian Bridal Radiance & Draping" },
      { src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80", caption: "Hydra Glow Radiance Therapy" },
      { src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80", caption: "Rose-Gold Gel Accents & Manicure" },
      { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80", caption: "Men's Precision Fade & Beard Sculpting" },
      { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80", caption: "Private Luxury Treatment Suite" },
      { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80", caption: "Dewy Engagement Look & Hair Pinning" }
    ];

    let currentLightboxIdx = 0;
    let currentTestimonialIdx = 0;
    let testimonialAutoplayTimer = null;
    let hasAnimatedStats = false;

    function navigateTo(pageId, preselectedService = null) {
      const validPages = ['home', 'about', 'services', 'pricing', 'team', 'gallery', 'testimonials', 'contact', 'booking'];
      const targetPage = validPages.includes(pageId) ? pageId : 'home';

      // Switch view classes
      document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active-page');
      });

      const activeView = document.getElementById('view-' + targetPage);
      if (activeView) {
        activeView.classList.add('active-page');
      }

      // Update active nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-page') === targetPage) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Update mobile nav links
      document.querySelectorAll('.mobile-nav-link').forEach(link => {
        if (link.getAttribute('href') === '#' + targetPage) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Manage URL hash without abrupt jumps
      if (window.location.hash !== '#' + targetPage) {
        history.pushState(null, '', '#' + targetPage);
      }

      // Scroll smoothly to top of view
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Service preselection handling
      if (targetPage === 'booking' && preselectedService) {
        const dedicatedSelect = document.getElementById('bService');
        if (dedicatedSelect) {
          for (let i = 0; i < dedicatedSelect.options.length; i++) {
            if (dedicatedSelect.options[i].value.toLowerCase().includes(preselectedService.toLowerCase())) {
              dedicatedSelect.selectedIndex = i;
              break;
            }
          }
        }
      }

      // Trigger statistics animation if entering About
      if (targetPage === 'about' || targetPage === 'home') {
        setTimeout(initStatsCounter, 300);
      }
    }

    function navigateMobile(pageId) {
      toggleMobileMenu(false);
      navigateTo(pageId);
    }

    function toggleMobileMenu(isOpen) {
      const drawer = document.getElementById('mobileDrawer');
      const overlay = document.getElementById('mobileNavOverlay');
      const btn = document.getElementById('hamburgerBtn');

      if (isOpen === undefined) {
        isOpen = !drawer.classList.contains('open');
      }

      if (isOpen) {
        drawer.classList.add('open');
        overlay.classList.add('open');
        btn.classList.add('is-active');
        btn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      } else {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        btn.classList.remove('is-active');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }

    // Scroll listener for sticky header compaction
    window.addEventListener('scroll', () => {
      const header = document.getElementById('siteHeader');
      const bookBtn = document.getElementById('headerBookBtn');
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
        if (window.innerWidth >= 992) {
          bookBtn.style.display = 'inline-flex';
        }
      } else {
        header.classList.remove('scrolled');
        bookBtn.style.display = 'none';
      }
    });

    function filterServices(category) {
      const buttons = document.querySelectorAll('.category-filter-nav button');
      buttons.forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const cards = document.querySelectorAll('#fullServicesGrid .service-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const itemCat = card.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const emptyState = document.getElementById('servicesEmptyState');
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    function filterGallery(category) {
      const buttons = document.querySelectorAll('#view-gallery .filter-btn');
      buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(category) || (category === 'all' && btn.textContent.includes('All'))) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const items = document.querySelectorAll('#galleryGrid .gallery-item');
      items.forEach(item => {
        const itemCat = item.getAttribute('data-cat');
        if (category === 'all' || itemCat === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }

    function openLightbox(index) {
      currentLightboxIdx = index;
      updateLightboxDisplay();
      const modal = document.getElementById('galleryLightbox');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      const modal = document.getElementById('galleryLightbox');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function prevLightbox() {
      currentLightboxIdx = (currentLightboxIdx - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxDisplay();
    }

    function nextLightbox() {
      currentLightboxIdx = (currentLightboxIdx + 1) % galleryItems.length;
      updateLightboxDisplay();
    }

    function updateLightboxDisplay() {
      const item = galleryItems[currentLightboxIdx];
      const img = document.getElementById('lightboxImage');
      const caption = document.getElementById('lightboxCaption');
      const counter = document.getElementById('lightboxCounter');

      img.src = item.src;
      img.alt = item.caption;
      caption.textContent = item.caption;
      counter.textContent = `${currentLightboxIdx + 1} of ${galleryItems.length}`;
    }

    function initTestimonialCarousel() {
      const track = document.getElementById('testimonialTrack');
      const slides = document.querySelectorAll('.testimonial-slide');
      const dotsContainer = document.getElementById('testimonialDots');
      if (!track || slides.length === 0) return;

      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
        dot.onclick = () => showTestimonial(i);
        dotsContainer.appendChild(dot);
      });

      startTestimonialAutoplay();

      const carouselBox = document.getElementById('testimonialCarousel');
      carouselBox.addEventListener('mouseenter', () => clearInterval(testimonialAutoplayTimer));
      carouselBox.addEventListener('mouseleave', () => startTestimonialAutoplay());
    }

    function showTestimonial(index) {
      const slides = document.querySelectorAll('.testimonial-slide');
      const dots = document.querySelectorAll('.carousel-dot');
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;

      currentTestimonialIdx = index;
      const track = document.getElementById('testimonialTrack');
      track.style.transform = `translateX(-${currentTestimonialIdx * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentTestimonialIdx);
      });
    }

    function nextTestimonial() {
      showTestimonial(currentTestimonialIdx + 1);
    }

    function prevTestimonial() {
      showTestimonial(currentTestimonialIdx - 1);
    }

    function startTestimonialAutoplay() {
      clearInterval(testimonialAutoplayTimer);
      testimonialAutoplayTimer = setInterval(() => {
        nextTestimonial();
      }, 5500);
    }

    function initStatsCounter() {
      const counters = document.querySelectorAll('.stat-counter');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        let count = 0;
        const speed = target > 1000 ? 50 : 25;
        const step = Math.ceil(target / speed);

        const updateTimer = setInterval(() => {
          count += step;
          if (count >= target) {
            counter.textContent = target.toLocaleString('en-IN') + (target > 50 ? '+' : '');
            clearInterval(updateTimer);
          } else {
            counter.textContent = count.toLocaleString('en-IN');
          }
        }, 30);
      });
    }

    function openBookingModal(preselectService = null) {
      const modal = document.getElementById('globalBookingModal');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      if (preselectService) {
        const select = document.getElementById('mService');
        if (select) {
          for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value.toLowerCase().includes(preselectService.toLowerCase())) {
              select.selectedIndex = i;
              break;
            }
          }
        }
      }

      // Set minimum date to today
      const todayStr = new Date().toISOString().split('T')[0];
      const mDate = document.getElementById('mDate');
      if (mDate) mDate.min = todayStr;
      const bDate = document.getElementById('bDate');
      if (bDate) bDate.min = todayStr;
    }

    function closeBookingModal() {
      const modal = document.getElementById('globalBookingModal');
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    function handleBookingSubmit(e, formType) {
      e.preventDefault();
      const form = e.target;
      let isValid = true;

      // Validate required inputs
      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          isValid = false;
        } else {
          input.classList.remove('error');
        }

        // Phone specific check
        if (input.type === 'tel' && input.value.trim().length < 8) {
          input.classList.add('error');
          isValid = false;
        }
      });

      if (!isValid) {
        showToast("Please complete the required highlighted fields.", "error");
        return;
      }

      /* =========================================================================
         BACKEND INTEGRATION HOOK
         Connect this frontend trigger with your CRM, WhatsApp Business Cloud API,
         EmailJS, or appointment scheduling endpoint (e.g. fetch('/api/bookings'))
         ========================================================================= */
      const customerName = (formType === 'modal' ? document.getElementById('mName').value : document.getElementById('bName').value) || 'Valued Guest';

      // Simulation response
      if (formType === 'modal') {
        closeBookingModal();
      }
      form.reset();

      showToast(`Thank you, ${customerName}! Your appointment request has been received. Our salon team will contact you shortly to confirm.`, "success");
    }

    function handleContactSubmit(e) {
      e.preventDefault();
      const form = e.target;
      let isValid = true;

      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          isValid = false;
        } else {
          input.classList.remove('error');
        }
      });

      if (!isValid) {
        showToast("Please fill out all required fields before submitting.", "error");
        return;
      }

      form.reset();
      showToast("Thank you for reaching out to SLV Wings Unisex Salon. We will respond promptly.", "success");
    }

    function showToast(message, type = "success") {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      toast.className = `toast-notification ${type}`;
      toast.innerHTML = `
        <span style="font-size: 1.2rem;">${type === 'success' ? '✦' : '⚠️'}</span>
        <span>${message}</span>
      `;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 350);
      }, 5000);
    }

    function toggleTemplateInspector(show) {
      const modal = document.getElementById('templateExplorerModal');
      if (show) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    function copyConfigurationGuide() {
      const tokens = `/* SLV Wings Salon Brand CSS Variables */
:root {
  --color-primary: #B98982;          /* Soft Rose Gold */
  --color-secondary: #D8C1A5;        /* Champagne */
  --color-surface: #EDE3D7;          /* Warm Beige */
  --color-background: #FAF8F4;       /* Ivory */
  --color-text: #292625;             /* Charcoal */
  --color-muted: #756A65;            /* Taupe */
}`;
      const el = document.createElement('textarea');
      el.value = tokens;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      showToast("Brand tokens copied to clipboard!", "success");
    }

    window.addEventListener('keydown', (e) => {
      // Lightbox navigation
      const lightbox = document.getElementById('galleryLightbox');
      if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
      }

      // Modal escape close
      const bookingModal = document.getElementById('globalBookingModal');
      if (bookingModal && bookingModal.classList.contains('open') && e.key === 'Escape') {
        closeBookingModal();
      }

      const explorerModal = document.getElementById('templateExplorerModal');
      if (explorerModal && explorerModal.classList.contains('open') && e.key === 'Escape') {
        toggleTemplateInspector(false);
      }
    });

    // Mobile Hamburger button binding
    document.getElementById('hamburgerBtn').addEventListener('click', () => {
      toggleMobileMenu();
    });

    // Setup initial routing from hash upon page load
    window.addEventListener('DOMContentLoaded', () => {
      initTestimonialCarousel();

      const initialHash = window.location.hash.replace('#', '') || 'home';
      navigateTo(initialHash);

      // Set min dates on date inputs
      const today = new Date().toISOString().split('T')[0];
      const mDate = document.getElementById('mDate');
      const bDate = document.getElementById('bDate');
      if (mDate) mDate.min = today;
      if (bDate) bDate.min = today;
    });

    // Handle browser forward/back buttons
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      navigateTo(hash);
    });
 