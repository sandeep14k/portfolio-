'use strict';
const projects = {
  elewin: { title: 'EleWin', role: 'BUILT / CAREER PLATFORM', description: 'A platform connecting career readiness, campus placements, and hiring. EleWin brings students, institutions, and hiring teams into one connected experience.', extra: 'I built EleWin. Explore the live platform to see its career preparation tools, placement workflows, and hiring experience.', url: 'https://elewin.in', label: 'Explore EleWin' },
  onebrain: { title: 'OneBrain', role: 'CONTRIBUTION / AI PLATFORM', description: 'An AI workspace that brings models, connected tools, and creative capabilities together in one place.', extra: 'I contributed to OneBrain as part of the broader product effort.', url: 'https://onebrain.app', label: 'Explore OneBrain' },
  chinar: { title: 'ChinarAgro Admin App', role: 'BUILT / ADMIN APPLICATION', description: 'An admin application built for ChinarAgro.', extra: 'This project is part of my independently built work. The source code is available on GitHub.', url: 'https://github.com/sandeep14k/chinar_admin', label: 'View source code' },
  mahavir: { title: 'Mahavir Fashion', role: 'BUILT / WEB PROJECT', description: 'A web project I built for Mahavir Fashion.', extra: 'Part of my work translating business ideas into digital experiences. A verified live link is not currently included in this portfolio.' },
  iitk: { title: 'Students’ Placement Office, IIT Kanpur', role: 'CONTRIBUTION / INSTITUTIONAL WEBSITE', description: 'The Students’ Placement Office website connects IIT Kanpur students and recruiters with placement information, resources, and opportunities.', extra: 'I contributed to the website alongside the team.', url: 'https://spo.iitk.ac.in', label: 'Visit the website' }
};
const dialog = document.querySelector('#project-dialog');
let opener;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project]; opener = button;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-role').textContent = project.role;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-extra').textContent = project.extra;
  const links = document.querySelector('#dialog-links'); links.replaceChildren();
  if (project.url) { const link = document.createElement('a'); link.href = project.url; link.textContent = project.label + ' ↗'; link.className = 'button'; link.target = '_blank'; link.rel = 'noopener noreferrer'; links.append(link); }
  dialog.showModal(); document.body.classList.add('modal-open');
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { const bounds = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close(); });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); opener?.focus(); });
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); });
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && button.dataset.filter !== card.dataset.category; });
}));
document.querySelector('#copy-handle').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('sandeep14k'); status.textContent = 'Copied: sandeep14k'; } catch { status.textContent = 'GitHub handle: sandeep14k — select and copy.'; }
});
document.querySelector('#year').textContent = new Date().getFullYear();
