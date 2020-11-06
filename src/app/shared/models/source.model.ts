import { SOURCE_TYPE } from './sourceType.enum';

export class Source {
    public id: string;
    public title: string;
    public url: string;
    public login: string;
    public pass: string;
    public type: SOURCE_TYPE;
    public lastMinedOn: Date;
    public lastUpdatedOn: Date;

    constructor(
        data: Source = {
            id: '',
            title: '',
            url: '',
            login: '',
            pass: '',
            type: undefined,
            lastMinedOn: undefined,
            lastUpdatedOn: undefined,
        },
    ) {
        this.id = data.id;
        this.title = data.title;
        this.url = data.url;
        this.login = data.login;
        this.pass = data.pass;
        this.type = data.type;
        this.lastMinedOn = data.lastMinedOn;
        this.lastUpdatedOn = data.lastUpdatedOn;
    }
}
