// Main JavaScript for Kuropatwa GDPS Demon List

// Initial demons data (loaded from files)
let demons = [];

// Initial players data (loaded from files)
let players = [];

// Function to generate thumbnails based on video URL
function generateThumbnail(thumbnail, videoUrl) {
    // If thumbnail is already provided, use it
    if (thumbnail && thumbnail.trim() !== "") {
        return thumbnail;
    }
    
    // Try to generate from YouTube URL
    if (videoUrl && videoUrl.trim() !== "" && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'))) {
        try {
            const url = new URL(videoUrl);
            let videoId;
            
            if (url.hostname.includes('youtube.com')) {
                videoId = url.searchParams.get('v');
            } else if (url.hostname.includes('youtu.be')) {
                videoId = url.pathname.substring(1);
            }
            
            if (videoId) {
                return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
        } catch (error) {
            console.error('Error generating YouTube thumbnail:', error);
        }
    }
    
    // If we got here, no thumbnail was provided and we couldn't generate one
    return "/icons/no-video.png"; // Path to the placeholder image
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
                    // Process thumbnail for YouTube auto-generation
                    demon.thumbnail = generateThumbnail(demon.thumbnail, demon.videoUrl);
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
                        
                        // Process thumbnail for YouTube auto-generation
                        tempDemon.thumbnail = generateThumbnail(tempDemon.thumbnail, tempDemon.videoUrl);
                        
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
}

// Create geometric shapes across the background
function createBackgroundShapes(baseHue, accentHue) {
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
    
    // Add event listeners for modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
});

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
    
    // Check if this is a "no video" placeholder
    const isNoVideo = demon.thumbnail === "/icons/no-video.png";
    
    if (isNoVideo) {
        card.innerHTML = `
            <div class="demon-content">
                <div class="demon-position">#${demon.position}</div>
                <div class="demon-info">
                    <h3 class="demon-name">${demon.name}</h3>
                    <p class="demon-description">${demon.description}</p>
                </div>
            </div>
            <div class="demon-thumbnail no-video" data-video="${demon.videoUrl}">
                <i class="fas fa-video-slash" style="font-size: 48px;"></i>
            </div>
        `;
    } else {
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
    }
    
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

// Function to save data (empty implementation as this is now server-side)
function saveData() {
    console.log('Data saving would happen server-side');
    // In a real application, this would send data to the server
}