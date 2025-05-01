
class ComplaintsService {

    constructor() {
        this.getComplaints = this.getComplaints.bind(this);
    }

    getComplaints() {
    }
}

const complaintsStore = new ComplaintsService();
export default complaintsStore;