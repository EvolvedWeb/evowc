export const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
export function formatDate(dateObj) {
  try {
    return (dateObj ? DATE_FORMATTER.format(dateObj) : null);
  }

  catch(ex) {
    return null;
  }
}
