import React, { useState, Dispatch, SetStateAction } from "react";

import { Card } from "../types";

type BoardProps = {
  deck:Card[],
  onBoard:number[],
  selected: Card[],
  setSelected:Dispatch<SetStateAction<Card[]>>
}
const Board = ({deck, onBoard, selected, setSelected}: BoardProps) => {
  
  // positions index value of positions indicates grid position.
  const [positions, setPositions] = useState<Card|null[]>(Array(15).fill(null))
  



  return (
    <div className="board-wrapper">

      <h1>Board</h1>
      <div className="card-container">

      </div>
    </div>
  )

}
export default Board;