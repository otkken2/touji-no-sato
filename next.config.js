/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// module.exports = nextConfig

module.exports = {
  images: {
    domains: ['localhost']
  },
  // nextConfig,
}

const withTM = require("next-transpile-modules")(["@mui/x-date-pickers"]);

module.exports = withTM({
  // 他の設定があればここに追加
});
