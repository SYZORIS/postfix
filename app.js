/**
 * POSTFIX — Minimalist, Ultra-Fast SaaS Hero Landing Page
 * GSAP 3 Powered Keynote Entrance + Smooth 60fps Magnetic Cursor Engine
 */

(function () {
  'use strict';

  // --- Feature Detection & Safeguards ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  // --- DOM Elements ---
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtext = document.getElementById('heroSubtext');
  const heroStage = document.getElementById('heroStage');
  const heroTiltTarget = document.getElementById('heroTiltTarget');
  const hudTop = document.querySelector('.hud-top');
  const hudBottom = document.querySelector('.hud-bottom');
  const timecodeDisplay = document.getElementById('timecodeDisplay');
  const coordsDisplay = document.getElementById('coordsDisplay');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const ambientSheen = document.querySelector('.ambient-sheen');

  /**
   * 1. Character Splitting Engine
   * Splits headline into individual characters wrapped in overflow:hidden masks
   * Preserves spaces and supports easily toggling between "POSTFIX" and "FIXED POST"
   */
  function splitTextToMaskedChars(element) {
    if (!element) return [];

    const rawText = (element.getAttribute('data-text') || element.textContent || '').trim();
    element.innerHTML = '';

    const charElements = [];
    const words = rawText.split(' ');

    words.forEach((word, wordIndex) => {
      const wordContainer = document.createElement('span');
      wordContainer.style.display = 'inline-flex';
      wordContainer.style.alignItems = 'center';

      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const mask = document.createElement('span');
        mask.className = 'char-mask';

        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        charSpan.textContent = char;

        mask.appendChild(charSpan);
        wordContainer.appendChild(mask);
        charElements.push(charSpan);
      }

      element.appendChild(wordContainer);

      // Add space between words if not last word
      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'char-space';
        spaceSpan.innerHTML = '&nbsp;';
        element.appendChild(spaceSpan);
      }
    });

    return charElements;
  }

  const chars = splitTextToMaskedChars(heroTitle);

  /**
   * 2. GSAP Entrance Timeline (Sub-1.1s Snappy Keynote Precision)
   */
  function runEntranceAnimation() {
    if (prefersReducedMotion || typeof gsap === 'undefined') {
      if (chars.length) gsap?.set(chars, { y: '0%', opacity: 1 });
      if (heroSubtext) gsap?.set(heroSubtext, { y: 0, opacity: 1, letterSpacing: '0.22em' });
      if (hudTop) gsap?.set(hudTop, { opacity: 1 });
      if (hudBottom) gsap?.set(hudBottom, { opacity: 1 });
      return;
    }

    // Snappy custom Apple-style ease
    const keynoteEase = 'power4.out';

    const tl = gsap.timeline({
      defaults: { ease: keynoteEase }
    });

    // Main title: each letter slides up from its hidden mask
    tl.fromTo(
      chars,
      {
        y: '115%',
        opacity: 0.15
      },
      {
        y: '0%',
        opacity: 1,
        duration: 0.72,
        stagger: 0.035, // 0.035s tight stagger
        ease: 'power4.out'
      },
      0.08
    );

    // Subtext: smooth fade-slide with subtle letter-spacing expansion
    tl.fromTo(
      heroSubtext,
      {
        opacity: 0,
        y: 14,
        letterSpacing: '0.14em'
      },
      {
        opacity: 1,
        y: 0,
        letterSpacing: '0.22em',
        duration: 0.62,
        ease: 'power3.out'
      },
      0.38 // Overlaps as headline finishes settling
    );

    // Subtle video-timeline HUD accents fade in quietly
    tl.to(
      [hudTop, hudBottom],
      {
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out'
      },
      0.45
    );
  }

  /**
   * 3. Video-Timeline Micro-Polish (Live 24fps Timecode)
   */
  let frameCount = 24; // start at 00:00:01:00
  let lastTime = performance.now();

  function updateTimecode(currentTime) {
    if (currentTime - lastTime >= 1000 / 24) {
      frameCount++;
      lastTime = currentTime;

      const fps = 24;
      const totalSeconds = Math.floor(frameCount / fps);
      const frames = frameCount % fps;
      const seconds = totalSeconds % 60;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const hours = Math.floor(totalSeconds / 3600);

      const pad = (n) => String(n).padStart(2, '0');
      if (timecodeDisplay) {
        timecodeDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
      }
    }
    requestAnimationFrame(updateTimecode);
  }
  requestAnimationFrame(updateTimecode);

  /**
   * 4. Interactive Magnetic Cursor Engine & Ambient Sheen
   */
  if (!isTouchDevice && !prefersReducedMotion) {
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { x: mouse.x, y: mouse.y };
    let dotPos = { x: mouse.x, y: mouse.y };
    let currentVel = 0;
    let isHoveringHeadline = false;

    // Magnetic 3D tilt tracking
    let tilt = { x: 0, y: 0, targetX: 0, targetY: 0, targetZ: 0 };
    let tiltLerpFactor = 0.12;

    // Show custom cursor once pointer enters window
    window.addEventListener('mousemove', (e) => {
      document.body.classList.add('cursor-active');
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Coordinate HUD readout
      if (coordsDisplay) {
        const xFormatted = String(Math.round(mouse.x)).padStart(4, '0');
        const yFormatted = String(Math.round(mouse.y)).padStart(4, '0');
        coordsDisplay.textContent = `X: ${xFormatted}  Y: ${yFormatted}`;
      }

      // Check proximity to hero title
      if (heroTiltTarget) {
        const rect = heroTiltTarget.getBoundingClientRect();
        const padding = 60; // Proximity threshold
        const isNear =
          mouse.x >= rect.left - padding &&
          mouse.x <= rect.right + padding &&
          mouse.y >= rect.top - padding &&
          mouse.y <= rect.bottom + padding;

        if (isNear) {
          if (!isHoveringHeadline) {
            isHoveringHeadline = true;
            document.body.classList.add('is-hovering-hero');
          }

          // Calculate normalized coordinates (-1 to +1) from headline center
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const normX = (mouse.x - centerX) / (rect.width / 2);
          const normY = (mouse.y - centerY) / (rect.height / 2);

          // Subtle 3D magnetic tilt (clamped to subtle micro-degrees)
          tilt.targetY = normX * 8.5; // rotateY
          tilt.targetX = -normY * 8.5; // rotateX
          tilt.targetZ = 12; // slight forward push
        } else {
          if (isHoveringHeadline) {
            isHoveringHeadline = false;
            document.body.classList.remove('is-hovering-hero');
          }
          tilt.targetX = 0;
          tilt.targetY = 0;
          tilt.targetZ = 0;
        }
      }
    });

    window.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
      document.body.classList.remove('is-hovering-hero');
      isHoveringHeadline = false;
      tilt.targetX = 0;
      tilt.targetY = 0;
      tilt.targetZ = 0;
    });

    // 60fps RequestAnimationFrame Glide Loop (Linear Interpolation)
    function renderLoop() {
      // Smooth linear interpolation for ring
      const ringLerp = isHoveringHeadline ? 0.22 : 0.16;
      ringPos.x += (mouse.x - ringPos.x) * ringLerp;
      ringPos.y += (mouse.y - ringPos.y) * ringLerp;

      // Ultra-low latency interpolation for central dot
      dotPos.x += (mouse.x - dotPos.x) * 0.75;
      dotPos.y += (mouse.y - dotPos.y) * 0.75;

      // Velocity calculation for dynamic ring deformation
      const dx = mouse.x - ringPos.x;
      const dy = mouse.y - ringPos.y;
      const dist = Math.hypot(dx, dy);
      currentVel += (dist - currentVel) * 0.15;

      // Dynamic velocity scale (slight stretch/expansion on fast sweep)
      const velScale = Math.min(Math.max(1, 1 + currentVel * 0.0035), 1.35);

      // Apply positions
      if (cursorDot) {
        cursorDot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
      }

      if (cursorRing) {
        cursorRing.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) scale(${velScale})`;
      }

      // Update ambient background light sheen coordinates
      document.documentElement.style.setProperty('--mouse-x', `${ringPos.x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${ringPos.y}px`);

      // Smooth 3D tilt dampening on headline
      if (heroTiltTarget) {
        tilt.x += (tilt.targetX - tilt.x) * tiltLerpFactor;
        tilt.y += (tilt.targetY - tilt.y) * tiltLerpFactor;

        heroTiltTarget.style.transform = `
          perspective(1000px)
          rotateX(${tilt.x.toFixed(2)}deg)
          rotateY(${tilt.y.toFixed(2)}deg)
          translateZ(${isHoveringHeadline ? '12px' : '0px'})
        `;
      }

      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
  }

  // --- Initial Trigger on DOM Ready ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEntranceAnimation);
  } else {
    runEntranceAnimation();
  }

})();
