var moment = require('moment-timezone');
// moment().format('MMMM Do YYYY, h:mm:ss a')
var time_s = (time) => {
    return moment(time, 'HHmm').format('HH:mm')
}

var departments =
    [
        {
            name: 'Internal Medicine Residency',
            notification_times: [time_s('0600'),time_s('1700')],
            members: []
        },
        {
            name: 'Psychiatry Residency',
            notification_times: [time_s('0600'),time_s('1700')],
            members: []
        },
        {
            name: 'Cardiology Fellowship',
            notification_times: [time_s('0600'),time_s('1700')],
            members: [],
        },
        {
            name: 'GI Fellowship',
            notification_times: [time_s('0600'),time_s('1700')],
            members: [],
        },
        {
            name: 'Pulmonary Fellowship',
            notification_times: [time_s('0600'),time_s('1700')],
            members: [],
        },
        {
            name: 'Endocrine Fellowship',
            notification_times: [time_s('0600'),time_s('1700')],
            members: [],
        },
    ];

module.exports = departments;
