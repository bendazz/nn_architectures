// logistic_hidden_two_layers.js
// Animation for "Logistic Regression: Two Hidden Layers"
// Fully connected: left inputs -> hidden layer 1 (3 nodes) -> hidden layer 2 (3 nodes) -> output

(function(){
    const svg = document.getElementById('network-hidden2');
    const sendBtn = document.getElementById('sendBtnHidden2');

    // left nodes
    const leftBias = document.getElementById('h2_left_bias');
    const leftIn1 = document.getElementById('h2_left_in1');
    const leftIn2 = document.getElementById('h2_left_in2');

    // layer1 nodes
    const l1_bias = document.getElementById('h2_layer1_bias');
    const l1n1 = document.getElementById('h2_l1_n1');
    const l1n2 = document.getElementById('h2_l1_n2');
    const l1n3 = document.getElementById('h2_l1_n3');

    // layer2 nodes
    const l2_bias = document.getElementById('h2_layer2_bias');
    const l2n1 = document.getElementById('h2_l2_n1');
    const l2n2 = document.getElementById('h2_l2_n2');
    const l2n3 = document.getElementById('h2_l2_n3');

    // output
    const output = document.getElementById('h2_output');

    // base left travelers
    const travLeftBias = document.getElementById('h2_trav_left_bias');
    const travLeft1 = document.getElementById('h2_trav_left_1');
    const travLeft2 = document.getElementById('h2_trav_left_2');

    // per-edge left->L1
    const trav_lb_l1_1 = document.getElementById('h2_trav_lb_l1_1');
    const trav_lb_l1_2 = document.getElementById('h2_trav_lb_l1_2');
    const trav_lb_l1_3 = document.getElementById('h2_trav_lb_l1_3');

    const trav_l1_l1_1 = document.getElementById('h2_trav_l1_l1_1');
    const trav_l1_l1_2 = document.getElementById('h2_trav_l1_l1_2');
    const trav_l1_l1_3 = document.getElementById('h2_trav_l1_l1_3');

    const trav_l2_l1_1 = document.getElementById('h2_trav_l2_l1_1');
    const trav_l2_l1_2 = document.getElementById('h2_trav_l2_l1_2');
    const trav_l2_l1_3 = document.getElementById('h2_trav_l2_l1_3');

    // merged at layer1
    const trav_l1_n1_merged = document.getElementById('h2_trav_l1_n1_merged');
    const trav_l1_n2_merged = document.getElementById('h2_trav_l1_n2_merged');
    const trav_l1_n3_merged = document.getElementById('h2_trav_l1_n3_merged');

    // per-edge L1->L2
    const trav_l1n1_l2n1 = document.getElementById('h2_trav_l1n1_l2n1');
    const trav_l1n1_l2n2 = document.getElementById('h2_trav_l1n1_l2n2');
    const trav_l1n1_l2n3 = document.getElementById('h2_trav_l1n1_l2n3');

    const trav_l1n2_l2n1 = document.getElementById('h2_trav_l1n2_l2n1');
    const trav_l1n2_l2n2 = document.getElementById('h2_trav_l1n2_l2n2');
    const trav_l1n2_l2n3 = document.getElementById('h2_trav_l1n2_l2n3');

    const trav_l1n3_l2n1 = document.getElementById('h2_trav_l1n3_l2n1');
    const trav_l1n3_l2n2 = document.getElementById('h2_trav_l1n3_l2n2');
    const trav_l1n3_l2n3 = document.getElementById('h2_trav_l1n3_l2n3');

    // merged at layer2
    const trav_l2_n1_merged = document.getElementById('h2_trav_l2_n1_merged');
    const trav_l2_n2_merged = document.getElementById('h2_trav_l2_n2_merged');
    const trav_l2_n3_merged = document.getElementById('h2_trav_l2_n3_merged');

    // top-bias arrival travelers
    const trav_top_l1_bias = document.getElementById('h2_trav_top_l1_bias');
    const trav_top_l2_bias = document.getElementById('h2_trav_top_l2_bias');

    // final merged traveler
    const trav_final_merged = document.getElementById('h2_trav_final_merged');

    // timing (slower for clarity)
    const approachDur = 1100;
    const pauseAtInput = 700;
    const travelToL1Dur = 1200;
    const l1FlashCycle = 220; const l1FlashRepeats = 3; const l1FlashDuration = l1FlashCycle * l1FlashRepeats;
    const l2FlashCycle = 220; const l2FlashRepeats = 3; const l2FlashDuration = l2FlashCycle * l2FlashRepeats;
    const pauseAfterFlash = 260;
    const l1ToL2Dur = 1200;
    const l2ToOutDur = 1200;
    const exitDur = 800;

    // helpers
    function getCenter(node){ return { x: parseFloat(node.getAttribute('cx')), y: parseFloat(node.getAttribute('cy')) }; }
    function show(e){ e.setAttribute('visibility','visible'); }
    function hide(e){ e.setAttribute('visibility','hidden'); }
    function easeInOutQuad(t){ return t<0.5 ? 2*t*t : -1 + (4-2*t)*t; }
    function animateMove(elem, from, to, duration, cb){
        const start = performance.now();
        function step(now){
            const t = Math.min(1, (now-start)/duration);
            const e = easeInOutQuad(t);
            elem.setAttribute('cx', from.x + (to.x-from.x)*e);
            elem.setAttribute('cy', from.y + (to.y-from.y)*e);
            if(t<1) requestAnimationFrame(step);
            else if(cb) cb();
        }
        requestAnimationFrame(step);
    }
    function flashNode(node, cycles, cycleMs){ node.classList.add('flash'); setTimeout(()=>node.classList.remove('flash'), cycles * cycleMs); }

    function resetAll(){
        [travLeftBias, travLeft1, travLeft2,
         trav_lb_l1_1, trav_lb_l1_2, trav_lb_l1_3,
         trav_l1_l1_1, trav_l1_l1_2, trav_l1_l1_3,
         trav_l2_l1_1, trav_l2_l1_2, trav_l2_l1_3,
         trav_l1n1_l2n1, trav_l1n1_l2n2, trav_l1n1_l2n3,
         trav_l1n2_l2n1, trav_l1n2_l2n2, trav_l1n2_l2n3,
         trav_l1n3_l2n1, trav_l1n3_l2n2, trav_l1n3_l2n3,
         trav_l1_n1_merged, trav_l1_n2_merged, trav_l1_n3_merged,
            trav_l2_n1_merged, trav_l2_n2_merged, trav_l2_n3_merged,
         trav_top_l1_bias, trav_top_l2_bias, trav_final_merged].forEach(hide);

        // also hide layer1-bias -> layer2 per-edge travelers if present
        const b1 = document.getElementById('h2_trav_l1bias_l2n1');
        const b2 = document.getElementById('h2_trav_l1bias_l2n2');
        const b3 = document.getElementById('h2_trav_l1bias_l2n3');
        if(b1) hide(b1); if(b2) hide(b2); if(b3) hide(b3);
        // hide layer2 bias traveler too
        const l2biasTrav = document.getElementById('h2_trav_l2_bias');
        if(l2biasTrav) hide(l2biasTrav);
    }

    function runSequence(){
        resetAll();
        // compute centers
        const lb = getCenter(leftBias), l1 = getCenter(leftIn1), l2 = getCenter(leftIn2);
        const layer1c = [ getCenter(l1n1), getCenter(l1n2), getCenter(l1n3) ];
        const layer2c = [ getCenter(l2n1), getCenter(l2n2), getCenter(l2n3) ];
        const outc = getCenter(output);

        // Approach: left base travelers come in from left
        const svgBox = svg.viewBox.baseVal; const startX = svgBox.x - 40;
        travLeftBias.setAttribute('cx', startX); travLeftBias.setAttribute('cy', lb.y); show(travLeftBias);
        travLeft1.setAttribute('cx', startX); travLeft1.setAttribute('cy', l1.y); show(travLeft1);
        travLeft2.setAttribute('cx', startX); travLeft2.setAttribute('cy', l2.y); show(travLeft2);

        let approachesDone = 0; function approachDone(){ approachesDone++; if(approachesDone===3) afterApproach(); }
        animateMove(travLeftBias, {x:startX,y:lb.y}, lb, approachDur, approachDone);
        animateMove(travLeft1, {x:startX,y:l1.y}, l1, approachDur+80, approachDone);
        animateMove(travLeft2, {x:startX,y:l2.y}, l2, approachDur+160, approachDone);

        function afterApproach(){
            setTimeout(()=>{
            // hide the base left travelers now that we're splitting (also ensure earlier hide)
            hide(travLeftBias); hide(travLeft1); hide(travLeft2);

                // spawn per-edge left->L1 travelers (9)
                // left bias -> L1 nodes
                trav_lb_l1_1.setAttribute('cx', lb.x); trav_lb_l1_1.setAttribute('cy', lb.y); show(trav_lb_l1_1);
                animateMove(trav_lb_l1_1, lb, layer1c[0], travelToL1Dur, ()=>{ hide(trav_lb_l1_1); perEdgeArrivedL1(0); });
                trav_lb_l1_2.setAttribute('cx', lb.x); trav_lb_l1_2.setAttribute('cy', lb.y); show(trav_lb_l1_2);
                animateMove(trav_lb_l1_2, lb, layer1c[1], travelToL1Dur+40, ()=>{ hide(trav_lb_l1_2); perEdgeArrivedL1(1); });
                trav_lb_l1_3.setAttribute('cx', lb.x); trav_lb_l1_3.setAttribute('cy', lb.y); show(trav_lb_l1_3);
                animateMove(trav_lb_l1_3, lb, layer1c[2], travelToL1Dur+80, ()=>{ hide(trav_lb_l1_3); perEdgeArrivedL1(2); });

                // left in1 -> L1 nodes
                trav_l1_l1_1.setAttribute('cx', l1.x); trav_l1_l1_1.setAttribute('cy', l1.y); show(trav_l1_l1_1);
                animateMove(trav_l1_l1_1, l1, layer1c[0], travelToL1Dur+20, ()=>{ hide(trav_l1_l1_1); perEdgeArrivedL1(0); });
                trav_l1_l1_2.setAttribute('cx', l1.x); trav_l1_l1_2.setAttribute('cy', l1.y); show(trav_l1_l1_2);
                animateMove(trav_l1_l1_2, l1, layer1c[1], travelToL1Dur+60, ()=>{ hide(trav_l1_l1_2); perEdgeArrivedL1(1); });
                trav_l1_l1_3.setAttribute('cx', l1.x); trav_l1_l1_3.setAttribute('cy', l1.y); show(trav_l1_l1_3);
                animateMove(trav_l1_l1_3, l1, layer1c[2], travelToL1Dur+100, ()=>{ hide(trav_l1_l1_3); perEdgeArrivedL1(2); });

                // left in2 -> L1 nodes
                trav_l2_l1_1.setAttribute('cx', l2.x); trav_l2_l1_1.setAttribute('cy', l2.y); show(trav_l2_l1_1);
                animateMove(trav_l2_l1_1, l2, layer1c[0], travelToL1Dur+40, ()=>{ hide(trav_l2_l1_1); perEdgeArrivedL1(0); });
                trav_l2_l1_2.setAttribute('cx', l2.x); trav_l2_l1_2.setAttribute('cy', l2.y); show(trav_l2_l1_2);
                animateMove(trav_l2_l1_2, l2, layer1c[1], travelToL1Dur+80, ()=>{ hide(trav_l2_l1_2); perEdgeArrivedL1(1); });
                trav_l2_l1_3.setAttribute('cx', l2.x); trav_l2_l1_3.setAttribute('cy', l2.y); show(trav_l2_l1_3);
                animateMove(trav_l2_l1_3, l2, layer1c[2], travelToL1Dur+120, ()=>{ hide(trav_l2_l1_3); perEdgeArrivedL1(2); });

                // track arrivals at L1 nodes
                const arrivalsL1 = [0,0,0];
                function perEdgeArrivedL1(idx){
                    arrivalsL1[idx]++;
                    if(arrivalsL1[idx] === 3){
                        // show merged traveler at that L1 node
                        if(idx===0) { trav_l1_n1_merged.setAttribute('cx', layer1c[0].x); trav_l1_n1_merged.setAttribute('cy', layer1c[0].y); show(trav_l1_n1_merged); }
                        if(idx===1) { trav_l1_n2_merged.setAttribute('cx', layer1c[1].x); trav_l1_n2_merged.setAttribute('cy', layer1c[1].y); show(trav_l1_n2_merged); }
                        if(idx===2) { trav_l1_n3_merged.setAttribute('cx', layer1c[2].x); trav_l1_n3_merged.setAttribute('cy', layer1c[2].y); show(trav_l1_n3_merged); }
                    }
                    // when all 3 L1 merged present, continue to L2
                    if(arrivalsL1[0]===3 && arrivalsL1[1]===3 && arrivalsL1[2]===3){
                        // flash layer1 nodes
                        flashNode(l1n1, l1FlashRepeats, l1FlashCycle);
                        flashNode(l1n2, l1FlashRepeats, l1FlashCycle);
                        flashNode(l1n3, l1FlashRepeats, l1FlashCycle);

                        // top bias travels into layer1 bias during flash
                        trav_top_l1_bias.setAttribute('cx', layer1c[0].x); trav_top_l1_bias.setAttribute('cy', -24); show(trav_top_l1_bias);
                        animateMove(trav_top_l1_bias, {x:layer1c[0].x, y:-24}, getCenter(l1_bias), l1FlashDuration - 60, ()=>{
                            // show bias traveler at l1 bias
                            show(trav_top_l1_bias); hide(trav_top_l1_bias); // keep visual simple (bias presence implied)

                            // after a short pause spawn per-edge L1->L2 travelers (9)
                            setTimeout(()=>{
                                spawnL1ToL2();
                            }, 90);
                        });
                    }
                }

                function spawnL1ToL2(){
                    // compute centers for layer2
                    // hide merged L1 travelers (they will spawn per-edge travelers instead)
                    hide(trav_l1_n1_merged); hide(trav_l1_n2_merged); hide(trav_l1_n3_merged);
                    const l2centers = layer2c;
                    // from merged L1 nodes, launch per-edge travelers to each L2 node
                    // L1-1 merged -> L2 nodes
                    trav_l1n1_l2n1.setAttribute('cx', layer1c[0].x); trav_l1n1_l2n1.setAttribute('cy', layer1c[0].y); show(trav_l1n1_l2n1);
                    animateMove(trav_l1n1_l2n1, layer1c[0], l2centers[0], l1ToL2Dur, ()=>{ hide(trav_l1n1_l2n1); perEdgeArrivedL2(0); });
                    trav_l1n1_l2n2.setAttribute('cx', layer1c[0].x); trav_l1n1_l2n2.setAttribute('cy', layer1c[0].y); show(trav_l1n1_l2n2);
                    animateMove(trav_l1n1_l2n2, layer1c[0], l2centers[1], l1ToL2Dur+40, ()=>{ hide(trav_l1n1_l2n2); perEdgeArrivedL2(1); });
                    trav_l1n1_l2n3.setAttribute('cx', layer1c[0].x); trav_l1n1_l2n3.setAttribute('cy', layer1c[0].y); show(trav_l1n1_l2n3);
                    animateMove(trav_l1n1_l2n3, layer1c[0], l2centers[2], l1ToL2Dur+80, ()=>{ hide(trav_l1n1_l2n3); perEdgeArrivedL2(2); });

                    // L1-2 merged -> L2
                    trav_l1n2_l2n1.setAttribute('cx', layer1c[1].x); trav_l1n2_l2n1.setAttribute('cy', layer1c[1].y); show(trav_l1n2_l2n1);
                    animateMove(trav_l1n2_l2n1, layer1c[1], l2centers[0], l1ToL2Dur+20, ()=>{ hide(trav_l1n2_l2n1); perEdgeArrivedL2(0); });
                    trav_l1n2_l2n2.setAttribute('cx', layer1c[1].x); trav_l1n2_l2n2.setAttribute('cy', layer1c[1].y); show(trav_l1n2_l2n2);
                    animateMove(trav_l1n2_l2n2, layer1c[1], l2centers[1], l1ToL2Dur+60, ()=>{ hide(trav_l1n2_l2n2); perEdgeArrivedL2(1); });
                    trav_l1n2_l2n3.setAttribute('cx', layer1c[1].x); trav_l1n2_l2n3.setAttribute('cy', layer1c[1].y); show(trav_l1n2_l2n3);
                    animateMove(trav_l1n2_l2n3, layer1c[1], l2centers[2], l1ToL2Dur+100, ()=>{ hide(trav_l1n2_l2n3); perEdgeArrivedL2(2); });

                    // L1-3 merged -> L2
                    trav_l1n3_l2n1.setAttribute('cx', layer1c[2].x); trav_l1n3_l2n1.setAttribute('cy', layer1c[2].y); show(trav_l1n3_l2n1);
                    animateMove(trav_l1n3_l2n1, layer1c[2], l2centers[0], l1ToL2Dur+40, ()=>{ hide(trav_l1n3_l2n1); perEdgeArrivedL2(0); });
                    trav_l1n3_l2n2.setAttribute('cx', layer1c[2].x); trav_l1n3_l2n2.setAttribute('cy', layer1c[2].y); show(trav_l1n3_l2n2);
                    animateMove(trav_l1n3_l2n2, layer1c[2], l2centers[1], l1ToL2Dur+80, ()=>{ hide(trav_l1n3_l2n2); perEdgeArrivedL2(1); });
                    trav_l1n3_l2n3.setAttribute('cx', layer1c[2].x); trav_l1n3_l2n3.setAttribute('cy', layer1c[2].y); show(trav_l1n3_l2n3);
                    animateMove(trav_l1n3_l2n3, layer1c[2], l2centers[2], l1ToL2Dur+120, ()=>{ hide(trav_l1n3_l2n3); perEdgeArrivedL2(2); });

                    // Also include layer1-bias -> L2 contributions (3 travelers)
                    const l1biasCenter = getCenter(l1_bias);
                    const trav_b1 = document.getElementById('h2_trav_l1bias_l2n1');
                    const trav_b2 = document.getElementById('h2_trav_l1bias_l2n2');
                    const trav_b3 = document.getElementById('h2_trav_l1bias_l2n3');
                    trav_b1.setAttribute('cx', l1biasCenter.x); trav_b1.setAttribute('cy', l1biasCenter.y); show(trav_b1);
                    animateMove(trav_b1, l1biasCenter, l2centers[0], l1ToL2Dur+10, ()=>{ hide(trav_b1); perEdgeArrivedL2(0); });
                    trav_b2.setAttribute('cx', l1biasCenter.x); trav_b2.setAttribute('cy', l1biasCenter.y); show(trav_b2);
                    animateMove(trav_b2, l1biasCenter, l2centers[1], l1ToL2Dur+50, ()=>{ hide(trav_b2); perEdgeArrivedL2(1); });
                    trav_b3.setAttribute('cx', l1biasCenter.x); trav_b3.setAttribute('cy', l1biasCenter.y); show(trav_b3);
                    animateMove(trav_b3, l1biasCenter, l2centers[2], l1ToL2Dur+90, ()=>{ hide(trav_b3); perEdgeArrivedL2(2); });

                    // track arrivals at L2 nodes
                    const arrivalsL2 = [0,0,0];
                    function perEdgeArrivedL2(idx){
                        arrivalsL2[idx]++;
                        // now expect 4 contributions per L2 node (3 from L1 nodes + 1 from L1 bias)
                        if(arrivalsL2[idx] === 4){
                            // show merged at L2 node
                            if(idx===0){ trav_l2_n1_merged.setAttribute('cx', layer2c[0].x); trav_l2_n1_merged.setAttribute('cy', layer2c[0].y); show(trav_l2_n1_merged); }
                            if(idx===1){ trav_l2_n2_merged.setAttribute('cx', layer2c[1].x); trav_l2_n2_merged.setAttribute('cy', layer2c[1].y); show(trav_l2_n2_merged); }
                            if(idx===2){ trav_l2_n3_merged.setAttribute('cx', layer2c[2].x); trav_l2_n3_merged.setAttribute('cy', layer2c[2].y); show(trav_l2_n3_merged); }
                        }
                        if(arrivalsL2[0]===4 && arrivalsL2[1]===4 && arrivalsL2[2]===4){
                            // all L2 merged present: flash L2, spawn top bias into l2 bias, then L2 -> output
                            flashNode(l2n1, l2FlashRepeats, l2FlashCycle);
                            flashNode(l2n2, l2FlashRepeats, l2FlashCycle);
                            flashNode(l2n3, l2FlashRepeats, l2FlashCycle);

                            trav_top_l2_bias.setAttribute('cx', layer2c[0].x); trav_top_l2_bias.setAttribute('cy', -24); show(trav_top_l2_bias);
                            animateMove(trav_top_l2_bias, {x:layer2c[0].x, y:-24}, getCenter(l2_bias), l2FlashDuration - 60, ()=>{
                                // upon bias arrival, hide the temporary top traveler and show a traveler at layer2 bias, then proceed merged L2 travelers to output
                                hide(trav_top_l2_bias);
                                const l2biasCenter = getCenter(l2_bias);
                                const l2biasTrav = document.getElementById('h2_trav_l2_bias');
                                if(l2biasTrav){
                                    l2biasTrav.setAttribute('cx', l2biasCenter.x); l2biasTrav.setAttribute('cy', l2biasCenter.y); show(l2biasTrav);
                                }

                                setTimeout(()=>{
                                    const from1 = getCenter(l2n1); const from2 = getCenter(l2n2); const from3 = getCenter(l2n3);
                                    // animate merged L2 travelers and the bias traveler to output
                                    if(l2biasTrav) animateMove(l2biasTrav, l2biasCenter, outc, l2ToOutDur-60, ()=>{ hide(l2biasTrav); });
                                    animateMove(trav_l2_n1_merged, from1, outc, l2ToOutDur, ()=>{});
                                    animateMove(trav_l2_n2_merged, from2, outc, l2ToOutDur+20, ()=>{});
                                    animateMove(trav_l2_n3_merged, from3, outc, l2ToOutDur+40, ()=>{
                                        setTimeout(()=>{
                                            hide(trav_l2_n1_merged); hide(trav_l2_n2_merged); hide(trav_l2_n3_merged);
                                            trav_final_merged.setAttribute('cx', outc.x); trav_final_merged.setAttribute('cy', outc.y); show(trav_final_merged);
                                            flashNode(output, 3, 220);
                                            setTimeout(()=>{
                                                const endX = svg.viewBox.baseVal.x + svg.viewBox.baseVal.width + 40;
                                                animateMove(trav_final_merged, outc, {x:endX, y:outc.y}, exitDur, ()=>{ hide(trav_final_merged); });
                                            }, l2FlashDuration + pauseAfterFlash);
                                        }, 40);
                                    });
                                }, 90);
                            });
                        }
                    }
                }

                    // Ensure final cleanup after the whole sequence completes
                    // Call resetAll() after a grace period so any lingering travelers are hidden
                    setTimeout(()=> resetAll(), l2FlashDuration + pauseAfterFlash + exitDur + 200);

            }, pauseAtInput);
        }
    }

    sendBtn.addEventListener('click', runSequence);

})();
