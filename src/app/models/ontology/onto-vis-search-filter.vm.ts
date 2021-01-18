import { Deserializable } from '../deserializable.model';

export class OntoVisSearchFilterVm implements Deserializable {
    public query!: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
