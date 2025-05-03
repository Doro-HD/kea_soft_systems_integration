import { app } from "@getcronit/pylon";

import * as usersResolver from "@/resolvers/usersResolver";
import * as roomsResolver from "@/resolvers/roomsResolver";
import * as complaintsResolver from "@/resolvers/complaintsResolver";

export const graphql = {
  Query: {
    ...usersResolver.queryResolvers,
    ...roomsResolver.queryResolvers,
    ...complaintsResolver.queryResolvers,
  },
  Mutation: {
    ...usersResolver.mutationResolvers,
    ...roomsResolver.mutationResolvers,
    ...complaintsResolver.mutationResolvers,
  },
};

export default app;
