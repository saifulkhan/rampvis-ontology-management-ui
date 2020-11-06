import { LogMessage } from '../log-monitor/models/log-message.model';
import { Collection } from './collection.model';
import { Deserializable } from './deserializable.model';
import { Mining } from './mining.model';
import { NOTIFICATION_TYPE } from './notification-type.enum';
import { Source } from './source.model';

export class Notification implements Deserializable {
    public message: Mining | LogMessage | Collection | Source = undefined;
    public type: NOTIFICATION_TYPE = '' as any;

    deserialize(input: INotification) {
        this.type = input.type;

        console.log('Notification: deserialize: type = ', this.type);

        if (this.type === NOTIFICATION_TYPE.MINING_CREATE || 
            this.type === NOTIFICATION_TYPE.MINING_CHECK ||
            this.type === NOTIFICATION_TYPE.MINING_DELETE) {
            this.message = new Mining().deserialize(JSON.parse(input.message));
        } 
        
        if (this.type === NOTIFICATION_TYPE.MINING_EVENT || 
            this.type === NOTIFICATION_TYPE.SCHEDULER_EVENT) {
            this.message = { ...JSON.parse(input.message), origin: this.type };
        }

        if (this.type === NOTIFICATION_TYPE.COLLECTION_UPDATE) {
            this.message = { ...JSON.parse(input.message) };
        }
        
        if (this.type === NOTIFICATION_TYPE.SOURCE_UPDATE) {
            this.message = { ...JSON.parse(input.message) };
        }

        return this;
    }
}

export interface INotification {
    message: any;
    type: NOTIFICATION_TYPE;
}
