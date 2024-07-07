const providers = {
  "custom-v1": require("./custom-v1"),
  s3: require("./s3"),
  "lorem-flickr": require("./lorem-flickr"),
  picsum: require("./picsum"),
  unsplash: require("./unsplash"),
};

module.exports = {
  providers,
  defaultableProviders: Object.keys(providers).filter(
    (providerName) => providers[providerName].defaultable,
  ),
};
