import { Deserializable } from '../deserializable.model';
import { QueryParams } from './onto-data.model';

export enum PUBLISH_TYPE {
    TEST = 'test',
    REVIEW = 'review',
    RELEASE = 'release',
}

export class BindData implements Deserializable {
    public dataId: string = '';
    public queryParams: QueryParams[] = undefined;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class BindVis implements Deserializable {
    visId: string = '';
    bindData: BindData[] = [];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class OntoPage implements Deserializable {
    public id: string = '';
    public title: string = '';
    public bindVis: BindVis[] = undefined;
    public nrows: number = undefined;
    public publishType: PUBLISH_TYPE = undefined as any;
    
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
