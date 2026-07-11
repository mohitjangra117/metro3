/* ================= NETWORK DATA & CONFIG ================= */
var LINEMETA = {
  blue: { label: 'Blue Line', color: '#1B6FB8', tint: '#EAF3FA', dark: '#1B6FB8' },
  yellow: { label: 'Yellow Line', color: '#EFBF2E', tint: '#FCF8E9', dark: '#8C6A0A' },
  pink: { label: 'Pink Line', color: '#E8558D', tint: '#FDF4F8', dark: '#B23A6B' },
  magenta: { label: 'Magenta Line', color: '#A2328C', tint: '#FAF3F9', dark: '#7A2569' },
  violet: { label: 'Violet Line', color: '#7C5CE0', tint: '#F4F2FC', dark: '#5A3FB0' },
  green: { label: 'Green Line', color: '#3FA35A', tint: '#EDF7EE', dark: '#1E6B30' },
  orange: { label: 'Airport Express', color: '#F7941D', tint: '#FEF8F0', dark: '#A6600E' },
  red: { label: 'Red Line', color: '#D6455B', tint: '#FDF3F5', dark: '#9A2B3E' },
  grey: { label: 'Grey Line', color: '#8B9AAB', tint: '#F6F7F9', dark: '#5B6C7D' },
  aqua: { label: 'Aqua Line', color: '#00B5AD', tint: '#F0FAF9', dark: '#007A75' },
  rapid: { label: 'Rapid Metro', color: '#6C757D', tint: '#F6F6F6', dark: '#495057' }
};

var STATIONS = [];
var FARES = [];
var TIMETABLE = {};
var ROUTES = {};

var RECENT = ['Kirti Nagar', 'Rajiv Chowk', 'Hauz Khas'];
var favSet = new Set(['Rajiv Chowk', 'Kirti Nagar', 'Botanical Garden']);
var walletBalance = 210;

/* ================= SCREEN LOADER & ROUTER ================= */
var stack = ['splash'];
var loadedScreens = {
  splash: true
};

var ALL_SCREENS = [
  'onboard', 'login', 'otp', 'home', 'search', 'routeplanner', 'map', 'station',
  'livejourney', 'farecalc', 'ticketbooking', 'payment', 'qrticket', 'receipt',
  'ratejourney', 'timetable', 'nearby', 'lastmile', 'wallet', 'walletrecharge',
  'notifications', 'servicealerts', 'profile', 'settings', 'travelhistory',
  'favorites', 'help'
];

async function loadAppData() {
  try {
    var resStations = await fetch('data/stations.json');
    STATIONS = await resStations.json();
  } catch (e) {
    console.error('Failed to load stations.json, using fallback', e);
    STATIONS = [
      { name: 'Dwarka Sector 21', lat: 28.552322, lon: 77.056198, lines: ['blue', 'orange'] },
      { name: 'Janakpuri West', lat: 28.629637, lon: 77.077866, lines: ['blue', 'magenta'] },
      { name: 'Rajouri Garden', lat: 28.639366, lon: 77.123188, lines: ['blue', 'pink'] },
      { name: 'Karol Bagh', lat: 28.644312, lon: 77.199791, lines: ['blue'] },
      { name: 'Rajiv Chowk', lat: 28.630662, lon: 77.218876, lines: ['blue', 'yellow'] },
      { name: 'Barakhamba Road', lat: 28.629662, lon: 77.224876, lines: ['blue'] },
      { name: 'Mandi House', lat: 28.625662, lon: 77.234876, lines: ['blue', 'violet'] },
      { name: 'Yamuna Bank', lat: 28.621272, lon: 77.260076, lines: ['blue'] },
      { name: 'Noida Sector 15', lat: 28.578199, lon: 77.307947, lines: ['blue'] },
      { name: 'Noida Sector 16', lat: 28.578199, lon: 77.317947, lines: ['blue'] },
      { name: 'Botanical Garden', lat: 28.564198, lon: 77.334656, lines: ['blue', 'magenta'] },
      { name: 'Vaishali', lat: 28.649635, lon: 77.340076, lines: ['blue'] },
      { name: 'Samaypur Badli', lat: 28.746377, lon: 77.148809, lines: ['yellow'] },
      { name: 'Vishwavidyalaya', lat: 28.698195, lon: 77.206985, lines: ['yellow'] },
      { name: 'Kashmere Gate', lat: 28.6675, lon: 77.2285, lines: ['yellow', 'red', 'violet'] },
      { name: 'Chandni Chowk', lat: 28.656443, lon: 77.229218, lines: ['yellow'] },
      { name: 'New Delhi', lat: 28.641776, lon: 77.221545, lines: ['yellow', 'orange'] },
      { name: 'INA', lat: 28.575195, lon: 77.209473, lines: ['yellow', 'pink'] },
      { name: 'AIIMS', lat: 28.568199, lon: 77.207947, lines: ['yellow'] },
      { name: 'Hauz Khas', lat: 28.543346, lon: 77.206673, lines: ['yellow', 'magenta'] },
      { name: 'Saket', lat: 28.521836, lon: 77.208243, lines: ['yellow'] },
      { name: 'HUDA City Centre', lat: 28.459118, lon: 77.072586, lines: ['yellow'] },
      { name: 'Lajpat Nagar', lat: 28.570208, lon: 77.23753, lines: ['pink', 'violet'] },
      { name: 'Kirti Nagar', lat: 28.655159, lon: 77.137319, lines: ['green', 'blue'] },
      { name: 'Shadipur', lat: 28.651572, lon: 77.155159, lines: ['pink'] }
    ];
  }

  try {
    var resFares = await fetch('data/fares.json');
    FARES = await resFares.json();
  } catch (e) {
    console.error('Failed to load fares.json, using fallback', e);
    FARES = [
      { min_km: 0, max_km: 2, token: 10, card: 10 },
      { min_km: 2, max_km: 5, token: 20, card: 15 },
      { min_km: 5, max_km: 12, token: 30, card: 25 },
      { min_km: 12, max_km: 21, token: 40, card: 30 },
      { min_km: 21, max_km: 32, token: 50, card: 40 },
      { min_km: 32, max_km: 999, token: 60, card: 50 }
    ];
  }

  try {
    var resTimetable = await fetch('data/timetable.json');
    TIMETABLE = await resTimetable.json();
  } catch (e) {
    console.error('Failed to load timetable.json, using fallback', e);
    TIMETABLE = {
      blue: { first: '4:45 AM', last: '11:40 PM', peak_freq: '3 min', offpeak_freq: '5 min' },
      yellow: { first: '5:00 AM', last: '11:30 PM', peak_freq: '3 min', offpeak_freq: '5 min' },
      red: { first: '5:00 AM', last: '11:30 PM', peak_freq: '3 min', offpeak_freq: '6 min' },
      violet: { first: '5:00 AM', last: '11:30 PM', peak_freq: '4 min', offpeak_freq: '6 min' },
      magenta: { first: '5:00 AM', last: '11:30 PM', peak_freq: '4 min', offpeak_freq: '7 min' }
    };
  }

  try {
    var resRoutes = await fetch('data/routes.json');
    ROUTES = await resRoutes.json();
  } catch (e) {
    console.error('Failed to load routes.json', e);
  }
}

async function ensureScreenLoaded(id) {
  if (loadedScreens[id]) return;
  try {
    var response = await fetch('screens/' + id + '.html');
    if (!response.ok) throw new Error('Status ' + response.status);
    var html = await response.text();

    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = html.trim();
    var screenEl = tempDiv.firstElementChild;
    if (!screenEl) throw new Error('Empty HTML structure');

    document.getElementById('screens').appendChild(screenEl);
    loadedScreens[id] = true;

    // Initialize specific listeners for this screen
    initScreenListeners(id, screenEl);
  } catch (e) {
    console.error('Failed to load screen template:', id, e);
    if (window.location.protocol === 'file:') {
      showCORSWarning();
    }
  }
}

var corsWarningShown = false;
function showCORSWarning() {
  if (corsWarningShown) return;
  corsWarningShown = true;
  var alertDiv = document.createElement('div');
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '0';
  alertDiv.style.left = '0';
  alertDiv.style.width = '100vw';
  alertDiv.style.height = '100vh';
  alertDiv.style.background = 'rgba(10, 31, 51, 0.95)';
  alertDiv.style.color = '#fff';
  alertDiv.style.display = 'flex';
  alertDiv.style.flexDirection = 'column';
  alertDiv.style.alignItems = 'center';
  alertDiv.style.justifyContent = 'center';
  alertDiv.style.padding = '30px';
  alertDiv.style.boxSizing = 'border-box';
  alertDiv.style.zIndex = '99999';
  alertDiv.style.fontFamily = "'Inter', sans-serif";
  alertDiv.style.textAlign = 'center';

  alertDiv.innerHTML = `
    <div style="font-size: 50px; margin-bottom: 20px;">⚠️</div>
    <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 12px;">Local Browser Security Block</div>
    <div style="font-size: 13px; line-height: 1.6; max-width: 400px; opacity: 0.9; margin-bottom: 24px;">
      Modern browsers restrict loading separate sub-files (like screens or JSON data) directly from the <b>file://</b> protocol due to security (CORS) rules.
    </div>
    <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; text-align: left; max-width: 420px; font-size: 12px; line-height: 1.5; margin-bottom: 24px; border: 1px dashed rgba(255,255,255,0.2);">
      <b>How to run on PC:</b><br>
      • Open the single-file simulator <b>metro-companion-app-simulator.html</b> in the root folder, OR<br>
      • Run a local web server (e.g. <code>python -m http.server</code> in the asset directory) and open <code>http://localhost:8000</code>.
    </div>
    <button id="closeCorsWarning" style="background: #fff; color: #0A1F33; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.2s;">
      Continue anyway (App might fail)
    </button>
  `;
  document.body.appendChild(alertDiv);

  document.getElementById('closeCorsWarning').addEventListener('click', function () {
    alertDiv.remove();
  });
}

async function prefetchScreens() {
  await loadAppData();
  await ensureScreenLoaded('onboard');
  await ensureScreenLoaded('home');

  // Load remaining in background
  ALL_SCREENS.forEach(async function (id) {
    if (id !== 'onboard' && id !== 'home') {
      ensureScreenLoaded(id);
    }
  });

  // Auto transition from splash to onboarding screen
  setTimeout(function () {
    if (stack[stack.length - 1] === 'splash') {
      goRoot('onboard');
    }
  }, 1500);
}

function render() {
  document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active', 'stacked'); });
  var top = stack[stack.length - 1];
  var below = stack[stack.length - 2];
  var topEl = document.getElementById('scr-' + top);
  if (topEl) topEl.classList.add('active');
  if (below) { var belowEl = document.getElementById('scr-' + below); if (belowEl) belowEl.classList.add('stacked'); }

  document.querySelectorAll('.bottomnav .n').forEach(function (n) {
    n.classList.toggle('active', n.getAttribute('data-tab') === top);
  });
}

async function push(id) {
  await ensureScreenLoaded(id);
  stack.push(id);
  render();
  onEnter(id);
}

async function goRoot(id) {
  await ensureScreenLoaded(id);
  stack = [id];
  render();
  onEnter(id);
}

function back() {
  if (stack.length > 1) {
    stack.pop();
    render();
    onEnter(stack[stack.length - 1]);
  }
}

function restartApp() {
  stack = ['splash'];
  render();
  setTimeout(function () { goRoot('onboard'); }, 1500);
}

function onEnter(id) {
  if (id === 'home') {
    var balLine = document.querySelector('#scr-home #homewalletline');
    if (balLine) balLine.textContent = 'Balance ₹' + walletBalance + ' · Tap to recharge';
  }
  if (id === 'routeplanner') renderRoute();
  if (id === 'farecalc') renderFare();
  if (id === 'ticketbooking') renderTicketBooking();
  if (id === 'qrticket') renderQr();
  if (id === 'favorites') renderFavorites();
  if (id === 'station') renderStation();
  if (id === 'timetable') populateTimetable();
  if (id === 'livejourney') startLiveJourneyAnimation();
  if (id === 'profile') {
    var profbal = document.querySelector('#scr-profile #profwalletbal');
    if (profbal) profbal.textContent = '₹' + walletBalance;
  }
  if (id === 'wallet') {
    var wallbal = document.querySelector('#scr-wallet #walletbalbig');
    if (wallbal) wallbal.textContent = '₹' + walletBalance;
  }
  if (id === 'walletrecharge') {
    var rechbal = document.querySelector('#scr-walletrecharge #rechargebal');
    if (rechbal) rechbal.textContent = '₹' + walletBalance;
  }
  if (id === 'ratejourney') {
    var main = document.getElementById('ratemain');
    var thanks = document.getElementById('ratethanks');
    if (main) main.style.display = 'flex';
    if (thanks) thanks.style.display = 'none';
  }
}

/* ================= PATHFINDING & HA VERSINE MATH ================= */
function haversineDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getFareForDistance(dist) {
  for (var i = 0; i < FARES.length; i++) {
    var f = FARES[i];
    if (dist >= f.min_km && dist < f.max_km) {
      return { token: f.token, card: f.card };
    }
  }
  return { token: 60, card: 50 };
}

function findRoute(fromName, toName) {
  var fromSt = STATIONS.find(function (s) { return s.name === fromName; });
  var toSt = STATIONS.find(function (s) { return s.name === toName; });

  if (!fromSt || !toSt) {
    return {
      stations: 15,
      distance: '18.5',
      time: 35,
      changes: 1,
      fareToken: 40,
      fareCard: 30,
      desc: 'Path computed via default fallback lines.'
    };
  }

  var distance = haversineDistance(fromSt.lat, fromSt.lon, toSt.lat, toSt.lon);
  distance = distance * 1.35; // account for real rail winding
  if (distance < 0.6) distance = 0.6;

  var fromLines = fromSt.lines || [];
  var toLines = toSt.lines || [];
  var sharedLines = fromLines.filter(function (l) { return toLines.indexOf(l) > -1; });

  var changes = 0;
  var pathDesc = '';
  var stationsCount = Math.max(1, Math.round(distance / 1.3));

  if (sharedLines.length > 0) {
    changes = 0;
    var lineName = sharedLines[0];
    var lineLabel = (ROUTES[lineName] && ROUTES[lineName].label) || lineName;
    pathDesc = 'Direct line via ' + lineLabel + ', no transfer required.';
  } else {
    // Find a single interchange station
    var interchangeSt = null;
    var bestDist = Infinity;

    for (var i = 0; i < STATIONS.length; i++) {
      var st = STATIONS[i];
      var hasFrom = st.lines.some(function (l) { return fromLines.indexOf(l) > -1; });
      var hasTo = st.lines.some(function (l) { return toLines.indexOf(l) > -1; });
      if (hasFrom && hasTo) {
        var d = haversineDistance(fromSt.lat, fromSt.lon, st.lat, st.lon) +
          haversineDistance(st.lat, st.lon, toSt.lat, toSt.lon);
        if (d < bestDist) {
          bestDist = d;
          interchangeSt = st;
        }
      }
    }

    if (interchangeSt) {
      changes = 1;
      var line1 = fromLines.find(function (l) { return interchangeSt.lines.indexOf(l) > -1; });
      var line2 = toLines.find(function (l) { return interchangeSt.lines.indexOf(l) > -1; });
      var l1Label = (ROUTES[line1] && ROUTES[line1].label) || line1;
      var l2Label = (ROUTES[line2] && ROUTES[line2].label) || line2;
      pathDesc = 'Take ' + l1Label + ', transfer at ' + interchangeSt.name + ' to ' + l2Label + '.';
      distance = bestDist * 1.35;
      stationsCount = Math.max(2, Math.round(distance / 1.3));
    } else {
      changes = 2;
      pathDesc = 'Requires double transfer. Follow platform signs to complete journey.';
      stationsCount = Math.max(3, Math.round(distance / 1.3));
    }
  }

  var time = Math.round(stationsCount * 2 + changes * 5);
  var fare = getFareForDistance(distance);

  return {
    stations: stationsCount,
    distance: distance.toFixed(1),
    time: time,
    changes: changes,
    fareToken: fare.token,
    fareCard: fare.card,
    desc: pathDesc
  };
}

function stationOf(name) {
  return STATIONS.find(function (s) { return s.name === name; }) || { name: name, lines: ['blue'] };
}

function lineChipsFor(name) {
  var st = stationOf(name);
  return (st.lines || []).map(function (l) {
    var meta = LINEMETA[l] || { tint: '#EAF3FA', dark: '#1B6FB8', label: l };
    return '<span class="chip" style="background:' + meta.tint + ';color:' + meta.dark + ';">' + meta.label + '</span>';
  }).join('');
}

/* ================= SEARCH WIDGET LOGIC ================= */
var searchTargetField = 'to';
var currentFrom = 'Noida Sector 15', currentTo = 'Kirti Nagar';
var fareFrom = 'Noida Sector 15', fareTo = 'Kirti Nagar';

function stationChip(st) {
  var linesHtml = st.lines.map(function (l) {
    var meta = LINEMETA[l] || { color: '#1B6FB8' };
    return '<span style="width:6px;height:6px;border-radius:50%;background:' + meta.color + ';display:inline-block;"></span>';
  }).join('');

  return '<div class="list-item" onclick="pickStation(\'' + st.name.replace(/'/g, "\\'") + '\')"><div class="icwrap">◉</div><div style="flex:1;"><div class="t">' + st.name + '</div><div class="s" style="display:flex;align-items:center;gap:4px;">' + linesHtml + ' ' + st.lines.map(function (l) { return l.toUpperCase(); }).join(', ') + '</div></div></div>';
}

function openSearch(target) {
  searchTargetField = target;
  var box = document.getElementById('searchbox');
  if (box) box.value = '';
  var label = document.getElementById('searchsectionlabel');
  if (label) label.textContent = 'Recent';

  var recentList = RECENT.map(function (n) { return STATIONS.find(function (s) { return s.name === n; }); }).filter(Boolean);
  renderSearchList(recentList);
  push('search');
  setTimeout(function () {
    var b = document.getElementById('searchbox');
    if (b) b.focus();
  }, 350);
}

function renderSearchList(list) {
  var results = document.getElementById('searchresults');
  if (!results) return;
  results.innerHTML = list.length ? list.map(stationChip).join('') : '<div class="emptybox">No stations found. Try another search.</div>';
}

function filterStations(q) {
  q = q.trim().toLowerCase();
  var label = document.getElementById('searchsectionlabel');
  if (label) label.textContent = q ? 'Results' : 'Recent';

  var list = q ? STATIONS.filter(function (s) { return s.name.toLowerCase().indexOf(q) > -1; }) : RECENT.map(function (n) { return STATIONS.find(function (s) { return s.name === n; }); }).filter(Boolean);
  renderSearchList(list);
}

function pickStation(name) {
  if (RECENT.indexOf(name) === -1) {
    RECENT.unshift(name);
    RECENT = RECENT.slice(0, 5);
  }

  if (searchTargetField === 'from') { currentFrom = name; }
  else if (searchTargetField === 'fcfrom') { fareFrom = name; }
  else if (searchTargetField === 'fcto') { fareTo = name; }
  else { currentTo = name; }

  back();
  if (searchTargetField === 'fcfrom' || searchTargetField === 'fcto') {
    renderFare();
  } else {
    push('routeplanner');
  }
}

function quickRoute(name) {
  currentTo = name;
  push('routeplanner');
}

/* ================= RENDERING HELPER METHODS ================= */
function renderRoute() {
  var rpfrom = document.getElementById('rpfrom');
  var rpto = document.getElementById('rpto');
  if (rpfrom) rpfrom.textContent = currentFrom;
  if (rpto) rpto.textContent = currentTo;

  var activeTab = document.querySelector('#rptabs .tabbtn.on');
  var mode = activeTab ? activeTab.getAttribute('data-mode') : 'fast';
  drawRouteResult(mode);
}

function drawRouteResult(mode) {
  var r = findRoute(currentFrom, currentTo);
  var rpresult = document.getElementById('rpresult');
  if (!rpresult) return;

  var fare = r.fareToken;
  var desc = r.desc;
  if (mode === 'cheap') {
    fare = r.fareCard;
    desc = 'Smart-card fare with discount applied. ' + r.desc;
  }

  var html = '<div class="card"><div class="chiprow" style="margin-bottom:8px;">' + lineChipsFor(currentFrom) + '</div><div style="font-size:11px;line-height:1.7;color:var(--ink-soft);">' + currentFrom + ' → ' + currentTo + '<br>' + desc + '</div></div>';
  html += '<div class="kpi-row"><div class="kpi"><b>' + r.time + ' min</b><span>Time</span></div><div class="kpi"><b>' + r.changes + '</b><span>Change' + (r.changes === 1 ? '' : 's') + '</span></div><div class="kpi"><b>₹' + fare + '</b><span>Fare</span></div></div>';
  rpresult.innerHTML = html;
}

function swapRoute() {
  var t = currentFrom;
  currentFrom = currentTo;
  currentTo = t;
  renderRoute();
}

function startLiveFromRoute() {
  push('livejourney');
}

/* ---- Fare calculator ---- */
var faxPax = 1, fareType = 'token';

function renderFare() {
  var fcfrom = document.getElementById('fcfrom');
  var fcto = document.getElementById('fcto');
  if (fcfrom) fcfrom.textContent = fareFrom;
  if (fcto) fcto.textContent = fareTo;

  var r = findRoute(fareFrom, fareTo);
  var fckpis = document.getElementById('fckpis');
  if (fckpis) {
    fckpis.innerHTML = '<div class="kpi"><b>' + r.stations + '</b><span>Stations</span></div><div class="kpi"><b>' + r.distance + ' km</b><span>Distance</span></div>';
  }

  var fctokenprice = document.getElementById('fctokenprice');
  var fccardprice = document.getElementById('fccardprice');
  if (fctokenprice) fctokenprice.textContent = '₹' + r.fareToken;
  if (fccardprice) fccardprice.textContent = '₹' + r.fareCard;
  updateFareBook();
}

function selectFare(type) {
  fareType = type;
  var fctoken = document.getElementById('fctoken');
  var fccard = document.getElementById('fccard');
  if (fctoken) fctoken.classList.toggle('sel', type === 'token');
  if (fccard) fccard.classList.toggle('sel', type === 'card');
  updateFareBook();
}

function changePax(d) {
  faxPax = Math.max(1, Math.min(6, faxPax + d));
  var paxcount = document.getElementById('paxcount');
  if (paxcount) paxcount.textContent = faxPax;
  updateFareBook();
}

function updateFareBook() {
  var r = findRoute(fareFrom, fareTo);
  var unit = fareType === 'token' ? r.fareToken : r.fareCard;
  var total = unit * faxPax;
  var farebook = document.getElementById('farebook');
  if (farebook) farebook.textContent = 'Book this journey — ₹' + total;
}

function swapFare() {
  var t = fareFrom;
  fareFrom = fareTo;
  fareTo = t;
  renderFare();
}

/* ---- Ticket booking ---- */
var lastFareTotal = 50;

function renderTicketBooking() {
  var tbroute = document.getElementById('tbroute');
  var tbmeta = document.getElementById('tbmeta');
  var tbfare = document.getElementById('tbfare');
  var tbpaybtn = document.getElementById('tbpaybtn');
  var tbwalletbal = document.getElementById('tbwalletbal');

  if (tbroute) tbroute.textContent = currentFrom + ' → ' + currentTo;
  if (tbmeta) tbmeta.textContent = faxPax + ' adult' + (faxPax > 1 ? 's' : '') + ' · ' + (fareType === 'token' ? 'Token fare' : 'Smart card fare');

  var r = findRoute(currentFrom, currentTo);
  var unit = fareType === 'token' ? r.fareToken : r.fareCard;
  var total = unit * faxPax;

  if (tbfare) tbfare.textContent = '₹' + total;
  if (tbpaybtn) tbpaybtn.textContent = 'Pay ₹' + total;
  if (tbpaybtn) tbpaybtn.classList.remove('done');
  if (tbwalletbal) tbwalletbal.textContent = '₹' + walletBalance;
  lastFareTotal = total;
}

function closePayment() { back(); }
function afterPayment() { goRoot('home'); push('qrticket'); }

/* ---- QR ticket ---- */
var qrTotalSec = 58 * 60, qrTimerStarted = false;

function renderQr() {
  var qrroute = document.getElementById('qrroute');
  var qrfare = document.getElementById('qrfare');
  var qrpax = document.getElementById('qrpax');
  var rcfrom = document.getElementById('rcfrom');
  var rcto = document.getElementById('rcto');
  var rcfare = document.getElementById('rcfare');
  var rctime = document.getElementById('rctime');
  var ratejourneyroute = document.getElementById('ratejourneyroute');

  if (qrroute) qrroute.textContent = (currentFrom + ' → ' + currentTo).toUpperCase();
  if (qrfare) qrfare.textContent = '₹' + lastFareTotal;
  if (qrpax) qrpax.textContent = faxPax;
  if (rcfrom) rcfrom.textContent = currentFrom;
  if (rcto) rcto.textContent = currentTo;
  if (rcfare) rcfare.textContent = '₹' + lastFareTotal;

  var r = findRoute(currentFrom, currentTo);
  if (rctime) rctime.textContent = r.time + ' min';
  if (ratejourneyroute) ratejourneyroute.textContent = currentFrom + ' → ' + currentTo;

  if (!qrTimerStarted) {
    qrTimerStarted = true;
    setInterval(function () {
      if (qrTotalSec <= 0) return;
      qrTotalSec--;
      var m = Math.floor(qrTotalSec / 60), s = qrTotalSec % 60;
      var el = document.getElementById('qrcountdown');
      if (el) el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }, 1000);
  }
}

/* ================= STATIONS / MAP ================= */
var currentStation = 'Rajiv Chowk';

function openStation(name) {
  currentStation = name;
  push('station');
}

function renderStation() {
  var st = stationOf(currentStation);
  var stname = document.getElementById('stname');
  var stlines = document.getElementById('stlines');
  var stfav = document.getElementById('stfav');

  if (stname) stname.textContent = currentStation;
  if (stlines) stlines.innerHTML = lineChipsFor(currentStation);
  if (stfav) {
    stfav.classList.toggle('on', favSet.has(currentStation));
    stfav.textContent = favSet.has(currentStation) ? '♥' : '♡';
  }

  var firstTime = '5:00 AM';
  var lastTime = '11:30 PM';
  var platformText = (st.lines && st.lines.length > 1) ? 'Interchange station · ' + (st.lines.length * 2) + ' platforms' : '2 platforms';

  if (st.lines && st.lines.length > 0) {
    var l = st.lines[0];
    if (TIMETABLE[l]) {
      firstTime = TIMETABLE[l].first;
      lastTime = TIMETABLE[l].last;
    }
  }

  var firsttrain = document.getElementById('stfirsttrain');
  var lasttrain = document.getElementById('stlasttrain');
  var platforminfo = document.getElementById('stplatforminfo');
  var coords = document.getElementById('stcoords');

  if (firsttrain) firsttrain.textContent = firstTime;
  if (lasttrain) lasttrain.textContent = lastTime;
  if (platforminfo) platforminfo.textContent = platformText;
  if (coords && st.lat && st.lon) {
    coords.textContent = 'Coordinates: ' + st.lat.toFixed(5) + ', ' + st.lon.toFixed(5);
  }
}

function toggleFav() {
  if (favSet.has(currentStation)) {
    favSet.delete(currentStation);
  } else {
    favSet.add(currentStation);
  }
  renderStation();
}

function planFromStation() {
  currentFrom = currentStation;
  push('routeplanner');
}

function renderFavorites() {
  var list = Array.from(favSet).map(function (n) { return stationOf(n); });
  var favlist = document.getElementById('favlist');
  if (!favlist) return;

  favlist.innerHTML = list.length ? list.map(function (st) {
    return '<div class="list-item" onclick="openStation(\'' + st.name.replace(/'/g, "\\'") + '\')"><div class="icwrap">♥</div><div style="flex:1;"><div class="t">' + st.name + '</div><div class="s">' + st.lines.map(function (l) { return (LINEMETA[l] && LINEMETA[l].label) || l; }).join(' · ') + '</div></div><div class="r">›</div></div>';
  }).join('') : '<div class="emptybox">No saved stations yet.<br>Tap the heart icon on any station to save it here.</div>';
}

var mapScale = 1;
function zoomMap(dir) {
  mapScale = Math.min(1.6, Math.max(0.7, mapScale + dir * 0.15));
  var mapsvg = document.getElementById('mapsvg');
  if (mapsvg) mapsvg.style.transform = 'scale(' + mapScale + ')';
}

function populateTimetable() {
  var lines = ['blue', 'yellow', 'red', 'violet', 'magenta'];
  lines.forEach(function (l) {
    var t = TIMETABLE[l];
    if (!t) return;

    var panel = document.getElementById('tt-' + l);
    if (panel) {
      var kpis = panel.querySelectorAll('.kpi b');
      if (kpis.length >= 2) {
        kpis[0].textContent = t.first;
        kpis[1].textContent = t.last;
      }
      var peakEl = panel.querySelector('.list-item:nth-of-type(1) .s');
      if (peakEl) peakEl.textContent = 'Every ' + t.peak_freq;
      var offpeakEl = panel.querySelector('.list-item:nth-of-type(2) .s');
      if (offpeakEl) offpeakEl.textContent = 'Every ' + t.offpeak_freq;
    }
  });
}

/* ================= LIVE ANIMATED TRACKING ================= */
var liveJourneyInterval = null;

function startLiveJourneyAnimation() {
  if (liveJourneyInterval) clearInterval(liveJourneyInterval);

  var percent = 0;
  var r = findRoute(currentFrom, currentTo);
  var totalDist = parseFloat(r.distance);

  var progressPercentEl = document.getElementById('liveprogresspercent');
  var progressBarEl = document.getElementById('liveprogressbar');
  var currentStEl = document.getElementById('livecurrentstation');
  var remainingDistEl = document.getElementById('liveremainingdist');
  var nextStEl = document.getElementById('livenextstation');
  var nextTimeEl = document.getElementById('livenexttime');
  var routeEl = document.getElementById('livejourneyroute');

  if (routeEl) routeEl.textContent = currentFrom + ' → ' + currentTo;

  function updateFrame() {
    percent += 5;
    if (percent > 100) percent = 100;

    if (progressPercentEl) progressPercentEl.textContent = percent + '%';
    if (progressBarEl) {
      progressBarEl.style.width = percent + '%';
      progressBarEl.style.setProperty('--fillw', percent + '%');
    }

    var rem = (totalDist * (1 - percent / 100)).toFixed(1);
    if (remainingDistEl) remainingDistEl.textContent = rem + ' km';

    if (percent < 30) {
      if (currentStEl) currentStEl.textContent = currentFrom;
      if (nextStEl) nextStEl.textContent = 'Transit Station';
      if (nextTimeEl) nextTimeEl.textContent = 'Arriving in 2 min';
    } else if (percent < 80) {
      if (currentStEl) currentStEl.textContent = 'Approaching Interchange';
      if (nextStEl) nextStEl.textContent = 'Interchange Station';
      if (nextTimeEl) nextTimeEl.textContent = 'Arriving in 3 min';
    } else {
      if (currentStEl) currentStEl.textContent = 'Arriving Shortly';
      if (nextStEl) nextStEl.textContent = currentTo;
      if (nextTimeEl) nextTimeEl.textContent = 'Arriving in 1 min';
    }

    if (percent === 100) {
      clearInterval(liveJourneyInterval);
      if (nextTimeEl) nextTimeEl.textContent = 'Arrived ✓';
    }
  }

  updateFrame();
  liveJourneyInterval = setInterval(updateFrame, 1500);
}

/* ================= EVENT SETUP FOR LAZY SCREENS ================= */
function initScreenListeners(id, container) {
  if (id === 'login') {
    var btn = container.querySelector('#loginbtn');
    if (btn) {
      btn.addEventListener('click', function () {
        var phone = container.querySelector('#loginphone').value.trim();
        var otpphoneEl = document.getElementById('otpphone');
        if (otpphoneEl) otpphoneEl.textContent = '+91 ' + (phone || '98765 43210');
        push('otp');
      });
    }
  }

  if (id === 'otp') {
    var otpboxes = container.querySelectorAll('#otpgroup .otpbox');
    otpboxes.forEach(function (box, i) {
      box.addEventListener('input', function () {
        box.value = box.value.replace(/[^0-9]/g, '').slice(0, 1);
        if (box.value && otpboxes[i + 1]) otpboxes[i + 1].focus();
      });
      box.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !box.value && otpboxes[i - 1]) otpboxes[i - 1].focus();
      });
    });

    var btnVerify = container.querySelector('#otpverify');
    if (btnVerify) {
      btnVerify.addEventListener('click', function () {
        var filled = Array.from(otpboxes).every(function (b) { return b.value.length === 1; });
        if (!filled) {
          btnVerify.textContent = 'Enter all 4 digits';
          setTimeout(function () { btnVerify.textContent = 'Verify & continue'; }, 1100);
          return;
        }
        btnVerify.textContent = 'Verifying…';
        setTimeout(function () {
          btnVerify.textContent = 'Verified ✓';
          btnVerify.classList.add('done');
          setTimeout(function () {
            btnVerify.classList.remove('done');
            btnVerify.textContent = 'Verify & continue';
            goRoot('home');
          }, 500);
        }, 700);
      });
    }
  }

  if (id === 'search') {
    var searchbox = container.querySelector('#searchbox');
    if (searchbox) {
      searchbox.addEventListener('input', function () {
        filterStations(this.value);
      });
    }
  }

  if (id === 'routeplanner') {
    var rptabs = container.querySelector('#rptabs');
    if (rptabs) {
      rptabs.addEventListener('click', function (e) {
        var btn = e.target.closest('.tabbtn'); if (!btn) return;
        rptabs.querySelectorAll('.tabbtn').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        drawRouteResult(btn.getAttribute('data-mode'));
      });
    }
  }

  if (id === 'farecalc') {
    var fareBookEl = container.querySelector('#farebook');
    if (fareBookEl) {
      fareBookEl.addEventListener('click', function () {
        currentFrom = fareFrom;
        currentTo = fareTo;
        push('ticketbooking');
      });
    }
  }

  if (id === 'ticketbooking') {
    var tbpaybtn = container.querySelector('#tbpaybtn');
    if (tbpaybtn) {
      tbpaybtn.addEventListener('click', function () {
        var pgamountEl = document.getElementById('pgamount');
        if (pgamountEl) pgamountEl.textContent = '₹' + lastFareTotal + '.00';
        var pgrefEl = document.getElementById('pgref');
        if (pgrefEl) pgrefEl.textContent = '₹' + lastFareTotal + '.00 paid · Ref# DMRC' + Math.floor(20000000 + Math.random() * 9999999);

        var pgmainEl = document.getElementById('pgmain');
        var pgprocessingEl = document.getElementById('pgprocessing');
        var pgsuccessEl = document.getElementById('pgsuccess');
        if (pgmainEl) pgmainEl.style.display = 'flex';
        if (pgprocessingEl) pgprocessingEl.style.display = 'none';
        if (pgsuccessEl) pgsuccessEl.style.display = 'none';

        push('payment');
      });
    }

    var payopts = container.querySelectorAll('[data-payopt]');
    payopts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        payopts.forEach(function (s) { s.classList.remove('sel'); });
        opt.classList.add('sel');
      });
    });
  }

  if (id === 'payment') {
    var payopts2 = container.querySelectorAll('[data-payopt2]');
    payopts2.forEach(function (opt) {
      opt.addEventListener('click', function () {
        payopts2.forEach(function (s) { s.classList.remove('sel'); });
        opt.classList.add('sel');
      });
    });

    var pgpay = container.querySelector('#pgpay');
    if (pgpay) {
      pgpay.addEventListener('click', function () {
        var pgmainEl = document.getElementById('pgmain');
        var pgprocessingEl = document.getElementById('pgprocessing');
        var pgsuccessEl = document.getElementById('pgsuccess');
        if (pgmainEl) pgmainEl.style.display = 'none';
        if (pgprocessingEl) pgprocessingEl.style.display = 'flex';
        setTimeout(function () {
          if (pgprocessingEl) pgprocessingEl.style.display = 'none';
          if (pgsuccessEl) pgsuccessEl.style.display = 'flex';

          var walletOpt = document.querySelector('#scr-ticketbooking [data-payopt="wallet"]');
          if (walletOpt && walletOpt.classList.contains('sel')) {
            walletBalance = Math.max(0, walletBalance - lastFareTotal);
          }
        }, 1400);
      });
    }
  }

  if (id === 'livejourney') {
    var endbtn = container.querySelector('#endjourney');
    if (endbtn) {
      endbtn.addEventListener('click', function () {
        push('receipt');
      });
    }
  }

  if (id === 'receipt') {
    var dlbtn = container.querySelector('#receiptdownload');
    if (dlbtn) {
      dlbtn.addEventListener('click', function () {
        dlbtn.textContent = 'Preparing PDF…';
        setTimeout(function () { dlbtn.textContent = 'Downloaded ✓'; dlbtn.classList.add('done'); }, 700);
      });
    }

    var sharebtn = container.querySelector('#receiptshare');
    if (sharebtn) {
      sharebtn.addEventListener('click', function () {
        sharebtn.style.color = '#fff'; sharebtn.style.background = 'var(--blue)';
        setTimeout(function () { sharebtn.style.color = ''; sharebtn.style.background = ''; }, 500);
      });
    }
  }

  if (id === 'ratejourney') {
    var stars = container.querySelectorAll('.star');
    stars.forEach(function (st) {
      st.addEventListener('click', function () {
        var starVal = parseInt(st.getAttribute('data-v'));
        stars.forEach(function (s) {
          var on = parseInt(s.getAttribute('data-v')) <= starVal;
          s.classList.toggle('on', on); s.textContent = on ? '★' : '☆';
        });
      });
    });

    var fbchips = container.querySelectorAll('.fbchip');
    fbchips.forEach(function (c) {
      c.addEventListener('click', function () { c.classList.toggle('on'); });
    });

    var submitbtn = container.querySelector('#ratesubmit');
    if (submitbtn) {
      submitbtn.addEventListener('click', function () {
        var main = container.querySelector('#ratemain');
        var thanks = container.querySelector('#ratethanks');
        if (main) main.style.display = 'none';
        if (thanks) thanks.style.display = 'flex';
      });
    }
  }

  if (id === 'walletrecharge') {
    var amtchips = container.querySelectorAll('[data-amt]');
    var rechargebtn = container.querySelector('#rechargebtn');
    amtchips.forEach(function (opt) {
      opt.addEventListener('click', function () {
        amtchips.forEach(function (s) { s.classList.remove('sel'); });
        opt.classList.add('sel');
        var amt = opt.getAttribute('data-amt');
        if (rechargebtn && !rechargebtn.classList.contains('done')) {
          rechargebtn.textContent = 'Add ₹' + amt + ' to wallet';
        }
      });
    });

    var rpayopts = container.querySelectorAll('[data-payopt]');
    rpayopts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        rpayopts.forEach(function (s) { s.classList.remove('sel'); });
        opt.classList.add('sel');
      });
    });

    if (rechargebtn) {
      rechargebtn.addEventListener('click', function () {
        var sel = container.querySelector('[data-amt].sel');
        var amt = sel ? parseInt(sel.getAttribute('data-amt')) : 200;
        rechargebtn.textContent = 'Processing…';
        setTimeout(function () {
          walletBalance += amt;
          var rechargebalEl = document.getElementById('rechargebal');
          if (rechargebalEl) rechargebalEl.textContent = '₹' + walletBalance;
          var walletbalbigEl = document.getElementById('walletbalbig');
          if (walletbalbigEl) walletbalbigEl.textContent = '₹' + walletBalance;
          var homewalletlineEl = document.getElementById('homewalletline');
          if (homewalletlineEl) homewalletlineEl.textContent = 'Balance ₹' + walletBalance + ' · Tap to recharge';
          var profwalletbalEl = document.getElementById('profwalletbal');
          if (profwalletbalEl) profwalletbalEl.textContent = '₹' + walletBalance;

          rechargebtn.textContent = 'Added ✓ New balance ₹' + walletBalance;
          rechargebtn.classList.add('done');
        }, 700);
      });
    }
  }

  if (id === 'servicealerts') {
    var alertitems = container.querySelectorAll('.alert-item');
    var alertdetailEl = container.querySelector('#alertdetail');
    alertitems.forEach(function (item) {
      item.addEventListener('click', function () {
        alertitems.forEach(function (i) { i.classList.remove('sel'); });
        item.classList.add('sel');
        if (alertdetailEl) alertdetailEl.firstElementChild.textContent = item.getAttribute('data-detail');
      });
    });
  }

  if (id === 'nearby') {
    var ntfilters = container.querySelector('#ntfilters');
    if (ntfilters) {
      ntfilters.querySelectorAll('.filterchip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          ntfilters.querySelectorAll('.filterchip').forEach(function (c) { c.classList.remove('on'); });
          chip.classList.add('on');
          var f = chip.getAttribute('data-filter');
          container.querySelectorAll('#ntlist .filteritem').forEach(function (item) {
            item.style.display = (f === 'all' || item.getAttribute('data-type') === f) ? 'flex' : 'none';
          });
        });
      });
    }
  }

  if (id === 'lastmile') {
    var lmsteps = container.querySelectorAll('.lm-step');
    var lmsummaryEl = container.querySelector('#lmsummary');
    lmsteps.forEach(function (step) {
      step.addEventListener('click', function () {
        lmsteps.forEach(function (s) { s.classList.remove('sel'); });
        step.classList.add('sel');
        if (lmsummaryEl) lmsummaryEl.textContent = step.getAttribute('data-summary');
      });
    });
  }

  if (id === 'notifications') {
    var notifs = container.querySelectorAll('.notif');
    notifs.forEach(function (n) {
      n.addEventListener('click', function () { n.classList.remove('unread'); });
    });
    var markall = container.querySelector('#markallread');
    if (markall) {
      markall.addEventListener('click', function () {
        notifs.forEach(function (n) { n.classList.remove('unread'); });
      });
    }
  }

  if (id === 'settings') {
    var toggles = container.querySelectorAll('[data-toggle]');
    toggles.forEach(function (t) {
      var label = t.closest('.list-item');
      if (label && label.textContent.indexOf('Dark mode') > -1) {
        t.classList.toggle('on', document.documentElement.classList.contains('dark'));
      }

      t.addEventListener('click', function () {
        t.classList.toggle('on');
        if (label && label.textContent.indexOf('Dark mode') > -1) {
          applyDarkMode(t.classList.contains('on'));
        }
      });
    });
  }

  if (id === 'timetable') {
    var tttabs = container.querySelector('#tttabs');
    if (tttabs) {
      tttabs.addEventListener('click', function (e) {
        var btn = e.target.closest('.tabbtn'); if (!btn) return;
        tttabs.querySelectorAll('.tabbtn').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        var target = btn.getAttribute('data-target');
        container.querySelectorAll('.tabpanel').forEach(function (p) { p.classList.toggle('show', p.id === target); });
      });
    }
  }

  if (id === 'station') {
    var sttabs = container.querySelector('#sttabs');
    if (sttabs) {
      sttabs.addEventListener('click', function (e) {
        var btn = e.target.closest('.tabbtn'); if (!btn) return;
        sttabs.querySelectorAll('.tabbtn').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        var target = btn.getAttribute('data-target');
        container.querySelectorAll('.tabpanel').forEach(function (p) { p.classList.toggle('show', p.id === target); });
      });
    }
  }
}

/* ================= THEME SYNCING ================= */
function applyDarkMode(on) {
  document.documentElement.classList.toggle('dark', on);
  var globalToggle = document.getElementById('globalDarkToggle');
  if (globalToggle) globalToggle.textContent = on ? '☀' : '🌙';

  document.querySelectorAll('#scr-settings [data-toggle]').forEach(function (t) {
    var label = t.closest('.list-item');
    if (label && label.textContent.indexOf('Dark mode') > -1) {
      t.classList.toggle('on', on);
    }
  });
}

/* ================= INITIALIZATION & CLOCK ================= */
function tickClock() {
  var d = new Date();
  var h = d.getHours() % 12 || 12, m = String(d.getMinutes()).padStart(2, '0');
  var el = document.getElementById('clock1');
  if (el) el.textContent = h + ':' + m;
}

window.addEventListener('DOMContentLoaded', function () {
  prefetchScreens();
  tickClock();
  setInterval(tickClock, 30000);
});

// Run immediate render for the splash screen
render();