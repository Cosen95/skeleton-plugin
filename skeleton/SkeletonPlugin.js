const PLUGIN_NAME = "SkeletonPlugin"; // 插件名称
const Server = require("./Server");
const Skeleton = require("./Skeleton");
const { resolve } = require("path");
const { writeFileSync, readFileSync } = require("fs-extra");

class SkeletonPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    console.log("SkeletonPlugin");
    compiler.hooks.done.tap(PLUGIN_NAME, async () => {
      // 启动http服务
      await this.startServer();
      // 生成骨架屏内容
      this.skeleton = new Skeleton(this.options);
      // 启动无头浏览器
      await this.skeleton.initialize();
      const skeletonHTML = await this.skeleton.genHTML(this.options.origin);
      console.log("skeletonHTML", skeletonHTML);
      const originPath = resolve(this.options.staticDir, "index.html");
      const originHTML = await readFileSync(originPath, "utf8");
      const finalHTML = originHTML.replace("<!-- skeleton -->", skeletonHTML);
      await writeFileSync(originPath, finalHTML);
      // 销毁浏览器
      // await this.skeleton.destroy();
      // await this.server.close();
    });
  }
  async startServer() {
    this.server = new Server(this.options);
    await this.server.listen();
  }
}

module.exports = SkeletonPlugin;
