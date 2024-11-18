import React from 'react';

function MoveHistory({ history }) {
  const movePairs = [];

  // Splitting the history into pairs of [whiteMove, blackMove]
  for (let i = 0; i < history.length; i += 2) {
    const whiteMove = history[i];
    const blackMove = history[i + 1] || '';
    movePairs.push({ moveNumber: (i / 2) + 1, white: whiteMove, black: blackMove });
  }

  return (
    <div className="move-history">
      <h2>Move History</h2>
      <ol>
        {movePairs.map((pair) => (
          <li key={pair.moveNumber}>
            <strong>{pair.moveNumber}.</strong> {pair.white} {pair.black}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default MoveHistory;