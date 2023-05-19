/** @type {import('next').NextConfig} */
const cron = require("node-cron");

cron.schedule("* * * * *", function () {
  console.log("Say scheduled hello" + new Date());
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
