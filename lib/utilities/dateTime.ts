import { format } from 'date-fns';
/**
 * formatDate
 */

export function formatDate(date, pattern = 'PPP') {
  return format(new Date(date), pattern);
}

/**
 * sortObjectsByDate
 */
interface IDate {
  [key: string]: number
}
export function sortObjectsByDate(array: IPost[], { key = 'date' } = {}) {

  // return array.sort((a, b) => new Date(b[key]) - new Date(a[key]));
  return array.sort((a, b) => new Date(b[key]).getDate() - new Date(a[key]).getDate());
}
