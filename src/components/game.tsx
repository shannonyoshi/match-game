import React, { useState, useEffect } from "react";

import Board from "./board"

import { Card, Match, CardKeys } from "../types";

type GameProps = {
  deck: Card[],
  endGame: () => void,

}

const Game = ({ deck, endGame }: GameProps) => {
  //used = array of ids of cards already played
  const [used, setUsed] = useState<number[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  // onBoard = array of ids of cards currently on the board
  const [onBoard, setOnBoard] = useState<number[]>([])
  const [selected, setSelected] = useState<Card[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    //ids of cards to put on initial set up
    setOnBoard(draw(12))
  }, [])

  useEffect(() => {
    if (selected.length === 3) {
      const c1: Card = selected[0]
      const c2: Card = selected[1]
      const c3: Card = selected[2]
      const shapeOk: boolean = (c1.shape !== c2.shape && c1.shape !== c3.shape && c2.shape !== c3.shape) || (c1.shape === c2.shape && c2.shape == c3.shape) ? true : false
      const countOk: boolean =  (c1.count !== c2.count && c1.count !== c3.count && c2.count !== c3.count) || (c1.count === c2.count && c2.count == c3.count) ? true : false
      const shadingOk: boolean =  (c1.shading !== c2.shading && c1.shading !== c3.shading && c2.shading !== c3.shading) || (c1.shading === c2.shading && c2.shading == c3.shading) ? true : false
      const colorOk: boolean =  (c1.color !== c2.color && c1.color !== c3.color && c2.color !== c3.color) || (c1.color === c2.color && c2.color == c3.color) ? true : false
      if (shapeOk && countOk && shadingOk && colorOk) {
        setMatches([...matches, [...selected]])
        setSelected([])
        draw(3)
      }
      else {
        setError("That's not a match!")
      }
    }
  }, [selected])







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

  return (
    <div>
      <Board onBoard={onBoard} deck={deck} selected={selected} setSelected={setSelected} />
    </div>
  )



}

export default Game;