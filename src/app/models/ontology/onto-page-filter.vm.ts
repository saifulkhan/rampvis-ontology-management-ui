import { Deserializable } from '../deserializable.model';
import { BINDING_TYPE } from './binding-type.enum';

export class OntoPageFilterVm implements Deserializable {
    public pageIndex!: number;
    public pageSize!: number;
    public sortBy!: string;
    public sortOrder!: string;
    public filterBindingType!: BINDING_TYPE;
    public filterId!: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
