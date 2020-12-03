import React, { useState, useEffect } from 'react';
import { Card } from "./types";

import Game from "./components/game"



function App() {
  // gameCount=# games played this session
  const [gameCount, setGameCount] = useState<number>(0)
  const [winCount, setWinCount] = useState<number>(0)
  // id for deck starts at 1, not 0
  const [fullDeck, setFullDeck] = useState<Card[]>([])
  const [isStarted, setIsStarted] = useState<boolean>(false)



  // creates 81 cards for the deck
  useEffect(() => {
    const makeCards = () => {
      let cardArray = []
      //i=shape, j=count, k=shading, l=color
      let id = 1
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          for (let k = 0; k < 3; k++) {
            for (let l = 0; l < 3; l++) {
              let newCard: Card = {
                id: id,
                shape: i,
                count: j,
                shading: k,
                color: l,
              }
              cardArray.push(newCard)
              id += 1
            }
          }

        }
      }
      setFullDeck(cardArray)

    }
    makeCards()
  }, []);

  const endGame = (win?: boolean) => {
    if (win) {
      setWinCount(winCount + 1)
    }
    setIsStarted(false)
    setGameCount(gameCount + 1)
  }
  return (
    <div className="App">
      <header className="App-header">

        <h1>Match Game</h1>

      </header>
      <h2>Games Played: {gameCount}</h2>
      {isStarted ?
        <Game deck={fullDeck} endGame={endGame} /> :
        <button onClick={() => setIsStarted(true)}></button>
      }

    </div>
  );
}

export default App;
