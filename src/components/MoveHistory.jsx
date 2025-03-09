import React from 'react';

function MoveHistory({ history }) {
  const getMoveNumber = (index) => Math.ceil((index + 1) / 2);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
        Move History
      </h2>
      <div
        className="max-h-[60vh] overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #EDF2F7',
        }}
      >
        <div className="space-y-2">
          {history.map((move, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="text-gray-500 font-medium min-w-[2rem]">
                {getMoveNumber(index)}.
              </span>
              <div className="flex items-center space-x-2 flex-grow">
                <span className="text-gray-700">
                  {index % 2 === 0 ? "White" : "Black"}
                </span>
                <span
                  className={`inline-block w-3 h-3 rounded-sm ${
                    index % 2 === 0
                      ? 'bg-white border border-gray-400'
                      : 'bg-gray-800'
                  }`}
                />
                <span className="text-gray-700 font-medium">{move}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
