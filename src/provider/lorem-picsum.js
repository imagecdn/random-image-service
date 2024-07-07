const BaseProvider = require("./base-provider");

class LoremPicsum extends BaseProvider {
  constructor(provider) {
    super(provider);
    this._defaultResponseBody.provider = "LoremPicsum";
    this._defaultResponseBody.license = "CC0";
    this._defaultResponseBody.terms = "https://picsum.photos/";
  }

  static get defaultable() {
    return true;
  }

  randomImage(query) {
    const height = query.size.height || 1080;
    const width = query.size.width || 1920;
    return fetch(`https://picsum.photos/${width}/${height}`).then((res) =>
      this._normalizeResponse({
        url: res.url,
        size: { height, width },
      }),
    );
  }
}

module.exports = LoremPicsum;
