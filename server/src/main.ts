import { ApolloServer } from 'apollo-server';

// import resolvers from './resolvers';
// import typeDefs from './type-defs';
import { environment } from './environment';
import 'reflect-metadata'
import logger from './services/logger'
import RootSchema from './graph-ql/RootTypedef'
import RootResolver from './graph-ql/RootResolver'
// import { async } from 'rxjs';
// const iex = require('iexcloud_api_wrapper')


Object.assign(global, { WebSocket: require('websocket').w3cwebsocket})

async function bootstrap() {
    if (!process.env.IEXCLOUD_API_VERSION || !process.env.IEXCLOUD_PUBLIC_KEY) {

        // TODO: Send a friendly error to the client rather than just giving up
        logger.error('iex-cloud API key must be set')

    }

    const server = new ApolloServer({
        typeDefs: RootSchema,
        resolvers: RootResolver,
    })

    server.listen().then(({ url, subscriptionsUrl }) => {
        logger.info( `Server ready at ${url}`);
        logger.info(`Subscriptions ready at ${subscriptionsUrl}`);

        if(module.hot) {
            module.hot.accept();
            module.hot.dispose(() => console.log('Module disposed. '));
        }
    });
}

bootstrap();

// const quote = async  (symbol: any) => {
//     const quoteData = await iex.quote(symbol);
//     console.log(quoteData)
// };

// quote("WDC");

// const quote1 = async (sym) => {
//     const quoteData = await iex.quote(sym);
//     // do something with returned quote data
//     console.log(quoteData)
// };

// quote("WDC");

// const server = new ApolloServer ({
//     resolvers, typeDefs,
//     introspection: environment.apollo.introspection,
//     playground: environment.apollo.playground
// });

// // const server = new ApolloServer({ resolvers, typeDefs });

// server.listen(environment.port)
//     .then(({ url }) => console.log(`Server ready at ${url}. `));




// // Hot Module Replacement
// if (module.hot) {
//     module.hot.accept();
//     module.hot.dispose(() => console.log('Module disposed. '));

// }