// Dynamic animated background: many tiny dots with wave-synchronized color
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        let morphT = 0; // 0 = sphere, 1 = cube
        let morphDir = 1; // 1 = sphere->cube, -1 = cube->sphere
        const morphDuration = 8.0; // seconds for full morph
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
        const DOTS = 1500;
        const dots = [];
        // Arrange dots for all shapes
        for (let i = 0; i < DOTS; i++) {
            const t = i / (DOTS - 1);
            // Sphere coordinates
            const phi = Math.acos(1 - 2 * t); // latitude
            const theta = Math.PI * (1 + Math.sqrt(5)) * i; // longitude
            // Cube coordinates: distribute on cube faces
            let face = i % 6;
            let u = ((i * 97) % DOTS) / (DOTS - 1) * 2 - 1; // -1 to 1
            let v = ((i * 233) % DOTS) / (DOTS - 1) * 2 - 1; // -1 to 1
            let cubeX = 0, cubeY = 0, cubeZ = 0;
            if (face === 0) { cubeX = 1; cubeY = u; cubeZ = v; }
            else if (face === 1) { cubeX = -1; cubeY = u; cubeZ = v; }
            else if (face === 2) { cubeY = 1; cubeX = u; cubeZ = v; }
            else if (face === 3) { cubeY = -1; cubeX = u; cubeZ = v; }
            else if (face === 4) { cubeZ = 1; cubeX = u; cubeY = v; }
            else if (face === 5) { cubeZ = -1; cubeX = u; cubeY = v; }
            dots.push({
                phi: phi,
                theta: theta,
                t: t,
                angle: Math.random() * Math.PI * 2,
                x: Math.random() * width,
                y: Math.random() * height,
                cube: {x: cubeX, y: cubeY, z: cubeZ}
            });
        }
        function lerp(a, b, t) {
            return a * (1 - t) + b * t;
        }
        function animate() {
            ctx.clearRect(0, 0, width, height);
            let now = Date.now() * 0.001 * 0.8; // slow down by 20%
            let groupAngle = now * 0.2;
            // Morphing logic: just sphere <-> cube
            morphT += morphDir * (1 / (morphDuration * 60)); // 60fps approx
            if (morphT > 1) { morphT = 1; morphDir = -1; }
            if (morphT < 0) { morphT = 0; morphDir = 1; }
            let ease = morphT * morphT * (3 - 2 * morphT); // smoothstep
            let sphereRadius = Math.min(width, height) * 0.32;
            let centerX = width / 2;
            let centerY = height / 2;
            let rotY = groupAngle * 0.7;
            let rotX = groupAngle * 0.3;
            for (let i = 0; i < DOTS; i++) {
                let d = dots[i];
                // --- Sphere position ---
                let x0 = Math.sin(d.phi) * Math.cos(d.theta);
                let y0 = Math.cos(d.phi);
                let z0 = Math.sin(d.phi) * Math.sin(d.theta);
                // Rotate around Y axis
                let x1 = x0 * Math.cos(rotY) + z0 * Math.sin(rotY);
                let z1 = -x0 * Math.sin(rotY) + z0 * Math.cos(rotY);
                // Rotate around X axis
                let y1 = y0 * Math.cos(rotX) - z1 * Math.sin(rotX);
                let z2 = y0 * Math.sin(rotX) + z1 * Math.cos(rotX);
                // Project to 2D
                let perspectiveS = 1.5 / (2.2 - z2);
                let sphereX = centerX + sphereRadius * x1 * perspectiveS;
                let sphereY = centerY + sphereRadius * y1 * perspectiveS;
                // --- Cube position ---
                // Rotate cube in 3D
                let cx0 = d.cube.x, cy0 = d.cube.y, cz0 = d.cube.z;
                // Rotate around Y axis
                let cx1 = cx0 * Math.cos(rotY) + cz0 * Math.sin(rotY);
                let cz1 = -cx0 * Math.sin(rotY) + cz0 * Math.cos(rotY);
                // Rotate around X axis
                let cy1 = cy0 * Math.cos(rotX) - cz1 * Math.sin(rotX);
                let cz2 = cy0 * Math.sin(rotX) + cz1 * Math.cos(rotX);
                // Project to 2D
                let perspectiveC = 1.5 / (2.2 - cz2);
                let cubeX = centerX + sphereRadius * cx1 * perspectiveC;
                let cubeY = centerY + sphereRadius * cy1 * perspectiveC;
                // --- Morph between shapes ---
                let px = lerp(sphereX, cubeX, ease);
                let py = lerp(sphereY, cubeY, ease);
                let alpha = lerp(0.8 * perspectiveS, 0.8 * perspectiveC, ease);
                // Wave color: make it look like a wave passing through
                let wave = 0.5 + 0.5 * Math.sin(now * 2 - groupAngle * 3 + d.t * Math.PI * 8);
                let r = Math.round(lerp(colorA[0], colorB[0], wave));
                let g = Math.round(lerp(colorA[1], colorB[1], wave));
                let b = Math.round(lerp(colorA[2], colorB[2], wave));
                ctx.beginPath();
                ctx.arc(px, py, 1, 0, Math.PI * 2);
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
