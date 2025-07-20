/**
 * Accessible Audio Dinosaur Game
 * Professional JavaScript Implementation
 * Designed for users with visual, cognitive, and learning disabilities
 */

class AccessibleDinosaurGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.score = 0;
        this.gameSpeed = 3;
        this.soundEnabled = true;
        this.startPromptInterval = null;
        
        // Audio system configuration
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.baseFrequency = 200;
        
        // Game object definitions
        this.dinosaur = {
            x: 50,
            y: 150,
            width: 40,
            height: 40,
            velocityY: 0,
            isJumping: false,
            jumpPower: -15,
            gravity: 0.6
        };
        
        this.obstacles = [];
        this.obstacleSpawnTimer = 0;
        this.obstacleSpawnInterval = 160;
        
        // Initialize systems
        this.initializeGame();
    }
    
    /**
     * Initialize all game systems
     */
    initializeGame() {
        this.setupAudio();
        this.setupEventListeners();
        this.setupSpeechSynthesis();
    }
    
    /**
     * Setup Web Audio API for game sounds
     */
    setupAudio() {
        if (this.audioContext) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = 0.3;
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.soundEnabled = false;
        }
    }
    
    /**
     * Setup speech synthesis for announcements
     */
    setupSpeechSynthesis() {
        this.synth = window.speechSynthesis || null;
        if (!this.synth) {
            console.warn('Speech synthesis not supported');
        }
    }
    
    /**
     * Setup keyboard and mouse event listeners
     */
    setupEventListeners() {
        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
        this.canvas.addEventListener('click', () => this.handleClick());
        
        // Handle browser focus/blur for audio context
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.audioContext) {
                this.audioContext.suspend();
            } else if (this.audioContext && this.isRunning) {
                this.audioContext.resume();
            }
        });
    }
    
    /**
     * Handle keyboard input events
     */
    handleKeyPress(event) {
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                if (!this.isRunning) {
                    this.start();
                } else {
                    this.jump();
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.jump();
                break;
        }
    }
    
    /**
     * Handle mouse/touch click events
     */
    handleClick() {
        this.jump();
    }
    
    /**
     * Start repeating audio prompts for game start
     */
    startRepeatingPrompt() {
        this.stopRepeatingPrompt();
        
        this.startPromptInterval = setInterval(() => {
            if (!this.isRunning) {
                this.announce('Press Space to start');
            }
        }, 3000);
    }
    
    /**
     * Stop repeating audio prompts
     */
    stopRepeatingPrompt() {
        if (this.startPromptInterval) {
            clearInterval(this.startPromptInterval);
            this.startPromptInterval = null;
        }
    }
    
    /**
     * Make dinosaur jump
     */
    jump() {
        if (!this.isRunning || this.dinosaur.isJumping) return;
        
        this.dinosaur.velocityY = this.dinosaur.jumpPower;
        this.dinosaur.isJumping = true;
        this.playJumpSound();
        this.announce('Jump');
    }
    
    /**
     * Play jump confirmation sound
     */
    playJumpSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const jumpOscillator = this.audioContext.createOscillator();
        const jumpGain = this.audioContext.createGain();
        
        jumpOscillator.connect(jumpGain);
        jumpGain.connect(this.audioContext.destination);
        
        jumpOscillator.frequency.value = 400;
        jumpOscillator.type = 'square';
        
        jumpGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        jumpGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        jumpOscillator.start();
        jumpOscillator.stop(this.audioContext.currentTime + 0.2);
    }
    
    /**
     * Update proximity sound based on closest obstacle
     */
    updateProximitySound() {
        if (!this.soundEnabled || !this.audioContext || this.obstacles.length === 0) {
            this.stopProximitySound();
            return;
        }
        
        const closestDistance = this.getClosestObstacleDistance();
        
        if (closestDistance < 300 && closestDistance !== Infinity) {
            this.playProximitySound(closestDistance);
        } else {
            this.stopProximitySound();
        }
    }
    
    /**
     * Get distance to closest obstacle
     */
    getClosestObstacleDistance() {
        let closestDistance = Infinity;
        
        for (const obstacle of this.obstacles) {
            const distance = obstacle.x - this.dinosaur.x;
            if (distance > 0 && distance < closestDistance) {
                closestDistance = distance;
            }
        }
        
        return closestDistance;
    }
    
    /**
     * Play proximity sound with frequency based on distance
     */
    playProximitySound(distance) {
        if (!this.oscillator) {
            this.oscillator = this.audioContext.createOscillator();
            this.oscillator.connect(this.gainNode);
            this.oscillator.type = 'sine';
            this.oscillator.start();
        }
        
        // Calculate frequency and volume based on distance
        const frequency = this.baseFrequency + (300 - distance) * 2;
        const volume = Math.max(0.1, (300 - distance) / 300 * 0.3);
        
        this.oscillator.frequency.value = frequency;
        this.gainNode.gain.value = volume;
    }
    
    /**
     * Stop proximity sound
     */
    stopProximitySound() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }
        if (this.gainNode) {
            this.gainNode.gain.value = 0;
        }
    }
    
    /**
     * Spawn new obstacle
     */
    spawnObstacle() {
        if (this.obstacleSpawnTimer <= 0) {
            this.obstacles.push({
                x: this.canvas.width,
                y: 160,
                width: 30,
                height: 40
            });
            this.obstacleSpawnTimer = this.obstacleSpawnInterval;
        }
        this.obstacleSpawnTimer--;
    }
    
    /**
     * Update obstacle positions and handle scoring
     */
    updateObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.gameSpeed;
            
            // Remove off-screen obstacles and award points
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
                this.score += 10;
                this.playScoreSound();
            }
        }
    }
    
    /**
     * Play score achievement sound
     */
    playScoreSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const scoreOscillator = this.audioContext.createOscillator();
        const scoreGain = this.audioContext.createGain();
        
        scoreOscillator.connect(scoreGain);
        scoreGain.connect(this.audioContext.destination);
        
        scoreOscillator.frequency.value = 800;
        scoreOscillator.type = 'triangle';
        
        scoreGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        scoreGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        scoreOscillator.start();
        scoreOscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    /**
     * Update dinosaur physics
     */
    updateDinosaur() {
        // Apply gravity
        this.dinosaur.velocityY += this.dinosaur.gravity;
        this.dinosaur.y += this.dinosaur.velocityY;
        
        // Ground collision detection
        if (this.dinosaur.y >= 150) {
            this.dinosaur.y = 150;
            this.dinosaur.velocityY = 0;
            this.dinosaur.isJumping = false;
        }
    }
    
    /**
     * Check for collisions between dinosaur and obstacles
     */
    checkCollisions() {
        for (const obstacle of this.obstacles) {
            if (this.isColliding(this.dinosaur, obstacle)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Check if two rectangles are colliding
     */
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    /**
     * Handle game over state
     */
    gameOver() {
        this.isRunning = false;
        this.stopProximitySound();
        this.playGameOverSound();
        this.announce(`Game Over! Final score: ${this.score}`);
        this.updateGameStatus('Game Over! Press Space to restart');
        
        // Resume prompts after delay
        setTimeout(() => {
            if (!this.isRunning) {
                this.startRepeatingPrompt();
            }
        }, 2000);
    }
    
    /**
     * Play game over sound sequence
     */
    playGameOverSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const frequencies = [400, 350, 300, 250, 200];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const gameOverOscillator = this.audioContext.createOscillator();
                const gameOverGain = this.audioContext.createGain();
                
                gameOverOscillator.connect(gameOverGain);
                gameOverGain.connect(this.audioContext.destination);
                
                gameOverOscillator.frequency.value = freq;
                gameOverOscillator.type = 'square';
                
                gameOverGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gameOverGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
                
                gameOverOscillator.start();
                gameOverOscillator.stop(this.audioContext.currentTime + 0.4);
            }, index * 200);
        });
    }
    
    /**
     * Announce text using speech synthesis
     */
    announce(text) {
        if (!this.synth) return;
        
        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = 0.5;
        utterance.rate = 1.2;
        this.synth.speak(utterance);
    }
    
    /**
     * Draw all game elements on canvas
     */
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#95a5a6';
        this.ctx.fillRect(0, 190, this.canvas.width, 10);
        
        // Draw dinosaur
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(this.dinosaur.x, this.dinosaur.y, this.dinosaur.width, this.dinosaur.height);
        
        // Draw obstacles
        this.ctx.fillStyle = '#27ae60';
        for (const obstacle of this.obstacles) {
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
        
        // Draw score
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }
    
    /**
     * Main game loop
     */
    gameLoop() {
        if (!this.isRunning) return;
        
        this.spawnObstacle();
        this.updateObstacles();
        this.updateDinosaur();
        this.updateProximitySound();
        
        if (this.checkCollisions()) {
            this.gameOver();
            return;
        }
        
        // Increase difficulty over time
        this.updateDifficulty();
        
        this.draw();
        this.updateScoreDisplay();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Update game difficulty based on score
     */
    updateDifficulty() {
        if (this.score > 0 && this.score % 100 === 0) {
            this.gameSpeed += 0.1;
            this.obstacleSpawnInterval = Math.max(80, this.obstacleSpawnInterval - 2);
        }
    }
    
    /**
     * Update score display in UI
     */
    updateScoreDisplay() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }
    
    /**
     * Update game status display
     */
    updateGameStatus(status) {
        document.getElementById('gameStatus').textContent = status;
    }
    
    /**
     * Start the game
     */
    start() {
        if (this.isRunning) return;
        
        this.stopRepeatingPrompt();
        this.resetGameState();
        
        // Resume audio context if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.isRunning = true;
        this.updateGameStatus('Game Running');
        this.announce('Game started! Listen for audio cues and press space to jump');
        this.gameLoop();
    }
    
    /**
     * Reset all game state variables
     */
    resetGameState() {
        this.score = 0;
        this.gameSpeed = 3;
        this.obstacleSpawnInterval = 160;
        this.obstacles = [];
        this.obstacleSpawnTimer = 0;
        this.dinosaur.y = 150;
        this.dinosaur.velocityY = 0;
        this.dinosaur.isJumping = false;
    }
    
    /**
     * Stop the game
     */
    stop() {
        this.isRunning = false;
        this.stopProximitySound();
        this.updateGameStatus('Press Space to start');
        
        setTimeout(() => {
            if (!this.isRunning) {
                this.startRepeatingPrompt();
            }
        }, 1000);
    }
    
    /**
     * Toggle sound effects on/off
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        document.getElementById('soundStatus').textContent = this.soundEnabled ? 'ON' : 'OFF';
        
        if (!this.soundEnabled) {
            this.stopProximitySound();
        }
        
        this.announce(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`);
    }
}

// Global game instance
let game;

/**
 * Global function to start game (called by button)
 */
function startGame() {
    if (game) {
        game.start();
    }
}

/**
 * Global function to stop game (called by button)
 */
function stopGame() {
    if (game) {
        game.stop();
    }
}

/**
 * Global function to toggle sound (called by button)
 */
function toggleSound() {
    if (game) {
        game.toggleSound();
    }
}

/**
 * Initialize game when page loads
 */
window.addEventListener('load', () => {
    game = new AccessibleDinosaurGame();
    game.announce('Accessible Dinosaur Game loaded. Press Space to start playing.');
    
    setTimeout(() => {
        game.startRepeatingPrompt();
    }, 3000);
});

/**
 * Handle page visibility changes for audio context
 */
document.addEventListener('visibilitychange', () => {
    if (game && game.audioContext) {
        if (document.hidden) {
            game.audioContext.suspend();
        } else if (game.isRunning) {
            game.audioContext.resume();
        }
    }
});
