import { COLLECTION_STATE } from './collection-state.enum';

export class Collection {
    public id: string;
    public title: string;
    public tags: string[];
    public archived: boolean;
    public numSources: number;
    public state: COLLECTION_STATE;

    constructor(data: Collection = {
        id: '',
        title: '',
        tags: [],
        archived: false,
        numSources: 0,
        state: COLLECTION_STATE.UNKNOWN,
    }) {
        this.id = data.id;
        this.title = data.title;
        this.tags = data.tags;
        this.archived = data.archived;
        this.numSources = data.numSources;
        this.state = data.state;
    }
}
