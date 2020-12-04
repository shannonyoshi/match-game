import React from "react";

import { CardInter } from "../types"

type cardProps = {
  card: CardInter
}

const Card = ({ card }: cardProps) => {
  const classString = `shape-${card.shape} shading-${card.shading} color-${card.color}`

    return (
      <div className="card-wrapper">
        <div className={`item1 ${classString}`}><p>{classString}</p></div>
        {card.count>0?<div className={`item2 ${classString}`}><p>{classString}</p></div>:""}
        {card.count>1?<div className={`item3 ${classString}`}><p>{classString}</p></div>:""}
      </div>
    )
  }



export default Card;