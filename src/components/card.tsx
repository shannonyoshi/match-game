import React from "react";

import { CardInter } from "../types"

import "../styling/card.scss"

type cardProps = {
  card: CardInter
}

const Card = ({ card }: cardProps) => {
  const classString = `shape-${card.shape} shading-${card.shading} color-${card.color}`

  return (
    <div className="card-wrapper">
      <div className={`item1 ${classString}`}><div className="inner"></div></div>
      {card.count > 0 ? <div className={`item2 ${classString}`}><div className="inner"></div></div> : ""}
      {card.count > 1 ? <div className={`item3 ${classString}`}><div className="inner"></div></div> : ""}
    </div>

  )
}



export default Card;