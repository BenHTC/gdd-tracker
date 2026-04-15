// Vercel Cron Job - runs daily at 7:00 AM Mountain Time (14:00 UTC)
// Fetches temperature data from ACIS API, calculates GDD, and sends emails via Resend

const FROM_EMAIL = "GDD Daily Report <gdd@howardtreecare.com>";
const RESEND_API_URL = "https://api.resend.com/emails";
const ACIS_API_URL = "https://data.rcc-acis.org/StnData";
const BASE_TEMP = 50; // °F

const STATIONS = [
  { id: "050109", name: "Akron 4 E" },
  { id: "050114", name: "Akron Washington Co AP" },
  { id: "050130", name: "Alamosa San Luis AP" },
  { id: "050214", name: "Altenbern" },
  { id: "050263", name: "Antero Rsvr" },
  { id: "050454", name: "Bailey" },
  { id: "050825", name: "Bonham Rsvr" },
  { id: "050834", name: "Bonny Dam 2NE" },
  { id: "050848", name: "Boulder" },
  { id: "051071", name: "Buena Vista 2 S" },
  { id: "051121", name: "Burlington" },
  { id: "051179", name: "Byers 5 ENE" },
  { id: "051294", name: "Canon City" },
  { id: "051401", name: "Castle Rock" },
  { id: "051458", name: "Center 4 SSW" },
  { id: "051528", name: "Cheesman" },
  { id: "051564", name: "Cheyenne Wells" },
  { id: "051609", name: "Cimarron" },
  { id: "051660", name: "Climax" },
  { id: "051713", name: "Cochetopa Creek" },
  { id: "051772", name: "Colorado NM" },
  { id: "051778", name: "Colorado Springs Muni AP" },
  { id: "051886", name: "Cortez" },
  { id: "051959", name: "Crested Butte" },
  { id: "052184", name: "Del Norte 2E" },
  { id: "052220", name: "Denver Stapleton" },
  { id: "052281", name: "Dillon 1 E" },
  { id: "052446", name: "Eads" },
  { id: "052454", name: "Eagle CO AP" },
  { id: "052790", name: "Evergreen" },
  { id: "052932", name: "Flagler 1S" },
  { id: "053005", name: "Ft Collins" },
  { id: "053016", name: "Ft Lewis" },
  { id: "053038", name: "Ft Morgan" },
  { id: "053246", name: "Gateway" },
  { id: "053261", name: "Georgetown" },
  { id: "053488", name: "Grand Junction Walker Fld" },
  { id: "053489", name: "Grand Junction 6 ESE" },
  { id: "053496", name: "Grand Lake 1 NW" },
  { id: "053500", name: "Grand Lake 6 SSW" },
  { id: "053530", name: "Grant" },
  { id: "053541", name: "Great Sand Dunes Nat" },
  { id: "053553", name: "Greeley UNC" },
  { id: "053662", name: "Gunnison 3 SW" },
  { id: "053867", name: "Hayden" },
  { id: "053951", name: "Hermit 7 ESE" },
  { id: "054076", name: "Holly" },
  { id: "054082", name: "Holyoke" },
  { id: "054172", name: "Hugo 1 NW" },
  { id: "054242", name: "Idalia" },
  { id: "054388", name: "John Martin Dam" },
  { id: "054413", name: "Julesburg" },
  { id: "054452", name: "Kassler" },
  { id: "054603", name: "Kit Carson" },
  { id: "054664", name: "Kremmling" },
  { id: "054720", name: "La Junta Muni AP" },
  { id: "054742", name: "Lake George 8 SW" },
  { id: "054762", name: "Lakewood" },
  { id: "054770", name: "Lamar" },
  { id: "054834", name: "Las Animas" },
  { id: "054945", name: "Leroy 9 WSW" },
  { id: "055056", name: "Littleton" },
  { id: "055327", name: "Mancos 1SW" },
  { id: "055446", name: "Maybell" },
  { id: "055484", name: "Meeker" },
  { id: "055531", name: "Mesa Verde NP" },
  { id: "055706", name: "Monte Vista 2W" },
  { id: "055722", name: "Montrose #2" },
  { id: "055970", name: "Northdale" },
  { id: "056266", name: "Palisade" },
  { id: "056306", name: "Paonia 1SW" },
  { id: "056740", name: "Pueblo Mem AP" },
  { id: "056832", name: "Rangely 1E" },
  { id: "057167", name: "Rocky Ford 2 SE" },
  { id: "057309", name: "Ruxton Park" },
  { id: "057370", name: "Salida" },
  { id: "057460", name: "Sargents" },
  { id: "057515", name: "Sedgwick 5 S" },
  { id: "057618", name: "Shoshone" },
  { id: "057656", name: "Silverton" },
  { id: "057936", name: "Steamboat Springs" },
  { id: "058064", name: "Sugarloaf Rsvr" },
  { id: "058157", name: "Tacony 13 SE" },
  { id: "058184", name: "Taylor Park" },
  { id: "058204", name: "Telluride 4WNW" },
  { id: "058429", name: "Trinidad" },
  { id: "058434", name: "Trinidad Perry Stokes AP" },
  { id: "058501", name: "Twin Lakes Rsvr" },
  { id: "058560", name: "Uravan" },
  { id: "058582", name: "Vallecito Dam" },
  { id: "058756", name: "Walden" },
  { id: "058781", name: "Walsenburg 1 NW" },
  { id: "058793", name: "Walsh 1 W" },
  { id: "058839", name: "Waterdale" },
  { id: "058931", name: "Westcliffe" },
  { id: "059243", name: "Wray" },
  { id: "059265", name: "Yampa" },
  { id: "059295", name: "Yuma" },
];

// Calculate GDD from daily max/min temps using base 50°F
// GDD = max(0, ((Tmax + Tmin) / 2) - base)
function calcDailyGDD(tmax, tmin, base = BASE_TEMP) {
  if (tmax === null || tmin === null) return null;
  return Math.max(0, ((tmax + tmin) / 2) - base);
}

async function fetchGDD(stationId) {
  const year = new Date().getFullYear();
  const sdate = `${year}-01-01`;
  const edate = new Date().toISOString().split("T")[0];
  try {
    const res = await fetch(ACIS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sid: stationId,
        sdate,
        edate,
        elems: [{ name: "maxt" }, { name: "mint" }],
        output: "json"
      })
    });
    const json = await res.json();
    if (!json.data || !json.data.length) return null;

    let cumGDD = 0;
    let lastDate = null;
    let lastDaily = null;

    for (const row of json.data) {
      const [date, maxtRaw, mintRaw] = row;
      const tmax = maxtRaw === "M" || maxtRaw === "T" ? null : parseFloat(maxtRaw);
      const tmin = mintRaw === "M" || mintRaw === "T" ? null : parseFloat(mintRaw);
      const daily = calcDailyGDD(tmax, tmin);
      if (daily !== null) {
        cumGDD += daily;
        lastDate = date;
        lastDaily = daily;
      }
    }

    if (lastDate === null) return null;
    return {
      date: lastDate,
      gdd: Math.round(cumGDD * 10) / 10,
      daily: Math.round(lastDaily * 10) / 10,
    };
  } catch { return null; }
}

function unsubToken(email) { return Buffer.from(email.toLowerCase().trim()).toString("base64"); }

function buildEmailHtml(sub, stationResults, appUrl) {
  const tableRows = stationResults.map(({ name, data: d }) =>
    d
      ? `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;">${name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-family:Arial,sans-serif;">${d.gdd} DD</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-family:Arial,sans-serif;">${d.daily} DD</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-family:Arial,sans-serif;color:#6b7280;">${d.date}</td>
         </tr>`
      : `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;">${name}</td>
          <td colspan="3" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;color:#9ca3af;">No data available</td>
         </tr>`
  ).join("");

  const table = `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
    <thead><tr style="background-color:#166534;color:#ffffff;">
      <th style="padding:10px 12px;text-align:left;">Station</th>
      <th style="padding:10px 12px;text-align:center;">Cumul. GDD (degree days)</th>
      <th style="padding:10px 12px;text-align:center;">Daily GDD (degree days)</th>
      <th style="padding:10px 12px;text-align:center;">Date</th>
    </tr></thead>
    <tbody>${tableRows}</tbody>
  </table>`;

  const unsubLink = appUrl
    ? `<a href="${appUrl}#unsubscribe=${encodeURIComponent(unsubToken(sub.email))}" style="color:#6b7280;">Unsubscribe</a>`
    : "";

  return `<!DOCTYPE html>
  <html>
  <body style="font-family:Arial,sans-serif;color:#1f2937;padding:20px;max-width:700px;margin:0 auto;">
    <h2 style="color:#166534;">🌱 Growing Degree Day Tracker</h2>
    <p>Hello ${sub.name},</p>
    <p>Here is your daily GDD report for <strong>${new Date().toLocaleDateString("en-US")}</strong> (Base Temp: ${BASE_TEMP}°F, accumulated from Jan 1):</p>
    ${table}
    <p style="margin-top:24px;font-size:13px;color:#6b7280;">
      Data sourced from <a href="https://climate.colostate.edu/gdd.html" style="color:#166534;">Colorado Climate Center GDD Tool</a> via NWS COOP stations.
    </p>
    <p style="font-size:12px;color:#9ca3af;margin-top:8px;">${unsubLink}</p>
  </body>
  </html>`;
}

export default async function handler(req, res) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const appUrl = process.env.APP_URL;
  const subscribersJson = process.env.SUBSCRIBERS;

  if (!resendApiKey) {
    return res.status(500).json({ error: "Missing RESEND_API_KEY environment variable." });
  }

  let subscribers = [];
  try { subscribers = JSON.parse(subscribersJson || "[]"); } catch (e) {
    return res.status(500).json({ error: "Failed to parse SUBSCRIBERS variable.", detail: e.message });
  }

  if (!subscribers.length) {
    return res.status(200).json({ message: "No subscribers. Nothing to send." });
  }

  // Fetch GDD data for all unique stations
  const allStations = [...new Set(subscribers.flatMap(s => s.stations || []))].filter(Boolean);
  const gddCache = {};
  await Promise.all(allStations.map(async sid => { gddCache[sid] = await fetchGDD(sid); }));

  // Send personalized email to each subscriber
  let sent = 0, failed = 0, errors = [];
  for (const sub of subscribers) {
    const stationResults = (sub.stations || []).map(sid => ({
      sid,
      name: STATIONS.find(s => s.id === sid)?.name || sid,
      data: gddCache[sid]
    }));
    const html = buildEmailHtml(sub, stationResults, appUrl);
    try {
      const response = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: sub.email,
          subject: `GDD Daily Report — ${new Date().toLocaleDateString("en-US")}`,
          html
        })
      });
      if (response.ok) {
        sent++;
      } else {
        const errText = await response.text();
        failed++;
        errors.push({ email: sub.email, status: response.status, detail: errText });
      }
    } catch (e) {
      failed++;
      errors.push({ email: sub.email, error: e.message });
    }
  }

  return res.status(200).json({ sent, failed, total: subscribers.length, errors });
}
