import { app } from '@getcronit/pylon';

import * as usersResolver from '@/resolvers/usersResolver';
import * as roomsResolver from '@/resolvers/roomsResolver';

export const graphql = {
  Query: {
    ...usersResolver.queryResolvers,
    ...roomsResolver.queryResolvers 
  },
  Mutation: {
    ...usersResolver.mutationResolvers,
    ...roomsResolver.mutationResolvers
  }
}

export default app
