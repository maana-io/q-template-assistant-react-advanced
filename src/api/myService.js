import { GET_INFO } from "./graphqlQueries";

import AssistantAPIClient from "@io-maana/q-assistant-client";

const MY_SERIVCE_ID = process.env.MY_SERVICE_ID;

export const getMyServiceBaseUrl = async () => {
  const myServiceQueryResult = await AssistantAPIClient.executeGraphql({
    serviceId: "io.maana.catalog",
    query:
      "query getMyService($serviceId: ID!){ service(id: $serviceId) { endpointUrl } }",
    variables: {
      serviceId: MY_SERIVCE_ID
    }
  });

  const { data } = myServiceQueryResult;
  const { service } = data;
  const { endpointUrl } = service;

  return endpointUrl.replace("graphql", "");
};

const client = {
  query: async ({ query, variables }) => {
    return await AssistantAPIClient.executeGraphql({
      serviceId: MY_SERIVCE_ID,
      query,
      variables
    });
  },
  mutate: async ({ mutation, variables }) => {
    return await AssistantAPIClient.executeGraphql({
      serviceId: MY_SERIVCE_ID,
      query: mutation,
      variables
    });
  }
};

export const getInfo = async () => {
  const res = await client.query({
    query: GET_INFO,
    variables: {}
  });
  return res && res.data ? res.data.getInfo : null;
};
