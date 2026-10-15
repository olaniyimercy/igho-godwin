(function () {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const menuLinks = document.getElementById('menuLinks');
    const navBackdrop = document.getElementById('navBackdrop');
    const links = menuLinks.querySelectorAll('a');

    function toggleMenu() {
      const isOpen = menuLinks.classList.toggle('is-open');
      hamburgerBtn.classList.toggle('is-active', isOpen);
      navBackdrop.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      menuLinks.classList.remove('is-open');
      hamburgerBtn.classList.remove('is-active');
      navBackdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', toggleMenu);
    navBackdrop.addEventListener('click', closeMenu);

    // Auto-close when clicking any link
    links.forEach(link => link.addEventListener('click', closeMenu));
  })();
