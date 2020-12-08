import React, { useState, useEffect } from "react";

import Board from "./board"

import { CardInter, Match } from "../types";

type GameProps = {
  deck: CardInter[],
  endGame: () => void,

}
/* 

Functions:
  X draw cards,
  X verify match,
  X add cards,
  X check board for match,
  end game,


*/


const Game = ({ deck, endGame }: GameProps) => {
  //used = array of ids of cards already played, updated by draw()
  const [used, setUsed] = useState<number[]>([]);
  //matches=matches found by user and validated, updated by useEffect below
  const [matches, setMatches] = useState<Match[]>([]);
  // onBoard handles position of cards on board, updated by replaceMatch(), extendBoard()
  const [onBoard, setOnBoard] = useState<(CardInter | null)[]>(Array(15).fill(null))
  // updated by replaceMatch() & onClick for Card in board.tsx
  const [selected, setSelected] = useState<number[]>([])
  const [error, setError] = useState<string>("")

  //initial board setup.
  useEffect(() => {
    let cardIds = draw(12)
    let newCards = cardIds.map(id => deck[id - 1])
    setOnBoard([...newCards, null, null, null])
  }, [])
  // this useEffect checks for matches once there are 3 cards selected by user
  // also removes error once selection has been updated by user. 
  useEffect(() => {
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
  useEffect(()=> {
    // 81=number of cards in deck
    if (used.length===81){
      if (!checkMatchesOnBoard()){
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
    if (shapeOk && countOk && shadingOk && colorOk) {
      return true
    }
    return false
  }
  // singlePropCheck is used to validate individual properties on Card
  const singlePropCheck = (val1: number, val2: number, val3: number): boolean => {
    return ((val1 === val2 && val3 === val1) || (val1 !== val2 && val2 !== val3 && val3 !== val1)) ? true : false
  }
  // tryReposition() returns ids of cards that should be moved up into regular board position
  const tryReposition = (): number[] => {
    let extendedCardIds: number[] = []
    for (let i = 12; i < onBoard.length; i++) {
      if (onBoard[i] !== null && !selected.includes(onBoard[i]!.id)) {
        extendedCardIds.push(onBoard[i]!.id)
      }
    }
    return extendedCardIds
  }
  // replaceMatch() updates the board after a match is found by adding new cards or moving cards into position 
  const replaceMatch = (): void => {
    //  fist, check if there are cards that need to be repositioned
    let cardIds: number[] = tryReposition()
    // if there are no cardIds, it means cards need to be drawn
    if (cardIds.length === 0) {
      cardIds = draw(3)
    }
    let newOnBoard: (CardInter | null)[] = []
    // only goes up to 12 because after matching, the board should not be extended, so above 12===null
    for (let i = 0; i < 12; i++) {
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
    setOnBoard([...newOnBoard, null, null, null])
    setSelected([])
  }
  const extendBoard = (): void => {
    let allowAdd = checkMatchesOnBoard()
    if (allowAdd){
      
      let cardIds = draw(3)
      let newCards = cardIds.map(id => deck[id - 1])
      let fromOnBoard: (CardInter | null)[] = onBoard
      fromOnBoard.splice(12, 3)
      let newOnBoard = fromOnBoard.concat(newCards)
      setOnBoard([...newOnBoard])

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

  const checkMatchesOnBoard = ():boolean => {
    let inPlay: CardInter[] = onBoard.filter(card => card !== null) as CardInter[]
    let notFound: boolean = true
    while (inPlay.length > 2 && notFound) {
      let card1:CardInter = inPlay[0]
      for (let i = 1; i < inPlay.length; i++) {
        let card2 = inPlay[i]
        for (let j = 1; j < inPlay.length; j++) {
          let card3 = inPlay[j]
          notFound = validateMatch([card1, card2, card3])
        }
      }
      inPlay.splice(0,1)
    }
    return notFound
  }

  return (
    <div>
      <Board onBoard={onBoard} extendBoard={extendBoard} selected={selected} setSelected={setSelected} setError={setError} />
    </div>
  )
}

export default Game;