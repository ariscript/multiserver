# Building MultiServer

## Dependencies

To build MultiServer from source, you will need all of its dependencies:

-   [Node.js LTS](https://nodejs.org)
-   [npm](https://npmjs.com) (included with node.js)
-   [yarn](https://classic.yarnpkg.com) (run `npm i -g yarn` in your terminal)
-   node-gyp (read instructions [here](https://github.com/nodejs/node-gyp#installation) to set it up properly on your platform, though there is no need to run the `npm install -g node-gyp` command as it is included with npm)

## Build instructions

1. Clone this repository by running `git clone htttps://github.com/dheerajpv/multiserver`
2. Run `yarn` in your termnial to install all required dependencies.
3. Run `yarn make` in your terminal to build the app into a native executable for your platform
4. The newly created `out` directory should contain the executable and its required resource files.

## Questions?

Feel free to ask your questions in the MultiServer discord server! There is a link in the [README](README.md).
