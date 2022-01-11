const puppeteer = require("puppeteer");

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
  async genHTML(url) {
    let page = await this.newPage();
    let response = await page.goto(url, { waitUntil: "networkidle2" });
    if (response && !response.ok()) {
      throw new Error(`${response.status} on ${url}`);
    }
    return "html";
  }
  async destroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = Skeleton;
