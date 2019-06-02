import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import registerServiceWorker from './registerServiceWorker';
import thunk from 'redux-thunk';
import {applyMiddleware,compose,combineReducers,createStore} from 'redux';
import {Provider} from 'react-redux';
import allReducers from "./reducers/allReducers";
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const allStoreEnchancers=compose(
    applyMiddleware(thunk),
    window.devToolsExtension && window.devToolsExtension()
);
const store=createStore(
    allReducers,
    allStoreEnchancers  
);
const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    credentials: 'include'
});

ReactDOM.render(
<ApolloProvider client={client}>
<Provider store={store}><Main /></Provider>
</ApolloProvider>
, document.getElementById('root'));
registerServiceWorker();
