import { Deserializable } from 'src/app/models/deserializable.model';
import { ANALYTICS, MODEL, SOURCE } from '../../models/ontology/onto-data-types';

export class QueryParams implements Deserializable {
    query: string = '';
    params: string[] | string = undefined;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class OntoData implements Deserializable {
    public id: string = '';
    public url: string = '';
    public endpoint: string = '';
    public queryParams: QueryParams[] = undefined;
    public description: string = '';
    public source: SOURCE = undefined;
    public model: MODEL = undefined;
    public analytics: ANALYTICS = undefined;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
