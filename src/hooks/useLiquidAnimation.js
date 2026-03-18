import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ZONES } from '../lib/reptrak';

export function useLiquidAnimation(liquidButtonRef, liquidFillRef, waveOneRef, waveTwoRef, dayPercent, zoneKey) {
  useEffect(() => {
    const liquidButton = liquidButtonRef.current;
    const liquidFill = liquidFillRef.current;
    const waveOne = waveOneRef.current;
    const waveTwo = waveTwoRef.current;

    if (!liquidButton || !liquidFill || !waveOne || !waveTwo) return;

    const shift = Math.min(Math.max(100 - dayPercent, 0), 100);
    liquidButton.style.setProperty('--liquid-color', ZONES[zoneKey].gradient);

    gsap.to(liquidFill, {
      yPercent: shift,
      duration: 1.05,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    if (!waveOne.dataset.looping) {
      waveOne.dataset.looping = 'true';
      gsap.to(waveOne, {
        rotation: 360,
        duration: 7.5,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%'
      });
    }

    if (!waveTwo.dataset.looping) {
      waveTwo.dataset.looping = 'true';
      gsap.to(waveTwo, {
        rotation: -360,
        duration: 10.5,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%'
      });
    }
  }, [dayPercent, zoneKey]);
}
