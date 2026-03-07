export function formatTime(time: string) {
    if (!time) return "";
    return time.slice(0,5)
}

export function formatGameDate(dateString:string) {
    if (!dateString) return "";

    const date = new Date(dateString)

    const weekday = date.toLocaleDateString("en-GB", {weekday:"short"})
    const month = date.toLocaleDateString("en-GP", {month:"short"})
    const year = date.getFullYear()
    const day = date.getDate()

    return `${weekday}, ${day}${getOrdinal(day)} ${month} ${year} `
}

function getOrdinal(day:number) {
    if (day >3 && day < 21) return "th"
    switch (day %10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

export function formatDateFilter(dateString:string) {
    if (!dateString) return 0;
    const date = new Date(dateString).setHours(0, 0, 0, 0)

    return date
}