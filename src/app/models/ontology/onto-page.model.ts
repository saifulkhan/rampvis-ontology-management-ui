import { Deserializable } from '../deserializable.model';
import { BINDING_TYPE } from './binding-type.enum';
import { Binding, BindingExt } from './binding.model';

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

export class OntoPageExt extends OntoPage {
    public bindingExts!: BindingExt[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
