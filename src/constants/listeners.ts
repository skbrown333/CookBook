export const MediaClickHandler = (event) => {
  const media = event.target.nextSibling;
  console.log('targeting:', media);
  media.dispatchEvent(new MouseEvent('click'));
};
