export const formatNumber = (value : string | null) => {
    // Format the number with spaces as a separator
    return (value ?? '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };