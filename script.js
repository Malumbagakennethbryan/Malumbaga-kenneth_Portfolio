// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

// Active nav
const secs = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-center a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
  navAs.forEach(a => { a.classList.remove('active'); if (a.getAttribute('href') === '#' + cur) a.classList.add('active'); });
});

// Scroll reveal
const fadeEls = document.querySelectorAll('.fade-up');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.1 });
fadeEls.forEach(el => obs.observe(el));

// Skill bars
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill').forEach(b => {
        setTimeout(() => b.style.width = b.dataset.w + '%', 300);
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-panel').forEach(p => barObs.observe(p));

// Project preview modal
const projectTiles = document.querySelectorAll('.project-tile');
const projectModal = document.getElementById('project-modal');
const projectModalImage = document.getElementById('project-modal-image');
const projectModalType = document.getElementById('project-modal-type');
const projectModalTitle = document.getElementById('project-modal-title');
const projectModalDescription = document.getElementById('project-modal-description');
const projectModalDetails = document.getElementById('project-modal-details');
const projectModalStack = document.getElementById('project-modal-stack');
const projectModalCloseEls = document.querySelectorAll('[data-close-project-modal]');

if (projectModal && projectTiles.length) {
  const openProjectModal = tile => {
    const stackItems = (tile.dataset.projectStack || '').split(',').map(item => item.trim()).filter(Boolean);

    projectModalImage.src = tile.dataset.projectImage;
    projectModalImage.alt = tile.dataset.projectTitle + ' preview';
    projectModalType.textContent = tile.dataset.projectType;
    projectModalTitle.textContent = tile.dataset.projectTitle;
    projectModalDescription.textContent = tile.dataset.projectDescription;
    projectModalDetails.textContent = tile.dataset.projectDetails;
    projectModalStack.innerHTML = stackItems.map(item => `<span class="stack-pill">${item}</span>`).join('');

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  projectTiles.forEach(tile => {
    tile.addEventListener('click', () => openProjectModal(tile));
    tile.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProjectModal(tile);
      }
    });
  });

  projectModalCloseEls.forEach(el => el.addEventListener('click', closeProjectModal));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });
}
