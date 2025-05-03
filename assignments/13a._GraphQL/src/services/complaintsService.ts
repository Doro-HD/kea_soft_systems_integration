import execute from "@/db/db";
import { complaintsTable, complaintsUserAssociationTable } from "@/db/schema";
import { TComplaintsInsert } from "@/db/validation";
import { Context } from "@getcronit/pylon";

class ComplaintsService {
  constructor() {
    this.getComplaints = this.getComplaints.bind(this);
  }

  async getComplaints(c: Context) {
    const complaints = await execute(c.env.DB, (db) => {
      return db.query.complaintsTable.findMany({
        with: {
          userAssociations: {
            with: {
              user: true,
              complaint: true
            }
          }
        },
      });
    });

    return complaints;
  }

  async fileComplaint(
    c: Context,
    complainantIds: string[],
    complaineeIds: string[],
    newComplaint: TComplaintsInsert,
  ) {
    return execute(c.env.DB, async (db) => {
      const complaintId = crypto.randomUUID();
      const [complaint] = await db.insert(complaintsTable).values({
        ...newComplaint,
        id: complaintId,
      }).returning();

      const complainants = complainantIds.map((complainantId) => ({
        id: crypto.randomUUID(),
        userId: complainantId,
        complaintId: complaint.id,
        associationKind: "complainant" as const,
      }));
      const complainantsReturned = await db.insert(
        complaintsUserAssociationTable,
      ).values(complainants).returning();

      const complainees = complaineeIds.map((complaineeId) => ({
        id: crypto.randomUUID(),
        userId: complaineeId,
        complaintId: complaintId,
        associationKind: "complainee" as const,
      }));
      const complaineesReturned = await db.insert(
        complaintsUserAssociationTable,
      ).values(complainees).returning();

      return {
        ...complaint,
        complainants: complainantsReturned,
        complainee: complaineesReturned,
      };
    });
  }
}

const complaintsService = new ComplaintsService();
export default complaintsService;
