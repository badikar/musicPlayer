const getEl = (selection) => {
  const element = document.querySelector(selection);
  if (element) return element;
  throw new Error('ooops... no such element exists');
};
export default getEl;
