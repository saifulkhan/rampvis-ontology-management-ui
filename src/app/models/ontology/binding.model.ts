import { Deserializable } from '../deserializable.model';
import { OntoData } from './onto-data.model';
import { OntoVis } from './onto-vis.model';

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

export class BindingExt implements Deserializable {
    vis!: OntoVis;
    data!: OntoData[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
