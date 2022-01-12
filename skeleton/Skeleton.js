const puppeteer = require("puppeteer");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const { sleep } = require("./utils");
class Skeleton {
  constructor(options) {
    this.options = options;
  }
  async initialize() {
    this.browser = await puppeteer.launch({ headless: false });
  }
  async newPage() {
    let { device } = this.options;
    let page = await this.browser.newPage();
    await page.emulate(puppeteer.devices[device]);
    return page;
  }
  async makeSkeleton(page) {
    const { defer = 5000 } = this.options;
    let scriptContent = await readFileSync(
      resolve(__dirname, "skeletonScript.js"),
      "utf8"
    );
    await page.addScriptTag({ content: scriptContent });
    await sleep(defer);
    // 创建骨架屏的DOM结构
    await page.evaluate((options) => {
      Skeleton.genSkeleton(options);
    }, this.options);
  }
  async genHTML(url) {
    let page = await this.newPage();
    let response = await page.goto(url, { waitUntil: "networkidle2" });
    if (response && !response.ok()) {
      throw new Error(`${response.status} on ${url}`);
    }
    // 创建骨架屏
    await this.makeSkeleton(page);
    const { html, styles } = await page.evaluate(() =>
      Skeleton.getHtmlAndStyle()
    );
    let result = `
      <style>${styles.join("\n")}</style>
      ${html}
    `;
    return result;
  }
  async destroy() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = Skeleton;
