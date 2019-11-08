# Maana Q Assistant Template (Basic)

Basic template for a create-react-app to be used as a maana Q assistant.

## What's inside?

- React App
- Maana Q Assistant Client npm library installed
- .env file with example variable printed in console (set in Dockerfile)
- Dockerfile
- nginx conf
- Build/Run scripts

## Default Functionality

- Gets the current workspace.
- Get the active graph from the workspace.
- Creates a Function.
- Adds the function as a node to the active graph in the workspace.

## Deployment:

docker or local

Build with docker

```
sh dockerBuild.sh
```

Run with docker

```
sh dockerRun.sh
```

Run locally using serve library

```
sh localRun.sh
```

## Learn more about using the Maana Q Assistant Client library

- https://github.com/maana-io/q-assistant-client/tree/develop
- https://www.npmjs.com/package/@io-maana/q-assistant-client
