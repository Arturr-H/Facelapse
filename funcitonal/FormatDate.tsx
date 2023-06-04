export default function getFormattedDate(date: number) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date_ = new Date(date);
    const day = date_.getDate().toString().padStart(2, "0");
    const month = months[date_.getMonth()];
    const year = date_.getFullYear().toString();
    return `${day} ${month} ${year}`;
}
