import { Deserializable } from '../deserializable.model';
import { DATA_TYPE } from './onto-data-types';

export class OntoDataSearchFilterVm implements Deserializable {
    public query!: string;
    public visId!: string;
    public dataType!: DATA_TYPE;

    // Not used as we are doing in browser pagination
    public pageIndex!: number;
    public pageSize!: number;
    public sortBy!: string;
    public sortOrder!: string;
    public filter!: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
