import React, { useState, Dispatch, SetStateAction } from "react";

import { CardInter } from "../types";

type BoardProps = {
  deck:CardInter[],
  onBoard:number[],
  selected: CardInter[],
  setSelected:Dispatch<SetStateAction<CardInter[]>>
}
const Board = ({deck, onBoard, selected, setSelected}: BoardProps) => {
  
  // positions index value of positions indicates grid position.
  const [positions, setPositions] = useState<CardInter|null[]>(Array(15).fill(null))
  



  return (
    <div className="board-wrapper">

      <h1>Board</h1>
      {onBoard.map(card=><)}
      <div className="card-container">

      </div>
    </div>
  )

}
export default Board;