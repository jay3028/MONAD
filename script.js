// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Mouse tracking for smooth following effect
    const container = document.querySelector('.container');
    const solidLarge = document.getElementById('solidLarge');
    const solidSmall = document.getElementById('solidSmall');
    const dashedSmall = document.getElementById('dashedSmall');
    const dashedLarge = document.getElementById('dashedLarge');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation loop for smooth following
    function animate() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate offset from center (normalized, subtle movement)
        targetX = (mouseX - centerX) * 0.025;
        targetY = (mouseY - centerY) * 0.025;
        
        // Smooth interpolation with easing
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        
        // Apply transform to container
        container.style.transform = `translate(${currentX}px, ${currentY}px)`;
        
        requestAnimationFrame(animate);
    }

    // Create SVG elements for dashed squares
    function createDashedSquare(element, size) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '0.5');
        rect.setAttribute('y', '0.5');
        rect.setAttribute('width', size - 1);
        rect.setAttribute('height', size - 1);
        rect.setAttribute('fill', 'none');
        rect.setAttribute('stroke', '#000');
        rect.setAttribute('stroke-width', '1');
        rect.setAttribute('stroke-dasharray', '8 4');
        rect.setAttribute('stroke-linecap', 'square');
        
        svg.appendChild(rect);
        element.appendChild(svg);
    }

    // Initialize dashed squares with SVG
    createDashedSquare(dashedLarge, 200);
    createDashedSquare(dashedSmall, 80);

    // Initialize animation loop
    animate();
});
