import gql from "graphql-tag";

export const typeDef = gql`

    extend type Query{
        ping: Boolean
        getInterfaces: [String]!
        test(input: String):String
    }

    # extend type Mutation{
    #     # startListening(port: Int!)
    # }

    extend type Subscription{
        startDetection(port: Int, interface: String): DetectionRes
    }

    type DetectionRes{
        src: String,
        payload: String,
        attack: Boolean,
    }
`;