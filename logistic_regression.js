(function() {
  const sendBtn = document.getElementById('sendBtnLog');
  const travBias = document.getElementById('travLogBias');
  const travIn = document.getElementById('travLogIn');
  const travMerged = document.getElementById('travLogMerged');

  const biasNode = document.getElementById('logBias');
  const inputNode = document.getElementById('logInput');
  const outputNode = document.getElementById('logOutput');

  const svg = document.getElementById('network-log');
  const vb = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal : { x:0, y:0, width:600, height:180 };
  const edgePadding = 30;
  const startX = vb.x - edgePadding;
  const endX = vb.x + vb.width + edgePadding;

  const bias_CX = parseFloat(biasNode.getAttribute('cx'));
  const bias_CY = parseFloat(biasNode.getAttribute('cy'));
  const in_CX = parseFloat(inputNode.getAttribute('cx'));
  const in_CY = parseFloat(inputNode.getAttribute('cy'));
  const out_CX = parseFloat(outputNode.getAttribute('cx'));
  const out_CY = parseFloat(outputNode.getAttribute('cy'));

  let animating = false;

  function easeInOutQuad(t) { return t < 0.5 ? 2*t*t : -1 + (4-2*t)*t; }

  // flash timing constants (keep in sync with CSS keyframes)
  const flashCycle = 480; // ms per keyframe cycle
  const flashRepeats = 2; // number of times the keyframes run
  const flashDuration = flashCycle * flashRepeats;

  function flashOutput() {
    // add flash class to output node, remove after animation
    outputNode.classList.add('flash');
    setTimeout(() => outputNode.classList.remove('flash'), flashDuration);
  }

  function animate() {
    if (animating) return;
    animating = true;
    sendBtn.disabled = true;

    travBias.setAttribute('visibility','visible');
    travIn.setAttribute('visibility','visible');
    travMerged.setAttribute('visibility','hidden');

    travBias.setAttribute('cx', String(startX)); travBias.setAttribute('cy', String(bias_CY));
    travIn.setAttribute('cx', String(startX)); travIn.setAttribute('cy', String(in_CY));

    const approach = 500;
    const pauseIn = 300;
    const travel = 1000;
    const mergePause = flashDuration; // wait at output while flashing
    const exitDur = 600;

    const t0 = performance.now();

    function frame(t) {
      const elapsed = t - t0;

      if (elapsed < approach) {
        const p = elapsed / approach;
        travBias.setAttribute('cx', String(startX + p*(bias_CX - startX)));
        travIn.setAttribute('cx', String(startX + p*(in_CX - startX)));
      } else if (elapsed < approach + pauseIn) {
        travBias.setAttribute('cx', String(bias_CX)); travBias.setAttribute('cy', String(bias_CY));
        travIn.setAttribute('cx', String(in_CX)); travIn.setAttribute('cy', String(in_CY));
      } else if (elapsed < approach + pauseIn + travel) {
        const tTravel = elapsed - approach - pauseIn;
        const p = tTravel / travel;
        const e = easeInOutQuad(p);

        const bx = bias_CX + (out_CX - bias_CX) * e;
        const by = bias_CY + (out_CY - bias_CY) * e;
        travBias.setAttribute('cx', String(bx)); travBias.setAttribute('cy', String(by));

        const ix = in_CX + (out_CX - in_CX) * e;
        const iy = in_CY + (out_CY - in_CY) * e;
        travIn.setAttribute('cx', String(ix)); travIn.setAttribute('cy', String(iy));

      } else if (elapsed < approach + pauseIn + travel + mergePause) {
        // At output center: hide the two travelers and show merged. Trigger flash once.
        travBias.setAttribute('visibility','hidden');
        travIn.setAttribute('visibility','hidden');
        travMerged.setAttribute('visibility','visible');
        travMerged.setAttribute('cx', String(out_CX)); travMerged.setAttribute('cy', String(out_CY));

        // start flash at the beginning of merge pause
        if (!outputNode.classList.contains('flash')) flashOutput();

      } else if (elapsed < approach + pauseIn + travel + mergePause + exitDur) {
        const tExit = elapsed - approach - pauseIn - travel - mergePause;
        const p = tExit / exitDur;
        const x = out_CX + p * (endX - out_CX);
        travMerged.setAttribute('cx', String(x)); travMerged.setAttribute('cy', String(out_CY));
      } else {
        travMerged.setAttribute('visibility','hidden');
        animating = false; sendBtn.disabled = false; return;
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  sendBtn.addEventListener('click', animate);
})();
