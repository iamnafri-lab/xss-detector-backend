import sequelize from "./database/connection";
import { validateUser } from "./middleware/middleware";
import { gql } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { xss_detector } from "./graphQL-server/resolvers/xss-detector";
import cors from "cors";

const typeDef = gql`
  scalar Date
  scalar DateTime
  type Query
  # type Mutation
  type Subscription
  type SuccessResponse {
    success: Boolean
  }
`;

const typeDefs: any = [
  typeDef,
  xss_detector.typeDef
];

const resolvers: any = [
  //    dateAndTimeResolver,
  xss_detector.resolvers
];

export const pubsub = new PubSub();

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
//const { typeDefs, resolvers } = require('./schema');

async function startApolloServer() {
  const app = express();
  const httpServer = createServer(app);
  // app.use('*', cors({ origin: `http://localhost:4000` }));

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });


  const server = new ApolloServer({
    resolvers,
    typeDefs,
    cors:{
      origin:true
    },
    context: ({ req }: { req: any }) => {
      let { authorization } = req.headers;
      let token = authorization || null;
      if (token) {
        let user = validateUser(token);
        return {user}
      }
      //console.log({token},validateUser);
      return { user : null };
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect(connectionParams:any) {
        let token = connectionParams.Authorization || null;
        if (token) {
          let user = validateUser(token);
          return {user}
        }
        return { user : null };
      },
    },
    {
      server: httpServer,
      path: `${server.graphqlPath}`,
    }
  );

  await server.start();

  server.applyMiddleware({ app });

  //server.installSubscriptionHandlers(httpServer);
  app.use(cors());
  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
    //console.log(`Subscriptions is now reay at on http://localhost:${PORT}/${server.subscriptionsPath}`);
  }
  );
  return { server, app };
}

startApolloServer();