import { Deserializable } from 'src/app/shared/models/deserializable.model';
import { VIS_TYPE } from './onto-vis-type.enum';

export class OntoVis implements Deserializable {
    public id: string = '';
    public function: string = '';
    public type: VIS_TYPE = undefined as any;
    public description: string = '';

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
