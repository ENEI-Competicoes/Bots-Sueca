const TrumpCard = ({ trumpSuit }) => {
  const trumpTypes = {
    E: ["♠️", "Espadas"],
    O: ["♦️", "Ouros"],
    P: ["♣️", "Paus"],
    C: ["♥️", "Copas"]
  };
  
  const trumpSuitDescription = trumpTypes[trumpSuit] || ["?", "Por definir"];
  
  return (
    <div className="flex items-center border bg-white bg-opacity-90 p-4 shadow-lg rounded-lg">
      <div className="mr-2">
        <h3 className="text-md font-semibold mb-1 text-black">Trunfo</h3>
        <p className="text-sm text-gray-600 font-bold">{trumpSuitDescription[1]}</p>
      </div>
      <div className="text-4xl text-gray-700">{trumpSuitDescription[0]}</div>
    </div>
  );
};

export default TrumpCard;
