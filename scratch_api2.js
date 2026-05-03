const fs = require('fs');

async function checkAirArabia() {
  try {
    const res = await fetch("https://www.airarabia.com/en/manage/flight-status/check-flight-status", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    const text = await res.text();
    fs.writeFileSync("airarabia.html", text);
    console.log("Saved to airarabia.html");
  } catch(e) {
    console.error(e);
  }
}
checkAirArabia();
