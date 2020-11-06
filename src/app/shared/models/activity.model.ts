import { Role } from './role.enum';

export class Activity {
    public id: string;
    public type: string;
    public action: string;
    public createdAt: Date;
    // user
    public name: string;
    public role: Role

    constructor(data: Activity = {
        id: '',
        type: '',
        action: '',
        createdAt: new Date(),
        name: '',
        role: undefined as any,
    }) {
        this.id = data.id;
        this.type = data.type;
        this.action = data.action;
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.role = data.role;
    }
}
