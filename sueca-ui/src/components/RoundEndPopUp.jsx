const RoundEndPopUp = ({ winner, renounceCounts, renouncePlayer, renouncedPlayer }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full blur-lg opacity-50"></div>
  
          <div className="bg-white p-6 rounded-xl shadow-xl relative z-10 text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-green-400 to-purple-500 animate-text">
              🎉 {winner} GANHOU! 🎉
            </h1>
            {renouncePlayer && renouncedPlayer ? (
              <p className="mt-4 text-lg text-gray-700 font-semibold">
                O jogador <strong> {renouncePlayer}</strong> denunciou o jogador <strong>{renouncedPlayer}</strong>! 
              </p>
            ) : (
                <></>
            )}
            <p className="mt-4 text-lg text-gray-700 font-semibold">
              Preparem-se para a próxima ronda!
            </p>
            {Object.values(renounceCounts).some(count => count > 0) && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-gray-800">🚨 Renúncias nesta ronda:</h2>
                <ul className="mt-2 text-gray-700">
                  {Object.entries(renounceCounts)
                    .filter(([_, count]) => count > 0)
                    .map(([player, count]) => (
                      <li key={player} className="text-md font-bold">
                        {player}: {count} {count > 1 ? "renúncias" : "renúncia"}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default RoundEndPopUp;
  