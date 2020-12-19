import { Deserializable } from 'src/app/models/deserializable.model';
import { ANALYTICS, DATA_TYPE, MODEL, SOURCE } from '../../models/ontology/onto-data-types';

export class QueryParams implements Deserializable {
    query!: string;
    params!: string[] | string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export interface Keywords {
    [key: string]: string[];
}

export interface KeywordsMapped {
    key: string;
    values: string[];
}

export class OntoData implements Deserializable {
    public id!: string;
    public urlCode!: string;
    public endpoint!: string;
    public dataType!: DATA_TYPE;
    public description!: string;
    public date!: Date;
    public keywords!: Keywords | Array<KeywordsMapped>;
    public queryParams!: QueryParams[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class OntoDataSearch extends OntoData {
    public score: number = undefined as any;
}

export function keywordsObjectToArray(obj: Keywords): Array<KeywordsMapped> {
    let res: Array<KeywordsMapped> = [];
    if (obj) {
        res = Object.entries(obj).map(([k, v]) => {
            return { key: k, values: v };
        });
    }
    return res;
}

export function keywordsArrayToObject(arr: Array<KeywordsMapped>): Keywords {
    let res: Keywords = {};
    for (let d of arr) {
        res[d.key] = d.values;
    }
    return res;
}
