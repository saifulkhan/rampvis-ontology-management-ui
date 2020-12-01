import { Deserializable } from '../deserializable.model';
import { QueryParams } from './onto-data.model';

export enum PUBLISH_TYPE {
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
    public publishType!: PUBLISH_TYPE;
    public nrows!: number;
    public bindings!: Binding[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
