import { useState, useEffect } from "react";

const APP_TITLE = "Growing Degree Day Tracker";

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

const ADMIN_PW = "admin123";
const STORAGE_KEY_SUBS = "gdd:subs";
const STORAGE_KEY_EJS = "gdd:ejs";

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

function unsubToken(email) { return btoa(email.toLowerCase().trim()); }
function unsubUrl(appUrl, email) { return `${appUrl}#unsubscribe=${encodeURIComponent(unsubToken(email))}`; }

const Input = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input {...props} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
  </div>
);

const Btn = ({ children, variant = "green", ...props }) => {
  const colors = { green: "bg-green-700 hover:bg-green-800 text-white", blue: "bg-blue-600 hover:bg-blue-700 text-white", gray: "bg-gray-200 hover:bg-gray-300 text-gray-700", red: "bg-red-600 hover:bg-red-700 text-white" };
  return <button {...props} className={`px-4 py-2 rounded-lg font-medium text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${colors[variant]} ${props.className || ""}`}>{children}</button>;
};

const Alert = ({ type, msg }) => (
  <div className={`p-3 rounded-lg text-sm ${type === "success" ? "bg-green-100 text-green-800" : type === "info" ? "bg-blue-50 text-blue-800" : "bg-red-100 text-red-700"}`}>{msg}</div>
);

export default function App() {
  const [page, setPage] = useState("signup");
  const [subscribers, setSubscribers] = useState([]);
  const [form, setForm] = useState({ name: "", company: "", email: "", stations: [] });
  const [formMsg, setFormMsg] = useState(null);
  const [adminPw, setAdminPw] = useState("");
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminErr, setAdminErr] = useState("");
  const [search, setSearch] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [ejsCfg, setEjsCfg] = useState({ serviceId: "", templateId: "", publicKey: "", appUrl: "" });
  const [showCfg, setShowCfg] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState(null);
  const [ready, setReady] = useState(false);
  const [unsubState, setUnsubState] = useState(null);
  const [unsubEmail, setUnsubEmail] = useState("");

  useEffect(() => { init(); }, []);

  function loadFromStorage(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }
  function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function init() {
    const hash = window.location.hash;
    if (hash.startsWith("#unsubscribe=")) {
      try {
        const email = atob(decodeURIComponent(hash.replace("#unsubscribe=", "")));
        setUnsubEmail(email);
        setPage("unsubscribe");
      } catch {}
    }
    const subs = loadFromStorage(STORAGE_KEY_SUBS);
    if (subs) setSubscribers(subs);
    const cfg = loadFromStorage(STORAGE_KEY_EJS);
    if (cfg) setEjsCfg(cfg);
    setReady(true);
  }

  function saveSubs(subs) { setSubscribers(subs); saveToStorage(STORAGE_KEY_SUBS, subs); }
  function saveCfg(cfg) { setEjsCfg(cfg); saveToStorage(STORAGE_KEY_EJS, cfg); }

  function toggleStn(id) { setForm(f => ({ ...f, stations: f.stations.includes(id) ? f.stations.filter(x => x !== id) : [...f.stations, id] })); }

  function handleSignup() {
    if (!form.name || !form.email || !form.stations.length) { setFormMsg({ type: "error", msg: "Please fill in name, email, and select at least one station." }); return; }
    if (subscribers.find(s => s.email.toLowerCase() === form.email.toLowerCase())) { setFormMsg({ type: "error", msg: "This email is already subscribed." }); return; }
    saveSubs([...subscribers, { ...form, id: Date.now().toString() }]);
    setFormMsg({ type: "success", msg: "You're subscribed! You'll receive daily GDD reports." });
    setForm({ name: "", company: "", email: "", stations: [] });
    setSearch("");
  }

  function handleUnsubscribe() {
    const found = subscribers.find(s => s.email.toLowerCase() === unsubEmail.toLowerCase());
    if (!found) { setUnsubState("notfound"); return; }
    saveSubs(subscribers.filter(s => s.email.toLowerCase() !== unsubEmail.toLowerCase()));
    setUnsubState("done");
    window.location.hash = "";
  }

  async function generateReport() {
    setLoadingReport(true); setReportData(null);
    const stns = [...new Set(subscribers.flatMap(s => s.stations))];
    const res = {};
    await Promise.all(stns.map(async sid => { res[sid] = await fetchGDD(sid); }));
    setReportData(res); setLoadingReport(false);
  }

  async function sendEmails() {
    if (!ejsCfg.serviceId || !ejsCfg.templateId || !ejsCfg.publicKey) { setSendMsg({ type: "error", msg: "Configure EmailJS settings first." }); return; }
    if (!reportData) { setSendMsg({ type: "error", msg: "Preview the report first." }); return; }
    setSending(true); setSendMsg(null);
    if (!window.emailjs) {
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
      window.emailjs.init({ publicKey: ejsCfg.publicKey });
    }
    let sent = 0, failed = 0;
    for (const sub of subscribers) {
      const tableRows = sub.stations.map(sid => {
        const d = reportData[sid];
        const nm = STATIONS.find(s => s.id === sid)?.name || sid;
        return d
          ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${nm}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.gdd}°F</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.daily}°F</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.avg}°F</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;color:#6b7280;">${d.date}</td></tr>`
          : `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${nm}</td><td colspan="4" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#9ca3af;">No data available</td></tr>`;
      }).join("");
      const stationTable = `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        <thead><tr style="background-color:#166534;color:#ffffff;">
          <th style="padding:10px 12px;text-align:left;">Station</th>
          <th style="padding:10px 12px;text-align:center;">Cumul. GDD</th>
          <th style="padding:10px 12px;text-align:center;">Daily GDD</th>
          <th style="padding:10px 12px;text-align:center;">Hist. Avg</th>
          <th style="padding:10px 12px;text-align:center;">Date</th>
        </tr></thead>
        <tbody>${tableRows}</tbody>
      </table>`;
      const unsubLink = ejsCfg.appUrl
        ? `<a href="${unsubUrl(ejsCfg.appUrl, sub.email)}" style="color:#6b7280;">Unsubscribe</a>`
        : "(set App URL in admin config to enable unsubscribe links)";
      try {
        await window.emailjs.send(ejsCfg.serviceId, ejsCfg.templateId, {
          to_email: sub.email, to_name: sub.name,
          report_date: new Date().toLocaleDateString(),
          station_data: stationTable,
          unsubscribe_link: unsubLink
        });
        sent++;
      } catch { failed++; }
    }
    setSending(false);
    setSendMsg({ type: sent > 0 ? "success" : "error", msg: `✅ Sent: ${sent} | ❌ Failed: ${failed}` });
  }

  const filtered = STATIONS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  if (!ready) return <div className="flex items-center justify-center h-screen text-gray-400">Loading…</div>;

  if (page === "unsubscribe") return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow p-8 max-w-sm w-full text-center space-y-4">
        <div className="text-4xl">🌱</div>
        <h2 className="text-xl font-bold text-gray-800">Unsubscribe</h2>
        {!unsubState && <>
          <p className="text-gray-500 text-sm">Are you sure you want to unsubscribe <strong>{unsubEmail}</strong> from daily GDD reports?</p>
          <div className="flex gap-3 justify-center">
            <Btn variant="red" onClick={handleUnsubscribe}>Yes, Unsubscribe</Btn>
            <Btn variant="gray" onClick={() => { setPage("signup"); window.location.hash = ""; }}>Cancel</Btn>
          </div>
        </>}
        {unsubState === "done" && <><Alert type="success" msg={`${unsubEmail} has been unsubscribed.`} /><Btn variant="gray" onClick={() => setPage("signup")} className="mt-2">Back to Sign Up</Btn></>}
        {unsubState === "notfound" && <><Alert type="error" msg="This email wasn't found in our subscriber list." /><Btn variant="gray" onClick={() => setPage("signup")} className="mt-2">Back to Sign Up</Btn></>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex items-center justify-between shadow">
        <div>
          <div className="font-bold text-lg tracking-tight">🌱 {APP_TITLE}</div>
          <div className="text-green-300 text-xs">CoAgMet Growing Degree Days</div>
        </div>
        <div className="flex gap-2">
          {["signup", "admin"].map(p => (
            <button key={p} onClick={() => setPage(p)} className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${page === p ? "bg-white text-green-800" : "hover:bg-green-700"}`}>
              {p === "signup" ? "Sign Up" : "Admin"}
            </button>
          ))}
        </div>
      </nav>

      {page === "signup" && (
        <div className="max-w-xl mx-auto py-10 px-4 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Subscribe to Daily GDD Reports</h1>
            <p className="text-gray-500 text-sm mt-1">Select your CoAgMet stations and receive a daily Growing Degree Days email.</p>
          </div>
          {formMsg && <Alert {...formMsg} />}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" />
              <Input label="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Acme Farms" />
            </div>
            <Input label="Email *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Stations to Monitor * <span className="text-green-600">({form.stations.length} selected)</span></label>
                {form.stations.length > 0 && <button onClick={() => setForm(f => ({ ...f, stations: [] }))} className="text-xs text-red-400 hover:text-red-600">Clear all</button>}
              </div>
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID…" />
              <div className="mt-2 border rounded-lg overflow-y-auto max-h-52 divide-y">
                {filtered.map(s => (
                  <label key={s.id} className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-green-50 ${form.stations.includes(s.id) ? "bg-green-50" : ""}`}>
                    <input type="checkbox" checked={form.stations.includes(s.id)} onChange={() => toggleStn(s.id)} className="accent-green-600" />
                    <span className="text-sm text-gray-700 flex-1">{s.name}</span>
                    <span className="text-xs text-gray-400">{s.id}</span>
                  </label>
                ))}
                {!filtered.length && <div className="text-center text-gray-400 py-4 text-sm">No stations match.</div>}
              </div>
            </div>
            <Btn onClick={handleSignup} className="w-full py-2.5">Subscribe</Btn>
          </div>
        </div>
      )}

      {page === "admin" && (
        <div className="max-w-4xl mx-auto py-10 px-4">
          {!adminAuth ? (
            <div className="max-w-sm mx-auto bg-white rounded-xl shadow p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Admin Login</h2>
              {adminErr && <Alert type="error" msg={adminErr} />}
              <Input type="password" value={adminPw} onChange={e => setAdminPw(e.target.value)} placeholder="Password" />
              <Btn onClick={() => { if (adminPw === ADMIN_PW) { setAdminAuth(true); setAdminErr(""); } else setAdminErr("Incorrect password."); }} className="w-full">Login</Btn>
              <p className="text-xs text-gray-400 text-center">Default password: <code>admin123</code></p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
                <Btn variant="gray" onClick={() => setShowCfg(!showCfg)}>⚙️ EmailJS Config</Btn>
              </div>

              {showCfg && (
                <div className="bg-white rounded-xl shadow p-5 space-y-3">
                  <h3 className="font-semibold text-gray-800">EmailJS Configuration</h3>
                  <p className="text-xs text-gray-500">Sign up at <a href="https://emailjs.com" target="_blank" rel="noreferrer" className="text-green-600 underline">emailjs.com</a>. Template variables: <code className="bg-gray-100 px-1 rounded">to_name</code>, <code className="bg-gray-100 px-1 rounded">to_email</code>, <code className="bg-gray-100 px-1 rounded">report_date</code>, <code className="bg-gray-100 px-1 rounded">station_data</code>, <code className="bg-gray-100 px-1 rounded">unsubscribe_link</code>.</p>
                  {[["serviceId","Service ID"],["templateId","Template ID"],["publicKey","Public Key"]].map(([k, lbl]) => (
                    <Input key={k} label={lbl} value={ejsCfg[k]} onChange={e => setEjsCfg(c => ({ ...c, [k]: e.target.value }))} placeholder={lbl} />
                  ))}
                  <Input label="App URL (for unsubscribe links)" value={ejsCfg.appUrl} onChange={e => setEjsCfg(c => ({ ...c, appUrl: e.target.value }))} placeholder="https://your-app.vercel.app" />
                  <p className="text-xs text-gray-400">Paste the Vercel URL where this app is hosted.</p>
                  <Btn onClick={() => saveCfg(ejsCfg)}>Save Config</Btn>
                </div>
              )}

              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-semibold text-gray-800 mb-3">Subscribers ({subscribers.length})</h3>
                {!subscribers.length ? (
                  <p className="text-gray-400 text-sm">No subscribers yet.</p>
                ) : (
                  <div className="divide-y">
                    {subscribers.map(s => (
                      <div key={s.id} className="py-3 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 text-sm">{s.name}{s.company ? <span className="text-gray-400 font-normal"> — {s.company}</span> : ""}</div>
                          <div className="text-gray-500 text-xs">{s.email}</div>
                          <div className="text-xs text-green-700 mt-1 truncate">{s.stations.map(sid => STATIONS.find(st => st.id === sid)?.name || sid).join(", ")}</div>
                        </div>
                        <button onClick={() => saveSubs(subscribers.filter(x => x.id !== s.id))} className="text-red-400 hover:text-red-600 text-xs shrink-0 mt-1">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Daily GDD Report</h3>
                  <Btn onClick={generateReport} disabled={loadingReport || !subscribers.length}>{loadingReport ? "Fetching data…" : "Preview Report"}</Btn>
                </div>
                {loadingReport && <div className="text-center text-gray-400 text-sm py-4">Fetching live data from CoAgMet…</div>}
                {reportData && (
                  <div className="bg-gray-50 border rounded-lg p-4 space-y-1">
                    <div className="text-green-800 font-bold text-sm mb-2">📊 Growing Degree Days Report — {new Date().toLocaleDateString()}</div>
                    {Object.entries(reportData).map(([sid, d]) => {
                      const nm = STATIONS.find(s => s.id === sid)?.name || sid;
                      return (
                        <div key={sid} className="text-sm">
                          <span className="font-semibold text-gray-700">{nm}</span>:{" "}
                          {d ? <>Cumul. GDD <span className="text-green-700 font-bold">{d.gdd}°F</span> | Daily <span className="text-blue-700 font-bold">{d.daily}°F</span> | Hist Avg <span className="text-gray-600">{d.avg}°F</span> <span className="text-gray-400 text-xs">({d.date})</span></>
                            : <span className="text-gray-400">No data</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
                {sendMsg && <Alert {...sendMsg} />}
                <Btn variant="blue" onClick={sendEmails} disabled={sending || !reportData || !subscribers.length}>
                  {sending ? "Sending…" : `Send to All Subscribers (${subscribers.length})`}
                </Btn>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}