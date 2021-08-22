import { Deserializable } from '../deserializable.model';
import { OntoData } from './onto-data.model';
import { OntoVis } from './onto-vis.model';
import { PAGE_TYPE } from './page-type.enum';

export class OntoPage implements Deserializable {
    public id!: string;
    public pageType!: PAGE_TYPE;
    public visId!: string;
    public dataIds!: string[];
    public pageIds?: string[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class OntoPageExt extends OntoPage {
    public vis!: OntoVis;
    public data!: OntoData[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class OntoPageExtSearchGroup implements Deserializable {
    public score: number = undefined as any;
    public groups: OntoPageExt[] = undefined as any;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
