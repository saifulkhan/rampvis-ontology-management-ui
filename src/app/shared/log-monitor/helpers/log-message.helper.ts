import { LogMessage } from '../models/log-message.model';

export const normalizeLogMessage = (msg: LogMessage): LogMessage => ({
    ...msg,
    type: msg.type ? msg.type : 'LOG',
    message: msg.message ? msg.message : '',
    timestamp: msg.timestamp ? msg.timestamp : new Date().toLocaleString(),
    origin: msg.origin ? msg.origin : 'SYSTEM',
});
