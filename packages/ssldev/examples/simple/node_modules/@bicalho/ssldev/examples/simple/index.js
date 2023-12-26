const {sslldev} = require("@bicalho/ssldev");
const path = require("path");
const dirRoot = path.resolve(__dirname);
const dirCoverage = path.resolve(dirRoot, "..", "..", "..", "..", "coverage");

sslldev.configure({
  publicDomain: "localhost",
  contenPublic: dirCoverage,
  webPort: 8081,
  rootApp: dirRoot,
  keysPath: "ssl",
  cleanUrls: ["/**"],
  rewrites: [{ source: "app/**", destination: "/index.html" }],
  renderSingle: true,
  headers: [
    {
      source: "**/*.@(jpg|jpeg|gif|png)",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache",
        },
      ],
    },
  ],
}).run()

