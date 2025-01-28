const formatDate = (date) => {
  if (date) {
    date = new Date(date).toLocaleDateString();
  }
  return date
}

export default formatDate