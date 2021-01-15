import React from "react";

import Card from "./card";

import {CardInter} from "../types";

type BoardProps = {
  deck: CardInter[],
}

const Instructions = ({deck}: BoardProps) => {
  
  return(
    <div className="instructions">
      <h1 className="title">Instructions</h1>
      <p>The object of Match Game is to find matches of 3 cards until there are no more matches left. Each card is unique and has 4 features: color, shape, amount, and shading</p>
      <p>Each of these features has 3 possible options. A Match is 3 cards where each feature is either all the same or all different.</p>
      <p>Possible colors:</p>
      <p>Possible shapes:</p>
      <p>Possible shading:</p>
      <p>Possible amounts:</p>
    </div>
  )

}
export default Instructions;