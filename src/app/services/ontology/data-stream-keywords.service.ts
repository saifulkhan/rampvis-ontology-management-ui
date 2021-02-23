export const DataStreamKeywords = {
    Source: ['xl', 'housekeeping', 'h5'],
    Country: ['scotland', 'england', 'welsh', 'northern_ireland'],
    Region: [
        'ayrshire_arran',
        'borders',
        'dumfries_galloway',
        'fife',
        'forth_valley',
        'grampian',
        'greater_glasgow_clyde',
        'highland',
        'lanarkshire',
        'lothian',
        'orkney',
        'shetland',
        'tayside',
        'western_isles',
        'golden_jubilee_national_hospital'
    ],
    Case_Type: ['cumulative_cases', 'hospital_confirmed', 'hospital_suspected', 'icu_patients'],
    Analytics: ['pearson', 'f_test', 'mse'],
    Model: ['eera'],
};

/**
Convert DataStreamKeywords to ng-select group dropdown format
[
    {
        name: 'Source',
        subGroup: [
            { name: 'Raw' },
            { name: 'Housekeeping' }
        ],
    },
    {
        name: 'Country',
        subGroup: [
            { name: 'Scotland' },
            { name: 'England' },
            { name: 'Welsh' },
            { name: 'Northern Ireland' }
        ],
    },
    ...
]
*/
export const DataStreamKeywordsToDropdown = () => {
    const group: any = [];
    for (const [key, value] of Object.entries(DataStreamKeywords)) {
        group.push({
            name: key,
            subGroup: value.map(d => { return { 'name': d } })
        })
    }
    return group;
}


/**
 * Convert to array of keywords
 */
export const DataStreamKeywordsArr = () => {
    let arr: string[] = [];
    for (const [key, value] of Object.entries(DataStreamKeywords)) {
        arr = [...arr, ...value]
    }
    return arr;
}
