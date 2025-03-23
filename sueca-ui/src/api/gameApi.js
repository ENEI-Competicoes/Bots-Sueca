const fetchRenounceCounts = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_renounce_counts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-UI-Token": process.env.REACT_APP_UI_SECRET
        },
      });
      if (!response.ok) throw new Error("Error: Got an error while trying to fetch renounces");
  
      console.log(response.json())

      return await response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
};
  
const fetchGameState = async () => {
    try {
        const response = await fetch("http://localhost:5000/get_gamestate", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-UI-Token": process.env.REACT_APP_UI_SECRET 
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

        return await response.json();
    } catch (err) {
        console.error("Erro ao buscar estado do jogo:", err.message);
        return null;
    }
}

const fetchBotNames = async () => {
  try {
      const response = await fetch("http://localhost:5000/get_bot_names", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-UI-Token": process.env.REACT_APP_UI_SECRET
        },
      });

      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
      return await response.json();
  } catch (err) {
      console.error("Erro ao buscar nomes de bots:", err.message);
      return null;
  }
}

const fetchPlayerCards = async (playerId) => {
  try {
      const response = await fetch("http://localhost:5000/get_player_cards", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-UI-Token": process.env.REACT_APP_UI_SECRET
          },
          body: JSON.stringify({ player_id: playerId }),
      });

      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

      const data = await response.json();
      return data.cards || [];
  } catch (err) {
      console.error("Error: Caught an error while trying to get player cards", err);
      return [];
  }
};

export { fetchRenounceCounts, fetchGameState, fetchPlayerCards, fetchBotNames };