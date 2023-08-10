/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'toujinosato.s3.amazonaws.com']
  }
}

const withTM = require("next-transpile-modules")(["@mui/x-date-pickers"]);

module.exports = withTM({
  ...nextConfig
  // 他の設定があればここに追加
});
