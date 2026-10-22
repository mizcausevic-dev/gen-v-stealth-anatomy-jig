import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = process.argv[2] || "/tmp/jig-frames";
const only = process.argv[3];
const frames = only ? only.split(",").map(Number) : null;
const TOTAL = 1020;
const WORKERS = frames ? 1 : 3;
await mkdir(outDir, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"]
});
const ranges = frames ? [[0, frames.length, frames]] : Array.from({ length: WORKERS }, (_, i) => {
  const size = Math.ceil(TOTAL / WORKERS);
  return [i * size, Math.min(TOTAL, (i + 1) * size), null];
});
async function renderRange(start, end, list, worker) {
  const page = await browser.newPage();
  page.on("pageerror", (err) => console.error("PAGE", worker, err.message));
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:8741/jig.html", { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForFunction(() => window.__jigReady === true, { timeout: 30000 });
  const el = await page.$("#viewport");
  const seq = list || Array.from({ length: end - start }, (_, n) => start + n);
  for (const frame of seq) {
    await page.evaluate((f) => window.Jig.renderFrame(f, document.getElementById("viewport")), frame);
    const file = path.join(outDir, String(frame).padStart(4, "0") + ".jpg");
    await el.screenshot({ type: "jpeg", quality: 90, path: file });
    if (!list && (frame === start || frame % 120 === 0)) console.log("worker", worker, "frame", frame);
    if (list) console.log(file);
  }
  await page.close();
}
const t0 = Date.now();
await Promise.all(ranges.map((r, i) => renderRange(r[0], r[1], r[2], i)));
await browser.close();
console.log("done", frames ? frames.length : TOTAL, "in", ((Date.now() - t0) / 1000).toFixed(1), "s");
