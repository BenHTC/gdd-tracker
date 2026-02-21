// Vercel Cron Job - runs daily at 7:00 AM Mountain Time (14:00 UTC)
// Fetches GDD data for all subscribers and sends personalized emails via EmailJS

const EMAILJS_SERVICE_URL = "https://api.emailjs.com/api/v1.0/email/send";

async function fetchGDD(sid) {
  const url = `https://coagmet.colostate.edu/data/gdd/${sid.toLowerCase()}.csv?header=yes`;
  try {
    const res = await fetch(url);
    const txt = await res.text();
    const rows = txt.trim().split("\n").slice(2).map(l => {
      const p = l.split(",").map(x => x.replace(/"/g, "").trim());
      return { date: p[1], gdd: parseFloat(p[2]), daily: parseFloat(p[3]), avg: parseFloat(p[4]) };
    }).filter(r => r.daily !== -999 && !isNaN(r.daily));
    return rows.length ? rows[rows.length - 1] : null;
  } catch { return null; }
}

function unsubToken(email) { return Buffer.from(email.toLowerCase().trim()).toString("base64"); }

function buildTable(stationResults, stationNames) {
  const rows = stationResults.map(({ sid, name, data: d }) =>
    d
      ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${name}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.gdd}°F</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.daily}°F</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.avg}°F</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;color:#6b7280;">${d.date}</td></tr>`
      : `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${name}</td><td colspan="4" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#9ca3af;">No data available</td></tr>`
  ).join("");
  return `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
    <thead><tr style="background-color:#166534;color:#ffffff;">
      <th style="padding:10px 12px;text-align:left;">Station</th>
      <th style="padding:10px 12px;text-align:center;">Cumul. GDD</th>
      <th style="padding:10px 12px;text-align:center;">Daily GDD</th>
      <th style="padding:10px 12px;text-align:center;">Hist. Avg</th>
      <th style="padding:10px 12px;text-align:center;">Date</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

export default async function handler(req, res) {
  // Load config from environment variables
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const appUrl = process.env.APP_URL;
  const subscribersJson = process.env.SUBSCRIBERS;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return res.status(500).json({ error: "Missing EmailJS environment variables." });
  }

  let subscribers = [];
  try { subscribers = JSON.parse(subscribersJson || "[]"); } catch {}

  if (!subscribers.length) {
    return res.status(200).json({ message: "No subscribers. Nothing to send." });
  }

  // Fetch GDD data for all unique stations
  const allStations = [...new Set(subscribers.flatMap(s => s.stations))];
  const gddCache = {};
  await Promise.all(allStations.map(async sid => { gddCache[sid] = await fetchGDD(sid); }));

  const STATIONS = [
    { id: "AKR02", name: "Akron" }, { id: "ALT01", name: "Ault" }, { id: "AVN01", name: "Avondale" },
    { id: "BLA01", name: "Blanca" }, { id: "BNV01", name: "Buena Vista" }, { id: "BRG01", name: "Briggsdale" },
    { id: "BRL02", name: "Burlington South" }, { id: "BRL03", name: "Burlington 3" }, { id: "CBL01", name: "Carbondale" },
    { id: "CBN01", name: "Collbran" }, { id: "CCR01", name: "Cherry Creek Reservoir" }, { id: "CHT01", name: "Chatfield" },
    { id: "CKP01", name: "Cherokee Park" }, { id: "CLK01", name: "Clark" }, { id: "CNN01", name: "Canon City" },
    { id: "COW01", name: "Cowdrey" }, { id: "CTR01", name: "Center" }, { id: "CTR02", name: "Center 2" },
    { id: "CTZ01", name: "Cortez" }, { id: "DEN01", name: "Denver" }, { id: "DLR01", name: "Dolores" },
    { id: "DLT01", name: "Delta" }, { id: "DRG01", name: "Durango" }, { id: "DVC01", name: "Dove Creek" },
    { id: "EAC01", name: "Eastern Adams County" }, { id: "EGL01", name: "Eagle" }, { id: "EKT01", name: "Eckert" },
    { id: "FCC01", name: "Christman Field" }, { id: "FCL01", name: "Fort Collins" }, { id: "FRT03", name: "CSU Fruita Exp Station" },
    { id: "FTC01", name: "Fort Collins AERC" }, { id: "FTC03", name: "CSU - ARDEC" }, { id: "FTL01", name: "Fort Lupton" },
    { id: "FWL01", name: "Fowler" }, { id: "GBY01", name: "Granby" }, { id: "GJC01", name: "Grand Junction" },
    { id: "GLY04", name: "Greeley 4" }, { id: "GUN01", name: "Gunnison" }, { id: "GUN02", name: "Gunnison 2" },
    { id: "GYP01", name: "Gypsum" }, { id: "HEB01", name: "Hebron" }, { id: "HLY01", name: "Holly" },
    { id: "HLY02", name: "Holly 2" }, { id: "HNE01", name: "Hoehne" }, { id: "HXT01", name: "Haxtun" },
    { id: "HYD01", name: "Hayden" }, { id: "HYK02", name: "Holyoke" }, { id: "IDL01", name: "Idalia" },
    { id: "IGN01", name: "Ignacio" }, { id: "IGN02", name: "Ignacio 2" }, { id: "ILF01", name: "Iliff" },
    { id: "JFN01", name: "Jefferson" }, { id: "KLN01", name: "Kline" }, { id: "KRK01", name: "Kirk" },
    { id: "KRM01", name: "Kremmling" }, { id: "KSY01", name: "Kersey 1" }, { id: "KSY02", name: "Kersey 2" },
    { id: "LAM01", name: "Lamar 1" }, { id: "LAM03", name: "Lamar 3" }, { id: "LAM04", name: "Lamar 4" },
    { id: "LAR01", name: "Larand" }, { id: "LCN01", name: "Lucerne" }, { id: "LJT01", name: "La Junta" },
    { id: "LMS02", name: "Las Animas 2" }, { id: "LSL01", name: "La Salle" }, { id: "MCL01", name: "McClave" },
    { id: "MKR01", name: "Meeker" }, { id: "MNC01", name: "Mancos" }, { id: "MTR01", name: "Montrose" },
    { id: "NUC01", name: "Nucla" }, { id: "NWD01", name: "Norwood" }, { id: "OTH01", name: "Olathe" },
    { id: "PAI01", name: "Paoli" }, { id: "PAN01", name: "Paonia" }, { id: "PBW01", name: "Pueblo West" },
    { id: "PGS01", name: "Pagosa Springs" }, { id: "PKN01", name: "Punkin Center" }, { id: "PNR01", name: "Penrose" },
    { id: "RFD01", name: "Rocky Ford AVRC" }, { id: "SAN01", name: "San Acacio" }, { id: "SBT01", name: "Seibert" },
    { id: "SLD01", name: "Salida" }, { id: "SLT01", name: "Silt" }, { id: "STG01", name: "Sterling" },
    { id: "STN01", name: "Stratton" }, { id: "TWC01", name: "Towaoc" }, { id: "WCF01", name: "Westcliffe" },
    { id: "WFD01", name: "Wolford Mtn Reservoir" }, { id: "WGG01", name: "Wiggins" }, { id: "WLS01", name: "Walsh" },
    { id: "WRY02", name: "Wray 2" }, { id: "YAM01", name: "Yampa" }, { id: "YJK01", name: "Yellow Jacket" }, { id: "YUM02", name: "Yuma" },
    { id: "BLD01", name: "Boulder SW (NW)" }, { id: "BLD02", name: "Boulder NW (NW)" }, { id: "BRU01", name: "Brush (NW)" },
    { id: "BTD01", name: "Berthoud (NW)" }, { id: "CRK01", name: "Crook (NW)" }, { id: "EAT01", name: "Eaton (NW)" },
    { id: "FTC02", name: "Fort Collins East (NW)" }, { id: "FTC04", name: "Fort Collins Central (NW)" },
    { id: "FTL02", name: "Fort Lupton (NW)" }, { id: "FTM02", name: "Fort Morgan (NW)" }, { id: "GIL01", name: "Gilcrest (NW)" },
    { id: "GLY05", name: "Greeley West (NW)" }, { id: "JCN01", name: "Johnsons Corner (NW)" },
    { id: "LMT01", name: "Longmont South (NW)" }, { id: "LMT02", name: "Longmont West (NW)" }, { id: "LOV01", name: "Loveland (NW)" },
    { id: "OVD01", name: "Ovid (NW)" }, { id: "STG02", name: "Sterling (NW)" }, { id: "WIG01", name: "Wiggins (NW)" },
  ];

  // Send personalized email to each subscriber
  let sent = 0, failed = 0;
  for (const sub of subscribers) {
    const stationResults = sub.stations.map(sid => ({
      sid,
      name: STATIONS.find(s => s.id === sid)?.name || sid,
      data: gddCache[sid]
    }));
    const stationTable = buildTable(stationResults);
    const unsubLink = appUrl
      ? `<a href="${appUrl}#unsubscribe=${encodeURIComponent(unsubToken(sub.email))}" style="color:#6b7280;">Unsubscribe</a>`
      : "";
    try {
      const response = await fetch(EMAILJS_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey,
          template_params: {
            to_email: sub.email,
            to_name: sub.name,
            report_date: new Date().toLocaleDateString("en-US"),
            station_data: stationTable,
            unsubscribe_link: unsubLink
          }
        })
      });
      if (response.ok) sent++; else failed++;
    } catch { failed++; }
  }

  return res.status(200).json({ sent, failed, total: subscribers.length });
}
