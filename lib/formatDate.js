const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
function formatDate(dateObj) {
  try {
    return (dateObj ? DATE_FORMATTER.format(dateObj) : null);
  }

  catch(ex) {
    return null;
  }
}

module.exports = formatDate;
