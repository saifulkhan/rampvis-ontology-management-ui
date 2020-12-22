import { Deserializable } from '../deserializable.model';

export enum BINDING_TYPE {
    EXAMPLE = 'example',
    REVIEW = 'review',
    RELEASE = 'release',
}

export class Binding implements Deserializable {
    visId!: string;
    dataIds!: string[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class OntoPage implements Deserializable {
    public id!: string;
    public bindingType!: BINDING_TYPE;
    public nrows!: number;
    public bindings!: Binding[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
