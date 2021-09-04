export enum DATA_TYPE {
    TIMESERIES = 'timeseries',
    MULTI_TIMESERIES = 'multi_timeseries',
    CUM_TIMESERIES = 'cum_timeseries',
    MULTI_CUM_TIMESERIES = 'multi_cum_timeseries',
    MATRIX = 'matrix',
    OTHER = 'other',
}

export enum URL_CODE {
    API_JS = 'API_JS',
    API_PY = 'API_PY',
}

export enum SOURCE {
    SCOTLAND = 'scotland',
    HOSPITAL = 'hospital',
}

export enum MODEL {
    IC = 'ic',
    ONEKM2 = '1km2',
    LHSTM = 'lhstm',
    CT = 'c&t',
    EERA = 'eera',
}

export enum ANALYTICS {
    SIMILARITY = 'similarity',
    UNCERTAINTY = 'uncertainty',
}

