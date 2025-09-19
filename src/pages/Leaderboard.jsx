import React from "react";

export default function Leaderboard() {
  return (
    <div className="page leaderboardPage">
      <div className="comingSoonWrap">
        <div className="comingBadge">
          <span className="badgeIcon">🏆</span>
          <span>Rank</span>
        </div>
        <h1 className="comingSoonText">
          <span className="comingWord">Coming</span>
          <span className="comingWord">soon</span>
        </h1>
        <p className="comingSoonSub">We are crafting a community leaderboard experience.</p>
        <div className="animationContainer">
          <div className="dotPulse" aria-label="loading" />
          <div className="dotPulse delay1" aria-label="loading" />
          <div className="dotPulse delay2" aria-label="loading" />
        </div>
        <div className="progressBar">
          <div className="progressFill"></div>
        </div>
      </div>
    </div>
  );
}