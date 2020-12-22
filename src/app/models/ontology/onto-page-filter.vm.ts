import { Deserializable } from '../deserializable.model';
import { BINDING_TYPE } from '../../models/ontology/onto-page.model';

export class OntoPageFilterVm implements Deserializable {
    public page!: number;
    public pageCount!: number;
    public sortBy!: string;
    public sortOrder!: string;
    public bindingType!: BINDING_TYPE;
    public filter!: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
