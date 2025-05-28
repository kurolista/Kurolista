// Main JavaScript for Kuropatwa GDPS Demon List

// Initial demons data (loaded from files)
let demons = [];

// Initial players data (loaded from files)
let players = [];

// Store the original state of data
const originalDemons = [...demons];
const originalPlayers = [...players];

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
                        thumbnail: "https://via.placeholder.com/640x360?text=No+Thumbnail",
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
                    players.push(player);
                } catch (jsonError) {
                    // If it's not valid JSON, evaluate it as a JavaScript object
                    console.log(`Player file ${position} is not valid JSON, trying to evaluate as object`);
                    
                    // Create a temporary object to hold the player data
                    const tempPlayer = {
                        id: position,
                        position: position,
                        name: "Unknown Player",
                        points: 0,
                        description: "No description available"
                    };
                    
                    // Try to extract each property from the text file
                    try {
                        const idMatch = data.match(/id\s*:\s*(\d+)/);
                        const positionMatch = data.match(/position\s*:\s*(\d+)/);
                        const nameMatch = data.match(/name\s*:\s*['"]([^'"]+)['"]/);
                        const pointsMatch = data.match(/points\s*:\s*(\d+)/);
                        const descriptionMatch = data.match(/description\s*:\s*['"]([^'"]+)['"]/);
                        
                        if (idMatch) tempPlayer.id = parseInt(idMatch[1]);
                        if (positionMatch) tempPlayer.position = parseInt(positionMatch[1]);
                        if (nameMatch) tempPlayer.name = nameMatch[1];
                        if (pointsMatch) tempPlayer.points = parseInt(pointsMatch[1]);
                        if (descriptionMatch) tempPlayer.description = descriptionMatch[1];
                        
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

// Current content type (demons or players)
let currentContentType = 'demons';

// Generate random color theme using HSL to ensure harmonious colors
function generateRandomTheme() {
    // Generate a random base hue (0-360)
    const baseHue = Math.floor(Math.random() * 360);
    
    // Create variations based on the hue for a cohesive theme
    // Primary color (medium saturation, medium lightness)
    const primary = hslToHex(baseHue, 70, 55);
    
    // Dark variant (same hue, higher saturation, lower lightness)
    const dark = hslToHex(baseHue, 80, 30);
    
    // Light variant (same hue, lower saturation, higher lightness)
    const light = hslToHex(baseHue, 60, 75);
    
    // Very light variant (same hue, even lower saturation, even higher lightness)
    const veryLight = hslToHex(baseHue, 30, 90);
    
    // Accent color (complementary hue - 180 degrees away, high saturation)
    const accentHue = (baseHue + 180) % 360;
    const accent = hslToHex(accentHue, 80, 60);
    
    // Apply transparent versions to CSS
    document.documentElement.style.setProperty('--applied-primary-transparent', `hsla(${baseHue}, 70%, 55%, 0.15)`);
    document.documentElement.style.setProperty('--applied-accent-transparent', `hsla(${accentHue}, 80%, 60%, 0.15)`);
    
    // Generate background shapes only (no sidebar shapes)
    createBackgroundShapes(baseHue, accentHue);
    
    return {
        primary,
        dark,
        light,
        veryLight,
        accent,
        hue: baseHue
    };
}

// Create dynamic background effects
function createBackgroundEffects(primaryHue, accentHue) {
    // Add some subtle, random background elements
    const body = document.body;
    
    // Clear any existing effects
    const existingEffects = document.querySelectorAll('.bg-effect');
    existingEffects.forEach(el => el.remove());
    
    // Create 8-12 random elements
    const numElements = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < numElements; i++) {
        const effect = document.createElement('div');
        effect.className = 'bg-effect';
        
        // Random size between 50px and 200px
        const size = Math.floor(Math.random() * 150) + 50;
        
        // Random position
        const top = Math.floor(Math.random() * 100);
        const left = Math.floor(Math.random() * 100);
        
        // Random transparency
        const opacity = (Math.random() * 0.07) + 0.03;  // 0.03 to 0.1
        
        // Random shape (circle or square with rounded corners)
        const borderRadius = Math.random() > 0.5 ? '50%' : Math.floor(Math.random() * 50) + '%';
        
        // Use either primary or accent hue
        const hue = Math.random() > 0.5 ? primaryHue : accentHue;
        const saturation = Math.floor(Math.random() * 30) + 60; // 60-90%
        const lightness = Math.floor(Math.random() * 20) + 50; // 50-70%
        
        // Apply styles
        effect.style.width = `${size}px`;
        effect.style.height = `${size}px`;
        effect.style.top = `${top}%`;
        effect.style.left = `${left}%`;
        effect.style.opacity = opacity;
        effect.style.borderRadius = borderRadius;
        effect.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        effect.style.filter = 'blur(40px)';
        
        document.body.appendChild(effect);
    }
}

// Convert HSL values to hex color code
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Background pattern function removed (not needed anymore)

// Apply a color theme
function applyRandomTheme() {
    // Generate a random theme
    const theme = generateRandomTheme();
    
    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--applied-primary', theme.primary);
    document.documentElement.style.setProperty('--applied-dark', theme.dark);
    document.documentElement.style.setProperty('--applied-light', theme.light);
    document.documentElement.style.setProperty('--applied-very-light', theme.veryLight);
    document.documentElement.style.setProperty('--applied-accent', theme.accent);
    
    // Sidebar shapes removed
}

// Sidebar shapes function removed

// Create geometric shapes across the background
function createBackgroundShapes(baseHue, accentHue) {
    // Remove any existing background shapes
    document.querySelectorAll('.bg-shape').forEach(shape => shape.remove());
    
    // Select a single shape type randomly for this page load
    const shapes = ['triangle', 'square', 'circle', 'diamond'];
    const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    const numShapes = Math.floor(Math.random() * 8) + 8; // 8-15 shapes (fewer but larger shapes)
    
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
        
        // Slightly darker color than the background
        const hue = Math.random() > 0.5 ? baseHue : accentHue;
        const saturation = Math.floor(Math.random() * 20) + 30; // 30-50%
        const lightness = Math.floor(Math.random() * 15) + 20; // 20-35%
        
        // Apply styles
        shape.style.top = `${top}%`;
        shape.style.left = `${left}%`;
        
        // For triangle, we need to set the border-bottom-color
        if (selectedShape === 'triangle') {
            shape.style.borderBottomColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        } else {
            shape.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }
        
        // Apply extra rotation if needed
        if (rotation > 0 && selectedShape !== 'circle') {
            if (selectedShape === 'diamond') {
                shape.style.transform = `rotate(${rotation + 45}deg)`;
            } else {
                shape.style.transform = `rotate(${rotation}deg)`;
            }
        }
        
        // Add random movement properties
        // Generate random duration between 60-120 seconds for very slow movement
        const moveDuration = Math.floor(Math.random() * 60) + 60;
        
        // Generate random delay so shapes don't all move in sync
        const moveDelay = Math.floor(Math.random() * 15);
        
        // Set random direction for horizontal and vertical movement
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
    
    // Setup admin button
    setupAdminButton();
    
    // Add event listeners for modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
        // Admin setup removed
});

// Admin content tabs function removed

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
        });
    });
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
        // Show simple "no content" message instead of WordPress placeholders
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

// This function is no longer used in the main interface
// It was previously used to show WordPress code examples
function createPlaceholderDemon(isTop10) {
    // Return a simple no content message
    const container = document.createElement('div');
    container.className = 'no-content';
    container.textContent = 'Brak demonów na liście';
    return container;
}

// Display players in the players container
function displayPlayers() {
    const container = document.getElementById('players-container');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Sort players by points (descending)
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    
    // Update positions based on sorted order
    sortedPlayers.forEach((player, index) => {
        player.position = index + 1;
    });
    
    if (sortedPlayers.length === 0) {
        // Show simple "no content" message instead of WordPress placeholder
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

// This function is no longer used in the main interface
// It was previously used to show WordPress code examples
function createPlaceholderPlayer() {
    // Return a simple no content message
    const container = document.createElement('div');
    container.className = 'no-content';
    container.textContent = 'Brak graczy na liście';
    return container;
}

// Create a demon card element
function createDemonCard(demon) {
    const card = document.createElement('div');
    card.className = 'demon-card';
    card.style.opacity = '0'; // Start invisible for animation
    
    card.innerHTML = `
        <div class="demon-content">
            <div class="demon-position">#${demon.position}</div>
            <div class="demon-info">
                <h3 class="demon-name">${demon.name}</h3>
                <p class="demon-description">${demon.description}</p>
            </div>
        </div>
        <img src="${demon.thumbnail}" alt="${demon.name}" class="demon-thumbnail" data-video="${demon.videoUrl}">
    `;
    
    // Add click event to thumbnail
    card.querySelector('.demon-thumbnail').addEventListener('click', function() {
        const videoUrl = this.dataset.video;
        
        // Check if it's a YouTube URL
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            window.open(videoUrl, '_blank');
        } 
        // Check if it's a Medal URL
        else if (videoUrl.includes('medal.tv')) {
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
        // Other video URLs (could be streaming sites, etc.)
        else {
            window.open(videoUrl, '_blank');
        }
    });
    
    return card;
}

// Create a player card element
function createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.style.opacity = '0'; // Start invisible for animation
    
    card.innerHTML = `
        <div class="player-content">
            <div class="player-position">#${player.position}</div>
            <div class="player-info">
                <h3 class="player-name">${player.name}</h3>
                <div class="player-points">${player.points} punktów</div>
                <p class="player-description">${player.description}</p>
            </div>
        </div>
    `;
    
    return card;
}

// Admin button handler removed

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
    
    // No need to hide forms anymore since they're part of the admin panel
    
    // Restore background scrolling
    document.body.style.overflow = '';
}

// Counter for failed login attempts
let loginAttempts = 0;

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    
    // Remove any existing error message
    const existingError = document.getElementById('password-error');
    if (existingError) {
        existingError.remove();
    }
    
    if (password === 'p27HKa8QjQV7HYd') {
        // Reset login attempts
        loginAttempts = 0;
        
        // Close login modal
        closeAllModals();
        
        // Show admin panel modal
        openModal('admin-panel-modal');
        
        // Make sure demon form is visible with default tab (demons)
        document.getElementById('demons-form-container').style.display = 'block';
        document.getElementById('players-form-container').style.display = 'none';
        
        // Reset forms to ensure they're in add mode
        resetDemonForm();
        resetPlayerForm();
        
        // Load admin lists
        displayAdminDemonList();
        displayAdminPlayerList();
    } else {
        // Increment login attempts
        loginAttempts++;
        
        // Add inline error message
        const errorMsg = document.createElement('div');
        errorMsg.id = 'password-error';
        errorMsg.className = 'password-error';
        
        // Check for special password
        if (password === 'Bob to cwel') {
            errorMsg.textContent = 'Hasło dalej złe ale prawdziwe :)';
        } else {
            errorMsg.textContent = 'Nieprawidłowe hasło!';
        }
        
        // Insert after password field
        const passwordField = document.getElementById('admin-password');
        passwordField.parentNode.insertBefore(errorMsg, passwordField.nextSibling);
        
        // Check if we should trigger angry mode (after 5 attempts)
        if (loginAttempts >= 5) {
            triggerAngryMode();
        }
    }
    
    // Clear password field
    document.getElementById('admin-password').value = '';
}

// Trigger angry mode effects
function triggerAngryMode() {
    // Add angry mode class to body
    document.body.classList.add('angry-mode');
    
    // Create explosion elements across the page
    createExplosionElements();
    
    // Create floating error messages
    createFloatingErrors();
    
    // Make all elements float
    makeElementsFloat();
    
    // Create more explosions every second
    const explosionInterval = setInterval(() => {
        createRandomExplosions();
    }, 1000);
    
    // Store interval ID in window object so it persists
    window.angryModeInterval = explosionInterval;
    
    // No timeout to reset - only page refresh will fix it
}

// Create explosion elements in the login modal
function createExplosionElements() {
    // Remove any existing explosion pieces
    document.querySelectorAll('.explosion-piece').forEach(el => el.remove());
    
    // Create random explosion pieces
    const numPieces = 30;
    const container = document.querySelector('.modal-overlay.active');
    
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    for (let i = 0; i < numPieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'explosion-piece';
        
        // Random size
        const size = Math.random() * 100 + 30;
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        
        // Start position (center of modal)
        piece.style.left = `${centerX}px`;
        piece.style.top = `${centerY}px`;
        
        // Random rotation
        const rotation = Math.random() * 360;
        piece.style.transform = `rotate(${rotation}deg)`;
        
        // Random delay
        const delay = Math.random() * 0.5;
        piece.style.animationDelay = `${delay}s`;
        
        // Random direction for explosion (CSS variables for animation)
        const angle = Math.random() * Math.PI * 2; // Random angle in radians
        const distance = Math.random() * 1000 + 200; // Random distance
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const r = Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1); // Random rotation
        
        piece.style.setProperty('--x', `${x}px`);
        piece.style.setProperty('--y', `${y}px`);
        piece.style.setProperty('--r', `${r}deg`);
        
        // Add to container
        container.appendChild(piece);
    }
}

// Create random explosions across the entire page
function createRandomExplosions() {
    const numExplosions = 5;
    
    for (let i = 0; i < numExplosions; i++) {
        // Create a new explosion at random position
        const explosion = document.createElement('div');
        explosion.className = 'explosion-piece page-explosion';
        
        // Random size
        const size = Math.random() * 100 + 50;
        explosion.style.width = `${size}px`;
        explosion.style.height = `${size}px`;
        
        // Random position on the page
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        explosion.style.top = `${top}vh`;
        explosion.style.left = `${left}vw`;
        
        // Random rotation
        const rotation = Math.random() * 360;
        explosion.style.transform = `rotate(${rotation}deg)`;
        
        // Random direction for explosion
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 800 + 200;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const r = Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1);
        
        explosion.style.setProperty('--x', `${x}px`);
        explosion.style.setProperty('--y', `${y}px`);
        explosion.style.setProperty('--r', `${r}deg`);
        
        // Random color
        const hue = Math.random() * 30; // Red-ish colors
        explosion.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
        
        // Add to body
        document.body.appendChild(explosion);
        
        // Remove after animation completes
        setTimeout(() => {
            if (explosion && explosion.parentNode) {
                explosion.parentNode.removeChild(explosion);
            }
        }, 3000);
    }
}

// Create floating error messages all over the screen
function createFloatingErrors() {
    const numMessages = 50;
    
    for (let i = 0; i < numMessages; i++) {
        setTimeout(() => {
            const errorText = document.createElement('div');
            errorText.className = 'floating-error';
            errorText.textContent = 'BŁĘDNE HASŁO';
            
            // Random position
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            errorText.style.top = `${top}vh`;
            errorText.style.left = `${left}vw`;
            
            // Random size
            const size = Math.random() * 2 + 0.8;
            errorText.style.fontSize = `${size}rem`;
            
            // Random rotation
            const rotation = Math.random() * 40 - 20;
            errorText.style.transform = `rotate(${rotation}deg)`;
            
            // Random opacity
            const opacity = Math.random() * 0.7 + 0.3;
            errorText.style.opacity = opacity;
            
            // Random animation duration
            const duration = Math.random() * 10 + 5;
            errorText.style.animationDuration = `${duration}s`;
            
            // Random delay
            const delay = Math.random() * 5;
            errorText.style.animationDelay = `${delay}s`;
            
            document.body.appendChild(errorText);
        }, i * 100); // Stagger creation
    }
}

// Make page elements float around
function makeElementsFloat() {
    // Select all major elements to animate
    const elements = document.querySelectorAll('.container, .tab-navigation, .demons-container, .player-card, .demon-card, h1, p, button, .modal');
    
    elements.forEach((el, index) => {
        // Add floating class
        el.classList.add('floating-element');
        
        // Set random animation properties
        const duration = Math.random() * 4 + 2;
        const delay = Math.random() * 2;
        const direction = Math.random() > 0.5 ? 1 : -1;
        
        el.style.setProperty('--float-duration', `${duration}s`);
        el.style.setProperty('--float-delay', `${delay}s`);
        el.style.setProperty('--float-direction', direction);
        
        // Random rotation
        const rotation = Math.random() * 20 - 10;
        el.style.setProperty('--float-rotation', `${rotation}deg`);
    });
}

// Display demons in admin panel
function displayAdminDemonList() {
    const adminList = document.getElementById('admin-demons-list');
    if (!adminList) return;
    
    adminList.innerHTML = '';
    
    // Sort demons by position
    const sortedDemons = [...demons].sort((a, b) => a.position - b.position);
    
    // If no demons, show WordPress code snippet
    if (sortedDemons.length === 0) {
        const placeholder = createAdminPlaceholderDemon();
        adminList.appendChild(placeholder);
        return; // Exit function as there's no need for drag handlers
    }
    
    sortedDemons.forEach(demon => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.setAttribute('data-id', demon.id);
        item.setAttribute('draggable', 'true');
        
        item.innerHTML = `
            <div class="drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="admin-item-info">
                <img src="${demon.thumbnail}" alt="${demon.name}" class="admin-item-thumb">
                <div>
                    <strong>#${demon.position} - ${demon.name}</strong>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-primary edit-demon" data-id="${demon.id}">Edytuj</button>
                <button class="btn btn-danger delete-demon" data-id="${demon.id}">Usuń</button>
            </div>
        `;
        
        adminList.appendChild(item);
    });
    
    // Add dragover indicator for drop target
    const dragoverIndicator = document.createElement('div');
    dragoverIndicator.className = 'dragover-indicator';
    adminList.appendChild(dragoverIndicator);
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-demon').forEach(button => {
        button.addEventListener('click', function() {
            const demonId = parseInt(this.dataset.id);
            deleteDemon(demonId);
        });
    });
    
    // Add event listeners to edit buttons
    document.querySelectorAll('.edit-demon').forEach(button => {
        button.addEventListener('click', function() {
            const demonId = parseInt(this.dataset.id);
            editDemon(demonId);
        });
    });
    
    // Setup drag and drop functionality
    setupDragAndDrop('demons');
}

// Create a placeholder with WordPress code for admin panel
function createAdminPlaceholderDemon() {
    const container = document.createElement('div');
    container.className = 'wp-placeholder-container admin-placeholder';
    
    const title = document.createElement('h3');
    title.className = 'wp-placeholder-title';
    title.textContent = 'Dodawanie demonów w WordPress';
    
    const instructions = document.createElement('p');
    instructions.className = 'wp-instructions';
    instructions.innerHTML = 'Użyj następującego kodu JavaScript w swoim pliku WordPress:';
    
    const codeSnippet = document.createElement('pre');
    codeSnippet.className = 'wp-code-snippet';
    
    const code = document.createElement('code');
    code.textContent = `// Dodaj to do pliku JavaScript
demons.push({
    id: ${Date.now()}, // Unikalny identyfikator (możesz użyć timestampa)
    position: 1, // Pozycja na liście (1-10 dla Top 10)
    name: "Nazwa Demona",
    description: "Opis demona, poziom trudności i inne informacje.",
    thumbnail: "https://link-do-miniaturki.jpg", // Link do obrazka
    videoUrl: "https://www.youtube.com/watch?v=ID_FILMU" // Link do wideo
});

// Możesz dodać więcej demonów:
demons.push({
    id: ${Date.now() + 1},
    position: 2,
    name: "Inny Demon",
    description: "Kolejny opis...",
    thumbnail: "https://link-do-miniaturki.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ID_FILMU"
});`;
    
    const copyButton = document.createElement('button');
    copyButton.className = 'wp-copy-button btn btn-primary';
    copyButton.textContent = 'Kopiuj kod';
    copyButton.onclick = function() {
        navigator.clipboard.writeText(code.textContent)
            .then(() => {
                // Change button text temporarily
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Skopiowano!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Nie udało się skopiować tekstu: ', err);
            });
        return false; // Prevent default behavior
    };
    
    codeSnippet.appendChild(code);
    
    container.appendChild(title);
    container.appendChild(instructions);
    container.appendChild(codeSnippet);
    container.appendChild(copyButton);
    
    return container;
}

// Display players in admin panel
function displayAdminPlayerList() {
    const adminList = document.getElementById('admin-players-list');
    if (!adminList) return;
    
    adminList.innerHTML = '';
    
    // Sort players by points (descending)
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    
    // Update positions based on sorted order
    sortedPlayers.forEach((player, index) => {
        player.position = index + 1;
    });
    
    // If no players, show WordPress code snippet
    if (sortedPlayers.length === 0) {
        const placeholder = createAdminPlaceholderPlayer();
        adminList.appendChild(placeholder);
        return; // Exit function as there's no need for drag handlers
    }
    
    sortedPlayers.forEach(player => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.setAttribute('data-id', player.id);
        item.setAttribute('draggable', 'true');
        
        item.innerHTML = `
            <div class="drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="admin-item-info">
                <div class="admin-item-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div>
                    <strong>#${player.position} - ${player.name}</strong>
                    <div>${player.points} punktów</div>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-primary edit-player" data-id="${player.id}">Edytuj</button>
                <button class="btn btn-danger delete-player" data-id="${player.id}">Usuń</button>
            </div>
        `;
        
        adminList.appendChild(item);
    });
    
    // Add dragover indicator for drop target
    const dragoverIndicator = document.createElement('div');
    dragoverIndicator.className = 'dragover-indicator';
    adminList.appendChild(dragoverIndicator);
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-player').forEach(button => {
        button.addEventListener('click', function() {
            const playerId = parseInt(this.dataset.id);
            deletePlayer(playerId);
        });
    });
    
    // Add event listeners to edit buttons
    document.querySelectorAll('.edit-player').forEach(button => {
        button.addEventListener('click', function() {
            const playerId = parseInt(this.dataset.id);
            editPlayer(playerId);
        });
    });
    
    // Setup drag and drop functionality
    setupDragAndDrop('players');
}

// Create a placeholder with WordPress code for admin panel
function createAdminPlaceholderPlayer() {
    const container = document.createElement('div');
    container.className = 'wp-placeholder-container admin-placeholder';
    
    const title = document.createElement('h3');
    title.className = 'wp-placeholder-title';
    title.textContent = 'Dodawanie graczy w WordPress';
    
    const instructions = document.createElement('p');
    instructions.className = 'wp-instructions';
    instructions.innerHTML = 'Użyj następującego kodu JavaScript w swoim pliku WordPress:';
    
    const codeSnippet = document.createElement('pre');
    codeSnippet.className = 'wp-code-snippet';
    
    const code = document.createElement('code');
    code.textContent = `// Dodaj to do pliku JavaScript
players.push({
    id: ${Date.now()}, // Unikalny identyfikator (możesz użyć timestampa)
    position: 1, // Pozycja zostanie automatycznie zaktualizowana według punktów
    name: "Nazwa Gracza",
    points: 500, // Liczba punktów gracza
    description: "Opis gracza, osiągnięcia i inne informacje."
});

// Możesz dodać więcej graczy:
players.push({
    id: ${Date.now() + 1},
    position: 2,
    name: "Inny Gracz",
    points: 450,
    description: "Kolejny opis..."
});`;
    
    const copyButton = document.createElement('button');
    copyButton.className = 'wp-copy-button btn btn-primary';
    copyButton.textContent = 'Kopiuj kod';
    copyButton.onclick = function() {
        navigator.clipboard.writeText(code.textContent)
            .then(() => {
                // Change button text temporarily
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Skopiowano!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Nie udało się skopiować tekstu: ', err);
            });
        return false; // Prevent default behavior
    };
    
    codeSnippet.appendChild(code);
    
    container.appendChild(title);
    container.appendChild(instructions);
    container.appendChild(codeSnippet);
    container.appendChild(copyButton);
    
    return container;
}

// Handle demon form submission (add or edit)
function handleDemonFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const id = document.getElementById('demon-id').value;
    const position = parseInt(document.getElementById('demon-position').value);
    const name = document.getElementById('demon-name').value;
    const description = document.getElementById('demon-description').value;
    const videoUrl = document.getElementById('demon-video').value;
    const customThumbnail = document.getElementById('demon-thumbnail').value;
    
    // Validate inputs
    if (!position || !name || !videoUrl) {
        alert('Wszystkie wymagane pola muszą być wypełnione!');
        return;
    }
    
    // Determine thumbnail
    let thumbnail = customThumbnail;
    
    // If no custom thumbnail provided, try to extract from source
    if (!customThumbnail) {
        try {
            const url = new URL(videoUrl);
            
            // Extract from YouTube
            if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
                let videoId;
                if (url.hostname.includes('youtube.com')) {
                    videoId = url.searchParams.get('v');
                } else if (url.hostname.includes('youtu.be')) {
                    videoId = url.pathname.substring(1);
                }
                
                if (videoId) {
                    thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                }
            }
            // For Medal.tv use Medal logo
            else if (url.hostname.includes('medal.tv')) {
                // Use Medal logo instead of trying to extract thumbnail
                thumbnail = 'https://cdn.medal.tv/assets/favicon.png';
            }
        } catch (error) {
            // Not a valid URL - that's okay, we'll use a default
        }
        
        // If we couldn't extract a thumbnail, use a default
        if (!thumbnail) {
            thumbnail = 'https://via.placeholder.com/640x360?text=Video+Thumbnail';
        }
    }
    
    if (isEditingDemon) {
        // EDITING MODE
        const demonId = parseInt(id);
        const demonIndex = demons.findIndex(d => d.id === demonId);
        
        if (demonIndex === -1) {
            alert('Nie znaleziono demona o podanym ID');
            return;
        }
        
        // Check if demon has moved between Top 10 and Extended list
        const wasInTop10 = demons[demonIndex].position <= 10;
        const isNowInTop10 = position <= 10;
        
        // Update the demon
        demons[demonIndex] = {
            ...demons[demonIndex],
            position: position,
            name: name,
            description: description,
            videoUrl: videoUrl,
            thumbnail: thumbnail
        };
        
        // Reset editing mode
        isEditingDemon = false;
        
        // Show notification if the demon has moved between lists
        if (wasInTop10 !== isNowInTop10) {
            const message = isNowInTop10 
                ? `${name} został przeniesiony do Top 10!` 
                : `${name} został przeniesiony do Wydłużonej Listy`;
            
            showNotification(message);
        } else {
            showNotification(`Demon "${name}" został zaktualizowany`);
        }
    } else {
        // ADD MODE - Create new demon
        const newPosition = position;
        
        // Shift positions of existing demons
        demons.forEach(demon => {
            if (demon.position >= newPosition) {
                demon.position += 1;
            }
        });
        
        // Create new demon
        const newDemon = {
            id: Date.now(), // Use timestamp as unique ID
            position: newPosition,
            name: name,
            description: description,
            videoUrl: videoUrl,
            thumbnail: thumbnail
        };
        
        // Add to demons array
        demons.push(newDemon);
        
        // Show success notification
        showNotification(`Demon "${name}" został dodany do listy`);
    }
    
    // Save demons to server
    saveData();
    
    // Update displays
    displayContent();
    displayAdminDemonList();
    
    // Reset form
    resetDemonForm();
}

// Handle player form submission (add or edit)
function handlePlayerFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const id = document.getElementById('player-id').value;
    const position = parseInt(document.getElementById('player-position').value);
    const name = document.getElementById('player-name').value;
    const points = parseInt(document.getElementById('player-points').value);
    const description = document.getElementById('player-description').value;
    
    // Validate inputs
    if (!position || !name || !points) {
        alert('Wszystkie wymagane pola muszą być wypełnione!');
        return;
    }
    
    if (isEditingPlayer) {
        // EDITING MODE
        const playerId = parseInt(id);
        const playerIndex = players.findIndex(p => p.id === playerId);
        
        if (playerIndex === -1) {
            alert('Nie znaleziono gracza o podanym ID');
            return;
        }
        
        // Update the player
        players[playerIndex] = {
            ...players[playerIndex],
            position: position,
            name: name,
            points: points,
            description: description
        };
        
        // Reset editing mode
        isEditingPlayer = false;
        
        // Show notification
        showNotification(`Gracz "${name}" został zaktualizowany`);
    } else {
        // ADD MODE
        const newPosition = position;
        
        // Shift positions of existing players
        players.forEach(player => {
            if (player.position >= newPosition) {
                player.position += 1;
            }
        });
        
        // Create new player
        const newPlayer = {
            id: Date.now(), // Use timestamp as unique ID
            position: newPosition,
            name: name,
            points: points,
            description: description
        };
        
        // Add to players array
        players.push(newPlayer);
        
        // Show success notification
        showNotification(`Gracz "${name}" został dodany do listy`);
    }
    
    // Save players to server
    saveData();
    
    // Update displays
    displayContent();
    displayAdminPlayerList();
    
    // Reset form
    resetPlayerForm();
}

// Delete a demon
function deleteDemon(id) {
    if (confirm('Czy na pewno chcesz usunąć tego demona?')) {
        const demonToDelete = demons.find(d => d.id === id);
        if (demonToDelete) {
            const name = demonToDelete.name;
            demons = demons.filter(demon => demon.id !== id);
            
            // Save demons to storage
            saveData();
            
            // Update displays
            displayContent();
            displayAdminDemonList();
            
            // Show notification
            showNotification(`Demon "${name}" został usunięty z listy`);
        }
    }
}

// Delete a player
function deletePlayer(id) {
    if (confirm('Czy na pewno chcesz usunąć tego gracza?')) {
        const playerToDelete = players.find(p => p.id === id);
        if (playerToDelete) {
            const name = playerToDelete.name;
            players = players.filter(player => player.id !== id);
            
            // Save players to storage
            saveData();
            
            // Update displays
            displayContent();
            displayAdminPlayerList();
            
            // Show notification
            showNotification(`Gracz "${name}" został usunięty z listy`);
        }
    }
}

// Variables to track form mode
let isEditingDemon = false;
let isEditingPlayer = false;

// Function to edit a demon
function editDemon(id) {
    // Find the demon with the given id
    const demon = demons.find(d => d.id === id);
    
    if (!demon) {
        alert('Nie znaleziono demona o podanym ID');
        return;
    }
    
    // Make sure demons form is visible
    document.getElementById('demons-form-container').style.display = 'block';
    document.getElementById('players-form-container').style.display = 'none';
    
    // Change form title and button text
    document.getElementById('demon-form-title').textContent = 'Edytuj Demona';
    document.getElementById('demon-form-submit').textContent = 'Zapisz Zmiany';
    document.getElementById('demon-form-cancel').style.display = 'inline-block';
    
    // Fill form with demon data
    document.getElementById('demon-id').value = demon.id;
    document.getElementById('demon-position').value = demon.position;
    document.getElementById('demon-name').value = demon.name;
    document.getElementById('demon-description').value = demon.description;
    document.getElementById('demon-video').value = demon.videoUrl;
    document.getElementById('demon-thumbnail').value = demon.thumbnail.includes('img.youtube.com') ? '' : demon.thumbnail;
    
    // Set editing mode
    isEditingDemon = true;
}

// Function to edit a player
function editPlayer(id) {
    // Find the player with the given id
    const player = players.find(p => p.id === id);
    
    if (!player) {
        alert('Nie znaleziono gracza o podanym ID');
        return;
    }
    
    // Make sure players form is visible
    document.getElementById('demons-form-container').style.display = 'none';
    document.getElementById('players-form-container').style.display = 'block';
    
    // Change form title and button text
    document.getElementById('player-form-title').textContent = 'Edytuj Gracza';
    document.getElementById('player-form-submit').textContent = 'Zapisz Zmiany';
    document.getElementById('player-form-cancel').style.display = 'inline-block';
    
    // Fill form with player data
    document.getElementById('player-id').value = player.id;
    document.getElementById('player-position').value = player.position;
    document.getElementById('player-name').value = player.name;
    document.getElementById('player-points').value = player.points;
    document.getElementById('player-description').value = player.description;
    
    // Set editing mode
    isEditingPlayer = true;
}

// Add reset functions for forms
function resetDemonForm() {
    // Reset form fields
    document.getElementById('demon-form').reset();
    document.getElementById('demon-id').value = '';
    
    // Reset form title and button text
    document.getElementById('demon-form-title').textContent = 'Dodaj Nowego Demona';
    document.getElementById('demon-form-submit').textContent = 'Dodaj Demona';
    document.getElementById('demon-form-cancel').style.display = 'none';
    
    // Reset editing mode
    isEditingDemon = false;
}

// Reset player form
function resetPlayerForm() {
    // Reset form fields
    document.getElementById('player-form').reset();
    document.getElementById('player-id').value = '';
    
    // Reset form title and button text
    document.getElementById('player-form-title').textContent = 'Dodaj Nowego Gracza';
    document.getElementById('player-form-submit').textContent = 'Dodaj Gracza';
    document.getElementById('player-form-cancel').style.display = 'none';
    
    // Reset editing mode
    isEditingPlayer = false;
}

// Setup drag and drop functionality for reordering items
function setupDragAndDrop(type) {
    const adminList = document.getElementById(type === 'demons' ? 'admin-demons-list' : 'admin-players-list');
    if (!adminList) return;
    
    const items = adminList.querySelectorAll('.admin-item');
    const dragIndicator = adminList.querySelector('.dragover-indicator');
    
    let draggedItem = null;
    
    items.forEach(item => {
        // Drag start
        item.addEventListener('dragstart', function(e) {
            draggedItem = this;
            setTimeout(() => {
                this.classList.add('dragging');
            }, 0);
        });
        
        // Drag end
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedItem = null;
            if (dragIndicator) dragIndicator.style.display = 'none';
        });
        
        // Drag over
        item.addEventListener('dragover', function(e) {
            e.preventDefault();
            if (draggedItem === this) return;
            
            const bounding = this.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            
            if (e.clientY - offset > 0) {
                this.after(dragIndicator);
            } else {
                this.before(dragIndicator);
            }
            
            if (dragIndicator) dragIndicator.style.display = 'block';
        });
        
        // Drop
        item.addEventListener('drop', function(e) {
            e.preventDefault();
            if (draggedItem === this) return;
            
            const bounding = this.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            
            if (e.clientY - offset > 0) {
                this.after(draggedItem);
            } else {
                this.before(draggedItem);
            }
            
            // Update positions based on the new order
            if (type === 'demons') {
                updateDemonPositions();
            } else {
                updatePlayerPositions();
            }
        });
    });
    
    // Handle dragover on the list itself (for when there's space at the bottom)
    adminList.addEventListener('dragover', function(e) {
        e.preventDefault();
        
        if (e.target === this || e.target === dragIndicator) {
            if (dragIndicator) {
                this.appendChild(dragIndicator);
                dragIndicator.style.display = 'block';
            }
        }
    });
    
    // Handle drop on the list itself
    adminList.addEventListener('drop', function(e) {
        e.preventDefault();
        if (e.target === this || e.target === dragIndicator) {
            if (draggedItem) {
                this.appendChild(draggedItem);
                if (type === 'demons') {
                    updateDemonPositions();
                } else {
                    updatePlayerPositions();
                }
            }
        }
    });
}

// Update demon positions based on the current order in the admin list
function updateDemonPositions() {
    const adminItems = document.querySelectorAll('#admin-demons-list .admin-item');
    
    // Create a map of demon ids to new positions
    const newPositions = Array.from(adminItems).map((item, index) => {
        return {
            id: parseInt(item.dataset.id),
            position: index + 1
        };
    });
    
    // Update the demons array
    let notifications = [];
    
    newPositions.forEach(update => {
        const demonIndex = demons.findIndex(d => d.id === update.id);
        if (demonIndex !== -1) {
            // Check if demon has moved between Top 10 and Extended list
            const wasInTop10 = demons[demonIndex].position <= 10;
            const isNowInTop10 = update.position <= 10;
            
            // Update position
            demons[demonIndex].position = update.position;
            
            // Add UI feedback if the demon moved between lists
            if (wasInTop10 !== isNowInTop10) {
                const message = isNowInTop10 
                    ? `${demons[demonIndex].name} został przeniesiony do Top 10!` 
                    : `${demons[demonIndex].name} został przeniesiony do Wydłużonej Listy`;
                
                notifications.push({ message, delay: notifications.length * 3500 });
            }
        }
    });
    
    // Save to server
    saveData();
    
    // Refresh displays
    displayContent();
    displayAdminDemonList();
    
    // Show notifications with delays
    notifications.forEach(notification => {
        setTimeout(() => {
            showNotification(notification.message);
        }, notification.delay);
    });
}

// Update player positions based on the current order in the admin list
function updatePlayerPositions() {
    const adminItems = document.querySelectorAll('#admin-players-list .admin-item');
    
    // Get the current players in their display order
    const playerIds = Array.from(adminItems).map(item => parseInt(item.dataset.id));
    
    // Reorder the players array to match the display order
    const reorderedPlayers = [];
    playerIds.forEach(id => {
        const player = players.find(p => p.id === id);
        if (player) {
            reorderedPlayers.push(player);
        }
    });
    
    // Sort by points and update positions
    reorderedPlayers.sort((a, b) => b.points - a.points);
    reorderedPlayers.forEach((player, index) => {
        player.position = index + 1;
    });
    
    // Save to server
    saveData();
    
    // Refresh displays
    displayContent();
    displayAdminPlayerList();
    
    // Show notification
    showNotification('Lista graczy została zaktualizowana');
}

// Data management functions - now using file system instead of localStorage

// The saveData function is no longer needed since we're loading from files
// and can't save to files from the client side

// Legacy function for backward compatibility
async function loadData() {
    console.log('Loading data from files...');
    await Promise.all([loadDemonsFromFiles(), loadPlayersFromFiles()]);
}

// Reset data to original
function resetData(type) {
    if (type === 'demons' || type === 'all') {
        if (confirm('Czy na pewno chcesz zresetować listę demonów? Spowoduje to usunięcie wszystkich wprowadzonych zmian.')) {
            demons = [...originalDemons];
            saveData();
            displayContent();
            displayAdminDemonList();
            showNotification('Lista demonów została zresetowana');
        }
    }
    
    if (type === 'players' || type === 'all') {
        if (confirm('Czy na pewno chcesz zresetować listę graczy? Spowoduje to usunięcie wszystkich wprowadzonych zmian.')) {
            players = [...originalPlayers];
            saveData();
            displayContent();
            displayAdminPlayerList();
            showNotification('Lista graczy została zresetowana');
        }
    }
}

// Show notification message
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Logout from admin panel
function logout() {
    closeAllModals();
}

// Admin buttons event listeners removed