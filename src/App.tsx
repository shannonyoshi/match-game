import React, { useState, useEffect } from 'react';
import { CardInter, ThemeOpts } from "./types";

import "./styling/app.scss"
import "./styling/card.scss"

import Game from "./components/game"

function App() {
  // gameCount=# games played this session
  const [gameCount, setGameCount] = useState<number>(0)
  const [winCount, setWinCount] = useState<number>(0)
  // id for deck starts at 1, not 0
  const [fullDeck, setFullDeck] = useState<CardInter[]>([])
  const [theme, setTheme] = useState<ThemeOpts>("default")
  const allThemes: ThemeOpts[] = ["default", "dark", "mono", "mono-dark"]

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

  const updateGCount = (win: boolean) => {
    if (win) {
      setWinCount(winCount + 1)
    }
    setGameCount(gameCount + 1)
  }
  return (
    <div id="app" className={`theme-${theme}`}>

      <div className="app-container">
        <header className="header">

          <h1>Match Game</h1>

        </header>

        <div className={`theme-setter ${theme.includes("dark") ? "dark" : "light"}`}>
          <p className="title">Themes:</p>
          {allThemes.map(themeName => <button className={`theme-btn ${themeName === theme ? "selected" : ""}`} onClick={() => setTheme(themeName)}>{themeName.charAt(0).toUpperCase() + themeName.slice(1)}</button>)}
        </div>
        <Game deck={fullDeck} gameCount={gameCount} winCount={winCount} updateGCount={updateGCount} />:
        <footer>
          <a href="https://github.com/shannonyoshi/match-game" target="_blank">
            <i className="fab fa-github fa-4x"></i>
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
