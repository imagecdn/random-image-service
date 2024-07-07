addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Method for constructing a Picsum URL.
 * Note: Does not support categories as these are not in the current dataset.
 * (Ref: https://github.com/DMarby/picsum-photos/issues/81)
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Boolean} withJson
 * @returns {String}
 */
function picsum(width, height, category = "", withJson = false) {
  const PICSUM_ENDPOINT = "https://picsum.photos";

  // Width is required at minimum.
  if (!width) {
    throw new Error("No width set");
  }

  // This mirrors Picsum's default behaviour, however ImageCDN originally required both.
  if (!height) {
    height = width;
  }

  const endpoint = new URL(PICSUM_ENDPOINT);

  // // Append a randomised seed, required for the /info endpoint.
  // const seed = String(Math.random()).slice(2)
  // endpoint.pathname += `seed/${seed}/`

  // Apply width & height parameters.
  endpoint.pathname += `${width}/`;
  endpoint.pathname += `${height}/`;

  // Optionally apply the info endpoint.
  if (withJson === true) {
    endpoint.pathname += "info";
  }

  return endpoint.toString();
}

/**
 * Method for constructing a Lorem Flickr URL.
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Boolean} withJson
 * @returns {String}
 */
function loremFlickr(width, height, category = "", withJson = false) {
  const LOREMFLICKR_ENDPOINT = "https://loremflickr.com";

  // Width is required at minimum.
  if (!width) {
    throw new Error("No width set");
  }

  // This mirrors Picsum's default behaviour, however ImageCDN originally required both.
  if (!height) {
    height = width;
  }

  const endpoint = new URL(LOREMFLICKR_ENDPOINT);

  // Optionally apply the JSON endpoint.
  if (withJson === true) {
    endpoint.pathname += "json/";
  }

  // Apply width & height parameters.
  endpoint.pathname += `${width}/`;
  endpoint.pathname += `${height}/`;

  if (category) {
    endpoint.pathname += `${category}`;
  }

  return endpoint.toString();
}

/**
 * Method for randomly getting a Random Image Provider URL.
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Boolean} withJson
 * @returns {String}
 */
function randomImageProvider(width, height, category = "", withJson = false) {
  const RANDOM_IMAGE_PROVIDERS = [loremFlickr, picsum];
  const i = Math.floor(Math.random() * RANDOM_IMAGE_PROVIDERS.length);
  return RANDOM_IMAGE_PROVIDERS[i].call(
    this,
    width,
    height,
    category,
    withJson,
  );
}

/**
 * Handler for the worker, takes URL parameters and redirects to a compatible Picsum URL.
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const responseHeaders = new Headers();
  let responseCode = NaN;
  let responseBody = undefined;

  // If this looks like a Random Image API call...
  if (params.has("width") && params.has("height")) {
    const width = parseInt(params.get("width")) || NaN;
    const height = parseInt(params.get("height")) || NaN;
    const category = params.get("category") || "buildings";
    let format = String(params.get("format"));
    if (!["redirect", "json", "text"].includes(format)) {
      format = "redirect";
    }

    // If the format is JSON we use to Picsum's info endpoint.
    const withJson = format === "json";
    const newServiceUrl = randomImageProvider(
      width,
      height,
      category,
      withJson,
    );

    // We redirect for all responses that aren't plaintext.
    const PLAINTEXT_RESPONSE_CODE = 200;
    const REDIRECT_RESPONSE_CODE = 307;
    switch (format) {
      // Define the text response body and headers.
      case "text": {
        responseCode = PLAINTEXT_RESPONSE_CODE;
        responseHeaders.append("Content-Type", "text/plain");
        responseBody = newServiceUrl;
        break;
      }

      // Define the redirecting ones.
      case "json":
      case "redirect":
      default: {
        responseCode = REDIRECT_RESPONSE_CODE;
        responseHeaders.append("Location", newServiceUrl);
      }
    }

    // We will cache for one month.
    const ONE_MONTH = 28 * 7 * 24 * 60 * 60;
    const CACHE_DURATION = ONE_MONTH;
    responseHeaders.append(
      "Cache-Control",
      `public, max-age=${CACHE_DURATION}`,
    );

    return new Response(responseBody, {
      status: responseCode,
      headers: responseHeaders,
    });
  }

  // Handle all other requests on origin.
  return fetch(request);
}
