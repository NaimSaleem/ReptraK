import { useRef } from 'react';
import { useLiquidAnimation } from '../hooks/useLiquidAnimation';

export function LiquidButton({ dayPercent, zoneKey, onShake }) {
  const liquidButtonRef = useRef(null);
  const liquidFillRef = useRef(null);
  const waveOneRef = useRef(null);
  const waveTwoRef = useRef(null);

  useLiquidAnimation(liquidButtonRef, liquidFillRef, waveOneRef, waveTwoRef, dayPercent, zoneKey);

  return (
    <button
      className="liquid-button"
      ref={liquidButtonRef}
      type="button"
      aria-label="Shake liquid summary"
      onClick={onShake}
    >
      <span className="liquid-button__glass">
        <span className="liquid-button__fill" ref={liquidFillRef}></span>
        <span className="liquid-button__wave liquid-button__wave--one" ref={waveOneRef}></span>
        <span className="liquid-button__wave liquid-button__wave--two" ref={waveTwoRef}></span>
        <span className="liquid-button__label">{dayPercent}%</span>
      </span>
    </button>
  );
}
