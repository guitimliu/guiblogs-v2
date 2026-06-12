const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  dateStyle: "long",
  timeZone: "Asia/Taipei",
});

const shortFormatter = new Intl.DateTimeFormat("zh-TW", {
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Taipei",
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatMonthDay(iso: string): string {
  return shortFormatter.format(new Date(iso));
}
