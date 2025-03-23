import {getCardImagePath} from "../util/getImagePath"

const Card = ({ cardIdentifier }) => {
  const imagePath = getCardImagePath(cardIdentifier);

  return (
      <div className="w-14 h-18 flex items-center justify-center">
          {imagePath ? (
              <img src={imagePath} alt={cardIdentifier} className="w-full h-full object-cover rounded" loading="lazy"/>
          ) : (
              <div className="bg-transparent w-full h-full"></div>
          )}
      </div>
  );
};

export default Card;
