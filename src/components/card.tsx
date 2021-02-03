import React from "react";

import { CardInter } from "../types"

import "../styling/card.scss"

type cardProps = {
  card: CardInter,
  rotate: boolean,
  shrink?: boolean
}

const Card = ({ card, rotate=false, shrink=false }: cardProps) => {
  if (!card){
    return<div className="missing-card"></div>
  }
  const classString = `shape-${card.shape} shading-${card.shading} color-${card.color}`

  return (
    <div className={`card-wrapper ${rotate ? "rotate" : "no-rotate"} ${shrink ? "shrink" : ""}`}>
      <div className={`shape-wrapper`} >

        <div className={`${classString}`}><div className={`inner ${rotate ? "rotate" : "regular"}`}></div></div>
        {card.count > 0 ? <div className={`${classString}`}><div className={`inner ${rotate ? "rotate" : "regular"}`}></div></div> : ""}
        {card.count > 1 ? <div className={`${classString}`}><div className={`inner ${rotate ? "rotate" : "regular"}`}></div></div> : ""}
      </div>
    </div>

  )
}



export default Card;