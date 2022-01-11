const express = require("express");
const http = require("http");

class Server {
  constructor(options) {
    this.options = options;
  }
  listen() {
    const app = (this.app = express());
    app.use(express.static(this.options.staticDir));
    this.httpServer = http.createServer(app);
    return new Promise((resolve) => {
      this.httpServer.listen(this.options.port, () => {
        console.log(`服务器已经在${this.options.port}端口启动`);
        resolve();
      });
    });
  }

  close() {
    return new Promise((resolve) => {
      this.httpServer.close(this.options.port, () => {
        console.log(`服务器已经在${this.options.port}关闭`);
        resolve();
      });
    });
  }
}

module.exports = Server;
