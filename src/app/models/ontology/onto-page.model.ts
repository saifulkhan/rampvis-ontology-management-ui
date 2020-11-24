import { Deserializable } from '../deserializable.model';
import { QueryParams } from './onto-data.model';

export enum PUBLISH_TYPE {
    EXAMPLE = 'example',
    REVIEW = 'review',
    RELEASE = 'release',
}

export class BindData implements Deserializable {
    public dataId!: string;
    public queryParams!: QueryParams[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class BindVis implements Deserializable {
    visId!: string;
    bindData!: BindData[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class OntoPage implements Deserializable {
    public id!: string;
    public title!: string;
    public bindVis!: BindVis[];
    public nrows!: number;
    public publishType!: PUBLISH_TYPE;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
