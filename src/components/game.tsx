import React, { useState, useEffect } from "react";

import Board from "./board"
import Matches from "./matches"

import { CardInter, Match } from "../types";

type GameProps = {
  deck: CardInter[],
  endGame: () => void,

}
/* 
TODO: 
 - create component for showing error messages and game info--cards left/# of wins, etc. 
 - create win screen
 - style add card button
 - fix styling for match component
 - create footer



*/


const Game = ({ deck, endGame }: GameProps) => {
  //used = array of ids of cards already played, updated by draw()
  const [used, setUsed] = useState<number[]>([]);
  //matches=matches found by user and validated, updated by useEffect below
  const [matches, setMatches] = useState<Match[]>([]);
  // onBoard handles position of cards on board, updated by replaceMatch(), extendBoard()
  const [onBoard, setOnBoard] = useState<(CardInter | null)[]>(Array(12).fill(null))
  // updated by replaceMatch() & onClick for Card in board.tsx
  const [selected, setSelected] = useState<number[]>([])
  const [error, setError] = useState<string>("")

  //initial board setup.
  useEffect(() => {
    let cardIds = draw(12)
    let newCards = cardIds.map(id => deck[id - 1])
    setOnBoard([...newCards])
  }, [])
  // this useEffect checks for matches once there are 3 cards selected by user
  // also removes error once selection has been updated by user. 
  useEffect(() => {
    console.log('second useEffect start')
    if (selected.length === 3) {
      if (validateMatch(selected)) {
        setMatches([...matches, [deck[selected[0] - 1], deck[selected[1] - 1], deck[selected[2] - 1]]])
        setError("")
        replaceMatch()
      }
      else {
        setError("That's not a match!")
      }
    }
  }, [selected])
  // once all cards are used, checks if matches are still present, if not, end the game
  useEffect(() => {
    // 81=number of cards in deck
    if (used.length === 81) {
      if (!checkMatchesOnBoard()) {
        console.log('end game')
        endGame()
      }
    }
  }, matches)

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
  // checkReposition() returns ids of cards that should be moved up into regular board position
  const checkReposition = (): number[] | null => {
    console.log('checkReposition()')
    if (onBoard.length <= 12) {
      return null
    }
    let extendedCardIds: number[] = []
    console.log('onBoard', onBoard)
    let i: number = onBoard.length - 1
    while (onBoard[11]!.id !== onBoard[i]!.id && extendedCardIds.length <= 3) {
      let curr = onBoard[i]
      console.log('i, curr', i, curr)
      if (curr !== null && !selected.includes(onBoard[i]!.id)) {
        extendedCardIds.push(onBoard[i]!.id)
        console.log('added Id to extendedCardIds', extendedCardIds)
      }
      i -= 1
    }
    console.log('after while loop extendedCardIds', extendedCardIds)
    return extendedCardIds.length > 0 ? extendedCardIds : null;
  }
  // replaceMatch() updates the board after a match is found by adding new cards or moving cards into position 
  const replaceMatch = (): void => {
    console.log('replaceMatch()')
    //  fist, check if there are cards that need to be repositioned
    let cardIds: number[] | null = checkReposition()
    let removeCount:number = cardIds? cardIds.length: 0
    // let removeCards: boolean = true
    // console.log('cardIds', cardIds)
    // if there are no cardIds, it means cards need to be drawn
    if (cardIds === null) {
      cardIds = draw(3)
    }
    let newOnBoard: (CardInter | null)[] = []
    for (let i = 0; i < onBoard.length; i++) {
      // if item should be replaced
      if (selected.includes(onBoard[i]!.id)) {
        let newId = cardIds.pop()
        if (newId !== undefined) {
          newOnBoard.push(deck[newId - 1])
        }
      } else {
        newOnBoard.push(onBoard[i])
      }
    }
    if (removeCount>0) {
      newOnBoard.splice(-removeCount, removeCount)
    }
    setOnBoard([...newOnBoard])
    setSelected([])
  }
  const extendBoard = (): void => {
    // TODO: uncomment below line after debugging
    // let allowAdd = checkMatchesOnBoard()
    let allowAdd = true
    // console.log('allowAdd', allowAdd)
    if (allowAdd) {

      let cardIds = draw(3)
      let newCards = cardIds.map(id => deck[id - 1])
      // let fromOnBoard: (CardInter | null)[] = onBoard
      // let newOnBoard = fromOnBoard.concat(newCards)
      setOnBoard([...onBoard, ...newCards])

    } else {
      setError("You can't add more cards, there is a match on the board")
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
    <div>
      <p>Used: {used.length}/81</p>
      <Board onBoard={onBoard} extendBoard={extendBoard} selected={selected} setSelected={setSelected} setError={setError} />
      <Matches matches={matches} />
    </div>
  )
}

export default Game;