(function() {
  const sendBtn = document.getElementById('sendBtnLog2');
  const travBias = document.getElementById('travLog2Bias');
  const trav1 = document.getElementById('travLog2In1');
  const trav2 = document.getElementById('travLog2In2');
  const travMerged = document.getElementById('travLog2Merged');

  const biasNode = document.getElementById('log2Bias');
  const input1 = document.getElementById('log2Input1');
  const input2 = document.getElementById('log2Input2');
  const output = document.getElementById('log2Output');

  const svg = document.getElementById('network-log2');
  const vb = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal : { x:0, y:0, width:600, height:220 };
  const edgePadding = 30;
  const startX = vb.x - edgePadding;
  const endX = vb.x + vb.width + edgePadding;

  const bias_CX = parseFloat(biasNode.getAttribute('cx'));
  const bias_CY = parseFloat(biasNode.getAttribute('cy'));
  const in1_CX = parseFloat(input1.getAttribute('cx'));
  const in1_CY = parseFloat(input1.getAttribute('cy'));
  const in2_CX = parseFloat(input2.getAttribute('cx'));
  const in2_CY = parseFloat(input2.getAttribute('cy'));
  const out_CX = parseFloat(output.getAttribute('cx'));
  const out_CY = parseFloat(output.getAttribute('cy'));

  // flash timing constants (keep in sync with CSS keyframes)
  const flashCycle = 480; // ms per keyframe cycle
  const flashRepeats = 2; // number of times the keyframes run
  const flashDuration = flashCycle * flashRepeats;

  let animating = false;

  function easeInOutQuad(t) { return t < 0.5 ? 2*t*t : -1 + (4-2*t)*t; }

  function flashOutput() {
    output.classList.add('flash');
    setTimeout(() => output.classList.remove('flash'), flashDuration);
  }

  function animate() {
    if (animating) return;
    animating = true;
    sendBtn.disabled = true;

    travBias.setAttribute('visibility','visible');
    trav1.setAttribute('visibility','visible');
    trav2.setAttribute('visibility','visible');
    travMerged.setAttribute('visibility','hidden');

    travBias.setAttribute('cx', String(startX)); travBias.setAttribute('cy', String(bias_CY));
    trav1.setAttribute('cx', String(startX)); trav1.setAttribute('cy', String(in1_CY));
    trav2.setAttribute('cx', String(startX)); trav2.setAttribute('cy', String(in2_CY));

    const approach = 600;
    const pauseIn = 300;
    const travel = 1200;
    const mergePause = flashDuration;
    const exitDur = 600;

    const t0 = performance.now();

    function frame(t) {
      const elapsed = t - t0;

      if (elapsed < approach) {
        const p = elapsed / approach;
        travBias.setAttribute('cx', String(startX + p*(bias_CX - startX)));
        trav1.setAttribute('cx', String(startX + p*(in1_CX - startX)));
        trav2.setAttribute('cx', String(startX + p*(in2_CX - startX)));
      } else if (elapsed < approach + pauseIn) {
        travBias.setAttribute('cx', String(bias_CX)); travBias.setAttribute('cy', String(bias_CY));
        trav1.setAttribute('cx', String(in1_CX)); trav1.setAttribute('cy', String(in1_CY));
        trav2.setAttribute('cx', String(in2_CX)); trav2.setAttribute('cy', String(in2_CY));
      } else if (elapsed < approach + pauseIn + travel) {
        const tTravel = elapsed - approach - pauseIn;
        const p = tTravel / travel;
        const e = easeInOutQuad(p);

        const bx = bias_CX + (out_CX - bias_CX) * e;
        const by = bias_CY + (out_CY - bias_CY) * e;
        travBias.setAttribute('cx', String(bx)); travBias.setAttribute('cy', String(by));

        const a1x = in1_CX + (out_CX - in1_CX) * e;
        const a1y = in1_CY + (out_CY - in1_CY) * e;
        trav1.setAttribute('cx', String(a1x)); trav1.setAttribute('cy', String(a1y));

        const a2x = in2_CX + (out_CX - in2_CX) * e;
        const a2y = in2_CY + (out_CY - in2_CY) * e;
        trav2.setAttribute('cx', String(a2x)); trav2.setAttribute('cy', String(a2y));

      } else if (elapsed < approach + pauseIn + travel + mergePause) {
        travBias.setAttribute('visibility','hidden');
        trav1.setAttribute('visibility','hidden');
        trav2.setAttribute('visibility','hidden');
        travMerged.setAttribute('visibility','visible');
        travMerged.setAttribute('cx', String(out_CX)); travMerged.setAttribute('cy', String(out_CY));

        if (!output.classList.contains('flash')) flashOutput();

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
