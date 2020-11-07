import { Deserializable } from 'src/app/shared/models/deserializable.model';
import { ANALYTICS, MODEL, SOURCE } from "./onto-data-types";

export interface IQueryParams {
    query: string;
    params: string[];
}

export class OntoData implements Deserializable {
    public id: string = '';
    public url: string = '';
    public endpoint: string = '';
    public query_params: IQueryParams[] = [];
    public description: string = '';
    public source: SOURCE = '' as SOURCE;
    public model: MODEL = '' as MODEL;
    public analytics: ANALYTICS = '' as ANALYTICS;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}