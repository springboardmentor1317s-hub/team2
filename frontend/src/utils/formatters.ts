export const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return "N/A"; // Handle cases where date might be missing
  
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString));
  } catch (error) {
    console.error("Invalid date passed to formatDate:", dateString);
    return "Invalid Date";
  }
};
