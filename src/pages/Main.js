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
  const { user } = props;

  const classes = useStyles();
  const [workspace, setWorkspace] = useState({ id: null, allKinds: null });
  const [baseUrl, setBaseUrl] = useState();
  const [info, setInfo] = useState();
  const [selectedName, setSelectedName] = useState();
  const [loading, setLoading] = useState(false);
  const [isFunction, setIsFunction] = useState(false);

  const loadWorkspace = useCallback(
    async override => {
      const ws = await WorkspaceClient.getWorkspace();
      if (ws.id !== workspace.id || override) {
        setWorkspace(ws);
      }
    },
    [workspace]
  );

  const updateCurrentFunction = useCallback(async selectedItem => {
    setSelectedName(null);
    setIsFunction(false);
    setLoading(true);

    const workspace = await WorkspaceClient.getWorkspace();
    const isFunc = selectedItem.kindName === "Function";
    setIsFunction(isFunc);

    const { id } = selectedItem;

    if (isFunc) {
      const inventoryFunction = _.first(
        workspace.functions.filter(f => f.id === id)
      );

      if (inventoryFunction) {
        setSelectedName(
          `${inventoryFunction.service.name}: ${inventoryFunction.name}`
        );
      } else {
        const externalFunction = _.first(
          _.flatten(
            workspace.services.map(service => service.functions)
          ).filter(f => f.id === id)
        );
        if (externalFunction) {
          setSelectedName(
            `${externalFunction.service.name}: ${externalFunction.name}`
          );
        }
      }
    } else {
      const selectedKind = await AssistantAPIClient.getKindById(id);
      setSelectedName(`${selectedKind.service.name}: ${selectedKind.name}`);
    }
    setLoading(false);
  }, []);

  const getBaseUrl = async () => {
    const baseUrl = await MyServiceClient.getMyServiceBaseUrl();
    setBaseUrl(baseUrl);
  };

  const getInfo = async () => {
    const info = await MyServiceClient.getInfo();
    setInfo(info);
  };

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  useEffect(() => {
    if (workspace.id && workspace.currentSelection) {
      AssistantAPIClient.addSelectionChangedListener(async e => {
        const selectedItem = _.first(e.selection);
        updateCurrentFunction(selectedItem);
        loadWorkspace();
      });

      AssistantAPIClient.addInventoryChangedListener(async e => {
        loadWorkspace(true);
      });

      updateCurrentFunction(workspace.currentSelection);
    }

    return function cleanup() {
      AssistantAPIClient.removeSelectionChangedListener();
      AssistantAPIClient.removeInventoryChangedListener();
    };
  }, [workspace, updateCurrentFunction, loadWorkspace]);

  return (
    <div className={classes.root}>
      {loading && <Typography>Loading...</Typography>}

      {!loading && (
        <Typography variant="h6">
          Hello, {user.name} ({user.email})!
        </Typography>
      )}

      {selectedName && !loading && (
        <Typography>{isFunction ? "Function" : "Kind"}</Typography>
      )}
      {selectedName && !loading && (
        <Typography variant="h6">{selectedName}</Typography>
      )}

      {baseUrl && <Typography>{JSON.stringify(baseUrl, null, 2)}</Typography>}

      <Button
        onClick={() => {
          getBaseUrl();
        }}
      >
        Get Base URL
      </Button>
      {info && <Typography>{JSON.stringify(info, null, 2)}</Typography>}

      <Button
        onClick={() => {
          getInfo();
        }}
      >
        Get Info
      </Button>
    </div>
  );
};

export default withRouter(Main);
