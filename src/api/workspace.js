import AssistantAPIClient from "@io-maana/q-assistant-client";
import _ from "lodash";
import uuid from "uuid";

function filterObject(obj, key) {
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == "object") {
      filterObject(obj[i], key);
    } else if (i === key) {
      delete obj[i];
    }
  }
  return obj;
}

function filterKeys(obj, keys) {
  let result = {};
  keys.forEach(key => {
    result = {
      ...result,
      ...filterObject(obj, key)
    };
  });
  return result;
}

const WorkspaceClient = {
  getWorkspace: async () => {
    try {
      const workspace = await AssistantAPIClient.getWorkspace();
      const currentSelection = await AssistantAPIClient.getCurrentSelection();

      const kinds = await workspace.getKinds();
      // console.log('Kinds:', kinds)
      const functions = await workspace.getFunctions();
      const fids = functions.map(f => f.id);

      const functionsWithEverything = await Promise.all(
        fids.map(async fid => {
          const res = await AssistantAPIClient.getFunctionById(fid);
          return JSON.parse(JSON.stringify(res));
        })
      );

      const importedServices = await workspace.getImportedServices();
      const services = await Promise.all(
        importedServices.map(async importedService => {
          const { id, name } = importedService;

          const kinds = await importedService.getKinds();
          const functions = await importedService.getFunctions();
          return {
            id,
            name,
            kinds,
            functions
          };
        })
      );
      const servicesKinds = _.flatten(services.map(service => service.kinds));
      const allKinds = [...kinds, ...servicesKinds];
      const graphPromises = await workspace.getKnowledgeGraphs();

      const knowledgeGraphs = await Promise.all(
        graphPromises.map(async graphPromise => {
          const graph = await graphPromise;
          // console.log('graph', graph)
          const nodes = graph ? await graph.getNodes() : null;
          // console.log('nodes', JSON.stringify(nodes))

          return graph && nodes
            ? Promise.all(
                nodes.map(node => {
                  return node.knowledgeGraphNode.innerFunction
                    ? functions.filter(func => {
                        return (
                          func.id === node.knowledgeGraphNode.innerFunction.id
                        );
                      })
                    : null;
                })
              )
            : [];
        })
      );

      const filtered = filterKeys(
        {
          id: workspace.id,
          kinds,
          allKinds,
          functions: functionsWithEverything,
          services,
          endpointServiceId: workspace.endpointUrl
            .split("/service/")[1]
            .split("/graphql")[0],
          currentSelection: currentSelection.selection[0],
          knowledgeGraphs
        },
        ["__typename"]
      );

      return filtered;
    } catch (e) {
      console.log("Failed to fetch workspace", e);
    }
  },

  addFunctionToGraph: async (kgFunction, implementationFunction) => {
    const operationId = uuid();
    const argumentValues = implementationFunction.arguments.map(
      (argument, key) => {
        return {
          argument: argument.id,
          operation: null,
          argumentRef: kgFunction.arguments[key].id
        };
      }
    );

    const updatedFunction = {
      id: kgFunction.id,
      name: kgFunction.name,
      implementation: {
        entrypoint: operationId,
        operations: [
          {
            id: operationId,
            function: implementationFunction.id,
            type: "APPLY",
            argumentValues
          }
        ]
      }
    };

    const node = await AssistantAPIClient.updateFunction(updatedFunction);
    return node;
  },

  addServiceToWorkspace: async ({ id, name, endpointUrl, serviceType }) => {
    const service = { id, name, endpointUrl, serviceType };
    try {
      const createdService = await AssistantAPIClient.createService(service);
      console.log("CREATED SERVICE", createdService);
    } catch (e) {
      console.log("didnt create service", e);
    }
    await AssistantAPIClient.importService(service.id);
    const updatedWorkspace = await AssistantAPIClient.getWorkspace();
    console.log(updatedWorkspace);
    return service;
  },

  reloadService: async serviceId => {
    console.log("RELOADING");
    await AssistantAPIClient.refreshServiceSchema(serviceId);
    await AssistantAPIClient.reloadServiceSchema(serviceId);
    console.log("RELOADING done");
  },

  clearWorkspaceCache: async serviceId => {
    try {
      await AssistantAPIClient.executeGraphql({
        serviceId,
        query: "mutation { clearCache } ",
        variables: {}
      });
    } catch (e) {
      console.error("Failed clearing cache", e);
    }
  }
};

export default WorkspaceClient;
