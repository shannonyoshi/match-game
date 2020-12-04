import React from "react";

import {CardInter} from "../types"

type cardProps = {
  card: CardInter
}

const Card=({card}:cardProps)=> {
return (
  <div className="card-wrapper"></div>
)
}

export default Card;