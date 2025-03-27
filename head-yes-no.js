document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const container = document.querySelector('.buttons-container');
    
    // Function to get a random position within the container
    function getRandomPosition() {
        const containerRect = container.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();
        
        // Calculate maximum positions while keeping the button within the container
        const maxX = containerRect.width - btnRect.width;
        const maxY = containerRect.height - btnRect.height;
        
        return {
            x: Math.random() * maxX,
            y: Math.random() * maxY
        };
    }
    
    // Function to move the button to a new random position with increased speed
    function moveButton() {
        const newPos = getRandomPosition();
        
        // Add transition speed control - faster transition
        noBtn.style.transition = 'left 0.15s, top 0.15s';
        noBtn.style.left = newPos.x + 'px';
        noBtn.style.top = newPos.y + 'px';
    }
    
    // Move the No button when mouse approaches it - with increased detection area
    document.addEventListener('mousemove', (e) => {
        // Get button position and dimensions
        const btnRect = noBtn.getBoundingClientRect();
        
        // Get mouse position
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Increased detection area from 100px to 200px
        const detectionRadius = 250;
        
        // Calculate distance between mouse and button edges
        const closeToLeft = Math.abs(mouseX - btnRect.left) < detectionRadius;
        const closeToRight = Math.abs(mouseX - btnRect.right) < detectionRadius;
        const closeToTop = Math.abs(mouseY - btnRect.top) < detectionRadius;
        const closeToBottom = Math.abs(mouseY - btnRect.bottom) < detectionRadius;
        
        // If mouse is close to any edge of the button, move it
        if ((closeToLeft || closeToRight) && (closeToTop || closeToBottom)) {
            moveButton();
        }
    });
    
    // Also move button when hovering directly over it (as a fallback)
    noBtn.addEventListener('mouseover', () => {
        moveButton();
    });
    
    // Make the No button run away on mobile (touch events)
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    });
    
    // Create hearts animation when Yes is clicked
    yesBtn.addEventListener('click', () => {
        // Create celebration effect
        for (let i = 0; i < 20; i++) {
            createHeart();
        }
        
        // Redirect to a thank you page or show a message
        setTimeout(() => {
            alert('Its settled then! HEAD IT IS!!😈');
            // You can redirect to your game or another page
            window.location.href = 'index.html';
        }, 1500);
    });
    
    // Function to create floating hearts
    function createHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.classList.add('hearts');
        
        // Random position
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        
        // Random size
        const size = Math.random() * 20 + 10;
        heart.style.fontSize = size + 'px';
        
        // Random animation duration
        heart.style.animationDuration = Math.random() * 2 + 2 + 's';
        
        document.body.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 4000);
    }
    
    // Set initial position for No button
    moveButton();
    
    // Add a console log to verify the script is running
    console.log("Date script initialized with increased speed and detection area");
});
