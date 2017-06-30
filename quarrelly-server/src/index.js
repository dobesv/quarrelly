
import { microGraphiql, microGraphql } from "graphql-server-micro";
import micro from 'micro';
import { get, post, router } from "microrouter";
import cors from 'micro-cors';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import schema from './schema';

const graphqlHandler = microGraphql({ schema });
const graphiqlHandler = microGraphiql({ 
    endpointURL: "/graphql",
    subscriptionsEndpoint: "ws://localhost:8000/graphql-ws"
});

const server = micro(cors()(
  router(
    get("/graphql", graphqlHandler),
    get("/graphiql", graphiqlHandler),
    post("/graphql", graphqlHandler)
  ),
));

const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server: server,
    path: '/graphql-ws',
  },
);

// Bind it to port and start listening
server.listen(8000, () => console.log(`
    GraphQL is now available at http://localhost:8000/graphql
    GraphQL Websocket is now available at ws://localhost:8000/graphql-ws
    GraphiQL Server is available at http://localhost:8000/graphiql
`));

