  // Coördinaten van verdachten-locaties (voorbeeld: Arnhem)
  const locaties = {
    ton: { lat: 51.984, lon: 5.913 },        // Pas aan naar echte locatie
    noa: { lat: 51.9805, lon: 5.9186 },
    willemJan: { lat: 51.986, lon: 5.915 },
    said: { lat: 51.987, lon: 5.916 },
    emma: { lat: 51.988, lon: 5.917 },
  };

  // Maximale afstand in meters waarop knop actief wordt
  const maxAfstand = 50;

  // Functie om afstand te berekenen tussen 2 coördinaten in meters
  function afstandInMeters(lat1, lon1, lat2, lon2) {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    const R = 6371000; // Straal aarde in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Links naar Twine-verhoren
  const links = {
    ton: 'verhoor-ton.html',
    noa: 'verhoor-noa.html',
    willemJan: 'verhoor-willemjan.html',
    said: 'verhoor-said.html',
    emma: 'verhoor-emma.html',
  };

  // Check locatie en activeer knoppen
  function checkLocatie(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    let actieveKnoppen = 0;

    // Loop door alle locaties en check afstand
    for (const key in locaties) {
      const loc = locaties[key];
      const afstand = afstandInMeters(lat, lon, loc.lat, loc.lon);
      const knop = document.getElementById('btn' + key.charAt(0).toUpperCase() + key.slice(1));
      if (afstand <= maxAfstand) {
        knop.disabled = false;
        actieveKnoppen++;
      } else {
        knop.disabled = true;
      }
    }

    const statusEl = document.getElementById('status');
    if (actieveKnoppen === 0) {
      statusEl.textContent = 'Je bent niet bij een verdachte in de buurt.';
    } else {
      statusEl.textContent = `Je kunt ${actieveKnoppen} verdachte(n) verhoren.`;
    }
  }

  // Error handler voor locatie
  function locatieFout(err) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = 'Kon je locatie niet bepalen: ' + err.message;
  }

  // Start locatie bepalen
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(checkLocatie, locatieFout, { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 });
  } else {
    document.getElementById('status').textContent = 'Geolocatie wordt niet ondersteund door deze browser.';
  }

  // Voeg event listeners toe om te linken naar de Twine-bestanden
  for (const key in links) {
    const knop = document.getElementById('btn' + key.charAt(0).toUpperCase() + key.slice(1));
    knop.addEventListener('click', () => {
      window.location.href = links[key];
    });
  }