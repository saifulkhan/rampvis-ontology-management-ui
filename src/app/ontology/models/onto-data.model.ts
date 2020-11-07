import { Deserializable } from 'src/app/shared/models/deserializable.model';
import { ANALYTICS, MODEL, SOURCE } from "./onto-data-types";

export class OntoData implements Deserializable {
    public id: string = '';
    public url: string = '';
    public endpoint: string = '';
    public query_params?: {[key: string]: Array<string>} = undefined as any;
    public description: string = '';
    public source?: SOURCE = undefined as any;
    public model?: MODEL = undefined as any;
    public analytics?: ANALYTICS = undefined as any;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}