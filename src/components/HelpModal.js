import React from 'react';

const HelpModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">How to Use This Tracker</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">🎯 Getting Started</h3>
            <p>This tracker helps you transition from a Tier 3 college to HFT through LFT. Follow the phases in order, complete tasks, and track your progress.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">⏱️ Timer Feature</h3>
            <p>Use the timer to track time spent on tasks. This helps maintain consistency and measure progress.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">📊 Progress Tracking</h3>
            <p>Monitor your completion percentage, time invested, and achievements. Stay motivated by watching your progress grow.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">💡 Tips</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Complete tasks in order of difficulty</li>
              <li>Take notes for each day's learning</li>
              <li>Use the timer consistently</li>
              <li>Export your progress regularly</li>
            </ul>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default HelpModal; 