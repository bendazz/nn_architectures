/* Simple Neural Network Visualization (One Input -> One Output)
   Animation: A traveler dot moves from input node to output node along the edge.
   No numeric values are shown; conceptual only.
*/
(function() {
  const sendBtn = document.getElementById('sendBtn');
  const traveler = document.getElementById('traveler');
  const connection = document.getElementById('connection');

  // Extract line endpoints (kept for reference) and node centers
  const x1 = parseFloat(connection.getAttribute('x1'));
  const y1 = parseFloat(connection.getAttribute('y1'));
  const x2 = parseFloat(connection.getAttribute('x2'));
  const y2 = parseFloat(connection.getAttribute('y2'));

  const inputNode = document.getElementById('inputNode');
  const outputNode = document.getElementById('outputNode');
  const inCx = parseFloat(inputNode.getAttribute('cx'));
  const inCy = parseFloat(inputNode.getAttribute('cy'));
  const outCx = parseFloat(outputNode.getAttribute('cx'));
  const outCy = parseFloat(outputNode.getAttribute('cy'));

  // SVG viewBox to compute panel edges (so traveler enters from left edge and exits right edge)
  const svg = document.getElementById('network');
  const vb = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal : { x: 0, y: 0, width: 600, height: 200 };
  const edgePadding = 30; // how far outside the panel the dot starts/ends
  const startX = vb.x - edgePadding;
  const endX = vb.x + vb.width + edgePadding;

  let animating = false;

  function animateTraveler() {
    if (animating) return;
    animating = true;
    sendBtn.disabled = true;

    traveler.setAttribute('visibility', 'visible');
    // Start off the left edge of the panel (aligned vertically to input node center)
    traveler.setAttribute('cx', String(startX));
    traveler.setAttribute('cy', String(inCy));

    const approachDuration = 600; // ms: from left edge into input node center
    const pauseInDuration = 300; // ms: pause at input node center
    const travelDuration = 1200; // ms: travel from input center to output center
    const pauseOutDuration = 300; // ms: pause at output node center
    const exitDuration = 600; // ms: exit to right edge

    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;

      if (elapsed < approachDuration) {
        // Phase 1: Move from left panel edge into the input node center
        const p = elapsed / approachDuration;
        const cx = startX + p * (inCx - startX);
        traveler.setAttribute('cx', String(cx));
        traveler.setAttribute('cy', String(inCy));
      } else if (elapsed < approachDuration + pauseInDuration) {
        // Phase 1b: Pause at input center
        traveler.setAttribute('cx', String(inCx));
        traveler.setAttribute('cy', String(inCy));
      } else if (elapsed < approachDuration + pauseInDuration + travelDuration) {
        // Phase 2: Travel from input node center to output node center
        const travelElapsed = elapsed - approachDuration - pauseInDuration;
        const p = travelElapsed / travelDuration;
        // Apply easing (smooth in/out)
        const eased = easeInOutQuad(p);
        const cx = inCx + (outCx - inCx) * eased;
        const cy = inCy + (outCy - inCy) * eased;
        traveler.setAttribute('cx', String(cx));
        traveler.setAttribute('cy', String(cy));
      } else if (elapsed < approachDuration + pauseInDuration + travelDuration + pauseOutDuration) {
        // Phase 2b: Pause at output center
        traveler.setAttribute('cx', String(outCx));
        traveler.setAttribute('cy', String(outCy));
      } else if (elapsed < approachDuration + pauseInDuration + travelDuration + pauseOutDuration + exitDuration) {
        // Phase 3: Exit beyond output node (toward right panel edge)
        const exitElapsed = elapsed - approachDuration - pauseInDuration - travelDuration - pauseOutDuration;
        const p = exitElapsed / exitDuration;
        const cx = outCx + p * (endX - outCx); // move from output center to right panel edge
        traveler.setAttribute('cx', String(cx));
        traveler.setAttribute('cy', String(outCy));
      } else {
        // End
        traveler.setAttribute('visibility', 'hidden');
        animating = false;
        sendBtn.disabled = false;
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  sendBtn.addEventListener('click', animateTraveler);
})();
