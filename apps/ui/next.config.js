/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["lib", "plural-family-chart"],
    output: "export",
    basePath: "/charting-polygamy",
}

module.exports = nextConfig
