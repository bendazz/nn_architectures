(function() {
  const sendBtn = document.getElementById('sendBtnAny');
  const travA = document.getElementById('travA');
  const travB = document.getElementById('travB');
  const travMerged = document.getElementById('travMerged');

  const inputA = document.getElementById('inputA');
  const inputB = document.getElementById('inputB');
  const output = document.getElementById('outputAny');
  const connA = document.getElementById('connA');
  const connB = document.getElementById('connB');

  const svg = document.getElementById('network-any');
  const vb = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal : { x:0, y:0, width:600, height:240 };
  const edgePadding = 30;
  const startX = vb.x - edgePadding;
  const endX = vb.x + vb.width + edgePadding;

  const inA_CX = parseFloat(inputA.getAttribute('cx'));
  const inA_CY = parseFloat(inputA.getAttribute('cy'));
  const inB_CX = parseFloat(inputB.getAttribute('cx'));
  const inB_CY = parseFloat(inputB.getAttribute('cy'));
  const out_CX = parseFloat(output.getAttribute('cx'));
  const out_CY = parseFloat(output.getAttribute('cy'));

  let animating = false;

  function easeInOutQuad(t) { return t < 0.5 ? 2*t*t : -1 + (4-2*t)*t; }

  function animate() {
    if (animating) return;
    animating = true;
    sendBtn.disabled = true;

    travA.setAttribute('visibility','visible');
    travB.setAttribute('visibility','visible');
    travMerged.setAttribute('visibility','hidden');

    travA.setAttribute('cx', String(startX)); travA.setAttribute('cy', String(inA_CY));
    travB.setAttribute('cx', String(startX)); travB.setAttribute('cy', String(inB_CY));

    const approach = 600;
    const pauseIn = 300;
    const travel = 1200;
    const mergePause = 250;
    const exitDur = 600;

    const t0 = performance.now();

    function frame(t) {
      const elapsed = t - t0;

      if (elapsed < approach) {
        // approach inputs
        const p = elapsed / approach;
        travA.setAttribute('cx', String(startX + p*(inA_CX - startX)));
        travA.setAttribute('cy', String(inA_CY));
        travB.setAttribute('cx', String(startX + p*(inB_CX - startX)));
        travB.setAttribute('cy', String(inB_CY));

      } else if (elapsed < approach + pauseIn) {
        // pause at input centers
        travA.setAttribute('cx', String(inA_CX)); travA.setAttribute('cy', String(inA_CY));
        travB.setAttribute('cx', String(inB_CX)); travB.setAttribute('cy', String(inB_CY));

      } else if (elapsed < approach + pauseIn + travel) {
        // travel to output center along straight lines
        const tTravel = elapsed - approach - pauseIn;
        const p = tTravel / travel;
        const e = easeInOutQuad(p);

        const ax = inA_CX + (out_CX - inA_CX) * e;
        const ay = inA_CY + (out_CY - inA_CY) * e;
        travA.setAttribute('cx', String(ax)); travA.setAttribute('cy', String(ay));

        const bx = inB_CX + (out_CX - inB_CX) * e;
        const by = inB_CY + (out_CY - inB_CY) * e;
        travB.setAttribute('cx', String(bx)); travB.setAttribute('cy', String(by));

      } else if (elapsed < approach + pauseIn + travel + mergePause) {
        // both should be at output center; hide two and show merged
        travA.setAttribute('visibility','hidden');
        travB.setAttribute('visibility','hidden');
        travMerged.setAttribute('visibility','visible');
        travMerged.setAttribute('cx', String(out_CX));
        travMerged.setAttribute('cy', String(out_CY));

      } else if (elapsed < approach + pauseIn + travel + mergePause + exitDur) {
        // exit merged traveler to right
        const tExit = elapsed - approach - pauseIn - travel - mergePause;
        const p = tExit / exitDur;
        const x = out_CX + p * (endX - out_CX);
        travMerged.setAttribute('cx', String(x)); travMerged.setAttribute('cy', String(out_CY));

      } else {
        // done
        travMerged.setAttribute('visibility','hidden');
        animating = false; sendBtn.disabled = false; return;
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  sendBtn.addEventListener('click', animate);
})();
