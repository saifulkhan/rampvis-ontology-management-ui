import { Deserializable } from 'src/app/models/deserializable.model';
import { DATA_TYPE } from './onto-data-types';
import { VIS_TYPE } from './onto-vis-type.enum';

export class OntoVis implements Deserializable {
    public id: string = undefined as any;
    public function: string = undefined as any;
    public type: VIS_TYPE = undefined as any;
    public description: string = undefined as any;
    public dataTypes: DATA_TYPE[] = undefined as any;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
