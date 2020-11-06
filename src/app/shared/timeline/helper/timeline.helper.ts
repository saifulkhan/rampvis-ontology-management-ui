import { Mining } from '../../models/mining.model';
import { SOURCE_TYPE } from '../../models/sourceType.enum';
import { Timeline } from '../timeline.model';

export const normalizeMiningToTimeline = (data: Mining): Timeline => ({
        id: data.id,
        date: new Date(data.minedOn),
        text: data.text,
        tags: data.collection.tags,
        title: data.source.title,
        type: data.source.type as SOURCE_TYPE,  
});

export const normalizeTimelineMsg = (msg: Timeline): Timeline => ({
        ...msg,
        id: msg.id || '',
        date: msg.date || new Date(),
        text: msg.text || '',
        tags: msg.tags || [],
        title: msg.title || '',
        type: msg.type || '' as SOURCE_TYPE,
});