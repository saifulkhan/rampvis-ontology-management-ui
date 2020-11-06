/*
    Each permission consists of three parts each connected with "|"

    1. The permission type, ex: "account"
    2. CRUD operation, ex: "create"
    3. permission field -> optional , ex: "phone"

    Full example -> account|update:any|phone

    General rule for defining permission enum KEY where each word is separated by underscore "_" :
        1. starts with CAN
        2. the CRUD operation (verb (+ adjective))
        3. permission type (noun)
        4. permission field (noun)
*/


// Example of how permission may look like
export enum Permissions {
    CAN_CREATE_USER = 'user|create:any',
    CAN_UPDATE_USER = 'user|update:any',
    CAN_DELETE_USER = 'user|delete:any',
    CAN_VIEW_USER = 'user|read:any',
}
