import { Timeline } from '../timeline.model';

export const normalizeMiningToTimeline = (data: any): Timeline => ({
        id: data.id,
        date: new Date(data.minedOn),
        text: data.text,
        tags: data.collection.tags,
        title: data.source.title,
        type: data.source.type,  
});

export const normalizeTimelineMsg = (msg: Timeline): Timeline => ({
        ...msg,
        id: msg.id || '',
        date: msg.date || new Date(),
        text: msg.text || '',
        tags: msg.tags || [],
        title: msg.title || '',
        type: msg.type || '',
});