// Main JavaScript for Kuropatwa GDPS Demon List

// Initial demons data (loaded from files)
let demons = [];

// Initial players data (loaded from files)
let players = [];

// Function to detect video platform and generate appropriate thumbnail/message
function getVideoThumbnailInfo(thumbnail, videoUrl) {
    // If thumbnail is already provided, use it
    if (thumbnail && thumbnail.trim() !== "") {
        return {
            src: thumbnail,
            type: 'custom',
            message: ''
        };
    }
    
    // Check if videoUrl is empty or just "#"
    if (!videoUrl || videoUrl.trim() === "" || videoUrl.trim() === "#") {
        return {
            src: "/images/no-video.png",
            type: 'no-video',
            message: 'Brak filmu wideo'
        };
    }
    
    // Try to detect YouTube URL (all possible formats)
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = videoUrl.match(youtubeRegex);
    
    if (match && match[1]) {
        const videoId = match[1];
        return {
            src: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            type: 'youtube',
            message: ''
        };
    }
    
    // If we got here, it's some other platform or invalid URL
    return {
        src: "/images/no-video.png",
        type: 'unsupported',
        message: '<span style="color: black; font-weight: bold;">Nieobsługiwany format miniatury</span>'
    };
}

// Function to load demons from text files
async function loadDemonsFromFiles() {
    try {
        demons = [];
        let position = 1;
        
        while (true) {
            try {
                const response = await fetch(`info/demony/${position}.txt`);
                if (!response.ok) break;
                
                const data = await response.text();
                try {
                    // Try to parse as JSON first
                    const demon = JSON.parse(data);
                    // Process thumbnail info
                    demon.thumbnailInfo = getVideoThumbnailInfo(demon.thumbnail, demon.videoUrl);
                    demons.push(demon);
                } catch (jsonError) {
                    // If it's not valid JSON, evaluate it as a JavaScript object
                    console.log(`Demon file ${position} is not valid JSON, trying to evaluate as object`);
                    
                    // Create a temporary object to hold the demon data
                    const tempDemon = {
                        id: position,
                        position: position,
                        name: "Unknown Demon",
                        description: "No description available",
                        thumbnail: "",
                        videoUrl: "#"
                    };
                    
                    // Try to extract each property from the text file
                    try {
                        const idMatch = data.match(/id\s*:\s*(\d+)/);
                        const positionMatch = data.match(/position\s*:\s*(\d+)/);
                        const nameMatch = data.match(/name\s*:\s*['"]([^'"]+)['"]/);
                        const descriptionMatch = data.match(/description\s*:\s*['"]([^'"]+)['"]/);
                        const thumbnailMatch = data.match(/thumbnail\s*:\s*['"]([^'"]+)['"]/);
                        const videoUrlMatch = data.match(/videoUrl\s*:\s*['"]([^'"]+)['"]/);
                        
                        if (idMatch) tempDemon.id = parseInt(idMatch[1]);
                        if (positionMatch) tempDemon.position = parseInt(positionMatch[1]);
                        if (nameMatch) tempDemon.name = nameMatch[1];
                        if (descriptionMatch) tempDemon.description = descriptionMatch[1];
                        if (thumbnailMatch) tempDemon.thumbnail = thumbnailMatch[1];
                        if (videoUrlMatch) tempDemon.videoUrl = videoUrlMatch[1];
                        
                        // Process thumbnail info
                        tempDemon.thumbnailInfo = getVideoThumbnailInfo(tempDemon.thumbnail, tempDemon.videoUrl);
                        
                        demons.push(tempDemon);
                    } catch (parseError) {
                        console.error(`Error parsing demon file ${position}:`, parseError);
                    }
                }
                position++;
            } catch (error) {
                console.error(`Error loading demon file ${position}:`, error);
                break;
            }
        }
        
        console.log(`Loaded ${demons.length} demons from files`);
    } catch (error) {
        console.error('Error loading demons from files:', error);
    }
}

// Function to calculate player points based on completed demons
function calculatePlayerPoints(completedDemons) {
    if (!completedDemons || !Array.isArray(completedDemons) || completedDemons.length === 0) {
        return 0;
    }
    
    let totalPoints = 0;
    
    // Map of difficulty to points
    const difficultyPoints = {
        'easy': 1,
        'medium': 2,
        'hard': 4,
        'insane': 6,
        'extreme': 10
    };
    
    // Check each completed demon and add points based on difficulty
    completedDemons.forEach(demonId => {
        // Find the demon in the demons array
        const demon = demons.find(d => d.id === demonId);
        if (demon && demon.difficulty) {
            const difficulty = demon.difficulty.toLowerCase();
            if (difficultyPoints[difficulty]) {
                totalPoints += difficultyPoints[difficulty];
            }
        }
    });
    
    return totalPoints;
}

// Function to load players from text files
async function loadPlayersFromFiles() {
    try {
        players = [];
        let position = 1;
        
        while (true) {
            try {
                const response = await fetch(`info/gracze/${position}.txt`);
                if (!response.ok) break;
                
                const data = await response.text();
                try {
                    // Try to parse as JSON first
                    const player = JSON.parse(data);
                    
                    // Ensure completedDemons is an array
                    if (!player.completedDemons) {
                        player.completedDemons = [];
                    }
                    
                    players.push(player);
                } catch (jsonError) {
                    // If it's not valid JSON, evaluate it as a JavaScript object
                    console.log(`Player file ${position} is not valid JSON, trying to evaluate as object`);
                    
                    // Create a temporary object to hold the player data
                    const tempPlayer = {
                        id: position,
                        position: position,
                        name: "Unknown Player",
                        description: "No description available",
                        completedDemons: []
                    };
                    
                    // Try to extract each property from the text file
                    try {
                        const idMatch = data.match(/id\s*:\s*(\d+)/);
                        const positionMatch = data.match(/position\s*:\s*(\d+)/);
                        const nameMatch = data.match(/name\s*:\s*['"]([^'"]+)['"]/);
                        const descriptionMatch = data.match(/description\s*:\s*['"]([^'"]+)['"]/);
                        
                        // Extract completedDemons array
                        const completedDemonsMatch = data.match(/completedDemons\s*:\s*\[([\d\s,]*)\]/);
                        
                        if (idMatch) tempPlayer.id = parseInt(idMatch[1]);
                        if (positionMatch) tempPlayer.position = parseInt(positionMatch[1]);
                        if (nameMatch) tempPlayer.name = nameMatch[1];
                        if (descriptionMatch) tempPlayer.description = descriptionMatch[1];
                        
                        if (completedDemonsMatch && completedDemonsMatch[1]) {
                            tempPlayer.completedDemons = completedDemonsMatch[1].split(',')
                                .map(id => parseInt(id.trim()))
                                .filter(id => !isNaN(id));
                        }
                        
                        players.push(tempPlayer);
                    } catch (parseError) {
                        console.error(`Error parsing player file ${position}:`, parseError);
                    }
                }
                position++;
            } catch (error) {
                console.error(`Error loading player file ${position}:`, error);
                break;
            }
        }
        
        console.log(`Loaded ${players.length} players from files`);
    } catch (error) {
        console.error('Error loading players from files:', error);
    }
}

// Generate random color theme using predefined gradients
function generateRandomTheme() {
    // Predefined gradient themes
    const gradientThemes = [
        '--gradient-red-orange',
        '--gradient-yellow-orange', 
        '--gradient-green-teal',
        '--gradient-blue-purple',
        '--gradient-pink-purple'
    ];
    
    // Select random gradient theme
    const selectedGradient = gradientThemes[Math.floor(Math.random() * gradientThemes.length)];
    
    // Apply the selected gradient to all gradient elements
    document.documentElement.style.setProperty('--current-gradient', `var(${selectedGradient})`);
    
    // Generate background shapes
    createBackgroundShapes();
    
    return selectedGradient;
}

// Apply a color theme
function applyRandomTheme() {
    // Generate a random theme
    generateRandomTheme();
}

// Create geometric shapes across the background
function createBackgroundShapes() {
    // Remove any existing background shapes
    document.querySelectorAll('.bg-shape').forEach(shape => shape.remove());
    
    // Select a single shape type randomly for this page load
    const shapes = ['triangle', 'square', 'circle', 'diamond'];
    const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    const numShapes = Math.floor(Math.random() * 8) + 8; // 8-15 shapes
    
    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        shape.className = `bg-shape ${selectedShape}`;
        
        // Random position across the entire page
        const top = Math.floor(Math.random() * 90) + 5; // 5-95%
        const left = Math.floor(Math.random() * 90) + 5; // 5-95%
        
        // Random rotation (except for circle)
        let rotation = 0;
        if (selectedShape !== 'circle') {
            rotation = Math.floor(Math.random() * 360);
        }
        
        // Apply styles
        shape.style.top = `${top}%`;
        shape.style.left = `${left}%`;
        
        // Use current gradient for all shapes
        shape.style.background = 'var(--current-gradient)';
        shape.style.opacity = '0.1';
        
        // Apply extra rotation if needed
        if (rotation > 0 && selectedShape !== 'circle') {
            if (selectedShape === 'diamond') {
                shape.style.transform = `rotate(${rotation + 45}deg)`;
            } else {
                shape.style.transform = `rotate(${rotation}deg)`;
            }
        }
        
        // Add random movement properties
        const moveDuration = Math.floor(Math.random() * 60) + 60;
        const moveDelay = Math.floor(Math.random() * 15);
        const moveX = Math.random() > 0.5 ? 1 : -1;
        const moveY = Math.random() > 0.5 ? 1 : -1;
        
        // Store original position as CSS variables
        shape.style.setProperty('--original-top', `${top}%`);
        shape.style.setProperty('--original-left', `${left}%`);
        
        // Set CSS variables for the animation to use
        shape.style.setProperty('--move-duration', `${moveDuration}s`);
        shape.style.setProperty('--move-delay', `${moveDelay}s`);
        shape.style.setProperty('--move-x', moveX);
        shape.style.setProperty('--move-y', moveY);
        
        // Add movement class to enable the animation
        shape.classList.add('moving-shape');
        
        document.body.appendChild(shape);
    }
}

// Funkcja generująca nieskończoną liczbę palet kolorów dla gradientów
function generateGradient() {
    // Generowanie losowego kąta gradientu (0-360)
    const angle = Math.floor(Math.random() * 360);
    
    // Generowanie pierwszego koloru w przestrzeni HSL
    const hue1 = Math.floor(Math.random() * 360);
    const sat1 = Math.floor(Math.random() * 30) + 60; // 60-90%
    const light1 = Math.floor(Math.random() * 20) + 40; // 40-60%
    
    // Generowanie drugiego koloru - powiązanego z pierwszym dla harmonijności
    // Możemy użyć komplementarnego, analogicznego lub monochromatycznego koloru
    let hue2;
    const colorScheme = Math.floor(Math.random() * 3);
    
    if (colorScheme === 0) {
        // Komplementarny (po przeciwnej stronie koła kolorów)
        hue2 = (hue1 + 180) % 360;
    } else if (colorScheme === 1) {
        // Analogiczny (blisko na kole kolorów)
        hue2 = (hue1 + 30 + Math.floor(Math.random() * 60)) % 360;
    } else {
        // Monochromatyczny (ten sam odcień, inna jasność/nasycenie)
        hue2 = hue1;
    }
    
    const sat2 = Math.floor(Math.random() * 30) + 60; // 60-90%
    const light2 = Math.floor(Math.random() * 20) + 40; // 40-60%
    
    // Tworzenie gradientu
    return `linear-gradient(${angle}deg, hsl(${hue1}, ${sat1}%, ${light1}%), hsl(${hue2}, ${sat2}%, ${light2}%))`;
}

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Apply random theme
    applyRandomTheme();
    
    // Load data from files
    Promise.all([loadDemonsFromFiles(), loadPlayersFromFiles()]).then(() => {
        // Display demons in appropriate tabs
        displayContent();
    });
    
    // Setup tab navigation
    setupTabs();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Add event listeners for modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
});

// Theme Toggle Functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeTooltip = document.getElementById('theme-tooltip');
    const body = document.body;
    let clickCount = 0;
    let lastClickTime = null;
    
    // Show tooltip when page loads - just show briefly and fade out
    setTimeout(() => {
        themeTooltip.classList.add('show');
        // Remove the overlay immediately, don't blur background
        setTimeout(() => {
            themeTooltip.classList.remove('show');
        }, 3000);
    }, 1000);
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        updateThemeIcon('dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-theme');
        
        // Track click time for secret feature
        const currentTime = new Date().getTime();
        
        // If last click was less than 500ms ago, count as rapid click
        if (lastClickTime && (currentTime - lastClickTime < 500)) {
            clickCount++;
            
            if (clickCount === 10) {
                body.classList.add('rainbow-mode');
                // Play anime disco music via YouTube embed
                try {
                    const iframe = document.getElementById('rainbow-music');
                    // Set YouTube URL with autoplay and start time (50 seconds)
                    iframe.src = "https://www.youtube.com/embed/6-8E4Nirh9s?autoplay=1&start=50";
                } catch (error) {
                    console.error("Audio error:", error);
                }
            }
        } else {
            // Reset counter if clicking too slowly
            clickCount = 1;
        }
        
        // Update last click time
        lastClickTime = currentTime;
        
        if (isDark) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            updateThemeIcon('light');
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon('dark');
        }
    });
    
    // Don't restore rainbow mode on refresh
    localStorage.removeItem('rainbow-mode');
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Setup tab navigation
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.id.replace('tab-', 'tab-content-');
            document.getElementById(tabId).classList.add('active');
            
            // On mobile, hide the navigation after clicking a tab
            const tabNavigation = document.getElementById('tab-navigation');
            if (window.innerWidth <= 480) {
                tabNavigation.classList.remove('show');
            }
        });
    });
}

// Setup mobile menu toggle
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const tabNavigation = document.getElementById('tab-navigation');
    
    if (mobileMenuToggle && tabNavigation) {
        mobileMenuToggle.addEventListener('click', () => {
            // If menu is currently showing, close it with animation
            if (tabNavigation.classList.contains('show')) {
                // Add closing animation class
                tabNavigation.classList.add('closing');
                
                // Wait for animation to finish before hiding
                setTimeout(() => {
                    tabNavigation.classList.remove('show');
                    tabNavigation.classList.remove('closing');
                }, 300); // Match animation duration
            } else {
                // Open menu with animation
                tabNavigation.classList.add('show');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('#mobile-menu-toggle') && 
                !event.target.closest('#tab-navigation') &&
                tabNavigation.classList.contains('show')) {
                tabNavigation.classList.remove('show');
            }
        });
        
        // Close menu on window resize if width becomes > 480px
        window.addEventListener('resize', () => {
            if (window.innerWidth > 480 && tabNavigation.classList.contains('show')) {
                tabNavigation.classList.remove('show');
            }
        });
    }
}

// Display content in the appropriate containers
function displayContent() {
    // Display demons
    displayDemons();
    
    // Display players
    displayPlayers();
}

// Display demons in the appropriate containers based on their position
function displayDemons() {
    const containerTop10 = document.getElementById('demons-container-top10');
    const containerExtended = document.getElementById('demons-container-extended');
    
    if (!containerTop10 || !containerExtended) return;
    
    // Clear containers
    containerTop10.innerHTML = '';
    containerExtended.innerHTML = '';
    
    // Sort demons by position
    const sortedDemons = [...demons].sort((a, b) => a.position - b.position);
    
    if (sortedDemons.length === 0) {
        // Show simple "no content" message
        containerTop10.innerHTML = '<div class="no-content">Brak demonów na liście</div>';
        containerExtended.innerHTML = '<div class="no-content">Brak demonów na liście</div>';
        return;
    }
    
    // Create and append demon cards with smooth animation
    sortedDemons.forEach((demon, index) => {
        // Top 10 demons go to the Top 10 section
        if (demon.position <= 10) {
            const card = createDemonCard(demon);
            card.style.animation = `slideUp 0.5s ease-out ${index * 0.1}s forwards`;
            containerTop10.appendChild(card);
        }
        
        // All demons go to the Extended list
        const extendedCard = createDemonCard(demon);
        extendedCard.style.animation = `slideUp 0.5s ease-out ${index * 0.1}s forwards`;
        containerExtended.appendChild(extendedCard);
    });
}

// Display players in the players container
function displayPlayers() {
    const container = document.getElementById('players-container');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Calculate points for each player based on completed demons
    players.forEach(player => {
        player.points = calculatePlayerPoints(player.completedDemons);
    });
    
    // Sort players by points (descending)
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    
    // Update positions based on sorted order
    sortedPlayers.forEach((player, index) => {
        player.position = index + 1;
    });
    
    if (sortedPlayers.length === 0) {
        // Show simple "no content" message
        container.innerHTML = '<div class="no-content">Brak graczy na liście</div>';
        return;
    }
    
    // Create and append player cards with smooth animation
    sortedPlayers.forEach((player, index) => {
        const card = createPlayerCard(player);
        card.style.animation = `slideUp 0.5s ease-out ${index * 0.1}s forwards`;
        container.appendChild(card);
    });
}

// Create a demon card element
function createDemonCard(demon) {
    const card = document.createElement('div');
    card.className = 'demon-card';
    card.style.opacity = '0'; // Start invisible for animation
    
    const thumbnailInfo = demon.thumbnailInfo || getVideoThumbnailInfo(demon.thumbnail, demon.videoUrl);
    const isNoVideo = thumbnailInfo.type === 'no-video' || thumbnailInfo.type === 'unsupported';
    
    // Generate a gradient for the position badge based on position
    const gradient = generateGradientForPosition(demon.position);
    
    // Determine difficulty level
    const difficultyText = demon.difficulty ? `${demon.difficulty.charAt(0).toUpperCase() + demon.difficulty.slice(1)} Demon` : "Demon";
    const difficultyClass = demon.difficulty ? `difficulty-${demon.difficulty.toLowerCase()}` : "";
    
    card.innerHTML = `
        <div class="demon-content">
            <div style="display: flex; align-items: center;">
                <div class="demon-position" style="background: ${gradient}">#${demon.position}</div>
                <h3 class="demon-name">${demon.name}</h3>
            </div>
            <div class="demon-info">
                <p class="demon-description">${demon.description}</p>
                <div class="demon-difficulty ${difficultyClass}">${difficultyText}</div>
            </div>
        </div>
        <div class="demon-thumbnail ${isNoVideo ? 'no-video' : ''}" data-video="${demon.videoUrl}">
            ${isNoVideo ? `
                <i class="fas fa-video-slash" style="font-size: 48px; color: #444444;"></i>
                <span class="thumbnail-message">${thumbnailInfo.message}</span>
            ` : `
                <img src="${thumbnailInfo.src}" alt="${demon.name}" style="width: 100%; height: 100%; object-fit: contain;" 
                    onerror="this.parentElement.innerHTML='<i class=\\'fas fa-video-slash\\' style=\\'font-size: 48px; color: #444444;\\'></i><span class=\\'thumbnail-message\\' style=\\'color: #444444; font-weight: bold;\\'>Nieobsługiwany format miniatury</span>'; this.parentElement.className += ' no-video';">
            `}
        </div>
    `;
    
    // Add click event to thumbnail
    const thumbnail = card.querySelector('.demon-thumbnail');
    if (thumbnail) {
        thumbnail.addEventListener('click', function() {
            const videoUrl = this.dataset.video;
        
            // Check if it's a YouTube URL
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                window.open(videoUrl, '_blank');
            } 
            // Check if it's a direct video file
            else if (videoUrl.match(/\.(mp4|avi|mkv|mov|webm)$/i)) {
                // Create a modal to play the video
                const videoModal = document.createElement('div');
                videoModal.className = 'modal-overlay active';
                videoModal.innerHTML = `
                    <div class="modal video-modal">
                        <h2>${demon.name}</h2>
                        <video controls autoplay width="100%">
                            <source src="${videoUrl}" type="video/${videoUrl.split('.').pop().toLowerCase()}">
                            Your browser does not support the video tag.
                        </video>
                        <div class="modal-buttons">
                            <button type="button" class="btn btn-secondary close-video-modal">Zamknij</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(videoModal);
                document.querySelector('.close-video-modal').addEventListener('click', () => {
                    videoModal.remove();
                });
            } 
            // Other video URLs
            else if (videoUrl && videoUrl !== "#") {
                window.open(videoUrl, '_blank');
            }
        });
    }
    
    return card;
}

// Create a player card element
function createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.style.opacity = '0'; // Start invisible for animation
    
    // Get completed demons details
    const completedDemonsInfo = getCompletedDemonsInfo(player.completedDemons);
    
    card.innerHTML = `
        <div class="player-content">
            <div class="player-position">#${player.position}</div>
            <div class="player-info">
                <h3 class="player-name">${player.name}</h3>
                <div class="player-points">${player.points} punktów</div>
                <p class="player-description">${player.description}</p>
                <div class="player-completed-demons">
                    <div class="completed-demons-header">Ukończone demony:</div>
                    <div class="completed-demons-list">
                        ${completedDemonsInfo.length > 0 ? completedDemonsInfo.join('') : '<span class="no-demons">Brak ukończonych demonów</span>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Get HTML for completed demons
function getCompletedDemonsInfo(completedDemonIds) {
    if (!completedDemonIds || !Array.isArray(completedDemonIds) || completedDemonIds.length === 0) {
        return [];
    }
    
    return completedDemonIds.map(demonId => {
        const demon = demons.find(d => d.id === demonId);
        if (!demon) return '';
        
        // Determine difficulty class
        const difficultyClass = demon.difficulty ? `difficulty-${demon.difficulty.toLowerCase()}` : "";
        
        return `<div class="completed-demon ${difficultyClass}">
            <span class="completed-demon-position">#${demon.position}</span>
            <span class="completed-demon-name">${demon.name}</span>
        </div>`;
    });
}

// Open a modal
function openModal(modalId) {
    // Close any open modals first
    closeAllModals();
    
    // Open the requested modal
    const modalOverlay = document.getElementById(modalId);
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
    }
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Restore background scrolling
    document.body.style.overflow = '';
}

// Function to get a random gradient from the infinite palette system
function getRandomGradient() {
    return generateGradient();
}

// Function to generate a gradient based on demon position - uses current theme gradient
function generateGradientForPosition(position) {
    // Use the current theme gradient
    return 'var(--current-gradient, var(--gradient-blue-purple))';
}

// Function to save data (empty implementation as this is now server-side)
function saveData() {
    console.log('Data saving would happen server-side');
    // In a real application, this would send data to the server
}