import { IResolvers } from 'graphql-tools'
//import search from '../../services/searchIndex';
import { FxService } from '../fx';

import { Container } from 'typedi';
import { MarketSegments } from './RefData.schema';


const fxService = Container.get(FxService);

const resolvers: IResolvers = {
    Query: {
        symbol: async (_, args: { id: string; market: MarketSegments }) => {
            switch (args.market.toLowerCase()) {
                case MarketSegments.STOCK: {
                    //const results = search(args.id)
                    // Just for debugging alone
                    const results = [{id: "test1"}, {id: "test2"}, {id: "test3"}]
                    return results.find(s => s.id == args.id) || results[0]
                }
                case MarketSegments.FX: {
                    return fxService.getSymbol(args.id)
                }
                default: {
                    throw new Error(`unsupported`)
                }
            }
        },

        symbols: async (_, args: { text: string; marketSegment: MarketSegments }) => {
            switch (args.marketSegment.toLowerCase()) {
                case MarketSegments.STOCK: {
                    //return search(args.text)
                    return "ITEMS SEARCH DEBUGGER"
                }
                case MarketSegments.FX: {
                    return fxService.getSymbols(args.text)
                }
                default: {
                    throw new Error(`Unsupported`)
                }
            }
        },
    },
}

export default resolvers  
