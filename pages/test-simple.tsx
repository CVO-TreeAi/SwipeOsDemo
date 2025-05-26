import React, { useState } from 'react';

interface CardData {
  id: string;
  type: string;
  component: React.ReactNode;
  position: number;
}

export default function TestSimplePage() {
  const [cards] = useState<CardData[]>([
    {
      id: 'test-1',
      type: 'test',
      position: 0,
      component: (
        <div className="p-6 h-full flex flex-col bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">Test Card 1</h2>
          <p className="text-lg">This is a simple test card.</p>
        </div>
      ),
    },
    {
      id: 'test-2',
      type: 'test',
      position: 1,
      component: (
        <div className="p-6 h-full flex flex-col bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">Test Card 2</h2>
          <p className="text-lg">Another test card.</p>
        </div>
      ),
    },
  ]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-purple-900/10 to-black">
      <div className="h-full flex flex-col">
        <div className="text-center mb-6 px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Simple Test</h1>
          <p className="text-gray-300">
            {cards.length} cards • Testing
          </p>
        </div>
        
        <div className="flex-1 relative">
          <div className="h-full overflow-y-auto px-8 pb-8">
            <div className="space-y-8">
              {cards.map((card) => (
                <div key={card.id} className="h-[400px]">
                  {card.component}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 