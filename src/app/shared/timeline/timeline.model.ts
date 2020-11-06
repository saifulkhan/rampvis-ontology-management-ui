import { SOURCE_TYPE } from '../models/sourceType.enum';

export interface Timeline {
    id?: string;
    title?: string;
    type?: SOURCE_TYPE;
    text?: string;
    date?: Date;
    tags?: Array<string>;
}
