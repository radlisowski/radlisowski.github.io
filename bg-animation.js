// Dynamic animated background: morphing 3D logo-inspired dot clouds.
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        let morphT = 0; // 0 = Claude-inspired mark, 1 = ChatGPT-inspired knot
        let morphDir = 1; // 1 = Claude->ChatGPT, -1 = ChatGPT->Claude
        const morphDuration = 4.5; // seconds for full morph
        const holdDuration = 1.0; // seconds to pause on each completed shape
        let lastFrameTime = 0;
        let holdTime = 0;
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', resize);

        // Gradient colors
        const colorA = [66, 135, 245]; // blue
        const colorB = [255, 99, 188]; // pink
        const DOTS = 2280;
        const dots = [];

        function pseudoRandom(seed) {
            const x = Math.sin(seed * 12.9898) * 43758.5453;
            return x - Math.floor(x);
        }

        function pointOnTube(pathX, pathY, pathZ, tangentAngle, tubeAngle, tubeRadius, depthPulse) {
            const nx = Math.cos(tangentAngle + Math.PI / 2);
            const ny = Math.sin(tangentAngle + Math.PI / 2);
            const ring = Math.cos(tubeAngle) * tubeRadius;
            return {
                x: pathX + nx * ring,
                y: pathY + ny * ring,
                z: pathZ + Math.sin(tubeAngle) * tubeRadius * 0.7 + depthPulse
            };
        }

        function roundedCapsulePoint(t, length, radius) {
            const lineLength = length - radius * 2;
            const straightWeight = lineLength;
            const curveWeight = Math.PI * radius;
            const perimeter = straightWeight * 2 + curveWeight * 2;
            let distance = t * perimeter;

            if (distance < straightWeight) {
                const progress = distance / straightWeight;
                return {
                    x: -lineLength / 2 + progress * lineLength,
                    y: -radius,
                    tangent: 0
                };
            }
            distance -= straightWeight;

            if (distance < curveWeight) {
                const angle = -Math.PI / 2 + distance / curveWeight * Math.PI;
                return {
                    x: lineLength / 2 + Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                    tangent: angle + Math.PI / 2
                };
            }
            distance -= curveWeight;

            if (distance < straightWeight) {
                const progress = distance / straightWeight;
                return {
                    x: lineLength / 2 - progress * lineLength,
                    y: radius,
                    tangent: Math.PI
                };
            }
            distance -= straightWeight;

            const angle = Math.PI / 2 + distance / curveWeight * Math.PI;
            return {
                x: -lineLength / 2 + Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                tangent: angle + Math.PI / 2
            };
        }

        function createChatGPTPoint(i) {
            const arm = i % 6;
            const localIndex = Math.floor(i / 6);
            const localT = (localIndex % 400) / 400;
            const angle = arm * Math.PI / 3;
            const capsule = roundedCapsulePoint(localT, 0.92, 0.2);
            const centerRadius = 0.39;
            const loopAngle = angle + Math.PI / 6;
            const tubeAngle = pseudoRandom(i + 11) * Math.PI * 2;
            const tubeRadius = 0.035 + pseudoRandom(i + 23) * 0.025;
            const localX = capsule.x;
            const localY = capsule.y;
            const centerX = Math.cos(angle) * centerRadius;
            const centerY = Math.sin(angle) * centerRadius;
            const rotatedX = centerX + localX * Math.cos(loopAngle) - localY * Math.sin(loopAngle);
            const rotatedY = centerY + localX * Math.sin(loopAngle) + localY * Math.cos(loopAngle);
            const tangentAngle = loopAngle + capsule.tangent;
            const z = 0.12 * Math.sin(localT * Math.PI * 2 + arm * 0.8);

            return pointOnTube(rotatedX, rotatedY, z, tangentAngle, tubeAngle, tubeRadius, 0);
        }

        function createClaudePoint(i) {
            const ray = i % 16;
            const localIndex = Math.floor(i / 16);
            const localT = (localIndex % 150) / 150;
            const angle = ray * Math.PI / 8;
            const easedT = Math.pow(localT, 0.72);
            const length = ray % 2 === 0 ? 0.96 : 0.78;
            const forward = 0.04 + easedT * length;
            const width = 0.085 * Math.pow(1 - localT, 0.55) + 0.012;
            const side = (pseudoRandom(i + 41) * 2 - 1) * width;
            const roundTip = Math.sin(localT * Math.PI) * 0.018;

            let x = forward;
            let y = side + roundTip * Math.sin(ray * 1.7);
            const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
            const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
            const z = 0.08 * Math.cos(localT * Math.PI + ray * 0.35);
            const tubeAngle = pseudoRandom(i + 59) * Math.PI * 2;
            const thickness = 0.018 + (1 - localT) * 0.025;

            return pointOnTube(rotatedX, rotatedY, z, angle, tubeAngle, thickness, 0);
        }

        // Arrange dots for both logo-inspired shapes.
        for (let i = 0; i < DOTS; i++) {
            const t = i / (DOTS - 1);
            dots.push({
                t: t,
                angle: Math.random() * Math.PI * 2,
                claude: createClaudePoint(i),
                chatgpt: createChatGPTPoint(i)
            });
        }

        function lerp(a, b, t) {
            return a * (1 - t) + b * t;
        }

        function projectStatic(point, radius, centerX, centerY) {
            const perspective = 1.45 / (2.25 - point.z * 0.35);

            return {
                x: centerX + radius * point.x * perspective,
                y: centerY + radius * point.y * perspective,
                perspective: perspective
            };
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            let now = Date.now() * 0.001 * 0.8; // slow down by 20%
            let deltaTime = lastFrameTime ? Math.min(now - lastFrameTime, 0.05) : 0;
            lastFrameTime = now;

            // Morphing logic: Claude-inspired mark <-> ChatGPT-inspired knot.
            if (holdTime > 0) {
                holdTime -= deltaTime;
            } else {
                morphT += morphDir * (deltaTime / morphDuration);
                if (morphT >= 1) {
                    morphT = 1;
                    morphDir = -1;
                    holdTime = holdDuration;
                }
                if (morphT <= 0) {
                    morphT = 0;
                    morphDir = 1;
                    holdTime = holdDuration;
                }
            }
            let ease = morphT * morphT * (3 - 2 * morphT); // smoothstep
            let logoRadius = Math.min(width, height) * 0.43;
            let centerX = width / 2;
            let centerY = height / 2;
            for (let i = 0; i < DOTS; i++) {
                let d = dots[i];
                let claude = projectStatic(d.claude, logoRadius, centerX, centerY);
                let chatgpt = projectStatic(d.chatgpt, logoRadius, centerX, centerY);
                // --- Morph between shapes ---
                let px = lerp(claude.x, chatgpt.x, ease);
                let py = lerp(claude.y, chatgpt.y, ease);
                let alpha = lerp(0.82 * claude.perspective, 0.82 * chatgpt.perspective, ease);
                // Wave color: make it look like a wave passing through
                let wave = 0.5 + 0.5 * Math.sin(now * 2 + d.t * Math.PI * 8);
                let r = Math.round(lerp(colorA[0], colorB[0], wave));
                let g = Math.round(lerp(colorA[1], colorB[1], wave));
                let b = Math.round(lerp(colorA[2], colorB[2], wave));
                ctx.beginPath();
                ctx.arc(px, py, 1.05, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.globalAlpha = alpha;
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        }
        animate();
    });
})();
