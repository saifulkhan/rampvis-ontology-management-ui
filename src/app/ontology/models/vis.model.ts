import { Deserializable } from 'src/app/shared/models/deserializable.model';
import { VIS_TYPE } from './vis-type.enum';

export class Vis implements Deserializable {
    public id: string = '';
    public function: string = '';
    public type: VIS_TYPE = undefined as any;
    public description: string = '';

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
