const BaseProvider = require("./base-provider");

class LoremFlickr extends BaseProvider {
  constructor(provider) {
    super(provider);
    this._defaultResponseBody.provider = "LoremFlickr";
    this._defaultResponseBody.license = "Creative Commons";
    this._defaultResponseBody.terms = "https://loremflickr.com/";
  }

  static get defaultable() {
    return true;
  }

  randomImage(query) {
    const height = query.size.height || 1080;
    const width = query.size.width || 1920;
    return fetch(
      `https://loremflickr.com/${width}/${height}/${query.category}`,
    ).then((res) =>
      this._normalizeResponse({
        url: res.url,
        size: { height, width },
      }),
    );
  }
}

module.exports = LoremFlickr;
