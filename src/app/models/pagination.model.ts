export class PaginationModel<T> {
    public data!: Array<T>;
    public page!: number;
    public pageCount!: number;
    public totalCount!: number;
}
