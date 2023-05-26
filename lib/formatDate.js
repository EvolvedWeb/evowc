const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
const formatDate = (dateObj) => (dateObj ? DATE_FORMATTER.format(dateObj) : null);

module.exports = formatDate;
