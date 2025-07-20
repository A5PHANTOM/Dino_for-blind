class AccessibleDinoGame {
    constructor() {
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            score: 0,
            highScore: parseInt(localStorage.getItem('dinoHighScore')) || 0,
            level: 1,
            gameSpeed: 1.5,
            obstacleFrequency: 3500,
            dinosaurGrounded: true,
            obstacles: []
        };
        
        this.settings = {
            soundEnabled: true,
            voiceInstructions: true,
            volume: 0.8,
            speed: 'normal',
            highContrast: false,
            largeMode: false,
            reducedMotion: false
        };
        
        this.elements = {};
        this.audioContext = null;
        this.sounds = {};
        this.gameLoop = null;
        this.obstacleInterval = null;
        this.audioInitialized = false;
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.bindEvents();
        this.forceAudioInit();
        this.loadSettings();
        this.updateDisplay();
        this.announceInstructions();
    }
    
    bindElements() {
        this.elements = {
            dinosaur: document.getElementById('dinosaur'),
            obstaclesContainer: document.getElementById('obstacles-container'),
            gameOverOverlay: document.getElementById('gameOverOverlay'),
            startBtn: document.getElementById('startBtn'),
            topStartBtn: document.getElementById('topStartBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            restartBtn: document.getElementById('restartBtn'),
            score: document.getElementById('score'),
            highScore: document.getElementById('highScore'),
            level: document.getElementById('level'),
            finalScore: document.getElementById('finalScore'),
            finalLevel: document.getElementById('finalLevel'),
            gameStatus: document.getElementById('gameStatus'),
            audioCue: document.getElementById('audioCue'),
            lastAction: document.getElementById('lastAction'),
            statusMessages: document.getElementById('statusMessages'),
            visualCue: document.getElementById('visualCue'),
            volumeDisplay: document.getElementById('volumeDisplay'),
            
            // Settings
            soundEnabled: document.getElementById('soundEnabled'),
            voiceInstructions: document.getElementById('voiceInstructions'),
            volume: document.getElementById('volume'),
            highContrast: document.getElementById('highContrast'),
            largeMode: document.getElementById('largeMode'),
            reducedMotion: document.getElementById('reducedMotion'),
            speedRadios: document.getElementsByName('speed'),
            
            // Audio test buttons
            audioTestBtn: document.getElementById('audioTestBtn'),
            audioTestBtn2: document.getElementById('audioTestBtn2')
        };
    }
    
    bindEvents() {
        // Game controls
        this.elements.startBtn?.addEventListener('click', () => this.startGame());
        this.elements.topStartBtn?.addEventListener('click', () => this.startGame());
        this.elements.pauseBtn?.addEventListener('click', () => this.togglePause());
        this.elements.restartBtn?.addEventListener('click', () => this.restartGame());
        
        // Audio test buttons
        this.elements.audioTestBtn?.addEventListener('click', () => this.testAudioSystem());
        this.elements.audioTestBtn2?.addEventListener('click', () => this.testAudioSystem());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Settings with audio feedback
        this.elements.soundEnabled?.addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
            this.saveSettings();
            if (e.target.checked) {
                setTimeout(() => this.testAudioSystem(), 100);
            }
            this.announceToScreenReader(`Sound effects ${e.target.checked ? 'enabled' : 'disabled'}`);
        });
        
        this.elements.volume?.addEventListener('input', (e) => {
            this.settings.volume = e.target.value / 100;
            this.elements.volumeDisplay.textContent = e.target.value + '%';
            this.saveSettings();
            // Test audio immediately on volume change
            this.playTone(440, 0.2, 'sine');
        });
        
        // Initialize audio on any user interaction
        document.addEventListener('click', () => this.ensureAudioContext(), { once: false });
        document.addEventListener('keydown', () => this.ensureAudioContext(), { once: false });
        
        this.bindOtherEvents();
    }
    
    bindOtherEvents() {
        this.elements.voiceInstructions?.addEventListener('change', (e) => {
            this.settings.voiceInstructions = e.target.checked;
            this.saveSettings();
            if (e.target.checked) {
                this.speak('Voice instructions enabled');
            }
        });
        
        this.elements.highContrast?.addEventListener('change', (e) => {
            this.settings.highContrast = e.target.checked;
            this.applyVisualSettings();
            this.saveSettings();
        });
        
        this.elements.largeMode?.addEventListener('change', (e) => {
            this.settings.largeMode = e.target.checked;
            this.applyVisualSettings();
            this.saveSettings();
        });
        
        this.elements.reducedMotion?.addEventListener('change', (e) => {
            this.settings.reducedMotion = e.target.checked;
            this.applyVisualSettings();
            this.saveSettings();
        });
        
        if (this.elements.speedRadios) {
            Array.from(this.elements.speedRadios).forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.settings.speed = e.target.value;
                    this.saveSettings();
                    this.announceToScreenReader(`Game speed set to ${e.target.value}`);
                });
            });
        }
    }
    
    // ENHANCED AUDIO SYSTEM - MUCH MORE RELIABLE AND PROMINENT
    forceAudioInit() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createEnhancedSounds();
            this.audioInitialized = true;
            console.log('✅ Enhanced audio system initialized successfully');
        } catch (error) {
            console.warn('⚠️ Web Audio API not available, using fallback:', error);
            this.createFallbackSounds();
        }
    }
    
    ensureAudioContext() {
        if (!this.audioInitialized) {
            this.forceAudioInit();
        }
        
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('🔊 Audio context resumed');
            });
        }
    }
    
    createEnhancedSounds() {
        this.sounds = {
            // TRIPLE-TONE WARNING SYSTEM - IMPOSSIBLE TO MISS
            obstacleWarning: () => {
                console.log('🚨 PLAYING TRIPLE WARNING SOUND!');
                
                // First tone - High alert
                this.playTone(800, 0.4, 'sawtooth');
                
                // Second tone - Higher alert (100ms later)
                setTimeout(() => this.playTone(1000, 0.4, 'square'), 100);
                
                // Third tone - Highest alert (200ms later)
                setTimeout(() => this.playTone(1200, 0.5, 'sawtooth'), 200);
                
                // Visual warning
                this.showVisualCue('🚨 JUMP NOW!', 'bg-red-600 animate-pulse');
                
                // Voice warning if enabled
                if (this.settings.voiceInstructions) {
                    setTimeout(() => this.speak('JUMP NOW!'), 50);
                }
                
                this.updateLastAction('⚠️ WARNING PLAYED');
            },
            
            jump: () => {
                this.playTone(600, 0.25, 'square');
                setTimeout(() => this.playTone(800, 0.2, 'triangle'), 150);
                this.updateLastAction('🦘 JUMPED');
            },
            
            obstacleCleared: () => {
                this.playSequence([400, 600, 800], 0.15);
                if (this.settings.voiceInstructions) {
                    setTimeout(() => this.speak('Safe!'), 200);
                }
                this.updateLastAction('✅ CLEARED');
            },
            
            gameOver: () => {
                this.playSequence([500, 400, 300, 200], 0.6);
                if (this.settings.voiceInstructions) {
                    setTimeout(() => this.speak('Game Over'), 500);
                }
                this.updateLastAction('💀 GAME OVER');
            },
            
            levelUp: () => {
                this.playSequence([400, 500, 600, 700, 800], 0.2);
                if (this.settings.voiceInstructions) {
                    setTimeout(() => this.speak('Level up!'), 300);
                }
                this.updateLastAction('🎉 LEVEL UP');
            },
            
            safeZone: () => {
                this.playTone(350, 0.25, 'sine');
                this.updateLastAction('✅ LANDED SAFE');
            },
            
            gameStart: () => {
                this.playSequence([500, 600, 700], 0.15);
                if (this.settings.voiceInstructions) {
                    setTimeout(() => this.speak('Game Started! Listen for warning sounds!'), 500);
                }
                this.updateLastAction('🚀 GAME STARTED');
            },
            
            testSound: () => {
                // Test all warning tones
                this.playTone(800, 0.3, 'sawtooth');
                setTimeout(() => this.playTone(1000, 0.3, 'square'), 100);
                setTimeout(() => this.playTone(1200, 0.4, 'sawtooth'), 200);
                if (this.settings.voiceInstructions) {
                    setTimeout(() => this.speak('Audio test complete'), 600);
                }
                this.showVisualCue('🧪 AUDIO TEST', 'bg-purple-600');
                this.updateLastAction('🧪 AUDIO TESTED');
            }
        };
    }
    
    createFallbackSounds() {
        console.warn('Using fallback audio system');
        this.sounds = {
            obstacleWarning: () => {
                this.playBeep(800, 400);
                setTimeout(() => this.playBeep(1000, 400), 100);
                setTimeout(() => this.playBeep(1200, 500), 200);
                this.announceToScreenReader('LOUD WARNING: OBSTACLE APPROACHING - JUMP NOW!');
                this.showVisualCue('🚨 JUMP NOW!', 'bg-red-600 animate-pulse');
                this.updateLastAction('⚠️ WARNING PLAYED');
            },
            jump: () => { this.playBeep(600, 200); this.updateLastAction('🦘 JUMPED'); },
            obstacleCleared: () => { this.playBeep(400, 150); this.updateLastAction('✅ CLEARED'); },
            gameOver: () => { this.playBeep(200, 500); this.updateLastAction('💀 GAME OVER'); },
            levelUp: () => { this.playBeep(700, 200); this.updateLastAction('🎉 LEVEL UP'); },
            safeZone: () => { this.playBeep(350, 200); this.updateLastAction('✅ LANDED SAFE'); },
            gameStart: () => { this.playBeep(500, 200); this.updateLastAction('🚀 GAME STARTED'); },
            testSound: () => { 
                this.playBeep(440, 300); 
                this.updateLastAction('🧪 AUDIO TESTED');
                this.announceToScreenReader('Audio test - if you can hear this, audio is working');
            }
        };
    }
    
    playTone(frequency, duration, waveType = 'sine') {
        if (!this.settings.soundEnabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = waveType;
            
            // MUCH LOUDER - Increased from 0.3 to 0.8 max volume
            const volume = Math.min(this.settings.volume * 0.8, 0.9);
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
            
            console.log(`🔊 LOUD TONE: ${frequency}Hz for ${duration}s at ${Math.round(volume*100)}% volume`);
        } catch (error) {
            console.warn('🔇 Sound play failed:', error);
            this.announceToScreenReader(`Audio warning: ${frequency} hertz tone for obstacle!`);
        }
    }
    
    playSequence(frequencies, noteDuration) {
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, noteDuration);
            }, index * noteDuration * 1000);
        });
    }
    
    playBeep(frequency, duration) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'square';
            
            const volume = this.settings.volume * 0.7;
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration / 1000);
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration / 1000);
        } catch (error) {
            console.warn('Fallback beep failed:', error);
        }
    }
    
    speak(text) {
        if (!this.settings.voiceInstructions || !window.speechSynthesis) return;
        
        try {
            window.speechSynthesis.cancel(); // Stop any current speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.3;
            utterance.volume = this.settings.volume;
            utterance.pitch = 1.2;
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.warn('Speech synthesis failed:', error);
        }
    }
    
    testAudioSystem() {
        console.log('🧪 Testing enhanced audio system...');
        this.ensureAudioContext();
        this.updateAudioCue('🧪 Testing audio system...');
        
        if (this.sounds.testSound) {
            this.sounds.testSound();
        }
        
        this.announceToScreenReader('Audio test playing - you should hear three loud beeps and voice announcement');
    }
    
    updateLastAction(action) {
        if (this.elements.lastAction) {
            this.elements.lastAction.textContent = action;
        }
    }
    
    announceInstructions() {
        const message = "Welcome to Accessible Chrome Dino! This game uses VERY LOUD audio cues to help you jump over obstacles. The warning sounds are MUCH LOUDER than normal game sounds. Listen for three loud beeps that warn you to press spacebar and jump!";
        this.announceToScreenReader(message);
        
        // Auto-test audio system after 3 seconds
        setTimeout(() => {
            this.testAudioSystem();
        }, 3000);
    }
    
    announceToScreenReader(message) {
        if (this.elements.statusMessages) {
            this.elements.statusMessages.textContent = message;
        }
        console.log('📢 Screen reader: ' + message);
    }
    
    startGame() {
        if (this.gameState.isPlaying) return;
        
        this.ensureAudioContext();
        
        this.gameState = {
            ...this.gameState,
            isPlaying: true,
            isPaused: false,
            score: 0,
            level: 1,
            gameSpeed: this.getInitialSpeed(),
            obstacleFrequency: 4000, // Even slower for better reaction time
            dinosaurGrounded: true,
            obstacles: []
        };
        
        // Hide start buttons, show pause button
        this.elements.startBtn?.classList.add('hidden');
        this.elements.topStartBtn?.classList.add('hidden');
        this.elements.pauseBtn?.classList.remove('hidden');
        this.elements.gameOverOverlay?.classList.add('hidden');
        
        this.updateGameStatus('🎮 PLAYING - Listen for LOUD warning beeps!');
        this.announceToScreenReader("Game started! Listen carefully for the VERY LOUD triple warning beeps - they will tell you exactly when to jump!");
        
        if (this.settings.soundEnabled) {
            this.sounds.gameStart();
        }
        
        document.getElementById('game-area')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        this.startGameLoop();
        this.startObstacleSpawning();
        this.updateDisplay();
    }
    
    getInitialSpeed() {
        switch (this.settings.speed) {
            case 'slow': return 0.8;
            case 'fast': return 2.0;
            default: return 1.2;
        }
    }
    
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            if (!this.gameState.isPaused && this.gameState.isPlaying) {
                this.updateGame();
            }
        }, 16);
    }
    
    startObstacleSpawning() {
        this.obstacleInterval = setInterval(() => {
            if (!this.gameState.isPaused && this.gameState.isPlaying) {
                this.spawnObstacle();
            }
        }, this.gameState.obstacleFrequency);
    }
    
    spawnObstacle() {
        const obstacle = {
            id: Date.now(),
            x: window.innerWidth + 50,
            width: 50,
            height: 80,
            hasPlayedWarning: false,
            hasPlayedCleared: false
        };
        
        this.gameState.obstacles.push(obstacle);
        this.createObstacleElement(obstacle);
        
        // MUCH EARLIER WARNING - 5 seconds before impact for maximum reaction time
        const warningTime = 5000;
        const timeToImpact = (obstacle.x - 150) / (this.gameState.gameSpeed * 2) * 16;
        const actualWarningDelay = Math.max(100, timeToImpact - warningTime);
        
        setTimeout(() => {
            if (this.settings.soundEnabled && !obstacle.hasPlayedWarning && this.gameState.isPlaying) {
                console.log('🚨 TRIGGERING OBSTACLE WARNING NOW!');
                this.sounds.obstacleWarning();
                this.updateAudioCue('🚨 OBSTACLE APPROACHING - JUMP NOW!');
                obstacle.hasPlayedWarning = true;
                
                this.announceToScreenReader('URGENT: Very loud warning beeps playing! Obstacle approaching! Press spacebar to jump NOW!');
            }
        }, actualWarningDelay);
    }
    
    createObstacleElement(obstacle) {
        const element = document.createElement('div');
        element.id = `obstacle-${obstacle.id}`;
        element.className = `absolute w-12 h-20 bg-gradient-to-t from-red-600 to-red-500 rounded-lg shadow-lg flex items-center justify-center text-3xl border-2 border-red-700`;
        element.style.left = `${obstacle.x}px`;
        element.style.bottom = '0px';
        element.innerHTML = '🌵';
        element.setAttribute('role', 'img');
        element.setAttribute('aria-label', 'Cactus obstacle');
        
        this.elements.obstaclesContainer?.appendChild(element);
    }
    
    updateGame() {
        this.moveObstacles();
        this.checkCollisions();
        this.updateScore();
        this.updateLevel();
        this.cleanupObstacles();
        this.updateDisplay();
    }
    
    moveObstacles() {
        this.gameState.obstacles.forEach(obstacle => {
            obstacle.x -= this.gameState.gameSpeed * 2;
            const element = document.getElementById(`obstacle-${obstacle.id}`);
            if (element) {
                element.style.left = `${obstacle.x}px`;
                
                if (obstacle.x < 50 && !obstacle.hasPlayedCleared) {
                    if (this.settings.soundEnabled) {
                        this.sounds.obstacleCleared();
                        this.updateAudioCue('✅ Excellent! Obstacle cleared safely!');
                        this.showVisualCue('✅ SAFE!', 'bg-green-500');
                    }
                    obstacle.hasPlayedCleared = true;
                    this.announceToScreenReader('Excellent jump! Obstacle cleared safely!');
                }
            }
        });
    }
    
    showVisualCue(text, bgClass) {
        if (!this.elements.visualCue) return;
        
        this.elements.visualCue.textContent = text;
        this.elements.visualCue.className = `absolute top-4 left-1/2 transform -translate-x-1/2 ${bgClass} text-white px-8 py-4 rounded-full text-xl font-bold border-4 border-white`;
        this.elements.visualCue.classList.remove('hidden');
        
        setTimeout(() => {
            this.elements.visualCue?.classList.add('hidden');
        }, 2500);
    }
    
    checkCollisions() {
        this.gameState.obstacles.forEach(obstacle => {
            if (obstacle.x < 144 && 
                obstacle.x + obstacle.width > 96 && 
                this.gameState.dinosaurGrounded) {
                this.gameOver();
            }
        });
    }
    
    handleKeyPress(event) {
        if (event.code === 'Space' && this.gameState.isPlaying && !this.gameState.isPaused) {
            event.preventDefault();
            this.jump();
        }
        
        // Audio test shortcut
        if (event.key.toLowerCase() === 't') {
            event.preventDefault();
            this.testAudioSystem();
        }
        
        if (event.altKey) {
            switch (event.key.toLowerCase()) {
                case 's':
                    event.preventDefault();
                    if (!this.gameState.isPlaying) {
                        this.startGame();
                    }
                    break;
                case 'p':
                    event.preventDefault();
                    if (this.gameState.isPlaying) {
                        this.togglePause();
                    }
                    break;
                case 't':
                    event.preventDefault();
                    this.testAudioSystem();
                    break;
            }
        }
    }
    
    jump() {
        if (!this.gameState.dinosaurGrounded) return;
        
        this.gameState.dinosaurGrounded = false;
        
        if (!this.settings.reducedMotion && this.elements.dinosaur) {
            this.elements.dinosaur.style.transform = 'translateY(-120px) scale(1.1)';
            this.elements.dinosaur.style.borderColor = '#10b981';
            this.elements.dinosaur.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6)';
        }
        
        if (this.settings.soundEnabled) {
            this.sounds.jump();
        }
        
        this.updateAudioCue('🦘 Jumping!');
        this.showVisualCue('🦘 JUMPING!', 'bg-blue-500');
        
        setTimeout(() => {
            this.gameState.dinosaurGrounded = true;
            if (this.elements.dinosaur) {
                this.elements.dinosaur.style.transform = 'translateY(0) scale(1)';
                this.elements.dinosaur.style.borderColor = '#15803d';
                this.elements.dinosaur.style.boxShadow = '';
            }
            
            if (this.settings.soundEnabled) {
                this.sounds.safeZone();
            }
            this.updateAudioCue('✅ Landed safely');
        }, 800);
    }
    
    togglePause() {
        if (!this.gameState.isPlaying) return;
        
        this.gameState.isPaused = !this.gameState.isPaused;
        
        if (this.gameState.isPaused) {
            this.elements.pauseBtn.innerHTML = '▶️ Resume';
            this.updateGameStatus('⏸️ Game Paused');
            this.announceToScreenReader('Game paused. Press resume to continue playing.');
            this.updateLastAction('⏸️ PAUSED');
        } else {
            this.elements.pauseBtn.innerHTML = '⏸️ Pause';
            this.updateGameStatus('🎮 Playing - Listen for warnings!');
            this.announceToScreenReader('Game resumed. Listen for loud obstacle warnings!');
            this.updateLastAction('▶️ RESUMED');
        }
    }
    
    updateScore() {
        this.gameState.score += 2;
        if (this.gameState.score > this.gameState.highScore) {
            this.gameState.highScore = this.gameState.score;
            localStorage.setItem('dinoHighScore', this.gameState.highScore.toString());
        }
    }
    
    updateLevel() {
        const newLevel = Math.floor(this.gameState.score / 1000) + 1;
        if (newLevel > this.gameState.level) {
            this.gameState.level = newLevel;
            this.gameState.gameSpeed += 0.15;
            this.gameState.obstacleFrequency = Math.max(2500, this.gameState.obstacleFrequency - 150);
            
            if (this.settings.soundEnabled) {
                this.sounds.levelUp();
            }
            
            this.announceToScreenReader(`Congratulations! Level ${this.gameState.level} reached! Game getting faster!`);
            this.updateGameStatus(`🎉 Level ${this.gameState.level} - Listen carefully!`);
            this.showVisualCue(`🎉 LEVEL ${this.gameState.level}!`, 'bg-purple-500');
            
            clearInterval(this.obstacleInterval);
            this.startObstacleSpawning();
        }
    }
    
    cleanupObstacles() {
        this.gameState.obstacles = this.gameState.obstacles.filter(obstacle => {
            if (obstacle.x < -100) {
                const element = document.getElementById(`obstacle-${obstacle.id}`);
                if (element) {
                    element.remove();
                }
                return false;
            }
            return true;
        });
    }
    
    gameOver() {
        this.gameState.isPlaying = false;
        
        clearInterval(this.gameLoop);
        clearInterval(this.obstacleInterval);
        
        this.elements.finalScore.textContent = this.gameState.score;
        this.elements.finalLevel.textContent = this.gameState.level;
        
        this.elements.gameOverOverlay?.classList.remove('hidden');
        this.elements.startBtn?.classList.remove('hidden');
        this.elements.topStartBtn?.classList.remove('hidden');
        this.elements.pauseBtn?.classList.add('hidden');
        
        if (this.settings.soundEnabled) {
            this.sounds.gameOver();
        }
        
        this.updateGameStatus('💀 Game Over');
        this.updateAudioCue('💀 Game ended');
        this.showVisualCue('💀 GAME OVER!', 'bg-red-600');
        
        const message = `Game over! You scored ${this.gameState.score} points and reached level ${this.gameState.level}.`;
        this.announceToScreenReader(message);
        
        setTimeout(() => {
            this.elements.restartBtn?.focus();
        }, 1000);
    }
    
    restartGame() {
        this.elements.obstaclesContainer.innerHTML = '';
        this.gameState.obstacles = [];
        
        if (this.elements.dinosaur) {
            this.elements.dinosaur.style.transform = 'translateY(0) scale(1)';
            this.elements.dinosaur.style.borderColor = '#15803d';
            this.elements.dinosaur.style.boxShadow = '';
        }
        
        this.elements.gameOverOverlay?.classList.add('hidden');
        this.startGame();
    }
    
    updateDisplay() {
        if (this.elements.score) this.elements.score.textContent = this.gameState.score;
        if (this.elements.highScore) this.elements.highScore.textContent = this.gameState.highScore;
        if (this.elements.level) this.elements.level.textContent = this.gameState.level;
    }
    
    updateGameStatus(status) {
        if (this.elements.gameStatus) {
            this.elements.gameStatus.textContent = status;
        }
    }
    
    updateAudioCue(cue) {
        if (this.elements.audioCue) {
            this.elements.audioCue.textContent = cue;
            setTimeout(() => {
                if (this.elements.audioCue && this.elements.audioCue.textContent === cue) {
                    this.elements.audioCue.textContent = 'Listening for warnings...';
                }
            }, 4000);
        }
    }
    
    applyVisualSettings() {
        const body = document.body;
        body.classList.toggle('contrast-more', this.settings.highContrast);
        body.classList.toggle('text-2xl', this.settings.largeMode);
        
        if (this.settings.reducedMotion) {
            body.style.setProperty('animation-duration', '0.01s');
            body.style.setProperty('transition-duration', '0.01s');
        } else {
            body.style.removeProperty('animation-duration');
            body.style.removeProperty('transition-duration');
        }
    }
    
    saveSettings() {
        localStorage.setItem('dinoGameSettings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('dinoGameSettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                this.applySettingsToUI();
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }
    
    applySettingsToUI() {
        if (this.elements.soundEnabled) this.elements.soundEnabled.checked = this.settings.soundEnabled;
        if (this.elements.voiceInstructions) this.elements.voiceInstructions.checked = this.settings.voiceInstructions;
        if (this.elements.volume) {
            this.elements.volume.value = this.settings.volume * 100;
            this.elements.volumeDisplay.textContent = Math.round(this.settings.volume * 100) + '%';
        }
        if (this.elements.highContrast) this.elements.highContrast.checked = this.settings.highContrast;
        if (this.elements.largeMode) this.elements.largeMode.checked = this.settings.largeMode;
        if (this.elements.reducedMotion) this.elements.reducedMotion.checked = this.settings.reducedMotion;
        
        if (this.elements.speedRadios) {
            Array.from(this.elements.speedRadios).forEach(radio => {
                radio.checked = radio.value === this.settings.speed;
            });
        }
        
        this.applyVisualSettings();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new AccessibleDinoGame();
        console.log('🦕 ENHANCED Accessible Chrome Dino Game initialized!');
        console.log('🔊 AUDIO IMPROVEMENTS:');
        console.log('   ✅ MUCH LOUDER warning sounds (80% volume)');
        console.log('   ✅ TRIPLE-TONE warning system (800Hz → 1000Hz → 1200Hz)');
        console.log('   ✅ 5-SECOND early warning time');
        console.log('   ✅ Voice announcements with speech synthesis');
        console.log('   ✅ Visual warning indicators');
        console.log('   ✅ Audio test buttons (click or press T key)');
        console.log('   ✅ Enhanced fallback system for compatibility');
        console.log('🎯 Inclusive Game Design Challenge - COMPLETE SOLUTION');
    } catch (error) {
        console.error('❌ Game initialization failed:', error);
        alert('Game failed to load. Please refresh the page and try again.');
    }
});
