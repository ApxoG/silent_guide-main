// Main script used on map page. It only runs map-related code when a #map element exists.
// Map initialization and user location tracking with rotating guide overlay
(function () {
  // Declare global variables used throughout the script
  let userMarker = null;
  let accuracyCircle = null;
  let visibleMarkers = [];
  let currentUserPosition = null; // Store current user position for language updates

  const params = new URLSearchParams(location.search);
  let selectedLang = params.get('lang') || 'en';

  // Only initialize map if #map exists
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  // Initialize Leaflet map - centered on Ozurgeti
  const leafletMap = L.map('map').setView([41.9245, 42.0000], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(leafletMap);

  // POIs data for Ozurgeti with different types
  const towns = [
    {
      name: { ge: 'ოზურგეთი', en: 'Ozurgeti', ru: 'Озургети' },
      lat: 41.9245,
      lng: 42.0000,
      sights: [
        // Sightseeings
        {
          name: { ge: 'ოზურგეთის ისტორიული მუზეუმი', en: 'Ozurgeti History Museum', ru: 'Исторический музей Озургети' },
          desc: { ge: 'რეგიონის ისტორია და კულტურული მემკვიდრეობა', en: 'Regional history and cultural heritage', ru: 'Региональная история и культурное наследие' },
          lat: 41.9245,
          lng: 42.0010,
          type: 'museum',
        },
        {
          name: { ge: 'ჯუმათის მონასტერი', en: 'Jumati Monastery', ru: 'Монастырь Джумати' },
          desc: { ge: 'ძველი ქართული მონასტერი ბუნებრივი ლანდშაფტით', en: 'Ancient Georgian monastery with natural landscape', ru: 'Древний грузинский монастырь с природным ландшафтом' },
          lat: 41.9000,
          lng: 41.9500,
          type: 'sightseeing',
        },
        {
          name: { ge: 'ოზურგეთის დრამატული თეატრი', en: 'Ozurgeti Drama Theatre', ru: 'Драматический театр Озургети' },
          desc: { ge: 'კულტურული ცენტრი და თეატრალური წარმოდგენები', en: 'Cultural center and theatrical performances', ru: 'Культурный центр и театральные представления' },
          lat: 41.9230,
          lng: 42.0015,
          type: 'sightseeing',
        },
        {
          name: { ge: 'ბახმაროს კურორტი', en: 'Bakhmaro Resort', ru: 'Курорт Бахмаро' },
          desc: { ge: 'მთის კურორტი ლაშქრობისა და ბუნების დასანახავად', en: 'Mountain resort for hiking and nature', ru: 'Горный курорт для походов и природы' },
          lat: 41.8500,
          lng: 42.0500,
          type: 'sightseeing',
        },
        // Restaurants
        {
          name: { ge: 'რესტორანი "გურია"', en: 'Restaurant "Guria"', ru: 'Ресторан "Гурия"' },
          desc: { ge: 'ტრადიციული ქართული კუხნა და ლოკალური სპეციალობები', en: 'Traditional Georgian cuisine and local specialties', ru: 'Традиционная грузинская кухня и местные блюда' },
          lat: 41.9250,
          lng: 42.0005,
          type: 'restaurant',
        },
        {
          name: { ge: 'კაფე "ცენტრალური"', en: 'Cafe "Central"', ru: 'Кафе "Центральное"' },
          desc: { ge: 'კოფი, ტორტები და სწრაფი კვება', en: 'Coffee, pastries and quick meals', ru: 'Кофе, выпечка и быстрая еда' },
          lat: 41.9240,
          lng: 42.0008,
          type: 'restaurant',
        },
        {
          name: { ge: 'რესტორანი "მთის ხედი"', en: 'Restaurant "Mountain View"', ru: 'Ресторан "Горный вид"' },
          desc: { ge: 'პანორამული ხედი და ქართული კუხნა', en: 'Panoramic views and Georgian cuisine', ru: 'Панорамный вид и грузинская кухня' },
          lat: 41.9260,
          lng: 42.0020,
          type: 'restaurant',
        },
        // Museums
        {
          name: { ge: 'ოზურგეთის მხარეთმცოდნეობის მუზეუმი', en: 'Ozurgeti Local Lore Museum', ru: 'Краеведческий музей Озургети' },
          desc: { ge: 'არქეოლოგიური არტეფაქტები და რეგიონის ისტორია', en: 'Archaeological artifacts and regional history', ru: 'Археологические артефакты и региональная история' },
          lat: 41.9242,
          lng: 42.0012,
          type: 'museum',
        },
        {
          name: { ge: 'ნიკო ნიკოლაძის სახლ-მუზეუმი', en: 'Niko Nikoladze House Museum', ru: 'Дом-музей Нико Николадзе' },
          desc: { ge: 'ცნობილი ქართველი საზოგადო მოღვაწის მემორიალი', en: 'Memorial of famous Georgian public figure', ru: 'Мемориал известного грузинского общественного деятеля' },
          lat: 41.9235,
          lng: 42.0003,
          type: 'museum',
        },
      ],
    },
  ];

  // Create guide icon definition but don't place marker yet
  const guideIcon = L.divIcon({
    className: 'robot-marker',  
    iconSize: [64, 64],
    iconAnchor: [32, 32],
    html: `<img src="kacuna/guide.jpeg" style="width:100%;height:100%;border-radius:50%;">`
  }); 
  
  let guideMarker = null;

  // Add distance calculation helper
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }

  // Create custom icons for different POI types
  function getPOIIcon(type) {
    const colors = {
      'sightseeing': '#00b894', // Green
      'restaurant': '#e17055',  // Orange/Red
      'museum': '#0984e3'       // Blue
    };
    const icons = {
      'sightseeing': '📍',
      'restaurant': '🍽️',
      'museum': '🏛️'
    };
    const color = colors[type] || '#6c5ce7';
    const icon = icons[type] || '📍';
    
    return L.divIcon({
      className: 'poi-marker',
      html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">${icon}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }

  // Get type label in current language
  function getTypeLabel(type, lang) {
    const labels = {
      'sightseeing': { ge: 'ღირსშესანიშნაობა', en: 'Sightseeing', ru: 'Достопримечательность' },
      'restaurant': { ge: 'რესტორანი', en: 'Restaurant', ru: 'Ресторан' },
      'museum': { ge: 'მუზეუმი', en: 'Museum', ru: 'Музей' }
    };
    return labels[type]?.[lang] || type;
  }

  // Calculate nearby POIs within radius
  function calculateNearbyPOIs(userLat, userLng, radiusKm = 5) {
    const nearbyPOIs = {
      sightseeing: [],
      restaurant: [],
      museum: []
    };

    towns.forEach(town => {
      if (!town.sights) return;
      town.sights.forEach(sight => {
        const distance = getDistance(userLat, userLng, sight.lat, sight.lng);
        if (distance <= radiusKm) {
          const poiType = sight.type || 'sightseeing';
          nearbyPOIs[poiType] = nearbyPOIs[poiType] || [];
          nearbyPOIs[poiType].push({ ...sight, distance });
        }
      });
    });

    // Sort each category by distance
    Object.keys(nearbyPOIs).forEach(type => {
      nearbyPOIs[type].sort((a, b) => a.distance - b.distance);
    });

    return nearbyPOIs;
  }

  function updateNearbyPOIs(userLat, userLng) {
    // Clean up old markers
    visibleMarkers.forEach(marker => leafletMap.removeLayer(marker));
    visibleMarkers = [];

    // Get nearby POIs
    const nearbyPOIs = calculateNearbyPOIs(userLat, userLng);

    // Show markers on map
    Object.keys(nearbyPOIs).forEach(type => {
      nearbyPOIs[type].forEach(sight => {
        const pos = [sight.lat, sight.lng];
        const title = sight.name[selectedLang] || sight.name.en;
        const desc = sight.desc[selectedLang] || sight.desc.en;
        const typeLabel = getTypeLabel(sight.type || 'sightseeing', selectedLang);
        
        const marker = L.marker(pos, { icon: getPOIIcon(sight.type || 'sightseeing') }).addTo(leafletMap);
        
        // Get distance text in current language
        const distanceTexts = {
          ge: 'კმ მოშორებით',
          en: 'km away',
          ru: 'км отсюда'
        };
        const distanceText = distanceTexts[selectedLang] || distanceTexts.en;
        
        marker.bindPopup(
          `<div style="min-width:180px;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${typeLabel}</div>
            <strong style="font-size: 16px;">${title}</strong>
            <p style="margin: 8px 0; font-size: 14px;">${desc}</p>
            <p style="margin: 0; font-size: 12px; color: #0984e3;">📍 ${sight.distance.toFixed(2)} ${distanceText}</p>
          </div>`
        );
        visibleMarkers.push(marker);
      });
    });
  }

  // Update suggestions panel UI
  function updateSuggestionsPanel(nearbyPOIs) {
    const panel = document.getElementById('suggestions-panel');
    const loading = document.getElementById('suggestions-loading');
    const list = document.getElementById('suggestions-list');
    const title = document.getElementById('suggestions-title');
    
    if (!panel || !loading || !list) return;

    const titleTexts = {
      ge: 'გიდის რეკომენდაციები',
      en: 'Guide Suggestions',
      ru: 'Рекомендации гида'
    };
    if (title) title.textContent = titleTexts[selectedLang] || titleTexts.en;

    const hasAnyPOIs = nearbyPOIs.restaurant.length > 0 || 
                       nearbyPOIs.museum.length > 0 || 
                       nearbyPOIs.sightseeing.length > 0;

    if (!hasAnyPOIs) {
      loading.textContent = selectedLang === 'ge' ? 'ახლოს არ არის ადგილები' :
                           selectedLang === 'ru' ? 'Поблизости нет мест' :
                           'No nearby places found';
      list.innerHTML = '';
      return;
    }

    loading.style.display = 'none';
    list.innerHTML = '';

    const categoryLabels = {
      restaurant: { ge: '🍽️ რესტორანები', en: '🍽️ Restaurants', ru: '🍽️ Рестораны' },
      museum: { ge: '🏛️ მუზეუმები', en: '🏛️ Museums', ru: '🏛️ Музеи' },
      sightseeing: { ge: '📍 ღირსშესანიშნაობები', en: '📍 Sightseeings', ru: '📍 Достопримечательности' }
    };

    // Show top 3 from each category
    ['restaurant', 'museum', 'sightseeing'].forEach(type => {
      if (nearbyPOIs[type] && nearbyPOIs[type].length > 0) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'suggestion-category';
        
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'suggestion-category-title';
        categoryTitle.textContent = categoryLabels[type][selectedLang] || categoryLabels[type].en;
        categoryDiv.appendChild(categoryTitle);

        nearbyPOIs[type].slice(0, 3).forEach(poi => {
          const item = document.createElement('div');
          item.className = `suggestion-item ${type}`;
          // Get distance text in current language
          const distanceTexts = {
            ge: 'კმ',
            en: 'km',
            ru: 'км'
          };
          const distanceText = distanceTexts[selectedLang] || distanceTexts.en;
          
          item.innerHTML = `
            <div class="suggestion-item-name">${poi.name[selectedLang] || poi.name.en}</div>
            <div class="suggestion-item-desc">${poi.desc[selectedLang] || poi.desc.en}</div>
            <div class="suggestion-item-distance">📍 ${poi.distance.toFixed(2)} ${distanceText}</div>
          `;
          item.addEventListener('click', () => {
            leafletMap.setView([poi.lat, poi.lng], 16);
            // Find and open the marker popup
            visibleMarkers.forEach(marker => {
              const markerLatLng = marker.getLatLng();
              if (Math.abs(markerLatLng.lat - poi.lat) < 0.0001 && 
                  Math.abs(markerLatLng.lng - poi.lng) < 0.0001) {
                marker.openPopup();
              }
            });
          });
          categoryDiv.appendChild(item);
        });

        list.appendChild(categoryDiv);
      }
    });
  }

  function handlePosition(pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy || 20;
    const latLng = [lat, lng];
    
    // Store current user position for language updates
    currentUserPosition = { lat, lng };

    if (!userMarker) {
      // First time setup
      userMarker = L.marker(latLng, {
        icon: L.divIcon({
          className: '',
          html: `<div style="width:16px;height:16px;background:#4285F4;border-radius:50%;border:2px solid #fff;"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      }).addTo(leafletMap);

      accuracyCircle = L.circle(latLng, {
        color: '#4285F4',
        fillColor: '#4285F4',
        fillOpacity: 0.08,
        radius: accuracy
      }).addTo(leafletMap);

      // Initialize guide marker at user's first known position
      if (!guideMarker) {
        guideMarker = L.marker(latLng, { icon: guideIcon }).addTo(leafletMap);
      }

      leafletMap.setView(latLng, 14);
    } else {
      // Update existing markers
      userMarker.setLatLng(latLng);
      accuracyCircle.setLatLng(latLng);
      accuracyCircle.setRadius(accuracy);
      guideMarker.setLatLng(latLng); // Guide follows user position
    }

    // Update nearby POIs and suggestions panel
    updateNearbyPOIs(lat, lng);
    const nearbyPOIs = calculateNearbyPOIs(lat, lng);
    updateSuggestionsPanel(nearbyPOIs);
  }

  function handleError(err) {
    console.warn('Geolocation error', err);
    if (err && err.message) {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.left = '50%';
      el.style.top = '10px';
      el.style.transform = 'translateX(-50%)';
      el.style.background = 'rgba(0,0,0,0.6)';
      el.style.color = 'white';
      el.style.padding = '6px 12px';
      el.style.borderRadius = '12px';
      el.style.zIndex = 1200;
      el.textContent = 'Location error: ' + err.message;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  }

  // Get initial position before starting watch
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      handlePosition,
      handleError,
      { enableHighAccuracy: true, timeout: 5000 }
    );
    
    navigator.geolocation.watchPosition(
      handlePosition, 
      handleError, 
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );
  } else {
    handleError({ message: 'Geolocation not supported by this browser.' });
  }

  // Initialize suggestions panel toggle
  function initSuggestionsPanel() {
    const toggle = document.getElementById('suggestions-toggle');
    const header = document.querySelector('.suggestions-header');
    const panel = document.getElementById('suggestions-panel');
    
    if (!toggle || !header || !panel) return;

    const togglePanel = () => {
      panel.classList.toggle('collapsed');
      toggle.textContent = panel.classList.contains('collapsed') ? '▲' : '▼';
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel();
    });

    header.addEventListener('click', () => {
      togglePanel();
    });
  }

  // Initialize on page load
  initSuggestionsPanel();

  // Language switching functionality
  function switchLanguage() {
    const languages = ['en', 'ru', 'ge'];
    const currentIndex = languages.indexOf(selectedLang);
    const nextIndex = (currentIndex + 1) % languages.length;
    selectedLang = languages[nextIndex];
    
    // Update URL without reload
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('lang', selectedLang);
    window.history.pushState({}, '', newUrl);
    
    // Update language label
    const langLabel = document.getElementById('lang-label');
    const langNames = { en: 'English', ru: 'Русский', ge: 'ქართული' };
    if (langLabel) {
      langLabel.textContent = langNames[selectedLang] || selectedLang;
    }
    
    // Update tooltip
    updateLanguageSelectorTooltip();
    
    // Update all UI elements
    updateAllUIForLanguage();
    
    // Update markers and suggestions
    // If user position is known, use it; otherwise use Ozurgeti center
    const updateLat = currentUserPosition ? currentUserPosition.lat : 41.9245;
    const updateLng = currentUserPosition ? currentUserPosition.lng : 42.0000;
    
    updateNearbyPOIs(updateLat, updateLng);
    const nearbyPOIs = calculateNearbyPOIs(updateLat, updateLng);
    updateSuggestionsPanel(nearbyPOIs);
  }

  function updateAllUIForLanguage() {
    // Update suggestions panel title
    const title = document.getElementById('suggestions-title');
    const titleTexts = {
      ge: 'გიდის რეკომენდაციები',
      en: 'Guide Suggestions',
      ru: 'Рекомендации гида'
    };
    if (title) title.textContent = titleTexts[selectedLang] || titleTexts.en;
    
    // Update loading text
    const loading = document.getElementById('suggestions-loading');
    if (loading && loading.style.display !== 'none') {
      loading.textContent = selectedLang === 'ge' ? 'ახლოს ადგილების ძიება...' :
                           selectedLang === 'ru' ? 'Поиск ближайших мест...' :
                           'Finding nearby places...';
    }
  }

  // Update language selector tooltip
  function updateLanguageSelectorTooltip() {
    const langLabel = document.getElementById('lang-label');
    if (langLabel) {
      langLabel.title = selectedLang === 'ge' ? 'ენის შეცვლა' :
                       selectedLang === 'ru' ? 'Изменить язык' :
                       'Change language';
    }
  }

  // Initialize language selector click handler
  function initLanguageSelector() {
    const langLabel = document.getElementById('lang-label');
    if (langLabel) {
      langLabel.style.cursor = 'pointer';
      langLabel.style.transition = 'opacity 0.2s';
      updateLanguageSelectorTooltip();
      langLabel.addEventListener('click', () => {
        langLabel.style.opacity = '0.7';
        setTimeout(() => {
          switchLanguage();
          langLabel.style.opacity = '1';
        }, 100);
      });
      langLabel.addEventListener('mouseenter', () => {
        langLabel.style.opacity = '0.8';
      });
      langLabel.addEventListener('mouseleave', () => {
        langLabel.style.opacity = '1';
      });
    }
  }

  // Initialize language selector
  initLanguageSelector();

  // Show initial POIs around Ozurgeti center (before geolocation loads)
  // This ensures language switching works immediately
  setTimeout(() => {
    if (!currentUserPosition) {
      updateNearbyPOIs(41.9245, 42.0000);
      const nearbyPOIs = calculateNearbyPOIs(41.9245, 42.0000);
      updateSuggestionsPanel(nearbyPOIs);
    }
  }, 500);

  // expose settings
  window.appSettings = { 
    lang: selectedLang,
    switchLanguage: switchLanguage
  };
})();