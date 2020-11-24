import { LogMessage } from '../models/log-message.model';
import { Deserializable } from '../models/deserializable.model';
import { NOTIFICATION_TYPE } from './notification-type.enum';

export class Notification implements Deserializable {
    public message!: LogMessage;
    public type!: NOTIFICATION_TYPE;

    deserialize(input: INotification) {
        this.type = input.type;

        console.log('Notification: deserialize: type = ', this.type);
        // if (this.type === NOTIFICATION_TYPE.MINING_EVENT || 
        //     this.type === NOTIFICATION_TYPE.SCHEDULER_EVENT) {
        //     this.message = { ...JSON.parse(input.message), origin: this.type };
        // }

        // if (this.type === NOTIFICATION_TYPE.COLLECTION_UPDATE) {
        //     this.message = { ...JSON.parse(input.message) };
        // }
        
        // if (this.type === NOTIFICATION_TYPE.SOURCE_UPDATE) {
        //     this.message = { ...JSON.parse(input.message) };
        // }

        return this;
    }
}

export interface INotification {
    message: any;
    type: NOTIFICATION_TYPE;
}
