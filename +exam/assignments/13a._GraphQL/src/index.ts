import { app } from "@getcronit/pylon";

import * as booksResolver from "@/resolvers/booksResolver";
import * as authorResolver from "@/resolvers/authorsResolver";

export const graphql = {
  Query: {
    ...booksResolver.queryResolvers,
    ...authorResolver.queryResolvers,
  },
  Mutation: {
    ...booksResolver.mutationResolvers,
    ...authorResolver.mutationResolvers,
  },
};

export default app;
