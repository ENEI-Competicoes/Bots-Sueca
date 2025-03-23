
class Player:
    def __init__(self, playerID):
        self.cards = []
        self.id = "P" + str(playerID)
        self.name = ""

    def is_valid_card(self, card: str):
        """Checks if a card is valid and removes it from the player's hand."""
        if card not in self.cards:
            return False
        self.cards.remove(card)
        return True
    
    def set_name(self, name:str):
        self.name = name