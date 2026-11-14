const stations = [
  { id: 'kexp', name: 'KEXP 90.3 FM', country: 'United States', city: 'Seattle', genre: 'Alternative', lat: 47.6062, lng: -122.3321, url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3', logo: 'https://www.kexp.org/favicon.ico' },
  { id: 'radio-paradise', name: 'Radio Paradise', country: 'United States', city: 'California', genre: 'Eclectic', lat: 39.7285, lng: -121.8375, url: 'https://stream.radioparadise.com/mp3-128', logo: 'https://radioparadise.com/favicon.ico' },
  { id: 'groove-salad', name: 'SomaFM Groove Salad', country: 'United States', city: 'San Francisco', genre: 'Ambient', lat: 37.7749, lng: -122.4194, url: 'https://ice2.somafm.com/groovesalad-128-mp3', logo: 'https://somafm.com/favicon.ico' },
  { id: 'wfmu', name: 'WFMU', country: 'United States', city: 'New Jersey', genre: 'Eclectic', lat: 40.7178, lng: -74.0431, url: 'https://stream0.wfmu.org/freeform-128k' },
  { id: 'bbc-world', name: 'BBC World Service', country: 'United Kingdom', city: 'London', genre: 'News', lat: 51.5072, lng: -0.1276, url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service' },
  { id: 'nts', name: 'NTS Radio 1', country: 'United Kingdom', city: 'London', genre: 'Eclectic', lat: 51.5465, lng: -0.0754, url: 'https://stream-relay-geo.ntslive.net/stream' },
  { id: 'fip', name: 'FIP', country: 'France', city: 'Paris', genre: 'Eclectic', lat: 48.8566, lng: 2.3522, url: 'https://icecast.radiofrance.fr/fip-midfi.mp3' },
  { id: 'tsf-jazz', name: 'TSF Jazz', country: 'France', city: 'Paris', genre: 'Jazz', lat: 48.8647, lng: 2.349, url: 'https://tsfjazz.ice.infomaniak.ch/tsfjazz-high.mp3' },
  { id: 'swiss-jazz', name: 'Radio Swiss Jazz', country: 'Switzerland', city: 'Basel', genre: 'Jazz', lat: 47.5596, lng: 7.5886, url: 'https://stream.srg-ssr.ch/m/rsj/mp3_128' },
  { id: 'swiss-classic', name: 'Radio Swiss Classic', country: 'Switzerland', city: 'Zurich', genre: 'Classical', lat: 47.3769, lng: 8.5417, url: 'https://stream.srg-ssr.ch/m/rsc_de/mp3_128' },
  { id: 'rte-radio-1', name: 'RTÉ Radio 1', country: 'Ireland', city: 'Dublin', genre: 'News', lat: 53.3498, lng: -6.2603, url: 'https://icecast.rte.ie/radio1' },
  { id: 'abc-jazz', name: 'ABC Jazz', country: 'Australia', city: 'Sydney', genre: 'Jazz', lat: -33.8688, lng: 151.2093, url: 'https://live-radio01.mediahubaustralia.com/JAZW/mp3/' },
  { id: 'triple-j', name: 'triple j', country: 'Australia', city: 'Sydney', genre: 'Alternative', lat: -33.883, lng: 151.201, url: 'https://live-radio01.mediahubaustralia.com/2TJW/mp3/' },
  { id: 'npr', name: 'NPR News', country: 'United States', city: 'Washington, DC', genre: 'News', lat: 38.9072, lng: -77.0369, url: 'https://npr-ice.streamguys1.com/live.mp3' }
];

const elements = {
  globe: document.querySelector('#globe'), globeStatus: document.querySelector('#globe-status'),
  stationName: document.querySelector('#station-name'), stationDetail: document.querySelector('#station-detail'),
  initials: document.querySelector('#art-initials'), logo: document.querySelector('#station-logo'), favorite: document.querySelector('#favorite'),
  favoriteCount: document.querySelector('#favorite-count'), play: document.querySelector('#play'),
  audio: document.querySelector('#audio'), volume: document.querySelector('#volume'),
  volumeValue: document.querySelector('#volume-value'), waveform: document.querySelector('#waveform'),
  playbackLabel: document.querySelector('#playback-label'), message: document.querySelector('#player-message'),
  list: document.querySelector('#station-list'), count: document.querySelector('#results-count'),
  search: document.querySelector('#search'), country: document.querySelector('#country-filter'),
  genre: document.querySelector('#genre-filter'), heading: document.querySelector('#browser-heading')
};

const favoritesKey = 'radioverse-favorites';
let favorites = loadFavorites();
let selectedStation = null;
let currentView = 'explore';
let globe = null;

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    return new Set(Array.isArray(saved) ? saved.filter(id => stations.some(station => station.id === id)) : []);
  } catch (error) {
    return new Set();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(favoritesKey, JSON.stringify([...favorites]));
  } catch (error) {
    elements.message.textContent = 'Favorites could not be saved in this browser.';
  }
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function populateFilters() {
  for (const [select, key] of [[elements.country, 'country'], [elements.genre, 'genre']]) {
    [...new Set(stations.map(station => station[key]))].sort().forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  }
}

function filteredStations() {
  const query = elements.search.value.trim().toLowerCase();
  return stations.filter(station => {
    const matchesText = [station.name, station.country, station.city, station.genre].some(value => value.toLowerCase().includes(query));
    return matchesText && (!elements.country.value || station.country === elements.country.value) &&
      (!elements.genre.value || station.genre === elements.genre.value) &&
      (currentView !== 'favorites' || favorites.has(station.id));
  });
}

function renderStations() {
  const results = filteredStations();
  elements.list.replaceChildren();
  elements.heading.textContent = currentView === 'favorites' ? 'Saved stations' : 'Explore stations';
  elements.count.textContent = `${results.length} ${results.length === 1 ? 'station' : 'stations'} ${currentView === 'favorites' ? 'saved' : 'to discover'}`;
  elements.favoriteCount.textContent = favorites.size;
  if (!results.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = currentView === 'favorites' && !favorites.size ? 'No favorites yet. Save a station to find it here.' : 'No stations found. Try a different search or filter.';
    elements.list.append(empty);
  }
  results.forEach(station => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `station-row${selectedStation?.id === station.id ? ' selected' : ''}`;
    button.setAttribute('aria-label', `Select ${station.name}, ${station.country}`);
    const number = document.createElement('span');
    number.className = 'station-number';
    number.textContent = station.name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase();
    const copy = document.createElement('span');
    copy.className = 'station-row-copy';
    const name = document.createElement('span');
    name.className = 'station-row-name';
    name.textContent = station.name;
    const detail = document.createElement('span');
    detail.className = 'station-row-detail';
    detail.textContent = `${station.city}, ${station.country} · ${station.genre}`;
    copy.append(name, detail);
    const arrow = document.createElement('i');
    arrow.setAttribute('data-lucide', 'arrow-up-right');
    button.append(number, copy, arrow);
    button.addEventListener('click', () => selectStation(station));
    elements.list.append(button);
  });
  if (globe) globe.pointsData(results);
  refreshIcons();
}

function updateFavoriteButton() {
  const isFavorite = selectedStation && favorites.has(selectedStation.id);
  elements.favorite.classList.toggle('is-favorite', Boolean(isFavorite));
  elements.favorite.setAttribute('aria-label', isFavorite ? 'Remove station from favorites' : 'Add station to favorites');
  elements.favorite.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
  elements.favorite.setAttribute('aria-pressed', String(Boolean(isFavorite)));
}

function updatePlayback(playing, label) {
  elements.waveform.classList.toggle('playing', playing);
  elements.playbackLabel.textContent = label || (playing ? 'ON AIR' : 'OFF AIR');
  elements.play.setAttribute('aria-label', playing ? 'Pause station' : 'Play station');
  elements.play.title = playing ? 'Pause station' : 'Play station';
  elements.play.innerHTML = `<i data-lucide="${playing ? 'pause' : 'play'}"></i>`;
  refreshIcons();
}

function selectStation(station) {
  elements.audio.pause();
  selectedStation = station;
  elements.audio.src = station.url;
  elements.stationName.textContent = station.name;
  elements.stationDetail.textContent = `${station.city}, ${station.country} · ${station.genre}`;
  elements.initials.textContent = station.name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase();
  elements.logo.parentElement.classList.remove('has-logo');
  elements.logo.hidden = true;
  elements.logo.removeAttribute('src');
  if (station.logo) elements.logo.src = station.logo;
  elements.favorite.disabled = false;
  elements.play.disabled = false;
  elements.message.textContent = '';
  updatePlayback(false);
  updateFavoriteButton();
  renderStations();
  if (globe) {
    globe.pointColor(point => point.id === station.id ? '#f5d69c' : '#9af7d5');
    globe.ringsData([station]);
    globe.pointOfView({ lat: station.lat, lng: station.lng, altitude: 1.8 }, 1500);
  }
}

function initGlobe() {
  if (typeof Globe !== 'function') {
    elements.globeStatus.textContent = 'The globe could not load. Check your connection; stations are still available.';
    return;
  }
  try {
    const loadingTimer = setTimeout(() => {
      elements.globeStatus.textContent = 'The Earth texture could not load. Check your connection and refresh.';
    }, 15000);
    globe = Globe()(elements.globe)
      .globeImageUrl('https://cdn.jsdelivr.net/gh/vasturiano/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('https://cdn.jsdelivr.net/gh/vasturiano/three-globe/example/img/earth-topology.png')
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true).atmosphereColor('#90e4d7').atmosphereAltitude(0.18)
      .pointsData(stations).pointLat('lat').pointLng('lng').pointAltitude(0.015)
      .pointRadius(0.32).pointColor(() => '#9af7d5')
      .pointLabel(point => `<strong>${point.name}</strong><br>${point.city}, ${point.country}<br>${point.genre}`)
      .onPointClick(selectStation)
      .ringLat('lat').ringLng('lng').ringColor(() => () => 'rgba(255, 215, 153, 0.8)')
      .ringMaxRadius(3).ringPropagationSpeed(1.5).ringRepeatPeriod(1100)
      .onGlobeReady(() => { clearTimeout(loadingTimer); elements.globeStatus.textContent = ''; });
    const controls = globe.controls();
    controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotateSpeed = 0.35;
    controls.enablePan = false;
    let resumeTimer;
    controls.addEventListener('start', () => { clearTimeout(resumeTimer); controls.autoRotate = false; });
    controls.addEventListener('end', () => {
      resumeTimer = setTimeout(() => { controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches; }, 4000);
    });
    globe.pointOfView({ lat: 20, lng: -15, altitude: 2.2 });
    const resize = () => globe.width(elements.globe.clientWidth).height(elements.globe.clientHeight);
    resize();
    window.addEventListener('resize', resize);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(elements.globe);
  } catch (error) {
    globe = null;
    elements.globeStatus.textContent = 'The globe could not start on this device. Choose a station from the list.';
  }
}

elements.audio.volume = Number(elements.volume.value);
elements.logo.addEventListener('load', () => {
  elements.logo.hidden = false;
  elements.logo.parentElement.classList.add('has-logo');
});
elements.logo.addEventListener('error', () => {
  elements.logo.hidden = true;
  elements.logo.parentElement.classList.remove('has-logo');
});
elements.volume.addEventListener('input', () => {
  elements.audio.volume = Number(elements.volume.value);
  elements.volumeValue.textContent = `${Math.round(elements.audio.volume * 100)}%`;
});
elements.play.addEventListener('click', async () => {
  if (!selectedStation) return;
  if (!elements.audio.paused) { elements.audio.pause(); return; }
  elements.message.textContent = '';
  updatePlayback(false, 'CONNECTING');
  const requestedStation = selectedStation;
  try {
    await elements.audio.play();
  } catch (error) {
    if (error.name === 'AbortError' || selectedStation !== requestedStation) return;
    updatePlayback(false);
    elements.message.textContent = 'This stream is unavailable or unsupported. Try another station.';
  }
});
elements.audio.addEventListener('playing', () => { elements.message.textContent = ''; updatePlayback(true); });
elements.audio.addEventListener('pause', () => updatePlayback(false));
elements.audio.addEventListener('waiting', () => updatePlayback(false, 'CONNECTING'));
elements.audio.addEventListener('error', () => {
  if (!selectedStation) return;
  updatePlayback(false);
  elements.message.textContent = 'This stream is unavailable or unsupported. Try another station.';
});
elements.favorite.addEventListener('click', () => {
  if (!selectedStation) return;
  if (favorites.has(selectedStation.id)) favorites.delete(selectedStation.id); else favorites.add(selectedStation.id);
  saveFavorites();
  updateFavoriteButton();
  renderStations();
});
[elements.search, elements.country, elements.genre].forEach(element => element.addEventListener('input', renderStations));
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
  currentView = button.dataset.view;
  document.querySelectorAll('[data-view]').forEach(link => link.classList.toggle('active', link === button));
  elements.search.value = '';
  elements.country.value = '';
  elements.genre.value = '';
  renderStations();
  if (currentView === 'favorites') elements.heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
}));
document.querySelector('#discover').addEventListener('click', () => {
  const candidates = filteredStations();
  if (!candidates.length) { elements.message.textContent = 'No stations match your current filters.'; return; }
  const choices = candidates.length > 1 ? candidates.filter(station => station.id !== selectedStation?.id) : candidates;
  selectStation(choices[Math.floor(Math.random() * choices.length)]);
});
document.querySelector('#zoom-in').addEventListener('click', () => { if (globe) globe.pointOfView({ altitude: Math.max(0.7, globe.pointOfView().altitude - 0.4) }, 500); });
document.querySelector('#zoom-out').addEventListener('click', () => { if (globe) globe.pointOfView({ altitude: Math.min(4, globe.pointOfView().altitude + 0.4) }, 500); });

populateFilters();
renderStations();
initGlobe();
refreshIcons();