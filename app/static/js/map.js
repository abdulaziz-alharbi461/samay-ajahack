let darkSkyMap = null;
let markersLayer = null;
let ksrnrPolygon = null;
let darkSkyZone = null;
let mapLayersControl = null;
let esriSatelliteLayer = null;
let openStreetMapLayer = null;
let spotsMarkersMap = {};
let allSpotsData = [];

function initMap(spots) {
  if (darkSkyMap) return;

  allSpotsData = spots || [];

  // Center around Hail / Al-Nafud Al-Kabir
  const hailCoords = [27.75, 41.3];
  
  darkSkyMap = L.map('stargazing-map', {
    center: hailCoords,
    zoom: 8,
    minZoom: 6,
    maxZoom: 14,
    zoomControl: false
  });

  // Custom Zoom control positioning
  L.control.zoom({ position: 'bottomright' }).addTo(darkSkyMap);

  // Clean, free, unwatermarked tile layers (No API Key Required)
  esriSatelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri, Maxar, Earthstar Geographics | Al-Nafud Dark Sky Reserve',
    maxZoom: 17
  });

  openStreetMapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  // Add Satellite as default base layer
  esriSatelliteLayer.addTo(darkSkyMap);

  // Add King Salman bin Abdulaziz Royal Natural Reserve (KSRNR) Nafud Sector Polygon
  ksrnrPolygon = L.polygon([
    [28.65, 39.80],
    [28.80, 40.70],
    [28.45, 41.60],
    [28.05, 41.25],
    [27.95, 40.65],
    [28.20, 39.90]
  ], {
    color: '#F59E0B',
    fillColor: '#F59E0B',
    fillOpacity: 0.05,
    weight: 1.5,
    dashArray: '4, 6'
  }).addTo(darkSkyMap);

  // Add Dark Sky Park Core Zone Conservation Radius
  darkSkyZone = L.circle([28.3200, 40.4500], {
    color: '#06B6D4',
    fillColor: '#06B6D4',
    fillOpacity: 0.09,
    radius: 50000, // 50km radius
    weight: 2,
    dashArray: '6, 8'
  }).addTo(darkSkyMap);

  markersLayer = L.layerGroup().addTo(darkSkyMap);

  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ar';
  updateMapLanguage(lang);
  renderMapMarkers(spots);

  // Invalidate map size after container rendering & handle window resizing
  setTimeout(() => {
    if (darkSkyMap) darkSkyMap.invalidateSize();
  }, 250);

  window.addEventListener('resize', () => {
    if (darkSkyMap) darkSkyMap.invalidateSize();
  });
}

function updateMapLanguage(lang) {
  const isAr = lang === 'ar';

  if (ksrnrPolygon) {
    ksrnrPolygon.unbindTooltip();
    ksrnrPolygon.bindTooltip(
      isAr 
        ? "👑 نطاق محمية الملك سلمان بن عبدالعزيز الملكية (KSRNR)" 
        : "👑 King Salman Royal Natural Reserve Boundary (KSRNR)", 
      { className: 'glass-pill text-xs', sticky: true }
    );
  }

  if (darkSkyZone) {
    darkSkyZone.unbindTooltip();
    darkSkyZone.bindTooltip(
      isAr 
        ? "🌌 محمية سماء النفود المظلمة (النواة الفلكية 45,200 كم²)" 
        : "🌌 Al-Nafud Dark Sky Sanctuary Core (45,200 km²)", 
      { className: 'glass-pill text-xs', sticky: true }
    );
  }

  if (darkSkyMap) {
    if (mapLayersControl) {
      darkSkyMap.removeControl(mapLayersControl);
    }
    const baseMaps = isAr ? {
      "🛰️ قمر صناعي": esriSatelliteLayer,
      "🗺️ خريطة الطرق": openStreetMapLayer
    } : {
      "🛰️ Satellite Imagery": esriSatelliteLayer,
      "🗺️ Street Map": openStreetMapLayer
    };
    mapLayersControl = L.control.layers(baseMaps, null, { position: 'topright' }).addTo(darkSkyMap);
  }
}

function renderMapMarkers(spots) {
  if (!markersLayer) return;
  markersLayer.clearLayers();
  spotsMarkersMap = {};
  allSpotsData = spots || [];

  const isAr = (typeof currentLang !== 'undefined') ? (currentLang === 'ar') : document.body.classList.contains('lang-ar');

  spots.forEach(spot => {
    // Pin color logic based on Bortle Class matching theme legend
    let pinColor = '#2563EB'; // Blue for Bortle 1
    if (spot.bortle_class === 2) pinColor = '#6366F1'; // Indigo for Bortle 2
    if (spot.bortle_class === 3) pinColor = '#059669'; // Emerald for Bortle 3

    const iconHtml = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="
          width: 28px; height: 28px; border-radius: 50%;
          background: ${pinColor};
          box-shadow: 0 0 12px ${pinColor};
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #FFFFFF; cursor: pointer;
        ">
          <span style="color: #FFFFFF; font-size: 11px; font-weight: 800;">B${spot.bortle_class}</span>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-map-pin',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([spot.latitude, spot.longitude], { icon: customIcon });

    const name = isAr ? spot.name_ar : spot.name_en;
    const desc = isAr ? spot.description_ar : spot.description_en;
    const btnForecastText = isAr ? 'رؤية التوقعات الفلكية' : 'View Forecast';
    const btnBookText = isAr ? 'حجز تجربة فلكية' : 'Book Camp';

    const reserveName = isAr ? spot.royal_reserve_ar : (spot.royal_reserve || spot.royal_reserve_ar);
    const cleanReserveName = reserveName ? reserveName.replace(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]/gu, '').trim() : '';
    const popupContent = `
      <div style="min-width: 250px; padding: 4px; direction: ${isAr ? 'rtl' : 'ltr'}; text-align: ${isAr ? 'right' : 'left'};">
        <img src="${spot.image_url}" style="width: 100%; height: 115px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
        ${cleanReserveName ? `<div style="font-size: 10px; font-weight: 700; color: #1C1ADB; margin-bottom: 4px;">${cleanReserveName}</div>` : ''}
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <h4 style="font-weight: 800; font-size: 14px; margin: 0; color: #1C1ADB;">${name}</h4>
          <span style="font-size: 11px; padding: 2px 6px; border-radius: 6px; background: rgba(148,185,255,0.25); color: #1C1ADB; font-weight: 700;">
            Bortle ${spot.bortle_class} (SQM ${spot.sqm_value})
          </span>
        </div>
        <p style="font-size: 12px; color: #475569; margin: 6px 0 10px; line-height: 1.4;">${desc.slice(0, 100)}...</p>
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <button onclick="selectSpotForForecast('${spot.id}')" style="flex: 1; padding: 6px 8px; background: #1C1ADB; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 600;">
            ${btnForecastText}
          </button>
          ${spot.is_camp ? `
            <button onclick="openBookingModal('${spot.id}')" style="flex: 1; padding: 6px 8px; background: #059669; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 600;">
              ${btnBookText}
            </button>
          ` : ''}
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    marker.on('click', () => {
      highlightSidebarItem(spot.id);
      scrollSidebarItemIntoView(spot.id);
    });

    markersLayer.addLayer(marker);
    spotsMarkersMap[spot.id] = marker;
  });

  // Render the interactive sidebar list of actual reserve spots
  renderMapSidebar(spots);
}

// Render the interactive right-hand spots sidebar list
function renderMapSidebar(spots) {
  const container = document.getElementById('map-sidebar-list');
  if (!container) return;
  container.innerHTML = '';

  const isAr = (typeof currentLang !== 'undefined') ? (currentLang === 'ar') : document.body.classList.contains('lang-ar');
  const countEl = document.getElementById('map-sidebar-count');
  if (countEl) {
    countEl.innerText = isAr ? `${spots.length} مواقع معتمدة` : `${spots.length} Certified Sites`;
  }

  spots.forEach(spot => {
    const btn = document.createElement('button');
    btn.className = 'map-sidebar-btn group';
    btn.id = `sidebar-spot-${spot.id}`;
    btn.setAttribute('type', 'button');
    btn.onclick = () => focusSpotOnMap(spot.id);

    const name = isAr ? spot.name_ar : spot.name_en;
    let category = isAr 
      ? (spot.royal_reserve_ar || (spot.is_camp ? 'مخيم فلكي مرخص' : 'موقع رصد معتمد'))
      : (spot.royal_reserve || (spot.is_camp ? 'Licensed Astro-Camp' : 'Dark Sky Sanctuary'));
    
    // Completely remove any emojis, icons, or symbols
    const cleanCategory = category.replace(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]/gu, '').trim();

    // Bortle badge styling
    let bortleBg = 'rgba(37, 99, 235, 0.12)';
    let bortleColor = '#1D4ED8';
    let bortleText = isAr ? `بورتل ${spot.bortle_class}` : `Bortle ${spot.bortle_class}`;
    if (spot.bortle_class === 2) {
      bortleBg = 'rgba(99, 102, 241, 0.12)';
      bortleColor = '#4338CA';
    } else if (spot.bortle_class === 3) {
      bortleBg = 'rgba(5, 150, 105, 0.12)';
      bortleColor = '#047857';
    }

    btn.innerHTML = `
      <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; width: 100%;">
        <span class="spot-btn-title" style="word-break: break-word; flex: 1;">${name}</span>
        <span style="font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 9999px; background: ${bortleBg}; color: ${bortleColor}; white-space: nowrap; flex-shrink: 0;">
          ${bortleText}
        </span>
      </div>
      <div class="spot-btn-sub" style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 0.2rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.72rem; color: #475569;">
          ${cleanCategory}
        </span>
        <span style="font-size: 0.7rem; font-weight: 600; color: #1C1ADB; white-space: nowrap;">
          SQM ${spot.sqm_value}
        </span>
      </div>
    `;

    container.appendChild(btn);
  });
}

// Smoothly flyTo spot marker on map and open its popup
function focusSpotOnMap(spotId) {
  if (!darkSkyMap) return;
  const spot = (allSpotsData || []).find(s => s.id === spotId);
  if (!spot) return;

  if (darkSkyMap) {
    darkSkyMap.invalidateSize();
  }

  darkSkyMap.flyTo([spot.latitude, spot.longitude], 12, {
    animate: true,
    duration: 1.2
  });

  highlightSidebarItem(spotId);
  scrollSidebarItemIntoView(spotId);

  setTimeout(() => {
    const marker = spotsMarkersMap[spotId];
    if (marker) {
      marker.openPopup();
    }
  }, 450);
}

function highlightSidebarItem(spotId) {
  const allBtns = document.querySelectorAll('.map-sidebar-btn');
  allBtns.forEach(btn => btn.classList.remove('active'));

  const activeBtn = document.getElementById(`sidebar-spot-${spotId}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

function scrollSidebarItemIntoView(spotId) {
  const activeBtn = document.getElementById(`sidebar-spot-${spotId}`);
  if (activeBtn) {
    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function flyToSpot(lat, lng, zoom = 10) {
  if (darkSkyMap) {
    darkSkyMap.flyTo([lat, lng], zoom, {
      animate: true,
      duration: 1.5
    });
  }
}

