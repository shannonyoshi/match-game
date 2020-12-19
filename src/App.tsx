import React, { useState, useEffect } from 'react';
import { CardInter, ThemeOpts } from "./types";

import "./styling/app.scss"

import Game from "./components/game"

import Card from "./components/card"

function App() {
  // gameCount=# games played this session
  const [gameCount, setGameCount] = useState<number>(0)
  const [winCount, setWinCount] = useState<number>(0)
  // id for deck starts at 1, not 0
  const [fullDeck, setFullDeck] = useState<CardInter[]>([])
  const [isStarted, setIsStarted] = useState<boolean>(false)
  const [theme, setTheme] = useState<ThemeOpts>("default")

  const allThemes:ThemeOpts[] = ["default", "dark", "mono", "mono-dark"]

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
              let newCard: CardInter = {
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
    <div id="app" className={`theme-${theme}`}>

      <div className="app-container">
        <header className="header">

          <h1>Match Game</h1>

        </header>
          <div className="theme-setter">
            <p className="title">Themes:</p>
            {allThemes.map(themeName=><button className={`theme-btn ${themeName===theme?"selected": ""}`} onClick={()=>setTheme(themeName)}>{themeName.charAt(0).toUpperCase() + themeName.slice(1)}</button>)}
          </div>
        <h2>Games Won: {gameCount}</h2>
        {isStarted ?
          <Game deck={fullDeck} endGame={endGame} /> :
          <button onClick={() => setIsStarted(true)}>Start Game</button>
        }

      </div>
    </div>
  );
}

export default App;
