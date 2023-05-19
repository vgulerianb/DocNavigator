/** @type {import('next').NextConfig} */
const cron = require("node-cron");

let lastCron = 0;
cron.schedule("* * * * *", function () {
  const currentTime = new Date().getTime();
  if (currentTime - lastCron > 7000) {
    lastCron = currentTime;
    console.log("test cron", new Date());
    fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((json) => console.log(json));
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
