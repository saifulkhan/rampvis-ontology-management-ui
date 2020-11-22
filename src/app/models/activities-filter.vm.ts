export class ActivitiesFiterVm {
    public page: number;
    public pageCount: number;
    public sortBy: string;
    public sortOrder: string;
    public filter: string;
    public startDate: Date;
    public endDate: Date;

    constructor(data: ActivitiesFiterVm) {
        this.page = data.page || 0;
        this.pageCount = data.pageCount || 10;
        this.sortBy = data.sortBy || 'title';
        this.sortOrder = data.sortOrder || 'asc';
        this.filter = data.filter;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
    }
}