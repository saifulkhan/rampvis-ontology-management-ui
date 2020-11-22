import { Deserializable } from '../models/deserializable.model';
import { Role } from './role.enum';

export class User implements Deserializable {
    public id: string;
    public name: string;
    public email: string;
    public createdAt: Date;

    public githubId: string;
    public githubUsername: string;
    public password: string;
    
    public role: Role;
    public deleted: boolean;
 
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
