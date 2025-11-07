const canvasContainer = document.getElementById('canvas-container');
canvasContainer.innerHTML = ''; // Clear any existing content

// Create a canvas for the code background
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '0';
canvas.style.pointerEvents = 'none';
canvas.style.opacity = '0.35'; // Increased from 0.12 for better visibility
canvasContainer.appendChild(canvas);

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Developer-themed code snippets and commands
const codeElements = [
    // C/C++ code
    { text: 'void* handle_request(void* arg)', type: 'code', speed: 0.25 },
    { text: 'std::vector<int> data;', type: 'code', speed: 0.3 },
    { text: 'int main(int argc, char** argv)', type: 'code', speed: 0.28 },
    { text: 'epoll_wait(epfd, events, MAX, -1)', type: 'code', speed: 0.27 },
    { text: 'struct Block { uint256 hash; }', type: 'code', speed: 0.29 },
    
    // Solidity/Blockchain
    { text: 'pragma solidity ^0.8.0;', type: 'code', speed: 0.32 },
    { text: 'function deploy() public {', type: 'code', speed: 0.26 },
    { text: 'contract Token { mapping(...) }', type: 'code', speed: 0.31 },
    { text: 'await contract.deploy()', type: 'code', speed: 0.33 },
    
    // Terminal commands
    { text: '$ docker-compose up -d', type: 'terminal', speed: 0.35 },
    { text: '$ git commit -m "feat: add"', type: 'terminal', speed: 0.3 },
    { text: '$ make && make install', type: 'terminal', speed: 0.34 },
    { text: '$ npm run build', type: 'terminal', speed: 0.36 },
    { text: '$ g++ -std=c++17 main.cpp', type: 'terminal', speed: 0.28 },
    { text: '$ npx hardhat compile', type: 'terminal', speed: 0.32 },
    
    // SQL/Database
    { text: 'SELECT * FROM transactions', type: 'code', speed: 0.29 },
    { text: 'CREATE TABLE blocks (...)', type: 'code', speed: 0.27 },
    
    // Comments/Annotations
    { text: '// High-performance backend', type: 'comment', speed: 0.31 },
    { text: '/* Blockchain node */', type: 'comment', speed: 0.28 },
    { text: '# Deploy smart contract', type: 'comment', speed: 0.33 }
];

// Initialize elements with random positions
codeElements.forEach((element) => {
    element.x = Math.random() * canvas.width;
    element.y = Math.random() * canvas.height;
    element.opacity = 0.4 + Math.random() * 0.4; // Increased opacity
    element.angle = Math.random() * Math.PI * 2;
    element.size = 11 + Math.random() * 2;
    element.colorIndex = Math.floor(Math.random() * 5);
});

// Enhanced color palette - vibrant blues, cyan, and teal accents
const colors = {
    code: ['#2A7A9E', '#00B8D4', '#00D9FF', '#1D546C', '#4A9ED4'], // Vibrant blues and cyan
    terminal: ['#00D9FF', '#2A7A9E', '#00B8D4'], // Cyan/teal for terminal
    comment: ['#4A9ED4', '#2A7A9E', '#00B8D4'] // Softer blues for comments
};

// Animation function
let animationId;
let mouseX = 0;
let mouseY = 0;
let time = 0;

// Mouse interaction for subtle parallax
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 15;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 15;
});

function animate() {
    time += 0.01;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw code elements
    codeElements.forEach((element) => {
        // Update position with smooth movement
        element.x += Math.cos(element.angle) * element.speed;
        element.y += Math.sin(element.angle) * element.speed;
        
        // Add subtle wave motion
        const waveX = Math.sin(time + element.x * 0.01) * 2;
        const waveY = Math.cos(time + element.y * 0.01) * 2;
        
        // Parallax effect
        const parallaxX = mouseX * 0.08;
        const parallaxY = mouseY * 0.08;
        
        // Wrap around screen
        if (element.x < -300) element.x = canvas.width + 300;
        if (element.x > canvas.width + 300) element.x = -300;
        if (element.y < -50) element.y = canvas.height + 50;
        if (element.y > canvas.height + 50) element.y = -50;
        
        // Randomly change direction slightly for organic movement
        if (Math.random() < 0.005) {
            element.angle += (Math.random() - 0.5) * 0.15;
        }
        
        // Set font based on type
        const fontSize = element.type === 'terminal' ? 12 : 11;
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        // Get color based on type
        const colorArray = colors[element.type] || colors.code;
        const color = colorArray[element.colorIndex % colorArray.length];
        
        const finalX = element.x + waveX + parallaxX;
        const finalY = element.y + waveY + parallaxY;
        
        // Draw glow effect (multiple layers for stronger glow)
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.globalAlpha = element.opacity * 0.3;
        
        // Draw glow layers
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = color;
            ctx.fillText(element.text, finalX, finalY);
        }
        
        // Draw main text with stronger opacity
        ctx.fillStyle = color;
        ctx.globalAlpha = element.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color + '80';
        ctx.fillText(element.text, finalX, finalY);
        
        // Reset shadow
        ctx.shadowBlur = 0;
    });
    
    // Draw connecting lines between nearby elements (network graph effect)
    // Made more visible with brighter colors
    ctx.lineWidth = 1.5;
    
    for (let i = 0; i < codeElements.length; i++) {
        for (let j = i + 1; j < codeElements.length; j++) {
            const dx = codeElements[i].x - codeElements[j].x;
            const dy = codeElements[i].y - codeElements[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 280) {
                const opacity = (1 - distance / 280) * 0.25; // Increased visibility
                const colorArray = colors.code;
                const lineColor = colorArray[Math.floor(Math.random() * colorArray.length)];
                
                // Create gradient for lines
                const gradient = ctx.createLinearGradient(
                    codeElements[i].x, codeElements[i].y,
                    codeElements[j].x, codeElements[j].y
                );
                gradient.addColorStop(0, lineColor + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
                gradient.addColorStop(1, lineColor + '00');
                
                ctx.strokeStyle = gradient;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.moveTo(codeElements[i].x, codeElements[i].y);
                ctx.lineTo(codeElements[j].x, codeElements[j].y);
                ctx.stroke();
            }
        }
    }
    
    ctx.globalAlpha = 1;
    
    animationId = requestAnimationFrame(animate);
}

// Start animation
animate();

// Performance optimization: Pause when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animate();
    }
});

// Cleanup function
function cleanup() {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resizeCanvas);
    document.removeEventListener('visibilitychange', cleanup);
    if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
    }
}

window.cleanupCodeBackground = cleanup;
