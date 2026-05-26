import {toZonedTime} from "date-fns-tz";

export const formatMoney = (amount: number, currency = 'IDR', locale = 'id-ID') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s/g, '');
};

export function formatBibNumber(bib: number, length = 3): string {
  return bib.toString().padStart(length, "0")
}

export function formateDate(inputDate: Date) {
  return toZonedTime(inputDate, 'Asia/Singapore')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('')
}