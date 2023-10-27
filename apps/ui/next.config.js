/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['lib'],
    output: "export" // TODO this isn't working with the md files
}

module.exports = nextConfig
