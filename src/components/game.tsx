import React, { useState, useEffect } from "react";

import Board from "./board"
import Matches from "./matches"

import { CardInter, Match } from "../types";

type GameProps = {
  deck: CardInter[],
  gameCount: number,
  winCount: number,
  endGame: (win: boolean) => void,

}
/* 
TODO: 
 - create component for showing message messages and game info--cards left/# of wins, etc. 
 - create win screen
 - style add card button
 - fix styling for match component
 - create footer



*/


const Game = ({ deck, endGame, gameCount, winCount }: GameProps) => {
  //used = array of ids of cards already played, updated by draw()
  const [used, setUsed] = useState<number[]>([]);
  //matches=matches found by user and validated, updated by useEffect below
  const [matches, setMatches] = useState<Match[]>([]);
  // onBoard handles position of cards on board, updated by replaceMatch(), extendBoard()
  const [onBoard, setOnBoard] = useState<(CardInter | null)[]>([])
  // updated by replaceMatch() & onClick for Card in board.tsx
  const [selected, setSelected] = useState<number[]>([])
  const [message, setMessage] = useState<string>("")

  //initial board setup.
  useEffect(() => {
    let cardIds = draw(12)
    let newCards = cardIds.map(id => deck[id - 1])
    setOnBoard([...newCards])
  }, [])
  // this useEffect checks for matches once there are 3 cards selected by user
  // also removes message once selection has been updated by user. 
  useEffect(() => {
    console.log('second useEffect start')
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
  // once all cards are used, checks if matches are still present, if not, end the game
  useEffect(() => {
    // 81=number of cards in deck
    if (used.length === 81) {
      if (!checkMatchesOnBoard()) {
        endGame(true)
      }
    }
  }, [onBoard])

  const resetGame = (): void => {
    endGame(false)
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
    console.log('c1,c2,c3', c1, c2, c3)
    if (shapeOk && countOk && shadingOk && colorOk) {
      console.log('true')
      return true
    }
    console.log('false', false)
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
    console.log('removeExtension()')
    console.log('selected', selected)
    console.log('onBoard', onBoard)
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
    // TODO: uncomment below line after debugging board extension
    // let allowAdd = checkMatchesOnBoard()
    let allowAdd = true

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
      setMessage("You can't add more cards, there is a match on the board")
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
  console.log('onBoard', onBoard)

  return (
    <div>
      <div className="info-wrapper">
        <h2 className="game-stats"><span className="label">Games Won:</span> {winCount}/{gameCount}</h2>
        <p className="game-stats"><span className="label">Cards Used:</span> {used.length}/81</p>
        {message.length > 0 ? <p className="message">{message}</p> : ""}

      </div>
      <Board onBoard={onBoard} extendBoard={extendBoard} selected={selected} setSelected={setSelected} setMessage={setMessage} />
      <button onClick={extendBoard} className="add-cards">Add 3 cards</button>
      <button className="end-game" onClick={resetGame}>End Game</button>
      <Matches matches={matches} />
    </div>
  )
}

export default Game;