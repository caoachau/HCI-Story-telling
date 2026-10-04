import React from 'react';

/** Keep one continuous accessible title; animate whole Vietnamese words. */
export function MotionWords({ children }: { children: string }) {
  return <span className="cc-motion-words">
    <span className="cc-sr-only">{children}</span>
    <span aria-hidden="true">{children.split(/\s+/).map((word, index) =>
      <React.Fragment key={index}><span className="cc-motion-word-window"><span className="cc-motion-word" style={{ '--cc-word-index': index } as React.CSSProperties}>{word}</span></span>{' '}</React.Fragment>
    )}</span>
  </span>;
}
