import { getContext } from "@getcronit/pylon";
import usersService from "@/services/userService";

const queryResolvers = {
    users: () => {
      const c = getContext();

      return usersService.getUsers(c);
    }
};

const mutationResolvers = {
    createUser: (name: string, socialSecurityNumber: string) => {
      const c = getContext();

      return usersService.createUser(c, { name, socialSecurityNumber });
    },
    deleteUser: (userId: string) => {
      const c = getContext();

      return usersService.deleteUser(c, userId);
    }
}

export {
    queryResolvers,
    mutationResolvers
};