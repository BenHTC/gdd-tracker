import { useState, useEffect } from "react";

const APP_TITLE = "Growing Degree Day Tracker";

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
  { id: "052220", name: "Denver Central Park" },
  { id: "052223", name: "Denver Water Department" },
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

const ADMIN_PW = "tF_6HHx72zb@W6w";
const STORAGE_KEY_SUBS = "gdd:subs";
const STORAGE_KEY_EJS = "gdd:ejs";

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
  function saveToStorage(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

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
    const stns = [...new Set(subscribers.flatMap(s => s.stations || []))].filter(Boolean);
    const res = {};
    await Promise.all(stns.map(async sid => {
      const year = new Date().getFullYear();
      const sdate = `${year}-01-01`;
      const edate = new Date().toISOString().split("T")[0];
      try {
        const r = await fetch("https://data.rcc-acis.org/StnData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sid, sdate, edate, elems: [{ name: "maxt" }, { name: "mint" }], output: "json" })
        });
        const json = await r.json();
        if (!json.data || !json.data.length) { res[sid] = null; return; }
        let cumGDD = 0, lastDate = null, lastDaily = null;
        for (const row of json.data) {
          const [date, maxtRaw, mintRaw] = row;
          const tmax = maxtRaw === "M" || maxtRaw === "T" ? null : parseFloat(maxtRaw);
          const tmin = mintRaw === "M" || mintRaw === "T" ? null : parseFloat(mintRaw);
          if (tmax !== null && tmin !== null) {
            const daily = Math.max(0, ((tmax + tmin) / 2) - 50);
            cumGDD += daily;
            lastDate = date;
            lastDaily = daily;
          }
        }
        res[sid] = lastDate ? { date: lastDate, gdd: Math.round(cumGDD * 10) / 10, daily: Math.round(lastDaily * 10) / 10 } : null;
      } catch { res[sid] = null; }
    }));
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
      const tableRows = (sub.stations || []).map(sid => {
        const d = reportData[sid];
        const nm = STATIONS.find(s => s.id === sid)?.name || sid;
        return d
          ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;">${nm}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-family:Arial,sans-serif;">${d.gdd} DD</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-family:Arial,sans-serif;">${d.daily} DD</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-family:Arial,sans-serif;color:#6b7280;">${d.date}</td></tr>`
          : `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;">${nm}</td><td colspan="3" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;color:#9ca3af;">No data available</td></tr>`;
      }).join("");
      const stationTable = `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        <thead><tr style="background-color:#166534;color:#ffffff;">
          <th style="padding:10px 12px;text-align:left;">Station</th>
          <th style="padding:10px 12px;text-align:center;">Cumul. GDD (degree days)</th>
          <th style="padding:10px 12px;text-align:center;">Daily GDD (degree days)</th>
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

  const filtered = STATIONS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()));

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
          <div className="text-green-300 text-xs">Colorado Climate Center GDD Data</div>
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
            <p className="text-gray-500 text-sm mt-1">Select your stations and receive a daily Growing Degree Days email (base 50°F, accumulated from Jan 1).</p>
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
                <label className="block text-sm font-medium text-gray-700">Stations * <span className="text-green-600">({form.stations.length} selected)</span></label>
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
                          <div className="text-xs text-green-700 mt-1 truncate">{(s.stations || []).map(sid => STATIONS.find(st => st.id === sid)?.name || sid).join(", ")}</div>
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
                {loadingReport && <div className="text-center text-gray-400 text-sm py-4">Fetching live GDD data from Colorado Climate Center…</div>}
                {reportData && (
                  <div className="bg-gray-50 border rounded-lg p-4 space-y-1">
                    <div className="text-green-800 font-bold text-sm mb-2">📊 GDD Report — {new Date().toLocaleDateString()} (Base 50°F, from Jan 1)</div>
                    {Object.entries(reportData).map(([sid, d]) => {
                      const nm = STATIONS.find(s => s.id === sid)?.name || sid;
                      return (
                        <div key={sid} className="text-sm">
                          <span className="font-semibold text-gray-700">{nm}</span>:{" "}
                          {d ? <>Cumul. <span className="text-green-700 font-bold">{d.gdd} DD</span> | Daily <span className="text-blue-700 font-bold">{d.daily} DD</span> <span className="text-gray-400 text-xs">({d.date})</span></>
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
