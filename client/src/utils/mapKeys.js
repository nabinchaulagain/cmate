const mapKeys = (arr, keyAttribute) => {
  const newObject = {};
  for (const element of arr) {
    newObject[element[keyAttribute]] = element;
  }
  return newObject;
};
export default mapKeys;
