import gql from "graphql-tag";

export const typeDef = gql`

    extend type Query{
        ping: Boolean
        getInterfaces: [String]!
    }

    # extend type Mutation{
    #     # startListening(port: Int!)
    # }

`;