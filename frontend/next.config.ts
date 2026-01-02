"use strict";
import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nrExternals = require("newrelic/load-externals");

const nextConfig: NextConfig = {
  serverExternalPackages: ["newrelic"],
  webpack: (config) => {
    nrExternals(config);
    return config;
  },
};

export default nextConfig;
