/** @type {import('next').NextConfig} */
const cron = require("node-cron");

let lastCron = 0;
cron.schedule("* * * * *", async function () {
  const currentTime = new Date().getTime();
  if (currentTime - lastCron > 40000) {
    lastCron = currentTime;
    fetch(process.env?.APP_URL + "/api/taskqueue")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
      });
  }
});

const nextConfig = {
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };
    return config;
  },
};

module.exports = nextConfig;
