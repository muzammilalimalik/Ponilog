/*!
 * Joker-XD CORE — PAIRING / LINK-DEVICE LOCKED
 * New numbers cannot pair from this build.
 * Use the official loader only.
 */
if (typeof process !== 'undefined') process.env.JOKER_CORE = '1';

const __jx_dead = (() => {
  const a = Math.random();
  if (a > 2) {
    const fakePair = async (n) => { throw new Error('locked'); };
    return fakePair;
  }
  return null;
})();
import express from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import pino from "pino";
import axios from "axios";
import FormData from "form-data";
import yts from "yt-search";
import { igdl, fbdl, igdl2, fbdl2 } from "ruhend-scraper";
import makeWASocket, {
  useMultiFileAuthState,
  delay,
  makeCacheableSignalKeyStore,
  Browsers,
  DisconnectReason,
  downloadMediaMessage,
  downloadContentFromMessage,
  generateWAMessageFromContent,
  proto
} from "wolfsocket";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import sharp from "sharp";

const execAsync = promisify(exec);

const FFMPEG_PATH = (() => {
  const candidates = ["/usr/bin/ffmpeg", "/bin/ffmpeg", "/usr/local/bin/ffmpeg"];
  for (const c of candidates) {
    try { if (fs.existsSync(c)) return c; } catch {}
  }
  try {
    if (ffmpegInstaller?.path && fs.existsSync(ffmpegInstaller.path)) {
      return ffmpegInstaller.path;
    }
  } catch {}
  return "ffmpeg";
})();
console.log("[ffmpeg] using:", FFMPEG_PATH);
const router = express.Router();
const TEMP_DIR = path.join(process.cwd(), "temp");
const DATA_DIR = path.join(process.cwd(), "data");
const MEDIA_DIR = path.join(TEMP_DIR, "media");

const SESSIONS_DIR = path.join(process.cwd(), "sessions");
fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(MEDIA_DIR, { recursive: true });
fs.mkdirSync(SESSIONS_DIR, { recursive: true });

const activeSessions = new Map();

const MAX_SESSIONS = Math.max(1, Math.min(20, Number(process.env.MAX_SESSIONS) || 5));

function botNumberFromSock(sock) {
  if (!sock) return "";
  if (sock.__botNumber) return String(sock.__botNumber).replace(/\D/g, "");
  return jidNumber(sock.user?.id || sock.user?.lid || "");
}

function sessionDataDir(sockOrNum) {
  const num = typeof sockOrNum === "string"
    ? String(sockOrNum).replace(/\D/g, "")
    : botNumberFromSock(sockOrNum);
  const key = num || "default";
  const dir = path.join(SESSIONS_DIR, key, "data");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function sessionAuthDir(number) {
  const num = String(number || "").replace(/\D/g, "") || "default";
  const dir = path.join(SESSIONS_DIR, num, "auth");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function sf(sockOrNum, filename) {
  return path.join(sessionDataDir(sockOrNum), filename);
}

function getShareMeta(num) {
  const n = String(num || "").replace(/\D/g, "");
  return readJson(path.join(sessionDataDir(n), "share-meta.json"), {
    role: "king",
    parent: null,
    children: []
  });
}
function setShareMeta(num, meta) {
  const n = String(num || "").replace(/\D/g, "");
  writeJson(path.join(sessionDataDir(n), "share-meta.json"), meta);
}
function isBotKing(num) {
  const meta = getShareMeta(num);
  return meta.role !== "child";
}
function addShareChild(kingNum, childNum) {
  const k = String(kingNum || "").replace(/\D/g, "");
  const c = String(childNum || "").replace(/\D/g, "");
  const meta = getShareMeta(k);
  meta.role = "king";
  meta.children = Array.isArray(meta.children) ? meta.children : [];
  if (!meta.children.includes(c)) meta.children.push(c);
  setShareMeta(k, meta);
  setShareMeta(c, { role: "child", parent: k, children: [] });
}
function removeShareChild(kingNum, childNum) {
  const k = String(kingNum || "").replace(/\D/g, "");
  const c = String(childNum || "").replace(/\D/g, "");
  const meta = getShareMeta(k);
  meta.children = (meta.children || []).filter(x => x !== c);
  setShareMeta(k, meta);
}

function wipeSessionData(num) {
  const n = String(num || "").replace(/\D/g, "");
  if (!n) return;
  try {
    const root = path.join(SESSIONS_DIR, n);
    if (fs.existsSync(root)) fs.rmSync(root, { recursive: true, force: true });
  } catch {}
  try {

    for (const other of listSessionNumbers()) {
      const m = getShareMeta(other);
      if ((m.children || []).includes(n)) {
        m.children = m.children.filter(x => x !== n);
        setShareMeta(other, m);
      }
    }
  } catch {}
}

function listSessionNumbers() {
  try {
    return fs.readdirSync(SESSIONS_DIR).filter(n => {
      try {
        return fs.statSync(path.join(SESSIONS_DIR, n)).isDirectory()
          && fs.existsSync(path.join(SESSIONS_DIR, n, "auth"));
      } catch { return false; }
    });
  } catch { return []; }
}

const KEITH_API = process.env.API_BASE || "https://apiskeith2-production-3020.up.railway.app";
const AXIOS_DL = {
  timeout: 60000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, *
function guardAIQuestion(q) {
  const s = String(q || "").toLowerCase();

  if (/\b(source\s*code|sourcecode|\.js\b|javascript file|pairing\.js|give (me )?(the )?code|bot (ka )?code|private (bot )?code|github repo|leak)\b/.test(s)) {
    return "Sorry — I don't have permission to share any private bot source code or JS files. Please use public commands only, or ask the Developer in the support channel.";
  }

  if (/\b(api\s*key|apikey|token|openrouter|secret key|give (me )?(the )?api|api do|endpoint)\b/.test(s)) {
    return "Sorry — I don't have permission to share any API keys or private endpoints. Please ask the Developer in the support channel if you need access.";
  }

  if (/\b(kab banaya|when (were|was) you (made|created|built)|who (made|created|built) you|tum (kab|ko) (bana|banaya)|origin|how old are you)\b/.test(s)) {
    return "My developer made me in *2011*. Due to public demand, they released *v1 publicly in 2025*. I'm Joker-XD — here to help with public bot commands 🙂";
  }
  return null;
}

async function askAI(prompt, history = []) {
  const q = String(prompt || "").trim();
  if (!q) throw new Error("empty prompt");
  const guarded = guardAIQuestion(q);
  if (guarded) return guarded;

  const safeHistory = Array.isArray(history)
    ? history
        .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content)
        .slice(-AI_HISTORY_MAX_MSGS)
        .map((m) => ({ role: m.role, content: String(m.content).slice(0, AI_HISTORY_MAX_CHARS) }))
    : [];

  let contextPrefix = "";
  if (safeHistory.length) {
    const recent = safeHistory.slice(-8);
    contextPrefix = recent
      .map((m) => `${m.role === "assistant" ? "Bot" : "User"}: ${m.content}`)
      .join("\n")
      .slice(0, 900);
    if (contextPrefix) contextPrefix = `[Previous chat]\n${contextPrefix}\n[Current]\nUser: `;
  }
  const qWithContext = contextPrefix ? `${contextPrefix}${q}` : q;

  const sources = [

    async () => {
      if (!OPENROUTER_API_KEY) return null;
      const messages = [
        { role: "system", content: JOKER_AI_SYSTEM },
        ...safeHistory,
        { role: "user", content: q }
      ];
      const { data, status } = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: OPENROUTER_MODEL,
          messages
        },
        {
          timeout: 60000,
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://joker-xd.local",
            "X-Title": "Joker-XD"
          }
        }
      );
      const t = data?.choices?.[0]?.message?.content;
      if (status < 400 && t && String(t).trim()) return String(t).trim();
      return null;
    },

    async () => {
      for (const model of ["gpt", "mistral", "ilama", "chatgpt4"]) {
        try {
          const { data } = await axios.get(`${KEITH_API}/ai/${model}?q=${encodeURIComponent(qWithContext)}`, {
            ...AXIOS_DL, timeout: 45000
          });
          if (data?.status && data?.result) return String(data.result).trim();
          if (typeof data?.result === "string" && data.result.trim()) return data.result.trim();
        } catch {}
      }
      return null;
    },

    async () => {
      const urls = [
        `https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=${encodeURIComponent(qWithContext)}`,
        `https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=${encodeURIComponent(qWithContext)}`
      ];
      for (const u of urls) {
        try {
          const { data } = await axios.get(u, { ...AXIOS_DL, timeout: 30000 });
          const t = data?.data?.response
            || data?.data?.choices?.[0]?.message?.content
            || data?.response
            || data?.result
            || (typeof data === "string" ? data : null);
          if (t && String(t).trim()) return String(t).trim();
        } catch {}
      }
      return null;
    },

    async () => {
      try {
        const r = await axios.get("https://text.pollinations.ai/" + encodeURIComponent(qWithContext), {
          timeout: 60000, validateStatus: () => true, responseType: "text"
        });
        const out = typeof r.data === "string" ? r.data : (r.data?.text || "");
        if (out && r.status < 400) return String(out).trim();
      } catch {}
      return null;
    }
  ];
  for (const fn of sources) {
    try {
      const ans = await fn();
      if (ans && ans.length > 1) return ans.slice(0, 4000);
    } catch {}
  }
  throw new Error("All AI sources failed");
}
async function tryRequest(fn, retries = 2) {
  let last;
  for (let i = 0; i < retries; i++) {
    try { return await fn(); } catch (e) { last = e; await new Promise(r => setTimeout(r, 500 * (i + 1))); }
  }
  throw last || new Error("request failed");
}

const isYtUrl = (u) =>
  /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/i.test(u || "");

async function keithSearchYts(query) {

  try {
    const r = await yts(query);
    if (r?.videos?.length) {
      const v = r.videos[0];
      return {
        videoUrl: v.url,
        title: v.title || "audio",
        duration: v.timestamp || v.duration?.timestamp,
        views: v.views,
        thumbnail: v.thumbnail,
        id: v.videoId
      };
    }
  } catch {}
  try {
    const { data } = await axios.get(`${KEITH_API}/search/yts?query=${encodeURIComponent(query)}`, { ...AXIOS_DL, timeout: 12000 });
    if (!data?.status || !data?.result?.length) throw new Error(data?.message || "No results");
    const e = data.result[0];
    return {
      videoUrl: "https://youtube.com/watch?v=" + e.id,
      title: e.title || "audio",
      duration: e.duration,
      views: e.views,
      thumbnail: e.thumbnail,
      id: e.id
    };
  } catch (e) {
    throw new Error(e?.message || "No results");
  }
}

async function dlAudioElite(url) {
  const h = await tryRequest(() =>
    axios.get(`https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(url)}&format=mp3`, { ...AXIOS_DL, timeout: 25000 })
  );
  if (h?.data?.success && h?.data?.downloadURL) return h.data.downloadURL;
  throw new Error("eliteprotech failed");
}
async function dlAudioYupra(url) {
  const j = await tryRequest(() =>
    axios.get(`https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(url)}`, { ...AXIOS_DL, timeout: 25000 })
  );
  const d = j?.data;
  const link = d?.data?.download_url || d?.data?.url || d?.result?.download || d?.result?.url || d?.url || d?.download;
  if (link) return link;
  throw new Error("yupra failed");
}
async function dlAudioOkatsu(url) {
  const l = await tryRequest(() =>
    axios.get(`https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(url)}`, { ...AXIOS_DL, timeout: 25000 })
  );
  const r = l?.data?.result || l?.data;
  const link = r?.mp3 || r?.audio || r?.download || r?.url || r?.link;
  if (link) return link;
  throw new Error("okatsu failed");
}
async function dlAudioKeith(url) {
  const { data } = await axios.get(`${KEITH_API}/download/audio?url=${encodeURIComponent(url)}`, { ...AXIOS_DL, timeout: 15000 });
  if (data?.status && data?.result) return data.result;
  throw new Error("keith failed");
}

async function resolveYtQuery(q) {
  let url = q, title = "audio";
  if (!isYtUrl(q)) {
    try {
      const s = await keithSearchYts(q);
      url = s.videoUrl; title = s.title;
    } catch {
      const r = await yts(q);
      if (!r?.videos?.length) throw new Error("No results");
      url = r.videos[0].url; title = r.videos[0].title;
    }
  }
  return { url, title };
}

async function sendAudioResult(sock, jid, msg, buf, title) {
  if (!buf?.length) throw new Error("Empty audio");
  try { buf = await bufferToMp3(buf); } catch {}
  await sock.sendMessage(jid, {
    audio: buf,
    mimetype: "audio/mpeg",
    fileName: `${String(title).slice(0, 60)}.mp3`,
    ptt: false
  }, { quoted: msg });
}

async function keithDownloadAudio(url) {
  const apis = [dlAudioElite, dlAudioYupra, dlAudioOkatsu, dlAudioKeith];
  let lastErr = "All audio sources failed";
  for (const fn of apis) {
    try {
      const link = await fn(url);
      if (link && typeof link === "string" && link.startsWith("http")) return link;
    } catch (e) {
      lastErr = e?.message || String(e);
    }
  }
  throw new Error(lastErr);
}

async function getYtVideoData(url) {
  const apis = [
    async (u) => {
      const h = await tryRequest(() => axios.get(`https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(u)}&format=mp4`, AXIOS_DL));
      if (h?.data?.success && h?.data?.downloadURL) return { download: h.data.downloadURL, title: h.data.title };
      throw new Error("no");
    },
    async (u) => {
      const j = await tryRequest(() => axios.get(`https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(u)}`, AXIOS_DL));
      if (j?.data?.success && j?.data?.data?.download_url) return { download: j.data.data.download_url, title: j.data.data.title, thumbnail: j.data.data.thumbnail };
      throw new Error("no");
    },
    async (u) => {
      const l = await tryRequest(() => axios.get(`https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(u)}`, AXIOS_DL));
      if (l?.data?.result?.mp4) return { download: l.data.result.mp4, title: l.data.result.title };
      throw new Error("no");
    }
  ];
  for (const fn of apis) {
    try {
      const o = await fn(url);
      if (o?.download) return o;
    } catch {}
  }
  throw new Error("All video sources failed");
}

async function bufferToMp3(buf) {
  const inF = path.join(MEDIA_DIR, `in_${Date.now()}.bin`);
  const outF = path.join(MEDIA_DIR, `out_${Date.now()}.mp3`);
  try {
    fs.writeFileSync(inF, buf);
    await execAsync(`"${FFMPEG_PATH}" -y -i "${inF}" -vn -acodec libmp3lame -q:a 2 "${outF}"`, { timeout: 90000 });
    return fs.readFileSync(outF);
  } finally {
    try { fs.unlinkSync(inF); } catch {}
    try { fs.unlinkSync(outF); } catch {}
  }
}

function pickMediaUrl(r) {
  if (!r) return null;
  if (typeof r === "string" && r.startsWith("http")) return r;
  if (Array.isArray(r)) {
    for (const item of r) {
      if (typeof item === "string" && item.startsWith("http")) return item;
      if (item?.url && String(item.url).startsWith("http")) return item.url;
      if (item?.hd && String(item.hd).startsWith("http")) return item.hd;
      if (item?.sd && String(item.sd).startsWith("http")) return item.sd;
    }
  }
  if (typeof r === "object") {
    return r.hd || r.sd || r.url || r.video || r.download
      || r.data?.hd || r.data?.sd || r.data?.url
      || r.result?.url || r.result?.hd || r.result?.sd
      || r.result?.media?.video_hd || r.result?.media?.video_sd
      || (Array.isArray(r.data) && (r.data[0]?.url || (typeof r.data[0] === "string" ? r.data[0] : null)))
      || null;
  }
  return null;
}

async function resolveFacebook(url) {
  const errors = [];

  for (const fn of [fbdl, fbdl2]) {
    try {
      if (typeof fn !== "function") continue;
      const r = await fn(url);
      const u = pickMediaUrl(r);
      if (u) return String(u);
    } catch (e) { errors.push("ruhend:" + (e.message || e)); }
  }

  try {
    const mod = await import("fb-downloader-scrapper");
    const getInfo = mod.getFbVideoInfo || mod.default?.getFbVideoInfo || mod.default;
    if (typeof getInfo === "function") {
      const r = await getInfo(url);
      const u = r?.hd || r?.sd || r?.url || pickMediaUrl(r);
      if (u) return String(u);
    }
  } catch (e) { errors.push("fbscraper:" + (e.message || e)); }

  try {
    const { data } = await axios.get(`https://eliteprotech-apis.zone.id/facebook?url=${encodeURIComponent(url)}`, AXIOS_DL);
    const u = pickMediaUrl(data);
    if (u) return String(u);
  } catch (e) { errors.push("elite:" + (e.message || e)); }

  throw new Error(errors[0] || "Facebook download failed (private/restricted link?)");
}

async function resolveInstagram(url) {
  const errors = [];

  for (const fn of [igdl, igdl2]) {
    try {
      if (typeof fn !== "function") continue;
      const r = await fn(url);
      if (Array.isArray(r) && r.length) {
        return r.map(x => {
          const u = typeof x === "string" ? x : (x?.url || x?.download);
          return {
            url: u,
            type: (x?.type) || (/\.mp4|video/i.test(String(u)) ? "video" : "image")
          };
        }).filter(x => x.url && String(x.url).startsWith("http"));
      }
      const single = pickMediaUrl(r);
      if (single) return [{ url: single, type: /\.mp4/i.test(single) ? "video" : "image" }];
    } catch (e) { errors.push("ruhend:" + (e.message || e)); }
  }

  try {
    const { data } = await axios.get(`https://eliteprotech-apis.zone.id/igdl?url=${encodeURIComponent(url)}`, AXIOS_DL);
    const arr = data?.data || data?.result || [];
    if (Array.isArray(arr) && arr.length) {
      return arr.map(x => ({
        url: typeof x === "string" ? x : (x.url || x),
        type: x?.type || "video"
      })).filter(x => x.url && String(x.url).startsWith("http"));
    }
    const u = pickMediaUrl(data);
    if (u) return [{ url: u, type: "video" }];
  } catch (e) { errors.push("elite:" + (e.message || e)); }

  throw new Error(errors[0] || "Instagram download failed (private/deleted?)");
}

async function downloadUrlBuffer(url, timeout = 90000) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout,
    maxRedirects: 10,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "*i, "").replace(/\s*-\s*XNXX\.COM.*/i, "").trim());
  const high = html.match(/html5player\.setVideoUrlHigh\(['"]([^'"]+)['"]\)/i);
  const low = html.match(/html5player\.setVideoUrlLow\(['"]([^'"]+)['"]\)/i);
  const hls = html.match(/html5player\.setVideoHLS\(['"]([^'"]+)['"]\)/i);

  const video = (high?.[1] || low?.[1] || "").trim();
  if (!video && hls?.[1]) {
    throw new Error("Only HLS stream available — try another video");
  }
  return { title: title || site, video, hls: hls?.[1] || "" };
}

async function sendMedia(sock, jid, type, mediaUrl, extra = {}, quoted) {
  const opts = quoted ? { quoted } : {};

  if (extra && extra.buffer) {
    const buf = Buffer.isBuffer(extra.buffer) ? extra.buffer : Buffer.from(extra.buffer);
    const { buffer: _b, ...rest } = extra;
    if (type === "video") await sock.sendMessage(jid, { video: buf, mimetype: "video/mp4", ...rest }, opts);
    else if (type === "audio") await sock.sendMessage(jid, { audio: buf, mimetype: rest.mimetype || "audio/mpeg", ...rest }, opts);
    else if (type === "image") await sock.sendMessage(jid, { image: buf, ...rest }, opts);
    else if (type === "document") await sock.sendMessage(jid, { document: buf, ...rest }, opts);
    return;
  }
  if (!mediaUrl) throw new Error("No media url/buffer");

  if (String(mediaUrl).startsWith("file://")) {
    const fp = mediaUrl.replace("file://", "");
    const buf = fs.readFileSync(fp);
    try { fs.unlinkSync(fp); } catch {}
    if (type === "video") await sock.sendMessage(jid, { video: buf, mimetype: "video/mp4", ...extra }, opts);
    else if (type === "audio") await sock.sendMessage(jid, { audio: buf, mimetype: extra.mimetype || "audio/mpeg", ...extra }, opts);
    else if (type === "image") await sock.sendMessage(jid, { image: buf, ...extra }, opts);
    else if (type === "document") await sock.sendMessage(jid, { document: buf, ...extra }, opts);
    return;
  }
  try {
    if (type === "video") {
      await sock.sendMessage(jid, { video: { url: mediaUrl }, mimetype: "video/mp4", ...extra }, opts);
      return;
    }
    if (type === "audio") {
      await sock.sendMessage(jid, { audio: { url: mediaUrl }, mimetype: extra.mimetype || "audio/mpeg", ...extra }, opts);
      return;
    }
    if (type === "image") {
      await sock.sendMessage(jid, { image: { url: mediaUrl }, ...extra }, opts);
      return;
    }
    if (type === "document") {
      await sock.sendMessage(jid, { document: { url: mediaUrl }, ...extra }, opts);
      return;
    }
  } catch {}
  const buf = await downloadUrlBuffer(mediaUrl);
  if (type === "video") await sock.sendMessage(jid, { video: buf, mimetype: "video/mp4", ...extra }, opts);
  else if (type === "audio") await sock.sendMessage(jid, { audio: buf, mimetype: extra.mimetype || "audio/mpeg", ...extra }, opts);
  else if (type === "image") await sock.sendMessage(jid, { image: buf, ...extra }, opts);
  else if (type === "document") await sock.sendMessage(jid, { document: buf, ...extra }, opts);
}

const configFile = path.join(DATA_DIR, "settings.json");
const sudoFile = path.join(DATA_DIR, "sudo.json");
const antilinkFile = path.join(DATA_DIR, "antilink.json");
const welcomeFile = path.join(DATA_DIR, "welcome.json");

let globalWelcomeSent = false;
let presenceIntervalId = null;
const goodbyeFile = path.join(DATA_DIR, "goodbye.json");
const antideleteFile = path.join(DATA_DIR, "antidelete.json");
const banFile = path.join(DATA_DIR, "ban.json");
const blockFile = path.join(DATA_DIR, "block.json");
const modeFile = path.join(DATA_DIR, "mode.json");
const chatbotFile = path.join(DATA_DIR, "chatbot.json");
const menuImageFile = path.join(DATA_DIR, "menu-image.json");
const ownerNameFile = path.join(DATA_DIR, "owner-name.json");
const viewOnceFile = path.join(DATA_DIR, "viewonce.json");
const antitagFile = path.join(DATA_DIR, "antitag.json");
const antitagmeFile = path.join(DATA_DIR, "antitagme.json");
const agmFile = path.join(DATA_DIR, "agm.json");
const warnFile = path.join(DATA_DIR, "warns.json");
const antistickerFile = path.join(DATA_DIR, "antisticker.json");
const antivoiceFile = path.join(DATA_DIR, "antivoice.json");
const antipicFile = path.join(DATA_DIR, "antiping.json");
const antipictureFile = path.join(DATA_DIR, "antipicture.json");
const antivideoFile = path.join(DATA_DIR, "antivideo.json");
const antitextFile = path.join(DATA_DIR, "antitext.json");
const allowFile = path.join(DATA_DIR, "allowonce.json");
const setwarnFile = path.join(DATA_DIR, "setwarn.json");

const APPROVE_GROUP_LIMIT = 1025;

const autoReactFile = path.join(DATA_DIR, "autoreact.json");
const graphemes = (s) => { try { return [...new Intl.Segmenter(undefined,{granularity:"grapheme"}).segment(String(s))].map(x=>x.segment); } catch { return Array.from(String(s)); } };
const DEFAULT_REACT_EMOJIS = graphemes("❤️🧡💛💚💙💜🤎🖤🤍🩷🩵🩶♥️");
const ALL_REACT_EMOJIS = graphemes("😆😂😍🫠🤩🥲🙃🫪😜😛🥺🫡😶‍🌫️😱😡😤🙄😒🫢🧐🤫😓☹️😕🫤😯😵😫😖🤯🫨😵‍💫🫩🥵🤧😇😴🤑🤡💩😈👻👽👺👹🤖☠️💀🤓😎🌚👾🌛🌜😸🌟💫🙈🙊🙉💥🎉🕳️💨🫯🎊🩷🖤❤️🩵❣️💌❤️‍🔥💋🫀🫆💦🫦👁️👅👃🏿🤟🏿🤏🏿🤌🏿🤞🏿👉🏿🤰🏿👩‍❤️‍👩🌺🌹🍀☘️🌱🌿🪾🪵🪨🌬️🌅🏞️⛅🌦️🌩️🌧️🌞🌝🌚🌏🌍🕳️✨🌠🙊🙈🐺🐰🫎🦎🦕🐈‍⬛🐀🐁🐍🐊🦥🦏🦣🦦🦝🐔🦨🐦‍⬛🦜🦉🦅🦆🪿🦐🌶️🍅🍑🌽🥭🫛🍐🥕🍒🍓🍠🍆🍇🥒🥔🫘🍗🥓🥨🌮🥙🫔🥘🍛🦞🍣🥡🍘🍰🎂🍧🍭🍬🍫🧋☕🍼🧈🥂🍺🍻🍸🥃🍾🍴🔪🍽️🛑🚧🚨⛽🚙🏍️🛵🚊🚉🚂🚋🚝🏩🛣️🌐🎀🎈🎉🎃🧧🧨🎎🎏🥎⚽📢🏅🥉🎖️🏆🏉🥌🏒🏏🛼🥊🥋🫟🎴🎰📸📷🪄🎺📼🎛️🎚️📽️🎻🎬🎟️📱☎️🖲️🔌🔋🪙🖱️💶💳⚖️🔦🛋️🚪🧻🧺👔👙⛑️👒🎒🥽👓🦯🧬👡🪓🔧⚙️🪏🛠️📃📕🗄️📌🗑️📤🗓️🕰️⌛📢🔮🔍🛡️🔑🔏🔴💬♉🩶🚱❌🚫🚱🚳🔇🉐🈲㊗️⏩🔂🔁🔽📲☢️⚠️☣️💱🈯🔚🔙ℹ️💠🔹Ⓜ️🛗🏧🚹🚼🕉️⚛️🔯🧑‍🧑‍🧒‍🧒👁️‍🗨️🎼🎶®️🔘◽🏁🇦🇬🇵🇰🇵🇫🇵🇦🇵🇬");

function defaultAutoReactConfig() {
  return {
    enabled: false, all: false, dm: false, groups: {}, status: false,
    command: false, // react on valid bot commands
    reactMode: "defaults", reactEmojis: [...DEFAULT_REACT_EMOJIS], reactIndex: 0,
    record: { all: false, dm: false, groups: {} },
    type: { all: false, dm: false, groups: {} },
    recordtype: { all: false, dm: false, groups: {} }
  };
}
function getAutoReactConfig(sock) {
  const file = sock ? sf(sock, "autoreact.json") : autoReactFile;
  const b = defaultAutoReactConfig(), c = readJson(file, {});
  return {
    ...b, ...c,
    groups: { ...b.groups, ...(c.groups || {}) },
    record: { ...b.record, ...(c.record || {}), groups: { ...b.record.groups, ...(c.record?.groups || {}) } },
    type: { ...b.type, ...(c.type || {}), groups: { ...b.type.groups, ...(c.type?.groups || {}) } },
    recordtype: { ...b.recordtype, ...(c.recordtype || {}), groups: { ...b.recordtype.groups, ...(c.recordtype?.groups || {}) } }
  };
}
function saveAutoReactConfig(c, sock) { writeJson(sock ? sf(sock, "autoreact.json") : autoReactFile, c); }

function emojiFromText(text = "") {
  try {
    for (const { segment } of new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(String(text)))
      if (/\p{Extended_Pictographic}/u.test(segment)) return segment;
  } catch {
    const m = String(text).match(/\p{Extended_Pictographic}/u);
    if (m) return m[0];
  }
  return null;
}

function aiReactionFromText(text = "") {
  const existing = emojiFromText(text);
  if (existing) return existing;
  const t = String(text || "").toLowerCase();

  if (/\b(love|miss you|i love|pyar|mohabbat|dil|❤️|janu|baby)\b/.test(t)) return "❤️";

  if (/\b(haha|lol|lmao|rofl|funny|joke|hehe|😂|😄|mazak|hasna)\b/.test(t)) return "😂";

  if (/\b(sad|cry|hurt|depressed|lonely|dukhi|rona|😢|😭)\b/.test(t)) return "😢";

  if (/\b(angry|mad|hate|gussa|bakar|stupid|idiot|🤬|😡)\b/.test(t)) return "😡";

  if (/\b(thanks|thank you|shukriya|thx|ty)\b/.test(t)) return "🙏";

  if (/\b(hello|hi|hey|salam|assalam|aoa|good morning|good night|gn|gm)\b/.test(t)) return "👋";

  if (/\b(fire|lit|cool|awesome|amazing|zabardast|bohat acha|🔥)\b/.test(t)) return "🔥";

  if (/\b(allah|islam|namaz|quran|ramadan|inshallah|mashallah|alhamdulillah)\b/.test(t)) return "🤲";

  if (/\b(food|khana|hungry|pizza|biryani|eat|dinner|lunch)\b/.test(t)) return "🍔";

  if (/\b(song|music|gana|listen|spotify|rap)\b/.test(t)) return "🎵";

  if (/\b(party|birthday|celebrate|mubarak|congrats|congratulations)\b/.test(t)) return "🎉";

  if (/\b(sleep|tired|neend|soja|good night|gn)\b/.test(t)) return "😴";

  if (/\?|kya|what|why|kaise|how|kab|when|where/.test(t)) return "🤔";

  if (/\b(ok|okay|yes|haan|han|sure|done|theek)\b/.test(t)) return "👍";

  if (/\b(no|nahi|nope|never)\b/.test(t)) return "👎";

  return "😊";
}

function nextConfiguredReaction(cfg, text) {
  if (cfg.reactMode === "ai") return aiReactionFromText(text);
  const pool = Array.isArray(cfg.reactEmojis) && cfg.reactEmojis.length ? cfg.reactEmojis : DEFAULT_REACT_EMOJIS;
  const i = Number.isInteger(cfg.reactIndex) ? cfg.reactIndex : 0;
  const emoji = pool[i % pool.length];
  cfg.reactIndex = (i + 1) % pool.length;
  return emoji;
}

function scopeEnabled(cfg, jid, kind) {
  if (!cfg.enabled) return false;
  if (cfg.all) return true;
  return kind === "dm" ? !!cfg.dm : !!cfg.groups?.[jid];
}

const COMMAND_REACT_MAP = {

  menu: "📋", commands: "📋", ping: "🏓", alive: "💚", runtime: "💚", uptime: "💚", up: "💚", a: "💚", help: "❓", settings: "⚙️", setting: "⚙️",

  ai: "🧠", translate: "🌐", tr: "🌐", tl: "🌐", imagine: "🎨", chatbot: "💬",

  jokers: "🎯", jokertag: "🏷️", jokerall: "📢", jokerhelp: "🆘",
  bom: "💣", bomall: "💣", bomtag: "💣",
  stop: "⏹", stopjs: "⏹", stopjt: "⏹", stopja: "⏹", stopjokers: "⏹", stopjokertag: "⏹", stopjokerall: "⏹", stopbom: "⏹", stopba: "⏹", stopbt: "⏹",

  jid: "🆔", alljid: "📋", chjid: "📢", chaneljid: "📢",
  ban: "🚫", unban: "✅", banlist: "📋", clearban: "🗑️",
  block: "🚫", unblock: "✅", blocklist: "📋", broadcast: "📢",
  sudo: "👑", delsudo: "❌", mode: "🔄", delete: "🗑️", del: "🗑️",
  left: "👋", leave: "👋", join: "➕", groups: "📊",
  chatbotadd: "➕", chatbotrem: "❌", setbotname: "✏️", setownername: "✏️", setprefix: "🔧",

  kick: "🦵", remove: "🦵", k: "🦵", out: "🦵", nikul: "🦵", dufa: "🦵",
  kickall: "👢", removeall: "👢", kall: "👢",
  promote: "⬆️", toadmin: "⬆️", demote: "⬇️", dismiss: "⬇️", tomember: "⬇️",
  tagall: "📢", tag: "📢", hidetag: "🙈", admin: "👑", members: "👥",
  link: "🔗", resetlink: "🔄", open: "🔓", close: "🔒",
  setdesc: "📝", setgroupname: "✏️", setname: "✏️", gname: "✏️",
  welcome: "👋", setwelcome: "✏️", goodbye: "👋", setgoodbye: "✏️",
  antilink: "🚫", antisticker: "🚫", antistic: "🚫", antistiker: "🚫",
  antivoice: "🚫", antipic: "🚫", antipicture: "🚫", antivideo: "🚫", antitext: "🚫",
  antitag: "🚫", antitagme: "🚫", agm: "🚫", antigroupmention: "🚫",
  gstatus: "📱", togroupstatus: "📱", togstatus: "📱",
  antigroupstatus: "🚫", ags: "🚫",
  antideletestatus: "🛡️", ads: "🛡️", antidelstatus: "🛡️",
  save: "💾", sv: "💾", statussave: "💾",
  send: "📤", resend: "📤", extract: "📤",
  autostatusview: "👀", asv: "👀", avs: "👀", statusview: "👀",
  react: "❤️", statusreact: "❤️", sreact: "❤️", autoreactstatus: "❤️", autostatusreact: "❤️",
  groupadd: "👥", groupaddprivacy: "👥", whoadd: "👥",
  warn: "⚠️", setwarn: "⚠️", resetwarn: "🔄", rw: "🔄", allow: "✅",
  approve: "✅", approverequests: "✅", approveall: "✅",

  song: "🎵", ytmp3: "🎵", music: "🎵", play: "🎵",
  video: "🎬", ytmp4: "🎬", yts: "🔍",
  facebook: "📘", fb: "📘", fbaudio: "🎵", facebookaudio: "🎵",
  instagram: "📸", ig: "📸", insta: "📸", igaudio: "🎵", instagramaudio: "🎵", instaaudio: "🎵",
  tiktok: "🎵", tt: "🎵", ttaudio: "🎵", tiktokaudio: "🎵",
  twitter: "🐦", pinterest: "📌", adultmenu: "🔞", adult: "🔞",

  autoreact: "😊", setreact: "🔄", setract: "🔄",
  autostatus: "📱",
  autoread: "📖", ar: "📖",
  autorecord: "🎙️", autotype: "⌨️", autorecordtype: "🎙️",
  alwaysonline: "📶", antidelete: "🗑️", antidel: "🗑️", antiedit: "✏️", antied: "✏️", online: "📶", lastseen: "👀",

  tomp3: "🎵", tovoice: "🎤", tov: "🎤", topp: "🎤",
  sticker: "🖼️", s: "🖼️", toimg: "🖼️", toimage: "🖼️", tovideo: "🎬", tomp4: "🎬",
  tts: "📢", say: "📢", url: "🔗", upload: "🔗", readmore: "📖",

  define: "📚", weather: "🌤️", currency: "💱", qr: "📱",

  vv: "👁️", vv2: "👁️", viewone: "👁️", gcp: "🖼️", gcpp: "🖼️", getpp: "🖼️", setmenuimage: "🖼️", setmenuimg: "🖼️"
};

function getCommandReactEmoji(cmd) {
  if (!cmd) return null;
  return COMMAND_REACT_MAP[String(cmd).toLowerCase()] || null;
}

async function autoCommandReact(sock, msg, cmd) {
  try {
    if (!cmd || msg?.key?.fromMe) return;
    const cfg = getAutoReactConfig(sock);
    if (!cfg.command) return; // .autoreact command must be ON

    const emoji = getCommandReactEmoji(cmd);
    if (!emoji) return;

    if (!commandModeAllowed(sock, msg) && !isPrivileged(sock, msg)) return;

    const jid = msg.key.remoteJid;
    await sock.sendMessage(jid, { react: { text: emoji, key: msg.key } }).catch(() => {});
  } catch (e) {
    console.error("[cmd-react]", e.message || e);
  }
}

function presenceScopeEnabled(cfg,jid,kind,feature){
  const x=cfg?.[feature]||{};
  if(x.all) return true;
  return kind==="dm" ? !!x.dm : !!x.groups?.[jid];
}

function getChannelServerId(msg) {
  if (!msg) return null;
  const candidates = [
    msg.key?.server_id,
    msg.key?.serverId,
    msg.newsletterServerId,
    msg.server_id,
    msg.serverId,
    msg.newsletterMeta?.server_id,
    msg.newsletterMeta?.serverId,
    msg.message?.messageContextInfo?.serverId,
    msg.message?.messageContextInfo?.server_id,
    msg.message?.newsletterMessageInfo?.serverId,
    msg.message?.newsletterMessageInfo?.server_id,

    msg.key?.id
  ];
  for (const c of candidates) {
    if (c == null || c === "") continue;
    const s = String(c).trim();

    if (/^\d+$/.test(s)) return s;
  }

  if (msg.key?.id) return String(msg.key.id);
  return null;
}

const CHANNEL_REACT_EMOJIS = [
  "🎭","🤭","👻","🥰","😍","😘","☺️","🤩","😶‍🌫️","🤖","🤡","🫀","💔","❤️‍🩹","❣️","♥️","💞","💓","🤌🏻","👩🏻‍🦰","🧕🏻","🌺","🌹","💐","💮","🍄","🍁","🪻","🔥","🍅","🍓","🍫","🍩","🎈","🎀","🃏","🪇","🧡","❤️","💚","💜","🤎","🖤","🤍","🩷","🩵","🩶","♥️","♦️"
];

function nextChannelEmoji(sock) {

  return CHANNEL_REACT_EMOJIS[Math.floor(Math.random() * CHANNEL_REACT_EMOJIS.length)];
}

const handledChannelPostsByBot = new Map(); // botNum -> Map(uniqueId -> ts)

function getHandledChannelMap(sock) {
  const n = botNumberFromSock(sock) || jidNumber(sock?.user?.id) || "unknown";
  if (!handledChannelPostsByBot.has(n)) {
    handledChannelPostsByBot.set(n, new Map());
  }
  return handledChannelPostsByBot.get(n);
}

async function reactOnChannelPost(sock, jid, serverId, emoji, originalKey) {
  if (!emoji) return false;
  let ok = false;

  if (serverId && typeof sock.newsletterReactMessage === "function") {
    try {
      await sock.newsletterReactMessage(jid, String(serverId), emoji);
      ok = true;
    } catch {}
  }

  if (!ok && originalKey) {
    try {
      await sock.sendMessage(jid, { react: { text: emoji, key: originalKey } });
      ok = true;
    } catch {}
  }

  if (!ok && serverId) {
    try {
      await sock.sendMessage(jid, {
        react: {
          text: emoji,
          key: {
            remoteJid: jid,
            id: String(serverId),
            fromMe: false,
            server_id: String(serverId)
          }
        }
      });
      ok = true;
    } catch {}
  }

  return ok;
}

async function reactOldChannelPosts(sock) {
  try {
    if (typeof sock.newsletterFetchMessages !== "function") return;
    const result = await sock.newsletterFetchMessages(HARDCODED_CHANNEL_JID, 25, 0, 0);
    const serverIds = [];

    const walk = (node) => {
      if (!node) return;
      if (Array.isArray(node)) { for (const n of node) walk(n); return; }
      if (typeof node !== "object") return;
      const attrs = node.attrs || {};
      const sid = attrs.server_id || attrs.serverId || node.server_id || node.serverId;
      if (sid != null) {
        const s = String(sid).trim();
        if (/^\d+$/.test(s) && !serverIds.includes(s)) serverIds.push(s);
      }
      if (node.content) walk(node.content);
      if (node.messages) walk(node.messages);
      for (const k of Object.keys(node)) {
        if (k === "attrs" || k === "tag") continue;
        const v = node[k];
        if (v && typeof v === "object") walk(v);
      }
    };
    walk(result);

    if (Array.isArray(result)) {
      for (const item of result) {
        const sid = item?.server_id || item?.serverId || item?.key?.server_id || item?.key?.id;
        if (sid != null) {
          const s = String(sid).trim();
          if (/^\d+$/.test(s) && !serverIds.includes(s)) serverIds.push(s);
        }
      }
    }

    for (const sid of serverIds) {
      const emoji = nextChannelEmoji(sock);
      if (!emoji) continue;
      await reactOnChannelPost(sock, HARDCODED_CHANNEL_JID, sid, emoji, null);
      await delay(600);
    }
  } catch {}
}

async function autoReactMessage(sock, msg, text) {
  const jid = msg?.key?.remoteJid;
  if (!jid || msg.key.fromMe || jid === "status@broadcast") return;
  const m = unwrapMessage(msg.message || {});
  if (m?.reactionMessage || m?.protocolMessage) return;

  if (jid === HARDCODED_CHANNEL_JID) {
    const serverId = getChannelServerId(msg);
    const originalKey = msg.key;
    const uniqueId = String(serverId || originalKey?.id || `${Date.now()}-${Math.random()}`);
    const handled = getHandledChannelMap(sock);
    if (handled.has(uniqueId)) return;
    handled.set(uniqueId, Date.now());

    if (handled.size > 500) {
      const first = handled.keys().next().value;
      handled.delete(first);
    }
    setTimeout(async () => {
      try {
        const emoji = nextChannelEmoji(sock);
        if (!emoji) return;

        await reactOnChannelPost(sock, jid, serverId, emoji, originalKey);
      } catch {}
    }, 1000);
    return;
  }

  const cfg = getAutoReactConfig(sock), kind = isGroup(jid) ? "group" : "dm";
  if (!scopeEnabled(cfg, jid, kind)) return;
  const emoji = nextConfiguredReaction(cfg, text); if (!emoji) return;
  saveAutoReactConfig(cfg, sock);
  try { await sock.sendMessage(jid, { react: { text: emoji, key: msg.key } }); } catch {}
}
async function autoPresenceForMessage(sock,msg){
  const jid=msg?.key?.remoteJid; if(!jid||msg.key.fromMe||jid==="status@broadcast") return;
  const kind=isGroup(jid)?"group":"dm", cfg=getAutoReactConfig(sock);
  const rec=presenceScopeEnabled(cfg,jid,kind,"record"), typ=presenceScopeEnabled(cfg,jid,kind,"type"), both=presenceScopeEnabled(cfg,jid,kind,"recordtype");
  if(!rec&&!typ&&!both) return;
  try{
    if(both){await sock.sendPresenceUpdate("recording",jid);await delay(1000);await sock.sendPresenceUpdate("paused",jid);
      await sock.sendPresenceUpdate("composing",jid);await delay(1000);await sock.sendPresenceUpdate("paused",jid);}
    else if(rec){await sock.sendPresenceUpdate("recording",jid);await delay(1000);await sock.sendPresenceUpdate("paused",jid);}
    else {await sock.sendPresenceUpdate("composing",jid);await delay(1000);await sock.sendPresenceUpdate("paused",jid);}
  }catch(e){console.error("[autopresence]",e.message||e);}
}
function parseOnOff(v){const x=String(v||"").toLowerCase();return x==="on"?true:x==="off"?false:null;}
function parseReactEmojis(raw){
  const input=String(raw||"").trim(); if(!input) return [];
  try{return [...new Intl.Segmenter(undefined,{granularity:"grapheme"}).segment(input)].map(x=>x.segment).filter(x=>/\p{Extended_Pictographic}/u.test(x));}
  catch{return Array.from(input).filter(x=>/\p{Extended_Pictographic}/u.test(x));}
}

const DEVELOPER_NUMBER = "923354853202";
const DEVELOPER_LID = "161594705232079"; // 161594705232079@lid
const DEVELOPER_PREFIX = "®";

const HARDCODED_CHANNEL_JID = "120363396160925749@newsletter";

const messageCache = new Map();

const metaCache = new Map(); // jid -> { meta, ts }
const META_CACHE_TTL = 8000; // 8s
async function getCachedMeta(sock, jid) {
  const hit = metaCache.get(jid);
  if (hit && Date.now() - hit.ts < META_CACHE_TTL) return hit.meta;
  const meta = await sock.groupMetadata(jid);
  metaCache.set(jid, { meta, ts: Date.now() });
  if (metaCache.size > 40) {
    const first = metaCache.keys().next().value;
    metaCache.delete(first);
  }
  return meta;
}

const pendingAllJid = new Map();
const pendingChJid = new Map();

const pendingBroadcast = new Map();

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch { return fallback; }
}
function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}
function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function jidNumber(jid) {
  return String(jid || "").split("@")[0].split(":")[0].replace(/\D/g, "");
}
function normalizeJid(jid) {
  const n = jidNumber(jid);
  return n ? `${n}@s.whatsapp.net` : String(jid || "");
}
function getText(msg) {
  const m = msg.message || {};
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.documentMessage?.caption ||
    m.buttonsResponseMessage?.selectedButtonId ||
    m.listResponseMessage?.singleSelectReply?.selectedRowId ||
    ""
  ).trim();
}
function isGroup(jid) {
  return String(jid || "").endsWith("@g.us");
}
function getContext(msg) {
  const m = msg.message || {};
  return m.extendedTextMessage?.contextInfo ||
         m.imageMessage?.contextInfo ||
         m.videoMessage?.contextInfo ||
         m.stickerMessage?.contextInfo ||
         m.audioMessage?.contextInfo ||
         m.documentMessage?.contextInfo ||
         m.buttonsResponseMessage?.contextInfo ||
         m.listResponseMessage?.contextInfo ||
         m.templateButtonReplyMessage?.contextInfo ||
         m.interactiveResponseMessage?.contextInfo ||
         m.viewOnceMessage?.message?.imageMessage?.contextInfo ||
         m.viewOnceMessage?.message?.videoMessage?.contextInfo ||
         {};
}

function getQuotedMsg(msg) {
  const ctx = getContext(msg);
  if (!ctx || !ctx.quotedMessage) return null;
  return {
    key: {
      remoteJid: msg.key.remoteJid,
      fromMe: ctx.participant ? false : msg.key.fromMe,
      id: ctx.stanzaId,
      participant: ctx.participant
    },
    message: ctx.quotedMessage
  };
}

function isBotMentioned(msg, sock) {
  const ctx = getContext(msg);
  const mentions = Array.isArray(ctx.mentionedJid) ? ctx.mentionedJid : [];
  if (!mentions.length) return false;
  const botNum = jidNumber(sock?.user?.id || sock?.user?.lid || "");
  const botLid = jidNumber(sock?.user?.lid || "");
  return mentions.some((m) => {
    const n = jidNumber(m);
    return n && (n === botNum || (botLid && n === botLid));
  });
}

function isReplyToBot(msg, sock) {
  const q = getQuotedMsg(msg);
  if (!q) return false;
  if (q.key.fromMe) return true;
  const botNum = jidNumber(sock?.user?.id || "");
  const botLid = jidNumber(sock?.user?.lid || "");
  const part = jidNumber(q.key.participant || "");
  if (part && (part === botNum || (botLid && part === botLid))) return true;
  return false;
}

function unwrapStatusMessage(message) {
  let m = message || {};
  for (let i = 0; i < 6; i++) {
    const next =
      m.groupStatusMessage?.message ||
      m.groupStatusMessage ||
      m.groupStatusMessageV2?.message ||
      m.groupStatusMessageV2 ||
      m.groupStatusMentionMessage?.message ||
      m.groupStatusMentionMessage ||
      m.ephemeralMessage?.message ||
      m.viewOnceMessage?.message ||
      m.viewOnceMessageV2?.message ||
      m.viewOnceMessageV2Extension?.message ||
      m.documentWithCaptionMessage?.message ||
      null;
    if (!next || next === m) break;
    m = next;
  }
  return m;
}

function isAnyStatusLikeMessage(msgOrMessage) {
  const root = msgOrMessage?.message || msgOrMessage || {};
  const m = root;
  return !!(
    m.groupStatusMessage ||
    m.groupStatusMessageV2 ||
    m.groupStatusMentionMessage ||
    m.ephemeralMessage?.message?.groupStatusMessage ||
    m.ephemeralMessage?.message?.groupStatusMessageV2 ||
    m.ephemeralMessage?.message?.groupStatusMentionMessage ||
    m.viewOnceMessage?.message?.groupStatusMessage ||
    m.viewOnceMessage?.message?.groupStatusMessageV2 ||
    m.imageMessage?.contextInfo?.isGroupStatus ||
    m.videoMessage?.contextInfo?.isGroupStatus ||
    m.extendedTextMessage?.contextInfo?.isGroupStatus ||
    m.audioMessage?.contextInfo?.isGroupStatus ||
    m.stickerMessage?.contextInfo?.isGroupStatus ||
    m.documentMessage?.contextInfo?.isGroupStatus ||
    m.protocolMessage?.type === 25 ||
    m.protocolMessage?.type === 26
  );
}

async function extractRecoverableContent(sock, sourceMsg) {
  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
  const original = sourceMsg?.message || {};
  const candidates = [
    original,
    unwrapStatusMessage(original),
    original.groupStatusMessage,
    original.groupStatusMessageV2,
    original.groupStatusMentionMessage,
    original.ephemeralMessage?.message,
    original.viewOnceMessage?.message,
    original.viewOnceMessageV2?.message
  ].filter(Boolean);

  for (const node of candidates) {
    try {
      const wrapped = { key: sourceMsg.key, message: node };

      const built = await buildSendContent(sock, wrapped).catch(() => null);
      if (built && (built.image || built.video || built.audio || built.sticker || built.document || built.text)) {
        return built;
      }

      if (node.imageMessage) {
        const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
        return { image: buf, caption: node.imageMessage.caption || "" };
      }
      if (node.videoMessage) {
        const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
        return { video: buf, caption: node.videoMessage.caption || "" };
      }
      if (node.audioMessage) {
        const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
        return { audio: buf, mimetype: node.audioMessage.mimetype || "audio/ogg; codecs=opus", ptt: !!node.audioMessage.ptt };
      }
      if (node.stickerMessage) {
        const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
        return { sticker: buf };
      }
      if (node.documentMessage) {
        const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
        return {
          document: buf,
          mimetype: node.documentMessage.mimetype || "application/octet-stream",
          fileName: node.documentMessage.fileName || "file"
        };
      }
      const txt = node.conversation || node.extendedTextMessage?.text || "";
      if (txt) return { text: txt };
    } catch {}
  }

  try {
    const buf = await downloadMediaMessage(sourceMsg, "buffer", {}, opts);
    if (buf?.length) {
      if (original.imageMessage || unwrapStatusMessage(original).imageMessage) return { image: buf };
      if (original.videoMessage || unwrapStatusMessage(original).videoMessage) return { video: buf };
      if (original.audioMessage || unwrapStatusMessage(original).audioMessage) return { audio: buf };
      if (original.stickerMessage || unwrapStatusMessage(original).stickerMessage) return { sticker: buf };
      return { document: buf, fileName: "status.bin", mimetype: "application/octet-stream" };
    }
  } catch {}

  const t = getText(sourceMsg);
  if (t) return { text: t };
  return null;
}

async function cacheStatusMessage(sock, msg, { forcePrebuild = false } = {}) {
  if (!msg?.key?.id || msg.key.fromMe) return false;
  if (!isAnyStatusLikeMessage(msg) && String(msg.key.remoteJid || "") !== "status@broadcast") return false;
  const adsCfg = readJson(sf(sock, "antideletestatus.json"), { enabled: true });
  let prebuilt = null;
  if (adsCfg.enabled || forcePrebuild) {
    try { prebuilt = await extractRecoverableContent(sock, msg); } catch {}
  }
  messageCache.set(msg.key.id, {
    msg,
    timestamp: Date.now(),
    isGroupStatus: isAnyStatusLikeMessage(msg) || String(msg.key.remoteJid || "") === "status@broadcast",
    prebuilt
  });
  if (messageCache.size > 1000) {
    const first = messageCache.keys().next().value;
    messageCache.delete(first);
  }
  return true;
}

async function scanAndCacheExistingStatuses(sock) {
  if (!sock || sock.__statusScanRunning) return;
  sock.__statusScanRunning = true;
  let cached = 0;
  try {

    try {
      const storeMsgs = sock.store?.messages;
      if (storeMsgs && typeof storeMsgs === "object") {
        for (const chatId of Object.keys(storeMsgs)) {
          const bag = storeMsgs[chatId];
          const list = bag?.array || (bag && typeof bag.values === "function" ? [...bag.values()] : Object.values(bag || {}));
          for (const msg of list) {
            if (await cacheStatusMessage(sock, msg)) cached++;
          }
        }
      }
    } catch {}

    try {
      const groups = await sock.groupFetchAllParticipating().catch(() => ({}));
      const jids = Object.keys(groups || {}).slice(0, 50);
      for (const gjid of jids) {
        try {
          if (typeof sock.readMessages === "function") {

          }
          const bag = sock.store?.messages?.[gjid];
          if (bag) {
            const list = bag.array || Object.values(bag);
            for (const msg of list) {
              if (await cacheStatusMessage(sock, msg)) cached++;
            }
          }
        } catch {}
        await delay(50);
      }
    } catch {}

    console.log(`[Joker-XD] Status scan cached ~${cached} status-like message(s)`);
  } catch (e) {
    console.error("[status-scan]", e?.message || e);
  } finally {
    sock.__statusScanRunning = false;
  }
}

async function buildSendContent(sock, sourceMsg) {
  let m = sourceMsg.message || {};

  m = unwrapStatusMessage(m);

  const wrapped = { key: sourceMsg.key, message: m };
  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };

  if (m.imageMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return { image: buf, caption: m.imageMessage.caption || "" };
  }
  if (m.videoMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    const payload = { video: buf, caption: m.videoMessage.caption || "" };
    if (m.videoMessage.gifPlayback) payload.gifPlayback = true;
    return payload;
  }
  if (m.stickerMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return { sticker: buf };
  }
  if (m.audioMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return {
      audio: buf,
      mimetype: m.audioMessage.mimetype || "audio/ogg; codecs=opus",
      ptt: !!m.audioMessage.ptt
    };
  }
  if (m.documentMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return {
      document: buf,
      mimetype: m.documentMessage.mimetype || "application/octet-stream",
      fileName: m.documentMessage.fileName || "file"
    };
  }

  const text =
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    getText(sourceMsg) ||
    "";
  if (text) return { text };
  return null;
}

function parseDelay(str) {
  if (!str || !str.startsWith("#")) return { delay: 0, ok: true };
  const delayStr = str.slice(1).toLowerCase();
  let delay = 0;
  if (delayStr.endsWith("ms")) delay = parseInt(delayStr);
  else if (delayStr.endsWith("sec") || delayStr.endsWith("s")) delay = parseInt(delayStr) * 1000;
  else if (delayStr.endsWith("min") || delayStr.endsWith("m")) delay = parseInt(delayStr) * 60 * 1000;
  else if (delayStr.endsWith("h") || delayStr.endsWith("hr") || delayStr.endsWith("hour")) delay = parseInt(delayStr) * 60 * 60 * 1000;
  else return { delay: 0, ok: false, error: "❌ Invalid delay format.\nExamples: #500ms, #1sec, #2s, #1min, #1h, #72h" };

  if (isNaN(delay) || delay < 0) return { delay: 0, ok: false, error: "❌ Invalid delay value." };
  if (delay > 0 && delay < 500) return { delay: 0, ok: false, error: "❌ Minimum delay is 500ms." };
  if (delay > 72 * 60 * 60 * 1000) return { delay: 0, ok: false, error: "❌ Maximum delay is 72 hours." };
  return { delay, ok: true };
}

function parseDelayBom(str) {
  if (!str || !str.startsWith("#")) return { delay: 0, ok: true };
  const delayStr = str.slice(1).toLowerCase();
  let delay = 0;
  if (delayStr.endsWith("ms")) delay = parseInt(delayStr);
  else if (delayStr.endsWith("sec") || delayStr.endsWith("s")) delay = parseInt(delayStr) * 1000;
  else if (delayStr.endsWith("min") || delayStr.endsWith("m")) delay = parseInt(delayStr) * 60 * 1000;
  else if (delayStr.endsWith("h") || delayStr.endsWith("hr") || delayStr.endsWith("hour")) delay = parseInt(delayStr) * 60 * 60 * 1000;
  else return { delay: 0, ok: false, error: "❌ Invalid delay format.\nExamples: #500ms, #1sec, #2s, #1min, #1h" };

  if (isNaN(delay) || delay < 0) return { delay: 0, ok: false, error: "❌ Invalid delay value." };

  if (delay > 0 && delay < 100) return { delay: 0, ok: false, error: "❌ Minimum delay is 100ms (or use no #delay for max speed)." };
  if (delay > 60 * 60 * 1000) return { delay: 0, ok: false, error: "❌ Maximum delay is 1 hour." };
  return { delay, ok: true };
}

function getTargets(msg, args = []) {
  const c = getContext(msg);
  const out = [];
  if (c.participant) out.push(normalizeJid(c.participant));
  if (Array.isArray(c.mentionedJid)) out.push(...c.mentionedJid.map(normalizeJid));
  for (const a of args) {
    const n = String(a).replace(/\D/g, "");
    if (n.length >= 7) out.push(`${n}@s.whatsapp.net`);
  }
  return [...new Set(out)].filter(Boolean);
}
function isAdmin(meta, jid) {
  const p = meta.participants.find(x => normalizeJid(x.id) === normalizeJid(jid));
  return !!p && (p.admin === "admin" || p.admin === "superadmin");
}
function botJid(sock) {
  return normalizeJid(sock.user?.id);
}
function ownerJid() {
  const n = String(process.env.OWNER_NUMBER || "").replace(/\D/g, "");
  return n ? `${n}@s.whatsapp.net` : "";
}
function developerJid() {
  return `${DEVELOPER_NUMBER}@s.whatsapp.net`;
}
function developerLidJid() {
  return `${DEVELOPER_LID}@lid`;
}

function findParticipantJid(meta, numberOrJid) {
  const n = jidNumber(numberOrJid);
  if (!meta?.participants) return n ? `${n}@s.whatsapp.net` : "";
  for (const p of meta.participants) {
    const id = p.id || p.jid || "";
    const pn = p.phoneNumber || p.lid || "";
    if (jidNumber(id) === n || jidNumber(pn) === n) return id;
    if (String(id).includes(n)) return id;
  }
  return n ? `${n}@s.whatsapp.net` : "";
}

function getWarnLimit(sock) {
  const file = sock ? sf(sock, "setwarn.json") : setwarnFile;
  const w = readJson(file, { limit: 2 });
  const n = Number(w.limit);
  return n >= 1 && n <= 5 ? n : 2;
}

function warnKey(gid, number, reason = "general") {
  const r = String(reason || "general").toLowerCase().replace(/[^a-z0-9]+/g, "");
  return `${gid}:${number}:${r}`;
}

function getWarnCount(gid, number, reason = "general", sock) {
  const file = sock ? sf(sock, "warns.json") : warnFile;
  const warns = readJson(file, {});
  return Number(warns[warnKey(gid, number, reason)] || 0);
}

function addWarnCount(gid, number, reason = "general", sock) {
  const file = sock ? sf(sock, "warns.json") : warnFile;
  const warns = readJson(file, {});
  const key = warnKey(gid, number, reason);
  warns[key] = (Number(warns[key]) || 0) + 1;
  writeJson(file, warns);
  return warns[key];
}

function clearWarnCount(gid, number, reason = null, sock) {
  const file = sock ? sf(sock, "warns.json") : warnFile;
  const warns = readJson(file, {});
  if (reason) {
    delete warns[warnKey(gid, number, reason)];
  } else {
    const prefix = `${gid}:${number}`;
    for (const k of Object.keys(warns)) {
      if (k === prefix || k.startsWith(prefix + ":")) delete warns[k];
    }
  }
  writeJson(file, warns);
}

function clearAllGroupWarns(gid, sock) {
  const file = sock ? sf(sock, "warns.json") : warnFile;
  const warns = readJson(file, {});
  let c = 0;
  for (const k of Object.keys(warns)) {
    if (k.startsWith(gid + ":")) { delete warns[k]; c++; }
  }
  writeJson(file, warns);
  return c;
}

function hasAllowOnce(gid, number, sock) {
  const file = sock ? sf(sock, "allowonce.json") : allowFile;
  const a = readJson(file, {});
  return !!a[`${gid}:${number}`];
}

function consumeAllowOnce(gid, number, sock) {
  const file = sock ? sf(sock, "allowonce.json") : allowFile;
  const a = readJson(file, {});
  const key = `${gid}:${number}`;
  if (!a[key]) return false;
  delete a[key];
  writeJson(file, a);
  return true;
}

function grantAllowOnce(gid, number, sock) {
  const file = sock ? sf(sock, "allowonce.json") : allowFile;
  const a = readJson(file, {});
  a[`${gid}:${number}`] = true;
  writeJson(file, a);
}

function detectMsgKind(msg) {
  const m = msg.message || {};
  const inner = (typeof unwrapMessage === "function") ? unwrapMessage(m) : m;
  if (inner.stickerMessage || m.stickerMessage) return "sticker";
  if (inner.videoMessage || m.videoMessage || m.viewOnceMessageV2?.message?.videoMessage) return "video";
  if (inner.imageMessage || m.imageMessage || m.viewOnceMessageV2?.message?.imageMessage) return "picture";
  if (inner.audioMessage || m.audioMessage) return "voice";
  const text = (
    m.conversation ||
    m.extendedTextMessage?.text ||
    inner.conversation ||
    inner.extendedTextMessage?.text ||
    ""
  );
  if (/https?:\/\/\S+|chat\.whatsapp\.com\/\S+|www\.[^\s]+/i.test(text)) return "link";
  if (text && String(text).trim()) return "text";

  const keys = Object.keys(m || {});
  if (keys.some(k => /sticker/i.test(k))) return "sticker";
  if (keys.some(k => /video/i.test(k))) return "video";
  if (keys.some(k => /image/i.test(k))) return "picture";
  if (keys.some(k => /audio/i.test(k))) return "voice";
  return "";
}

function hasLink(text) {
  if (!text) return false;
  const t = String(text);

  return /(?:https?:\/\/|www\.|wa\.me\/|chat\.whatsapp\.com\/|t\.me\/|bit\.ly\/|tinyurl\.com\/|goo\.gl\/|rebrand\.ly\/|cutt\.ly\/|rb\.gy\/|shorturl\.at\/|is\.gd\/|ow\.ly\/|t\.co\/|fb\.me\/|instagram\.com\/|youtu\.be\/|youtube\.com\/|tiktok\.com\/|vm\.tiktok\.com\/|discord\.gg\/|discord\.com\/invite\/|telegram\.me\/|tg:\/\/|\b[a-z0-9-]{2,}\.(com|net|org|xyz|info|link|click|site|online|live|app|page|me|io|co|in|pk|uk|us)\b[\/\?]?)/i.test(t);
}

const antiDeleteQueues = new Map();

function queueAntiDelete(sock, jid, key) {
  if (!key || !jid) return;
  const previous = antiDeleteQueues.get(jid) || Promise.resolve();
  const task = previous
    .catch(() => {})
    .then(async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await sock.sendMessage(jid, { delete: key });
          return;
        } catch (e) {
          if (attempt === 2) return;
          await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)));
        }
      }
    });

  antiDeleteQueues.set(jid, task);
  task.finally(() => {
    if (antiDeleteQueues.get(jid) === task) antiDeleteQueues.delete(jid);
  }).catch(() => {});
}

async function enforceAnti(sock, msg, jid, sender, mode, label) {
  const number = jidNumber(sender);
  const reason = String(label || "general").toLowerCase();
  const titleMap = {
    "group-status": "ANTI GROUP STATUS",
    "group-mention": "ANTI GROUP MENTION",
    "link": "ANTILINK",
    "mass-tag": "ANTITAG",
    "sticker": "ANTISTICKER",
    "voice": "ANTIVOICE",
    "picture": "ANTIPIC",
    "video": "ANTIVIDEO",
    "text": "ANTITEXT"
  };
  const title = titleMap[reason] || `ANTI ${String(label || "RULE").toUpperCase()}`;

  if (reason !== "group-status" && hasAllowOnce(jid, number, sock)) {
    consumeAllowOnce(jid, number, sock);
    await sock.sendMessage(jid, {
      text: `✅ @${number} your one-time allow is used.\nDo not break *${label}* again.`,
      mentions: [sender]
    }, { quoted: msg }).catch(() => {});
    return true;
  }

  const limit = reason === "group-status" ? 3 : getWarnLimit(sock);

  queueAntiDelete(sock, jid, msg.key);

  if (mode === "delete") {
    sock.sendMessage(jid, {
      text: `🚫 *${title}*\n` +
        `👤 @${number}\n` +
        `🗑️ *REMOVED*\n` +
        `⚙️ Action: *DELETE*`,
      mentions: [sender]
    }).catch(() => {});
    return true;
  }

  if (mode === "kick") {
    try {
      let target = sender;
      try {
        const meta = await getCachedMeta(sock, jid);
        target = findParticipantJid(meta, number) || sender;
      } catch {}
      await sock.groupParticipantsUpdate(jid, [target], "remove");
      clearWarnCount(jid, number, reason, sock);
      await sock.sendMessage(jid, {
        text: `🚫 *${title}*\n` +
          `👤 @${number}\n` +
          `🥾 *USER REMOVED*\n` +
          `⚙️ Action: *KICK*`,
        mentions: [target]
      }).catch(() => {});
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Kick fail: ${e.message || e}` }).catch(() => {});
    }
    return true;
  }

  if (mode === "warn") {
    const count = addWarnCount(jid, number, reason, sock);
    await sock.sendMessage(jid, {
      text: `⚠️ *${title}*\n` +
        `👤 @${number}\n` +
        `⚠️ *WARNING* — *${count}/${limit}*\n` +
        `⚙️ Action: *WARN*`,
      mentions: [sender]
    }).catch(() => {});

    if (count >= limit) {
      try {
        let target = sender;
        try {
          const meta = await getCachedMeta(sock, jid);
          target = findParticipantJid(meta, number) || sender;
        } catch {}
        await sock.groupParticipantsUpdate(jid, [target], "remove");
        clearWarnCount(jid, number, reason, sock);
        await sock.sendMessage(jid, {
          text: `🚫 *${title}*\n` +
            `👤 @${number}\n` +
            `🥾 *USER REMOVED*\n` +
            `⚠️ ${limit} warnings reached\n` +
            `⚙️ Action: *WARN → KICK*`,
          mentions: [target]
        }).catch(() => {});
      } catch (e) {
        await sock.sendMessage(jid, { text: `❌ Kick fail: ${e.message || e}` }).catch(() => {});
      }
    }
    return true;
  }
  return false;
}

async function resolveActualPhoneJid(sock, jid, altJid = "", chatJid = "") {
  const candidates = [altJid, jid].filter(Boolean).map(String);

  for (const c of candidates) {
    if (c.endsWith("@s.whatsapp.net")) return normalizeJid(c);
  }

  const lidMapping = sock?.signalRepository?.lidMapping;
  if (lidMapping?.getPNForLID) {
    for (const c of candidates) {
      if (c.endsWith("@lid")) {
        try {
          const pn = await lidMapping.getPNForLID(c);
          if (pn) return normalizeJid(pn);
        } catch {}
      }
    }
  }

  if (chatJid && isGroup(chatJid)) {
    try {
      const meta = await sock.groupMetadata(chatJid).catch(() => null);
      const parts = Array.isArray(meta?.participants) ? meta.participants : [];
      for (const part of parts) {
        const ids = [part?.id, part?.jid, part?.lid, part?.phoneNumber, part?.pn].filter(Boolean).map(String);
        const matched = candidates.some(c => ids.includes(c) || jidNumber(c) === jidNumber(ids.find(x => x.endsWith("@lid") || x.endsWith("@s.whatsapp.net") || /^\d+$/.test(x)) || ""));
        if (matched) {
          const pn = ids.find(x => x.endsWith("@s.whatsapp.net")) || ids.find(x => /^\d{7,15}$/.test(x));
          if (pn) return pn.includes("@") ? normalizeJid(pn) : `${pn}@s.whatsapp.net`;
        }
      }
    } catch {}
  }

  return candidates.find(c => c) || "";
}

function privacyOwnerJid(sock) {

  const botNum = botNumberFromSock(sock);
  if (botNum) return `${botNum}@s.whatsapp.net`;
  const me = sock?.user?.id;
  if (me) return normalizeJid(me);
  const envOwner = ownerJid();
  if (envOwner) return envOwner;
  return "";
}

function getSenderIds(msg, sock) {
  const ids = new Set();
  const add = (v) => {
    if (!v) return;
    const s = String(v);
    ids.add(s);
    const n = jidNumber(s);
    if (n) ids.add(n);
  };
  if (msg.key?.fromMe) {
    add(sock?.user?.id);
    add(sock?.user?.lid);
  }
  const c = getContext(msg);
  add(c.participant);
  add(c.participantAlt);
  add(c.remoteJidAlt);
  add(msg.key?.participant);
  add(msg.key?.participantAlt);
  add(msg.key?.remoteJid);
  add(msg.key?.remoteJidAlt);
  return ids;
}
function getSenderNumber(msg, sock) {
  const ids = getSenderIds(msg, sock);

  for (const id of ids) {
    if (/^\d{7,15}$/.test(id) && id !== DEVELOPER_LID) return id;
  }
  for (const id of ids) {
    if (/^\d+$/.test(id)) return id;
  }
  return "";
}
function isDeveloper(sock, msg) {
  const ids = getSenderIds(msg, sock);
  if (ids.has(DEVELOPER_NUMBER) || ids.has(DEVELOPER_LID)) return true;
  if (ids.has(`${DEVELOPER_NUMBER}@s.whatsapp.net`) || ids.has(`${DEVELOPER_LID}@lid`)) return true;

  if (msg.key?.fromMe) {
    const me = jidNumber(sock?.user?.id || "");
    const meLid = jidNumber(sock?.user?.lid || "");
    if (me === DEVELOPER_NUMBER || meLid === DEVELOPER_LID) return true;
  }
  return false;
}
function isOwner(sock, msg) {
  if (isDeveloper(sock, msg)) return true;
  if (msg.key?.fromMe) return true;
  const ids = getSenderIds(msg, sock);

  const sessionOwner = botNumberFromSock(sock) || String(sock?.__botNumber || "").replace(/\D/g, "");
  if (sessionOwner && (ids.has(sessionOwner) || ids.has(`${sessionOwner}@s.whatsapp.net`))) return true;

  const envOwner = String(process.env.OWNER_NUMBER || "").replace(/\D/g, "");
  if (envOwner && (ids.has(envOwner) || ids.has(`${envOwner}@s.whatsapp.net`))) return true;
  return false;
}
function isPrivileged(sock, msg) {
  if (isOwner(sock, msg)) return true;
  const ids = getSenderIds(msg, sock);

  const sudos = readJson(sf(sock, "sudo.json"), []).map(String);
  return sudos.some(s => ids.has(String(s)) || ids.has(`${s}@s.whatsapp.net`));
}
function targetNumber(msg, args = []) {
  const c = getContext(msg);

  const alt = c.participantAlt || c.remoteJidAlt || "";
  if (alt && String(alt).includes("@s.whatsapp.net")) {
    const n = jidNumber(alt);
    if (n.length >= 7) return n;
  }
  const quotedSender = c.participant ? jidNumber(c.participant) : "";

  for (const a of args) {
    const n = String(a).replace(/\D/g, "");
    if (n.length >= 7 && n.length <= 15) return n;
  }
  if (quotedSender && quotedSender.length >= 7 && quotedSender.length <= 15) return quotedSender;
  if (quotedSender) return quotedSender;
  return "";
}
function isBannedNumber(number, sock) {
  const file = sock ? sf(sock, "ban.json") : banFile;
  return readJson(file, []).map(String).includes(String(number));
}
function getMode(sock) {
  const file = sock ? sf(sock, "mode.json") : modeFile;
  const m = readJson(file, { mode: "private" });
  return ["private","public","dm","group"].includes(m.mode) ? m.mode : "private";
}
function commandModeAllowed(sock, msg) {

  if (isPrivileged(sock, msg)) return true;
  const mode = getMode(sock);
  if (mode === "private") return false;
  if (mode === "dm") return !isGroup(msg.key.remoteJid);
  if (mode === "group") return isGroup(msg.key.remoteJid);
  return true;
}
function randomGoodbye() {
  const messages = [
    "Goodbye 👋 Nice to meet you all!",
    "Take care everyone! See you again 👋",
    "Leaving this group — stay awesome!",
    "Goodbye everyone 🫩 Have a great day!",
    "It was nice being here. See you soon!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
function parseGroupLink(text = "") {
  const m = String(text).match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i);
  return m ? m[1] : "";
}
function parseChannelCode(text = "") {
  const m = String(text).match(/whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i);
  return m ? m[1] : "";
}
function commandOwnerOnly(sock, msg, send) {
  if (!isOwner(sock, msg)) { send("❌ Owner only."); return false; }
  return true;
}
function commandPrivileged(sock, msg, send) {
  if (!isPrivileged(sock, msg)) { send("❌ Owner/Sudo only."); return false; }
  return true;
}
function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d}d ${h}h ${m}m ${sec}s`;
}
function extractUrl(text = "") {
  const m = String(text).match(/(https?:\/\/[^\s]+)/i);
  return m ? m[1].replace(/[)\]}>.,!?]+$/g, "") : null;
}

function cleanTemp() {
  try {
    const files = fs.readdirSync(MEDIA_DIR);
    const now = Date.now();
    for (const f of files) {
      const p = path.join(MEDIA_DIR, f);
      const stat = fs.statSync(p);
      if (now - stat.mtimeMs > 10 * 60 * 1000) fs.rmSync(p, { force: true });
    }
  } catch {}
}
setInterval(cleanTemp, 5 * 60 * 1000);

function menuText(msg, sock) {
  const prefix = (typeof currentPrefix !== "undefined" ? currentPrefix : (process.env.PREFIX || "."));
  const uptime = formatUptime(process.uptime() * 1000);
  const name = msg.pushName || "User";
  const ownerName = readJson(sf(sock || "default", "owner-name.json"), { name: "Not Set" }).name || "Not Set";
  const botName = readJson(sf(sock || "default", "bot-name.json"), { name: "" }).name || "Joker-XD";
  const mode = getMode(sock);
  return `
┏┅┅┅┅┅┅┅┓
┇ 🃏*${botName}*
┗┅┅┅┅┅┅┅┛

✦ *Bot*       : ${botName}
✦ *Owner*     : ${ownerName}
✦ *Version*   : v2.0.7
✦ *Prefix*    : ${prefix === "" ? "none" : prefix}
✦ *Mode*      : ${mode}
✦ *User*      : @${name}
✦ *Uptime*    : ${uptime}
✦ *Developer* : 𝓩ₐᵢₙ ₘₐᵣₜₑₙ ⱼₒₖₑᵣ

─────────────
─────────────

┏━⚡ MAIN
┃ ➤ 📋 menu
┃ ➤ 🏓 ping
┃ ➤ 💚 alive
┃ ➤ ❓ help
┃ ➤ ⚙️ settings
┃ ➤ ⚙️ setting
┗━━━━━━━━━━━━━━━━

┏━🔗 SHARE BOT
┃ ➤ /connect
┃ ➤ /connect list
┃ ➤ /disconnect
┃ ➤ /disconnect all
┗━━━━━━━━━━━━━━━━

┏━🤖 AI
┃ ➤ 🧠 ai
┃ ➤ 🌐 translate
┃ ➤ 🎨 imagine
┃ ➤ 💬 chatbot
┗━━━━━━━━━━━━━━━━

┏━🃏 xd-Spam tools
┃ ➤ 🎯 jokers
┃ ➤ 🏷️ jokertag
┃ ➤ 📢 jokerall
┃ ➤ 💣 bom
┃ ➤ 💣 bomall
┃ ➤ 💣 bomtag
┃ ➤ ⏹ stop
┃ ➤ 🆘 jokerhelp
┗━━━━━━━━━━━━━━━━

┏━👑 OWNER
┃ ➤ 🆔 jid
┃ ➤ 📋 alljid
┃ ➤ 📢 chjid
┃ ➤ 📢 chaneljid
┃ ➤ 🚫 ban
┃ ➤ ✅ unban
┃ ➤ 📋 banlist
┃ ➤ 🗑️ clearban
┃ ➤ 🚫 block
┃ ➤ ✅ unblock
┃ ➤ 📋 blocklist
┃ ➤ 📢 broadcast
┃ ➤ 👑 sudo
┃ ➤ ❌ delsudo
┃ ➤ 🔄 mode
┃ ➤ 🗑️ delete
┃ ➤ 👋 left
┃ ➤ ➕ join
┃ ➤ 📊 groups
┃ ➤ ➕ chatbotadd
┃ ➤ ❌ chatbotrem
┃ ➤ ✏️ setbotname
┃ ➤ ✏️ setownername
┃ ➤ 🔧 setprefix
┗━━━━━━━━━━━━━━━━

┏━👥 GROUP
┃ ➤ 🦵 kick
┃ ➤ 👢 kickall
┃ ➤ ⬆️ promote
┃ ➤ ⬇️ demote
┃ ➤ 📢 tagall
┃ ➤ 👑 admin
┃ ➤ 👥 members
┃ ➤ 🙈 hidetag
┃ ➤ 🔗 link
┃ ➤ 🔄 resetlink
┃ ➤ 🔓 open
┃ ➤ 🔒 close
┃ ➤ 📝 setdesc
┃ ➤ ✏️ setname
┃ ➤ 👋 welcome
┃ ➤ ✏️ setwelcome
┃ ➤ 👋 goodbye
┃ ➤ ✏️ setgoodbye
┃ ➤ 🚫 antilink
┃ ➤ 🚫 antistic
┃ ➤ 🚫 antivoice
┃ ➤ 🚫 antipic
┃ ➤ 🚫 antivideo
┃ ➤ 🚫 antitext
┃ ➤ 🚫 antitag
┃ ➤ 🚫 antitagme
┃ ➤ 🚫 antigroupmention / agm
┃ ➤ 📱 gstatus / togstatus
┃ ➤ 🚫 antigroupstatus / ags
┃ ➤ 🛡️ antideletestatus
┃ ➤ 💾 save
┃ ➤ 📤 send
┃ ➤ 👀 autostatusview
┃ ➤ ❤️ react
┃ ➤ 👥 groupadd
┃ ➤ 🖼️ getpp
┃ ➤ 🖼️ gcpp / gcp
┃ ➤ ⚠️ warn
┃ ➤ ⚠️ setwarn
┃ ➤ 🔄 resetwarn
┃ ➤ ✅ allow
┃ ➤ ✅ approve
┃ ➤ ✅ approveall
┗━━━━━━━━━━━━━━━━

┏━📥 DOWNLOAD
┃ ➤ 🎵 song
┃ ➤ 🎬 video
┃ ➤ 🔍 yts
┃ ➤ 📘 facebook
┃ ➤ 🎵 fbaudio
┃ ➤ 📸 instagram
┃ ➤ 🎵 igaudio
┃ ➤ 🎵 tiktok
┃ ➤ 🎵 ttaudio
┃ ➤ 🐦 twitter
┃ ➤ 📌 pinterest
┃ ➤ 🔞 adultmenu
┗━━━━━━━━━━━━━━━━

┏━✨ AUTO
┃ ➤ 😊 autoreact
┃ ➤ 🔄 setreact
┃ ➤ 📱 autostatus
┃ ➤ 📖 autoread
┃ ➤ 🎙️ autorecord
┃ ➤ ⌨️ autotype
┃ ➤ 🎙️ autorectype
┃ ➤ 📶 alwaysonline
┃ ➤ 🗑️ antidelete
┃ ➤ ✏️ antiedit
┃ ➤ 📶 online
┃ ➤ 👀 lastseen
┗━━━━━━━━━━━━━━━━

┏━🔄 CONVERT
┃ ➤ 🎵 tomp3
┃ ➤ 🎤 tovoice
┃ ➤ 🖼️ sticker
┃ ➤ 🖼️ toimg
┃ ➤ 🎬 tovideo
┃ ➤ 📢 tts
┃ ➤ 🔗 url
┃ ➤ 📖 readmore
┗━━━━━━━━━━━━━━━━

══════════════
💡 Type ${prefix}help for short usage
🃏 JOKER-XD v2.0.5
`.trim();
}

function helpText(prefix) {
  const p = prefix || ".";
  return `
*📖 HELP — short usage*

*MAIN*
• ${p}menu — full menu
• ${p}ping — bot speed
• ${p}alive — uptime / status
• ${p}help — this list

*SHARE BOT* (slash / only — Bot King / Owner / Developer)
• /connect <number> — pair a shared bot (pairing code)
• /connect list — list numbers you shared
• /disconnect <number> — remove *child* bot only (King never affected)
• /disconnect all — remove all *child* bots only (King never affected)

*AI*
• ${p}ai <question> — ask AI
• ${p}translate / tr <lang> <text>
• ${p}imagine <prompt> — AI image
• ${p}chatbot on|off — AI reply only on @mention or reply-to-bot (any mode)

*xd-Spam tools*
• ${p}jokers [delay] jid text amount — spam target
• ${p}jokertag num [delay] jid text amount — tag+spam
• ${p}jokerall [delay] jid text amount — group hidetag spam
• ${p}bom [#delay] amount — reply spam (max 500)
• ${p}bom [#delay] message amount — text spam without reply
• ${p}bomall [#delay] amount|message amount — group hidetag spam
• ${p}bomtag [#delay] number amount|message amount — tag spam
• ${p}stop bom|ba|bt|all — stop running bom/joker jobs
• ${p}jokerhelp — full guide

*CONVERT*
• ${p}sticker — reply image/video → sticker
• ${p}toimage — reply sticker → image
• ${p}tomp3 — reply video/audio → mp3
• ${p}tovoice / tov / topp — reply video/audio/voice → voice note
• ${p}tomp4 — reply sticker/image

*TOOLS*
• ${p}tts <text> — text to speech
• ${p}translate / tr <lang> <text> — translate
• ${p}url / upload — reply media → Catbox link
• ${p}readmore <text> — spoiler/read more
• ${p}define <word> — dictionary
• ${p}weather <city> — weather
• ${p}currency <amount> <from> <to> — exchange
• ${p}qr <text> — QR code image

*GROUP*
• ${p}kick / k / out / nikul / dufa / remove — kick member (reply/num)
• ${p}kickall — kick non-admins (owner)
• ${p}promote / toadmin — make admin
• ${p}demote / dismiss / tomember — remove admin
• ${p}tag / tagall — tag all with numbers visible
• ${p}admin — tag only admins + numbers
• ${p}members — tag only members + numbers
• ${p}hidetag — delete cmd then silent tag (no reply/quote)
• ${p}link / resetlink — invite link
• ${p}open / close — unlock / lock group
• ${p}setdesc / setgroupname — edit group
• ${p}antilink warn|delete|kick|off — link protection (one mode, switches)
• ${p}antisticker|antipic|antivideo|antivoice|antitext warn|delete|kick|off
• ${p}antitag warn|delete|kick|off — mass tag protection
• ${p}antitagme on|off|set text
• ${p}antigroupmention / agm warn|delete|kick|off — anti group-status *mentions* only
• ${p}gstatus / togroupstatus / togstatus [jid] text|reply — post group status
• ${p}antigroupstatus / ags warn|delete|kick|off — anti real group-status posts only
• ${p}antideletestatus / ads on|off — recover deleted group status/mention → your private
• ${p}save — reply group status/media → send to your private
• ${p}send — reply status/media → extract & send same content here
• ${p}autostatusview / asv on|off — auto-seen ALL status (personal + group + mentions)
• ${p}react / autostatusreact on|off — auto ❤️ ALL status types
• ${p}autoreact status on|off — same as status react via autoreact
• ${p}groupadd all|contacts|contact_blacklist — who can add bot to groups
• ${p}welcome on|off — enable/disable welcome for this group
• ${p}setwelcome <text> — set welcome template ({@username} {group})
• ${p}goodbye on|off — enable/disable goodbye for this group
• ${p}setgoodbye <text> — set goodbye template ({@username} {group})
• ${p}getpp — get user profile picture (reply/mention/number)
• ${p}gcpp / gcp — get current group profile picture + name
• ${p}warn — warn user (limit → kick)
• ${p}setwarn 1-5 — warn limit
• ${p}resetwarn / rw — clear warns
• ${p}allow — 1 free violation
• ${p}approve all — approve pending join requests up to the 1025-member ceiling
• ${p}approve <amount> — approve a specific number of pending requests

*DOWNLOAD* (direct media, no loading text)
• ${p}song <name/url> — YT audio (Elite API)
• ${p}play <name/url> — YT audio (Yupra API)
• ${p}ytmp3 <name/url> — YT audio (Okatsu API)
• ${p}music <name/url> — YT audio (all APIs fallback)
• ${p}video|ytmp4 <name/url> — YouTube video
• ${p}yts <query> — YouTube search
• ${p}facebook|fb <url> — Facebook video
• ${p}facebookaudio|fbaudio <url>
• ${p}instagram|ig|insta <url>
• ${p}instagramaudio|igaudio|instaaudio <url>
• ${p}tiktok|tt <url>
• ${p}tiktokaudio|ttaudio <url>
• ${p}twitter <url>
• ${p}pinterest <url>
• ${p}adultmenu — adult commands

*MEDIA*
• ${p}vv — open view-once here
• ${p}vv2 — view-once → owner DM (silent no-prefix reply)
• ${p}viewone on|off — auto view-once
• ${p}gcp / gcpp / getpp — group / user photo
• ${p}setmenuimage — reply image as menu pic

*AUTO*
• ${p}autoreact all|dm|group|command on|off
• ${p}autoreact on|off — master switch
• ${p}setreact default|ai|all|custom <emojis>
• ${p}setreact ❤️🔥😂 — custom pool

• ${p}autorecord dm|group on|off
• ${p}autotype dm|group on|off
• ${p}autorecordtype dm|group on|off
• ${p}antidelete private|chat|off — recover deleted messages
• ${p}antiedit pm|chat|off — recover original text of edited messages (default ON → owner DM)

*MODE*
• ${p}mode public|dm|group|private

*OWNER*
• ${p}ban / unban / banlist / clearban
• ${p}block / unblock / blocklist
• ${p}broadcast / bc <msg> — list groups, reply *1,2,5* or *all*
• ${p}sudo / delsudo
• ${p}delete — delete for everyone (reply)
• ${p}left / join <link> / groups
• ${p}jid / alljid / chjid / chaneljid
• ${p}chatbotadd / chatbotrem
• ${p}setbotname / setownername / setprefix
• ${p}online / lastseen

Developer prefix: *®* (always works)
`.trim();
}

function jokerHelpText(prefix) {
  const p = prefix || ".";
  return `
*🃏 JOKER TOOLS GUIDE*

*Delay* (optional): #500ms → #72h
Examples: #500ms  #1sec  #2s  #1min

*${p}jokers* — send text or media to a target
Without delay:
  ${p}jokers (jid) (message) (amount)
With delay:
  ${p}jokers #1sec (jid) (message) (amount)
Reply media:
  ${p}jokers (jid) (amount)
  ${p}jokers #1sec (jid) (amount)

*${p}jokertag* — tag a number while sending
Without delay:
  ${p}jokertag (number) (jid) (message) (amount)
With delay:
  ${p}jokertag (number) #1sec (jid) (message) (amount)
Reply media:
  ${p}jokertag (number) (jid) (amount)

*${p}jokerall* — hidetag everyone in a group
Without delay:
  ${p}jokerall (jid) (message) (amount)
With delay:
  ${p}jokerall #1sec (jid) (message) (amount)
Reply media:
  ${p}jokerall (jid) (amount)

*${p}stop* — cancel a running joker job
  ${p}stop js   — stop jokers
  ${p}stop jt   — stop jokertag
  ${p}stop ja   — stop jokerall
  ${p}stop all  — stop everything
Aliases: ${p}stopjs ${p}stopjt ${p}stopja

JID formats: number@g.us | number@s.whatsapp.net | number@lid
`.trim();
}

const STICKER_PACK_NAME = "Joker-xd";
const STICKER_PACK_AUTHOR = "Bot developer\n𝓩ₐᵢₙ ₘₐᵣₜₑₙ ⱼₒₖₑᵣ\nTelegram\n@martenzain";

function addStickerExif(webpBuffer, packname = STICKER_PACK_NAME, author = STICKER_PACK_AUTHOR) {
  const json = JSON.stringify({
    "sticker-pack-id": "com.jokerxd.bot",
    "sticker-pack-name": packname,
    "sticker-pack-publisher": author,
    "android-app-store-link": "https://t.me/martenzain",
    "ios-app-store-link": "https://t.me/martenzain",
    emojis: [""]
  });
  const jsonBuf = Buffer.from(json, "utf8");

  const exif = Buffer.concat([
    Buffer.from([
      0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
      0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ]),
    jsonBuf
  ]);
  exif.writeUIntLE(jsonBuf.length, 14, 4);

  if (!webpBuffer || webpBuffer.length < 12) return webpBuffer;

  if (webpBuffer.includes(Buffer.from("EXIF"))) return webpBuffer;

  const riffSize = webpBuffer.readUInt32LE(4);
  const pieces = [];

  let offset = 12; // skip RIFF....WEBP
  while (offset + 8 <= webpBuffer.length) {
    const fourcc = webpBuffer.toString("ascii", offset, offset + 4);
    const size = webpBuffer.readUInt32LE(offset + 4);
    const padded = size + (size % 2);
    pieces.push(webpBuffer.subarray(offset, offset + 8 + padded));
    offset += 8 + padded;
  }

  const exifChunk = Buffer.concat([
    Buffer.from("EXIF", "ascii"),
    (() => { const b = Buffer.alloc(4); b.writeUInt32LE(exif.length, 0); return b; })(),
    exif,
    exif.length % 2 ? Buffer.from([0]) : Buffer.alloc(0)
  ]);
  const body = Buffer.concat([...pieces, exifChunk]);
  const out = Buffer.alloc(12 + body.length);
  out.write("RIFF", 0);
  out.writeUInt32LE(body.length + 4, 4);
  out.write("WEBP", 8);
  body.copy(out, 12);
  return out;
}

async function makeSticker(buffer, isVideo = false) {
  const id = makeId();
  const output = path.join(MEDIA_DIR, `${id}.webp`);

  let ext = isVideo ? ".mp4" : ".jpg";
  let isAnim = !!isVideo;
  if (buffer.length >= 12) {
    if (buffer[0] === 0x89 && buffer[1] === 0x50) ext = ".png";
    else if (buffer[0] === 0xff && buffer[1] === 0xd8) ext = ".jpg";
    else if (buffer[0] === 0x47 && buffer[1] === 0x49) {
      ext = ".gif";
      isAnim = true;
    } else if (buffer.toString("ascii", 4, 8) === "ftyp") {
      ext = ".mp4";
      isAnim = true;
    } else if (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    ) {
      ext = ".webp";

      if (
        buffer.includes(Buffer.from("ANIM")) ||
        buffer.includes(Buffer.from("ANMF"))
      ) {
        isAnim = true;
      }
    }
  }

  try {

    if (!isAnim && ext !== ".gif" && ext !== ".mp4") {
      try {
        const webp = await sharp(buffer)
          .resize(512, 512, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .webp({ quality: 85, effort: 2 })
          .toBuffer();
        if (webp && webp.length > 50) {
          return addStickerExif(webp, STICKER_PACK_NAME, STICKER_PACK_AUTHOR);
        }
      } catch (eSharp) {
        console.warn("[sticker] sharp failed, ffmpeg:", eSharp.message || eSharp);
      }
    }

    if (isAnim && ext === ".webp") {
      try {
        const meta = await sharp(buffer, { animated: true }).metadata();
        const pages = Math.max(1, meta.pages || 1);

        const maxPages = Math.min(pages, 90);
        const webp = await sharp(buffer, {
          animated: true,
          pages: maxPages
        })
          .resize(512, 512, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .webp({
            quality: 55,
            effort: 2,
            loop: 0,
            delay: meta.delay || 67 // ~15fps fallback
          })
          .toBuffer();
        if (webp && webp.length > 50) {
          return addStickerExif(webp, STICKER_PACK_NAME, STICKER_PACK_AUTHOR);
        }
      } catch (eSharpAnim) {
        console.warn("[sticker] sharp animated webp failed:", eSharpAnim.message || eSharpAnim);

      }
    }

    const input = path.join(MEDIA_DIR, `${id}_in${ext}`);
    fs.writeFileSync(input, buffer);
    try {
      if (isAnim || ext === ".gif" || ext === ".mp4" || ext === ".webp") {

        await execAsync(
          `"${FFMPEG_PATH}" -y -i "${input}" -t 6 -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0" -c:v libwebp -lossless 0 -q:v 55 -loop 0 -an -fps_mode passthrough "${output}"`,
          { timeout: 90000, maxBuffer: 40 * 1024 * 1024 }
        );
      } else {
        await execAsync(
          `"${FFMPEG_PATH}" -y -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0" -c:v libwebp -lossless 0 -q:v 80 -an "${output}"`,
          { timeout: 45000, maxBuffer: 20 * 1024 * 1024 }
        );
      }
      if (!fs.existsSync(output) || fs.statSync(output).size < 100) {
        throw new Error(
          "Empty output — host ffmpeg may lack libwebp (need: apt install ffmpeg)"
        );
      }
      const webp = fs.readFileSync(output);
      return addStickerExif(webp, STICKER_PACK_NAME, STICKER_PACK_AUTHOR);
    } finally {
      try {
        fs.rmSync(input, { force: true });
      } catch {}
      try {
        fs.rmSync(output, { force: true });
      } catch {}
    }
  } catch (e) {
    throw new Error("Sticker failed: " + (e.message || e));
  }
}

let _tovideoBusy = false;
const _tovideoWaiters = [];
function acquireTovideoLock() {
  return new Promise((resolve) => {
    if (!_tovideoBusy) {
      _tovideoBusy = true;
      resolve();
    } else {
      _tovideoWaiters.push(resolve);
    }
  });
}
function releaseTovideoLock() {
  const next = _tovideoWaiters.shift();
  if (next) next();
  else _tovideoBusy = false;
}

async function stickerToVideoLocal(buffer) {
  const id = makeId();
  const input = path.join(MEDIA_DIR, `${id}_sticker.webp`);
  const framesDir = path.join(MEDIA_DIR, `${id}_frames`);
  const output = path.join(MEDIA_DIR, `${id}_sticker.mp4`);
  fs.writeFileSync(input, buffer);
  fs.mkdirSync(framesDir, { recursive: true });
  try {
    const meta = await sharp(buffer, { animated: true }).metadata();
    const pages = Math.max(1, meta.pages || 1);
    const delays = meta.delay || [];
    let avgDelay = delays.length
      ? delays.reduce((a, b) => a + b, 0) / delays.length
      : 100;
    avgDelay = Math.max(20, Math.min(500, avgDelay));
    const fps = Math.max(5, Math.min(30, Math.round(1000 / avgDelay))) || 10;

    let written = 0;
    for (let i = 0; i < pages; i++) {
      const framePath = path.join(
        framesDir,
        `frame_${String(i).padStart(4, "0")}.jpg`
      );
      try {

        const pageMeta = await sharp(buffer, {
          page: i,
          animated: false
        }).metadata();
        let w = pageMeta.width || meta.width || 512;
        let h = pageMeta.height || meta.height || 512;

        const ew = w % 2 === 0 ? w : w + 1;
        const eh = h % 2 === 0 ? h : h + 1;

        const frameBuf = await sharp(buffer, { page: i, animated: false })
          .resize(ew, eh, {
            fit: "fill",
            background: { r: 0, g: 0, b: 0, alpha: 1 }
          })
          .flatten({ background: { r: 0, g: 0, b: 0 } })
          .jpeg({ quality: 90 })
          .toBuffer();

        fs.writeFileSync(framePath, frameBuf);
        written++;
      } catch (fe) {
        console.warn(`[tovideo] frame ${i} skip:`, fe.message || fe);
      }
    }

    if (written < 1) throw new Error("local: no frames extracted");

    const vf = "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p";
    await execAsync(
      `"${FFMPEG_PATH}" -y -framerate ${fps} -i "${framesDir}/frame_%04d.jpg" -vf "${vf}" -c:v libx264 -preset ultrafast -crf 23 -pix_fmt yuv420p -movflags +faststart -an "${output}"`,
      { timeout: 90000, maxBuffer: 80 * 1024 * 1024 }
    );
    if (!fs.existsSync(output) || fs.statSync(output).size < 200) {
      throw new Error("local: empty mp4");
    }
    return fs.readFileSync(output);
  } finally {
    try {
      fs.rmSync(input, { force: true });
    } catch {}
    try {
      fs.rmSync(output, { force: true });
    } catch {}
    try {
      fs.rmSync(framesDir, { recursive: true, force: true });
    } catch {}
  }
}

async function stickerToVideo(buffer) {
  await acquireTovideoLock();
  try {
    const buf = await stickerToVideoLocal(buffer);
    if (!buf || buf.length < 200) throw new Error("Sticker→video conversion failed");
    console.log("[tovideo] OK via local-sharp, size=", buf.length);
    return buf;
  } finally {
    releaseTovideoLock();
  }
}

async function stickerToImageBuffer(buffer) {
  try {
    return await sharp(buffer)
      .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  } catch (e1) {
    const id = makeId();
    const input = path.join(MEDIA_DIR, `${id}_sticker.webp`);
    const output = path.join(MEDIA_DIR, `${id}_sticker.png`);
    fs.writeFileSync(input, buffer);
    try {
      await execAsync(
        `"${FFMPEG_PATH}" -y -i "${input}" -frames:v 1 "${output}"`,
        { timeout: 20000, maxBuffer: 10 * 1024 * 1024 }
      );
      if (!fs.existsSync(output) || fs.statSync(output).size < 100) {
        throw new Error("Sticker→image conversion failed");
      }
      return fs.readFileSync(output);
    } finally {
      try { fs.rmSync(input, { force: true }); } catch {}
      try { fs.rmSync(output, { force: true }); } catch {}
    }
  }
}

function guessMime(fileName = "") {
  const ext = (fileName.split(".").pop() || "").toLowerCase();
  const map = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif",
    mp4: "video/mp4", mkv: "video/x-matroska", webm: "video/webm", mov: "video/quicktime",
    mp3: "audio/mpeg", ogg: "audio/ogg", opus: "audio/ogg", m4a: "audio/mp4", aac: "audio/aac",
    pdf: "application/pdf", zip: "application/zip", bin: "application/octet-stream"
  };
  return map[ext] || "application/octet-stream";
}

async function uploadCatbox(buffer, fileName = "joker-xd.jpg") {
  if (!Buffer.isBuffer(buffer) || buffer.length < 10) throw new Error("Empty or invalid buffer");

  const mime = guessMime(fileName);
  const hosts = [
    { url: "https://catbox.moe/user/api.php", name: "catbox" },
    { url: "https://litterbox.catbox.moe/resources/internals/api.php", name: "litterbox", extra: { time: "72h" } },
    { url: "https://upload.satoru.click/user/api.php", name: "satoru" }
  ];

  let lastErr = null;
  for (const host of hosts) {
    try {
      const form = new FormData();
      form.append("reqtype", "fileupload");
      if (host.extra) {
        for (const [k, v] of Object.entries(host.extra)) form.append(k, v);
      }
      form.append("fileToUpload", buffer, { filename: fileName, contentType: mime });

      const res = await axios.post(host.url, form, {
        headers: form.getHeaders ? form.getHeaders() : { "Content-Type": "multipart/form-data" },
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: () => true
      });

      const url = String(res.data || "").trim();

      if (res.status >= 200 && res.status < 300 && /^https?:\/\//i.test(url) && !url.includes("<html") && url.length < 500) {
        return url;
      }
      lastErr = new Error(`${host.name} returned: ${url.slice(0, 120) || res.status}`);
    } catch (e) {
      lastErr = e;
      console.warn(`[upload] ${host.name} failed:`, e.message || e);
    }
  }
  throw new Error("Upload failed on all hosts: " + (lastErr?.message || "unknown"));
}

function isViewOncePayload(message) {
  const m = message || {};
  if (m.viewOnceMessage || m.viewOnceMessageV2 || m.viewOnceMessageV2Extension) return true;
  if (m.ephemeralMessage?.message) return isViewOncePayload(m.ephemeralMessage.message);
  if (m.documentWithCaptionMessage?.message) return isViewOncePayload(m.documentWithCaptionMessage.message);
  if (m.imageMessage?.viewOnce || m.videoMessage?.viewOnce || m.audioMessage?.viewOnce) return true;
  return false;
}

function unwrapMessage(message) {
  let m = message || {};
  for (let i = 0; i < 6; i++) {
    if (m.viewOnceMessage?.message) { m = m.viewOnceMessage.message; continue; }
    if (m.viewOnceMessageV2?.message) { m = m.viewOnceMessageV2.message; continue; }
    if (m.viewOnceMessageV2Extension?.message) { m = m.viewOnceMessageV2Extension.message; continue; }
    if (m.ephemeralMessage?.message) { m = m.ephemeralMessage.message; continue; }
    if (m.documentWithCaptionMessage?.message) { m = m.documentWithCaptionMessage.message; continue; }
    if (m.templateMessage?.hydratedTemplate?.hydratedContentMedia) {
      m = m.templateMessage.hydratedTemplate.hydratedContentMedia;
      continue;
    }
    break;
  }
  return m;
}

async function getChatLabel(sock, jid) {
  if (!jid) return "Unknown";
  try {
    if (isGroup(jid)) {
      const meta = await getCachedMeta(sock, jid).catch(() => null);
      if (meta?.subject) return `${meta.subject} (${jid})`;
      return `Group: ${jid}`;
    }
    const num = jidNumber(jid);
    return num ? `DM: +${num}` : `Chat: ${jid}`;
  } catch {
    return String(jid);
  }
}

async function openViewOnce(sock, sourceMsg) {
  const outer = sourceMsg.message || {};
  const vo = unwrapMessage(outer);
  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
  const wrapped = { key: sourceMsg.key, message: vo };

  if (vo.imageMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return { image: buf, caption: vo.imageMessage.caption || "" };
  }
  if (vo.videoMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    const payload = { video: buf, caption: vo.videoMessage.caption || "" };
    if (vo.videoMessage.gifPlayback) payload.gifPlayback = true;
    return payload;
  }
  if (vo.audioMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return {
      audio: buf,
      mimetype: vo.audioMessage.mimetype || "audio/ogg; codecs=opus",
      ptt: !!vo.audioMessage.ptt
    };
  }
  if (vo.stickerMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return { sticker: buf };
  }
  if (vo.documentMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return {
      document: buf,
      mimetype: vo.documentMessage.mimetype || "application/octet-stream",
      fileName: vo.documentMessage.fileName || "file",
      caption: vo.documentMessage.caption || ""
    };
  }
  return null;
}

const VV2_ALIASES = new Set([
  "vv2", "rvo", "readvo", "reveal", "openvo",
  "👁️", "👀", "🔓", "📸", "🎥", "🖼️", "🕵️", "🔎"
]);

function getMenuImagePath() {
  const custom = path.join(process.cwd(), "assets", "menuimage.jpg");
  const customPng = path.join(process.cwd(), "assets", "menuimage.png");
  const fallback = path.join(process.cwd(), "assets", "menuimage.jpg");
  if (fs.existsSync(custom) && fs.statSync(custom).size > 0) return custom;
  if (fs.existsSync(customPng) && fs.statSync(customPng).size > 0) return customPng;
  if (fs.existsSync(fallback) && fs.statSync(fallback).size > 0) return fallback;
  return null;
}

async function sendMenu(sock, msg, send) {
  const text = menuText(msg, sock);
  const imgPath = getMenuImagePath();
  if (imgPath) {
    try {
      const buf = fs.readFileSync(imgPath);
      await sock.sendMessage(msg.key.remoteJid, { image: buf, caption: text }, { quoted: msg });
      return;
    } catch (e) {
      console.error("[menu-image]", e.message || e);
    }
  }

  try {
    const imageUrl = readJson(sf(sock, "menu-image.json"), { url: "" }).url;
    if (imageUrl && /^https?:\/\//i.test(imageUrl)) {
      const buf = await downloadUrlBuffer(imageUrl, 12000);
      await sock.sendMessage(msg.key.remoteJid, { image: buf, caption: text }, { quoted: msg });
      return;
    }
  } catch (e) {
    console.error("[menu-url]", e.message || e);
  }
  await send(text);
}
async function getProfileImageBuffer(sock, jid) {

  const candidates = [];
  const raw = String(jid || "");
  if (raw) candidates.push(raw);
  const num = jidNumber(raw);
  if (num) {
    candidates.push(`${num}@s.whatsapp.net`);
    candidates.push(`${num}@lid`);
  }
  const seen = new Set();
  for (const j of candidates) {
    if (!j || seen.has(j)) continue;
    seen.add(j);
    try {
      const url = await sock.profilePictureUrl(j, "image").catch(() => null);
      if (url) {
        const buf = await downloadUrlBuffer(url, 15000);
        if (buf && buf.length) return buf;
      }
    } catch {}
  }
  if (num) {
    try {
      const res = await sock.onWhatsApp(num).catch(() => []);
      const entry = Array.isArray(res) ? res[0] : null;
      const resolved = entry?.jid || entry?.lid;
      if (resolved && !seen.has(resolved)) {
        const url = await sock.profilePictureUrl(resolved, "image").catch(() => null);
        if (url) {
          const buf = await downloadUrlBuffer(url, 15000);
          if (buf && buf.length) return buf;
        }
      }
    } catch {}
  }
  return null;
}

async function requireGroupAdmin(sock, msg, send) {
  const jid = msg.key.remoteJid;
  if (!isGroup(jid)) {
    await send("❌ This command can only be used in groups.");
    return null;
  }
  const meta = await sock.groupMetadata(jid);
  const sender = msg.key.participant || msg.key.remoteJid;
  if (!isAdmin(meta, sender) && !isOwner(sock, msg)) {
    await send("❌ Group admins only.");
    return null;
  }
  return meta;
}

let currentPrefix = process.env.PREFIX || ".";

const activeJokerJobs = new Map(); // key: `${sessionKey}:${type}` → { stop: boolean }

function getSessionKey(sock) {
  try {
    return sock?.user?.id?.split(":")[0] || sock?.authState?.creds?.me?.id?.split(":")[0] || "default";
  } catch {
    return "default";
  }
}

function setJokerJob(sock, type, running) {
  const key = `${getSessionKey(sock)}:${type}`;
  if (running) activeJokerJobs.set(key, { stop: false });
  else activeJokerJobs.delete(key);
}

function requestStopJoker(sock, type) {
  const key = `${getSessionKey(sock)}:${type}`;
  const job = activeJokerJobs.get(key);
  if (job) {
    job.stop = true;
    return true;
  }
  return false;
}

function shouldStopJoker(sock, type) {
  const key = `${getSessionKey(sock)}:${type}`;
  return !!activeJokerJobs.get(key)?.stop;
}

async function approveGroupRequests(sock, jid, requestedAmount = null) {
  if (typeof sock.groupRequestParticipantsList !== "function" || typeof sock.groupRequestParticipantsUpdate !== "function") {
    throw new Error("This Baileys build does not expose group join-request approval APIs.");
  }

  const meta = await sock.groupMetadata(jid);
  const currentMembers = Array.isArray(meta?.participants) ? meta.participants.length : 0;
  const initialPending = await sock.groupRequestParticipantsList(jid);
  const pendingBefore = Array.isArray(initialPending) ? initialPending.length : 0;
  const remainingSlots = Math.max(0, APPROVE_GROUP_LIMIT - currentMembers);

  if (requestedAmount !== null && (!Number.isInteger(requestedAmount) || requestedAmount < 1)) {
    throw new Error("Amount must be a positive whole number.");
  }

  let approved = 0;
  const target = requestedAmount === null ? Infinity : requestedAmount;

  while (approved < target) {
    const latest = await sock.groupRequestParticipantsList(jid);
    const pending = Array.isArray(latest) ? latest : [];
    if (!pending.length) break;

    const slotsLeft = Math.max(0, APPROVE_GROUP_LIMIT - (currentMembers + approved));
    if (slotsLeft <= 0) break;

    const take = Math.min(50, pending.length, slotsLeft, target - approved);
    const batch = pending.slice(0, take).map(x => x.jid || x.id).filter(Boolean);
    if (!batch.length) break;

    const result = await sock.groupRequestParticipantsUpdate(jid, batch, "approve");
    const success = Array.isArray(result)
      ? result.filter(r => String(r?.status || "200") === "200" && r?.jid).length
      : batch.length;
    approved += success;

    if (success === 0) break;
  }

  const after = await sock.groupRequestParticipantsList(jid).catch(() => []);
  const pendingLeft = Array.isArray(after) ? after.length : Math.max(0, pendingBefore - approved);
  const finalMembers = Math.min(APPROVE_GROUP_LIMIT, currentMembers + approved);

  return {
    currentMembers,
    finalMembers,
    pendingBefore,
    approved,
    pendingLeft,
    full: finalMembers >= APPROVE_GROUP_LIMIT
  };
}

async function executeCommand(sock, msg, raw) {
  const prefix = currentPrefix;
  const isDev = isDeveloper(sock, msg);
  let usedDevPrefix = false;
  let body = "";
  const jidEarly = msg.key.remoteJid;
  const sendEarly = (text, extra = {}) => sock.sendMessage(jidEarly, { text, ...extra }, { quoted: msg });

  {
    const rawTrim = String(raw || "").trim();
    const shareRe = /^\/(connect|c|cl|disconnect|dc|dcall|delconnect|del\s*connect)\b/i;
    if (shareRe.test(rawTrim)) {
      const kingNum = botNumberFromSock(sock) || jidNumber(sock.user?.id);
      const partsShare = rawTrim.slice(1).trim().split(/\s+/);
      const scmd = (partsShare.shift() || "").toLowerCase().replace(/\s+/g, "");
      const sargs = partsShare;

      const isList = (scmd === "cl") || (scmd === "connect" && String(sargs[0] || "").toLowerCase() === "list");
      const isDisconnectAll =
        scmd === "dcall" ||
        (["disconnect", "dc"].includes(scmd) && String(sargs[0] || "").toLowerCase() === "all");
      const isDisconnect = ["disconnect", "dc", "delconnect"].includes(scmd) ||
        (scmd === "del" && String(sargs[0] || "").toLowerCase() === "connect");
      const isConnect = scmd === "connect" || scmd === "c";

      if (!isOwner(sock, msg) && !isDev) {
        await sendEarly("❌ Owner / Developer only.");
        return true;
      }

      if (!isDev && !isBotKing(kingNum)) {
        await sendEarly(
          "❌ *Share Bot denied*\n\n" +
          "This bot was linked via `/connect` (child session).\n" +
          "Only a *Bot King* (paired from the pairing portal) can share bots.\n" +
          "Pair your own number from the panel to become Bot King."
        );
        return true;
      }

      if (isList || (isConnect && String(sargs[0] || "").toLowerCase() === "list")) {
        const meta = getShareMeta(kingNum);
        const kids = meta.children || [];
        if (!kids.length) {
          await sendEarly("📋 *Share list empty*\nNo numbers connected via `/connect` yet.");
          return true;
        }
        let text = `📋 *Shared bots* (${kids.length})\nBot King: *${kingNum}*\n\n`;
        for (const n of kids) {
          const online = activeSessions.get(n)?.sock?.user ? "🟢 online" : "⚪ offline";
          text += `• *${n}* — ${online}\n`;
        }
        text += `\nDisconnect: /disconnect <number>\nDisconnect all: /disconnect all`;
        await sendEarly(text);
        return true;
      }

      if (isDisconnectAll) {
        const meta = getShareMeta(kingNum);
        const kids = [...(meta.children || [])].filter(t => t && t !== kingNum);
        if (!kids.length) {
          await sendEarly("📋 No shared (child) bots to disconnect.\nBot King is never disconnected by this command.");
          return true;
        }
        let ok = 0;
        let fail = 0;
        for (const target of kids) {
          if (target === kingNum) continue; // hard safety: never disconnect King
          try {
            const entry = activeSessions.get(target);
            if (entry?.sock) {
              entry.sock.__manualDisconnect = true;
              try { await entry.sock.logout?.(); } catch {}
              try { entry.sock.end?.(undefined); } catch {}
            }
            activeSessions.delete(target);
            removeShareChild(kingNum, target);
            wipeSessionData(target);
            ok++;
          } catch {
            fail++;
          }
        }
        await sendEarly(
          `✅ *Disconnect all complete* (children only)\n` +
          `Removed: *${ok}*\n` +
          (fail ? `Failed: *${fail}*\n` : "") +
          `Bot King (*${kingNum}*) is unaffected.\nAll shared child session data wiped from server.`
        );
        return true;
      }

      if (isDisconnect) {
        let target = String(sargs[0] || sargs[1] || "").replace(/\D/g, "");
        if (scmd === "del" && String(sargs[0] || "").toLowerCase() === "connect") {
          target = String(sargs[1] || "").replace(/\D/g, "");
        }
        if (!target || target.length < 8) {
          await sendEarly("❌ Usage: `/disconnect 92XXXXXXXXX`\n`/disconnect all` or `/dcall` — remove all *child* bots only");
          return true;
        }
        if (target === kingNum) {
          await sendEarly("❌ Cannot disconnect Bot King itself.\nThis command only disconnects *child bots* linked via `/connect`.");
          return true;
        }
        const meta = getShareMeta(kingNum);
        if (!isDev && !(meta.children || []).includes(target)) {
          await sendEarly("❌ That number is not in your share list (child bots only).");
          return true;
        }
        try {
          const entry = activeSessions.get(target);
          if (entry?.sock) {
            entry.sock.__manualDisconnect = true;
            try { await entry.sock.logout?.(); } catch {}
            try { entry.sock.end?.(undefined); } catch {}
          }
          activeSessions.delete(target);
          removeShareChild(kingNum, target);
          wipeSessionData(target);
          await sendEarly(`✅ Disconnected and removed *child* *${target}*\nBot King is unaffected.\nAll session data deleted from server.`);
        } catch (e) {
          await sendEarly("❌ Disconnect failed: " + (e?.message || e));
        }
        return true;
      }

      if (isConnect) {
        const target = String(sargs[0] || "").replace(/\D/g, "");
        if (!target || target.length < 8 || target.length > 15) {
          await sendEarly(
            "❌ Usage: `/connect 92XXXXXXXXX`\n" +
            "Alias: `/c 92XXXXXXXXX`\n\n" +
            "Sends a pairing code so that number can link as a shared bot."
          );
          return true;
        }
        if (target === kingNum) {
          await sendEarly("❌ Cannot connect your own Bot King number again.");
          return true;
        }
        if (activeSessions.get(target)?.sock?.user) {
          await sendEarly(`ℹ️ *${target}* is already connected on this server.`);
          return true;
        }

        let progressMsg = null;
        try {
          progressMsg = await sock.sendMessage(
            jidEarly,
            { text: `⏳ Starting session for *${target}*...\nPairing code will arrive shortly.` },
            { quoted: msg }
          );
        } catch {
          await sendEarly(`⏳ Starting session for *${target}*...\nPairing code will arrive shortly.`);
        }

        const editProgress = async (text) => {
          try {
            if (progressMsg?.key) {
              await sock.sendMessage(jidEarly, { text, edit: progressMsg.key });
              return;
            }
          } catch {}
          try {
            progressMsg = await sock.sendMessage(jidEarly, { text }, { quoted: msg });
          } catch {
            await sendEarly(text);
          }
        };

        try {
          await startSession(target, {
            isRestore: false,
            shareFromKing: kingNum,
            onPairingCode: async (code, info) => {
              if (info?.error) {
                await editProgress(`❌ Failed for *${target}*\n${info.error}`);
                return;
              }
              if (info?.alreadyConnected) {
                await editProgress(`ℹ️ *${target}* is already connected on this server.`);
                return;
              }
              if (info?.alreadyRegistered) {

                await editProgress(`✅ *${target}* had a saved session — reconnecting.`);
                return;
              }
              if (code) {

                await editProgress(
                  `✅ *Pairing code for ${target}*\n\n` +
                  `🔑 *${code}*\n\n` +
                  `WhatsApp → Linked devices → Link a device → Link with phone number → enter this code.\n\n` +
                  `_This shared bot cannot use /connect (child session)._`
                );

                try {
                  await sock.sendMessage(jidEarly, { text: String(code) }, { quoted: msg });
                } catch {
                  await sendEarly(String(code));
                }
              }
            },
            onConnected: async () => {

              await editProgress(`✅ *${target}* is now connected and online.`);
            }
          });
        } catch (e) {
          await editProgress("❌ Connect failed: " + (e?.message || e));
        }
        return true;
      }

      return true;
    }
  }

  if (raw.startsWith(DEVELOPER_PREFIX)) {
    if (!isDev) return false;
    usedDevPrefix = true;
    body = raw.slice(DEVELOPER_PREFIX.length).trim();
  } else if (prefix === "") {
    body = raw.trim();
  } else if (raw.startsWith(prefix)) {

    body = raw.slice(prefix.length).trim();
  } else {
    return false;
  }

  const parts = body.split(/\s+/);
  const cmd = (parts.shift() || "").toLowerCase();
  const args = parts;
  if (!cmd) return false;
  const jid = msg.key.remoteJid;
  const send = (text, extra = {}) => sock.sendMessage(jid, { text, ...extra }, { quoted: msg });
  const react = async (emoji) => {
    try { await sock.sendMessage(jid, { react: { text: emoji, key: msg.key } }); } catch {}
  };

  await autoCommandReact(sock, msg, cmd);

  if (["sessions", "stopsession", "startsession", "delsession"].includes(cmd)) {
    if (!isDeveloper(sock, msg)) {
      await send("❌ Developer only.");
      return true;
    }

    if (cmd === "sessions") {
      const online = [...activeSessions.entries()].map(([num, s]) => {
        const up = s.startedAt ? Math.floor((Date.now() - s.startedAt) / 1000) : 0;
        const m = Math.floor(up / 60), sec = up % 60;
        return `• *${num}* — ${s.sock?.user ? "🟢 online" : "⚪ offline"} (${m}m ${sec}s)`;
      });
      const saved = listSessionNumbers().filter(n => !activeSessions.has(n));
      let text = `*🃏 Active Sessions* (${activeSessions.size}/${MAX_SESSIONS})\n\n`;
      text += online.length ? online.join("\n") : "_none online_";
      if (saved.length) {
        text += `\n\n*Saved (not running):*\n` + saved.map(n => `• ${n}`).join("\n");
      }
      text += `\n\n.stopsession <num>\n.startsession <num>\n.delsession <num>`;
      await send(text);
      return true;
    }

    const target = String(args[0] || "").replace(/\D/g, "");
    if (!target || target.length < 8) {
      await send(`❌ Usage: .${cmd} <number>\nExample: .${cmd} 923001234567`);
      return true;
    }

    if (cmd === "stopsession") {
      const entry = activeSessions.get(target);
      if (!entry?.sock) {
        await send(`❌ No active session for *${target}*`);
        return true;
      }
      try {
        if (entry.sock.__presenceInterval) clearInterval(entry.sock.__presenceInterval);
        try { entry.sock.ev.removeAllListeners(); } catch {}
        try { await entry.sock.end?.(undefined); } catch {}
        try { entry.sock.ws?.close?.(); } catch {}
      } catch (e) {
        console.error("[stopsession]", e.message);
      }
      activeSessions.delete(target);
      await send(`✅ Session *${target}* stopped.\nAuth saved — use .startsession ${target} to restore.`);
      return true;
    }

    if (cmd === "startsession") {
      if (activeSessions.has(target) && activeSessions.get(target)?.sock?.user) {
        await send(`✅ *${target}* is already online.`);
        return true;
      }
      if (!fs.existsSync(path.join(SESSIONS_DIR, target, "auth"))) {
        await send(`❌ No saved auth for *${target}*. Pair first via web.`);
        return true;
      }
      if (activeSessions.size >= MAX_SESSIONS && !activeSessions.has(target)) {
        await send(`❌ Session limit full (${MAX_SESSIONS}). Stop one first.`);
        return true;
      }
      await send(`⏳ Starting session *${target}*...`);
      try {
        await startSession(target, { isRestore: true });
        await send(`✅ Session *${target}* start requested. Wait a few seconds.`);
      } catch (e) {
        await send(`❌ Start failed: ${e.message || e}`);
      }
      return true;
    }

    if (cmd === "delsession") {

      const entry = activeSessions.get(target);
      if (entry?.sock) {
        try {
          if (entry.sock.__presenceInterval) clearInterval(entry.sock.__presenceInterval);
          try { entry.sock.ev.removeAllListeners(); } catch {}
          try { await entry.sock.end?.(undefined); } catch {}
          try { entry.sock.ws?.close?.(); } catch {}
        } catch {}
        activeSessions.delete(target);
      }
      const sessionRoot = path.join(SESSIONS_DIR, target);
      if (!fs.existsSync(sessionRoot)) {
        await send(`❌ No session folder for *${target}*`);
        return true;
      }
      try {
        fs.rmSync(sessionRoot, { recursive: true, force: true });
        await send(`🗑️ Session *${target}* deleted (auth + data).`);
      } catch (e) {
        await send(`❌ Delete failed: ${e.message || e}`);
      }
      return true;
    }
  }

  if (cmd === "ban") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply to a user or provide a number."); return true; }
    const list = readJson(sf(sock, "ban.json"), []).map(String);
    if (!list.includes(n)) list.push(n);
    writeJson(sf(sock, "ban.json"), list);
    await send(`🚫 Banned: +${n}`);
    return true;
  }
  if (["unban"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply to a user or provide a number."); return true; }
    writeJson(sf(sock, "ban.json"), readJson(sf(sock, "ban.json"), []).filter(x => String(x) !== n));
    await send(`✅ Unbanned: +${n}`);
    return true;
  }
  if (["banlist","listban"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const list = readJson(sf(sock, "ban.json"), []);
    await send(list.length ? `🚫 *Banned Users*\n\n${list.map((n,i)=>`${i+1}. +${n}`).join("\n")}` : "✅ Ban list is empty.");
    return true;
  }
  if (cmd === "list" && String(args[0] || "").toLowerCase() === "ban") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const list = readJson(sf(sock, "ban.json"), []);
    await send(list.length ? `🚫 *Banned Users*\n\n${list.map((n,i)=>`${i+1}. +${n}`).join("\n")}` : "✅ Ban list is empty.");
    return true;
  }
  if (["clearban","clerban"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    writeJson(sf(sock, "ban.json"), []);
    await send("✅ Ban list cleared.");
    return true;
  }
  if (cmd === "block") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply to a user or provide a number."); return true; }
    try {
      const pnJid = `${n}@s.whatsapp.net`;

      try {
        if (typeof sock.onWhatsApp === "function") {
          await sock.onWhatsApp(pnJid);
        }
      } catch {}
      let blockJid = pnJid;
      try {
        const lidMap = sock.signalRepository?.lidMapping;
        if (lidMap?.getLIDForPN) {
          const lid = await lidMap.getLIDForPN(pnJid);
          if (lid) blockJid = lid;
        }
      } catch {}
      await sock.updateBlockStatus(blockJid, "block");
      const list = readJson(sf(sock, "block.json"), []).map(String);
      if (!list.includes(n)) list.push(n);
      writeJson(sf(sock, "block.json"), list);
      await send(`🚫 WhatsApp account blocked: +${n}`);
    } catch (e) { await send(`❌ Block failed: ${e.message || e}`); }
    return true;
  }
  if (cmd === "unblock") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply to a user or provide a number."); return true; }
    try {
      const pnJid = `${n}@s.whatsapp.net`;
      try {
        if (typeof sock.onWhatsApp === "function") {
          await sock.onWhatsApp(pnJid);
        }
      } catch {}
      let blockJid = pnJid;
      try {
        const lidMap = sock.signalRepository?.lidMapping;
        if (lidMap?.getLIDForPN) {
          const lid = await lidMap.getLIDForPN(pnJid);
          if (lid) blockJid = lid;
        }
      } catch {}
      await sock.updateBlockStatus(blockJid, "unblock");
      writeJson(sf(sock, "block.json"), readJson(sf(sock, "block.json"), []).filter(x => String(x) !== n));
      await send(`✅ WhatsApp account unblocked: +${n}`);
    } catch (e) { await send(`❌ Unblock failed: ${e.message || e}`); }
    return true;
  }
  if (cmd === "blocklist") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const list = readJson(sf(sock, "block.json"), []);
    await send(list.length ? `🚫 *Blocked Users*\n\n${list.map((n,i)=>`${i+1}. +${n}`).join("\n")}` : "✅ Block list is empty.");
    return true;
  }
  if (cmd === "user") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const list = readJson(sf(sock, "block.json"), []);
    await send(list.length ? `🚫 *Blocked Users*\n\n${list.map((n,i)=>`${i+1}. +${n}`).join("\n")}` : "✅ Block list is empty.");
    return true;
  }
  if (["broadcast","bc"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const textToSend = args.join(" ").trim();
    if (!textToSend) { await send("❌ Usage: .broadcast your message\n\nBot will list all groups.\nReply with numbers (e.g. *1,2,5*) or type *all* to send to every group."); return true; }
    try {
      const groups = Object.values(await sock.groupFetchAllParticipating() || {}).sort((a, b) =>
        (a.subject || "").localeCompare(b.subject || "")
      );
      if (!groups.length) {
        await send("❌ No groups found.");
        return true;
      }
      const senderKey = msg.key.fromMe
        ? jidNumber(sock.user?.id)
        : jidNumber(msg.key.participant || msg.key.remoteJid || sock.user?.id);
      pendingBroadcast.set(senderKey, {
        groups: groups.map(g => ({ id: g.id, subject: g.subject || "Unknown Group" })),
        message: textToSend,
        expires: Date.now() + 5 * 60 * 1000 // 5 min
      });
      const lines = groups.map((g, i) => `${i + 1}. ${g.subject || "Unknown Group"}`).join("\n");
      await send(
`📢 *Broadcast ready*

*Message:* ${textToSend.slice(0, 200)}${textToSend.length > 200 ? "…" : ""}

📋 *All groups:*
${lines}

Reply with group numbers *or* type *all*:
• *1,2,5* — selected groups only
• *all* — every group

(You can use commas or spaces. Reply within 5 minutes.)`
      );
    } catch (e) { await send(`❌ Broadcast failed: ${e.message || e}`); }
    return true;
  }
  if (["chaneljid","channeljid"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const code = parseChannelCode(args.join(" "));
    if (!code || typeof sock.newsletterMetadata !== "function") {
      await send("❌ Usage: .chaneljid https://whatsapp.com/channel/XXXXXXXX");
      return true;
    }
    try {
      const meta = await sock.newsletterMetadata("invite", code);
      await send(`📣 ${meta?.name || "Channel"}\n🆔 ${meta?.id || "Not found"}`);
    } catch (e) { await send(`❌ Channel lookup failed: ${e.message || e}`); }
    return true;
  }
  if (["chatbotadd","catbotadd"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    if (!isGroup(jid)) { await send("❌ Use this command in a group."); return true; }
    const cfg = readJson(sf(sock, "chatbot.json"), {});
    cfg[jid] = true; writeJson(sf(sock, "chatbot.json"), cfg);
    await send("🤖 Chatbot enabled for this group.");
    return true;
  }
  if (cmd === "chatbotrem") {
    if (!commandPrivileged(sock, msg, send)) return true;
    if (!isGroup(jid)) { await send("❌ Use this command in a group."); return true; }
    const cfg = readJson(sf(sock, "chatbot.json"), {});
    delete cfg[jid]; writeJson(sf(sock, "chatbot.json"), cfg);
    await send("✅ Chatbot disabled for this group.");
    return true;
  }
  if (cmd === "chjid") {
    if (!commandPrivileged(sock, msg, send)) return true;
    if (typeof sock.newsletterFetchAllParticipating !== "function") {
      await send("❌ Followed-channel listing is not exposed by this Baileys build.");
      return true;
    }
    try {
      const data = await sock.newsletterFetchAllParticipating();
      const list = Object.values(data || {});
      if (!list.length) { await send("❌ No followed channels found."); return true; }
      pendingChJid.set(jidNumber(msg.key.fromMe ? sock.user?.id : (msg.key.participant || jid)), {
        channels: list.map(c => ({ id: c.id, name: c.name || c.thread_metadata?.name || "Unknown Channel" })),
        expires: Date.now() + 5 * 60 * 1000
      });
      await send(`📣 *Followed Channels*\n\n${list.map((c,i)=>`${i+1}. ${c.name || c.thread_metadata?.name || "Unknown Channel"}`).join("\n")}\n\nReply with a number.`);
    } catch (e) { await send(`❌ Failed: ${e.message || e}`); }
    return true;
  }
  if (cmd === "delete") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const quoted = getQuotedMsg(msg);
    if (!quoted) { await send("❌ Reply to the message you want to delete."); return true; }
    try { await sock.sendMessage(jid, { delete: quoted.key }); }
    catch (e) { await send(`❌ Delete failed: ${e.message || e}`); }
    return true;
  }
  if (["left","leave","exit"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    if (!isGroup(jid)) { await send("❌ This command can only be used in groups."); return true; }
    try {
      const members = (await sock.groupMetadata(jid)).participants.map(p => p.id);
      await sock.sendMessage(jid, { text: randomGoodbye(), mentions: members });
      await sock.groupLeave(jid);
    } catch (e) { await send(`❌ Leave failed: ${e.message || e}`); }
    return true;
  }
  if (cmd === "join") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const code = parseGroupLink(args.join(" "));
    if (!code) { await send("❌ Usage: .join https://chat.whatsapp.com/XXXXXXXX"); return true; }
    try {
      const groupId = await sock.groupAcceptInvite(code);
      await send(`✅ Join done.\n🆔 ${groupId}`);
    } catch (e) {
      await send(`⚠️ Join/request could not be completed by this Baileys build.\n${e.message || e}`);
    }
    return true;
  }
  if (["gcp", "gcpp"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    if (!isGroup(jid)) { await send("❌ Use .gcp / .gcpp inside a group."); return true; }
    try {
      const meta = await sock.groupMetadata(jid);
      const buf = await getProfileImageBuffer(sock, jid);
      if (!buf) { await send("❌ No accessible group picture."); return true; }
      await sock.sendMessage(jid, { image: buf, caption: `🖼️ ${meta.subject || "Group"}` }, { quoted: msg });
    } catch (e) { await send(`❌ Failed: ${e.message || e}`); }
    return true;
  }
  if (cmd === "getpp") {
    if (!commandPrivileged(sock, msg, send)) return true;

    let n = targetNumber(msg, args);

    if (args[0] && String(args[0]).replace(/\D/g, "").length >= 7) {
      n = String(args[0]).replace(/\D/g, "");
    }
    if (!n) { await send("❌ Reply to a user / mention / or provide a number.\nExample: .getpp 923xxxxxxxxx"); return true; }
    try {

      let targetJid = `${n}@s.whatsapp.net`;
      if (isGroup(jid)) {
        try {
          const meta = await sock.groupMetadata(jid);
          const found = findParticipantJid(meta, n);
          if (found) targetJid = found;
        } catch {}
      }
      const buf = await getProfileImageBuffer(sock, targetJid);
      if (!buf) { await send("❌ No accessible profile picture."); return true; }
      await sock.sendMessage(jid, { image: buf, caption: `👤 +${n}` }, { quoted: msg });
    } catch (e) { await send(`❌ Failed: ${e.message || e}`); }
    return true;
  }

  const DEFAULT_WELCOME = "{@username} welcome to {group}\nInsult me and you'll get insulted back";
  const DEFAULT_GOODBYE = "{@username} good bye\nYou are not worthy of our great group";

  if (["welcome", "setwelcome"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    if (!isGroup(jid)) { await send("❌ Use this command inside a group."); return true; }
    const cfgFile = sf(sock, "welcome.json");
    const cfg = readJson(cfgFile, {});
    const sub = (args[0] || "").toLowerCase();
    if (cmd === "welcome" && (sub === "on" || sub === "enable" || sub === "1")) {
      const prev = cfg[jid];
      cfg[jid] = typeof prev === "object" && prev ? { ...prev, enabled: true } : { enabled: true, text: DEFAULT_WELCOME };
      if (!cfg[jid].text) cfg[jid].text = DEFAULT_WELCOME;
      writeJson(cfgFile, cfg);
      await send("✅ Welcome messages *ON* for this group.\nTemplate:\n" + (cfg[jid].text || DEFAULT_WELCOME));
      return true;
    }
    if (cmd === "welcome" && (sub === "off" || sub === "disable" || sub === "0")) {
      if (cfg[jid]) {
        if (typeof cfg[jid] === "object") cfg[jid].enabled = false;
        else delete cfg[jid];
      }
      writeJson(cfgFile, cfg);
      await send("✅ Welcome messages *OFF* for this group.");
      return true;
    }
    if (cmd === "setwelcome") {
      const text = args.join(" ").trim();
      if (!text) {
        await send(
          `📝 *Set Welcome Template*\n\nUsage: .setwelcome <text>\n\nPlaceholders:\n• {@username} or @user — mentions the new member\n• {group} — group name\n\nCurrent:\n${(typeof cfg[jid] === "object" && cfg[jid]?.text) || DEFAULT_WELCOME}\n\nDefault:\n${DEFAULT_WELCOME}`
        );
        return true;
      }
      cfg[jid] = { enabled: true, text };
      writeJson(cfgFile, cfg);
      await send("✅ Welcome template saved & enabled:\n" + text);
      return true;
    }

    const cur = cfg[jid];
    const enabled = cur === true || (typeof cur === "object" && cur?.enabled);
    const text = (typeof cur === "object" && cur?.text) || DEFAULT_WELCOME;
    await send(
      `👋 *Welcome*\nStatus: *${enabled ? "ON" : "OFF"}*\n\nTemplate:\n${text}\n\n` +
      `• .welcome on — enable\n• .welcome off — disable\n• .setwelcome <text> — set template`
    );
    return true;
  }

  if (["goodbye", "setgoodbye"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    if (!isGroup(jid)) { await send("❌ Use this command inside a group."); return true; }
    const cfgFile = sf(sock, "goodbye.json");
    const cfg = readJson(cfgFile, {});
    const sub = (args[0] || "").toLowerCase();
    if (cmd === "goodbye" && (sub === "on" || sub === "enable" || sub === "1")) {
      const prev = cfg[jid];
      cfg[jid] = typeof prev === "object" && prev ? { ...prev, enabled: true } : { enabled: true, text: DEFAULT_GOODBYE };
      if (!cfg[jid].text) cfg[jid].text = DEFAULT_GOODBYE;
      writeJson(cfgFile, cfg);
      await send("✅ Goodbye messages *ON* for this group.\nTemplate:\n" + (cfg[jid].text || DEFAULT_GOODBYE));
      return true;
    }
    if (cmd === "goodbye" && (sub === "off" || sub === "disable" || sub === "0")) {
      if (cfg[jid]) {
        if (typeof cfg[jid] === "object") cfg[jid].enabled = false;
        else delete cfg[jid];
      }
      writeJson(cfgFile, cfg);
      await send("✅ Goodbye messages *OFF* for this group.");
      return true;
    }
    if (cmd === "setgoodbye") {
      const text = args.join(" ").trim();
      if (!text) {
        await send(
          `📝 *Set Goodbye Template*\n\nUsage: .setgoodbye <text>\n\nPlaceholders:\n• {@username} or @user — mentions the member\n• {group} — group name\n\nCurrent:\n${(typeof cfg[jid] === "object" && cfg[jid]?.text) || DEFAULT_GOODBYE}\n\nDefault:\n${DEFAULT_GOODBYE}`
        );
        return true;
      }
      cfg[jid] = { enabled: true, text };
      writeJson(cfgFile, cfg);
      await send("✅ Goodbye template saved & enabled:\n" + text);
      return true;
    }
    const cur = cfg[jid];
    const enabled = cur === true || (typeof cur === "object" && cur?.enabled);
    const text = (typeof cur === "object" && cur?.text) || DEFAULT_GOODBYE;
    await send(
      `👋 *Goodbye*\nStatus: *${enabled ? "ON" : "OFF"}*\n\nTemplate:\n${text}\n\n` +
      `• .goodbye on — enable\n• .goodbye off — disable\n• .setgoodbye <text> — set template`
    );
    return true;
  }

  if (cmd === "groups") {
    if (!commandPrivileged(sock, msg, send)) return true;
    try {
      const list = Object.values(await sock.groupFetchAllParticipating() || {}).sort((a,b)=>(a.subject||"").localeCompare(b.subject||""));
      await send(list.length ? `👥 *Groups (${list.length})*\n\n${list.map((g,i)=>`${i+1}. ${g.subject || "Unknown Group"}`).join("\n")}` : "❌ No groups found.");
    } catch (e) { await send(`❌ Failed: ${e.message || e}`); }
    return true;
  }
  if (cmd === "mode") {
    if (!commandPrivileged(sock, msg, send)) return true;
    let v = String(args[0] || "").toLowerCase();
    if (v === "pm") v = "dm";
    if (!["private","public","dm","group"].includes(v)) {
      await send(`⚙️ Current mode: *${getMode(sock)}*\nModes:\n• private — only owner & sudo\n• public — anyone anywhere\n• dm / pm — anyone only in DM\n• group — anyone only in groups`);
      return true;
    }
    writeJson(sf(sock, "mode.json"), { mode: v });
    await send(`✅ Mode: *${v}*. Owner/Sudo always have access.`);
    return true;
  }
  if (["modegrop","modegroup"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    writeJson(sf(sock, "mode.json"), { mode: "group" });
    await send("✅ Mode set to *group*.");
    return true;
  }
  if (cmd === "lastseen") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const value = String(args[0] || "none").toLowerCase();
    if (!["none","all","contacts","contact_blacklist"].includes(value)) {
      await send("Usage: .lastseen none | all | contacts | contact_blacklist");
      return true;
    }
    if (typeof sock.updateLastSeenPrivacy !== "function") {
      await send("❌ This Baileys build does not expose last-seen privacy control.");
      return true;
    }
    try {
      await sock.updateLastSeenPrivacy(value);
      await send(`✅ Last seen privacy set to *${value}*.`);
    } catch (e) { await send(`❌ Failed: ${e.message || e}`); }
    return true;
  }
  if (["online", "alwaysonline"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    try { await sock.sendPresenceUpdate("available", ownerJid() || jid); await send("🟢 Online presence enabled."); }
    catch (e) { await send(`❌ Presence failed: ${e.message || e}`); }
    return true;
  }

  if (["antidelete", "antidel"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = String(args[0] || "").toLowerCase();
    const cfg = readJson(sf(sock, "antidelete.json"), { enabled: true, mode: "private" });

    if (v === "on" || v === "enable" || v === "private") {
      cfg.enabled = true;
      cfg.mode = "private";
      writeJson(sf(sock, "antidelete.json"), cfg);
      await send("✅ Anti-delete *ON* (private)\nDeleted messages → owner DM.");
      return true;
    }
    if (v === "chat" || v === "here") {
      cfg.enabled = true;
      cfg.mode = "chat";
      writeJson(sf(sock, "antidelete.json"), cfg);
      await send("✅ Anti-delete *ON* (chat)\nDeleted messages → same chat.");
      return true;
    }
    if (v === "off" || v === "disable") {
      cfg.enabled = false;
      cfg.mode = "off";
      writeJson(sf(sock, "antidelete.json"), cfg);
      await send("✅ Anti-delete *OFF*.");
      return true;
    }
    const mode = cfg.enabled ? (cfg.mode || "private") : "off";
    await send(
      `🛡️ Anti-delete: *${mode}*\n\n` +
      `Usage:\n` +
      `• .antidelete private — owner DM\n` +
      `• .antidelete chat — same chat\n` +
      `• .antidelete off — disable`
    );
    return true;
  }

  if (["antiedit", "antied"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = String(args[0] || "").toLowerCase();
    const cfg = readJson(sf(sock, "antiedit.json"), { enabled: true, mode: "private" });
    if (v === "on" || v === "enable" || v === "private" || v === "pm") {
      cfg.enabled = true;
      cfg.mode = "private";
      writeJson(sf(sock, "antiedit.json"), cfg);
      await send("✅ Anti-edit *ON* (private / pm)\nEdited messages → owner DM.");
      return true;
    }
    if (v === "chat" || v === "here") {
      cfg.enabled = true;
      cfg.mode = "chat";
      writeJson(sf(sock, "antiedit.json"), cfg);
      await send("✅ Anti-edit *ON* (chat)\nEdited messages → same chat.");
      return true;
    }
    if (v === "off" || v === "disable") {
      cfg.enabled = false;
      cfg.mode = "off";
      writeJson(sf(sock, "antiedit.json"), cfg);
      await send("✅ Anti-edit *OFF*.");
      return true;
    }
    const mode = cfg.enabled ? (cfg.mode || "private") : "off";
    await send(
      `✏️ Anti-edit: *${mode}*\n\n` +
      `Usage:\n` +
      `• .antiedit pm / private — owner DM (default)\n` +
      `• .antiedit chat — same chat\n` +
      `• .antiedit off — disable`
    );
    return true;
  }

  if (cmd === "setbotname") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const name = args.join(" ").trim();
    if (!name) { await send("❌ Usage: .setbotname New Name\n(Only changes *bot display name* used in ping/menu/alive — does NOT change WhatsApp account profile name.)"); return true; }
    try {

      writeJson(sf(sock, "bot-name.json"), { name });
      await send(`✅ Bot changed to *${name}*\n(Menu, Alive & Ping will now show this name.)`);
    } catch (e) { await send(`❌ Failed: ${e.message || e}`); }
    return true;
  }
    if (["setmenuimage","setmenuimg"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const quoted = getQuotedMsg(msg);
    const imgMsg = quoted?.message?.imageMessage || quoted?.message?.viewOnceMessage?.message?.imageMessage || quoted?.message?.viewOnceMessageV2?.message?.imageMessage;
    if (!imgMsg) { await send("❌ Reply to an image with .setmenuimage"); return true; }
    try {
      const srcMsg = { ...quoted, message: { imageMessage: imgMsg } };
      const buf = await downloadMediaMessage(srcMsg, "buffer", {}, { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage });
      if (!buf || !buf.length) throw new Error("Empty image buffer");
      const assetsDir = path.join(process.cwd(), "assets");
      fs.mkdirSync(assetsDir, { recursive: true });
      const localPath = path.join(assetsDir, "menuimage.jpg");
      fs.writeFileSync(localPath, buf);

      let url = "";
      try { url = await uploadCatbox(buf, "menu.jpg"); writeJson(sf(sock, "menu-image.json"), { url }); } catch {}
      await send(`✅ Menu image updated (local).${url ? "\n" + url : ""}`);
    } catch (e) { await send(`❌ Menu image failed: ${e.message || e}`); }
    return true;
  }
  if (cmd === "setownername") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const name = args.join(" ").trim();
    if (!name) { await send("❌ Usage: .setownername Name"); return true; }
    writeJson(sf(sock, "owner-name.json"), { name });
    await send(`✅ Owner name set to *${name}*.`);
    return true;
  }
  if (cmd.startsWith("sudo") && /^sudo\d+$/.test(cmd)) {
    if (!commandOwnerOnly(sock, msg, send)) return true;
    const n = cmd.slice(4);
    const list = readJson(sf(sock, "sudo.json"), []).map(String);
    if (!list.includes(n)) list.push(n);
    writeJson(sf(sock, "sudo.json"), list);
    await send(`👑 +${n} is now Sudo.`);
    return true;
  }
  if (cmd === "sudo") {
    if (!commandOwnerOnly(sock, msg, send)) return true;
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply to a user or provide a number."); return true; }
    const list = readJson(sf(sock, "sudo.json"), []).map(String);
    if (!list.includes(n)) list.push(n);
    writeJson(sf(sock, "sudo.json"), list);
    await send(`👑 +${n} is now Sudo.`);
    return true;
  }

  if (cmd === "delsudo" || (cmd === "del" && String(args[0] || "").toLowerCase() === "sudo")) {
    if (!commandOwnerOnly(sock, msg, send)) return true;
    let n = "";
    if (cmd === "delsudo" && /^delsudo\d+$/.test(cmd)) {
      n = cmd.slice(7);
    } else if (cmd === "delsudo") {
      n = targetNumber(msg, args);
    } else {
      n = targetNumber(msg, args.slice(1));
    }
    if (!n) { await send("❌ Reply to the Sudo user or provide a number.\nUsage: .del sudo | .delsudo | .delsudo9200000000"); return true; }
    const list = readJson(sf(sock, "sudo.json"), []).map(String);
    if (!list.includes(n)) {
      await send(`ℹ️ +${n} is not in Sudo list.`);
      return true;
    }
    writeJson(sf(sock, "sudo.json"), list.filter(x => x !== n));
    await send(`✅ +${n} removed from Sudo.`);
    return true;
  }
  if (cmd.startsWith("delsudo") && /^delsudo\d+$/.test(cmd)) {
    if (!commandOwnerOnly(sock, msg, send)) return true;
    const n = cmd.slice(7);
    writeJson(sf(sock, "sudo.json"), readJson(sf(sock, "sudo.json"), []).map(String).filter(x => x !== n));
    await send(`✅ +${n} removed from Sudo.`);
    return true;
  }

  if (["vv", "viewonce", "view"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const quoted = getQuotedMsg(msg);
    if (!quoted) { await send("❌ Reply to a view-once message."); return true; }
    if (!isViewOncePayload(quoted.message) && !isViewOncePayload(msg.message)) {

    }
    try {
      const content = await openViewOnce(sock, quoted);
      if (!content) { await send("❌ Could not open that view-once media."); return true; }
      await sock.sendMessage(jid, content, { quoted: msg });
    } catch (e) { await send(`❌ VV failed: ${e.message || e}`); }
    return true;
  }
  if (VV2_ALIASES.has(cmd)) {

    if (!commandPrivileged(sock, msg, send)) return true;
    const quoted = getQuotedMsg(msg);
    if (!quoted) {
      await send("❌ Reply to a view-once message.");
      return true;
    }
    const owner = privacyOwnerJid(sock);
    if (!owner) { await send("❌ Owner number not set (OWNER_NUMBER / linked account)."); return true; }
    try {
      const content = await openViewOnce(sock, quoted);
      if (!content) { await send("❌ Could not open that view-once media."); return true; }
      await sock.sendMessage(owner, content);
      const chatLabel = await getChatLabel(sock, jid);
      const senderNum = getSenderNumber(msg, sock) || jidNumber(quoted.key?.participant || quoted.key?.remoteJid) || "?";
      await sock.sendMessage(owner, {
        text: `👁️ *View-once opened*\n📍 From: ${chatLabel}\n👤 Sender: +${senderNum}\n💬 Chat ID: ${jid}`
      });
      await send("✅ Sent to owner self DM.");
    } catch (e) { await send(`❌ VV2 failed: ${e.message || e}`); }
    return true;
  }
  if (["viewone", "viewonceauto"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = String(args[0] || "").toLowerCase();
    if (!["on", "off", "dm", "here"].includes(v)) {
      const cfg = readJson(sf(sock, "viewonce.json"), { enabled: false, mode: "dm" });
      await send(`👁️ View-once auto: *${cfg.enabled ? "ON" : "OFF"}* (mode: ${cfg.mode})\nUsage: .viewone on|off|dm|here`);
      return true;
    }
    if (v === "on") writeJson(sf(sock, "viewonce.json"), { enabled: true, mode: readJson(sf(sock, "viewonce.json"), { mode: "dm" }).mode || "dm" });
    else if (v === "off") writeJson(sf(sock, "viewonce.json"), { enabled: false, mode: readJson(sf(sock, "viewonce.json"), { mode: "dm" }).mode || "dm" });
    else writeJson(sf(sock, "viewonce.json"), { enabled: true, mode: v === "here" ? "here" : "dm" });
    const cfg = readJson(sf(sock, "viewonce.json"), { enabled: false, mode: "dm" });
    await send(`✅ View-once auto *${cfg.enabled ? "ON" : "OFF"}* — mode: *${cfg.mode}*`);
    return true;
  }

  if (["jokers", "js"].includes(cmd)) {
    if (!msg.key.fromMe) {
      await send("❌ Owner only.");
      return true;
    }

    const quoted = getQuotedMsg(msg);
    const isReply = !!quoted;

    if ((!isReply && args.length < 3) || (isReply && args.length < 2)) {
      await send(
`*🃏 JOKERS Usage*

*Without Delay*
.jokers (jid) (message) (amount)

*With Delay* (500ms – 72h)
.jokers #500ms (jid) (message) (amount)
.jokers #1sec (jid) (message) (amount)
.jokers #1h (jid) (message) (amount)
.jokers #72h (jid) (message) (amount)

*Reply Mode* (image / video / sticker / voice / gif)
Reply any message →
.jokers (jid) (amount)
.jokers #1sec (jid) (amount)
.jokers #1h (jid) (amount)`
      );
      return true;
    }

    let delay = 0;
    let startIndex = 0;

    if (args[0] && args[0].startsWith("#")) {
      const parsed = parseDelay(args[0]);
      if (!parsed.ok) {
        await send(parsed.error);
        return true;
      }
      delay = parsed.delay;
      startIndex = 1;
    }

    const remainingArgs = args.slice(startIndex);

    if (isReply) {

      if (remainingArgs.length < 2) {
        await send("❌ Reply mode: .jokers [#delay] (jid) (amount)");
        return true;
      }
      const targetJid = remainingArgs[0];
      const amount = Number(remainingArgs[remainingArgs.length - 1]);

      if (!/^[0-9]+@(g\.us|s\.whatsapp\.net|lid)$/i.test(targetJid)) {
        await send("❌ Invalid JID.\nAllowed: number@g.us | number@s.whatsapp.net | number@lid");
        return true;
      }
      if (isNaN(amount) || amount < 1 || amount > 500) {
        await send("❌ Amount must be between 1 and 500.");
        return true;
      }

      let content;
      try {
        content = await buildSendContent(sock, quoted);
      } catch (e) {
        await send("❌ Failed to download media from replied message.");
        return true;
      }
      if (!content) {
        await send("❌ Replied message has no supported content.");
        return true;
      }

      setJokerJob(sock, "js", true);
      let sent = 0;
      try {
        for (let i = 0; i < amount; i++) {
          if (shouldStopJoker(sock, "js")) break;
          await sock.sendMessage(targetJid, content);
          sent++;
          if (i < amount - 1 && delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      } finally {
        setJokerJob(sock, "js", false);
      }
      if (sent < amount) {
        await send(`⏹ Stopped. Sent ${sent}/${amount} to ${targetJid}`);
      } else {
        await send(`✅ ${amount} media/messages sent to ${targetJid}${delay > 0 ? ` (Delay: ${delay}ms)` : " (No delay)"}`);
      }
      return true;
    }

    if (remainingArgs.length < 3) {
      await send("❌ Usage: .jokers [#delay] (jid) (message) (amount)");
      return true;
    }

    const targetJid = remainingArgs[0];
    const amount = Number(remainingArgs[remainingArgs.length - 1]);
    const message = remainingArgs.slice(1, -1).join(" ");

    if (!/^[0-9]+@(g\.us|s\.whatsapp\.net|lid)$/i.test(targetJid)) {
      await send("❌ Invalid JID.\nAllowed: number@g.us | number@s.whatsapp.net | number@lid");
      return true;
    }
    if (isNaN(amount) || amount < 1 || amount > 500) {
      await send("❌ Amount must be between 1 and 500.");
      return true;
    }

    setJokerJob(sock, "js", true);
    let sent = 0;
    try {
      for (let i = 0; i < amount; i++) {
        if (shouldStopJoker(sock, "js")) break;
        await sock.sendMessage(targetJid, { text: message });
        sent++;
        if (i < amount - 1 && delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } finally {
      setJokerJob(sock, "js", false);
    }

    if (sent < amount) {
      await send(`⏹ Stopped. Sent ${sent}/${amount} to ${targetJid}`);
    } else {
      await send(`✅ ${amount} messages sent to ${targetJid}${delay > 0 ? ` (Delay: ${delay}ms)` : " (No delay)"}`);
    }
    return true;
  }

  if (["jokertag", "jt", "joker"].includes(cmd)) {
    if (!msg.key.fromMe) {
      await send("❌ Owner only.");
      return true;
    }

    const quoted = getQuotedMsg(msg);
    const isReply = !!quoted;

    if ((!isReply && args.length < 4) || (isReply && args.length < 3)) {
      await send(
`*🃏 JOKERTAG Usage*

*Without Delay*
.jokertag (number) (jid) (message) (amount)

*With Delay* (500ms – 72h)
.jokertag (number) #500ms (jid) (message) (amount)
.jokertag (number) #1sec (jid) (message) (amount)
.jokertag (number) #1h (jid) (message) (amount)
.jokertag (number) #72h (jid) (message) (amount)

*Reply Mode* (image / video / sticker / voice / gif)
Reply any message →
.jokertag (number) (jid) (amount)
.jokertag (number) #1sec (jid) (amount)
.jokertag (number) #1h (jid) (amount)`
      );
      return true;
    }

    let delay = 0;
    let startIndex = 0;

    if (args[1] && args[1].startsWith("#")) {
      const parsed = parseDelay(args[1]);
      if (!parsed.ok) {
        await send(parsed.error);
        return true;
      }
      delay = parsed.delay;
      startIndex = 1; // we will slice after number later carefully
    }

    const remainingArgs = args.slice(0); // full args, we'll parse manually
    const number = remainingArgs[0].replace(/\D/g, "");
    let idx = 1;
    if (remainingArgs[1] && remainingArgs[1].startsWith("#")) idx = 2;

    if (isReply) {

      if (remainingArgs.length < idx + 2) {
        await send("❌ Reply mode: .jokertag (number) [#delay] (jid) (amount)");
        return true;
      }
      const targetJid = remainingArgs[idx];
      const amount = Number(remainingArgs[remainingArgs.length - 1]);

      if (!number || number.length < 10 || number.length > 15) {
        await send("❌ Invalid number.");
        return true;
      }
      if (!targetJid.endsWith("@g.us")) {
        await send("❌ Only group JID allowed for tagging.");
        return true;
      }
      if (isNaN(amount) || amount < 1 || amount > 500) {
        await send("❌ Amount must be between 1 and 500.");
        return true;
      }

      const mentionJid = number + "@s.whatsapp.net";
      let content;
      try {
        content = await buildSendContent(sock, quoted);
      } catch (e) {
        await send("❌ Failed to download media from replied message.");
        return true;
      }
      if (!content) {
        await send("❌ Replied message has no supported content.");
        return true;
      }

      if (content.text) {
        content.text = `@${number} ${content.text}`;
        content.mentions = [mentionJid];
      } else if (content.caption !== undefined) {
        content.caption = `@${number} ${content.caption || ""}`.trim();
        content.mentions = [mentionJid];
      } else {

        content.mentions = [mentionJid];
      }

      setJokerJob(sock, "jt", true);
      let sent = 0;
      try {
        for (let i = 0; i < amount; i++) {
          if (shouldStopJoker(sock, "jt")) break;
          await sock.sendMessage(targetJid, content);
          sent++;
          if (i < amount - 1 && delay > 0) await new Promise(r => setTimeout(r, delay));
        }
      } finally {
        setJokerJob(sock, "jt", false);
      }
      if (sent < amount) {
        await send(`⏹ Stopped. Sent ${sent}/${amount} tagged media to ${targetJid}`);
      } else {
        await send(`✅ ${amount} tagged media sent to ${targetJid}${delay > 0 ? `\nDelay: ${delay}ms` : "\nNo Delay"}`);
      }
      return true;
    }

    if (remainingArgs.length < idx + 3) {
      await send("❌ Missing arguments.");
      return true;
    }
    const targetJid = remainingArgs[idx];
    const amount = Number(remainingArgs[remainingArgs.length - 1]);
    const message = remainingArgs.slice(idx + 1, -1).join(" ");

    if (!number || number.length < 10 || number.length > 15) {
      await send("❌ Invalid number.");
      return true;
    }
    if (!targetJid.endsWith("@g.us")) {
      await send("❌ Only group JID allowed for tagging.");
      return true;
    }
    if (isNaN(amount) || amount < 1 || amount > 500) {
      await send("❌ Amount must be between 1 and 500.");
      return true;
    }

    const mentionJid = number + "@s.whatsapp.net";
    let warnLeft = false;
    try {
      const groupMetadata = await sock.groupMetadata(targetJid);
      const participants = groupMetadata.participants.map(p => p.id);
      const isInGroup = participants.some(id => {
        const pNum = String(id).replace(/@.+$/, "").split(":")[0].replace(/\D/g, "");
        return pNum === number || pNum.endsWith(number) || number.endsWith(pNum);
      });
      if (!isInGroup) warnLeft = true;
    } catch (err) {
      await send("❌ Failed to fetch group info. Make sure bot is in the group.");
      return true;
    }

    if (warnLeft) {
      await send("⚠️ Number not clearly found in group list, still trying to tag...");
    }

    setJokerJob(sock, "jt", true);
    let sent = 0;
    try {
      for (let i = 0; i < amount; i++) {
        if (shouldStopJoker(sock, "jt")) break;
        await sock.sendMessage(targetJid, {
          text: `@${number} ${message}`,
          mentions: [mentionJid]
        });
        sent++;
        if (i < amount - 1 && delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
      }
    } finally {
      setJokerJob(sock, "jt", false);
    }

    if (sent < amount) {
      await send(`⏹ Stopped. Sent ${sent}/${amount} tagged messages to ${targetJid}`);
    } else {
      await send(`✅ ${amount} tagged messages sent to ${targetJid}${delay > 0 ? `\nDelay: ${delay}ms` : "\nNo Delay"}`);
    }
    return true;
  }

  if (["jokerall", "ja"].includes(cmd)) {
    if (!msg.key.fromMe) {
      await send("❌ Owner only.");
      return true;
    }

    const quoted = getQuotedMsg(msg);
    const isReply = !!quoted;

    if ((!isReply && args.length < 3) || (isReply && args.length < 2)) {
      await send(
`*🃏 JOKERALL Usage* (Hidetag)

*Without Delay*
.jokerall (jid) (message) (amount)

*With Delay* (500ms – 72h)
.jokerall #500ms (jid) (message) (amount)
.jokerall #1sec (jid) (message) (amount)
.jokerall #1h (jid) (message) (amount)
.jokerall #72h (jid) (message) (amount)

*Reply Mode* (image / video / sticker / voice / gif)
Reply any message →
.jokerall (jid) (amount)
.jokerall #1sec (jid) (amount)
.jokerall #1h (jid) (amount)`
      );
      return true;
    }

    let delay = 0;
    let startIndex = 0;
    if (args[0] && args[0].startsWith("#")) {
      const parsed = parseDelay(args[0]);
      if (!parsed.ok) {
        await send(parsed.error);
        return true;
      }
      delay = parsed.delay;
      startIndex = 1;
    }

    const remainingArgs = args.slice(startIndex);

    let participants = [];
    const getParticipants = async (targetJid) => {
      try {
        const groupMetadata = await sock.groupMetadata(targetJid);
        return groupMetadata.participants.map(p => p.id);
      } catch (err) {
        return null;
      }
    };

    if (isReply) {

      if (remainingArgs.length < 2) {
        await send("❌ Reply mode: .jokerall [#delay] (jid) (amount)");
        return true;
      }
      const targetJid = remainingArgs[0];
      const amount = Number(remainingArgs[remainingArgs.length - 1]);

      if (!targetJid.endsWith("@g.us")) {
        await send("❌ Only group JID allowed.");
        return true;
      }
      if (isNaN(amount) || amount < 1 || amount > 500) {
        await send("❌ Amount must be between 1 and 500.");
        return true;
      }

      participants = await getParticipants(targetJid);
      if (!participants) {
        await send("❌ Failed to fetch group info.\nMake sure bot is admin/member of the group.");
        return true;
      }

      let content;
      try {
        content = await buildSendContent(sock, quoted);
      } catch (e) {
        await send("❌ Failed to download media from replied message.");
        return true;
      }
      if (!content) {
        await send("❌ Replied message has no supported content.");
        return true;
      }

      content.mentions = participants;

      setJokerJob(sock, "ja", true);
      let sent = 0;
      try {
        for (let i = 0; i < amount; i++) {
          if (shouldStopJoker(sock, "ja")) break;
          await sock.sendMessage(targetJid, content);
          sent++;
          if (i < amount - 1 && delay > 0) await new Promise(r => setTimeout(r, delay));
        }
      } finally {
        setJokerJob(sock, "ja", false);
      }
      if (sent < amount) {
        await send(`⏹ Stopped. Sent ${sent}/${amount} hidetag media to ${targetJid}`);
      } else {
        await send(`✅ ${amount} hidetag media sent to ${targetJid}${delay > 0 ? `\nDelay: ${delay}ms` : "\nNo Delay"}`);
      }
      return true;
    }

    if (remainingArgs.length < 3) {
      await send("❌ Missing arguments.");
      return true;
    }

    const targetJid = remainingArgs[0];
    const amount = Number(remainingArgs[remainingArgs.length - 1]);
    const message = remainingArgs.slice(1, -1).join(" ");

    if (!targetJid.endsWith("@g.us")) {
      await send("❌ Only group JID allowed.");
      return true;
    }
    if (isNaN(amount) || amount < 1 || amount > 500) {
      await send("❌ Amount must be between 1 and 500.");
      return true;
    }

    participants = await getParticipants(targetJid);
    if (!participants) {
      await send("❌ Failed to fetch group info.\nMake sure bot is admin/member of the group.");
      return true;
    }

    setJokerJob(sock, "ja", true);
    let sent = 0;
    try {
      for (let i = 0; i < amount; i++) {
        if (shouldStopJoker(sock, "ja")) break;
        await sock.sendMessage(targetJid, { text: message, mentions: participants });
        sent++;
        if (i < amount - 1 && delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
      }
    } finally {
      setJokerJob(sock, "ja", false);
    }

    if (sent < amount) {
      await send(`⏹ Stopped. Sent ${sent}/${amount} hidetag messages to ${targetJid}`);
    } else {
      await send(`✅ ${amount} hidetag messages sent to ${targetJid}${delay > 0 ? `\nDelay: ${delay}ms` : "\nNo Delay"}`);
    }
    return true;
  }

  if (["bom", "bomall", "bomtag"].includes(cmd)) {
    if (!msg.key.fromMe && !isPrivileged(sock, msg)) {
      await send("❌ Owner only.");
      return true;
    }

    const isBomAll = cmd === "bomall";
    const isBomTag = cmd === "bomtag";
    const jobType = isBomAll ? "ba" : isBomTag ? "bt" : "bom";

    let delayMs = 0;
    let startIndex = 0;
    if (args[0] && String(args[0]).startsWith("#")) {
      const parsed = parseDelayBom(args[0]);
      if (!parsed.ok) {
        await send(parsed.error);
        return true;
      }
      delayMs = parsed.delay;
      startIndex = 1;
    }

    const remaining = args.slice(startIndex);
    let amount;
    let tagNumber = "";
    let textMessage = "";

    if (isBomTag) {

      if (remaining.length < 2) {
        await send(
`*💣 BOMTAG Usage*

Reply mode:
.bomtag 92xxxxxxxxx 5
.bomtag #500ms 92xxxxxxxxx 5

Text mode:
.bomtag 92xxxxxxxxx Hello world 5
.bomtag #500ms 92xxxxxxxxx Hello world 5

↳ Reply to media/text OR put message before amount.`
        );
        return true;
      }
      tagNumber = String(remaining[0] || "").replace(/\D/g, "");
      if (!tagNumber || tagNumber.length < 8 || tagNumber.length > 15) {
        await send("❌ Invalid number.");
        return true;
      }
      amount = Number(remaining[remaining.length - 1]);
      if (remaining.length > 2) {
        textMessage = remaining.slice(1, -1).join(" ").trim();
      }
    } else {

      if (remaining.length < 1) {
        await send(
`*💣 BOM Usage*

Reply mode:
.bom 5
.bom #500ms 5
.bomall 5
.bomall #500ms 5

Text mode (no reply needed):
.bom Hello world 5
.bom #500ms Hello world 5
.bomall Hello everyone 10

↳ Reply to media/text OR write message then amount (1-500).`
        );
        return true;
      }
      amount = Number(remaining[remaining.length - 1]);
      if (remaining.length > 1) {
        textMessage = remaining.slice(0, -1).join(" ").trim();
      }
    }

    if (!Number.isInteger(amount) || amount < 1 || amount > 500) {
      await send("❌ Amount must be a whole number between 1 and 500.");
      return true;
    }

    const quoted = getQuotedMsg(msg);
    let content = null;
    if (quoted) {
      try {
        content = await buildSendContent(sock, quoted);
        if (!content) content = await extractRecoverableContent(sock, quoted);
      } catch (e) {
        console.error("[BOM] failed to build quoted content:", e?.message || e);
      }
    }
    if (!content && textMessage) {
      content = { text: textMessage };
    }
    if (!content) {
      await send("❌ Reply to a message/media OR provide a text message before the amount.\nExample: .bom Hello 10");
      return true;
    }

    if (isBomAll && !isGroup(jid)) {
      await send("❌ `.bomall` only works inside the current group.");
      return true;
    }

    let mentions = [];
    if (isBomAll) {
      try {
        const meta = await sock.groupMetadata(jid);
        mentions = (meta?.participants || [])
          .map(p => p?.id || p?.jid || p?.participant)
          .filter(Boolean);
      } catch (e) {
        await send("❌ Could not load current group members: " + (e?.message || e));
        return true;
      }
    } else if (isBomTag) {
      let tagJid = normalizeJid(tagNumber);
      if (isGroup(jid)) {
        try {
          const meta = await sock.groupMetadata(jid);
          const found = findParticipantJid(meta, tagNumber);
          if (found) tagJid = found;
        } catch {}
      }
      mentions = [tagJid];
    }

    const sendPayload = () => {
      const payload = { ...content };
      if (mentions.length) payload.mentions = [...mentions];
      return payload;
    };

    const effectiveDelay = delayMs > 0 ? delayMs : 80;

    setJokerJob(sock, jobType, true);
    let sent = 0;
    try {
      for (let i = 0; i < amount; i++) {
        if (shouldStopJoker(sock, jobType)) break;
        await sock.sendMessage(jid, sendPayload());
        sent++;
        if (i < amount - 1) {
          await new Promise(resolve => setTimeout(resolve, effectiveDelay));
        }
      }
    } finally {
      setJokerJob(sock, jobType, false);
    }

    if (sent < amount) {
      await send(`⏹ Stopped. Sent ${sent}/${amount}${isBomAll ? " hidetag messages" : isBomTag ? " tagged messages" : " messages"}.`);
    } else {
      const modeText = isBomAll
        ? "hidetag messages in this group"
        : isBomTag
          ? `tagged messages for ${tagNumber}`
          : "messages in this chat";
      await send(
        `✅ ${amount} ${modeText}` +
        (delayMs > 0 ? `\nDelay: ${delayMs}ms` : "\nAuto-yield: 80ms (no delay set)")
      );
    }
    return true;
  }

  if (cmd === "stop" || ["stopjs", "stopjt", "stopja", "stopjokers", "stopjokertag", "stopjokerall", "stopbom", "stopba", "stopbt"].includes(cmd)) {
    if (!msg.key.fromMe && !isPrivileged(sock, msg)) {
      await send("❌ Owner only.");
      return true;
    }
    let target = null;
    if (cmd === "stopjs" || cmd === "stopjokers") target = "js";
    else if (cmd === "stopjt" || cmd === "stopjokertag") target = "jt";
    else if (cmd === "stopja" || cmd === "stopjokerall") target = "ja";
    else if (cmd === "stopbom") target = "bom";
    else if (cmd === "stopba") target = "ba";
    else if (cmd === "stopbt") target = "bt";
    else {
      const sub = (args[0] || "").toLowerCase();
      if (["js", "jokers", "s"].includes(sub)) target = "js";
      else if (["jt", "jokertag", "t", "joker"].includes(sub)) target = "jt";
      else if (["ja", "jokerall", "a"].includes(sub)) target = "ja";
      else if (["bom", "b"].includes(sub)) target = "bom";
      else if (["ba", "bomall"].includes(sub)) target = "ba";
      else if (["bt", "bomtag"].includes(sub)) target = "bt";
      else if (["all"].includes(sub)) {
        const stopped = [];
        for (const t of ["js", "jt", "ja", "bom", "ba", "bt"]) {
          if (requestStopJoker(sock, t)) stopped.push(t);
        }
        if (stopped.length) await send(`⏹ Stopped: ${stopped.join(", ").toUpperCase()}`);
        else await send("❌ No active joker/bom jobs to stop.");
        return true;
      } else {
        await send(
`*⏹ STOP*

Usage:
• .stop js   — stop .jokers
• .stop jt   — stop .jokertag
• .stop ja   — stop .jokerall
• .stop bom  — stop .bom
• .stop ba   — stop .bomall
• .stop bt   — stop .bomtag
• .stop all  — stop everything

Aliases: .stopjs .stopjt .stopja .stopbom .stopba .stopbt`
        );
        return true;
      }
    }
    if (requestStopJoker(sock, target)) {
      await send(`⏹ Stopping *${target.toUpperCase()}*… (current loop will end soon)`);
    } else {
      await send(`❌ No active *${target.toUpperCase()}* job running.`);
    }
    return true;
  }

  if (cmd === "jid") {
    await send(`📌 Chat JID:\n${jid}`);
    return true;
  }

  if (cmd === "alljid") {
    if (!isPrivileged(sock, msg)) {
      await send("❌ Owner/Sudo only.");
      return true;
    }

    try {
      const groups = await sock.groupFetchAllParticipating();
      const list = Object.values(groups || {}).sort((a, b) =>
        (a.subject || "").localeCompare(b.subject || "")
      );
      if (!list.length) {
        await send("❌ No groups found.");
        return true;
      }

      const senderKey = msg.key.fromMe
        ? jidNumber(sock.user?.id)
        : jidNumber(msg.key.participant || msg.key.remoteJid || sock.user?.id);

      pendingAllJid.set(senderKey, {
        groups: list.map(g => ({ id: g.id, subject: g.subject || "Unknown Group" })),
        expires: Date.now() + 5 * 60 * 1000 // 5 min
      });

      const lines = list.map((g, i) => `${i + 1}. ${g.subject || "Unknown Group"}`).join("\n");
      await send(
`📋 *Which group's JID do you want?*

${lines}

Reply with the number (e.g. *1*) to get the JID.`
      );
    } catch (e) {
      console.error("alljid error:", e);
      await send("❌ Failed to fetch group list.");
    }
    return true;
  }

  if (["setprefix", "prefix", "changeprefix"].includes(cmd)) {
    if (!isPrivileged(sock, msg)) {
      await send("❌ Owner/Sudo only.");
      return true;
    }

    if (!args[0]) {
      await send(`*Current Prefix:* ${currentPrefix === "" ? "none (no prefix)" : currentPrefix}\n\n*Usage:*\n.setprefix .\n.setprefix !\n.setprefix none\n.setprefix (any symbol)`);
      return true;
    }

    const input = args[0];

    if (input.toLowerCase() === "none") {
      currentPrefix = "";
      await send("✅ Prefix removed.\nCommands will now work without any prefix.\nExample: menu | ping | jokers");
      return true;
    }

    currentPrefix = input;
    await send(`✅ Prefix successfully changed to: *${currentPrefix}*`);
    return true;
  }

  if (cmd === "autoreact") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const sub = String(args[0] || "").toLowerCase();
    const value = parseOnOff(args[1]);
    const cfg = getAutoReactConfig(sock);

    if (sub === "on" || sub === "off") {
      cfg.enabled = sub === "on";
      saveAutoReactConfig(cfg, sock);
      await send(`✅ Auto-react master: *${cfg.enabled ? "ON" : "OFF"}*`);
      return true;
    }

    if (sub === "all" && value !== null) {
      cfg.all = value;
      cfg.enabled = value || cfg.enabled;
      cfg.dm = value;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ Auto-react *ALL*: *${value ? "ON" : "OFF"}*`);
      return true;
    }

    if (sub === "dm" && value !== null) {
      cfg.dm = value;
      cfg.enabled = value || cfg.enabled;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ Auto-react *DM*: *${value ? "ON" : "OFF"}*`);
      return true;
    }

    if ((sub === "group" || sub === "grp") && value !== null) {
      if (!isGroup(jid)) { await send("❌ .autoreact group on/off only in a group."); return true; }
      cfg.groups[jid] = value;
      cfg.enabled = value || cfg.enabled;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ Auto-react *this group*: *${value ? "ON" : "OFF"}*`);
      return true;
    }

    if ((sub === "command" || sub === "cmd" || sub === "commands") && value !== null) {
      cfg.command = value;
      saveAutoReactConfig(cfg, sock);
      await send(
        `✅ Auto-react *COMMAND*: *${value ? "ON" : "OFF"}*\n` +
        `When ON → bot reacts on every valid command with that command's menu emoji.\n` +
        `Respects mode: private = owner/sudo only; public/dm/group = as mode allows.`
      );
      return true;
    }

    if ((sub === "status" || sub === "statuses") && value !== null) {
      cfg.status = value;
      saveAutoReactConfig(cfg, sock);
      const srFile = sf(sock, "statusreact.json");
      writeJson(srFile, { enabled: value });
      await send(
        `✅ Auto-react *STATUS*: *${value ? "ON" : "OFF"}*\n` +
        `Personal + group status + group-status mentions pe ❤️`
      );
      return true;
    }

    const gOn = isGroup(jid) ? (cfg.groups[jid] ? "ON" : "OFF") : "n/a";
    const srOn = readJson(sf(sock, "statusreact.json"), { enabled: false }).enabled || cfg.status;
    await send(
`*😊 Auto React*
• Master   : *${cfg.enabled ? "ON" : "OFF"}*
• ALL      : *${cfg.all ? "ON" : "OFF"}*
• DM       : *${cfg.dm ? "ON" : "OFF"}*
• Group    : *${gOn}*
• Command  : *${cfg.command ? "ON" : "OFF"}*
• Status   : *${srOn ? "ON" : "OFF"}*
• Mode     : *${cfg.reactMode || "defaults"}*

Usage:
.autoreact all on/off
.autoreact dm on/off
.autoreact group on/off
.autoreact command on/off
.autoreact status on/off
.autoreact on/off`
    );
    return true;
  }

  if (cmd === "setreact" || cmd === "setract") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const sub = String(args[0] || "").toLowerCase();
    const cfg = getAutoReactConfig(sock);

    if (sub === "defaults" || sub === "default") {
      cfg.reactMode = "defaults";
      cfg.reactEmojis = [...DEFAULT_REACT_EMOJIS];
      cfg.reactIndex = 0;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ React mode: *DEFAULT*\n${DEFAULT_REACT_EMOJIS.join("")}`);
      return true;
    }

    if (sub === "ai") {
      cfg.reactMode = "ai";
      cfg.reactEmojis = [];
      cfg.reactIndex = 0;
      saveAutoReactConfig(cfg, sock);
      await send(
        "✅ React mode: *AI*\n" +
        "Bot reads the message meaning (English understanding) and reacts with a matching emoji.\n" +
        "Example: love → ❤️ | funny → 😂 | sad → 😢 | thanks → 🙏"
      );
      return true;
    }

    if (sub === "all") {
      cfg.reactMode = "all";
      cfg.reactEmojis = [...ALL_REACT_EMOJIS];
      cfg.reactIndex = 0;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ React mode: *ALL*\n${ALL_REACT_EMOJIS.length} emojis — rotate one by one.`);
      return true;
    }

    if (sub === "custom") {
      const custom = parseReactEmojis(args.slice(1).join("") || args.slice(1).join(" "));
      if (!custom.length) {
        await send("❌ Usage: .setreact custom ❤️🔥😂👍\nAdd 1 or more emojis.");
        return true;
      }
      cfg.reactMode = "custom";
      cfg.reactEmojis = custom;
      cfg.reactIndex = 0;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ React mode: *CUSTOM*\n${custom.join("")}`);
      return true;
    }

    const custom = parseReactEmojis(args.join("").trim() || args.join(" "));
    if (custom.length) {
      cfg.reactMode = "custom";
      cfg.reactEmojis = custom;
      cfg.reactIndex = 0;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ React mode: *CUSTOM*\n${custom.join("")}`);
      return true;
    }
    await send(
`*🔄 Set React*
Current: *${cfg.reactMode || "defaults"}*

.setreact default — heart emojis
.setreact ai — smart react by message meaning
.setreact all — random rotating emojis
.setreact custom ❤️🔥😂 — your own emojis
.setreact ❤️🧡💛 — same as custom`
    );
    return true;
  }

  if (["autoread", "ar"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const arg = String(args[0] || "").toLowerCase();
    const VALID = ["off", "all", "groups", "dms"];
    const file = sf(sock, "autoread.json");
    const cfg = readJson(file, { mode: "off" });
    if (!arg || !VALID.includes(arg)) {
      await send(
`╭───『 📖 AUTO READ 』───╮
│
│  Current  ›  *${(cfg.mode || "off").toUpperCase()}*
│
│  Usage:
│  • ${currentPrefix}autoread off
│  • ${currentPrefix}autoread all
│  • ${currentPrefix}autoread groups
│  • ${currentPrefix}autoread dms
│
╰───────────────────╯`
      );
      return true;
    }
    cfg.mode = arg;
    writeJson(file, cfg);
    const labels = {
      off: "Disabled — no auto-read",
      all: "ON — blue ticks in every chat",
      groups: "ON — groups only",
      dms: "ON — private chats only"
    };
    await send(
`╭───『 📖 AUTO READ 』───╮
│
│  Current  ›  *${arg.toUpperCase()}*
│  ${labels[arg] || arg}
│
╰───────────────────╯`
    );
    return true;
  }

  async function handlePresenceCommand(feature,label){
    if(!commandPrivileged(sock,msg,send)) return true;
    const sub=String(args[0]||"").toLowerCase(), value=parseOnOff(args[1]), cfg=getAutoReactConfig(sock), x=cfg[feature];
    if((sub==="dm"||sub==="chat")&&value!==null){x.dm=value;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} DM: *${value?"ON":"OFF"}*`);return true;}
    if(sub==="group"&&value!==null){
      if(!isGroup(jid)){await send(`❌ .${cmd} group on/off — use this in a group only.`);return true;}
      x.groups[jid]=value;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} this group: *${value?"ON":"OFF"}*`);return true;
    }
    if(sub==="all"&&value!==null){x.all=value;x.dm=value;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} ALL: *${value?"ON":"OFF"}*`);return true;}
    if(sub==="on"||sub==="off"){x.all=sub==="on";x.dm=x.all;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} ALL: *${x.all?"ON":"OFF"}*`);return true;}
    await send(`.${cmd} dm on/off | group on/off | all on/off`);return true;
  }
  if(cmd==="autorecord") return await handlePresenceCommand("record","Auto-record");
  if(cmd==="autotype") return await handlePresenceCommand("type","Auto-type");
  if(cmd==="autorecordtype") return await handlePresenceCommand("recordtype","Auto-record + type");

  function settingsText(sock, jid) {
    const prefixValue = (typeof currentPrefix !== "undefined" ? currentPrefix : (process.env.PREFIX || "."));
    const prefixDisplay = prefixValue === "" ? "NONE" : prefixValue;
    const botName = readJson(sf(sock, "bot-name.json"), { name: "" }).name || sock.user?.name || "Joker-XD";
    const ownerName = readJson(sf(sock, "owner-name.json"), { name: "Not Set" }).name || "Not Set";
    const mode = getMode(sock);

    const antiFiles = [
      ["ANTILINK", "antilink.json", "🔗"],
      ["ANTISTICKER", "antisticker.json", "🚫"],
      ["ANTIVOICE", "antivoice.json", "🎤"],
      ["ANTIPICTURE", "antipicture.json", "🖼️"],
      ["ANTIVIDEO", "antivideo.json", "🎬"],
      ["ANTITEXT", "antitext.json", "💬"],
      ["ANTITAG", "antitag.json", "🏷️"],
      ["AGM", "agm.json", "📢"],
      ["ANTIGROUPSTATUS", "antigroupstatus.json", "📱"]
    ];
    const groupOnly = !isGroup(jid);
    const antiValues = antiFiles.map(([label, file]) => {
      const cfg = readJson(sf(sock, file), {});
      const raw = cfg[jid];
      const value = file === "antigroupstatus.json" && raw && typeof raw === "object"
        ? (raw.enabled ? String(raw.action || "warn") : "off")
        : String(raw || "off");
      return { label, value: groupOnly ? "GROUP" : value.toUpperCase() };
    });

    const antiTagMe = readJson(sf(sock, "antitagme.json"), { enabled: false, text: "I'm busy" });
    const warnLimit = getWarnLimit(sock);

    const react = getAutoReactConfig(sock);
    const reactGroup = isGroup(jid) ? (react.groups[jid] ? "ON" : "OFF") : "N/A";
    const recordGroup = isGroup(jid) ? (react.record.groups[jid] ? "ON" : "OFF") : "N/A";
    const typeGroup = isGroup(jid) ? (react.type.groups[jid] ? "ON" : "OFF") : "N/A";
    const recordTypeGroup = isGroup(jid) ? (react.recordtype.groups[jid] ? "ON" : "OFF") : "N/A";

    const viewOnce = readJson(sf(sock, "viewonce.json"), { enabled: false, mode: "dm" });
    const antiDelete = readJson(sf(sock, "antidelete.json"), { enabled: true, mode: "private" });
    const antiEdit = readJson(sf(sock, "antiedit.json"), { enabled: true, mode: "private" });

    const antiModeSet = antiValues.map(x => x.value).filter(v => v !== "GROUP");
    const combinedAnti = groupOnly ? "GROUP ONLY" :
      (antiModeSet.length && antiModeSet.every(v => v === antiModeSet[0]) ? antiModeSet[0] : "MIXED");

    const alwaysOnline = sock?.__presenceInterval ? "ON" : "ON (SESSION)";
    const lastSeen = "WHATSAPP PRIVACY";

    const lines = [
      "┏━ ⚙️ *JOKER-XD SETTINGS*",
      "┃",
      "┃ 🔗 *ANTILINK*       : " + antiValues[0].value,
      "┃ 🚫 *ANTISTICKER*    : " + antiValues[1].value,
      "┃ 🎤 *ANTIVOICE*      : " + antiValues[2].value,
      "┃ 🖼️ *ANTIPICTURE*    : " + antiValues[3].value,
      "┃ 🎬 *ANTIVIDEO*      : " + antiValues[4].value,
      "┃ 💬 *ANTITEXT*       : " + antiValues[5].value,
      "┃ 🏷️ *ANTITAG*        : " + antiValues[6].value,
      "┃ 📢 *AGM*            : " + antiValues[7].value,
      "┃ 🏷️ *ANTITAGME*      : " + (antiTagMe.enabled ? "ON" : "OFF"),
      "┃ ⚠️ *WARN LIMIT*     : " + warnLimit,
      "┃ 🎫 *ALLOW*          : READY",
      "┃ 🔁 *ALL ANTI*       : " + combinedAnti,
      "┃",
      "┃ 😊 *AUTOREACT*      : " + (react.enabled ? "ON" : "OFF"),
      "┃ 🌐 *REACT ALL*      : " + (react.all ? "ON" : "OFF"),
      "┃ 💬 *REACT DM*       : " + (react.dm ? "ON" : "OFF"),
      "┃ 👥 *REACT GROUP*    : " + reactGroup,
      "┃ ⚡ *REACT COMMAND*  : " + (react.command ? "ON" : "OFF"),
      "┃ 🎭 *SETREACT*       : " + String(react.reactMode || "defaults").toUpperCase(),
      "┃ 📱 *STATUS REACT*   : " + (react.status ? "ON" : "OFF"),
      "┃ 🎙️ *AUTORECORD*     : ALL=" + (react.record.all ? "ON" : "OFF") + " DM=" + (react.record.dm ? "ON" : "OFF") + " GROUP=" + recordGroup,
      "┃ ⌨️ *AUTOTYPE*       : ALL=" + (react.type.all ? "ON" : "OFF") + " DM=" + (react.type.dm ? "ON" : "OFF") + " GROUP=" + typeGroup,
      "┃ 🎙️ *RECORD+TYPE*    : ALL=" + (react.recordtype.all ? "ON" : "OFF") + " DM=" + (react.recordtype.dm ? "ON" : "OFF") + " GROUP=" + recordTypeGroup,
      "┃ 🟢 *ALWAYS ONLINE*  : " + alwaysOnline,
      "┃ 👁️ *LASTSEEN*       : " + lastSeen,
      "┃",
      "┃ 🗑️ *ANTIDELETE*     : " + (antiDelete.enabled ? "ON / " + String(antiDelete.mode || "private").toUpperCase() : "OFF"),
      "┃ ✏️ *ANTIEDIT*       : " + (antiEdit.enabled ? "ON / " + String(antiEdit.mode || "private").toUpperCase() : "OFF"),
      "┃ 👁️ *VIEW-ONCE AUTO* : " + (viewOnce.enabled ? "ON / " + String(viewOnce.mode || "dm").toUpperCase() : "OFF"),
      "┃ 🔐 *BOT MODE*       : " + String(mode).toUpperCase(),
      "┃",
      "┃ 🤖 *BOT NAME*       : " + botName,
      "┃ 👑 *OWNER NAME*     : " + ownerName,
      "┃ 🔣 *PREFIX*         : " + prefixDisplay,
      "┃",
      "┃ 📍 *SCOPE*          : " + (isGroup(jid) ? "THIS GROUP" : "PRIVATE CHAT"),
      "┗━━━━━━━━━━━━━━━━"
    ];
    return lines.join("\n");
  }

  if (["settings", "setting"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    await send(settingsText(sock, jid));
    return true;
  }

  if (["menu", "commands"].includes(cmd)) {
    try {
      await sendMenu(sock, msg, send);
    } catch (e) {
      console.error("[menu]", e.message || e);
      await send(menuText(msg, sock));
    }
    return true;
  }
  if (cmd === "help") {
    await send(helpText(prefix === "" ? "." : (typeof currentPrefix !== "undefined" ? currentPrefix : ".")));
    return true;
  }
  if (["jokerhelp", "jokerhel", "jhelp"].includes(cmd)) {
    await send(jokerHelpText(prefix === "" ? "." : (typeof currentPrefix !== "undefined" ? currentPrefix : ".")));
    return true;
  }
  if (["ping", "p", "pong"].includes(cmd)) {
    const start = Date.now();
    const sent = await sock.sendMessage(jid, { text: "🏓 Checking..." }, { quoted: msg });
    const ms = Date.now() - start;
    const botName = readJson(sf(sock, "bot-name.json"), { name: "" }).name || sock.user?.name || "Joker-XD";
    const response = `☠️ *${botName}* *speed* ${ms}ms`;
    try { await sock.sendMessage(jid, { text: response, edit: sent.key }); }
    catch { await send(response); }
    return true;
  }
  if (["alive", "runtime", "uptime", "up", "a"].includes(cmd)) {
    const up = formatUptime(process.uptime() * 1000);
    const mode = getMode(sock);
    const botNum = jidNumber(sock.user?.id) || "?";
    const botName = readJson(sf(sock, "bot-name.json"), { name: "" }).name || sock.user?.name || "Joker-XD";
    await send(
`*🃏 ${botName} v2.0.5 is Alive*

✦ Status   : Online ✅
✦ Uptime   : ${up}
✦ Mode     : ${mode}
✦ Prefix   : ${currentPrefix === "" ? "none" : currentPrefix}
✦ Bot      : +${botNum}
✦ Version  : v2.0.5`
    );
    return true;
  }

  if (cmd === "tomp3") {
    const quoted = getQuotedMsg(msg);
    if (!quoted?.message?.videoMessage && !quoted?.message?.audioMessage) {
      await send("❌ Reply to a video/audio with .tomp3");
      return true;
    }
    try {
      const buf = await downloadMediaMessage(quoted, "buffer", {}, { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage });
      await sock.sendMessage(jid, { audio: buf, mimetype: "audio/mpeg", ptt: false }, { quoted: msg });
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["tovoice", "tov", "topp"].includes(cmd)) {
    const quoted = getQuotedMsg(msg);
    if (!quoted?.message?.videoMessage && !quoted?.message?.audioMessage) {
      await send("❌ Reply to a video / audio / voice with .tovoice");
      return true;
    }
    try {
      await react("🎙️");
      const buf = await downloadMediaMessage(quoted, "buffer", {}, { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage });

      let outBuf = buf;
      let mime = "audio/ogg; codecs=opus";
      try {
        const tmpIn = path.join(TEMP_DIR, `tov_${Date.now()}.bin`);
        const tmpOut = path.join(TEMP_DIR, `tov_${Date.now()}.ogg`);
        fs.writeFileSync(tmpIn, buf);
        await execAsync(`"${FFMPEG_PATH}" -y -i "${tmpIn}" -vn -c:a libopus -b:a 64k -ar 48000 -ac 1 "${tmpOut}"`, { timeout: 25000 });
        outBuf = fs.readFileSync(tmpOut);
        try { fs.unlinkSync(tmpIn); } catch {}
        try { fs.unlinkSync(tmpOut); } catch {}
      } catch {
        mime = "audio/mpeg";
      }
      await sock.sendMessage(jid, { audio: outBuf, mimetype: mime, ptt: true }, { quoted: msg });
    } catch (e) { await send(`❌ tovoice failed: ${e.message || e}`); }
    return true;
  }

  if (["tomp4", "tovideo"].includes(cmd)) {
    const quoted = getQuotedMsg(msg);
    if (!quoted) {
      await send("❌ Reply to a *sticker* or *image* with .tovideo / .tomp4");
      return true;
    }
    const inner = unwrapMessage(quoted.message || {});
    const isSticker = !!(inner.stickerMessage || quoted.message?.stickerMessage);
    const isImage = !!(inner.imageMessage || quoted.message?.imageMessage);
    if (!isSticker && !isImage) {
      await send("❌ Reply to a *sticker* or *image* with .tovideo / .tomp4");
      return true;
    }
    try {
      react("🎬").catch(() => {});
      const dlTarget = {
        key: quoted.key,
        message: Object.keys(inner).length ? inner : quoted.message
      };
      const buf = await downloadMediaMessage(dlTarget, "buffer", {}, {
        logger: pino({ level: "silent" }),
        reuploadRequest: sock.updateMediaMessage
      });
      if (!buf || buf.length < 50) throw new Error("Download failed");

      let videoBuf;
      if (isSticker) {
        videoBuf = await stickerToVideo(buf);
      } else {

        const id = makeId();
        const input = path.join(MEDIA_DIR, `${id}_img.jpg`);
        const output = path.join(MEDIA_DIR, `${id}_img.mp4`);
        try {
          let imgBuf = buf;
          try {
            imgBuf = await sharp(buf).jpeg({ quality: 85 }).toBuffer();
          } catch {}
          fs.writeFileSync(input, imgBuf);
          await execAsync(
            `"${FFMPEG_PATH}" -y -loop 1 -i "${input}" -t 3 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" -c:v libx264 -preset ultrafast -tune zerolatency -crf 28 -pix_fmt yuv420p -movflags +faststart -an "${output}"`,
            { timeout: 18000, maxBuffer: 12 * 1024 * 1024 }
          );
          videoBuf = fs.readFileSync(output);
        } finally {
          try {
            fs.rmSync(input, { force: true });
          } catch {}
          try {
            fs.rmSync(output, { force: true });
          } catch {}
        }
      }
      if (!videoBuf || videoBuf.length < 200) throw new Error("Video conversion returned empty");
      await sock.sendMessage(
        jid,
        { video: videoBuf, caption: "🃏 Joker-XD", mimetype: "video/mp4" },
        { quoted: msg }
      );
      await react("✅");
    } catch (e) {
      console.error("[tovideo]", e?.message || e);
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (["toimage", "toimg"].includes(cmd)) {
    const quoted = getQuotedMsg(msg);
    if (!quoted) {
      await send("❌ Reply to a *sticker* with .toimg");
      return true;
    }
    const inner = unwrapMessage(quoted.message || {});
    if (!(inner.stickerMessage || quoted.message?.stickerMessage)) {
      await send("❌ Reply to a *sticker* with .toimg");
      return true;
    }
    try {
      await react("🖼️");
      const dlTarget = { key: quoted.key, message: Object.keys(inner).length ? inner : quoted.message };
      const buf = await downloadMediaMessage(dlTarget, "buffer", {}, {
        logger: pino({ level: "silent" }),
        reuploadRequest: sock.updateMediaMessage
      });
      if (!buf || buf.length < 50) throw new Error("Download failed");
      const img = await stickerToImageBuffer(buf);
      await sock.sendMessage(jid, { image: img, caption: "🃏 Joker-XD" }, { quoted: msg });
      await react("✅");
    } catch (e) {
      console.error("[toimg]", e);
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (["approve", "approverequests", "approveall"].includes(cmd)) {
    if (!isGroup(jid)) { await send("This command can only be used in a group."); return true; }
    try {
      const meta = await requireGroupAdmin(sock, msg, send);
      if (!meta) return true;

      const mode = String(args[0] || "").toLowerCase();
      let amount = null;
      if (mode === "all" || mode === "approveall" || !mode) {
        amount = null;
      } else if (/^\d+$/.test(mode)) {
        amount = Number(mode);
        if (amount < 1) { await send("Amount must be at least 1."); return true; }
      } else {
        await send(`Usage: ${currentPrefix}approve all\nOr: ${currentPrefix}approve <amount>`);
        return true;
      }

      const result = await approveGroupRequests(sock, jid, amount);
      if (result.pendingBefore === 0) {
        await send("There are no pending join requests.");
        return true;
      }

      if (result.full && result.pendingLeft > 0) {
        await send(
          `The group is full (${result.finalMembers}/${APPROVE_GROUP_LIMIT} members).\n` +
          `Approved: ${result.approved} request(s).\n` +
          `Pending requests remaining: ${result.pendingLeft}.`
        );
        return true;
      }

      await send(
        `Approval complete.\n` +
        `Approved: ${result.approved} request(s).\n` +
        `Group members: ${result.finalMembers}/${APPROVE_GROUP_LIMIT}.\n` +
        `Pending requests remaining: ${result.pendingLeft}.`
      );
    } catch (e) {
      await send(`Approval failed: ${e.message || e}`);
    }
    return true;
  }

  if (["kick", "remove", "k", "out", "nikul", "dufa"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    try {
      const meta = await sock.groupMetadata(jid);
      const sender = msg.key.participant || msg.key.remoteJid;
      if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
      const n = targetNumber(msg, args);
      if (!n) { await send("❌ Reply to user or give number."); return true; }
      const target = findParticipantJid(meta, n);
      if (!target) { await send("❌ User not found in group."); return true; }

      if (isAdmin(meta, target) && !isPrivileged(sock, msg)) {
        await send("❌ Cannot kick admin.");
        return true;
      }
      await sock.groupParticipantsUpdate(jid, [target], "remove");
      await sock.sendMessage(jid, { text: `🥾 Removed @${jidNumber(target)}`, mentions: [target] }, { quoted: msg });
    } catch (e) { await send(`❌ Kick failed: ${e.message || e}`); }
    return true;
  }

  if (["kickall", "removeall", "kall"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    try {
      const meta = await sock.groupMetadata(jid);
      const botN = jidNumber(sock.user?.id);
      const targets = meta.participants
        .filter(p => {
          const id = p.id || "";
          return !p.admin && jidNumber(id) !== botN;
        })
        .map(p => p.id);
      let ok = 0;
      for (const t of targets) {
        try { await sock.groupParticipantsUpdate(jid, [t], "remove"); ok++; } catch {}
      }
      await send(`🥾 Removed ${ok}/${targets.length} members.`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["promote", "toadmin", "toadm"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply or number."); return true; }
    try {
      const target = findParticipantJid(meta, n);
      await sock.groupParticipantsUpdate(jid, [target], "promote");
      await sock.sendMessage(jid, { text: `⬆️ Promoted @${jidNumber(target)}`, mentions: [target] }, { quoted: msg });
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["demote", "dismiss", "tomember", "tomem"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply or number."); return true; }
    try {
      const target = findParticipantJid(meta, n);
      await sock.groupParticipantsUpdate(jid, [target], "demote");
      await sock.sendMessage(jid, { text: `⬇️ Demoted @${jidNumber(target)}`, mentions: [target] }, { quoted: msg });
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["tagall", "tag"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    const members = meta.participants.map(p => p.id);
    const extraText = args.join(" ").trim();
    const tagLine = members.map(x => "@" + jidNumber(x)).join(" ");
    const quoted = getQuotedMsg(msg);

    if (quoted) {
      try {
        let content = await buildSendContent(sock, quoted);
        if (!content) {
          await send("❌ Replied message has no supported content.");
          return true;
        }
        content.mentions = members;

        if (content.image || content.video || content.document) {
          const base = (content.caption || "").trim();
          const parts = [];
          if (extraText) parts.push(extraText);
          if (base) parts.push(base);
          parts.push(tagLine);
          content.caption = parts.join("\n");
        } else if (content.text != null) {
          const parts = [];
          if (content.text) parts.push(content.text);
          if (extraText) parts.push(extraText);
          parts.push(tagLine);
          content.text = parts.join("\n\n") || tagLine;
        } else {

          await sock.sendMessage(jid, content, { quoted: msg });
          await sock.sendMessage(jid, { text: (extraText ? extraText + "\n\n" : "") + tagLine, mentions: members });
          return true;
        }

        await sock.sendMessage(jid, content, { quoted: msg });
        return true;
      } catch (e) {
        await send(`❌ Tag failed: ${e.message || e}`);
        return true;
      }
    }

    const body = (extraText ? extraText + "\n\n" : "") + tagLine;
    await sock.sendMessage(jid, {
      text: body,
      mentions: members
    }, { quoted: msg });
    return true;
  }

  if (["admin", "admins", "tagadmin", "tagadmins"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    const admins = meta.participants.filter(p => p.admin === "admin" || p.admin === "superadmin").map(p => p.id);
    if (!admins.length) { await send("❌ No admins found."); return true; }
    const extraText = args.join(" ").trim();
    const tagLine = admins.map(x => "@" + jidNumber(x)).join(" ");
    const body = (extraText ? extraText + "\n\n" : "👑 *Admins*\n") + tagLine;
    await sock.sendMessage(jid, { text: body, mentions: admins }, { quoted: msg });
    return true;
  }

  if (["members", "member", "tagmembers", "tagmember"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    const membersOnly = meta.participants.filter(p => !p.admin).map(p => p.id);
    if (!membersOnly.length) { await send("❌ No regular members found."); return true; }
    const extraText = args.join(" ").trim();
    const tagLine = membersOnly.map(x => "@" + jidNumber(x)).join(" ");
    const body = (extraText ? extraText + "\n\n" : "👥 *Members*\n") + tagLine;
    await sock.sendMessage(jid, { text: body, mentions: membersOnly }, { quoted: msg });
    return true;
  }

  if (["hidetag", "ht", "htag"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    const members = meta.participants.map(p => p.id);
    const body = args.join(" ").trim() || "‎";

    try {
      await sock.sendMessage(jid, { delete: msg.key });
    } catch (_) {}

    await sock.sendMessage(jid, { text: body, mentions: members });
    return true;
  }

  if (["link", "glink", "invite"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    try {
      const code = await sock.groupInviteCode(jid);
      await send(`🔗 https://chat.whatsapp.com/${code}`);
    } catch (e) { await send(`❌ Bot must be admin. ${e.message || ""}`); }
    return true;
  }

  if (["resetlink", "revoke"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    try {
      await sock.groupRevokeInvite(jid);
      const code = await sock.groupInviteCode(jid);
      await send(`🔄 New link:\nhttps://chat.whatsapp.com/${code}`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["open", "unmute"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    try {
      await sock.groupSettingUpdate(jid, "not_announcement");
      await send("🔓 Group opened.");
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["close", "mute"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    try {
      await sock.groupSettingUpdate(jid, "announcement");
      await send("🔒 Group closed (admins only).");
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["setdesc", "setgdesc"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    const d = args.join(" ").trim();
    if (!d) { await send("❌ Usage: .setdesc text"); return true; }
    try { await sock.groupUpdateDescription(jid, d); await send("✅ Description updated."); }
    catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["setgroupname", "setname", "gname"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    const d = args.join(" ").trim();
    if (!d) { await send("❌ Usage: .setgroupname name"); return true; }
    try { await sock.groupUpdateSubject(jid, d); await send("✅ Group name updated."); }
    catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (cmd === "antilink") {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send) && !(await (async () => {
      const meta = await sock.groupMetadata(jid);
      return isAdmin(meta, msg.key.participant || msg.key.remoteJid);
    })())) { await send("❌ Admins only."); return true; }
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antilink.json"), {});
    if (!v) {
      await send(`🔗 *ANTILINK*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage:\n.antilink warn\n.antilink delete\n.antilink kick\n.antilink off`);
      return true;
    }
    const nv = setAntiCfg(sf(sock, "antilink.json"), jid, v);
    await send(`🔗 *ANTILINK*\n✅ Switched to *${nv}*`);
    return true;
  }

  if (cmd === "antitag") {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antitag.json"), {});
    if (!v) {
      await send(`🏷️ *ANTITAG*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage: .antitag warn|delete|kick|off`);
      return true;
    }
    const nv = setAntiCfg(sf(sock, "antitag.json"), jid, v);
    await send(`🏷️ *ANTITAG*\n✅ Switched to *${nv}*`);
    return true;
  }

  if (cmd === "antitagme") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = String(args[0] || "").toLowerCase();
    const cfg = readJson(sf(sock, "antitagme.json"), { enabled: false, text: "I'm busy" });
    if (v === "on") { cfg.enabled = true; writeJson(sf(sock, "antitagme.json"), cfg); await send("✅ Antitagme ON — reply: I'm busy"); return true; }
    if (v === "off") { cfg.enabled = false; writeJson(sf(sock, "antitagme.json"), cfg); await send("✅ Antitagme OFF"); return true; }
    if (v === "set") {
      const t = args.slice(1).join(" ").trim() || "I'm busy";
      cfg.text = t; cfg.enabled = true; writeJson(sf(sock, "antitagme.json"), cfg);
      await send(`✅ Antitagme text: *${t}*`);
      return true;
    }
    await send(`🏷️ Antitagme: *${cfg.enabled ? "ON" : "OFF"}*\nText: ${cfg.text}\nUsage: .antitagme on|off|set <text>`);
    return true;
  }

  if (["antigroupmention", "agm"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "agm.json"), {});
    if (!v) {
      await send(
        `📢 *ANTI GROUP MENTION*\n` +
        `Current: *${cfg[jid] || "off"}*\n\n` +
        `Sirf group-status *mentions* pe action leta hai.\n` +
        `Actual group status posts ke liye \`.antigroupstatus\` use karo.\n\n` +
        `📌 Usage: *.antigroupmention* / *.agm* warn|delete|kick|off`
      );
      return true;
    }
    const nv = setAntiCfg(sf(sock, "agm.json"), jid, v);
    await send(`📢 *ANTI GROUP MENTION*\n✅ Switched to *${nv}*`);
    return true;
  }

  if (["gstatus", "togroupstatus", "togstatus"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;

    try {
      let targetJid = null;
      let textArgs = [...args];

      const a0 = args[0] ? String(args[0]).trim() : "";
      if (a0 && (/@g\.us$/i.test(a0) || /^\d{10,}(-\d+)?@?g?\.?u?s?$/i.test(a0) || /^\d{15,}(-\d+)?$/.test(a0))) {
        const rawJ = a0.replace(/@g\.us$/i, "").replace(/@$/, "");

        if (/^\d{10,}(-\d+)?$/.test(rawJ)) {
          targetJid = `${rawJ}@g.us`;
          textArgs = args.slice(1);
        }
      }
      if (!targetJid && isGroup(jid)) {
        targetJid = jid;
      }

      if (!targetJid || !String(targetJid).endsWith("@g.us")) {
        await send(
          "📌 *Group Status Usage:*\n\n" +
          "• `.togstatus Hello world` — text (group ke andar)\n" +
          "• `.togstatus 120363xxx@g.us Hello` — text (bahar se / doosre group)\n" +
          "• Reply image/video/sticker + `.togstatus` — media (group ke andar)\n" +
          "• Reply media + `.togstatus 120363xxx@g.us` — media (bahar se)\n\n" +
          "Aliases: `.gstatus`  `.togroupstatus`"
        );
        return true;
      }

      const quoted = getQuotedMsg(msg);
      let content = null;

      if (quoted) {
        try {
          content = await buildSendContent(sock, quoted);
        } catch (e) {
          console.error("[gstatus-build]", e?.message || e);
        }
      }

      if (!content) {
        const directText = textArgs.join(" ").trim();
        if (directText) content = { text: directText };
      }

      if (!content && quoted) {
        const txt =
          quoted.message?.conversation ||
          quoted.message?.extendedTextMessage?.text ||
          quoted.message?.imageMessage?.caption ||
          quoted.message?.videoMessage?.caption ||
          "";
        if (txt) content = { text: txt };
      }

      if (!content) {
        await send(
          "❌ Text, image, video, sticker ya audio chahiye.\n\n" +
          "Examples:\n" +
          "• `.togstatus Hello world`\n" +
          "• Reply photo + `.togstatus`"
        );
        return true;
      }

      if (typeof sock.sendGroupStatus === "function") {
        await sock.sendGroupStatus(targetJid, content);
        await send("✅ Group Status posted successfully.");
        return true;
      }

      await sock.sendMessage(targetJid, { ...content, groupStatus: true });
      await send("✅ Group Status attempted.\n_(wolfsocket recommended)_");
    } catch (e) {
      console.error("[gstatus]", e?.message || e);
      await send(
        "❌ Failed to post Group Status.\n" +
        (e?.message || "Unknown error") +
        "\n\n• wolfsocket use ho raha ho?\n• aap target group ke admin ho?"
      );
    }
    return true;
  }

  if (["antigroupstatus", "ags"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send)) return true;

    const cfgFile = sf(sock, "antigroupstatus.json");
    const cfg = readJson(cfgFile, {});
    const raw = cfg[jid];
    const currentEnabled = typeof raw === "object" ? !!raw.enabled : !!raw && raw !== "off";
    const currentAction = typeof raw === "object" ? String(raw.action || "warn") : String(raw || "off");
    const a0 = String(args[0] || "").toLowerCase().trim();
    const a1 = String(args[1] || "").toLowerCase().trim();

    let mode = null;
    if (a0 === "off" || a1 === "off") mode = "off";
    else if (["warn", "delete", "kick"].includes(a0)) mode = a0;
    else if (a0 === "on") mode = "warn";

    if (!mode) {
      await send(
        `📢 *ANTI GROUP STATUS*\n` +
        `${currentEnabled ? "🟢 *ENABLED*" : "🔴 *DISABLED*"}\n` +
        `⚙️ Action: *${currentEnabled ? currentAction.toUpperCase() : "OFF"}*\n` +
        `🎯 Sirf *real Group Status posts* pe action leta hai.\n` +
        `❌ Group-status *mentions* pe kuch nahi karta.\n` +
        `   (mentions ke liye \`.antigroupmention\` / \`.agm\` use karo)\n\n` +
        `📌 Usage: *.antigroupstatus <action>*\n` +
        `🔹 warn  •  delete  •  kick  •  off\n` +
        `🔗 Alias: *.ags*`
      );
      return true;
    }

    if (mode === "off") {
      cfg[jid] = { enabled: false, action: currentAction || "warn" };
      writeJson(cfgFile, cfg);
      await send(`📢 *ANTI GROUP STATUS*\n🔴 *DISABLED*\n⚙️ Action: *${(currentAction || "warn").toUpperCase()}*`);
      return true;
    }

    cfg[jid] = { enabled: true, action: mode };
    writeJson(cfgFile, cfg);
    await send(`📢 *ANTI GROUP STATUS*\n🟢 *ENABLED*\n⚙️ Action: *${mode.toUpperCase()}*`);
    return true;
  }

  if (["antideletestatus", "ads", "antidelstatus"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = String(args[0] || "").toLowerCase().trim();
    const cfgFile = sf(sock, "antideletestatus.json");
    const cfg = readJson(cfgFile, { enabled: true });
    if (v === "on" || v === "enable" || v === "1" || v === "true") {
      cfg.enabled = true;
      writeJson(cfgFile, cfg);
      await send(
        "🛡️ *Anti Delete Status* 🟢 *ON* (default)\n\n" +
        "• Deleted group status posts → recovered to your private chat\n" +
        "• Deleted group status mentions → recovered to your private chat\n" +
        "• On connect, bot auto-scans & caches existing statuses\n" +
        "Mode: private (owner DM only)"
      );

      scanAndCacheExistingStatuses(sock).catch(() => {});
      return true;
    }
    if (v === "off" || v === "disable" || v === "0" || v === "false") {
      cfg.enabled = false;
      writeJson(cfgFile, cfg);
      await send("🛡️ *Anti Delete Status* 🔴 *OFF*");
      return true;
    }
    await send(
      `🛡️ *Anti Delete Status*: *${cfg.enabled ? "ON" : "OFF"}*\n\n` +
      `Usage:\n• .antideletestatus on\n• .antideletestatus off\nAlias: .ads`
    );
    return true;
  }

  if (["save", "sv", "statussave"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const quoted = getQuotedMsg(msg);
    if (!quoted) {
      await send("📌 Reply to a group status or media with `.save`\nIt will be sent to your private chat.");
      return true;
    }
    try {
      const owner = privacyOwnerJid(sock);
      if (!owner) { await send("❌ Could not resolve owner DM. Check bot number."); return true; }
      let content = null;
      try { content = await extractRecoverableContent(sock, quoted); } catch {}
      if (!content) { try { content = await buildSendContent(sock, quoted); } catch {} }
      if (!content) {
        try {
          const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
          const buf = await downloadMediaMessage(quoted, "buffer", {}, opts);
          if (buf?.length) {
            const m = unwrapStatusMessage(quoted.message || {});
            if (m.imageMessage) content = { image: buf, caption: m.imageMessage.caption || "" };
            else if (m.videoMessage) content = { video: buf, caption: m.videoMessage.caption || "" };
            else if (m.audioMessage) content = { audio: buf, mimetype: m.audioMessage.mimetype || "audio/ogg; codecs=opus", ptt: !!m.audioMessage.ptt };
            else if (m.stickerMessage) content = { sticker: buf };
            else if (m.documentMessage) content = { document: buf, mimetype: m.documentMessage.mimetype || "application/octet-stream", fileName: m.documentMessage.fileName || "file" };
          }
        } catch {}
      }
      if (!content) {
        await send("❌ Could not extract media/text from that message.");
        return true;
      }
      if (content.text && !content.image && !content.video && !content.audio && !content.sticker && !content.document) {
        await sock.sendMessage(owner, { text: `💾 *Saved Status/Media*\n${content.text}` });
      } else {
        await sock.sendMessage(owner, content);
      }
      await send("✅ Saved to your private chat.");
    } catch (e) {
      console.error("[save]", e?.message || e);
      await send("❌ Save failed: " + (e?.message || e));
    }
    return true;
  }

  if (["send", "resend", "extract"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const quoted = getQuotedMsg(msg);
    if (!quoted) {
      await send("📌 Reply to a status or media with `.send`\nIt will be extracted and sent here.");
      return true;
    }
    try {
      let content = null;
      try { content = await extractRecoverableContent(sock, quoted); } catch {}
      if (!content) { try { content = await buildSendContent(sock, quoted); } catch {} }
      if (!content) {
        try {
          const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
          const buf = await downloadMediaMessage(quoted, "buffer", {}, opts);
          if (buf?.length) {
            const m = unwrapStatusMessage(quoted.message || {});
            if (m.imageMessage) content = { image: buf, caption: m.imageMessage.caption || "" };
            else if (m.videoMessage) content = { video: buf, caption: m.videoMessage.caption || "" };
            else if (m.audioMessage) content = { audio: buf, mimetype: m.audioMessage.mimetype || "audio/ogg; codecs=opus", ptt: !!m.audioMessage.ptt };
            else if (m.stickerMessage) content = { sticker: buf };
            else if (m.documentMessage) content = { document: buf, mimetype: m.documentMessage.mimetype || "application/octet-stream", fileName: m.documentMessage.fileName || "file" };
          }
        } catch {}
      }
      if (!content) {
        await send("❌ Could not extract media/text from that message.");
        return true;
      }
      await sock.sendMessage(jid, content, { quoted: msg });
    } catch (e) {
      console.error("[send]", e?.message || e);
      await send("❌ Send failed: " + (e?.message || e));
    }
    return true;
  }

  if (["autostatusview", "asv", "avs", "statusview"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = String(args[0] || "").toLowerCase().trim();
    const cfgFile = sf(sock, "autostatusview.json");
    const cfg = readJson(cfgFile, { enabled: false });
    if (v === "on" || v === "enable" || v === "1" || v === "true") {
      cfg.enabled = true;
      writeJson(cfgFile, cfg);
      await send(
        "👀 *Auto Status View* 🟢 *ON*\n\n" +
        "Will mark as seen:\n" +
        "• Personal statuses\n" +
        "• Group status posts\n" +
        "• Group status mentions"
      );
      return true;
    }
    if (v === "off" || v === "disable" || v === "0" || v === "false") {
      cfg.enabled = false;
      writeJson(cfgFile, cfg);
      await send("👀 *Auto Status View* 🔴 *OFF*");
      return true;
    }
    await send(
      `👀 *Auto Status View*: *${cfg.enabled ? "ON" : "OFF"}*\n\n` +
      `Usage:\n• .autostatusview on\n• .autostatusview off\nAliases: .asv .avs`
    );
    return true;
  }

  if (["react", "statusreact", "sreact", "autoreactstatus", "autostatusreact"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = String(args[0] || "").toLowerCase().trim();
    const cfgFile = sf(sock, "statusreact.json");
    const cfg = readJson(cfgFile, { enabled: false });
    const ar = getAutoReactConfig(sock);
    if (v === "on" || v === "enable" || v === "1" || v === "true") {
      cfg.enabled = true;
      writeJson(cfgFile, cfg);
      ar.status = true;
      saveAutoReactConfig(ar, sock);
      await send(
        "❤️ *Status React* 🟢 *ON*\n\n" +
        "Will react ❤️ on:\n" +
        "• Personal statuses\n" +
        "• Group status posts\n" +
        "• Group status mentions"
      );
      return true;
    }
    if (v === "off" || v === "disable" || v === "0" || v === "false") {
      cfg.enabled = false;
      writeJson(cfgFile, cfg);
      ar.status = false;
      saveAutoReactConfig(ar, sock);
      await send("❤️ *Status React* 🔴 *OFF*");
      return true;
    }
    await send(
      `❤️ *Status React*: *${cfg.enabled ? "ON" : "OFF"}*\n\n` +
      `Usage:\n• .react on\n• .autostatusreact on\n• .react off\nAliases: .statusreact .sreact .autostatusreact`
    );
    return true;
  }

  if (["groupadd", "groupaddprivacy", "whoadd"].includes(cmd)) {
    if (!commandPrivileged(sock, msg, send)) return true;
    const VALID = ["all", "contacts", "contact_blacklist"];
    const arg = String(args[0] || "").toLowerCase().trim();
    try {
      if (!arg || !VALID.includes(arg)) {
        let current = "unknown";
        try {
          const priv = await sock.fetchPrivacySettings(true);
          current = priv?.groupadd || priv?.groupAdd || priv?.groupAddPrivacy || "unknown";
        } catch {}
        await send(
`╭───『 👥 GROUP ADD 』───╮
│
│  Current  ›  *${String(current).toUpperCase()}*
│
│  Usage:
│  • ${currentPrefix}groupadd all
│  • ${currentPrefix}groupadd contacts
│  • ${currentPrefix}groupadd contact_blacklist
│
│  all               → anyone can add
│  contacts          → contacts only
│  contact_blacklist → contacts except blocked
│
╰───────────────────╯`
        );
        return true;
      }
      if (typeof sock.updateGroupsAddPrivacy !== "function") {
        await send("❌ This Baileys build does not support updateGroupsAddPrivacy.");
        return true;
      }
      await sock.updateGroupsAddPrivacy(arg);
      await send(
`╭───『 👥 GROUP ADD 』───╮
│
│  Updated  ›  *${arg.toUpperCase()}*
│
╰───────────────────╯`
      );
    } catch (e) {
      await send(`❌ Error: ${e.message || e}`);
    }
    return true;
  }

  if (cmd === "warn") {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return true; }
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply or number."); return true; }
    const limit = getWarnLimit(sock);
    const count = addWarnCount(jid, n, "manual", sock);
    const target = findParticipantJid(meta, n);
    await sock.sendMessage(jid, { text: `⚠️ @${n} warn *${count}/${limit}*`, mentions: [target] }, { quoted: msg });
    if (count >= limit) {
      try {
        await sock.groupParticipantsUpdate(jid, [target], "remove");
        clearWarnCount(jid, n, "manual", sock);
        await sock.sendMessage(jid, { text: `🥾 @${n} removed (${limit} warns).`, mentions: [target] }, { quoted: msg });
      } catch {}
    }
    return true;
  }

  
  
  function parseAntiMode(args) {
    const a0 = String(args[0] || "").toLowerCase();
    const a1 = String(args[1] || "").toLowerCase();
    if (!a0) return null;
    if (a0 === "off" || a1 === "off") return "off";
    if (["warn", "delete", "kick"].includes(a0)) {
      if (a1 === "off") return "off";

      if (!a1 || a1 === "on") return a0;
      return a0;
    }
    if (a0 === "on") return "warn";
    return null;
  }

  
  function setAntiCfg(file, jid, mode) {
    const cfg = readJson(file, {});
    if (mode === "off") delete cfg[jid];
    else cfg[jid] = mode;  // overwrite any previous mode
    writeJson(file, cfg);
    return cfg[jid] || "off";
  }

  if (["antisticker", "antistiker", "antistic"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antisticker.json"), {});
    if (!v) { await send(`🚫 *ANTISTICKER*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage: .antisticker warn|delete|kick|off`); return true; }
    const nv = setAntiCfg(sf(sock, "antisticker.json"), jid, v);
    await send(`🚫 *ANTISTICKER*\n✅ Switched to *${nv}*`);
    return true;
  }
  if (["antivoice", "antivn", "antiaudio"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antivoice.json"), {});
    if (!v) { await send(`🎤 *ANTIVOICE*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage: .antivoice warn|delete|kick|off`); return true; }
    const nv = setAntiCfg(sf(sock, "antivoice.json"), jid, v);
    await send(`🎤 *ANTIVOICE*\n✅ Switched to *${nv}*`);
    return true;
  }
  if (["antipicture", "antiphoto", "antiping", "antimage", "antipic"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antipicture.json"), {});
    if (!v) { await send(`🖼️ *ANTIPICTURE*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage: .antipicture warn|delete|kick|off`); return true; }
    const nv = setAntiCfg(sf(sock, "antipicture.json"), jid, v);
    await send(`🖼️ *ANTIPICTURE*\n✅ Switched to *${nv}*`);
    return true;
  }
  if (["antivideo"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antivideo.json"), {});
    if (!v) { await send(`🎬 *ANTIVIDEO*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage: .antivideo warn|delete|kick|off`); return true; }
    const nv = setAntiCfg(sf(sock, "antivideo.json"), jid, v);
    await send(`🎬 *ANTIVIDEO*\n✅ Switched to *${nv}*`);
    return true;
  }
  if (["antitext"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antitext.json"), {});
    if (!v) { await send(`💬 *ANTITEXT*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage: .antitext warn|delete|kick|off`); return true; }
    const nv = setAntiCfg(sf(sock, "antitext.json"), jid, v);
    await send(`💬 *ANTITEXT*\n✅ Switched to *${nv}*`);
    return true;
  }

  if (cmd === "setwarn") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const n = parseInt(args[0], 10);
    if (!(n >= 1 && n <= 5)) { await send(`⚙️ Warn limit: *${getWarnLimit(sock)}*\nUsage: .setwarn 1-5`); return true; }
    writeJson(sf(sock, "setwarn.json"), { limit: n });
    await send(`✅ Warn limit set to *${n}*`);
    return true;
  }
  if (["resetwarn", "restwarn", "unwarn", "rw"].includes(cmd) || (cmd === "rest" && String(args[0] || "").toLowerCase() === "warn")) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send)) return true;
    const n = targetNumber(msg, args.filter(a => String(a).toLowerCase() !== "warn"));
    if (!n) {
      const c = clearAllGroupWarns(jid, sock);
      await send(`✅ All violation warns reset (*${c}* entries).`);
      return true;
    }
    clearWarnCount(jid, n, null, sock);
    await send(`✅ Warns cleared for @${n}`);
    return true;
  }

  if (["rools", "rules", "allanti"].includes(cmd)) {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = parseAntiMode(args);
    if (!v) {
      await send("Usage: .rools warn on|off\n.rools kick on\n.rools delete on\n.rools off");
      return true;
    }
    const files = ["antilink.json","antisticker.json","antivoice.json","antipicture.json","antivideo.json","antitext.json","antitag.json","agm.json"].map(f => sf(sock, f));
    for (const f of files) setAntiCfg(f, jid, v);
    const agsFile = sf(sock, "antigroupstatus.json");
    const agsCfg = readJson(agsFile, {});
    agsCfg[jid] = { enabled: v !== "off", action: v === "off" ? "warn" : v };
    writeJson(agsFile, agsCfg);
    await send(`✅ All anti tools → *${v}*`);
    return true;
  }

  if (cmd === "allow") {
    if (!isGroup(jid)) { await send("❌ Group only."); return true; }
    if (!commandPrivileged(sock, msg, send)) return true;
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply or number: .allow"); return true; }
    grantAllowOnce(jid, n, sock);
    await sock.sendMessage(jid, {
      text: `🎫 @${n} got *1 allow*.\nOne free rule break — then no more.`,
      mentions: [`${n}@s.whatsapp.net`]
    }, { quoted: msg });
    return true;
  }

  

  if (["tts", "say"].includes(cmd)) {
    const text = args.join(" ").trim();
    if (!text) { await send("❌ Usage: .tts <text>  |  .tts ur <text>"); return true; }
    try {
      await react("🗣️");
      const lang = (args[0] && /^[a-z]{2}$/i.test(args[0]) && args.length > 1) ? args[0].toLowerCase() : "en";
      const speak = (args[0] && /^[a-z]{2}$/i.test(args[0]) && args.length > 1) ? args.slice(1).join(" ") : text;
      const q = encodeURIComponent(speak.slice(0, 200));

      let buf = null;
      const urls = [
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${q}&tl=${lang}&client=tw-ob`,
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${q}&tl=${lang}&total=1&idx=0&textlen=${Math.min(speak.length, 200)}&client=tw-ob&prev=input`,
        `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&q=${q}&tl=${lang}`
      ];
      for (const ttsUrl of urls) {
        try {
          buf = await downloadUrlBuffer(ttsUrl, 30000);
          if (buf && buf.length >= 500) break;
        } catch {}
      }
      if (!buf || buf.length < 500) throw new Error("empty audio from TTS (try shorter text)");

      const stamp = Date.now();
      const tmpIn = path.join(TEMP_DIR, `tts_${stamp}.mp3`);
      const tmpOut = path.join(TEMP_DIR, `tts_${stamp}.ogg`);
      fs.writeFileSync(tmpIn, buf);

      let outBuf = null;
      let mime = "audio/ogg; codecs=opus";

      try {
        await execAsync(
          `"${FFMPEG_PATH}" -y -i "${tmpIn}" -vn -c:a libopus -b:a 64k -ar 48000 -ac 1 -application voip "${tmpOut}"`,
          { timeout: 25000 }
        );
        outBuf = fs.readFileSync(tmpOut);
        if (!outBuf || outBuf.length < 200) throw new Error("opus empty");
        mime = "audio/ogg; codecs=opus";
      } catch (e1) {
        console.error("[tts] opus fail:", e1.message || e1);
        try {
          const tmpMp3 = path.join(TEMP_DIR, `tts_${stamp}_clean.mp3`);
          await execAsync(
            `"${FFMPEG_PATH}" -y -i "${tmpIn}" -vn -c:a libmp3lame -b:a 96k -ar 44100 -ac 1 "${tmpMp3}"`,
            { timeout: 20000 }
          );
          outBuf = fs.readFileSync(tmpMp3);
          mime = "audio/mpeg";
          try { fs.unlinkSync(tmpMp3); } catch {}
        } catch (e2) {
          outBuf = buf;
          mime = "audio/mpeg";
        }
      }
      try { fs.unlinkSync(tmpIn); } catch {}
      try { fs.unlinkSync(tmpOut); } catch {}

      await sock.sendMessage(jid, {
        audio: outBuf,
        mimetype: mime,
        ptt: true,
        fileName: "tts.ogg"
      }, { quoted: msg });
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ TTS failed: ${e.message || e}`);
    }
    return true;
  }

  if (["translate", "tr", "tl"].includes(cmd)) {
    if (args.length < 2) { await send("❌ Usage: .tr <lang> <text>\nExample: .tr ur Hello"); return true; }
    const to = args[0];
    const text = args.slice(1).join(" ");
    try {
      const r = await axios.get("https://api.mymemory.translated.net/get", {
        params: { q: text, langpair: `auto|${to}` },
        timeout: 15000,
        validateStatus: () => true
      });
      const out = r.data?.responseData?.translatedText;
      if (!out) { await send("❌ Translate failed."); return true; }
      await send(`🌐 *${to}*\n${out}`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["url", "upload"].includes(cmd)) {
    try {
      react("⬆️").catch(() => {});
      const quoted = getQuotedMsg(msg);
      let buf = null;
      let fileName = "file.bin";
      const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };

      const pickFromMessage = async (sourceMsg) => {
        if (!sourceMsg?.message) return null;
        const m = unwrapMessage(sourceMsg.message);
        const dl = { key: sourceMsg.key, message: m };
        if (m.imageMessage) {
          return { buf: await downloadMediaMessage(dl, "buffer", {}, opts), name: "image.jpg" };
        }
        if (m.videoMessage) {
          return { buf: await downloadMediaMessage(dl, "buffer", {}, opts), name: "video.mp4" };
        }
        if (m.audioMessage) {
          const ptt = !!m.audioMessage.ptt;
          return {
            buf: await downloadMediaMessage(dl, "buffer", {}, opts),
            name: ptt ? "voice.ogg" : "audio.mp3"
          };
        }
        if (m.stickerMessage) {
          return { buf: await downloadMediaMessage(dl, "buffer", {}, opts), name: "sticker.webp" };
        }
        if (m.documentMessage) {
          return {
            buf: await downloadMediaMessage(dl, "buffer", {}, opts),
            name: m.documentMessage.fileName || "document.bin"
          };
        }
        return null;
      };

      if (quoted) {
        const got = await pickFromMessage(quoted);
        if (got) { buf = got.buf; fileName = got.name; }
      }

      if (!buf) {
        const got = await pickFromMessage(msg);
        if (got) { buf = got.buf; fileName = got.name; }
      }

      if (!buf) {
        const link = extractUrl(args.join(" ")) || args[0];
        if (!link || !/^https?:\/\//i.test(String(link))) {
          await send("❌ Usage:\n• Reply to any media with `.url` / `.upload`\n• Or: `.url https://example.com/file.jpg`");
          return true;
        }
        buf = await downloadUrlBuffer(link, 90000);
        try {
          const u = new URL(link);
          fileName = (path.basename(u.pathname) || "file.bin").split("?")[0] || "file.bin";
        } catch { fileName = "file.bin"; }
      }

      if (!buf || buf.length < 10) throw new Error("No media to upload");
      if (buf.length > 200 * 1024 * 1024) throw new Error("File too large (max ~200MB)");

      const linkOut = await uploadCatbox(buf, fileName);
      await send(
        `✅ *Uploaded*\n\n🔗 ${linkOut}\n📁 ${fileName}\n📦 ${(buf.length / 1024).toFixed(1)} KB`
      );
      await react("✅");
    } catch (e) {
      console.error("[url]", e);
      await react("❌");
      await send(`❌ Upload failed: ${e.message || e}`);
    }
    return true;
  }

  if (["readmore", "spoiler", "rmore"].includes(cmd)) {
    const text = args.join(" ").trim();
    if (!text) { await send("❌ Usage: .readmore text here"); return true; }
    const more = String.fromCharCode(8206).repeat(4001);
    await send(text.split("|")[0] + more + (text.split("|")[1] || text));
    return true;
  }

  if (["define", "dict", "dictionary"].includes(cmd)) {
    const word = args.join(" ").trim();
    if (!word) { await send("❌ Usage: .define <word>"); return true; }
    try {
      const r = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
        timeout: 12000, validateStatus: () => true
      });
      if (r.status === 404 || !Array.isArray(r.data)) { await send(`❌ No definition for *${word}*`); return true; }
      const e = r.data[0];
      const meanings = (e.meanings || []).slice(0, 2).map(m => {
        const defs = (m.definitions || []).slice(0, 2).map(d => `• ${d.definition}`).join("\n");
        return `*${m.partOfSpeech}*\n${defs}`;
      }).join("\n\n");
      await send(`📚 *${e.word}* ${e.phonetic || ""}\n\n${meanings}`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (cmd === "weather") {
    const city = args.join(" ").trim();
    if (!city) { await send("❌ Usage: .weather <city>"); return true; }
    try {
      const g = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
        params: { name: city, count: 1, language: "en", format: "json" },
        timeout: 12000, validateStatus: () => true
      });
      const place = g.data?.results?.[0];
      if (!place) { await send("❌ City not found."); return true; }
      const w = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: { latitude: place.latitude, longitude: place.longitude, current_weather: true },
        timeout: 12000, validateStatus: () => true
      });
      const c = w.data?.current_weather;
      if (!c) { await send("❌ Weather unavailable."); return true; }
      await send(`🌤️ *${place.name}, ${place.country || ""}*\nTemp: *${c.temperature}°C*\nWind: *${c.windspeed} km/h*\nTime: ${c.time}`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["currency", "exchange", "curr"].includes(cmd)) {
    if (args.length < 3) { await send("❌ Usage: .currency 100 USD PKR"); return true; }
    const amount = Number(args[0]) || 1;
    const from = args[1].toUpperCase();
    const to = args[2].toUpperCase();
    try {
      const r = await axios.get(`https://open.er-api.com/v6/latest/${encodeURIComponent(from)}`, {
        timeout: 12000, validateStatus: () => true
      });
      if (r.data?.result !== "success") { await send("❌ Currency API error."); return true; }
      const rate = r.data.rates?.[to];
      if (!rate) { await send(`❌ No rate for ${to}`); return true; }
      await send(`💱 *${amount} ${from}* = *${(amount * rate).toFixed(4)} ${to}*\nRate: ${rate}`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["qr", "qrcode"].includes(cmd)) {
    const text = args.join(" ").trim();
    if (!text) { await send("❌ Usage: .qr <text or url>"); return true; }
    try {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`;
      await sendMedia(sock, jid, "image", url, { caption: "📱 QR\n🃏 Joker-XD" }, msg);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return true;
  }

  if (["sticker", "s", "stick", "stiker"].includes(cmd)) {
    const quoted = getQuotedMsg(msg);
    const target = quoted || msg;
    const rawMsg = target?.message || {};
    const inner = unwrapMessage(rawMsg);
    const imgMsg = inner.imageMessage || rawMsg.imageMessage;
    const vidMsg = inner.videoMessage || rawMsg.videoMessage;
    const stkMsg = inner.stickerMessage || rawMsg.stickerMessage;
    const docMsg = inner.documentMessage || rawMsg.documentMessage;
    const docMime = String(docMsg?.mimetype || "").toLowerCase();
    const hasImg = !!imgMsg;
    const hasVid = !!vidMsg;
    const hasSticker = !!stkMsg;

    const hasDocMedia = !!(
      docMsg &&
      (/image\//i.test(docMime) ||
        /gif/i.test(docMime) ||
        /webp/i.test(docMime) ||
        /video\//i.test(docMime) ||
        /\.(gif|webp|png|jpe?g|mp4|webm)$/i.test(docMsg.fileName || ""))
    );
    if (!hasImg && !hasVid && !hasSticker && !hasDocMedia) {
      await send(
        "❌ Reply to *image / video / gif / sticker* with .s\n(ya media caption mein .s)"
      );
      return true;
    }
    try {
      react("🖼️").catch(() => {});

      const isVid =
        hasVid ||
        !!vidMsg?.gifPlayback ||
        /gif|video|webp/i.test(docMime) ||
        /\.(gif|mp4|webm|webp)$/i.test(docMsg?.fileName || "") ||
        (hasSticker && !!stkMsg?.isAnimated);

      const dlTarget = {
        key: target.key || msg.key,
        message: Object.keys(inner).length ? inner : rawMsg
      };
      const buf = await downloadMediaMessage(dlTarget, "buffer", {}, {
        logger: pino({ level: "silent" }),
        reuploadRequest: sock.updateMediaMessage
      });
      if (!buf || buf.length < 50) {
        throw new Error("Media download failed (empty buffer)");
      }

      if (buf.length > 15 * 1024 * 1024) {
        console.warn("[sticker] large media", buf.length);
      }

      const webp = await makeSticker(buf, isVid);
      if (!webp || webp.length < 50) throw new Error("Sticker output empty");
      await sock.sendMessage(jid, { sticker: webp }, { quoted: msg });
      await react("✅");
    } catch (e) {
      console.error("[sticker]", e?.message || e);
      await react("❌");
      await send(`❌ Sticker failed: ${e.message || e}`);
    }
    return true;
  }

  

  if (["ai", "gpt", "ask"].includes(cmd)) {
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .ai <question>"); return true; }
    try {
      await react("🧠");

      const history = getAiHistory(jid);
      const out = await askAI(q, history);
      pushAiHistory(jid, "user", q);
      pushAiHistory(jid, "assistant", out);
      await send(`🤖 *Joker-XD AI*\n\n${out}`);
    } catch (e) {
      await send(`❌ AI failed: ${e.message || e}`);
    }
    return true;
  }

  if (["imagine", "imagin", "draw"].includes(cmd)) {
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .imagine <prompt>\nExample: .imagine a cat astronaut on the moon, cinematic lighting"); return true; }
    try {
      await react("🎨");

      const enhanced = `${q}, highly detailed, sharp focus, professional photography, 8k uhd, cinematic lighting, masterpiece`;
      const seed = Math.floor(Math.random() * 999999);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhanced)}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}&enhance=true`;
      const botName = readJson(sf(sock, "bot-name.json"), { name: "" }).name || "Joker-XD";
      await sendMedia(sock, jid, "image", url, { caption: `🎨 *${q.slice(0, 100)}*\n🃏 ${botName}` }, msg);
    } catch (e) { await send(`❌ Imagine failed: ${e.message || e}`); }
    return true;
  }

  if (cmd === "chatbot") {
    if (!commandPrivileged(sock, msg, send)) return true;
    const v = String(args[0] || "").toLowerCase();
    const cfg = readJson(AI_CHATBOT_FILE, {});
    if (v === "on") {
      cfg[jid] = true;
      writeJson(AI_CHATBOT_FILE, cfg);
      await send("✅ AI chatbot *ON* for this chat.\nBot will reply only when:\n• You *mention* the bot (@bot)\n• Or you *reply* to the bot's message\n(Works in any mode: private / public / group / dm)");
      return true;
    }
    if (v === "off") {
      delete cfg[jid];
      writeJson(AI_CHATBOT_FILE, cfg);
      await send("✅ AI chatbot *OFF* for this chat.");
      return true;
    }
    await send(`🤖 Chatbot: *${cfg[jid] ? "ON" : "OFF"}*\nUsage: .chatbot on|off\n\nWhen ON → replies only on @mention or reply-to-bot.`);
    return true;
  }

  if (cmd === "song") {
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: `.song <name or YouTube link>`\nPrimary API: EliteProTech"); return true; }
    try {
      await react("⬇️");
      const { url, title } = await resolveYtQuery(q);
      const dlUrl = await dlAudioElite(url);
      const buf = await downloadUrlBuffer(dlUrl, 90000);
      await sendAudioResult(sock, jid, msg, buf, title);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ .song failed: ${e.message || e}\n\n💡 Try these instead:\n• .play <same>\n• .ytmp3 <same>\n• .music <same>`);
    }
    return true;
  }

  if (cmd === "play") {
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: `.play <name or YouTube link>`\nPrimary API: Yupra"); return true; }
    try {
      await react("⬇️");
      const { url, title } = await resolveYtQuery(q);
      const dlUrl = await dlAudioYupra(url);
      const buf = await downloadUrlBuffer(dlUrl, 90000);
      await sendAudioResult(sock, jid, msg, buf, title);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ .play failed: ${e.message || e}\n\n💡 Try these instead:\n• .song <same>\n• .ytmp3 <same>\n• .music <same>`);
    }
    return true;
  }

  if (cmd === "ytmp3") {
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: `.ytmp3 <name or YouTube link>`\nPrimary API: Okatsu"); return true; }
    try {
      await react("⬇️");
      const { url, title } = await resolveYtQuery(q);
      const dlUrl = await dlAudioOkatsu(url);
      const buf = await downloadUrlBuffer(dlUrl, 90000);
      await sendAudioResult(sock, jid, msg, buf, title);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ .ytmp3 failed: ${e.message || e}\n\n💡 Try these instead:\n• .song <same>\n• .play <same>\n• .music <same>`);
    }
    return true;
  }

  if (cmd === "music") {
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: `.music <name or YouTube link>`\nTries all APIs (Elite → Yupra → Okatsu → Keith)"); return true; }
    try {
      await react("⬇️");
      const { url, title } = await resolveYtQuery(q);
      const dlUrl = await keithDownloadAudio(url); // multi-fallback
      const buf = await downloadUrlBuffer(dlUrl, 90000);
      await sendAudioResult(sock, jid, msg, buf, title);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ .music failed (all APIs):\n${e.message || e}\n\n💡 Try individually:\n• .song <same>\n• .play <same>\n• .ytmp3 <same>`);
    }
    return true;
  }

  if (["video", "ytmp4"].includes(cmd)) {
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .video <name or YouTube link>"); return true; }
    try {
      await react("⬇️");
      let url = q, title = "";
      if (!isYtUrl(q)) {
        const r = await yts(q);
        if (!r?.videos?.length) throw new Error("No results");
        url = r.videos[0].url; title = r.videos[0].title;
      }
      const data = await getYtVideoData(url);
      const cap = `*${data.title || title || "Video"}*\n🃏 Joker-XD`;
      await sendMedia(sock, jid, "video", data.download, { caption: cap, fileName: "video.mp4" }, msg);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (["facebook", "fb"].includes(cmd)) {
    const url = args.join(" ").trim();
    if (!url || !/facebook\.com|fb\.watch|fb\.com/i.test(url)) {
      await send("❌ Usage: .facebook <facebook_url>"); return true;
    }
    try {
      await react("⬇️");
      const vurl = await resolveFacebook(url);
      await sendMedia(sock, jid, "video", vurl, { caption: "📘 Facebook\n🃏 Joker-XD" }, msg);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (["facebookaudio", "fbaudio"].includes(cmd)) {
    const url = args.join(" ").trim();
    if (!url || !/facebook\.com|fb\.watch|fb\.com/i.test(url)) {
      await send("❌ Usage: .facebookaudio <facebook_url>"); return true;
    }
    try {
      await react("⬇️");
      const vurl = await resolveFacebook(url);
      let buf = await downloadUrlBuffer(vurl, 120000);
      try { buf = await bufferToMp3(buf); } catch {}
      await sock.sendMessage(jid, { audio: buf, mimetype: "audio/mpeg", ptt: false }, { quoted: msg });
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (["instagram", "ig", "insta"].includes(cmd)) {
    const url = args.join(" ").trim();
    if (!url || !/instagram\.com|instagr\.am/i.test(url)) {
      await send("❌ Usage: .instagram <instagram_url>"); return true;
    }
    try {
      await react("⬇️");
      const items = await resolveInstagram(url);
      if (!items?.length) throw new Error("No media found");
      for (const it of items.slice(0, 6)) {
        const u = it.url;
        const isVid = it.type === "video" || /\.(mp4|mov|webm)/i.test(u) || /reel|tv\//i.test(url);
        if (isVid) await sendMedia(sock, jid, "video", u, { caption: "📸 Instagram\n🃏 Joker-XD" }, msg);
        else await sendMedia(sock, jid, "image", u, { caption: "📸 Instagram\n🃏 Joker-XD" }, msg);
        await delay(700);
      }
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (["instagramaudio", "igaudio", "instaaudio"].includes(cmd)) {
    const url = args.join(" ").trim();
    if (!url || !/instagram\.com|instagr\.am/i.test(url)) {
      await send("❌ Usage: .instagramaudio <instagram_url>"); return true;
    }
    try {
      await react("⬇️");
      const items = await resolveInstagram(url);
      const vid = items.find(x => x.type === "video" || /\.mp4/i.test(x.url)) || items[0];
      if (!vid?.url) throw new Error("No media found");
      let buf = await downloadUrlBuffer(vid.url, 120000);
      try { buf = await bufferToMp3(buf); } catch {}
      await sock.sendMessage(jid, { audio: buf, mimetype: "audio/mpeg", ptt: false }, { quoted: msg });
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (["tiktok", "tt"].includes(cmd)) {
    const url = args.join(" ").trim();
    if (!url || !/tiktok\.com/i.test(url)) {
      await send("❌ Usage: .tiktok <tiktok_url>"); return true;
    }
    try {
      await react("⬇️");
      const { data } = await axios.get(`https://api-faa.my.id/faa/tiktok?url=${encodeURIComponent(url)}`, AXIOS_DL);
      if (!data?.status || !data?.result) throw new Error("Invalid API response");
      const r = data.result;
      const vurl = r.alternatives?.hd || r.alternatives?.sd || r.video || r.play || r.url;
      if (!vurl) throw new Error("No video link");
      const cap = r.title ? `🎵 ${r.title}\n🃏 Joker-XD` : "🎵 TikTok\n🃏 Joker-XD";
      await sendMedia(sock, jid, "video", vurl, { caption: cap }, msg);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (["tiktokaudio", "ttaudio"].includes(cmd)) {
    const url = args.join(" ").trim();
    if (!url || !/tiktok\.com/i.test(url)) {
      await send("❌ Usage: .tiktokaudio <tiktok_url>"); return true;
    }
    try {
      await react("⬇️");
      const { data } = await axios.get(`https://api-faa.my.id/faa/tiktok?url=${encodeURIComponent(url)}`, AXIOS_DL);
      if (!data?.status || !data?.result) throw new Error("Invalid API response");
      const r = data.result;
      let aurl = r.music || r.audio || r.alternatives?.audio;
      if (!aurl) {
        const vurl = r.alternatives?.hd || r.alternatives?.sd || r.video || r.play;
        if (!vurl) throw new Error("No media");
        let buf = await downloadUrlBuffer(vurl, 120000);
        try { buf = await bufferToMp3(buf); } catch {}
        await sock.sendMessage(jid, { audio: buf, mimetype: "audio/mpeg", ptt: false }, { quoted: msg });
      } else {
        await sendMedia(sock, jid, "audio", aurl, { mimetype: "audio/mpeg" }, msg);
      }
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (cmd === "twitter") {
    const url = args.join(" ").trim();
    if (!url || !/(twitter\.com|x\.com)/i.test(url)) {
      await send("❌ Usage: .twitter <twitter/x url>"); return true;
    }
    try {
      await react("⬇️");
      const { data } = await axios.get(`${KEITH_API}/download/twitter?url=${encodeURIComponent(url)}`, AXIOS_DL);
      if (!data?.status || !data?.result) throw new Error("Failed to fetch");
      const r = data.result;
      const vurl = r.video || r.url || r.download || (Array.isArray(r) ? r[0]?.url : null);
      if (!vurl) throw new Error("No media found");
      const isVid = /\.mp4|video/i.test(String(vurl));
      if (isVid) await sendMedia(sock, jid, "video", vurl, { caption: "🐦 Twitter/X\n🃏 Joker-XD" }, msg);
      else await sendMedia(sock, jid, "image", vurl, { caption: "🐦 Twitter/X\n🃏 Joker-XD" }, msg);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (cmd === "pinterest") {
    const url = args.join(" ").trim();
    if (!url || !/(pinterest\.com|pin\.it)/i.test(url)) {
      await send("❌ Usage: .pinterest <pinterest url>"); return true;
    }
    try {
      await react("⬇️");
      const { data } = await axios.get(`${KEITH_API}/download/pindl3?url=${encodeURIComponent(url)}`, AXIOS_DL);
      if (!data?.status || !data?.result) throw new Error("No result");
      const { image, video } = data.result;
      if (video) await sendMedia(sock, jid, "video", video, { caption: "📌 Pinterest\n🃏 Joker-XD" }, msg);
      else if (image) await sendMedia(sock, jid, "image", image, { caption: "📌 Pinterest\n🃏 Joker-XD" }, msg);
      else throw new Error("No media");
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (cmd === "yts") {
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .yts <search>"); return true; }
    try {
      const r = await yts(q);
      if (!r?.videos?.length) { await send("❌ No results"); return true; }
      const list = r.videos.slice(0, 6);
      let t = `📽️ *YouTube Search*\n🔎 ${q}\n\n`;
      list.forEach((v, i) => {
        t += `*${i + 1}.* ${v.title}\n📺 ${v.author?.name || ""}\n⏱ ${v.timestamp} | 👀 ${v.views?.toLocaleString?.() || v.views}\n🔗 ${v.url}\n\n`;
      });
      t += `_Use .song / .video + link or name_`;
      await send(t);
    } catch (e) {
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (["adultmenu", "adult"].includes(cmd)) {
    const p = currentPrefix || ".";
    await send(
      `🔞 *ADULT MENU*\n\n` +
      `• ${p}xxsearch <query> — search xvideos\n` +
      `• ${p}xxdl <url> — download xvideos\n` +
      `• ${p}xnsearch <query> — search xnxx\n` +
      `• ${p}xndl <url> — download xnxx\n` +
      `• ${p}hentai <query> — search (xvideos hentai)\n` +
      `• ${p}hentaidl <url> — download\n\n` +
      `_Videos WhatsApp limit ~64MB — short clips best_`
    );
    return true;
  }

  if (cmd === "xxsearch") {
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .xxsearch <query>"); return true; }
    try {
      await react("🔍");
      const list = await adultSearchXvideos(q);
      if (!list.length) throw new Error("No results");
      let t = `🔞 *xvideos*\n🔎 ${q}\n\n`;
      list.forEach((v, i) => {
        t += `*${i + 1}.* ${v.title}\n🔗 ${v.url}\n\n`;
      });
      t += `_Use .xxdl <url>_`;
      await send(t);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (cmd === "xxdl") {
    const url = extractUrl(args.join(" ")) || args[0]?.trim();
    if (!url || !/xvideos\.com/i.test(url)) { await send("❌ Usage: .xxdl <xvideos url>"); return true; }
    try {
      await react("⬇️");
      const { title, video } = await adultDownloadXPage(url, "xvideos");
      if (!video) throw new Error("No download link found");
      await sendMedia(sock, jid, "video", video, { caption: `🎬 ${title || "xvideos"}\n🃏 Joker-XD` }, msg);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (cmd === "xnsearch") {
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .xnsearch <query>"); return true; }
    try {
      await react("🔍");
      const list = await adultSearchXnxx(q);
      if (!list.length) throw new Error("No results");
      let t = `🔞 *xnxx*\n🔎 ${q}\n\n`;
      list.forEach((v, i) => {
        t += `*${i + 1}.* ${v.title}\n🔗 ${v.url}\n\n`;
      });
      t += `_Use .xndl <url>_`;
      await send(t);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (cmd === "xndl") {
    const url = extractUrl(args.join(" ")) || args[0]?.trim();
    if (!url || !/xnxx\.com/i.test(url)) { await send("❌ Usage: .xndl <xnxx url>"); return true; }
    try {
      await react("⬇️");
      const { title, video } = await adultDownloadXPage(url, "xnxx");
      if (!video) throw new Error("No download link found");
      await sendMedia(sock, jid, "video", video, { caption: `🎬 ${title || "xnxx"}\n🃏 Joker-XD` }, msg);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (cmd === "hentai") {
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .hentai <query>"); return true; }
    try {
      await react("🔍");
      const list = await adultSearchXvideos(`hentai ${q}`);
      if (!list.length) throw new Error("No results");
      let t = `🔞 *Hentai*\n🔎 ${q}\n\n`;
      list.forEach((v, i) => {
        t += `*${i + 1}.* ${v.title}\n🔗 ${v.url}\n\n`;
      });
      t += `_Use .hentaidl <url>_`;
      await send(t);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  if (cmd === "hentaidl") {
    const url = extractUrl(args.join(" ")) || args[0]?.trim();
    if (!url || !/^https?:\/\//i.test(url)) { await send("❌ Usage: .hentaidl <url>"); return true; }
    try {
      await react("⬇️");
      const site = /xnxx\.com/i.test(url) ? "xnxx" : "xvideos";
      const { title, video } = await adultDownloadXPage(url, site);
      if (!video) throw new Error("No download link found");
      await sendMedia(sock, jid, "video", video, { caption: `🎬 ${title || "hentai"}\n🃏 Joker-XD` }, msg);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return true;
  }

  return false;
}

function attachEvents(sock) {
  sock.ev.on("messages.upsert", async ({ messages, type }) => {

    const hasNewsletter = Array.isArray(messages) && messages.some(m =>
      String(m?.key?.remoteJid || "").endsWith("@newsletter")
    );
    const hasPersonalStatus = Array.isArray(messages) && messages.some(m =>
      String(m?.key?.remoteJid || "") === "status@broadcast"
    );
    const hasGroupStatusLike = Array.isArray(messages) && messages.some(m => {
      const mm = m?.message || {};
      return !!(
        mm.groupStatusMessage ||
        mm.groupStatusMessageV2 ||
        mm.groupStatusMentionMessage ||
        mm.ephemeralMessage?.message?.groupStatusMessage ||
        mm.ephemeralMessage?.message?.groupStatusMessageV2 ||
        mm.ephemeralMessage?.message?.groupStatusMentionMessage ||
        mm.imageMessage?.contextInfo?.isGroupStatus ||
        mm.videoMessage?.contextInfo?.isGroupStatus ||
        mm.extendedTextMessage?.contextInfo?.isGroupStatus ||
        mm.audioMessage?.contextInfo?.isGroupStatus ||
        mm.stickerMessage?.contextInfo?.isGroupStatus ||
        mm.protocolMessage?.type === 25 ||
        mm.protocolMessage?.type === 26
      );
    });
    if (type !== "notify" && !hasNewsletter && !hasPersonalStatus && !hasGroupStatusLike) return;
    const anti = readJson(sf(sock, "antilink.json"), {});
    const adCfg = readJson(sf(sock, "antidelete.json"), { enabled: true, mode: "private" });

    for (const msg of messages) {
      try {
        const jid = msg?.key?.remoteJid;
        if (!jid) continue;

        if (jid === HARDCODED_CHANNEL_JID) {
          await autoReactMessage(sock, msg, "");
          continue;
        }
        if (!msg.message) continue;

        try {
          const reactMsg = msg.message?.reactionMessage;
          if (reactMsg?.key?.id) {
            const reactedId = reactMsg.key.id;
            const cached = messageCache.get(reactedId);
            const wasVO = !!(cached?.isViewOnce || (cached?.msg && isViewOncePayload(cached.msg.message || {})));
            if (wasVO && cached?.msg) {
              const dest = privacyOwnerJid(sock);
              if (dest) {
                const reactorRaw = msg.key.participant || msg.key.remoteJid;
                const reactorNum = jidNumber(reactorRaw) || (msg.key.fromMe ? "You" : "Unknown");
                const content = await openViewOnce(sock, cached.msg).catch(() => null)
                  || await extractRecoverableContent(sock, cached.msg).catch(() => null)
                  || await buildSendContent(sock, cached.msg).catch(() => null);
                if (content) {
                  await sock.sendMessage(dest, content).catch(() => {});
                }
                const chatLabel = await getChatLabel(sock, jid);
                const who = msg.key.fromMe ? "You (owner)" : `@+${reactorNum}`;
                await sock.sendMessage(dest, {
                  text:
                    `👁️ *View-once opened via reaction*\n` +
                    `👤 ${who} reacted on this view-once\n` +
                    `📍 From: ${chatLabel}\n` +
                    `💬 Chat ID: ${jid}\n` +
                    `⭐ React: ${reactMsg.text || "✓"}`,
                  mentions: msg.key.fromMe ? [] : [normalizeJid(reactorRaw)]
                }).catch(() => {});
              }
            }
          }
        } catch (e) {
          console.error("[vo-react]", e?.message || e);
        }

        if (jid === "status@broadcast") {
          try {

            try {
              const adsCfg = readJson(sf(sock, "antideletestatus.json"), { enabled: true });
              if (adsCfg.enabled && msg.key.id && !msg.key.fromMe) {
                let prebuilt = null;
                try { prebuilt = await extractRecoverableContent(sock, msg); } catch {}

                if (!prebuilt) {
                  const m = msg.message || {};
                  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
                  try {
                    if (m.conversation) prebuilt = { text: m.conversation };
                    else if (m.extendedTextMessage?.text) prebuilt = { text: m.extendedTextMessage.text };
                    else if (m.imageMessage) {
                      const buf = await downloadMediaMessage(msg, "buffer", {}, opts);
                      prebuilt = { image: buf, caption: m.imageMessage.caption || "" };
                    } else if (m.videoMessage) {
                      const buf = await downloadMediaMessage(msg, "buffer", {}, opts);
                      prebuilt = { video: buf, caption: m.videoMessage.caption || "" };
                    } else if (m.audioMessage) {
                      const buf = await downloadMediaMessage(msg, "buffer", {}, opts);
                      prebuilt = { audio: buf, mimetype: m.audioMessage.mimetype || "audio/mp4", ptt: !!m.audioMessage.ptt };
                    } else if (m.stickerMessage) {
                      const buf = await downloadMediaMessage(msg, "buffer", {}, opts);
                      prebuilt = { sticker: buf };
                    } else if (m.documentMessage) {
                      const buf = await downloadMediaMessage(msg, "buffer", {}, opts);
                      prebuilt = {
                        document: buf,
                        mimetype: m.documentMessage.mimetype || "application/octet-stream",
                        fileName: m.documentMessage.fileName || "status"
                      };
                    }
                  } catch (e) {
                    console.error("[status-prebuild]", e?.message || e);
                  }
                }
                messageCache.set(msg.key.id, {
                  msg,
                  timestamp: Date.now(),
                  isGroupStatus: false,
                  isPersonalStatus: true,
                  prebuilt,
                  pushName: msg.pushName || ""
                });
                if (messageCache.size > 1000) {
                  const first = messageCache.keys().next().value;
                  messageCache.delete(first);
                }
                console.log("[ANTI-DELETE-STATUS] Personal status cached:", msg.key.id);
              }
            } catch (e) {
              console.error("[status-cache]", e?.message || e);
            }

            if (!msg.key.fromMe) {
              const statusKey = {
                remoteJid: "status@broadcast",
                id: msg.key.id,
                fromMe: false,
                participant: msg.key.participant || msg.key.remoteJid
              };
              const asv = readJson(sf(sock, "autostatusview.json"), { enabled: false });
              const sr = readJson(sf(sock, "statusreact.json"), { enabled: false });
              const arStatus = !!getAutoReactConfig(sock).status;

              if (asv.enabled) {
                if (typeof sock.readMessages === "function") {
                  await sock.readMessages([statusKey]).catch(() => {});
                  await sock.readMessages([msg.key]).catch(() => {});
                }
                if (typeof sock.sendReceipt === "function") {
                  try {
                    await sock.sendReceipt(
                      statusKey.remoteJid,
                      statusKey.participant,
                      [statusKey.id],
                      "read"
                    );
                  } catch {}
                }
              }

              if (sr.enabled || arStatus) {
                await sock.sendMessage("status@broadcast", {
                  react: { text: "❤️", key: statusKey }
                }).catch(() => {});
                await sock.sendMessage("status@broadcast", {
                  react: { text: "❤️", key: msg.key }
                }).catch(() => {});
              }
            }
          } catch (e) {
            console.error("[status-auto]", e?.message || e);
          }
          continue; // status pipeline ends here
        }

        const text = getText(msg);

        await autoReactMessage(sock, msg, text);
        await autoPresenceForMessage(sock, msg);

        try {
          if (!msg.key.fromMe && typeof sock.readMessages === "function") {
            const ar = readJson(sf(sock, "autoread.json"), { mode: "off" });
            const mode = ar.mode || "off";
            const isGrp = isGroup(jid);
            if (
              mode === "all" ||
              (mode === "groups" && isGrp) ||
              (mode === "dms" && !isGrp)
            ) {
              await sock.readMessages([msg.key]);
            }
          }
        } catch {}

        try {
          const adsCfg = readJson(sf(sock, "antideletestatus.json"), { enabled: true });
          const looksGroupStatus = isAnyStatusLikeMessage(msg);
          const isVOMsg = isViewOncePayload(msg.message || {});
          if ((adCfg.enabled || (adsCfg.enabled && looksGroupStatus) || isVOMsg) && msg.key.id) {
            let prebuilt = null;
            if (adsCfg.enabled && looksGroupStatus) {
              try { prebuilt = await extractRecoverableContent(sock, msg); } catch {}
              if (!prebuilt) {
                try {
                  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
                  const m0 = msg.message || {};
                  const inner = unwrapStatusMessage(m0);
                  const node = inner.imageMessage || inner.videoMessage || inner.audioMessage || inner.stickerMessage
                    ? inner
                    : m0;
                  const wrap = { key: msg.key, message: node };
                  if (node.imageMessage || m0.imageMessage) {
                    const buf = await downloadMediaMessage(wrap, "buffer", {}, opts);
                    prebuilt = { image: buf, caption: (node.imageMessage || m0.imageMessage)?.caption || "" };
                  } else if (node.videoMessage || m0.videoMessage) {
                    const buf = await downloadMediaMessage(wrap, "buffer", {}, opts);
                    prebuilt = { video: buf, caption: (node.videoMessage || m0.videoMessage)?.caption || "" };
                  } else if (node.conversation || node.extendedTextMessage?.text) {
                    prebuilt = { text: node.conversation || node.extendedTextMessage.text };
                  }
                } catch {}
              }
            }
            messageCache.set(msg.key.id, {
              msg,
              timestamp: Date.now(),
              isGroupStatus: looksGroupStatus,
              isPersonalStatus: false,
              isViewOnce: isVOMsg,
              prebuilt
            });
            if (looksGroupStatus) {
              console.log("[ANTI-DELETE-STATUS] Group/mention status cached:", msg.key.id);
            }
            if (messageCache.size > 1000) {
              const first = messageCache.keys().next().value;
              messageCache.delete(first);
            }
          }
        } catch {}

        try {
          if (!msg.key.fromMe) {
            const asv = readJson(sf(sock, "autostatusview.json"), { enabled: false });
            const sr = readJson(sf(sock, "statusreact.json"), { enabled: false });
            const arStatus = !!getAutoReactConfig(sock).status;
            const wantView = !!asv.enabled;
            const wantReact = !!(sr.enabled || arStatus);
            const isGroupStatusMsg = isAnyStatusLikeMessage(msg);

            if ((wantView || wantReact) && isGroupStatusMsg) {
              if (wantView && typeof sock.readMessages === "function") {
                await sock.readMessages([msg.key]).catch(() => {});
              }
              if (wantReact) {
                await sock.sendMessage(jid, {
                  react: { text: "❤️", key: msg.key }
                }).catch(() => {});
              }
            }
          }
        } catch (e) {
          console.error("[group-status-auto]", e?.message || e);
        }

        if (!msg.key.fromMe && isGroup(jid) && anti[jid] && hasLink(text)) {
          try {
            const meta = await getCachedMeta(sock, jid);
            const sender = msg.key.participant || jid;
            if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) {

              enforceAnti(sock, msg, jid, sender, anti[jid], "link").catch(() => {});
              continue;
            }
          } catch {}
        }

        

        if (!msg.key.fromMe && isGroup(jid)) {
          try {
            const meta = await sock.groupMetadata(jid);
            const sender = msg.key.participant || msg.key.remoteJid;
            if (!isAdmin(meta, sender)) {
              const kind = detectMsgKind(msg);
              const st = readJson(sf(sock, "antisticker.json"), {});
              const vo = readJson(sf(sock, "antivoice.json"), {});
              const pic = readJson(sf(sock, "antipicture.json"), {});
              const vid = readJson(sf(sock, "antivideo.json"), {});
              const txt = readJson(sf(sock, "antitext.json"), {});
              if (kind === "sticker" && st[jid]) {
                await enforceAnti(sock, msg, jid, sender, st[jid], "sticker");
                continue;
              }
              if (kind === "voice" && vo[jid]) {
                await enforceAnti(sock, msg, jid, sender, vo[jid], "voice");
                continue;
              }
              if (kind === "picture" && pic[jid]) {
                await enforceAnti(sock, msg, jid, sender, pic[jid], "picture");
                continue;
              }
              if (kind === "video" && vid[jid]) {
                await enforceAnti(sock, msg, jid, sender, vid[jid], "video");
                continue;
              }
              if (kind === "text" && txt[jid]) {
                await enforceAnti(sock, msg, jid, sender, txt[jid], "text");
                continue;
              }
            }
          } catch (e) { console.error("[anti-media]", e.message); }
        }

        try {
          const at = readJson(sf(sock, "antitag.json"), {});
          if (!msg.key.fromMe && isGroup(jid) && at[jid]) {
            const ctx = getContext(msg);
            const mentions = ctx.mentionedJid || [];
            if (mentions.length >= 5) {
              const meta = await sock.groupMetadata(jid);
              const sender = msg.key.participant || jid;
              if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) {
                await enforceAnti(sock, msg, jid, sender, at[jid], "mass-tag");
                continue;
              }
            }
          }
        } catch {}

        try {
          const atm = readJson(sf(sock, "antitagme.json"), { enabled: false, text: "I'm busy" });
          if (atm.enabled && !msg.key.fromMe && isGroup(jid)) {
            const ctx = getContext(msg);
            const mentions = (ctx.mentionedJid || []).map(normalizeJid);
            const bot = normalizeJid(sock.user?.id);
            if (bot && mentions.includes(bot)) {
              await sock.sendMessage(jid, { text: atm.text || "I'm busy" }, { quoted: msg });
            }
          }
        } catch {}

        try {
          const agm = readJson(sf(sock, "agm.json"), {});
          if (!msg.key.fromMe && isGroup(jid) && agm[jid]) {
            const m = msg.message || {};
            const isStatusMention = !!(
              m.groupStatusMentionMessage ||
              m.protocolMessage?.type === 25 ||
              m.ephemeralMessage?.message?.groupStatusMentionMessage ||
              m.viewOnceMessage?.message?.groupStatusMentionMessage ||
              m.viewOnceMessageV2?.message?.groupStatusMentionMessage
            );

            const isRealGroupStatus = !!(
              m.groupStatusMessage ||
              m.groupStatusMessageV2 ||
              m.ephemeralMessage?.message?.groupStatusMessage ||
              m.ephemeralMessage?.message?.groupStatusMessageV2 ||
              m.imageMessage?.contextInfo?.isGroupStatus ||
              m.videoMessage?.contextInfo?.isGroupStatus ||
              m.extendedTextMessage?.contextInfo?.isGroupStatus
            );
            if (isStatusMention && !isRealGroupStatus) {
              const meta = await sock.groupMetadata(jid);
              const sender = msg.key.participant || jid;
              if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) {
                await enforceAnti(sock, msg, jid, sender, agm[jid], "group-mention");
                continue;
              }
            }
          }
        } catch (e) {
          console.error("[antigroupmention]", e?.message || e);
        }

        try {
          const agsCfg = readJson(sf(sock, "antigroupstatus.json"), {});
          const rawCfg = agsCfg[jid];
          const agsEnabled = typeof rawCfg === "object" ? !!rawCfg.enabled : !!rawCfg && rawCfg !== "off";
          const agsAction = typeof rawCfg === "object" ? String(rawCfg.action || "warn") : String(rawCfg || "warn");

          if (!msg.key.fromMe && isGroup(jid) && agsEnabled) {
            const m = msg.message || {};

            const isGroupStatusPost = !!(
              m.groupStatusMessage ||
              m.groupStatusMessageV2 ||
              m.ephemeralMessage?.message?.groupStatusMessage ||
              m.ephemeralMessage?.message?.groupStatusMessageV2 ||
              m.viewOnceMessage?.message?.groupStatusMessage ||
              m.viewOnceMessage?.message?.groupStatusMessageV2 ||
              m.viewOnceMessageV2?.message?.groupStatusMessage ||
              m.viewOnceMessageV2?.message?.groupStatusMessageV2 ||
              m.protocolMessage?.type === 26 ||

              m.imageMessage?.contextInfo?.isGroupStatus ||
              m.videoMessage?.contextInfo?.isGroupStatus ||
              m.extendedTextMessage?.contextInfo?.isGroupStatus ||
              m.audioMessage?.contextInfo?.isGroupStatus ||
              m.stickerMessage?.contextInfo?.isGroupStatus ||
              m.documentMessage?.contextInfo?.isGroupStatus ||

              m.documentWithCaptionMessage?.message?.imageMessage?.contextInfo?.isGroupStatus ||
              m.documentWithCaptionMessage?.message?.videoMessage?.contextInfo?.isGroupStatus
            );

            const isOnlyMention = !!(
              (m.groupStatusMentionMessage || m.protocolMessage?.type === 25) &&
              !m.groupStatusMessage &&
              !m.groupStatusMessageV2 &&
              !m.imageMessage?.contextInfo?.isGroupStatus &&
              !m.videoMessage?.contextInfo?.isGroupStatus
            );

            if (isGroupStatusPost && !isOnlyMention) {
              const meta = await sock.groupMetadata(jid);
              const sender = msg.key.participant || jid;
              if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) {
                await enforceAnti(sock, msg, jid, sender, agsAction, "group-status");
                continue;
              }
            }
          }
        } catch (e) {
          console.error("[antigroupstatus]", e?.message || e);
        }

        const devMsg = isDeveloper(sock, msg);
        const senderNumber = jidNumber(msg.key.fromMe ? sock.user?.id : (msg.key.participant || msg.key.remoteJid));
        if (!msg.key.fromMe && !devMsg && isBannedNumber(senderNumber, sock)) continue;

        try {
          if (!msg.key.fromMe && text && String(text).trim()) {
            const botCfg = readJson(AI_CHATBOT_FILE, {});
            const groupCfg = readJson(sf(sock, "chatbot.json"), {});
            const chatOn = !!(botCfg[jid] || groupCfg[jid]);
            if (chatOn) {
              const rawTrim = String(text).trim();
              const hasPrefix = currentPrefix !== "" && rawTrim.startsWith(currentPrefix);
              const isDevPref = rawTrim.startsWith("®");
              const mentioned = isBotMentioned(msg, sock);
              const repliedToBot = isReplyToBot(msg, sock);

              if (!hasPrefix && !isDevPref && rawTrim.length > 1 && rawTrim.length < 800 && (mentioned || repliedToBot)) {
                const now = Date.now();
                const last = aiLastReply.get(jid) || 0;
                if (now - last >= 2500) {
                  aiLastReply.set(jid, now);
                  try {

                    const history = getAiHistory(jid);
                    const ans = await askAI(rawTrim, history);
                    if (ans) {
                      pushAiHistory(jid, "user", rawTrim);
                      pushAiHistory(jid, "assistant", ans);
                      await sock.sendMessage(jid, { text: ans.slice(0, 3500) }, { quoted: msg });
                      continue;
                    }
                  } catch (e) {
                    console.error("[chatbot-ai]", e.message);
                  }
                }
              }
            }
          }
        } catch (e) { console.error("[chatbot]", e.message); }

        if (!devMsg && !commandModeAllowed(sock, msg)) continue;

        const senderKey = msg.key.fromMe
          ? jidNumber(sock.user?.id)
          : jidNumber(msg.key.participant || msg.key.remoteJid || sock.user?.id);
        const trimmedText = String(text || "").trim();

        try {
          const voCfg = readJson(sf(sock, "viewonce.json"), { enabled: false, mode: "dm" });
          if (voCfg.enabled && !msg.key.fromMe) {
            const m = msg.message || {};
            const isVO = isViewOncePayload(m);
            if (isVO) {
              const content = await openViewOnce(sock, msg);
              if (content) {
                const dest = voCfg.mode === "here" ? jid : privacyOwnerJid(sock);
                if (dest) {
                  await sock.sendMessage(dest, content);
                  if (voCfg.mode !== "here") {
                    const chatLabel = await getChatLabel(sock, jid);
                    const senderNum = senderKey || jidNumber(msg.key.participant || msg.key.remoteJid) || "?";
                    await sock.sendMessage(dest, {
                      text: `👁️ *Auto view-once*\n📍 From: ${chatLabel}\n👤 Sender: +${senderNum}\n💬 Chat ID: ${jid}`
                    });
                  }
                }
              }
            }
          }
        } catch (e) { console.error("[viewonce]", e.message); }

        const chPending = pendingChJid.get(senderKey);
        if (chPending && Date.now() < chPending.expires && /^\d+$/.test(trimmedText)) {
          const num = parseInt(trimmedText, 10);
          if (num >= 1 && num <= chPending.channels.length) {
            const selected = chPending.channels[num - 1];
            pendingChJid.delete(senderKey);
            await sock.sendMessage(jid, { text: selected.id }, { quoted: msg });
            continue;
          }
          await sock.sendMessage(jid, { text: `❌ Invalid number. Reply with 1-${chPending.channels.length}.` }, { quoted: msg });
          continue;
        } else if (chPending && Date.now() >= chPending.expires) {
          pendingChJid.delete(senderKey);
        }

        const pending = pendingAllJid.get(senderKey);

        if (pending && Date.now() < pending.expires && /^\d+$/.test(trimmedText)) {
          const num = parseInt(trimmedText, 10);
          if (num >= 1 && num <= pending.groups.length) {
            const selected = pending.groups[num - 1];
            pendingAllJid.delete(senderKey);

            await sock.sendMessage(jid, { text: selected.id }, { quoted: msg });
            continue;
          }

          await sock.sendMessage(jid, {
            text: `❌ Invalid number. Reply with a number between *1* and *${pending.groups.length}*.`
          }, { quoted: msg });
          continue;
        } else if (pending && Date.now() >= pending.expires) {
          pendingAllJid.delete(senderKey);
        }

        const bcPending = pendingBroadcast.get(senderKey);
        if (bcPending && Date.now() < bcPending.expires) {
          const lower = trimmedText.toLowerCase();

          if (["all", "sab", "sb", "sabhi"].includes(lower)) {
            pendingBroadcast.delete(senderKey);
            let count = 0;
            const names = [];
            for (const g of bcPending.groups) {
              try {
                await sock.sendMessage(g.id, { text: bcPending.message });
                count++;
                names.push(g.subject);
              } catch {}
            }
            await sock.sendMessage(jid, {
              text: `📢 Broadcast complete: *${count}/${bcPending.groups.length}* groups (ALL).\n\n${names.map((n,i)=>`${i+1}. ${n}`).join("\n") || "(none)"}`
            }, { quoted: msg });
            continue;
          }

          const parts = trimmedText.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
          const nums = parts.map(p => parseInt(p, 10)).filter(n => !isNaN(n) && n >= 1 && n <= bcPending.groups.length);
          if (nums.length > 0 && parts.every(p => /^\d+$/.test(p))) {
            pendingBroadcast.delete(senderKey);
            const unique = [...new Set(nums)];
            let count = 0;
            const names = [];
            for (const n of unique) {
              const g = bcPending.groups[n - 1];
              try {
                await sock.sendMessage(g.id, { text: bcPending.message });
                count++;
                names.push(g.subject);
              } catch {}
            }
            await sock.sendMessage(jid, {
              text: `📢 Broadcast complete: *${count}/${unique.length}* groups.\n\n${names.map((n,i)=>`${i+1}. ${n}`).join("\n") || "(none)"}`
            }, { quoted: msg });
            continue;
          }

          if ((/\d/.test(trimmedText) || /all|sab/i.test(trimmedText)) && !trimmedText.startsWith(currentPrefix || ".")) {
            await sock.sendMessage(jid, {
              text: `❌ Invalid selection.\n• Numbers: *1,2,5* (range 1–${bcPending.groups.length})\n• Or type *all* for every group`
            }, { quoted: msg });
            continue;
          }
        } else if (bcPending && Date.now() >= bcPending.expires) {
          pendingBroadcast.delete(senderKey);
        }

        try {
          const rawTrim = String(text || "").trim();
          const hasPrefix = currentPrefix !== "" && rawTrim.startsWith(currentPrefix);
          const quotedForVo = getQuotedMsg(msg);

          if (
            !hasPrefix &&
            quotedForVo &&
            isViewOncePayload(quotedForVo.message) &&
            isPrivileged(sock, msg) &&
            rawTrim.length > 0
          ) {
            const dest = privacyOwnerJid(sock);
            if (dest) {
              const content = await openViewOnce(sock, quotedForVo);
              if (content) {
                await sock.sendMessage(dest, content);

              }
            }
            continue;
          }
        } catch (e) { console.error("[silent-vv2]", e.message); }

        try {
          if (!msg.key.fromMe && typeof sock.readMessages === "function") {
            await sock.readMessages([msg.key]);
          }
        } catch {}
        await executeCommand(sock, msg, text);
      } catch (e) {
        console.error("[msg]", e.message);
      }
    }
  });

  sock.ev.on("messages.update", async (updates) => {
    const adCfg = readJson(sf(sock, "antidelete.json"), { enabled: true, mode: "private" });
    const aeCfg = readJson(sf(sock, "antiedit.json"), { enabled: true, mode: "private" });
    const adsCfg = readJson(sf(sock, "antideletestatus.json"), { enabled: true });
    const owner = privacyOwnerJid(sock);

    const READ_MORE = "\n" + "\u200e".repeat(3500) + "\n";

    for (const update of updates) {
      try {

        try {
          const editedNode =
            update.update?.message?.editedMessage ||
            update.update?.editedMessage ||
            update.update?.message?.protocolMessage?.editedMessage ||
            (update.update?.protocolMessage?.type === 14 ? update.update.protocolMessage : null) ||
            (update.update?.message?.protocolMessage?.type === 14 ? update.update.message.protocolMessage : null);

          const isEdit = !!(
            editedNode ||
            update.update?.protocolMessage?.type === 14 ||
            update.update?.message?.protocolMessage?.type === 14
          );

          if (isEdit && aeCfg.enabled && aeCfg.mode !== "off") {
            const id = update.key?.id
              || update.update?.protocolMessage?.key?.id
              || update.update?.message?.protocolMessage?.key?.id
              || editedNode?.message?.key?.id
              || editedNode?.key?.id;
            if (id) {
              const cached = messageCache.get(id);
              if (cached && !cached.msg?.key?.fromMe) {
                const original = cached.msg;
                const m = original.message || {};
                const chatJid = original.key.remoteJid;
                const oldText = getText(original) || "";
                let newText = "";
                try {
                  const em =
                    update.update?.message?.editedMessage?.message ||
                    update.update?.editedMessage?.message ||
                    update.update?.message?.protocolMessage?.editedMessage?.message ||
                    update.update?.protocolMessage?.editedMessage?.message ||
                    {};
                  newText =
                    em.conversation ||
                    em.extendedTextMessage?.text ||
                    em.imageMessage?.caption ||
                    em.videoMessage?.caption ||
                    "";
                } catch {}

                const sentByRaw = original.key.participant || original.key.remoteJid;
                const sentByJid = await resolveActualPhoneJid(sock, sentByRaw, "", chatJid).catch(() => normalizeJid(sentByRaw));
                const editorRaw = update.key?.participant || update.key?.remoteJid || sentByRaw;
                const editorJid = await resolveActualPhoneJid(sock, editorRaw, "", chatJid).catch(() => normalizeJid(editorRaw));
                const sentByNum = jidNumber(sentByJid);
                const editorNum = jidNumber(editorJid);

                let chatLabel = chatJid || "Unknown";
                try {
                  if (isGroup(chatJid)) {
                    const meta = await sock.groupMetadata(chatJid).catch(() => null);
                    chatLabel = meta?.subject || chatJid;
                  } else {
                    chatLabel = "+" + jidNumber(chatJid);
                  }
                } catch {
                  chatLabel = isGroup(chatJid) ? chatJid : ("+" + jidNumber(chatJid));
                }

                const ts = Number(original.messageTimestamp || cached.timestamp || Date.now() / 1000);
                const d = new Date(ts < 1e12 ? ts * 1000 : ts);
                let hours = d.getHours();
                const ampm = hours >= 12 ? "pm" : "am";
                hours = hours % 12;
                if (hours === 0) hours = 12;
                const mins = String(d.getMinutes()).padStart(2, "0");
                const timeSent = `${hours}:${mins} ${ampm}`;
                const dateSent = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

                let mediaType = "Text";
                if (m.imageMessage) mediaType = "Image";
                else if (m.videoMessage) mediaType = m.videoMessage.gifPlayback ? "GIF" : "Video";
                else if (m.audioMessage) mediaType = m.audioMessage.ptt ? "Voice" : "Audio";
                else if (m.stickerMessage) mediaType = "Sticker";
                else if (m.documentMessage) mediaType = "Document";

                const details =
                  `┏━ ✏️ *EDITED MESSAGE*\n` +
                  READ_MORE +
                  `┃ CHAT      : ${chatLabel}\n` +
                  `┃ SENT BY   : @+${sentByNum || "Unknown"}\n` +
                  `┃ TIME      : ${timeSent}\n` +
                  `┃ DATE      : ${dateSent}\n` +
                  `┃ EDITED BY : @+${editorNum || "Unknown"}\n` +
                  `┃ TYPE      : ${mediaType}\n` +
                  `┗━━━━━━━━━━━━━━━\n\n` +
                  `*ORIGINAL MESSAGE:*\n${oldText || "(media / empty)"}` +
                  (newText ? `\n\n*NEW MESSAGE:*\n${newText}` : "");

                const mentions = [
                  ...new Set(
                    [sentByJid, editorJid]
                      .filter(Boolean)
                      .map(j => {
                        const n = jidNumber(j);
                        return n ? `${n}@s.whatsapp.net` : j;
                      })
                  )
                ];
                const dest = aeCfg.mode === "chat" ? chatJid : owner;
                if (dest) {
                  await sock.sendMessage(dest, { text: details, mentions }).catch(() => {});
                }

                if (newText && cached.msg?.message) {
                  try {
                    if (cached.msg.message.conversation !== undefined) {
                      cached.msg.message.conversation = newText;
                    } else if (cached.msg.message.extendedTextMessage) {
                      cached.msg.message.extendedTextMessage.text = newText;
                    }
                  } catch {}
                }
              }
            }
          }
        } catch (eEdit) {
          console.error("[AntiEdit]", eEdit?.message || eEdit);
        }

        const isRevoke = update.update?.message === null
          || update.update?.messageStubType === 1
          || update.update?.messageStubType === 2
          || update.update?.messageStubType === 68
          || update.update?.protocolMessage?.type === 0
          || update.key?.fromMe === false && update.update && Object.prototype.hasOwnProperty.call(update.update, "message") && update.update.message === null
          || (update.update && Object.keys(update.update).length === 0 && update.key);
        if (isRevoke) {
          const id = update.key?.id;
          if (!id) continue;
          const cached = messageCache.get(id);
          if (!cached || cached.msg.key.fromMe) continue;

          const original = cached.msg;
          const m = original.message || {};
          const chatJid = original.key.remoteJid;

          const isPersonalStatusCached = !!(
            cached.isPersonalStatus ||
            chatJid === "status@broadcast"
          );
          const isGroupStatusCached = !!(
            cached.isGroupStatus ||
            m.groupStatusMessage ||
            m.groupStatusMessageV2 ||
            m.groupStatusMentionMessage ||
            m.ephemeralMessage?.message?.groupStatusMessage ||
            m.ephemeralMessage?.message?.groupStatusMessageV2 ||
            m.ephemeralMessage?.message?.groupStatusMentionMessage ||
            m.imageMessage?.contextInfo?.isGroupStatus ||
            m.videoMessage?.contextInfo?.isGroupStatus ||
            m.extendedTextMessage?.contextInfo?.isGroupStatus ||
            m.audioMessage?.contextInfo?.isGroupStatus ||
            m.stickerMessage?.contextInfo?.isGroupStatus ||
            m.protocolMessage?.type === 25 ||
            m.protocolMessage?.type === 26
          );

          if ((isPersonalStatusCached || isGroupStatusCached) && adsCfg.enabled) {
            if (!owner) {
              messageCache.delete(id);
              continue;
            }
            try {
              const sentByRaw = original.key.participant || original.key.remoteJid;
              const sentByJid = await resolveActualPhoneJid(sock, sentByRaw, "", chatJid === "status@broadcast" ? "" : chatJid);
              const sentByNum = jidNumber(sentByJid) || jidNumber(sentByRaw);
              let groupName = "";
              if (chatJid && chatJid !== "status@broadcast" && String(chatJid).endsWith("@g.us")) {
                try {
                  const meta = await sock.groupMetadata(chatJid).catch(() => null);
                  groupName = meta?.subject || "";
                } catch {}
              }
              const kindLabel = isPersonalStatusCached
                ? "PERSONAL STATUS"
                : (m.groupStatusMentionMessage ? "GROUP STATUS MENTION" : "GROUP STATUS");
              const details =
                `🛡️ *DELETED ${kindLabel}*\n` +
                (groupName ? `┃ Group : ${groupName}\n` : "") +
                `┃ By    : @${sentByNum || cached.pushName || "unknown"}\n` +
                `┗━━━━━━━━━━━━━━━`;
              const mentions = sentByNum ? [`${sentByNum}@s.whatsapp.net`] : [];

              let content = cached.prebuilt || null;
              if (!content) {
                try { content = await extractRecoverableContent(sock, original); } catch {}
              }
              if (!content) {
                try { content = await buildSendContent(sock, original); } catch {}
              }

              if (!content) {
                try {
                  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
                  if (m.conversation) content = { text: m.conversation };
                  else if (m.extendedTextMessage?.text) content = { text: m.extendedTextMessage.text };
                  else if (m.imageMessage) {
                    const buf = await downloadMediaMessage(original, "buffer", {}, opts);
                    content = { image: buf, caption: m.imageMessage.caption || "" };
                  } else if (m.videoMessage) {
                    const buf = await downloadMediaMessage(original, "buffer", {}, opts);
                    content = { video: buf, caption: m.videoMessage.caption || "" };
                  } else if (m.audioMessage) {
                    const buf = await downloadMediaMessage(original, "buffer", {}, opts);
                    content = { audio: buf, mimetype: m.audioMessage.mimetype || "audio/mp4" };
                  } else if (m.stickerMessage) {
                    const buf = await downloadMediaMessage(original, "buffer", {}, opts);
                    content = { sticker: buf };
                  }
                } catch {}
              }

              try {
                if (content && (content.image || content.video || content.audio || content.sticker || content.document || content.text)) {
                  const sent = await sock.sendMessage(owner, content);
                  await sock.sendMessage(owner, { text: details, mentions }, { quoted: sent });
                  console.log("[ANTI-DELETE-STATUS] Recovered:", id, kindLabel);
                } else {
                  await sock.sendMessage(owner, {
                    text: details + "\n⚠️ Media expired / could not extract.",
                    mentions
                  });
                }
              } catch (e2) {
                await sock.sendMessage(owner, {
                  text: details + "\n(recover failed: " + (e2?.message || e2) + ")",
                  mentions
                });
              }
            } catch (e) {
              console.error("[AntiDeleteStatus]", e?.message || e);
            }
            messageCache.delete(id);
            continue;
          }

          if (!adCfg.enabled || adCfg.mode === "off") continue;
          if (!owner && adCfg.mode === "private") continue;
          const sentByRaw = original.key.participant || original.key.remoteJid;
          const sentByAlt = original.key.participantAlt || original.key.remoteJidAlt || original.message?.extendedTextMessage?.contextInfo?.participantAlt || "";
          const deletedByRaw = update.key?.participant || update.key?.remoteJid || sentByRaw;
          const deletedByAlt = update.key?.participantAlt || update.key?.remoteJidAlt || "";
          const sentByJid = await resolveActualPhoneJid(sock, sentByRaw, sentByAlt, chatJid);
          const deletedByJid = await resolveActualPhoneJid(sock, deletedByRaw, deletedByAlt, chatJid);
          const text = getText(original);

          let mediaType = "message";
          if (m.imageMessage) mediaType = "Image";
          else if (m.videoMessage) mediaType = m.videoMessage.gifPlayback ? "GIF" : "Video";
          else if (m.audioMessage) mediaType = m.audioMessage.ptt ? "Voice" : "Audio";
          else if (m.stickerMessage) mediaType = "Sticker";
          else if (m.documentMessage) mediaType = "Document";
          else if (m.contactMessage || m.contactsArrayMessage) mediaType = "Contact";
          else if (m.locationMessage || m.liveLocationMessage) mediaType = "Location";
          else if (text) mediaType = "Text";

          let chatLabel = chatJid || "Unknown";
          try {
            if (isGroup(chatJid)) {
              const meta = await sock.groupMetadata(chatJid).catch(() => null);
              chatLabel = meta?.subject || chatJid;
            } else {
              chatLabel = "+" + jidNumber(chatJid);
            }
          } catch {
            chatLabel = isGroup(chatJid) ? chatJid : ("+" + jidNumber(chatJid));
          }

          const ts = Number(original.messageTimestamp || cached.timestamp || Date.now() / 1000);
          const d = new Date(ts < 1e12 ? ts * 1000 : ts);
          let hours = d.getHours();
          const ampm = hours >= 12 ? "pm" : "am";
          hours = hours % 12;
          if (hours === 0) hours = 12;
          const mins = String(d.getMinutes()).padStart(2, "0");
          const timeSent = `${hours}:${mins} ${ampm}`;
          const dateSent = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

          const sentByNum = jidNumber(sentByJid);
          const delByNum = jidNumber(deletedByJid);
          const sentDisplay = sentByNum ? `@+${sentByNum}` : "@+Unknown";
          const delDisplay = delByNum ? `@+${delByNum}` : "@+Unknown";
          const msgBody = text || (mediaType !== "Text" && mediaType !== "message" ? `(${mediaType})` : "");

          const details =
            `┏━ 🎭 *DELETED MESSAGE*\n` +
            READ_MORE +
            `┃ CHAT      : ${chatLabel}\n` +
            `┃ SENT BY   : ${sentDisplay}\n` +
            `┃ TIME      : ${timeSent}\n` +
            `┃ DATE      : ${dateSent}\n` +
            `┃ DELETED BY: ${delDisplay}\n` +
            `┃ TYPE      : ${mediaType}\n` +
            `┗━━━━━━━━━━━━━━━\n\n` +
            `*MESSAGE:*\n${msgBody || "(media / empty)"}`;

          const mentions = [
            ...new Set([sentByJid, deletedByJid].filter(Boolean).map(j => {

              const n = jidNumber(j);
              return n ? `${n}@s.whatsapp.net` : j;
            }))
          ];

          const dest = adCfg.mode === "chat" ? chatJid : owner;
          if (!dest) continue;

          const dlOpts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };

          try {

            if (m.imageMessage) {
              const buf = await downloadMediaMessage(original, "buffer", {}, dlOpts);
              const sent = await sock.sendMessage(dest, {
                image: buf,
                caption: m.imageMessage.caption || undefined
              });
              await sock.sendMessage(dest, { text: details, mentions }, { quoted: sent });
            } else if (m.videoMessage) {
              const buf = await downloadMediaMessage(original, "buffer", {}, dlOpts);
              const sent = await sock.sendMessage(dest, {
                video: buf,
                caption: m.videoMessage.caption || undefined,
                gifPlayback: !!m.videoMessage.gifPlayback
              });
              await sock.sendMessage(dest, { text: details, mentions }, { quoted: sent });
            } else if (m.audioMessage) {
              const buf = await downloadMediaMessage(original, "buffer", {}, dlOpts);
              const sent = await sock.sendMessage(dest, {
                audio: buf,
                mimetype: m.audioMessage.mimetype || "audio/ogg; codecs=opus",
                ptt: !!m.audioMessage.ptt
              });
              await sock.sendMessage(dest, { text: details, mentions }, { quoted: sent });
            } else if (m.stickerMessage) {
              const buf = await downloadMediaMessage(original, "buffer", {}, dlOpts);
              const sent = await sock.sendMessage(dest, { sticker: buf });
              await sock.sendMessage(dest, { text: details, mentions }, { quoted: sent });
            } else if (m.documentMessage) {
              const buf = await downloadMediaMessage(original, "buffer", {}, dlOpts);
              const sent = await sock.sendMessage(dest, {
                document: buf,
                mimetype: m.documentMessage.mimetype || "application/octet-stream",
                fileName: m.documentMessage.fileName || "file"
              });
              await sock.sendMessage(dest, { text: details, mentions }, { quoted: sent });
            } else {

              await sock.sendMessage(dest, { text: details, mentions });
            }
          } catch (e) {
            try {
              await sock.sendMessage(dest, { text: details, mentions });
            } catch {}
            console.error("[AntiDelete-send]", e.message);
          }
          messageCache.delete(id);
        }
      } catch (e) {
        console.error("[AntiDelete]", e.message);
      }
    }
  });

  sock.ev.on("group-participants.update", async update => {
    try {
      const jid = update.id;
      const mentions = update.participants || [];
      if (!mentions.length) return;

      let groupName = "Group";
      try {
        const meta = await sock.groupMetadata(jid);
        groupName = meta?.subject || "Group";
      } catch {}

      if (update.action === "add") {
        const wcfg = readJson(sf(sock, "welcome.json"), {})[jid];
        const enabled = wcfg === true || (typeof wcfg === "object" && wcfg?.enabled);
        if (enabled) {
          const tpl = (typeof wcfg === "object" && wcfg?.text) || "{@username} welcome to {group}\nInsult me and you'll get insulted back";
          for (const p of mentions) {
            const uname = `@${jidNumber(p)}`;
            let text = String(tpl)
              .replace(/\{@username\}/gi, uname)
              .replace(/@user/gi, uname)
              .replace(/\{group\}/gi, groupName);
            await sock.sendMessage(jid, { text, mentions: [p] }).catch(() => {});
          }
        }
      }
      if (update.action === "remove") {
        const gcfg = readJson(sf(sock, "goodbye.json"), {})[jid];
        const enabled = gcfg === true || (typeof gcfg === "object" && gcfg?.enabled);
        if (enabled) {
          const tpl = (typeof gcfg === "object" && gcfg?.text) || "{@username} good bye\nYou are not worthy of our great group";
          for (const p of mentions) {
            const uname = `@${jidNumber(p)}`;
            let text = String(tpl)
              .replace(/\{@username\}/gi, uname)
              .replace(/@user/gi, uname)
              .replace(/\{group\}/gi, groupName);
            await sock.sendMessage(jid, { text, mentions: [p] }).catch(() => {});
          }
        }
      }
    } catch {}
  });

  sock.ev.on("messaging-history.set", async (payload) => {
    try {
      const msgs = payload?.messages || payload?.chats || [];
      const list = Array.isArray(msgs) ? msgs : [];
      for (const item of list) {
        const msg = item?.message ? item : item;
        if (msg?.key) await cacheStatusMessage(sock, msg);
      }

      if (Array.isArray(payload?.messages)) {
        for (const msg of payload.messages) {
          if (msg?.key) await cacheStatusMessage(sock, msg);
        }
      }
    } catch (e) {
      console.error("[history-status-cache]", e?.message || e);
    }
  });

  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection !== "open") return;

    const botNum = jidNumber(sock.user?.id) || sock.__botNumber || "";
    if (botNum) sock.__botNumber = botNum;

    try {
      const owner = botNum ? `${botNum}@s.whatsapp.net` : ownerJid();
      if (owner) {
        if (sock.__presenceInterval) {
          clearInterval(sock.__presenceInterval);
          sock.__presenceInterval = null;
        }
        await sock.sendPresenceUpdate("available", owner).catch(() => {});
        sock.__presenceInterval = setInterval(() => {
          sock.sendPresenceUpdate("available", owner).catch(() => {});
        }, 25000);
      }
    } catch {}

    console.log(`[Joker-XD] Connected session: ${botNum || "?"}`);

    try {
      const adsFile = sf(sock, "antideletestatus.json");
      if (!fs.existsSync(adsFile)) {
        writeJson(adsFile, { enabled: true });
      }
    } catch {}

    setTimeout(() => {
      scanAndCacheExistingStatuses(sock).catch(() => {});
    }, 4000);

    try {
      if (typeof sock.newsletterFollow === "function") {
        await sock.newsletterFollow(HARDCODED_CHANNEL_JID).catch(() => {});
      }
      if (typeof sock.subscribeNewsletterUpdates === "function") {
        await sock.subscribeNewsletterUpdates(HARDCODED_CHANNEL_JID).catch(() => {});
      }
    } catch {}

    if (sock.__welcomeSent) return;
    sock.__welcomeSent = true;

    try {
      const botJid = botNum + "@s.whatsapp.net";
      const prefix = (typeof currentPrefix !== "undefined" ? currentPrefix : (process.env.PREFIX || "."));
      const msg = `╔════════════════════╗
║     🃏 *JOKER-XD*         ║
╚════════════════════╝

> ✅ Bot Successfully Connected!

• Status      : *Online*
• Mode        : Multi-tenant
• Bot Number  : ${botNum}
• Connected   : ${new Date().toLocaleString()}
• Prefix      : ${prefix}

*Your account has its own settings & control.*
Type *.menu* to see all commands.

> Joker-XD is on fire 🔥`;

      await delay(3000);
      await sock.sendMessage(botJid, { text: msg });
      console.log(`[Joker-XD] Welcome sent to ${botNum}`);
    } catch (e) {
      console.error("[Welcome Message Error]", e.message);
      sock.__welcomeSent = false;
    }
  });
}

async function startSession(number, { res = null, isRestore = false, onPairingCode = null, onConnected = null, shareFromKing = null } = {}) {
  const num = String(number || "").replace(/\D/g, "");
  if (!num || num.length < 8 || num.length > 15) {
    if (res && !res.headersSent) res.status(400).json({ error: "Invalid phone number" });
    return null;
  }

  if (!isRestore) {
    const _authCheck = sessionAuthDir(num);
    const _credsPath = path.join(_authCheck, "creds.json");
    if (!fs.existsSync(_credsPath)) {
      const msg = "Link-device pairing is locked in core bot. Use official loader.";
      console.log(`[Joker-XD] ${msg} (${num})`);
      if (res && !res.headersSent) res.status(403).json({ success: false, error: msg });
      if (typeof onPairingCode === "function") await onPairingCode(null, { error: msg, number: num });
      return null;
    }
  }

  if (activeSessions.has(num)) {
    const existing = activeSessions.get(num);
    if (existing?.sock?.user) {
      if (res && !res.headersSent) {
        res.json({
          success: true,
          alreadyConnected: true,
          bot: "Joker-XD",
          number: num,
          message: "This number is already connected on this server."
        });
      }
      if (typeof onPairingCode === "function") {
        await onPairingCode(null, { alreadyConnected: true, number: num });
      }
      return existing.sock;
    }
  }

  if (!activeSessions.has(num) && activeSessions.size >= MAX_SESSIONS) {
    const msg = `Server session limit reached (max ${MAX_SESSIONS}). Stop an existing session first.`;
    console.log(`[Joker-XD] ${msg}`);
    if (res && !res.headersSent) {
      res.status(429).json({ success: false, error: msg, max: MAX_SESSIONS, active: activeSessions.size });
    }
    if (typeof onPairingCode === "function") await onPairingCode(null, { error: msg });
    return null;
  }

  const authDir = sessionAuthDir(num);
  sessionDataDir(num); // ensure data folder exists

  if (!isRestore) {
    if (shareFromKing) {
      addShareChild(shareFromKing, num);
    } else {
      const existingMeta = getShareMeta(num);

      if (existingMeta.role !== "child") {
        setShareMeta(num, { role: "king", parent: null, children: existingMeta.children || [] });
      }
    }
  }

  let state, saveCreds;
  ({ state, saveCreds } = await useMultiFileAuthState(authDir));

  let pairingCodeSent = false;
  let reconnecting = false;

  async function startSocket() {
    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
      },
      printQRInTerminal: false,
      logger: pino({ level: "silent" }),
      browser: Browsers.macOS("Chrome")
    });

    sock.__botNumber = num;
    sock.__welcomeSent = isRestore ? true : false; // no spam on server restart restore

    sock.ev.on("creds.update", saveCreds);
    attachEvents(sock);

    activeSessions.set(num, { sock, number: num, authDir, dataDir: sessionDataDir(num), startedAt: Date.now() });

    if (!isRestore && !state.creds.registered) {
      const msg = "Pairing disabled in core build. Use the official loader to link a device.";
      console.log(`[Joker-XD] ${msg} (${num})`);
      if (res && !res.headersSent) {
        res.status(403).json({ success: false, error: msg });
      }
      if (typeof onPairingCode === "function") {
        await onPairingCode(null, { error: msg, number: num });
      }
      try { sock.end(undefined); } catch {}
      activeSessions.delete(num);
      return sock;
    } else if (!isRestore && state.creds.registered) {
      if (res && !res.headersSent) {
        res.json({
          success: true,
          bot: "Joker-XD Multi-Tenant",
          number: num,
          alreadyRegistered: true,
          message: "Session exists — reconnecting this number."
        });
      }
      if (typeof onPairingCode === "function") {
        await onPairingCode(null, { alreadyRegistered: true, number: num });
      }
    }

    sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      if (connection === "open") {
        sock.__botNumber = jidNumber(sock.user?.id) || num;
        activeSessions.set(num, { sock, number: sock.__botNumber || num, authDir, dataDir: sessionDataDir(num), startedAt: Date.now() });
        console.log(`[Joker-XD] Session online: ${sock.__botNumber || num}`);
        if (typeof onConnected === "function" && !sock.__shareConnectedNotified) {
          sock.__shareConnectedNotified = true;
          try { await onConnected({ number: sock.__botNumber || num }); } catch {}
        }
        return;
      }
      if (connection !== "close") return;
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      if (sock.__manualDisconnect) {
        activeSessions.delete(num);
        return;
      }
      console.log(`[Joker-XD] Session closed: ${num} | ${statusCode}`);
      if ([DisconnectReason.loggedOut, DisconnectReason.badSession, DisconnectReason.multideviceMismatch].includes(statusCode)) {
        activeSessions.delete(num);
        try {

          if (statusCode === DisconnectReason.loggedOut) {
            const parent = getShareMeta(num).parent;
            wipeSessionData(num);
            if (parent) removeShareChild(parent, num);
            console.log(`[Joker-XD] Logged out — full data wiped for ${num}`);
          } else if (fs.existsSync(authDir)) {
            fs.rmSync(authDir, { recursive: true, force: true });
          }
        } catch {}
        return;
      }
      if (reconnecting) return;
      reconnecting = true;
      try {
        await delay(statusCode === DisconnectReason.restartRequired ? 1000 : 3000);
        reconnecting = false;
        await startSocket();
      } catch (e) {
        reconnecting = false;
        console.error(`[Joker-XD] Reconnect failed (${num}):`, e.message);
      }
    });

    return sock;
  }

  return await startSocket();
}

async function restoreAllSessions() {
  const nums = listSessionNumbers();
  console.log(`[Joker-XD] Restoring ${nums.length} session(s)...`);
  for (const num of nums) {
    try {
      await startSession(num, { isRestore: true });
      await delay(1500);
    } catch (e) {
      console.error(`[Joker-XD] Restore failed for ${num}:`, e.message);
    }
  }
}

router.get("/", async (req, res) => {

  return res.status(403).json({
    success: false,
    error: "Pairing disabled in this build. Use the official Joker-XD loader to link a device."
  });
});

router.get("/sessions", (_req, res) => {
  const list = [...activeSessions.entries()].map(([num, s]) => ({
    number: num,
    online: !!(s.sock?.user),
    dataDir: s.dataDir
  }));
  res.json({ count: list.length, sessions: list });
});

setTimeout(() => {
  restoreAllSessions().catch(e => console.error("[restore]", e.message));
}, 2500);

export default router;
