document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const preferenceItems = document.querySelectorAll('.preference-item');
    const startButton = document.getElementById('startButton');
    const continueButton = document.getElementById('continueButton');
    const likeButton = document.querySelector('.action-btn.like');
    const dislikeButton = document.querySelector('.action-btn.dislike');
    const swipeLeftBtn = document.getElementById('swipeLeftBtn');
    const swipeRightBtn = document.getElementById('swipeRightBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const viewMatchesBtn = document.getElementById('viewMatchesBtn');
    const swipeBtn = document.getElementById('swipeBtn');
    const bottomNav = document.querySelector('.bottom-nav');
    const homeBtn = document.getElementById('homeBtn');
    const matchesBtn = document.getElementById('matchesBtn');
    const profileBtn = document.getElementById('profileBtn');
    const editBtn = document.getElementById('editBtn');
    const chatBtn = document.getElementById('chatBtn');

    function showScreen(screenId) {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');

        // Update the active nav button
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        switch (screenId) {
            case 'discover':
                document.getElementById('homeBtn').classList.add('active');
                break;
            case 'edit':
                document.getElementById('editBtn').classList.add('active');
                break;
            case 'chat':
                document.getElementById('chatBtn').classList.add('active');
                break;
            case 'profile':
                document.getElementById('profileBtn').classList.add('active');
                break;
        }
    }

    // Start button functionality
    startButton.addEventListener('click', () => {
        showScreen('preferences');
    });

    // Preference selection
    preferenceItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // Continue button functionality
    continueButton.addEventListener('click', () => {
        showScreen('discover');
    });

    // Like/Dislike functionality
    function handleSwipe(action) {
        const currentCard = document.querySelector('.profile-card');
        const newCard = createNewProfileCard();
        
        // Apply the appropriate animation classes
        currentCard.classList.add(action === 'like' ? 'slide-out-right' : 'slide-out-left');
        newCard.classList.add('fade-in');
        
        // Add the new card to the DOM
        currentCard.parentNode.appendChild(newCard);
        
        // Remove the old card and reset the new card's classes after animation
        setTimeout(() => {
            currentCard.remove();
            newCard.classList.remove('fade-in');
            
            // Reattach event listeners to the new buttons
            newCard.querySelector('#swipeLeftBtn').addEventListener('click', () => handleSwipe('dislike'));
            newCard.querySelector('#swipeRightBtn').addEventListener('click', () => handleSwipe('like'));
        }, 300);

        if (action === 'like') {
            console.log('Liked profile');
            // Add code here to handle a "like" action (e.g., update matches)
        } else {
            console.log('Disliked profile');
            // Add code here to handle a "dislike" action
        }
    }

    likeButton.addEventListener('click', () => handleSwipe('like'));
    dislikeButton.addEventListener('click', () => handleSwipe('dislike'));

    swipeLeftBtn.addEventListener('click', () => handleSwipe('dislike'));
    swipeRightBtn.addEventListener('click', () => handleSwipe('like'));

    // Swipe functionality
    const swipeContainer = document.getElementById('swipeContainer');
    const swipeOverlay = swipeContainer.querySelector('.swipe-overlay');
    const swipeLeft = swipeContainer.querySelector('.swipe-left');
    const swipeRight = swipeContainer.querySelector('.swipe-right');

    let startX, moveX;
    let isDragging = false;

    function handleStart(clientX) {
        startX = clientX;
        isDragging = true;
        swipeContainer.style.transition = 'none';
    }

    function handleMove(clientX) {
        if (!isDragging) return;
        moveX = clientX;
        const diff = moveX - startX;
        swipeContainer.style.transform = `translateX(${diff}px)`;
        updateOverlay(diff);
    }

    function handleEnd() {
        if (!isDragging) return;
        isDragging = false;
        const diff = moveX - startX;
        if (Math.abs(diff) > 100) {
            handleSwipe(diff > 0 ? 'like' : 'dislike');
        } else {
            swipeContainer.style.transition = 'transform 0.3s ease';
            swipeContainer.style.transform = 'translateX(0)';
            updateOverlay(0);
        }
    }

    function updateOverlay(diff) {
        const absDisplacement = Math.abs(diff);
        const opacity = Math.min(absDisplacement / 100, 1);
        swipeOverlay.style.opacity = opacity;

        if (diff > 0) {
            swipeRight.style.opacity = opacity;
            swipeRight.style.transform = `translateX(${Math.min(absDisplacement - 50, 0)}px)`;
            swipeLeft.style.opacity = 0;
        } else {
            swipeLeft.style.opacity = opacity;
            swipeLeft.style.transform = `translateX(${Math.max(-absDisplacement + 50, 0)}px)`;
            swipeRight.style.opacity = 0;
        }
    }

    // Touch events
    swipeContainer.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX));
    swipeContainer.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX));
    swipeContainer.addEventListener('touchend', handleEnd);

    // Mouse events
    swipeContainer.addEventListener('mousedown', (e) => handleStart(e.clientX));
    swipeContainer.addEventListener('mousemove', (e) => handleMove(e.clientX));
    swipeContainer.addEventListener('mouseup', handleEnd);
    swipeContainer.addEventListener('mouseleave', handleEnd);
});

// Helper functions for generating random profile data
function getRandomName() {
    const names = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William'];
    return names[Math.floor(Math.random() * names.length)];
}

function getRandomAge() {
    return Math.floor(Math.random() * (35 - 18 + 1)) + 18;
}

function getRandomInterests() {
    const interests = ['Fashion', 'Runway', 'Editorial', 'Commercial', 'Print', 'Fitness', 'Glamour', 'Haute Couture'];
    const numInterests = Math.floor(Math.random() * 3) + 1;
    const selectedInterests = [];
    
    while (selectedInterests.length < numInterests) {
        const interest = interests[Math.floor(Math.random() * interests.length)];
        if (!selectedInterests.includes(interest)) {
            selectedInterests.push(interest);
        }
    }
    
    return selectedInterests.join(' | ');
}

const profileCarousel = document.getElementById('profileCarousel');
let currentIndex = 0;
const profiles = []; // This will store our profile data

function createProfileCard(profile) {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.innerHTML = `
        <img src="${profile.image}" alt="Profile" class="profile-image">
        <div class="profile-info">
            <h2>${profile.name}, ${profile.age}</h2>
            <p>${profile.interests}</p>
        </div>
        <div class="swipe-overlay">
            <div class="swipe-left">✕</div>
            <div class="swipe-right">♥</div>
        </div>
    `;
    return card;
}

function loadProfiles(count = 5) {
    for (let i = 0; i < count; i++) {
        const profile = {
            name: getRandomName(),
            age: getRandomAge(),
            interests: getRandomInterests(),
            image: `https://source.unsplash.com/random/350x500/?model&t=${Date.now() + i}`
        };
        profiles.push(profile);
        const card = createProfileCard(profile);
        profileCarousel.appendChild(card);
    }
}

function showNextProfile() {
    const newCard = createNewProfileCard();
    document.getElementById('discover').appendChild(newCard);
    newCard.style.opacity = '0';
    newCard.classList.add('fade-in');
    
    // Trigger reflow to ensure the fade-in animation plays
    void newCard.offsetWidth;
    
    newCard.style.opacity = '1';
}

function updateCarouselPosition() {
    const cardWidth = profileCarousel.offsetWidth;
    profileCarousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

function handleSwipe(action) {
    const currentCard = document.querySelector('.profile-card');
    const newCard = createNewProfileCard();
    
    // Apply the appropriate animation classes
    currentCard.classList.add(action === 'like' ? 'slide-out-right' : 'slide-out-left');
    newCard.classList.add('fade-in');
    
    // Add the new card to the DOM
    currentCard.parentNode.appendChild(newCard);
    
    // Remove the old card and reset the new card's classes after animation
    setTimeout(() => {
        currentCard.remove();
        newCard.classList.remove('fade-in');
        
        // Reattach event listeners to the new buttons
        newCard.querySelector('#swipeLeftBtn').addEventListener('click', () => handleSwipe('dislike'));
        newCard.querySelector('#swipeRightBtn').addEventListener('click', () => handleSwipe('like'));
    }, 300);

    if (action === 'like') {
        console.log('Liked profile');
        // Add code here to handle a "like" action (e.g., update matches)
    } else {
        console.log('Disliked profile');
        // Add code here to handle a "dislike" action
    }
}

// Initialize the app
showScreen('discover');
