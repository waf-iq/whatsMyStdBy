async function checkAirArabia() {
  try {
    const res = await fetch("https://www.airarabia.com/en/manage/flight-status/check-flight-status", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Text length:", text.length);
    
    // Look for anything resembling JSON configurations or API endpoints
    const apiMatches = text.match(/https?:\/\/[^\s"'<>]+\/api\/[^\s"'<>]+/gi) || [];
    const jsonMatches = text.match(/\{[^{}]*flight[^{}]*\}/gi) || [];
    
    console.log("API Endpoints found:", apiMatches.slice(0, 10));
    // console.log("JSON snippets:", jsonMatches.slice(0, 3));
  } catch(e) {
    console.error(e);
  }
}
checkAirArabia();
