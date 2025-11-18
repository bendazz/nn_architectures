// logistic_hidden.js
// Animation for "Logistic Regression: Hidden Layer"
// Pattern: left inputs (bias + 2) -> hidden layer (bias + H1,H2,H3) -> output
// During hidden non-bias flash, an extra traveler enters hidden bias from top.

(function(){
    const svg = document.getElementById('network-hidden');
    const sendBtn = document.getElementById('sendBtnHidden');

    // Left-side nodes
    const leftBias = document.getElementById('hidden_left_bias');
    const leftIn1 = document.getElementById('hidden_left_in1');
    const leftIn2 = document.getElementById('hidden_left_in2');

    // Hidden layer nodes
    const hBias = document.getElementById('hidden_bias');
    const h1 = document.getElementById('hidden_h1');
    const h2 = document.getElementById('hidden_h2');
    const h3 = document.getElementById('hidden_h3');

    // Output
    const output = document.getElementById('hidden_output');

    // Travelers
    const travLeftBias = document.getElementById('trav_left_bias');
    const travLeft1 = document.getElementById('trav_left_1');
    const travLeft2 = document.getElementById('trav_left_2');
    const travTopToHBias = document.getElementById('trav_top_to_hbias');

    // per-edge travelers
    const trav_lb_h1 = document.getElementById('trav_lb_h1');
    const trav_lb_h2 = document.getElementById('trav_lb_h2');
    const trav_lb_h3 = document.getElementById('trav_lb_h3');

    const trav_l1_h1 = document.getElementById('trav_l1_h1');
    const trav_l1_h2 = document.getElementById('trav_l1_h2');
    const trav_l1_h3 = document.getElementById('trav_l1_h3');

    const trav_l2_h1 = document.getElementById('trav_l2_h1');
    const trav_l2_h2 = document.getElementById('trav_l2_h2');
    const trav_l2_h3 = document.getElementById('trav_l2_h3');

    const travHBias = document.getElementById('trav_hbias');
    const travH1 = document.getElementById('trav_h1');
    const travH2 = document.getElementById('trav_h2');
    const travH3 = document.getElementById('trav_h3');
    const travHiddenMerged = document.getElementById('trav_hidden_merged');

    // Timing constants (match styles.css flash timing)
    const approachDur = 1100;
    const pauseAtInput = 700;
    const travelToHiddenDur = 1200;
    const hiddenFlashCycle = 220; // per-cycle duration in ms (matches CSS keyframes)
    const hiddenFlashRepeats = 3; // number of cycles
    const hiddenFlashDuration = hiddenFlashCycle * hiddenFlashRepeats; // total
    const pauseAfterHiddenFlash = 260;
    const hiddenToOutputDur = 1200;
    const outputFlashCycle = 220;
    const outputFlashRepeats = 3;
    const outputFlashDuration = outputFlashCycle * outputFlashRepeats;
    const exitDur = 800;

    // Helpers
    function getCenter(node){
        return { x: parseFloat(node.getAttribute('cx')), y: parseFloat(node.getAttribute('cy')) };
    }

    function easeInOutQuad(t){
        return t<0.5 ? 2*t*t : -1 + (4-2*t)*t;
    }

    function show(elem){ elem.setAttribute('visibility','visible'); }
    function hide(elem){ elem.setAttribute('visibility','hidden'); }

    function animateMove(elem, from, to, duration, cb){
        const start = performance.now();
        function step(now){
            const t = Math.min(1, (now - start)/duration);
            const e = easeInOutQuad(t);
            const cx = from.x + (to.x - from.x) * e;
            const cy = from.y + (to.y - from.y) * e;
            elem.setAttribute('cx', cx);
            elem.setAttribute('cy', cy);
            if(t < 1) requestAnimationFrame(step);
            else if(cb) cb();
        }
        requestAnimationFrame(step);
    }

    function flashNode(node, cycles, cycleMs){
        node.classList.add('flash');
        setTimeout(()=> node.classList.remove('flash'), cycles * cycleMs);
    }

    function flashOutput(){
        flashNode(output, outputFlashRepeats, outputFlashCycle);
    }

    // Main sequence triggered by button
    function runSequence(){
        // Reset visibility
        [travLeftBias, travLeft1, travLeft2, travHBias, travH1, travH2, travH3, travHiddenMerged, travTopToHBias].forEach(hide);

        // Starting positions coincide with their source nodes
        const lb = getCenter(leftBias);
        const l1 = getCenter(leftIn1);
        const l2 = getCenter(leftIn2);

        const hb = getCenter(hBias);
        const hh1 = getCenter(h1);
        const hh2 = getCenter(h2);
        const hh3 = getCenter(h3);

        const out = getCenter(output);

        // Phase 1: approach left nodes (they start already at nodes but we animate a short entrance from left edge)
        const svgBox = svg.viewBox.baseVal;
        const startX = svgBox.x - 40;

        // Set initial off-screen positions
        travLeftBias.setAttribute('cx', startX); travLeftBias.setAttribute('cy', lb.y);
        travLeft1.setAttribute('cx', startX); travLeft1.setAttribute('cy', l1.y);
        travLeft2.setAttribute('cx', startX); travLeft2.setAttribute('cy', l2.y);
        show(travLeftBias); show(travLeft1); show(travLeft2);

        let completedApproaches = 0;
        function approachDone(){
            completedApproaches++;
            if(completedApproaches === 3) afterApproach();
        }

        animateMove(travLeftBias, {x:startX,y:lb.y}, lb, approachDur, approachDone);
        animateMove(travLeft1, {x:startX,y:l1.y}, l1, approachDur+50, approachDone);
        animateMove(travLeft2, {x:startX,y:l2.y}, l2, approachDur+120, approachDone);

        // After initial pause, send travelers to their respective hidden targets
        function afterApproach(){
            setTimeout(()=>{
                // move to hidden nodes along the edges (fully connected). Each left input splits into three per-edge travelers.
                let arrivalsH1 = 0, arrivalsH2 = 0, arrivalsH3 = 0;
                function perEdgeArrived(target){
                    if(target === 1) arrivalsH1++;
                    if(target === 2) arrivalsH2++;
                    if(target === 3) arrivalsH3++;

                    // when a hidden node has received all 3 contributions, show its merged traveler
                    if(arrivalsH1 === 3) { travH1.setAttribute('cx', hh1.x); travH1.setAttribute('cy', hh1.y); show(travH1); }
                    if(arrivalsH2 === 3) { travH2.setAttribute('cx', hh2.x); travH2.setAttribute('cy', hh2.y); show(travH2); }
                    if(arrivalsH3 === 3) { travH3.setAttribute('cx', hh3.x); travH3.setAttribute('cy', hh3.y); show(travH3); }

                    // when all hidden nodes have their 3 contributions, proceed
                    if(arrivalsH1 === 3 && arrivalsH2 === 3 && arrivalsH3 === 3){
                        // All contributions arrived — flash H1,H2,H3 and spawn top traveler to hidden bias during flash
                        flashNode(h1, hiddenFlashRepeats, hiddenFlashCycle);
                        flashNode(h2, hiddenFlashRepeats, hiddenFlashCycle);
                        flashNode(h3, hiddenFlashRepeats, hiddenFlashCycle);

                        travTopToHBias.setAttribute('cx', hb.x); travTopToHBias.setAttribute('cy', -24); show(travTopToHBias);
                        animateMove(travTopToHBias, {x:hb.x, y:-24}, hb, hiddenFlashDuration - 60, ()=>{
                            travHBias.setAttribute('cx', hb.x); travHBias.setAttribute('cy', hb.y); show(travHBias);
                            hide(travTopToHBias);

                            // brief pause then proceed all hidden travelers (including the bias traveler) to output
                            setTimeout(()=>{
                                const fromHB = getCenter(hBias);
                                const from1 = getCenter(h1);
                                const from2 = getCenter(h2);
                                const from3 = getCenter(h3);

                                animateMove(travHBias, fromHB, out, hiddenToOutputDur, ()=>{});
                                animateMove(travH1, from1, out, hiddenToOutputDur+20, ()=>{});
                                animateMove(travH2, from2, out, hiddenToOutputDur+60, ()=>{});
                                animateMove(travH3, from3, out, hiddenToOutputDur+90, ()=>{
                                    setTimeout(()=>{
                                        hide(travHBias); hide(travH1); hide(travH2); hide(travH3);
                                        travHiddenMerged.setAttribute('cx', out.x); travHiddenMerged.setAttribute('cy', out.y); show(travHiddenMerged);
                                        flashOutput();

                                        setTimeout(()=>{
                                            const endX = svg.viewBox.baseVal.x + svg.viewBox.baseVal.width + 40;
                                            animateMove(travHiddenMerged, out, {x:endX, y:out.y}, exitDur, ()=>{
                                                hide(travHiddenMerged);
                                            });
                                        }, outputFlashDuration + pauseAfterHiddenFlash);
                                    }, 40);
                                });
                            }, 90);
                        });
                    }
                }

                // Launch per-edge travelers from each left node to each hidden node
                // From left bias
                trav_lb_h1.setAttribute('cx', lb.x); trav_lb_h1.setAttribute('cy', lb.y); show(trav_lb_h1);
                animateMove(trav_lb_h1, lb, hh1, travelToHiddenDur, ()=>{ hide(trav_lb_h1); perEdgeArrived(1); });
                trav_lb_h2.setAttribute('cx', lb.x); trav_lb_h2.setAttribute('cy', lb.y); show(trav_lb_h2);
                animateMove(trav_lb_h2, lb, hh2, travelToHiddenDur+20, ()=>{ hide(trav_lb_h2); perEdgeArrived(2); });
                trav_lb_h3.setAttribute('cx', lb.x); trav_lb_h3.setAttribute('cy', lb.y); show(trav_lb_h3);
                animateMove(trav_lb_h3, lb, hh3, travelToHiddenDur+40, ()=>{ hide(trav_lb_h3); perEdgeArrived(3); });

                // From left input1
                trav_l1_h1.setAttribute('cx', l1.x); trav_l1_h1.setAttribute('cy', l1.y); show(trav_l1_h1);
                animateMove(trav_l1_h1, l1, hh1, travelToHiddenDur+10, ()=>{ hide(trav_l1_h1); perEdgeArrived(1); });
                trav_l1_h2.setAttribute('cx', l1.x); trav_l1_h2.setAttribute('cy', l1.y); show(trav_l1_h2);
                animateMove(trav_l1_h2, l1, hh2, travelToHiddenDur+30, ()=>{ hide(trav_l1_h2); perEdgeArrived(2); });
                trav_l1_h3.setAttribute('cx', l1.x); trav_l1_h3.setAttribute('cy', l1.y); show(trav_l1_h3);
                animateMove(trav_l1_h3, l1, hh3, travelToHiddenDur+50, ()=>{ hide(trav_l1_h3); perEdgeArrived(3); });

                // From left input2
                trav_l2_h1.setAttribute('cx', l2.x); trav_l2_h1.setAttribute('cy', l2.y); show(trav_l2_h1);
                animateMove(trav_l2_h1, l2, hh1, travelToHiddenDur+20, ()=>{ hide(trav_l2_h1); perEdgeArrived(1); });
                trav_l2_h2.setAttribute('cx', l2.x); trav_l2_h2.setAttribute('cy', l2.y); show(trav_l2_h2);
                animateMove(trav_l2_h2, l2, hh2, travelToHiddenDur+40, ()=>{ hide(trav_l2_h2); perEdgeArrived(2); });
                trav_l2_h3.setAttribute('cx', l2.x); trav_l2_h3.setAttribute('cy', l2.y); show(trav_l2_h3);
                animateMove(trav_l2_h3, l2, hh3, travelToHiddenDur+60, ()=>{ hide(trav_l2_h3); perEdgeArrived(3); });

            }, 140);
        }
    }

    sendBtn.addEventListener('click', runSequence);

})();
