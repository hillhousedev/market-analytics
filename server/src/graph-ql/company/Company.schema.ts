import { gql } from 'apollo-server'

    export default gql`
    type Company {

        id: ID!
        name: String 
        symbol: String!
        exchange: String
        industry: String 
        website:  String 
        description: String 
        CEO: string 
        issueType: String 
        sector: String
    }
    
    `;