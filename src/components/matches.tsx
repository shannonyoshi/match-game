import React from "react";

import Card from "./card";

import { Match } from "../types";

import "../styling/matches.scss"

type MatchesProps = {
  matches: Match[]
}

const Matches = ({ matches }: MatchesProps) => {


  return (
      <div className="matches-container">
        <h1>Matches Found:</h1>
    <div className="matches">
      {matches.map((match,index) => <div className="match" id={`match-${index}`}>
        {match.map(card => <div className="match-card-container"><Card card={card} /></div>)}
      </div>)}
    </div>

    </div>
  )
}
export default Matches;