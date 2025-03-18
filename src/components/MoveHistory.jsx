import React from 'react';

function MoveHistory({ history, onResign, onDrawRequest, gameOver }) {
  // Group moves by pairs (white and black)
  const groupedMoves = [];
  for (let i = 0; i < history.length; i += 2) {
    groupedMoves.push({
      number: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1] || null
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
        Move History
      </h2>
      <div
        className="max-h-[60vh] overflow-y-auto mb-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #EDF2F7',
        }}
      >
        <div className="space-y-2">
          {groupedMoves.map((moveGroup) => (
            <div
              key={moveGroup.number}
              className="flex items-center px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="text-gray-500 font-medium min-w-[2rem]">
                {moveGroup.number}.
              </span>
              <div className="grid grid-cols-2 gap-2 flex-grow">
                {/* White's move */}
                <div className="flex items-center space-x-2">
                  <span
                    className="inline-block w-3 h-3 rounded-sm bg-white border border-gray-400"
                  />
                  <span className="text-gray-700 font-medium">{moveGroup.white}</span>
                </div>
                
                {/* Black's move */}
                {moveGroup.black && (
                  <div className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-sm bg-gray-800"
                    />
                    <span className="text-gray-700 font-medium">{moveGroup.black}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!gameOver && (
        <div className="space-y-2">
          <button 
            onClick={onDrawRequest}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors shadow-md w-full mb-2"
          >
            Offer Draw
          </button>
          <button 
            onClick={onResign}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors shadow-md w-full"
          >
            Resign
          </button>
        </div>
      )}

      <style jsx>{`
        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: #EDF2F7;
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb {
          background-color: #CBD5E0;
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background-color: #A0AEC0;
        }
      `}</style>
    </div>
  );
}

export default MoveHistory;
