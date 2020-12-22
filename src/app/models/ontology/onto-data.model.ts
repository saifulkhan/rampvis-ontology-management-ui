import { Deserializable } from 'src/app/models/deserializable.model';
import { DATA_TYPE } from '../../models/ontology/onto-data-types';

export class OntoData implements Deserializable {
    public id!: string;
    public urlCode!: string;
    public endpoint!: string;
    public dataType!: DATA_TYPE;
    public description!: string;
    public date!: Date;
    public keywords!: string[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class OntoDataSearch extends OntoData {
    public score: number = undefined as any;
}
