/* ===========================
   RozgarSetu - Enhanced JS
   =========================== */

// -------- STATE --------
let allJobs = [];
let filteredJobs = [];
let currentPage = 1;
const JOBS_PER_PAGE = 6;
let currentSort = 'default';
let savedJobs = JSON.parse(localStorage.getItem('rozgarSetu_saved')) || [];

// -------- INIT --------
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initFilters();
  initSortButtons();
  loadJobs();
  displaySaved();
  updateBadge();
});

// -------- FETCH JOBS --------
function loadJobs() {
  fetch('jobs.json')
    .then(r => r.json())
    .then(data => {
      allJobs = data;
      filteredJobs = [...allJobs];
      // Animate hero stat
      animateCounter('statJobs', allJobs.length);
      applyFiltersAndSort();
    })
    .catch(() => {
      document.getElementById('emptyState').classList.remove('hidden');
      document.getElementById('resultsCount').textContent = 'Failed to load jobs.';
    });
}

// -------- DISPLAY JOBS --------
function displayJobs(jobList) {
  const container = document.getElementById('jobContainer');
  const emptyState = document.getElementById('emptyState');
  const resultsCount = document.getElementById('resultsCount');

  // Pagination slice
  const start = (currentPage - 1) * JOBS_PER_PAGE;
  const paginated = jobList.slice(start, start + JOBS_PER_PAGE);

  container.innerHTML = '';

  if (paginated.length === 0) {
    emptyState.classList.remove('hidden');
    resultsCount.textContent = 'No jobs found';
    renderPagination(0);
    return;
  }

  emptyState.classList.add('hidden');
  resultsCount.textContent = `Showing ${start + 1}–${Math.min(start + JOBS_PER_PAGE, jobList.length)} of ${jobList.length} job${jobList.length !== 1 ? 's' : ''}`;

  paginated.forEach((job, i) => {
    const isSaved = savedJobs.some(s => s.id === job.id);
    const card = document.createElement('div');
    card.className = 'job-card';
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="card-top">
        <div class="company-logo">${job.logo || '💼'}</div>
        <div class="card-actions">
          <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave(${job.id})" id="save-${job.id}" title="${isSaved ? 'Unsave' : 'Save'} job">
            ${isSaved ? '🔖' : '🔖'}
          </button>
        </div>
      </div>
      <div class="job-title">${job.title}</div>
      <div class="job-company">${job.company}</div>
      <div class="job-meta">
        <span class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${job.location}
        </span>
        <span class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${job.experience}
        </span>
        <span class="meta-item">🏷️ ${job.category}</span>
      </div>
      <div class="job-salary">💰 ${job.salary}</div>
      <div class="skills-list">
        ${(job.skills || []).slice(0, 3).map(s => `<span class="skill-pill">${s}</span>`).join('')}
        ${job.skills && job.skills.length > 3 ? `<span class="skill-pill">+${job.skills.length - 3}</span>` : ''}
      </div>
      <div class="card-footer">
        <div style="display:flex;gap:0.4rem;align-items:center;">
          <span class="job-type-badge ${job.type === 'Remote' ? 'remote' : ''}">${job.type}</span>
          <span class="posted-date">${job.posted}</span>
        </div>
        <button class="view-btn" onclick="openModal(${job.id})">View Details</button>
      </div>
    `;
    container.appendChild(card);
  });

  renderPagination(jobList.length);
}

// -------- PAGINATION --------
function renderPagination(total) {
  const container = document.getElementById('pagination');
  container.innerHTML = '';
  const pages = Math.ceil(total / JOBS_PER_PAGE);
  if (pages <= 1) return;

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.onclick = () => { currentPage = i; displayJobs(filteredJobs); window.scrollTo({ top: document.getElementById('jobs').offsetTop - 80, behavior: 'smooth' }); };
    container.appendChild(btn);
  }
}

// -------- MODAL --------
function openModal(id) {
  const job = allJobs.find(j => j.id === id);
  if (!job) return;
  const isSaved = savedJobs.some(s => s.id === job.id);
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-logo">${job.logo || '💼'}</div>
    <div class="modal-title">${job.title}</div>
    <div class="modal-company">${job.company}</div>
    <div class="modal-meta-grid">
      <div class="modal-meta-item"><label>Location</label><span>📍 ${job.location}</span></div>
      <div class="modal-meta-item"><label>Experience</label><span>🎯 ${job.experience}</span></div>
      <div class="modal-meta-item"><label>Salary</label><span>💰 ${job.salary}</span></div>
      <div class="modal-meta-item"><label>Type</label><span>${job.type}</span></div>
      <div class="modal-meta-item"><label>Category</label><span>🏷️ ${job.category}</span></div>
      <div class="modal-meta-item"><label>Posted</label><span>📅 ${job.posted}</span></div>
    </div>
    <div class="modal-section">
      <h4>About the Role</h4>
      <p>${job.description}</p>
    </div>
    <div class="modal-section">
      <h4>Required Skills</h4>
      <div class="skills-list">${(job.skills || []).map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>
    </div>
    <div class="modal-actions">
      <button class="btn-primary" onclick="alert('Application functionality coming soon!')">Apply Now →</button>
      <button class="btn-ghost" onclick="toggleSave(${job.id})" id="modal-save-${job.id}">${isSaved ? '🔖 Saved' : '🔖 Save Job'}</button>
    </div>
  `;
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay') && !e.target.classList.contains('modal-close')) return;
  document.getElementById('modalOverlay').classList.add('hidden');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('modalOverlay').classList.add('hidden');
    document.body.style.overflow = '';
  }
});

// -------- SAVE JOBS --------
function toggleSave(id) {
  const job = allJobs.find(j => j.id === id);
  if (!job) return;

  const idx = savedJobs.findIndex(s => s.id === id);
  if (idx === -1) {
    savedJobs.push(job);
    showToast(`✅ "${job.title}" saved!`);
  } else {
    savedJobs.splice(idx, 1);
    showToast(`🗑️ "${job.title}" removed from saved.`);
  }

  localStorage.setItem('rozgarSetu_saved', JSON.stringify(savedJobs));
  updateBadge();
  displaySaved();

  // Update card save button
  const btn = document.getElementById(`save-${id}`);
  if (btn) btn.classList.toggle('saved', savedJobs.some(s => s.id === id));

  // Update modal save button
  const mBtn = document.getElementById(`modal-save-${id}`);
  if (mBtn) mBtn.textContent = savedJobs.some(s => s.id === id) ? '🔖 Saved' : '🔖 Save Job';
}

function displaySaved() {
  const container = document.getElementById('savedContainer');
  const empty = document.getElementById('savedEmpty');
  container.innerHTML = '';

  if (savedJobs.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  savedJobs.forEach((job, i) => {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="card-top">
        <div class="company-logo">${job.logo || '💼'}</div>
        <div class="card-actions">
          <button class="save-btn saved" onclick="toggleSave(${job.id})" title="Remove">✕</button>
        </div>
      </div>
      <div class="job-title">${job.title}</div>
      <div class="job-company">${job.company}</div>
      <div class="job-meta">
        <span class="meta-item">📍 ${job.location}</span>
        <span class="meta-item">🎯 ${job.experience}</span>
      </div>
      <div class="job-salary">💰 ${job.salary}</div>
      <div class="card-footer">
        <span class="job-type-badge ${job.type === 'Remote' ? 'remote' : ''}">${job.type}</span>
        <button class="view-btn" onclick="openModal(${job.id})">View Details</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateBadge() {
  const badge = document.getElementById('savedBadge');
  if (savedJobs.length > 0) {
    badge.textContent = savedJobs.length;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// -------- FILTERS --------
function initFilters() {
  document.getElementById('searchInput').addEventListener('input', () => {
    const v = document.getElementById('searchInput').value;
    document.getElementById('clearSearch').classList.toggle('visible', v.length > 0);
    currentPage = 1;
    applyFiltersAndSort();
  });
  document.getElementById('clearSearch').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').classList.remove('visible');
    currentPage = 1;
    applyFiltersAndSort();
  });

  ['locationFilter', 'experienceFilter', 'categoryFilter', 'salaryFilter'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => { currentPage = 1; applyFiltersAndSort(); });
  });
}

function applyFiltersAndSort() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const location = document.getElementById('locationFilter').value;
  const experience = document.getElementById('experienceFilter').value;
  const category = document.getElementById('categoryFilter').value;
  const salaryRange = document.getElementById('salaryFilter').value;

  filteredJobs = allJobs.filter(job => {
    const matchSearch = !search || 
      job.title.toLowerCase().includes(search) || 
      job.company.toLowerCase().includes(search) ||
      (job.skills || []).some(s => s.toLowerCase().includes(search)) ||
      job.description.toLowerCase().includes(search);
    const matchLocation = !location || job.location === location;
    const matchExp = !experience || job.experience === experience;
    const matchCat = !category || job.category === category;
    let matchSalary = true;
    if (salaryRange) {
      const [min, max] = salaryRange.split('-').map(Number);
      matchSalary = job.salaryMin >= min && job.salaryMax <= max;
    }
    return matchSearch && matchLocation && matchExp && matchCat && matchSalary;
  });

  // Sort
  if (currentSort === 'salary-asc') filteredJobs.sort((a, b) => a.salaryMin - b.salaryMin);
  else if (currentSort === 'salary-desc') filteredJobs.sort((a, b) => b.salaryMax - a.salaryMax);
  else if (currentSort === 'title') filteredJobs.sort((a, b) => a.title.localeCompare(b.title));

  renderActiveFilters({ search, location, experience, category, salaryRange });
  displayJobs(filteredJobs);
}

function renderActiveFilters({ search, location, experience, category, salaryRange }) {
  const container = document.getElementById('activeFilters');
  container.innerHTML = '';
  const add = (label, clearFn) => {
    const tag = document.createElement('div');
    tag.className = 'filter-tag';
    tag.innerHTML = `${label} <button onclick="${clearFn}">✕</button>`;
    container.appendChild(tag);
  };
  if (search) add(`"${search}"`, `document.getElementById('searchInput').value=''; document.getElementById('clearSearch').classList.remove('visible'); currentPage=1; applyFiltersAndSort()`);
  if (location) add(`📍 ${location}`, `document.getElementById('locationFilter').value=''; currentPage=1; applyFiltersAndSort()`);
  if (experience) add(`🎯 ${experience}`, `document.getElementById('experienceFilter').value=''; currentPage=1; applyFiltersAndSort()`);
  if (category) add(`🏷️ ${category}`, `document.getElementById('categoryFilter').value=''; currentPage=1; applyFiltersAndSort()`);
  if (salaryRange) add(`💰 Salary filter`, `document.getElementById('salaryFilter').value=''; currentPage=1; applyFiltersAndSort()`);
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('clearSearch').classList.remove('visible');
  document.getElementById('locationFilter').value = '';
  document.getElementById('experienceFilter').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('salaryFilter').value = '';
  currentPage = 1;
  applyFiltersAndSort();
  showToast('🔄 Filters cleared');
}

// -------- SORT --------
function initSortButtons() {
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      currentPage = 1;
      applyFiltersAndSort();
    });
  });
}

// -------- NAVBAR SCROLL --------
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// -------- HAMBURGER --------
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// -------- TOAST --------
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// -------- CONTACT FORM --------
function submitForm(e) {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.classList.remove('hidden');
  e.target.reset();
  setTimeout(() => success.classList.add('hidden'), 4000);
}

// -------- COUNTER ANIMATION --------
function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + '+'; clearInterval(timer); }
    else el.textContent = start;
  }, 40);
}