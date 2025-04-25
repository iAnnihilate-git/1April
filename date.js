document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const container = document.querySelector('.buttons-container');
    
    // Create audio element for the yes button click
    const yesSound = new Audio('assets/date2.mp3');
    
    // Flag to track if 10 seconds have passed
    let canClickNo = false;
    
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
        // Only move the button if 10 seconds haven't passed yet
        if (!canClickNo) {
            const newPos = getRandomPosition();
            
            // Add transition speed control - faster transition
            noBtn.style.transition = 'left 0.15s, top 0.15s';
            noBtn.style.left = newPos.x + 'px';
            noBtn.style.top = newPos.y + 'px';
        }
    }
    
    // Move the No button when mouse approaches it - with increased detection area
    document.addEventListener('mousemove', (e) => {
        // Only check for movement if 10 seconds haven't passed yet
        if (!canClickNo) {
            // Get button position and dimensions
            const btnRect = noBtn.getBoundingClientRect();
            
            // Get mouse position
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // No button detection area
            const detectionRadius = 50;
            
            // Calculate distance between mouse and button edges
            const closeToLeft = Math.abs(mouseX - btnRect.left) < detectionRadius;
            const closeToRight = Math.abs(mouseX - btnRect.right) < detectionRadius;
            const closeToTop = Math.abs(mouseY - btnRect.top) < detectionRadius;
            const closeToBottom = Math.abs(mouseY - btnRect.bottom) < detectionRadius;
            
            // If mouse is close to any edge of the button, move it
            if ((closeToLeft || closeToRight) && (closeToTop || closeToBottom)) {
                moveButton();
            }
        }
    });
    
    // Also move button when hovering directly over it (as a fallback)
    noBtn.addEventListener('mouseover', () => {
        if (!canClickNo) {
            moveButton();
        }
    });
    
    // Make the No button run away on mobile (touch events)
    noBtn.addEventListener('touchstart', (e) => {
        if (!canClickNo) {
            e.preventDefault();
            moveButton();
        }
    });
    
    // Function to handle Yes button click
    function handleYesClick() {
        // Play the sound
        yesSound.play()
            .catch(error => {
                console.log("Error playing sound:", error);
                // Continue with the rest of the function even if sound fails
            });
        
        // Create celebration effect
        for (let i = 0; i < 20; i++) {
            createHeart();
        }
        
        // Redirect to a thank you page or show a message
        setTimeout(() => {
            alert('Its settled then! DATE IT IS!!🥰');
            // You can redirect to your game or another page
            window.location.href = 'index.html';
        }, 1500);
    }
    
    // Create hearts animation when Yes is clicked
    yesBtn.addEventListener('click', handleYesClick);
    
    // Handle No button click after 10 seconds
    noBtn.addEventListener('click', () => {
        if (canClickNo) {
            // Remove the No button
            noBtn.style.display = 'none';
            
            // Create multiple Yes buttons all over the page (increased to 200)
            for (let i = 0; i < 200; i++) {
                // Add a small delay between button creation to avoid freezing the browser
                setTimeout(() => {
                    createYesButton();
                }, i * 10); // 10ms delay between each button creation
            }
        }
    });
    
    // Function to create a new Yes button
    function createYesButton() {
        // Create a new button element
        const newYesBtn = document.createElement('button');
        
        // Copy text content
        newYesBtn.textContent = yesBtn.textContent;
        
        // Set ID to yes-btn to match CSS selector
        // This is the key change - using the same ID will apply the same CSS rules including hover effects
        newYesBtn.id = 'yes-btn';
        
        // Position absolutely
        newYesBtn.style.position = 'fixed'; // Use fixed instead of absolute to position relative to viewport
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get the position of the "DATE?" text to avoid placing buttons over it
        const dateText = document.querySelector('h1') || document.querySelector('.date-text');
        let dateTextRect = { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
        
        if (dateText) {
            dateTextRect = dateText.getBoundingClientRect();
        }
        
        // Generate random position, avoiding the "DATE?" text area
        let posX, posY;
        let overlap = true;
        let attempts = 0;
        
        // Try to find a non-overlapping position (with a limit on attempts)
        while (overlap && attempts < 20) {
            posX = Math.random() * (viewportWidth - 150); // 150px is approximate button width
            posY = Math.random() * (viewportHeight - 60); // 60px is approximate button height
            
            // Check if this position overlaps with the DATE text
            overlap = !(
                posX > dateTextRect.right + 10 || // 10px buffer
                posX + 150 < dateTextRect.left - 10 ||
                posY > dateTextRect.bottom + 10 ||
                posY + 60 < dateTextRect.top - 10
            );
            
            attempts++;
        }
        
        // Set the position
        newYesBtn.style.left = posX + 'px';
        newYesBtn.style.top = posY + 'px';
        
        // Add click event
        newYesBtn.addEventListener('click', handleYesClick);
        
        // Add to document body instead of container to position all over the page
        document.body.appendChild(newYesBtn);
    }
    
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
    
    // After 10 seconds, allow clicking the No button
    setTimeout(() => {
        canClickNo = true;
        console.log("No button can now be clicked");
        
        // Add a visual indicator that the No button is now clickable
        noBtn.style.boxShadow = '0 0 15px #ff0000';
        noBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            noBtn.style.transform = 'scale(1)';
        }, 300);
    }, 10000);
    
    // Add a console log to verify the script is running
    console.log("Date script initialized with increased speed and detection area");
});
