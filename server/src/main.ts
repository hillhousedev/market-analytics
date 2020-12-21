import { ApolloServer } from 'apollo-server';

import resolvers from './resolvers';
import typeDefs from './type-defs';
import { environment } from './environment';

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