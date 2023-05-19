/** @type {import('next').NextConfig} */
const cron = require("node-cron");

cron.schedule("* * * * *", function () {
  console.log("Say scheduled hello" + new Date());
});

const nextConfig = {};

module.exports = nextConfig;
