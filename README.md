# Maana Q React (JavaScript) Assistant Template (Advanced)

Advanced template for a create-react-app (JavaScript) to be used as a maana Q assistant.

## What's inside?

- React App
- Maana Q Assistant Client npm library installed
- Dockerfile
- nginx conf
- Build/Run scripts
- ESLint + Prettier configuration
- VSCode extension recommendations

## Default Functionality

- Gets the current user
- Gets the current workspace
- Tracks the active selection in the workspace
- Calls a registered Q service

We demonstrate the use of React Hooks to track the state of the workspace and issue asynchronous queries to Q services. Simply replace these calls with your services and interact with the workspace to fit your needs.

## Development



### Explanation of Tunneling

To host an assistant locally and view it within Q's Assistant Panel requires that your local machine is viewable to Q's servers; to do this we use [`localtunnel`](https://github.com/localtunnel/localtunnel).

Copy the URL printed to the console when running `npm run start` or `npm run tunnel`; paste it into the Service URL field when creating a new Service in Q.

## NPM Scripts

1. `postinstall`
    - handles patching `react-scripts` with some small changes to the Webpack configuration to improve the developer experience
1. `start`
    - starts all other processes for a single entrypoint for development
    - runs: `[watch, serve, tunnel]`
1. `build`
    - builds a production version of the application; output directory: `./build`
1. `test`
    - runs jest tests
1. `eject`
    - (CAUTION) ejects from the `create-react-app` framework and toolset
    - This is only intended for advanced users; use at your own risk.
    - more information:
      - Official docs on the topic: https://create-react-app.dev/docs/available-scripts/#npm-run-eject
      - Alternatives to ejecting: https://medium.com/curated-by-versett/dont-eject-your-create-react-app-b123c5247741
1. `serve`
    - runs a local web server to host the compiled files
1. `tunnel`
    - opens a tunnel to your local web server
1. `watch`
    - starts Webpack in watch mode; writes files to `./build`
1. `watch:prod`
    - same as `watch`, but creates a `production` build (minified, optimized, etc.)

## Development

As with any Node application, you must first install dependencies:

```
npm i
```

To run locally:

```
npm run serve
```

It is typical to debug locally by using (ngrok)[https://ngrok.com/] or similar. Simply configure ngrok to expose your service to the web and register it with your instance of Q (see (Registring a Custom Service)[https://maana.gitbook.io/q/v/3.2.1/maana-q-cookbook/basic-ingredients/11-publish-knowledge-services]).

## Deployment:

We've included a Docker file that you can use to containerize your Assistant and deploy it using the (Maana CLI)[https://github.com/maana-io/q-cli] command `mdeploy`.

## Learn more about using the Maana Q Assistant Client library

- https://github.com/maana-io/q-assistant-client
- https://www.npmjs.com/package/@io-maana/q-assistant-client
