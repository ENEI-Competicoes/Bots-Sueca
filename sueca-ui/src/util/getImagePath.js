const getImagePathChair = () => {
  return `/images/chair.png`;
};

const getImagePathENEILogo = () => {
  return `/images/logo-white.png`;
};

const getCardImagePath = (cardIdentifier) => {
  if (!cardIdentifier) return null;
  console.log("card id", cardIdentifier)

  if (cardIdentifier.startsWith("R")) {
    return `/cards/renounce_card.svg`;
  }
  return `/cards/${cardIdentifier}.svg`;
};

export { getImagePathChair, getImagePathENEILogo, getCardImagePath };
