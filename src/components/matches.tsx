import React, { useState } from "react";

import Card from "./card";

import { Match } from "../types";

import "../styling/matches.scss"

type MatchesProps = {
  matches: Match[]
}

const Matches = ({ matches }: MatchesProps) => {

  return (
    <div className="matches-container">
      <h1 className="matches-title">{matches.length > 0 ? "Matches:" : "No matches found"}</h1>
      <div className="matches">
        {matches.map((match, index) => <div className="match" id={`match-${index}`}>
          {match.map(card => <div className="match-card-container"><Card card={card} rotate={true} /></div>)}
        </div>)}
      </div>
    </div>
  )
}



export default Matches;