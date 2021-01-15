import React, { useState } from "react";

import Card from "./card";

import { Match } from "../types";

import "../styling/matches.scss"

type MatchesProps = {
  matches: Match[]
}

const Matches = ({ matches }: MatchesProps) => {
  const [show, setShow] = useState<boolean>(false)

  return (
    <div className="matches-container">
      {show ?
        <>
          <h1 className="matches-title">Matches Found:</h1>
          <button onClick={()=>setShow(false)}>Hide Matches</button>
          <div className="matches">
            {matches.map((match, index) => <div className="match" id={`match-${index}`}>
              {match.map(card => <div className="match-card-container"><Card card={card} /></div>)}
            </div>)}
          </div>
        </> : <button onClick={()=>setShow(true)}>Show Matches</button>}

    </div>
  )
}



export default Matches;