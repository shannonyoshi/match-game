import React, { useState, useEffect } from "react";

import Board from "./board"

import { CardInter, Match } from "../types";

type GameProps = {
  deck: CardInter[],
  endGame: () => void,

}

const Game = ({ deck, endGame }: GameProps) => {
  //used = array of ids of cards already played
  const [used, setUsed] = useState<number[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  // onBoard = array of ids of cards currently on the board
  const [onBoard, setOnBoard] = useState<number[]>([])
  const [selected, setSelected] = useState<CardInter[]>([])
  const [error, setError] = useState<string>("")

  //this useEffect sets the initial board.
  useEffect(() => {
    setOnBoard(draw(12))
  }, [])
  // this useEffect checks for matches once there are 3 cards selected by user
  // also removes error once selection has been updated by user. 
  useEffect(() => {
    if (selected.length === 3) {
      if (validateMatch(selected)) {
        setMatches([...matches, [...selected]])
        setSelected([])
        setError("")
        draw(3)
      }
      else {
        setError("That's not a match!")
      }
    } 
  }, [selected])

  // validateMatch returns true if match is valid
  const validateMatch = (threeCards: CardInter[]): boolean => {
    const c1: CardInter = threeCards[0]
    const c2: CardInter = threeCards[1]
    const c3: CardInter = threeCards[2]
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








  // draw() returns ids of random cards to be placed on board, count specifies number of cards drawn
  const draw = (count: number = 1): number[] => {
    let unused: number[] = []
    //gets ids of all cards that have not been used
    for (let i = 1; i < 82; i++) {
      if (!used.includes(i)) {
        unused.push(i)
      }
    }
    if (unused.length <= count) {
      return unused
    }

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
  console.log('error', error)

  return (
    <div>
      <Board onBoard={onBoard} deck={deck} selected={selected} setSelected={setSelected} setError={setError} />
    </div>
  )



}

export default Game;