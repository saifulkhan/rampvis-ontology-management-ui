import { Role } from './role.enum';

export class User {
    public id: string;
    public name: string;
    public email: string;
    public createdAt: Date;
    public role: Role;
    public deleted: boolean;
    public password?: string;
    public phone?: string;
    public address?: any;
    
    constructor(data: User = {
        id: null,
        name: "",
        email: "",
        createdAt: null,
        role: null,
        deleted: null,
        password: null,
        phone: null,
        address: null
    }) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.createdAt = data.createdAt;
        this.role = data.role;
        this.deleted = data.deleted;
        this.password = data.password;
        this.phone = data.phone;
        this.address = data.address;
    }
}
