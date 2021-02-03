import React, { useState, useEffect } from "react";

import Instructions from "./instructions"
import Board from "./board"
import Matches from "./matches"

import { CardInter, Match } from "../types";

import "../styling/game.scss"

type GameProps = {
  deck: CardInter[],
  gameCount: number,
  winCount: number,
  updateGCount: (win: boolean) => void,
}
/* 
TODO: 
 - create end game screen
*/

const Game = ({ deck, updateGCount, gameCount, winCount }: GameProps) => {
  const [isStarted, setIsStarted] = useState<boolean>(false)
  const [showInstr, setShowInstr] = useState<boolean>(true)
  const [isEnded, setIsEnded] = useState<boolean>(false)
  //used = array of ids of cards already played, updated by draw()
  const [used, setUsed] = useState<number[]>([]);
  //matches=matches found by user and validated, updated by useEffect below
  const [matches, setMatches] = useState<Match[]>([]);
  // user can toggle viewing matches
  const [showMatches, setShowMatches] = useState<boolean>(false)
  // onBoard handles position of cards on board, updated by replaceMatch(), extendBoard()
  const [onBoard, setOnBoard] = useState<(CardInter | null)[]>([])
  // updated by replaceMatch() & onClick for Card in board.tsx
  const [selected, setSelected] = useState<number[]>([])
  const [message, setMessage] = useState<string>("")

  //initial board setup.
  useEffect(() => {
    if (isStarted === true) {
      setIsEnded(false)
      let cardIds = draw(12)
      let newCards = cardIds.map(id => deck[id - 1])
      setOnBoard([...newCards])
    }
  }, [isStarted])
  // this useEffect checks for matches once there are 3 cards selected by user
  // also removes message once selection has been updated by user. 
  useEffect(() => {
    // resets message when user changes selection
    setMessage("")

    if (selected.length === 3) {
      if (validateMatch(selected)) {
        setMatches([...matches, [deck[selected[0] - 1], deck[selected[1] - 1], deck[selected[2] - 1]]])
        setMessage("")
        replaceMatch()
      }
      else {
        setMessage("That's not a match!")
      }
    }
  }, [selected])
  // once all cards are used, checks if matches are still present, if not, WIN the game
  // if you win, instructions will not be shown
  useEffect(() => {
    // 81=number of cards in deck
    if (used.length === 81) {
      if (!checkMatchesOnBoard()) {
        updateGCount(true)
        setIsEnded(true)
        setIsStarted(false)
        setShowInstr(false)
      }
    }
  }, [onBoard])

  //if user resets the game, instructions are shown again
  const resetGame = (): void => {
    updateGCount(false)
    setShowInstr(true)
    setIsEnded(false)
    setIsStarted(false)
  }

  const startGame = (): void => {
    setIsStarted(true)
    setShowInstr(false)
    setIsEnded(false)
  }

  // validateMatch returns true if match is valid
  const validateMatch = (threeCards: number[] | (CardInter)[]): boolean => {
    const c1: CardInter = typeof (threeCards[0]) === "number" ? deck[threeCards[0] - 1] : threeCards[0]
    const c2: CardInter = typeof (threeCards[1]) === "number" ? deck[threeCards[1] - 1] : threeCards[1]
    const c3: CardInter = typeof (threeCards[2]) === "number" ? deck[threeCards[2] - 1] : threeCards[2]
    const shapeOk: boolean = singlePropCheck(c1.shape, c2.shape, c3.shape)
    const countOk: boolean = singlePropCheck(c1.count, c2.count, c3.count)
    const shadingOk: boolean = singlePropCheck(c1.shading, c2.shading, c3.shading)
    const colorOk: boolean = singlePropCheck(c1.color, c2.color, c3.color)
    if (shapeOk && countOk && shadingOk && colorOk) {
      return true
    }
    return false
  }
  // singlePropCheck is used to validate individual properties on Card
  const singlePropCheck = (val1: number, val2: number, val3: number): boolean => {
    return ((val1 === val2 && val3 === val1) || (val1 !== val2 && val2 !== val3 && val3 !== val1)) ? true : false
  }

  // replaceMatch() updates the board after a match is found by adding new cards or moving cards into position 
  const replaceMatch = (): void => {
    let newOnBoard: (CardInter | null)[] = []
    if (onBoard.length > 12) {
      newOnBoard = removeExtension()
    } else {
      // when new cards are added
      const newCardIds: number[] = draw(3)
      for (let i = 0; i < onBoard.length; i++) {
        let curr = onBoard[i]
        if (curr && selected.includes(curr.id)) {
          const newCardId = newCardIds.pop()
          if (newCardId == undefined) {
            newOnBoard.push(null)
          } else {
            const newCard = deck[newCardId - 1]
            newOnBoard.push(newCard)
          }
        } else {
          newOnBoard.push(curr)
        }
      }
    }
    setOnBoard([...newOnBoard])
    setSelected([])
  }
  // removeExtension() maintains position of cards on main board while replacing match with cards from extension
  const removeExtension = (): (CardInter | null)[] => {
    const rowLength: number = onBoard.length / 3
    const newOnBoard: (CardInter | null)[] = []
    // cards from last column that are not selected--use to replace selected cards

    const replacementCards: (CardInter | null)[] = onBoard.filter((card, index) => (index + 1) % rowLength === 0 && card && !selected.includes(card.id))
    for (let i = 0; i < onBoard.length; i++) {
      // if i is for last card in the row, skip (removing this row)
      if ((i + 1) % rowLength === 0) {
        continue
      }
      const curr = onBoard[i]
      if (selected.includes(curr!.id)) {
        const replacement = replacementCards.pop()
        // .pop() should not be called on an empty replacement array, but added just in case
        if (replacement != undefined) {
          newOnBoard.push(replacement)
        }
      } else {
        newOnBoard.push(curr)
      }
    }
    return newOnBoard
  }

  const extendBoard = (): void => {
    let allowAdd = checkMatchesOnBoard()

    if (allowAdd) {
      const cardIds: number[] = draw(3)
      const newCards: CardInter[] = cardIds.map(id => deck[id - 1])
      const newRowLength: number = (onBoard.length / 3) + 1
      const newOnBoard = onBoard
      for (let i = 0; i < newCards.length; i++) {
        let addAtIndex: number = (newRowLength * (i + 1)) - 1
        newOnBoard.splice(addAtIndex, 0, newCards[i])
      }
      setOnBoard([...newOnBoard])
    } else {
      setMessage("You can't add cards while there is still a match on the board!")
    }
  }

  // draw() returns ids of random cards to be placed on board, count specifies number of cards drawn
  const draw = (count: number = 3): number[] => {
    let unused: number[] = []
    //gets ids of all cards that have not been used
    for (let i = 1; i < 82; i++) {
      if (!used.includes(i)) {
        unused.push(i)
      }
    }
    if (unused.length <= count) {
      setUsed([...used, ...unused])
      return unused

    } else {
      let i = 0
      let result: number[] = []
      while (i < count) {
        let randIndex: number = Math.floor(Math.random() * unused.length);

        result.push(unused[randIndex])
        unused.splice(randIndex, 1)
        i += 1
      }
      setUsed([...used, ...result])
      return result
    }
  }

  const checkMatchesOnBoard = (): boolean => {
    let inPlay: CardInter[] = onBoard.filter(card => card !== null) as CardInter[]
    while (inPlay.length > 2) {
      let card1: CardInter = inPlay[0]
      for (let i = 1; i < inPlay.length; i++) {
        let card2 = inPlay[i]
        for (let j = 2; j < inPlay.length; j++) {
          let card3 = inPlay[j]
          let found: boolean = validateMatch([card1, card2, card3])
          if (found === true) {
            return false
          }
        }
      }
      inPlay.splice(0, 1)
    }
    return true
  }

  return (
    <div className="game-wrapper">
      <div className="info-wrapper">
        <h2 className="game-stats"><span className="label">Games Won:</span> {winCount}/{gameCount}</h2>
        <h2 className="game-stats"><span className="label">Cards Used:</span> {used.length}/81</h2>
        {message.length > 0 ? <p className="message">{message}</p> : <div className="no-message" />}
      </div>

      {isStarted ? <>
        {showInstr ? <Instructions deck={deck} /> :
          <><Board onBoard={onBoard} extendBoard={extendBoard} selected={selected} setSelected={setSelected} setMessage={setMessage} />
            <div className="action-buttons">
              <button onClick={extendBoard} className="add-cards">Add 3 cards</button>
              <button className="end-game" onClick={resetGame}>End Game</button>
            </div></>}
        <div className="info-buttons">
          <button onClick={() => setShowInstr(!showInstr)} className="instr-btn">{showInstr ? "Return to Game" : "View Instructions"}</button>
          <button onClick={() => setShowMatches(!showMatches)} className="matches-btn">{`${showMatches ? "Hide" : "Show"} Matches`}</button>
        </div>
        {showMatches ? <Matches matches={matches} /> : ""}</>
        : <div className="not-started">
          <Instructions deck={deck} />
          <button onClick={startGame} className="start-button">Start Game</button>
        </div>}
    </div>
  )
}

export default Game;