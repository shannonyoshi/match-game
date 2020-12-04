import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

import Card from "./card"

import { CardInter } from "../types";

type BoardProps = {
  deck: CardInter[],
  onBoard: number[],
  selected: CardInter[],
  setSelected: Dispatch<SetStateAction<CardInter[]>>,
  setError: Dispatch<SetStateAction<string>>

}
const Board = ({ deck, onBoard, selected, setSelected, setError }: BoardProps) => {

  // positions index value of positions indicates grid position.
  const [positions, setPositions] = useState<CardInter | null[]>(Array(15).fill(null))
  


  const toggleSelect = (cardId: number) => {
    const isSelected = checkSelected(cardId)
    switch (isSelected) {
      case true:
        for (let i = 0; i < selected.length; i++) {
          if (selected[i].id === cardId) {
            let copy = selected
            copy.splice(i, 1)
            setSelected([...copy])
            return
          }
        }
        break;
      case false:
        setSelected([...selected, deck[cardId - 1]])
    }
  }


  // checkSelected() returns true if card is in selected list
  const checkSelected = (cardId: number): boolean => {
    for (let i = 0; i < selected.length; i++) {
      if (selected[i].id === cardId) {
        return true
      }
    }
    return false
  }

  console.log('RENDER selected', selected)
  return (
    <div className="board-wrapper">

      <h1>Board</h1>
      {onBoard.map(cardId => <button className={`card-btn ${checkSelected(cardId) ? "selected" : ""}`} onClick={() => toggleSelect(cardId)} key={`cardId-${cardId}`}>{checkSelected(cardId) ? "selected" : "not selected"}<Card card={deck[cardId - 1]} /></button>)}
      <div className="card-container">

      </div>
    </div>
  )

}
export default Board;