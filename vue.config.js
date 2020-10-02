module.exports = {
  pluginOptions: {
    s3Deploy: {
      registry: undefined,
      awsProfile: "default",
      overrideEndpoint: false,
      region: "eu-central-1",
      bucket: "www.urlink.to",
      createBucket: false,
      staticHosting: true,
      staticIndexPage: "index.html",
      staticErrorPage: "index.html",
      assetPath: "dist",
      assetMatch: "**",
      deployPath: "/",
      acl: "public-read",
      pwa: false,
      enableCloudfront: true,
      cloudfrontId: "E2LTY5AXIB5QM3",
      cloudfrontMatchers: "/index.html,/favicon.ico",
      pluginVersion: "4.0.0-rc3",
      uploadConcurrency: 5
    }
  }
};
