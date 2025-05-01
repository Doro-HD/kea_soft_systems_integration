import express from 'express';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
    },
  }),
});

const app = express();
app.use(express.static('public'));
app.all('/graphql', createHandler({ schema }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Listening on port', PORT));