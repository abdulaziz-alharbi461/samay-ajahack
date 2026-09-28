// State
let currentLang = 'ar';
let allSpots = [];
let forecastChart = null;
let currentForecastSpotId = 'ksrnr-khunfah-sanctuary';

// Translations Dictionary
const i18n = {
  ar: {
    pageTitle: "سماي | المنصة التنبؤية للسياحة الفلكية بحائل",
    navTitle: "سماي",
    navSubtitle: "المنصة التنبؤية للسياحة الفلكية بحائل",
    navBadge: "سماء حائل المظلمة",
    navMap: "الخريطة التفاعلية",
    navForecast: "توقعات الصفاء",
    navSandbox: "حاسبة الصفاء",
    navRecommend: "المساعد الذكي",
    navDirectory: "المخيمات والمواقع",
    navBookBtn: "احجز مخيم فلكي",
    heroBadge: "محمية سماء النفود المظلمة • ثاني أكبر محمية فلكية عالمياً (ديسمبر 2025)",
    heroKsrnrBadge: "محمية الملك سلمان بن عبدالعزيز الملكية (KSRNR)",
    heroTitle: "اكتشف أنقى سماء مرصعة بالنجوم في قلب النفود الكبير",
    heroTitlePrefix: "اكتشف أنقى",
    heroTitleHighlight: "سماء مرصعة بالنجوم",
    heroTitleSuffix: "في قلب النفود الكبير",
    heroAccent: "بمنطقة حائل والمحميات الملكية",
    heroDesc: "منصة تنبؤية متقدمة تربط عشاق الفلك وهواة التصوير بالمحميات المظلمة والمخيمات المعتمدة في منطقة حائل، مع حساب مؤشر صفاء السماء (SCI) والتنبؤ بالأيام المثالية للرصد.",
    statSpots: "مواقع رصد معتمدة",
    statCamps: "مخيمات فلكية مرخصة",
    statDarkness: "أعلى درجة ظلام (SQM)",
    statArea: "مساحة محمية النفود (كم²)",
    btnExploreMap: "استكشف الخريطة",
    btnQuickForecast: "عرض توقعات الليلة",
    mapSectionTitle: "خريطة محمية سماء النفود المظلمة",
    mapSectionDesc: "استكشف تصنيف بورتل ومواقع الرصد والتخييم المعتمدة في حائل وصحراء النفود",
    bortle1Legend: "بورتل 1 (أقصى عتمة)",
    bortle2Legend: "بورتل 2 (سماء حالكة)",
    bortle3Legend: "بورتل 3 (سماء ريفية)",
    forecastSectionTitle: "محرك التنبؤ الفلكي لـ 7 ليالٍ (SCI)",
    forecastSectionDesc: "تنبؤ خوارزمي دقيق بمؤشر صفاء السماء، وحركة أطوار القمر، وفرص تصوير مجرة درب التبانة",
    selectSpotLabel: "اختر الموقع لعرض التوقعات:",
    todayClarityTitle: "مؤشر صفاء السماء الليلة (SCI)",
    todayClarityLabelDefault: "سماء استثنائية وظروف مثالية",
    nelmLabel: "القدر الظاهري الحدي (NELM):",
    milkyWayLabel: "رؤية درب التبانة:",
    milkyWayDefault: "مركز المجرة متوهج",
    bestWindowLabel: "أفضل نافذة للرصد:",
    subScoresTitle: "تحليل العوامل الجوية والفلكية",
    cloudFactor: "عامل السحب (40%)",
    moonFactor: "تأثير القمر (25%)",
    darknessFactor: "عتمة بورتل (18%)",
    transparencyFactor: "شفافية الغلاف الجوي (10%)",
    seeingFactor: "ثبات الرياح والرؤية (7%)",
    forecastChartTitle: "منحنى صفاء الـ 7 ليالٍ القادمة",
    sandboxBadge: "محاكي الخوارزمية التفاعلي",
    sandboxTitle: "محاكي شروط الرصد (Sandbox)",
    sandboxDesc: "جرب بنفسك تحريك المتغيرات ولاحظ كيف تتفاعل خوارزمية مؤشر صفاء السماء في الوقت الفعلي",
    cloudSlider: "نسبة الغطاء السحابي (%)",
    moonSlider: "نسبة إضاءة القمر (%)",
    bortleSlider: "تصنيف التلوث الضوئي (مقياس بورتل 1-5)",
    bortleClass1Default: "بورتل 1",
    humiditySlider: "الرطوبة النسبية للصحراء (%)",
    windSlider: "سرعة الرياح (كم/ساعة)",
    calculatedScore: "مؤشر الصفاء المحسوب:",
    sandboxLabelDefault: "سماء استثنائية وظروف مثالية",
    sandboxMwDefault: "مجرة درب التبانة متوهجة",
    recommendTitle: "المساعد الذكي: جد ليلتك الفلكية المثالية",
    recommendDesc: "حدد رغبتك وسيقوم النظام الذكي باقتراح أفضل موقع وتاريخ يناسب خبرتك ومعداتك",
    recommendPersonaLabel: "نوع التجربة المطلوبة:",
    personaAstrophotographer: "مصوّر فلكي محترف",
    personaFamily: "عائلة وتخييم سياحي",
    personaDeepSky: "راصد سدم وفضاء عميق",
    personaRomantic: "ملاذ فلكي وقباب فاخرة",
    personaAdventurer: "مغامر صحراء واستكشاف",
    chkAccommodation: "أشترط وجود مخيم ومرافق إقامة",
    chkTelescope: "أشترط توفر تلسكوب في الموقع",
    btnRunRecommend: "تحليل واقتراح أفضل موقع",
    recommendTipDefault: "احرص على إحضار حامل ثلاثي عالي الثبات وسخانات عدسات لمقاومة ندى الصحراء في الساعات المتأخرة.",
    directoryTitle: "دليل المواقع والمخيمات المرخصة",
    directoryDesc: "قائمة موثوقة ومحدثة بالتعاون مع هيئة تطوير منطقة حائل وشركاء الضيافة الفلكية",
    filterAll: "الكل",
    filterBortle1: "بورتل 1 فقط (أقصى عتمة)",
    filterKsrnr: "محمية الملك سلمان (KSRNR)",
    filterCamps: "المخيمات فقط",
    filterTelescopes: "مجهزة بتلسكوبات",
    searchPlaceholder: "ابحث باسم الموقع، المخيم، أو المعلم...",
    modalBookingTitle: "حجز تجربة فلكية معتمدة",
    modalSpotNameDefault: "مخيم جبه للتراث الفلكي",
    modalSpotPriceDefault: "450 ر.س / ليلة",
    fullName: "الاسم الكامل",
    namePlaceholder: "عبدالله الشمري",
    phone: "رقم الجوال (واتساب)",
    guestsCount: "عدد الزوار",
    dateSelect: "تاريخ الوصول المفضل",
    hasTelescopeChk: "أحمل تلسكوبي / كاميرتي الخاصة",
    guideChk: "أرغب في مرشد فلكي محلي معتمد (+250 ر.س)",
    estimatedPriceLabel: "السعر المقدر:",
    btnSubmitBooking: "تأكيد وإرسال عبر واتساب",
    btnCancel: "إلغاء",
    bookingSuccess: "تم تسجيل استفسارك بنجاح! جاري تحويلك للمنسق المعتمد...",
    freeAccess: "دخول عام مجاني",
    sarNight: "ر.س / ليلة",
    footerBrand: "سماي | المنصة التنبؤية للسياحة الفلكية بحائل",
    footerProject: "مشروع هاكاثون السياحة الفلكية بحائل 2026",
    footerStandards: "معايير DarkSky International ومحمية الملك سلمان",
    mapSidebarTitle: "المواقع والمحميات الفلكية",
    mapSidebarCount: "9 مواقع معتمدة"
  },
  en: {
    pageTitle: "My Sky | Predictive Astro-Tourism Platform for Hail",
    navTitle: "My Sky",
    navSubtitle: "Predictive Astro-Tourism Platform for Hail",
    navBadge: "HAIL DARK SKY",
    navMap: "Interactive Map",
    navForecast: "Clarity Forecast",
    navSandbox: "SCI Sandbox",
    navRecommend: "Smart Matcher",
    navDirectory: "Spots & Camps",
    navBookBtn: "Book Astro-Camp",
    heroBadge: "Al-Nafud Dark Sky Park • 2nd Largest Dark Sky Park Globally (Dec 2025)",
    heroKsrnrBadge: "King Salman Royal Natural Reserve (KSRNR)",
    heroTitle: "Discover the Pristine Starlit Canopy of Al-Nafud Desert",
    heroTitlePrefix: "Discover the Pristine",
    heroTitleHighlight: "Starlit Canopy",
    heroTitleSuffix: "of Al-Nafud Desert",
    heroAccent: "Hail Region & Royal Nature Reserves",
    heroDesc: "An advanced predictive platform bridging astronomy travelers and astrophotographers with certified dark-sky sanctuaries and desert camps across Hail, Saudi Arabia.",
    statSpots: "Certified Stargazing Sites",
    statCamps: "Licensed Astro-Camps",
    statDarkness: "Peak Darkness (SQM)",
    statArea: "Nafud Park Area (km²)",
    btnExploreMap: "Explore Map",
    btnQuickForecast: "Tonight's Forecast",
    mapSectionTitle: "Al-Nafud Dark Sky Reserve Interactive Map",
    mapSectionDesc: "Explore Bortle light pollution ratings, verified campsites, and heritage observation points",
    bortle1Legend: "Bortle 1 (Pristine)",
    bortle2Legend: "Bortle 2 (Truly Dark)",
    bortle3Legend: "Bortle 3 (Rural Sky)",
    forecastSectionTitle: "7-Night Predictive Stargazing Clarity Engine (SCI)",
    forecastSectionDesc: "Algorithmic forecasting of atmospheric transparency, moon phases, and Milky Way core visibility",
    selectSpotLabel: "Select Location for Detailed Forecast:",
    todayClarityTitle: "Tonight's Stargazing Clarity Index (SCI)",
    todayClarityLabelDefault: "Exceptional Stargazing Conditions",
    nelmLabel: "Naked-Eye Limiting Mag (NELM):",
    milkyWayLabel: "Milky Way Visibility:",
    milkyWayDefault: "Blazing Galactic Core",
    bestWindowLabel: "Optimal Observation Window:",
    subScoresTitle: "Meteorological & Atmospheric Breakdown",
    cloudFactor: "Cloud Obscuration (40%)",
    moonFactor: "Lunar Illumination (25%)",
    darknessFactor: "Bortle Sky Darkness (18%)",
    transparencyFactor: "Aerosol & Humidity (10%)",
    seeingFactor: "Turbulence & Wind (7%)",
    forecastChartTitle: "7-Night Stargazing Clarity Curve",
    sandboxBadge: "INTERACTIVE ALGORITHM SANDBOX",
    sandboxTitle: "Live Condition Simulator (SCI Sandbox)",
    sandboxDesc: "Dynamically adjust atmospheric parameters and observe the SCI algorithm respond in real time",
    cloudSlider: "Cloud Cover (%)",
    moonSlider: "Moon Illumination (%)",
    bortleSlider: "Bortle Light Pollution Class (1-5)",
    bortleClass1Default: "Class 1",
    humiditySlider: "Desert Relative Humidity (%)",
    windSlider: "Surface Wind Speed (km/h)",
    calculatedScore: "Calculated Clarity Index:",
    sandboxLabelDefault: "Exceptional Stargazing Conditions",
    sandboxMwDefault: "Blazing Milky Way Structure",
    recommendTitle: "Smart Matcher: Find Your Ideal Night Under the Stars",
    recommendDesc: "Select your travel style and our engine will rank the optimal spot and date for your expedition",
    recommendPersonaLabel: "Desired Travel Style:",
    personaAstrophotographer: "Astrophotographer",
    personaFamily: "Family & Glamping",
    personaDeepSky: "Deep-Sky Observer",
    personaRomantic: "Luxury Geodesic Retreat",
    personaAdventurer: "Wilderness Explorer",
    chkAccommodation: "Require certified camp & amenities",
    chkTelescope: "Require on-site telescope",
    btnRunRecommend: "Find Best Match",
    recommendTipDefault: "Bring a heavy-duty tripod and lens dew warmers to protect against late-night desert condensation.",
    directoryTitle: "Curated Directory of Spots & Camps",
    directoryDesc: "Official registry developed in alignment with Hail Regional Development and Dark Sky standards",
    filterAll: "All Sites",
    filterBortle1: "Bortle 1 Only (Pristine)",
    filterKsrnr: "King Salman Reserve (KSRNR)",
    filterCamps: "Camps Only",
    filterTelescopes: "With Telescopes",
    searchPlaceholder: "Search spots by name, landmark, or features...",
    modalBookingTitle: "Book Certified Astro Experience",
    modalSpotNameDefault: "Jubbah Heritage Astro-Camp",
    modalSpotPriceDefault: "450 SAR / night",
    fullName: "Full Name",
    namePlaceholder: "e.g. Abdullah Al-Shammari",
    phone: "WhatsApp Phone Number",
    guestsCount: "Number of Guests",
    dateSelect: "Preferred Arrival Date",
    hasTelescopeChk: "I am bringing my own telescope/camera",
    guideChk: "Request certified local astronomy guide (+250 SAR)",
    estimatedPriceLabel: "Estimated Price:",
    btnSubmitBooking: "Confirm & Connect via WhatsApp",
    btnCancel: "Cancel",
    bookingSuccess: "Inquiry received! Redirecting to coordinator...",
    freeAccess: "Free Public Access",
    sarNight: "SAR / night",
    footerBrand: "My Sky | Predictive Astro-Tourism Platform for Hail",
    footerProject: "Hail Astro-Tourism Hackathon 2026",
    footerStandards: "DarkSky International & KSRNR Standards",
    mapSidebarTitle: "Stargazing Sites & Sanctuaries",
    mapSidebarCount: "9 Certified Sites"
  }
};

// ==========================================================================
// Smooth Number-Counter Animation Engine (requestAnimationFrame)
// ==========================================================================
function animateCounter(element, targetValue, duration = 1100, startValue) {
  if (!element) return;

  const targetStr = String(targetValue !== undefined ? targetValue : (element.dataset.counterTarget || element.innerText || '')).trim();
  const match = targetStr.match(/^(.*?)(\d+(?:,\d{3})*(?:\.\d+)?)(.*)$/);
  if (!match) {
    element.innerText = targetStr;
    element._hasCounted = true;
    return;
  }

  const prefix = match[1];
  const numStr = match[2];
  const suffix = match[3];
  const hasComma = numStr.includes(',');
  const decimalPlaces = numStr.includes('.') ? numStr.split('.')[1].length : 0;
  const targetNum = parseFloat(numStr.replace(/,/g, ''));

  if (isNaN(targetNum)) {
    element.innerText = targetStr;
    element._hasCounted = true;
    return;
  }

  // Determine starting value
  let startNum = 0;
  if (typeof startValue === 'number') {
    startNum = startValue;
  } else if (element._hasCounted && typeof element._currentNum === 'number') {
    startNum = element._currentNum;
  } else {
    startNum = 0;
  }

  element._hasCounted = true;

  // Cancel any previous animation frame on this element
  if (element._counterRafId) {
    cancelAnimationFrame(element._counterRafId);
    element._counterRafId = null;
  }

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    element.innerText = targetStr;
    element._currentNum = targetNum;
    return;
  }

  const startTime = performance.now();
  // Fast, ultra-smooth SaaS deceleration curve: snappy, smooth cubic-bezier(0.16, 1, 0.3, 1) approximation
  const easeOutSaaS = (t) => 1 - Math.pow(1 - t, 3.2);

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutSaaS(progress);
    const currentVal = startNum + (targetNum - startNum) * easedProgress;
    element._currentNum = currentVal;

    let formattedVal;
    if (decimalPlaces > 0) {
      formattedVal = currentVal.toFixed(decimalPlaces);
    } else {
      const rounded = Math.round(currentVal);
      formattedVal = hasComma ? rounded.toLocaleString('en-US') : String(rounded);
    }

    element.innerText = `${prefix}${formattedVal}${suffix}`;

    if (progress < 1) {
      element._counterRafId = requestAnimationFrame(step);
    } else {
      element.innerText = targetStr;
      element._currentNum = targetNum;
      element._counterRafId = null;
    }
  }

  element._counterRafId = requestAnimationFrame(step);
}

function isElementVisible(el) {
  if (!el) return false;
  const revealParent = el.closest('.reveal-on-scroll');
  if (revealParent && revealParent.classList.contains('is-revealed')) {
    return true;
  }
  const rect = el.getBoundingClientRect();
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) + 50 &&
    rect.bottom > 0
  );
}

function triggerOrQueueCounter(element, targetValue, duration = 850, startValue) {
  if (!element) return;
  element.dataset.counterTarget = String(targetValue !== undefined ? targetValue : (element.innerText || '')).trim();

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    element.innerText = element.dataset.counterTarget;
    element._hasCounted = true;
    return;
  }

  if (isElementVisible(element)) {
    animateCounter(element, element.dataset.counterTarget, duration, startValue);
  } else {
    if (!element._hasCounted) {
      const match = element.dataset.counterTarget.match(/^(.*?)(\d+(?:,\d{3})*(?:\.\d+)?)(.*)$/);
      if (match) {
        const prefix = match[1];
        const numStr = match[2];
        const suffix = match[3];
        const dec = numStr.includes('.') ? numStr.split('.')[1].length : 0;
        const zeroVal = dec > 0 ? (0).toFixed(dec) : '0';
        element.innerText = `${prefix}${zeroVal}${suffix}`;
      }
    }
  }
}

// ==========================================================================
// Scroll-Reveal Animation Engine (Intersection Observer API)
// ==========================================================================
let scrollRevealObserver = null;

function triggerElementCounters(container) {
  if (!container) return;
  const counters = Array.from(container.querySelectorAll('.animate-counter'));
  if (container.classList.contains('animate-counter')) {
    counters.unshift(container);
  }
  counters.forEach(counterEl => {
    if (!counterEl._hasCounted) {
      animateCounter(counterEl, counterEl.dataset.counterTarget || counterEl.innerText, 850);
    }
  });
}

function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.classList.add('is-revealed');
      triggerElementCounters(el);
    });
    return;
  }

  // Pre-reveal elements already visible in or near the initial viewport on load
  const windowH = window.innerHeight || document.documentElement.clientHeight;
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowH * 0.95 && rect.bottom > 0) {
      el.classList.add('is-revealed');
      triggerElementCounters(el);
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px 50px 0px', // Pre-trigger 50px before entering viewport for instantaneous appearance
    threshold: 0.02
  };

  scrollRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        triggerElementCounters(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observeRevealElements();
}

function observeRevealElements(container = document) {
  if (!scrollRevealObserver) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      container.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
    }
    return;
  }
  const elements = container.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
  elements.forEach(el => scrollRevealObserver.observe(el));
}

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  initStarfield();
  await loadStats();
  await loadSpots();
  setupEventListeners();
  updateLanguageUI();
  updateSandboxScore();
  runQuickRecommendation();
  initScrollReveal();
});

// Twinkling Starfield Background Canvas
function initStarfield() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  for (let i = 0; i < 160; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }

  // Periodic Shooting Star
  let shootingStar = null;
  setInterval(() => {
    if (!shootingStar && Math.random() > 0.4) {
      shootingStar = {
        x: Math.random() * width * 0.7,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 80 + 40,
        speed: Math.random() * 10 + 12,
        opacity: 1
      };
    }
  }, 4000);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw static twinkling stars
    stars.forEach(s => {
      s.alpha += s.speed * s.direction;
      if (s.alpha > 1) { s.alpha = 1; s.direction = -1; }
      if (s.alpha < 0.2) { s.alpha = 0.2; s.direction = 1; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(28, 26, 219, ${s.alpha * 0.22})`;
      ctx.fill();
    });

    // Draw shooting star if active
    if (shootingStar) {
      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(shootingStar.x + shootingStar.length, shootingStar.y + shootingStar.length * 0.5);
      ctx.strokeStyle = `rgba(28, 26, 219, ${shootingStar.opacity * 0.65})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      shootingStar.x += shootingStar.speed;
      shootingStar.y += shootingStar.speed * 0.5;
      shootingStar.opacity -= 0.03;

      if (shootingStar.opacity <= 0) shootingStar = null;
    }

    requestAnimationFrame(animate);
  }
  animate();
}

// Load Platform Statistics
async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const stats = await res.json();
    triggerOrQueueCounter(document.getElementById('stat-spots-val'), stats.total_spots);
    triggerOrQueueCounter(document.getElementById('stat-camps-val'), stats.certified_camps);
    triggerOrQueueCounter(document.getElementById('stat-darkness-val'), stats.dark_sky_sqm_max);
    triggerOrQueueCounter(document.getElementById('stat-area-val'), stats.park_area_sqkm.toLocaleString());
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

// Load Spots and render Directory & Map
async function loadSpots() {
  try {
    const res = await fetch('/api/spots');
    allSpots = await res.json();
    populateSpotSelect(allSpots);
    initMap(allSpots);
    renderDirectory(allSpots);
    loadForecast(currentForecastSpotId);
  } catch (err) {
    console.error('Failed to load spots:', err);
  }
}

function populateSpotSelect(spots) {
  const select = document.getElementById('forecast-spot-select');
  if (!select) return;
  select.innerHTML = '';
  const isAr = currentLang === 'ar';
  spots.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.innerText = isAr ? `${s.name_ar} (بورتل ${s.bortle_class})` : `${s.name_en} (Bortle ${s.bortle_class})`;
    if (s.id === currentForecastSpotId) opt.selected = true;
    select.appendChild(opt);
  });
}

// Render Directory
function renderDirectory(spots) {
  const container = document.getElementById('spots-grid');
  if (!container) return;
  container.innerHTML = '';
  const isAr = currentLang === 'ar';

  if (spots.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400">${isAr ? 'لم يتم العثور على مواقع تطابق البحث.' : 'No locations found matching search.'}</div>`;
    return;
  }

  spots.forEach((spot, idx) => {
    const name = isAr ? spot.name_ar : spot.name_en;
    const desc = isAr ? spot.description_ar : spot.description_en;
    const amenities = isAr ? spot.amenities_ar : spot.amenities;
    const diff = isAr ? spot.access_difficulty_ar : spot.access_difficulty;
    const price = spot.booking_price_sar > 0 ? `${spot.booking_price_sar} ${isAr ? 'ر.س' : 'SAR'}` : (isAr ? 'مجاني' : 'Free');

    const card = document.createElement('div');
    card.className = `glass-panel rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-blue-500/50 transition-all duration-300 reveal-on-scroll reveal-delay-${(idx % 3) + 1}`;
    card.innerHTML = `
      <div>
        <div class="relative h-48 overflow-hidden">
          <img src="${spot.image_url}" alt="${name}" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent"></div>
          <div class="absolute top-3 right-3 flex gap-2">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600/90 text-white border border-white/50 backdrop-blur-md shadow-sm">
              Bortle ${spot.bortle_class}
            </span>
            ${spot.is_camp ? `
              <span class="camp-badge px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm inline-flex items-center gap-1.5 backdrop-blur-md">
                <svg class="w-3.5 h-3.5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M4 18l8-14 8 14M9 18l3-6 3 6m-3-6v6" />
                </svg>
                <span>${isAr ? 'مخيم فلكي' : 'Astro-Camp'}</span>
              </span>
            ` : ''}
          </div>
          <div class="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <span class="text-xs text-amber-700 font-bold flex items-center gap-1 bg-white/85 px-2 py-0.5 rounded shadow-sm animate-counter" data-counter-target="★ SQM ${spot.sqm_value}">
              ★ SQM ${spot.sqm_value}
            </span>
            <span class="text-xs text-slate-700 bg-white/85 px-2 py-0.5 rounded shadow-sm font-medium animate-counter" data-counter-target="${spot.distance_from_hail_km} ${isAr ? 'كم من حائل' : 'km from Hail'}">
              ${spot.distance_from_hail_km} ${isAr ? 'كم من حائل' : 'km from Hail'}
            </span>
          </div>
        </div>

        <div class="p-5">
          ${spot.royal_reserve_ar ? `<div class="mb-2"><span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">👑 ${isAr ? spot.royal_reserve_ar : spot.royal_reserve}</span></div>` : ''}
          <h3 class="text-lg font-bold spot-card-title mb-2 group-hover:text-blue-700 transition">${name}</h3>
          <p class="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">${desc}</p>
          
          <div class="mb-4">
            <div class="text-[11px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">${isAr ? 'المزايا والمرافق:' : 'Key Amenities:'}</div>
            <div class="flex flex-wrap gap-1.5">
              ${amenities.slice(0, 3).map(a => `<span class="text-[11px] bg-blue-50 text-blue-900 px-2 py-0.5 rounded-md border border-blue-100 font-medium">${a}</span>`).join('')}
              ${amenities.length > 3 ? `<span class="text-[11px] text-slate-500">+${amenities.length - 3}</span>` : ''}
            </div>
          </div>
          
          <div class="text-xs text-slate-500 flex items-center justify-between border-t border-slate-200/80 pt-3">
            <span>🚗 ${diff}</span>
            <span class="font-bold text-blue-700">${price}</span>
          </div>
        </div>
      </div>

      <div class="p-5 pt-0 flex gap-2">
        <button onclick="selectSpotForForecast('${spot.id}')" class="flex-1 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition">
          ${isAr ? 'التوقعات' : 'Forecast'}
        </button>
        <button onclick="flyToSpot(${spot.latitude}, ${spot.longitude}, 11)" class="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition">
          📍
        </button>
        ${spot.is_camp ? `
          <button onclick="openBookingModal('${spot.id}')" class="btn-camp-book flex-1 py-2 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M4 18l8-14 8 14M9 18l3-6 3 6m-3-6v6" />
            </svg>
            <span>${isAr ? 'حجز' : 'Book'}</span>
          </button>
        ` : ''}
      </div>
    `;
    container.appendChild(card);
  });
  observeRevealElements(container);
}

// Select Spot and trigger Forecast Update & Map Pan
function selectSpotForForecast(spotId) {
  currentForecastSpotId = spotId;
  const select = document.getElementById('forecast-spot-select');
  if (select) select.value = spotId;
  loadForecast(spotId);
  const spot = allSpots.find(s => s.id === spotId);
  if (spot) flyToSpot(spot.latitude, spot.longitude, 10);

  // Smooth scroll to forecast section
  const el = document.getElementById('forecast-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Load 7-Day Forecast
async function loadForecast(spotId) {
  try {
    const res = await fetch(`/api/forecast/${spotId}`);
    const data = await res.json();
    renderForecastData(data);
  } catch (err) {
    console.error('Failed to load forecast:', err);
  }
}

function renderForecastData(data) {
  const isAr = currentLang === 'ar';
  const c = data.current_clarity;

  // Render Today's Big SCI Card
  const scoreEl = document.getElementById('today-sci-score');
  if (scoreEl) {
    scoreEl.style.color = c.rating_color;
    triggerOrQueueCounter(scoreEl, c.overall_score);
  }
  const labelEl = document.getElementById('today-sci-label');
  if (labelEl) {
    labelEl.innerText = isAr ? c.rating_label_ar : c.rating_label_en;
    labelEl.style.color = c.rating_color;
  }
  const nelmEl = document.getElementById('today-nelm-val');
  if (nelmEl) {
    triggerOrQueueCounter(nelmEl, c.naked_eye_limiting_mag);
  }
  document.getElementById('today-milkyway-val').innerText = isAr ? c.milky_way_visibility_ar : c.milky_way_visibility;
  document.getElementById('today-window-val').innerText = isAr ? (c.best_viewing_window_ar || c.best_viewing_window) : c.best_viewing_window;

  // Subscores bars
  document.getElementById('sub-cloud-bar').style.width = `${(c.sub_scores.cloud_score / 10) * 100}%`;
  triggerOrQueueCounter(document.getElementById('sub-cloud-val'), `${c.sub_scores.cloud_score}/10`);

  document.getElementById('sub-moon-bar').style.width = `${(c.sub_scores.moon_score / 10) * 100}%`;
  triggerOrQueueCounter(document.getElementById('sub-moon-val'), `${c.sub_scores.moon_score}/10`);

  document.getElementById('sub-darkness-bar').style.width = `${(c.sub_scores.darkness_score / 10) * 100}%`;
  triggerOrQueueCounter(document.getElementById('sub-darkness-val'), `${c.sub_scores.darkness_score}/10`);

  document.getElementById('sub-transparency-bar').style.width = `${(c.sub_scores.transparency_score / 10) * 100}%`;
  triggerOrQueueCounter(document.getElementById('sub-transparency-val'), `${c.sub_scores.transparency_score}/10`);

  document.getElementById('sub-seeing-bar').style.width = `${(c.sub_scores.seeing_score / 10) * 100}%`;
  triggerOrQueueCounter(document.getElementById('sub-seeing-val'), `${c.sub_scores.seeing_score}/10`);

  // Render 7-Day Day Cards
  const cardsContainer = document.getElementById('forecast-days-container');
  if (cardsContainer) {
    cardsContainer.innerHTML = '';
    data.forecast.forEach((day, idx) => {
      const dayCard = document.createElement('div');
      dayCard.className = `glass-panel p-4 rounded-xl flex flex-col justify-between border-t-2 text-center reveal-on-scroll reveal-delay-${(idx % 7) + 1}`;
      dayCard.style.borderTopColor = day.rating_color;
      dayCard.innerHTML = `
        <div class="text-xs text-slate-700 font-bold mb-1">${isAr ? day.day_name_ar : day.day_name_en}</div>
        <div class="text-[11px] text-slate-500 mb-2">${day.date.slice(5)}</div>
        <div class="text-2xl font-black mb-1 day-sci-val animate-counter" style="color: ${day.rating_color}" data-counter-target="${day.sci_score}">${day.sci_score}</div>
        <div class="text-[10px] font-bold uppercase mb-3" style="color: ${day.rating_color}">${isAr ? day.rating_label_ar : day.rating_label_en}</div>
        <div class="text-xs text-slate-700 flex flex-col gap-1 border-t border-blue-100 pt-2 text-left rtl:text-right">
          <div class="flex justify-between text-[11px]">
            <span class="text-slate-500">🌙 ${isAr ? day.moon_phase_name_ar : day.moon_phase_name_en}</span>
            <span class="font-semibold text-slate-800">${day.moon_illumination_pct}%</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span class="text-slate-500">☁️ ${isAr ? 'السحب' : 'Clouds'}</span>
            <span class="font-semibold text-slate-800">${day.cloud_cover_pct}%</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span class="text-slate-500">🌡️ ${isAr ? 'الحرارة' : 'Temp'}</span>
            <span class="font-semibold text-slate-800">${day.temp_c}°C</span>
          </div>
        </div>
      `;
      const daySciEl = dayCard.querySelector('.day-sci-val');
      if (daySciEl) {
        triggerOrQueueCounter(daySciEl, day.sci_score, 1000);
      }
      cardsContainer.appendChild(dayCard);
    });
    observeRevealElements(cardsContainer);
  }

  // Render Chart.js line
  renderForecastChart(data.forecast);
}

function renderForecastChart(forecast) {
  const ctx = document.getElementById('forecast-chart-canvas');
  if (!ctx) return;
  const isAr = currentLang === 'ar';

  const labels = forecast.map(d => isAr ? d.day_name_ar : d.day_name_en);
  const dataPoints = forecast.map(d => d.sci_score);

  if (forecastChart) forecastChart.destroy();

  const canvasContext = ctx.getContext('2d');
  const gradient = canvasContext.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(28, 26, 219, 0.28)');
  gradient.addColorStop(0.5, 'rgba(148, 185, 255, 0.15)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');

  forecastChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: isAr ? 'مؤشر صفاء السماء (SCI)' : 'Stargazing Clarity Index (SCI)',
        data: dataPoints,
        borderColor: '#1C1ADB',
        backgroundColor: gradient,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#1C1ADB',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointHoverBackgroundColor: '#1715B5',
        pointHoverBorderColor: '#94B9FF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 1,
          max: 10,
          grid: { color: 'rgba(148, 185, 255, 0.3)' },
          ticks: { color: '#334155', stepSize: 1, font: { weight: 'bold' } }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#334155', font: { weight: 'bold' } }
        }
      },
      plugins: {
        legend: { labels: { color: '#0F172A', font: { family: isAr ? 'Thmanyah Sans' : 'Plus Jakarta Sans', weight: 'bold' } } },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          titleColor: '#1C1ADB',
          bodyColor: '#1E293B',
          borderColor: 'rgba(148, 185, 255, 0.8)',
          borderWidth: 1,
          padding: 10
        }
      }
    }
  });
}

// Sandbox Interactive Real-Time Calculator
async function updateSandboxScore() {
  const cloud = parseFloat(document.getElementById('slider-cloud').value);
  const moon = parseFloat(document.getElementById('slider-moon').value);
  const bortle = parseInt(document.getElementById('slider-bortle').value);
  const humidity = parseFloat(document.getElementById('slider-humidity').value);
  const wind = parseFloat(document.getElementById('slider-wind').value);

  const isAr = currentLang === 'ar';
  document.getElementById('val-cloud').innerText = `${cloud}%`;
  document.getElementById('val-moon').innerText = `${moon}%`;
  document.getElementById('val-bortle').innerText = isAr ? `بورتل ${bortle}` : `Class ${bortle}`;
  document.getElementById('val-humidity').innerText = `${humidity}%`;
  document.getElementById('val-wind').innerText = `${wind} km/h`;

  try {
    const res = await fetch('/api/calculator/sci', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cloud_cover_pct: cloud,
        moon_illumination_pct: moon,
        bortle_class: bortle,
        humidity_pct: humidity,
        wind_speed_kmh: wind
      })
    });
    const result = await res.json();

    const scoreElem = document.getElementById('sandbox-score-val');
    scoreElem.style.color = result.rating_color;
    triggerOrQueueCounter(scoreElem, result.overall_score, 400);

    const labelElem = document.getElementById('sandbox-label-val');
    labelElem.innerText = isAr ? result.rating_label_ar : result.rating_label_en;
    labelElem.style.color = result.rating_color;

    const sandboxNelmEl = document.getElementById('sandbox-nelm-val');
    if (sandboxNelmEl) {
      triggerOrQueueCounter(sandboxNelmEl, `NELM ${result.naked_eye_limiting_mag}`, 400);
    }
    document.getElementById('sandbox-mw-val').innerText = isAr ? result.milky_way_visibility_ar : result.milky_way_visibility;
  } catch (err) {
    console.error('Failed to compute custom SCI:', err);
  }
}

// Recommendation Assistant
async function runQuickRecommendation() {
  const personaSelect = document.getElementById('recommend-persona-select');
  const persona = personaSelect ? personaSelect.value : 'astrophotographer';
  const reqAcc = document.getElementById('recommend-chk-accommodation')?.checked || false;
  const reqTel = document.getElementById('recommend-chk-telescope')?.checked || false;

  try {
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        persona: persona,
        requires_accommodation: reqAcc,
        requires_telescope: reqTel
      })
    });
    const data = await res.json();
    renderRecommendationResults(data);
  } catch (err) {
    console.error('Failed to get recommendations:', err);
  }
}

function renderRecommendationResults(data) {
  const container = document.getElementById('recommendations-container');
  if (!container) return;
  container.innerHTML = '';
  const isAr = currentLang === 'ar';

  document.getElementById('recommend-tip-text').innerText = isAr ? data.astronomy_tip_ar : data.astronomy_tip_en;

  const top3 = data.recommendations.slice(0, 3);
  top3.forEach((item, index) => {
    const spot = item.spot;
    const name = isAr ? spot.name_ar : spot.name_en;
    const reasons = isAr ? item.match_reasons_ar : item.match_reasons_en;
    const night = isAr ? item.best_suggested_night_ar : item.best_suggested_night_en;

    const card = document.createElement('div');
    card.className = `glass-panel p-5 rounded-2xl flex flex-col justify-between border-2 reveal-on-scroll reveal-delay-${index + 1} ${index === 0 ? 'border-blue-500/60 shadow-lg shadow-blue-500/10' : 'border-blue-100'}`;
    const targetScoreStr = `${item.suitability_score}% ${isAr ? 'ملائمة' : 'Match'}`;
    card.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${index === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}">
            #${index + 1} ${index === 0 ? (isAr ? 'الخيار الأفضل' : 'Top Match') : ''}
          </span>
          <span class="text-sm font-black compatibility-score-gradient rec-score-val animate-counter" data-counter-target="${targetScoreStr}">${targetScoreStr}</span>
        </div>
        
        <h4 class="text-base font-bold spot-card-title mb-2">${name}</h4>
        
        <div class="text-xs text-blue-900 bg-blue-50 border border-blue-200 rounded-lg p-2.5 mb-3">
          🌙 ${isAr ? 'الليلة المقترحة المثالية:' : 'Best Night:'} <strong class="text-blue-700 font-bold">${night}</strong> (SCI ${item.predicted_sci})
        </div>

        <ul class="text-xs text-slate-600 space-y-1.5 mb-4">
          ${reasons.slice(0, 2).map(r => `<li class="flex items-start gap-1.5"><span>✓</span><span>${r}</span></li>`).join('')}
        </ul>
      </div>

      <div class="flex gap-2 pt-2 border-t border-slate-200/80">
        <button onclick="selectSpotForForecast('${spot.id}')" class="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition">
          ${isAr ? 'تفاصيل التوقعات' : 'View Forecast'}
        </button>
        ${spot.is_camp ? `
          <button onclick="openBookingModal('${spot.id}')" class="btn-camp-book flex-1 py-2 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M4 18l8-14 8 14M9 18l3-6 3 6m-3-6v6" />
            </svg>
            <span>${isAr ? 'حجز المخيم' : 'Book Camp'}</span>
          </button>
        ` : ''}
      </div>
    `;
    const recScoreEl = card.querySelector('.rec-score-val');
    if (recScoreEl) {
      triggerOrQueueCounter(recScoreEl, targetScoreStr, 1100);
    }
    container.appendChild(card);
  });
  observeRevealElements(container);
}

// Booking Modal Logic
function openBookingModal(spotId) {
  const spot = allSpots.find(s => s.id === spotId);
  if (!spot) return;

  const isAr = currentLang === 'ar';
  document.getElementById('modal-spot-id').value = spotId;
  document.getElementById('modal-spot-name').innerText = isAr ? spot.name_ar : spot.name_en;
  document.getElementById('modal-spot-price').innerText = spot.booking_price_sar > 0 ? `${spot.booking_price_sar} ${isAr ? 'ر.س / ليلة' : 'SAR / night'}` : (isAr ? 'مجاني' : 'Free');
  
  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('booking-date').value = tomorrow.toISOString().split('T')[0];

  const modal = document.getElementById('booking-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

async function submitBookingForm(e) {
  e.preventDefault();
  const spotId = document.getElementById('modal-spot-id').value;
  const name = document.getElementById('booking-name').value;
  const phone = document.getElementById('booking-phone').value;
  const guests = parseInt(document.getElementById('booking-guests').value);
  const date = document.getElementById('booking-date').value;
  const telescope = document.getElementById('booking-telescope').checked;
  const guide = document.getElementById('booking-guide').checked;

  try {
    const res = await fetch('/api/bookings/inquire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spot_id: spotId,
        full_name: name,
        email: "guest@sama-alnafud.sa",
        phone: phone,
        num_guests: guests,
        preferred_date: date,
        has_own_telescope: telescope,
        requires_astrophotography_guide: guide,
        language: currentLang
      })
    });
    const result = await res.json();
    const isAr = currentLang === 'ar';

    alert(isAr ? result.confirmation_message_ar : result.confirmation_message_en);
    closeBookingModal();
    window.open(result.whatsapp_link, '_blank');
  } catch (err) {
    alert("Error submitting inquiry. Please check details.");
  }
}

// Language Switcher
function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', currentLang);
  document.body.className = `lang-${currentLang}`;
  updateLanguageUI();
  populateSpotSelect(allSpots);
  applyDirectoryFilter(currentDirectoryFilter);
  loadForecast(currentForecastSpotId);
  if (typeof updateMapLanguage === 'function') {
    updateMapLanguage(currentLang);
  }
  renderMapMarkers(allSpots);
  if (typeof renderMapSidebar === 'function') {
    renderMapSidebar(allSpots);
  }
  if (typeof darkSkyMap !== 'undefined' && darkSkyMap) {
    setTimeout(() => darkSkyMap.invalidateSize(), 150);
  }
  updateSandboxScore();
  runQuickRecommendation();
}

function updateLanguageUI() {
  const dict = i18n[currentLang];
  document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', currentLang);
  document.title = currentLang === 'ar' 
    ? 'سماي | المنصة التنبؤية للسياحة الفلكية بحائل' 
    : 'My Sky | Predictive Astro-Tourism Platform for Hail';

  document.querySelector('meta[name="application-name"]')?.setAttribute('content', currentLang === 'ar' ? 'سماي' : 'My Sky');
  document.querySelector('meta[property="og:site_name"]')?.setAttribute('content', currentLang === 'ar' ? 'سماي' : 'My Sky');
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.innerText = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.placeholder = dict[key];
  });

  const langBtn = document.getElementById('btn-lang-toggle');
  if (langBtn) langBtn.innerText = currentLang === 'ar' ? '🌐 English (EN)' : '🌐 العربية (AR)';

  const brandLogos = document.querySelectorAll('.header-brand-logo, .footer-brand-logo');
  brandLogos.forEach(logo => {
    logo.alt = currentLang === 'ar' ? 'سماي' : 'My Sky';
  });

  const brandLinks = document.querySelectorAll('.brand-logo-link, .footer-brand-logo-link');
  brandLinks.forEach(link => {
    link.setAttribute('aria-label', currentLang === 'ar' ? 'سماي' : 'My Sky');
  });
}

// Event Listeners
function setupEventListeners() {
  document.getElementById('btn-lang-toggle')?.addEventListener('click', toggleLanguage);

  // Smooth scroll handler for brand logo links
  document.querySelectorAll('.brand-logo-link, .footer-brand-logo-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname + window.location.search);
      }
    });
  });

  document.getElementById('forecast-spot-select')?.addEventListener('change', (e) => {
    selectSpotForForecast(e.target.value);
  });

  // Sandbox inputs
  ['slider-cloud', 'slider-moon', 'slider-bortle', 'slider-humidity', 'slider-wind'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateSandboxScore);
  });

  // Recommendation inputs
  ['recommend-persona-select', 'recommend-chk-accommodation', 'recommend-chk-telescope'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', runQuickRecommendation);
  });
  document.getElementById('btn-run-recommend')?.addEventListener('click', runQuickRecommendation);

  // Directory Filters (Interactive state management & instant feedback)
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filter = e.currentTarget.getAttribute('data-filter') || 'all';
      applyDirectoryFilter(filter);
    });
  });

  // Search input
  document.getElementById('directory-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = allSpots.filter(s =>
      s.name_en.toLowerCase().includes(q) ||
      s.name_ar.toLowerCase().includes(q) ||
      s.description_en.toLowerCase().includes(q) ||
      s.description_ar.toLowerCase().includes(q)
    );
    renderDirectory(filtered);
  });

  // Booking modal
  document.getElementById('booking-form')?.addEventListener('submit', submitBookingForm);
  document.getElementById('btn-close-modal')?.addEventListener('click', closeBookingModal);
  document.getElementById('btn-cancel-modal')?.addEventListener('click', closeBookingModal);
}

// Persistent filter state
let currentDirectoryFilter = 'all';

function applyDirectoryFilter(filter) {
  currentDirectoryFilter = filter || 'all';

  // Synchronize visual active state across all filter buttons
  document.querySelectorAll('.filter-btn').forEach(b => {
    const isSelected = b.getAttribute('data-filter') === currentDirectoryFilter;
    b.classList.toggle('active', isSelected);
    b.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });

  if (currentDirectoryFilter === 'all') {
    renderDirectory(allSpots);
  } else if (currentDirectoryFilter === 'bortle1') {
    renderDirectory(allSpots.filter(s => s.bortle_class === 1));
  } else if (currentDirectoryFilter === 'ksrnr') {
    renderDirectory(allSpots.filter(s => (s.royal_reserve && s.royal_reserve.includes('King Salman')) || (s.royal_reserve_ar && s.royal_reserve_ar.includes('الملك سلمان'))));
  } else if (currentDirectoryFilter === 'camps') {
    renderDirectory(allSpots.filter(s => s.is_camp));
  } else if (currentDirectoryFilter === 'telescopes') {
    renderDirectory(allSpots.filter(s => s.has_telescopes));
  }
}

