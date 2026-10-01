// src/components/polls/PollCard.jsx
import { Icon } from "@iconify/react";

export default function PollCard() {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 flex gap-3">
      
      {/* Icon box */}
      <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
        <Icon icon="twemoji:party-popper" width={24} height={24} />
      </div>

      {/* Everything else */}
      <div className="flex-1">
        
        {/* Title and time */}
        <div className="flex justify-between">
          <h3 className="font-semibold text-text-heading">
            What's the best way to spend a Friday?
          </h3>
          <span className="text-xs text-muted">Ends in 3 hours</span>
        </div>

        {/* Option pills */}
        <div className="mt-3 flex flex-col gap-2">
          <div className="px-4 py-2 rounded-full bg-surface text-sm">Go clubbing</div>
          <div className="px-4 py-2 rounded-full bg-surface text-sm">Netflix and chill</div>
          <div className="px-4 py-2 rounded-full bg-surface text-sm">Sleep throughout</div>
        </div>

        {/* Votes and button */}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-muted">1,200 votes</span>
          <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold">
            View More →
          </button>
        </div>

      </div>
    </div>
  );
}