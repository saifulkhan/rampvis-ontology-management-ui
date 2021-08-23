import { Deserializable } from '../deserializable.model';
import { PAGE_TYPE } from './page-type.enum';

export class OntoPageFilterVm implements Deserializable {
    public pageIndex!: number;
    public pageSize!: number;
    public sortBy!: string;
    public sortOrder!: string;
    public filterId!: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
