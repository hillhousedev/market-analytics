import { gql } from 'apollo-server';

export default gql`
    type Query {
        numberSixTwo: Int!
        serverName: String!
    }

`;