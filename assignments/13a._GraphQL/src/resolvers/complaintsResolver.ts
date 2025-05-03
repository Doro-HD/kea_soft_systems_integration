import complaintsService from "@/services/complaintsService";
import { getContext } from "@getcronit/pylon";

const queryResolvers = {
  complaints: () => {
    const c = getContext();

    return complaintsService.getComplaints(c);
  },
};

const mutationResolvers = {
  fileComplaint: (
    description: string,
    complainantIds: string[],
    complaineeIds: string[],
  ) => {
    const c = getContext();

    return complaintsService.fileComplaint(c, complainantIds, complaineeIds, {
      description,
    });
  },
};

export { mutationResolvers, queryResolvers };
