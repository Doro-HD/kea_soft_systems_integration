import { getContext } from "@getcronit/pylon";
import roomsService from "@/services/roomsService";

const queryResolvers = {
  rooms: (roomNumber?: string) => {
    const c = getContext();

    return roomsService.getRooms(c, { roomNumber });
  },
};

const mutationResolvers = {
  createRoom: (roomNumber: string) => {
    const c = getContext();

    return roomsService.createRoom(c, { roomNumber });
  },
  addTenant(userId: string, roomId: string) {
    const c = getContext();

    return roomsService.addTenant(c, userId, roomId);
  },
};

export { mutationResolvers, queryResolvers };
