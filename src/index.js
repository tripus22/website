import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from './store/TripUsStore';
import ChooseRoute from './ChooseRoute';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider, 
    HttpLink, 
    ApolloLink
} from "@apollo/client";

const httpsLink = new HttpLink({
    uri: 'https://grand-silkworm-52.hasura.app/v1/graphql',
    headers: {
        'x-hasura-admin-secret': 'ECetBRTLbpZ0QsRDt3KtB5OBCHqLUM9037z1p1oL2eKH14Y8I5GfHjL6mVqr0uRm'
    }      //TODO USE DIFF KEY AND HIDE ITS
});

const client = new ApolloClient(({
    cache: new InMemoryCache(),
    link: ApolloLink.from([httpsLink])
}))

ReactDOM.render(
    <ApolloProvider client={client}>
        <Provider store={store}>
            <Router>
                <ChooseRoute />
            </Router>
        </Provider>
    </ApolloProvider>,
  document.getElementById('root')
);
