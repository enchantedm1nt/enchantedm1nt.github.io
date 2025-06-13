// Locaties van verhoren
const locaties = {
  ton: { lat: 51.984, lon: 5.913 },
  noa: { lat: 51.9805, lon: 5.9186 },
  willemJan: { lat: 51.986, lon: 5.915 },
  said: { lat: 51.987, lon: 5.916 },
  emma: { lat: 51.988, lon: 5.917 },
};

// Linkjes naar digitale verhoren
const links = {
  ton: 'verhoor-ton.html',
  noa: 'verhoor-noa.html',
  willemJan: 'verhoor-willemjan.html',
  said: 'verhoor-said.html',
  emma: 'verhoor-emma.html',
};

// Voorwaarden voor activatie
const maxAfstand = 50; // meters
const startDatum = new Date('2025-06-13T20:00'); // PAS AAN indien nodig

// Hulpfuncties en technisch gekut
function afstandInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function knopId(key) {
  return 'btn' + key.charAt(0).toUpperCase() + key.slice(1);
}

function checkLocatie(pos) {
  const nu = new Date();
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  let actieveKnoppen = 0;

  for (const key in locaties) {
    const knop = document.getElementById(knopId(key));
    const loc = locaties[key];
    const afstand = afstandInMeters(lat, lon, loc.lat, loc.lon);

    if (nu >= startDatum && afstand <= maxAfstand) {
      knop.disabled = false;
      actieveKnoppen++;
    } else {
      knop.disabled = true;
    }
  }

// Informatiedialogen
  const statusEl = document.getElementById('status');
  if (nu < startDatum) {
    statusEl.textContent = `⏳ Verhoren zijn beschikbaar vanaf ${startDatum.toLocaleString()}`;
  } else if (actieveKnoppen === 0) {
    statusEl.textContent = 'ℹ️ Je bent niet bij een verdachte in de buurt.';
  } else {
    statusEl.textContent = `✅ Je kunt ${actieveKnoppen} verdachte(n) verhoren.`;
  }
}

// Errorbericht
function locatieFout(err) {
  document.getElementById('status').textContent = '⚠️ Locatie niet beschikbaar: ' + err.message;
}

// Start locatiecontrole
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(checkLocatie, locatieFout, {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 5000,
  });
} else {
  document.getElementById('status').textContent = '⚠️ Geolocatie wordt niet ondersteund.';
}

// Knoppen instellen
for (const key in links) {
  const knop = document.getElementById(knopId(key));
  knop.addEventListener('click', () => {
    window.location.href = links[key];
  });
}
