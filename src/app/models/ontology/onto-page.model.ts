import { Deserializable } from '../deserializable.model';
import { Binding, BindingExt } from './binding.model';

export enum BINDING_TYPE {
    EXAMPLE = 'example',
    REVIEW = 'review',
    RELEASE = 'release',
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

export class OntoPageExt implements Deserializable {
    public id!: string;
    public bindingType!: BINDING_TYPE;
    public nrows!: number;
    public bindingExts!: BindingExt[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
