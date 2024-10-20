export const calculateArea = (coordinates) => {
    if (coordinates.length < 3) {
      return 0;
    }
  
    let total = 0;
    for (let i = 0; i < coordinates.length; i++) {
      let addX = coordinates[i].lat();
      let addY = coordinates[i == coordinates.length - 1 ? 0 : i + 1].lng();
      let subX = coordinates[i == coordinates.length - 1 ? 0 : i + 1].lat();
      let subY = coordinates[i].lng();
  
      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }
  
    return Math.abs(total) * 69.1 * 69.1 * 10.764; // Convert to square feet
  };