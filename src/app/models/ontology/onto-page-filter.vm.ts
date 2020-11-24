import { Deserializable } from '../deserializable.model';
import { PUBLISH_TYPE } from '../../models/ontology/onto-page.model';

export class OntoPageFilterVm implements Deserializable {
    public page!: number;
    public pageCount!: number;
    public sortBy!: string;
    public sortOrder!: string;
    
    public publishType!: PUBLISH_TYPE;
    public filter!: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}