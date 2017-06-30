import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo';
import './index.css';
 
const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8000/graphql'
}); 

const wsClient = new SubscriptionClient('ws://localhost:8000/graphql-ws', {
  reconnect: true,
});

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

const client = new ApolloClient({
    dataIdFromObject: (obj) => obj.__typename + '#' + obj.id,
    networkInterface: networkInterfaceWithSubscriptions
});

ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));

registerServiceWorker();
