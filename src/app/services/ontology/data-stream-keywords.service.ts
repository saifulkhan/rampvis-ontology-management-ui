export const DataStreamKeywords = {
    Source: ['mock', 'xl', 'housekeeping', 'h5'],
    Country: ['scotland', 'england', 'wales', 'northern_ireland'],
    Scotland_Regions: [
        // Scotland
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
        'golden_jubilee_national_hospital',
    ],
    England_Regions: [
        // These are copied from internet for creating mock data, I don't know if it is correct.
        'south_east',
        'london',
        'north_west',
        'east_of_england',
        'west_midlands',
        'south_west',
        'yorkshire_and_the_humber',
        'east_midlands',
        'north_east',
    ],
    Wales_Regions: [
        // These are copied from internet for creating mock data, I don't know if it is correct.
        'north_wales',
        'mid_wales',
        'south_east_wales',
        'south_west_wales',
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
            subGroup: value.map((d) => {
                return { name: d };
            }),
        });
    }
    return group;
};

/**
 * Convert to array of keywords
 */
export const DataStreamKeywordsArr = () => {
    let arr: string[] = [];
    for (const [key, value] of Object.entries(DataStreamKeywords)) {
        arr = [...arr, ...value];
    }
    return arr;
};
