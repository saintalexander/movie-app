// Function to add an item to the array
export function addItemToArray(array, ...items) {
  return [...array, ...items];
}

// Function to remove an item from the array
export function removeItemFromArray(array, itemId) {
  return array.filter(item => item.id !== itemId);
}

// Function to remove duplicates from an array based on a key property
export function removeDuplicatesFromArray(array, key) {
  const uniqueKeys = new Set();
  return array.filter((item) => {
    const itemKey = item[key];
    if (!uniqueKeys.has(itemKey)) {
      uniqueKeys.add(itemKey);
      return true;
    }
    return false;
  });
}
