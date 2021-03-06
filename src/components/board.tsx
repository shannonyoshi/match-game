import React, { Dispatch, SetStateAction } from "react";

import "../styling/board.scss";

import Card from "./card";

import { CardInter } from "../types";

type BoardProps = {
  onBoard: (CardInter | null)[],
  selected: number[],
  setSelected: Dispatch<SetStateAction<number[]>>,
  setMessage: Dispatch<SetStateAction<string>>,
  extendBoard: () => void,
  hintHandler: () => void,
  showHint: boolean,

}
const Board = ({ onBoard, selected, setSelected, setMessage, extendBoard, hintHandler, showHint }: BoardProps): JSX.Element => {

  const toggleSelect = (cardId: number): void => {
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
        if (selected.length === 3) {
          setMessage("You can only select three cards at a time")
          return
        }
        setSelected([...selected, cardId])
    }
  }
  let extended: boolean = onBoard.length > 12 ? true : false
  let twice: boolean = onBoard.length > 15 ? true : false

  return (
    <>
      <div className="board-wrapper">
        <div className={`card-container ${extended ? twice ? "extended-twice" : "extended" : ""}`}>
          {onBoard.map(card => card === null || card === undefined ? "" :
            <button className={`card-btn ${selected.includes(card!.id) ? "selected" : ""} ${extended ? twice ? "extended-twice" : "extended" : ""}`} onClick={() => toggleSelect(card.id)} key={`cardId-${card.id}`}><Card card={card} rotate={extended} shrink={twice} /></button>)}
        </div>
      </div>
      <div className="action-buttons">
        <button onClick={extendBoard} className="add-cards">Add 3 cards</button>
        <button onClick={hintHandler} className="hint-btn">{`${showHint ? "Hide" : "Show"} Hint`}</button>
      </div>
    </>
  )

}
export default Board;