import { Deserializable } from 'src/app/shared/models/deserializable.model';
import { QueryParams } from './onto-data.model';

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
    public bindVis: BindVis[] = [];
    public nrows: number = 0;
    public released: boolean = false;
    
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
