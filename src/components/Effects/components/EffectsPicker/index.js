import React from 'react'

export const EffectsPicker = ({ effects, activeEffect, setActiveEffect }) => (
  <div>
    <div className="effects-list">
      {effects.map(({ n }, index) => (
        <button
          className={
            activeEffect === index ? 'active effect-item' : 'effect-item'
          }
          key={n}
          onClick={() => setActiveEffect(index)}
        >
          {n}
        </button>
      ))}
    </div>
  </div>
)
