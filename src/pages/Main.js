import { Button, Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";

import AssistantAPIClient from "@io-maana/q-assistant-client";
import _ from "lodash";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import * as MyServiceClient from "../api/myService";
import WorkspaceClient from "../api/workspace";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    overflow: "hidden",
    height: "100%",
    padding: theme.spacing()
  },
  button: {
    maxWidth: "100px",
    marginTop: theme.spacing()
  },
  success: {
    background: green[600],
    color: theme.palette.text.primary
  }
}));

const Main = props => {
  const classes = useStyles();
  // const [workspace, setWorkspace] = useState({ id: null, allKinds: null });
  // const [selectedName, setSelectedName] = useState();
  // const [lambda, setLambda] = useState();
  // const [loading, setLoading] = useState(false);
  // const [hasImplementation, setHasImplementation] = useState(false);
  // const [isFunction, setIsFunction] = useState(false);
  // const [showSaving, setShowSaving] = useState(false);
  // const [showSaved, setShowSaved] = useState(false);
  // const [inInventory, setInInventory] = useState(false);
  // const [isGenerated, setIsGenerated] = useState(false);

  // const loadWorkspace = useCallback(
  //   async override => {
  //     const ws = await WorkspaceClient.getWorkspace();
  //     if (ws.id !== workspace.id || override) {
  //       setWorkspace(ws);
  //     }
  //   },
  //   [workspace]
  // );

  // const constructLambda = useCallback(
  //   inventoryFunction => {
  //     const kinds = [];

  //     // Helper for building Q fields
  //     const getFieldFromField = (field, count, isInput) => {
  //       // Stop iterating over fields up to 16 levels
  //       if (count && count > 16) {
  //         return null;
  //       } else {
  //         const name = field.name;
  //         const modifiers = field.modifiers;
  //         let type = "";
  //         const withCount = count ? count + 1 : 1;

  //         if (field.type === "KIND") {
  //           const inventoryKind = _.first(
  //             workspace.allKinds.filter(k => {
  //               return (
  //                 k.id === field.kind.id ||
  //                 k.name === field.kind.name + `${isInput ? "Input" : ""}`
  //               );
  //             })
  //           );

  //           const { name, schema } = inventoryKind;
  //           const kind = {
  //             name: name + `${isInput ? "Input" : ""}`,
  //             fields: schema
  //               .map(field => getFieldFromField(field, withCount, isInput))
  //               .filter(e => e)
  //           };

  //           upsert(kinds, { name: kind.name }, kind);
  //           type = inventoryKind.name + `${isInput ? "Input" : ""}`;
  //         } else {
  //           type = field.type;
  //         }

  //         return {
  //           name,
  //           kind: type,
  //           modifiers: modifiers.filter(m => m !== "EPHEMERAL")
  //         };
  //       }
  //     };

  //     const {
  //       id: functionId,
  //       name: functionName,
  //       outputType: inventoryFunctionOutputType,
  //       outputModifiers: inventoryFunctionOutputModifiers,
  //       kind: opk,
  //       outputKindId,
  //       graphqlOperationType,
  //       arguments: args
  //     } = inventoryFunction;

  //     // Build input fields for each argument of the function
  //     const inputs = args
  //       .map(argument => {
  //         return getFieldFromField(argument, 1, true);
  //       })
  //       .filter(e => e);

  //     // Build the output kind
  //     let outputKind = "";
  //     if (inventoryFunctionOutputType === "KIND") {
  //       const inventoryKind = _.first(
  //         workspace.allKinds.filter(k => {
  //           return k.id === outputKindId || k.name === opk.name;
  //         })
  //       );

  //       const { name, schema } = inventoryKind;
  //       const kind = {
  //         name,
  //         fields: schema.map(field => getFieldFromField(field, 1, false))
  //       };

  //       outputKind = name;
  //       kinds.push(kind);
  //     } else {
  //       // It's a scalar
  //       outputKind = inventoryFunctionOutputType;
  //     }

  //     // Construct Lambda
  //     const lambda = {
  //       id: functionId,
  //       name: functionName,
  //       serviceId: workspace.id,
  //       runtimeId: "Q+JavaScript",
  //       graphqlOperationType,
  //       code: "",
  //       input: inputs,
  //       outputKind,
  //       outputModifiers: inventoryFunctionOutputModifiers.filter(
  //         // Output must be tangible
  //         m => m !== "EPHEMERAL"
  //       ),
  //       kinds: _.uniqBy(kinds, k => k.name)
  //     };
  //     return lambda;
  //   },
  //   [workspace.id, workspace.allKinds]
  // );

  // const updateCurrentFunction = useCallback(
  //   async selectedItem => {
  //     setSelectedName(null);
  //     setIsFunction(false);
  //     setIsGenerated(false);
  //     setLoading(true);

  //     const workspace = await WorkspaceClient.getWorkspace();
  //     const isFunc = selectedItem.kindName === "Function";

  //     setIsFunction(isFunc);
  //     if (isFunc && workspace.id) {
  //       const { id } = selectedItem;
  //       const inventoryFunction = _.first(
  //         workspace.functions.filter(f => f.id === id)
  //       );

  //       if (inventoryFunction) {
  //         setInInventory(true);
  //         setSelectedName(inventoryFunction.name);
  //         const { implementation, isGenerated } = inventoryFunction;
  //         let lambda = null;

  //         const savedLambda = await LambdasClient.getLambda(
  //           inventoryFunction.id
  //         );

  //         if (
  //           !savedLambda &&
  //           implementation &&
  //           implementation.operations.length > 0
  //         ) {
  //           setHasImplementation(true);
  //           setLambda({ id: null, allKinds: null });
  //         } else {
  //           if (!implementation || implementation.operations.length === 0) {
  //             setHasImplementation(false);
  //           } else {
  //             setHasImplementation(true);
  //           }

  //           const clambda = constructLambda(inventoryFunction);

  //           if (
  //             (!savedLambda && !implementation) ||
  //             (!savedLambda && implementation.operations.length === 0)
  //           ) {
  //             lambda = constructLambda(inventoryFunction);
  //           } else {
  //             setHasImplementation(true);
  //           }

  //           if (isGenerated) {
  //             setHasImplementation(true);
  //             setIsGenerated(true);
  //           } else {
  //             setIsGenerated(false);
  //           }

  //           if (savedLambda) {
  //             lambda = {
  //               ...savedLambda,
  //               ...clambda,
  //               code: savedLambda.code,
  //               runtimeId: savedLambda.runtime.id
  //             };
  //           }

  //           setLambda(lambda);
  //           setDefaultCode(lambda.code);
  //         }

  //         setLoading(false);
  //       } else {
  //         setInInventory(false);
  //         setHasImplementation(true);
  //         setLambda({ id: null, allKinds: null });

  //         const externalFunction = _.first(
  //           _.flatten(
  //             workspace.services.map(service => service.functions)
  //           ).filter(f => f.id === id)
  //         );
  //         if (externalFunction) {
  //           setSelectedName(
  //             `${externalFunction.service.name}: ${externalFunction.name}`
  //           );
  //         }
  //       }
  //     } else {
  //       setLambda({ id: null, allKinds: null });
  //     }

  //     setLoading(false);
  //   },
  //   [constructLambda]
  // );

  // const onChange = newValue => {
  //   setLambda({ ...lambda, code: newValue });
  // };

  // const clearCache = async () => {
  //   const { endpointServiceId } = workspace;
  //   await WorkspaceClient.clearWorkspaceCache(endpointServiceId);
  // };

  // const wireWorkspace = async lambda => {
  //   const lambdaEndpointBaseUrl = await LambdasClient.getLambdaServiceBaseUrl();

  //   const serviceToImport = {
  //     id: lambda.serviceId + "_lambda",
  //     name: workspace.id + "_lambda",
  //     endpointUrl: lambdaEndpointBaseUrl + lambda.serviceId + "/graphql",
  //     serviceType: "EXTERNAL"
  //   };

  //   const importedService = await WorkspaceClient.addServiceToWorkspace(
  //     serviceToImport
  //   );

  //   await WorkspaceClient.reloadService(importedService.id);
  //   const ws = await WorkspaceClient.getWorkspace();

  //   const lambdaService = _.first(
  //     ws.services.filter(service => service.id === lambda.serviceId + "_lambda")
  //   );
  //   const lambdaFunction = _.first(
  //     lambdaService.functions.filter(func => func.name === lambda.name)
  //   );
  //   const workspaceFunction = _.first(
  //     ws.functions.filter(func => func.id === lambda.id)
  //   );

  //   if (lambdaFunction && workspaceFunction) {
  //     await WorkspaceClient.addFunctionToGraph(
  //       workspaceFunction,
  //       lambdaFunction
  //     );
  //   } else {
  //     console.log(
  //       "Failed updating funciton",
  //       lambdaFunction,
  //       workspaceFunction
  //     );
  //   }
  // };

  // const saveCode = async () => {
  //   await loadWorkspace(true);

  //   const savedLambda = await LambdasClient.createLambda(lambda);

  //   setLambda(async oldLambda => {
  //     await wireWorkspace(savedLambda);
  //     await clearCache(workspace);
  //     setShowSaving(false);
  //     setShowSaved(true);
  //     return {
  //       ...savedLambda
  //     };
  //   });

  //   setShowSaving(true);
  // };

  // const handleClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setShowSaving(false);
  // };

  // const handleCloseSaved = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setShowSaved(false);
  // };

  // useEffect(() => {
  //   loadWorkspace();
  // }, [loadWorkspace]);

  // useEffect(() => {
  //   if (workspace.id && workspace.currentSelection) {
  //     AssistantAPIClient.addSelectionChangedListener(async e => {
  //       const selectedItem = _.first(e.selection);
  //       updateCurrentFunction(selectedItem);
  //       loadWorkspace();
  //     });

  //     AssistantAPIClient.addInventoryChangedListener(async e => {
  //       loadWorkspace(true);
  //     });

  //     updateCurrentFunction(workspace.currentSelection);
  //   }

  //   return function cleanup() {
  //     AssistantAPIClient.removeSelectionChangedListener();
  //     AssistantAPIClient.removeInventoryChangedListener();
  //   };
  // }, [workspace, updateCurrentFunction, loadWorkspace]);

  // const showSelectMessage = !isFunction;
  // const showExternalFunction = !inInventory && isFunction;
  // const showHasImplementation =
  //   (isFunction && inInventory && hasImplementation) || isGenerated;
  // const showEditor = lambda && lambda.id && inInventory && !isGenerated;
  console.log("Main");
  return (
    <div className={classes.root}>
      {/* {loading && <Typography>Loading...</Typography>} */}

      <Typography variant="h6">Hello, world!</Typography>

      {/* {showSelectMessage && !loading && (
        <Typography>Select a function.</Typography>
      )} */}

      {/* {selectedName && !loading && (
        <Typography variant="h6">{selectedName}</Typography>
      )} */}

      {/* {showExternalFunction && !loading && (
        <Typography>This is an external function.</Typography>
      )} */}

      {/* {showHasImplementation && !showEditor && !loading && (
        <Typography>This function has an implementation.</Typography>
      )} */}

      {/* {showEditor && !loading && (
        <>
          <Typography>
            Add or update lambda implementation. Function inputs are accessible
            using the "input" variable.
          </Typography>
          <CodeEditor onChange={onChange} defaultCode={defaultCode} />
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={() => saveCode()}
          >
            Save
          </Button>
        </>
      )} */}

      {/* <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={showSaving}
        onClose={handleClose}
        message={<span id="message-id">Saving...</span>}
      />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        variant="success"
        open={showSaved}
        onClose={handleCloseSaved}
        autoHideDuration={1000}
      >
        <SnackbarContent
          id="message-saved"
          className={classes.success}
          message="Saved!"
        />
      </Snackbar> */}
    </div>
  );
};

export default withRouter(Main);
