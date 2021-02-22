export const DataStreamKeywords = {
    Source: ['Raw', 'Housekeeping', 'Normalized'],
    Country: ['Scotland', 'England', 'Welsh', 'Northern_Ireland'],
    Region: [
        'Ayrshire_Arran',
        'Borders',
        'Dumfries_Galloway',
        'Fife',
        'Forth_Valley',
        'Grampian',
        'Greater_Glasgow_Clyde',
        'Highland',
        'Lanarkshire',
        'Lothian',
        'Orkney',
        'Shetland',
        'Tayside',
        'Western_Isles',
        'Golden_Jubilee_National_Hospital'
    ],
    Case_Type: ['Cumulative_Cases', 'Hospital_Confirmed', 'Hospital_Suspected', 'ICU_Patients'],
    Analytics: ['Pearson', 'F_Test', 'MSE'],
    Model: ['EERA'],
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
