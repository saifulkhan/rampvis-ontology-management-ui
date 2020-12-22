import { Deserializable } from '../deserializable.model';

export class QueryParams implements Deserializable {
    query!: string;
    params!: string[] | string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
