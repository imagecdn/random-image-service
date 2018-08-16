Random Image API
================

[![Build status](https://img.shields.io/circleci/project/antoligy/random-image-service.svg)](https://circleci.com/gh/antoligy/random-image-service)
[![ISC licensed](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A webservice designed to return random images from various providers, given specific criteria. Contributions welcome!

Documentation available here: https://random.responsiveimages.io/v1/docs


Contents
--------

  - [Requirements](#requirements)
  - [Running Locally](#running-locally)


Requirements
------------

The Random Image API requires [Node.js](https://nodejs.org/en/) 8.x and [yarn](https://yarnpkg.com/lang/en/).


Running Locally
---------------

``` yarn start-dev ```

This will spawn a local server on port 3000, which can be accessed at http://localhost:3000/.
In development mode the service will use a Map as its cache, which simulates the behaviour with Redis used in production.
