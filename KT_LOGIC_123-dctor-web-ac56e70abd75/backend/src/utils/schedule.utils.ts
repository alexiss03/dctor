/*
Reference: https://www.rfc-editor.org/rfc/rfc5545

freq
until
count
interval
bysetpos
byyearday


[second][minutes][hour][day of month][month][day of week]

*/
export class ScheduleUtils {
    public static SCHEDULE_CHARSET: string[] = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", 
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
    ];
    public static FREQUENCY_DAILY: string = ''

    public static encodeDateTime(value: Date): string {
        if(value === null) {
            return ''
        }
        const charset = ScheduleUtils.SCHEDULE_CHARSET;
        return `${
            charset[value.getUTCSeconds()]
        }${
            charset[value.getUTCMinutes()]
        }${
            charset[value.getUTCHours()]
        }${
            charset[value.getUTCDate()]
        }${
            charset[value.getUTCMonth()]
        }${
            charset[value.getUTCDay()]
        }`;
    }

    public static isDateMatchSchedule(schedule: string, value: Date): boolean {
        
        return false;
    }
}