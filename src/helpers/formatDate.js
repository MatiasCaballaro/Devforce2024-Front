//Function to format the date as DD-MM-YYYY
export default function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  