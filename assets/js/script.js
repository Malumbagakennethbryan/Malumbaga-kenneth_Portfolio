const body = document.body;
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-center a');
const sections = document.querySelectorAll('main section[id]');
const revealEls = document.querySelectorAll('.reveal');
const skillPanels = document.querySelectorAll('.skill-panel');
const scrollTopBtn = document.querySelector('.scroll-top');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (cursor && ring && window.matchMedia('(pointer:fine)').matches) {
  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  document.addEventListener('mousemove', event => {
    mx = event.clientX;
    my = event.clientY;
    cursor.style.left = `${mx}px`;
    cursor.style.top = `${my}px`;
  }, { passive: true });

  const animateRing = () => {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(animateRing);
  };

  animateRing();
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && body.classList.contains('nav-open')) {
      body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });
}

const setActiveNav = id => {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
};

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.id);
      }
    });
  }, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(section => navObserver.observe(section));
} else {
  window.addEventListener('scroll', () => {
    let current = 'home';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) current = section.id;
    });
    setActiveNav(current);
  }, { passive: true });
}

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('show'));
}

if ('IntersectionObserver' in window) {
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = `${bar.dataset.w}%`;
      });
      barObserver.unobserve(entry.target);
    });
  }, { threshold: 0.28 });

  skillPanels.forEach(panel => barObserver.observe(panel));
} else {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    bar.style.width = `${bar.dataset.w}%`;
  });
}

const toggleScrollTop = () => {
  if (!scrollTopBtn) return;
  scrollTopBtn.classList.toggle('show', window.scrollY > 500);
};

window.addEventListener('scroll', toggleScrollTop, { passive: true });
toggleScrollTop();

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

const openModal = modal => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  body.style.overflow = 'hidden';

  const closeButton = modal.querySelector('button');
  if (closeButton) closeButton.focus();
};

const closeModal = modal => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  body.style.overflow = '';
};

const projectTiles = document.querySelectorAll('.project-tile');
const projectModal = document.getElementById('project-modal');
const projectModalImage = document.getElementById('project-modal-image');
const projectModalType = document.getElementById('project-modal-type');
const projectModalTitle = document.getElementById('project-modal-title');
const projectModalDescription = document.getElementById('project-modal-description');
const projectModalDetails = document.getElementById('project-modal-details');
const projectModalRole = document.getElementById('project-modal-role');
const projectModalStack = document.getElementById('project-modal-stack');
const projectModalGithub = document.getElementById('project-modal-github');
const projectModalDemo = document.getElementById('project-modal-demo');

if (projectModal && projectTiles.length) {
  const openProjectModal = tile => {
    const stackItems = (tile.dataset.projectStack || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    projectModalImage.src = tile.dataset.projectImage;
    projectModalImage.alt = `${tile.dataset.projectTitle} preview`;
    projectModalType.textContent = tile.dataset.projectType;
    projectModalTitle.textContent = tile.dataset.projectTitle;
    projectModalDescription.textContent = tile.dataset.projectDescription;
    projectModalDetails.textContent = tile.dataset.projectDetails;
    projectModalRole.textContent = tile.dataset.projectRole;
    projectModalStack.innerHTML = stackItems.map(item => `<span class="stack-pill">${item}</span>`).join('');

    projectModalGithub.href = tile.dataset.projectGithub || 'https://github.com/KennethMalumbaga';

    if (tile.dataset.projectDemo) {
      projectModalDemo.href = tile.dataset.projectDemo;
      projectModalDemo.classList.remove('is-hidden');
    } else {
      projectModalDemo.classList.add('is-hidden');
    }

    openModal(projectModal);
  };

  projectTiles.forEach(tile => {
    tile.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      openProjectModal(tile);
    });

    tile.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProjectModal(tile);
      }
    });
  });

  projectModal.querySelectorAll('[data-close-project-modal]').forEach(el => {
    el.addEventListener('click', () => closeModal(projectModal));
  });
}

const certCards = document.querySelectorAll('.cert-card');
const certModal = document.getElementById('cert-modal');
const certModalImage = document.getElementById('cert-modal-image');
const certModalType = document.getElementById('cert-modal-type');
const certModalTitle = document.getElementById('cert-modal-title');
const certModalOrg = document.getElementById('cert-modal-org');
const certModalDate = document.getElementById('cert-modal-date');

if (certModal && certCards.length) {
  const openCertModal = card => {
    certModalImage.src = card.dataset.certImage;
    certModalImage.alt = card.dataset.certTitle;
    certModalType.textContent = card.dataset.certType;
    certModalTitle.textContent = card.dataset.certTitle;
    certModalOrg.textContent = card.dataset.certOrg;
    certModalDate.textContent = card.dataset.certDate;
    openModal(certModal);
  };

  certCards.forEach(card => {
    card.addEventListener('click', () => openCertModal(card));

    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openCertModal(card);
      }
    });
  });

  certModal.querySelectorAll('[data-close-cert-modal]').forEach(el => {
    el.addEventListener('click', () => closeModal(certModal));
  });
}

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;

  [projectModal, certModal].forEach(modal => {
    if (modal && modal.classList.contains('open')) closeModal(modal);
  });
});

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const subject = data.get('subject') || 'Portfolio inquiry';
    const message = data.get('message') || '';
    const bodyText = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    window.location.href = `mailto:malumbagakenneth16@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  });
}
