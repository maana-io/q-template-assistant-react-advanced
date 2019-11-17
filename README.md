# Maana Q React (JavaScript) Assistant Template (Advanced)

Advanced template for a create-react-app (JavaScript) to be used as a maana Q assistant.

## What's inside?

- React App
- Maana Q Assistant Client npm library installed
- Dockerfile
- nginx conf
- Build/Run scripts

## Default Functionality

- Gets the current user
- Gets the current workspace
- Tracks the active selection in the workspace
- Calls a registered Q service

We demonstrate the use of React Hooks to track the state of the workspace and issue asynchronous queries to Q services. Simply replace with your own services and interact with the workspace to fit your needs.

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
