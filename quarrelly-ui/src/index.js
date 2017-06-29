import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider, ApolloClient } from 'react-apollo';
import './index.css';
 
const client = new ApolloClient({
    dataIdFromObject: (obj) => obj.__typename + '#' + obj.id
});

ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));

registerServiceWorker();
