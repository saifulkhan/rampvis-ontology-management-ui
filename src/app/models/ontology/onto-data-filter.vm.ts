import { Deserializable } from '../deserializable.model';
import { DATA_TYPE } from './onto-data-types';

export class OntoDataFilterVm implements Deserializable {
    public page!: number;
    public pageCount!: number;
    public sortBy!: string;
    public sortOrder!: string;
    public dataType!: DATA_TYPE;
    public filter!: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
