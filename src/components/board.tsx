import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

import Card from "./card"

import { CardInter } from "../types";

type BoardProps = {
  onBoard: (CardInter|null)[],
  selected: number[],
  setSelected: Dispatch<SetStateAction<number[]>>,
  setError: Dispatch<SetStateAction<string>>,
  extendBoard:()=>void

}
const Board = ({ onBoard, selected, setSelected, setError, extendBoard }: BoardProps) => {

  const toggleSelect = (cardId: number) :void=> {
    const isSelected = selected.includes(cardId)
    switch (isSelected) {
      case true:
        for (let i = 0; i < selected.length; i++) {
          if (selected[i] === cardId) {
            let copy = selected
            copy.splice(i, 1)
            setSelected([...copy])
            return
          }
        }
        break;
      case false:
        if (selected.length===3){
          setError("cannot select more than three cards")
          return
        }
        setSelected([...selected, cardId])
    }
  }

  return (
    <div className="board-wrapper">

      <h1>Board</h1>
      {onBoard.map(card => card===null?"":
      <button className={`card-btn ${selected.includes(card.id) ? "selected" : ""}`} onClick={() => toggleSelect(card.id)} key={`cardId-${card.id}`}>{selected.includes(card.id) ? "selected" : "not selected"}<Card card={card} /></button>)}
      <button onClick={extendBoard}>Add 3 cards</button>
      <div className="card-container">
      </div>
    </div>
  )

}
export default Board;