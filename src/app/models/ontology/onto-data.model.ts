import { Deserializable } from 'src/app/models/deserializable.model';
import { ANALYTICS, DATA_TYPE, MODEL, SOURCE } from '../../models/ontology/onto-data-types';

export class QueryParams implements Deserializable {
    query!: string;
    params!: string[] | string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class OntoData implements Deserializable {
    public id!: string;
    public urlCode!: string;
    public endpoint!: string;
    public dataType!: DATA_TYPE;
    public source!: SOURCE;
    public model!: MODEL;
    public analytics!: ANALYTICS;
    public description!: string;
    public queryParams!: QueryParams[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
