import React, { useEffect } from "react";

import Card from "./card";

import { CardInter } from "../types";

import "../styling/instructions.scss"

type BoardProps = {
  deck: CardInter[],
}

const Instructions = ({ deck }: BoardProps) => {

  // cards to use for examples
  const colorCards: CardInter[] = [deck[0], deck[1], deck[2]]
  const shapeCards: CardInter[] = [deck[0], deck[27], deck[54]]
  const shadeCards: CardInter[] = [deck[28], deck[31], deck[34]]
  const numberCards: CardInter[] = [deck[59], deck[68], deck[77]]
  return (
    <div className="instructions">
      <h1 className="title">Instructions</h1>
      <p><span className="label">Cards:</span> All cards are unique and have 4 features: color, shape, shading, and amount. Each of these features has 3 possible options.</p>
      <p><span className="label">Objective:</span> Find matches until there are no more matches left. A Match is 3 cards where within each card feature options are either all the same or all different.</p>
      <section className="examples">
        {/* <div className="ex-cards"> */}
          <h3 className="example">Colors:</h3>
          {colorCards.map(card => <div className="card"> <Card card={card} rotate={false} /></div>)}
        {/* </div> */}
        {/* <div className="ex-cards"> */}
          <h3 className="example">Shapes:</h3>
          {shapeCards.map(card => <div className="card"> <Card card={card} rotate={false} /></div>)}
        {/* </div> */}
        {/* <div className="ex-cards"> */}
          <h3 className="example">Shading:</h3>
          {shadeCards.map(card => <div className="card"> <Card card={card} rotate={false} /></div>)}
        {/* </div> */}
        {/* <div className="ex-cards"> */}
          <h3 className="example">Amounts:</h3>
          {numberCards.map(card => <div className="card"> <Card card={card} rotate={false} /></div>)}
        {/* </div> */}
      </section>
    </div>
  )
}
export default Instructions;