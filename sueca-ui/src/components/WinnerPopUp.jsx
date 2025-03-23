const WinnerPopup = ({ winner, handleClosePopup }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative bg-white p-8 rounded-lg shadow-2xl max-w-xl mx-auto">
        <div className="absolute inset-0 animate-pulse from-purple-400 via-pink-500 to-yellow-500 rounded-full blur-lg opacity-70"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-green-400 to-purple-500 animate-text">
            🎉 {winner} Ganhou o Jogo! 🎉
          </h1>
          <p className="mt-4 text-lg text-gray-700 font-semibold">
            Parabéns à equipa vencedora!
          </p>
          <button
            className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-blue-800"
            onClick={handleClosePopup}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerPopup;