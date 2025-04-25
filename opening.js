document.addEventListener('DOMContentLoaded', () => {
    const loveQuestBtn = document.getElementById('love-quest-btn');
    const surpriseBtn = document.getElementById('surprise-btn');
    
    // Create floating hearts in the background
    createBackgroundHearts();
    
    // Add click event for Love Quest button
    loveQuestBtn.addEventListener('click', () => {
        // Add a little animation before redirecting
        loveQuestBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            window.location.href = 'love-quest.html';
        }, 300);
    });
    
    // Add click event for Surprise button
    surpriseBtn.addEventListener('click', () => {
        // Add a little animation before redirecting
        surpriseBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            window.location.href = 'date.html';
        }, 300);
    });
    
    // Function to create floating hearts in the background
    function createBackgroundHearts() {
        // Create initial hearts
        for (let i = 0; i < 15; i++) {
            createHeart();
        }
        
        // Continue creating hearts periodically
        setInterval(createHeart, 200);
    }
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = ['❤️', '💕', '💖', '💘', '💓', '💗', '💝'][Math.floor(Math.random() * 7)];
        heart.classList.add('hearts');
        
        // Random position at the bottom of the screen
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.bottom = '-20px';
        
        // Random size
        const size = Math.random() * 30 + 15;
        heart.style.fontSize = size + 'px';
        
        // Random animation duration
        const duration = Math.random() * 4 + 6;
        heart.style.animationDuration = duration + 's';
        
        document.body.appendChild(heart);
        
        // Remove heart after animation completes
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }
});