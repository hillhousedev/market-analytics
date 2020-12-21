import { ApolloServer } from 'apollo-server';

import resolvers from './resolvers';
import typeDefs from './type-defs';
import { environment } from './environment';
const iex = require('iexcloud_api_wrapper')

const quote = async  (symbol: any) => {
    const quoteData = await iex.quote(symbol);
    console.log(quoteData)
};

quote("WDC");

// const quote1 = async (sym) => {
//     const quoteData = await iex.quote(sym);
//     // do something with returned quote data
//     console.log(quoteData)
// };

// quote("WDC");

const server = new ApolloServer ({
    resolvers, typeDefs,
    introspection: environment.apollo.introspection,
    playground: environment.apollo.playground
});

// const server = new ApolloServer({ resolvers, typeDefs });

server.listen(environment.port)
    .then(({ url }) => console.log(`Server ready at ${url}. `));




// Hot Module Replacement
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => console.log('Module disposed. '));

}