/**
 * Extracts the query parameters from the URL.
 * @returns An object containing the query parameters.
 * @example
 * // If the URL is https://example.com?foo=bar&baz=qux
 * const params = getHashParams();
 * console.log(params);
 * // {
 * //   foo: 'bar',
 * //   baz: 'qux'
 * // }
 * */
export const getHashParams = (): { [key: string]: string } => {
    const hashParams: { [key: string]: string } = {};
    let e: RegExpExecArray | null;
    const r = /([^&;=]+)=?([^&;]*)/g;
    const q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
};


/**
 * 
 * @param millis number to format into MM:SS
 * @returns formatted number
 */
export const formatDuration = (millis: number): string => {
  const minutes: number = Math.floor(millis / 60000);
  const seconds: string = ((millis % 60000) / 1000).toFixed(0).padStart(2, '0');
  return `${minutes}:${seconds}`;
};



/**
 * @param millis number to format into X minutes and Y seconds
 * @returns formatted number
 */
export const formatDurationForHumans = (millis: number): string => {
    const minutes: number = Math.floor(millis / 60000);
    const seconds: string = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes} Mins ${seconds} Secs`;
};


// Get year from YYYY-MM-DD
/**
 * Extracts the year from a date string.
 * @param date A string representing a date in the format "YYYY-MM-DD".
 * @returns A string representing the year extracted from the date.
 */
export const getYear = (date: string): string => date.split('-')[0];



/**
 * Parses a pitch class value and returns the corresponding musical note.
 * @param note A pitch class value representing the note (0 to 11).
 * @returns The corresponding musical note as a string, or null if the input is invalid.
 */
export const parsePitchClass = (note: any) => {
    let key = note;

    switch (note) {
        case 0:
            key = 'C';
            break;
        case 1:
            key = 'D♭';
            break;
        case 2:
            key = 'D';
            break;
        case 3:
            key = 'E♭';
            break;
        case 4:
            key = 'E';
            break;
        case 5:
            key = 'F';
            break;
        case 6:
            key = 'G♭';
            break;
        case 7:
            key = 'G';
            break;
        case 8:
            key = 'A♭';
            break;
        case 9:
            key = 'A';
            break;
        case 10:
            key = 'B♭';
            break;
        case 11:
            key = 'B';
            break;
        default:
            return null;
    }

    return key;
};

/**
 * 
 * @param n number to format with commas
 * @returns number with commas
 */
export const formatWithCommas = (n: any): string => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');


/**
 * 
 * @param fn higher order function that catches errors
 * @returns logs errors to console
 */
export const catchErrors = (fn: any) =>
    function (...args: any) {
        return fn(...args).catch((err: any) => {
            console.error(err);
        });
    };


export function getRelativeTime(timestamp: string) {
    var currentTime: any = new Date();
    var previousTime: any = new Date(timestamp);
    var elapsed = Math.floor((currentTime - previousTime) / 1000); // Elapsed time in seconds

    if (elapsed < 60) {
        return elapsed + ' sec ago';
    } else if (elapsed < 3600) {
        var minutes = Math.floor(elapsed / 60);
        return minutes + ' min ago';
    } else if (elapsed < 86400) {
        var hours = Math.floor(elapsed / 3600);
        return hours + ' hrs ago';
    } else {
        var days = Math.floor(elapsed / 86400);
        return days + ' days ago';
    }
}