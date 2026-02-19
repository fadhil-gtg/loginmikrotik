// ========================================
// MATRIX/HACKER THEME - JAVASCRIPT
// MikroTik Hotspot Template
// ========================================

'use strict';

// ========================================
// MATRIX RAIN EFFECT
// ========================================
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix characters
    const matrix = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const chars = matrix.split('');

    const fontSize = 14;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }

    function draw() {
        // Black background with transparency for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reset drop to top randomly
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Animation loop
    setInterval(draw, 35);

    // Resize handler
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========================================
// LOGIN FORM VALIDATION
// ========================================
function validateLogin() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    // Remove previous errors
    removeValidationErrors();

    let isValid = true;

    // Validate username
    if (!username || !username.value.trim()) {
        showValidationError(username, 'Username cannot be empty');
        isValid = false;
    }

    // Validate password
    if (!password || !password.value.trim()) {
        showValidationError(password, 'Password cannot be empty');
        isValid = false;
    }

    if (!isValid) {
        // Play error sound effect (terminal beep)
        playErrorSound();
        
        // Focus first empty field
        if (!username.value.trim()) {
            username.focus();
        } else if (!password.value.trim()) {
            password.focus();
        }
    } else {
        // Show loading animation
        showLoadingAnimation();
    }

    return isValid;
}

// ========================================
// SHOW VALIDATION ERROR
// ========================================
function showValidationError(inputElement, message) {
    if (!inputElement) return;

    const terminalInput = inputElement.closest('.terminal-input');
    if (!terminalInput) return;

    // Add error class
    terminalInput.classList.add('input-error');

    // Create error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'validation-error';
    errorMsg.innerHTML = `
        <span class="error-icon">►</span>
        <span class="error-text">[ERROR] ${message}</span>
    `;

    // Insert error message
    terminalInput.parentNode.insertBefore(errorMsg, terminalInput.nextSibling);

    // Add input listener to remove error
    inputElement.addEventListener('input', function() {
        removeInputError(this);
    }, { once: true });
}

// ========================================
// REMOVE INPUT ERROR
// ========================================
function removeInputError(inputElement) {
    const terminalInput = inputElement.closest('.terminal-input');
    if (terminalInput) {
        terminalInput.classList.remove('input-error');
    }

    const errorMsg = inputElement.closest('.form-group').querySelector('.validation-error');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// ========================================
// REMOVE ALL VALIDATION ERRORS
// ========================================
function removeValidationErrors() {
    const errorMessages = document.querySelectorAll('.validation-error');
    errorMessages.forEach(msg => msg.remove());

    const errorInputs = document.querySelectorAll('.input-error');
    errorInputs.forEach(input => input.classList.remove('input-error'));
}

// ========================================
// PLAY ERROR SOUND
// ========================================
function playErrorSound() {
    // Create audio context for terminal beep
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Fallback - do nothing if audio API not supported
    }
}

// ========================================
// SHOW LOADING ANIMATION
// ========================================
function showLoadingAnimation() {
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.6';
        
        const originalText = submitButton.innerHTML;
        let dots = '';
        
        const loadingInterval = setInterval(() => {
            dots = dots.length >= 3 ? '' : dots + '.';
            submitButton.innerHTML = `
                <span class="btn-brackets">[</span>
                <span class="btn-text">AUTHENTICATING${dots}</span>
                <span class="btn-brackets">]</span>
            `;
        }, 300);

        // Clear interval after 5 seconds (fallback)
        setTimeout(() => {
            clearInterval(loadingInterval);
        }, 5000);
    }
}

// ========================================
// CONFIRM LOGOUT
// ========================================
function confirmLogout() {
    // Custom terminal-style confirmation
    const confirmed = confirm('[SYSTEM] Are you sure you want to terminate the session?');
    return confirmed;
}

// ========================================
// TYPING EFFECT FOR SYSTEM INFO
// ========================================
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text .command');
    
    typingElements.forEach((element, index) => {
        const text = element.textContent;
        element.textContent = '';
        
        let charIndex = 0;
        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (charIndex < text.length) {
                    element.textContent += text.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 30);
        }, index * 300);
    });
}

// ========================================
// GLITCH TEXT EFFECT
// ========================================
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(element => {
        setInterval(() => {
            if (Math.random() > 0.95) {
                element.style.textShadow = '-2px 0 #ff0033, 2px 0 #0033ff';
                setTimeout(() => {
                    element.style.textShadow = '0 0 10px #00ff41';
                }, 50);
            }
        }, 100);
    });
}

// ========================================
// INPUT FOCUS EFFECTS
// ========================================
function initInputEffects() {
    const inputs = document.querySelectorAll('.terminal-input input');
    
    inputs.forEach(input => {
        // Focus effect
        input.addEventListener('focus', function() {
            const terminalInput = this.closest('.terminal-input');
            if (terminalInput) {
                terminalInput.classList.add('input-focused');
            }
        });

        // Blur effect
        input.addEventListener('blur', function() {
            const terminalInput = this.closest('.terminal-input');
            if (terminalInput) {
                terminalInput.classList.remove('input-focused');
            }
        });

        // Typing effect
        input.addEventListener('input', function() {
            // Play typing sound occasionally
            if (Math.random() > 0.7) {
                playTypingSound();
            }
        });
    });
}

// ========================================
// PLAY TYPING SOUND
// ========================================
function playTypingSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 400 + Math.random() * 200;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
        // Silent fail
    }
}

// ========================================
// BUTTON HOVER EFFECTS
// ========================================
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-access, .btn-disconnect, .btn-reconnect, .btn-retry');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            playHoverSound();
        });

        button.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
}

// ========================================
// PLAY HOVER SOUND
// ========================================
function playHoverSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 600;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
        // Silent fail
    }
}

// ========================================
// CREATE RIPPLE EFFECT
// ========================================
function createRipple(event, button) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // ESC - Go back to login
        if (e.key === 'Escape') {
            const backButton = document.querySelector('.btn-reconnect, .btn-retry');
            if (backButton) {
                backButton.click();
            }
        }

        // Ctrl/Cmd + Enter - Submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const loginForm = document.querySelector('form[name="login"]');
            if (loginForm) {
                loginForm.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        }
    });
}

// ========================================
// RANDOM BINARY CODE GENERATOR
// ========================================
function generateBinaryCode() {
    const codeElements = document.querySelectorAll('.floating-code .code-line');
    
    setInterval(() => {
        codeElements.forEach(element => {
            let binary = '';
            for (let i = 0; i < 32; i++) {
                binary += Math.random() > 0.5 ? '1' : '0';
                if ((i + 1) % 8 === 0 && i < 31) binary += ' ';
            }
            element.textContent = binary;
        });
    }, 3000);
}

// ========================================
// PREVENT FORM DOUBLE SUBMISSION
// ========================================
let formSubmitted = false;

function initFormProtection() {
    const loginForm = document.querySelector('form[name="login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            if (formSubmitted) {
                e.preventDefault();
                return false;
            }
            
            if (validateLogin()) {
                formSubmitted = true;
                return true;
            } else {
                e.preventDefault();
                return false;
            }
        });
    }
}

// ========================================
// ADD VALIDATION ERROR STYLES
// ========================================
function addValidationStyles() {
    if (document.getElementById('validation-styles')) return;

    const style = document.createElement('style');
    style.id = 'validation-styles';
    style.textContent = `
        .input-error {
            border-color: #ff0033 !important;
            box-shadow: 0 0 15px rgba(255, 0, 51, 0.5) !important;
            animation: errorShake 0.5s ease-out;
        }

        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        .validation-error {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
            padding: 8px 12px;
            background: rgba(255, 0, 51, 0.1);
            border: 1px solid #ff0033;
            border-radius: 4px;
            font-size: 11px;
            animation: errorSlideIn 0.3s ease-out;
        }

        @keyframes errorSlideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .error-icon {
            color: #ff0033;
        }

        .error-text {
            color: #ff6666;
        }

        .input-focused {
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.5) !important;
        }

        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 255, 65, 0.5);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// CONSOLE HACKER BANNER
// ========================================
function showConsoleBanner() {
    console.clear();
    console.log('%c' + 
        '███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗\n' +
        '████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝\n' +
        '██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ \n' +
        '██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ \n' +
        '██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗\n' +
        '╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝',
        'color: #00ff41; font-family: monospace; font-size: 10px;'
    );
    console.log('%c[SYSTEM] Hotspot Authentication Terminal', 'color: #00ff41; font-weight: bold;');
    console.log('%c[INFO] Matrix/Hacker Theme Loaded', 'color: #00cc33;');
    console.log('%c[STATUS] All systems operational', 'color: #00cc33;');
    console.log('%c[WARNING] Unauthorized access is prohibited', 'color: #ffff00;');
}

// ========================================
// INITIALIZE ALL FUNCTIONS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Show console banner
    showConsoleBanner();

    // Initialize matrix rain effect
    initMatrixRain();

    // Initialize typing effect
    initTypingEffect();

    // Initialize glitch effect
    initGlitchEffect();

    // Initialize input effects
    initInputEffects();

    // Initialize button effects
    initButtonEffects();

    // Initialize keyboard shortcuts
    initKeyboardShortcuts();

    // Generate binary code
    generateBinaryCode();

    // Initialize form protection
    initFormProtection();

    // Add validation styles
    addValidationStyles();

    // Auto focus username field
    const usernameField = document.getElementById('username');
    if (usernameField) {
        setTimeout(() => {
            usernameField.focus();
        }, 500);
    }

    // Add fade-in animation to terminal window
    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) {
        terminalWindow.style.opacity = '0';
        terminalWindow.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            terminalWindow.style.transition = 'all 0.8s ease-out';
            terminalWindow.style.opacity = '1';
            terminalWindow.style.transform = 'translateY(0)';
        }, 100);
    }
});

// ========================================
// PAGE VISIBILITY - AUTO REFRESH DETECTION
// ========================================
let inactiveTime = 0;

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        inactiveTime = Date.now();
    } else {
        const elapsed = Date.now() - inactiveTime;
        // If inactive for more than 30 minutes, suggest refresh
        if (elapsed > 1800000 && window.location.href.includes('status.html')) {
            if (confirm('[SYSTEM] Long inactivity detected. Refresh session status?')) {
                window.location.reload();
            }
        }
    }
});

// ========================================
// END OF SCRIPT
// ========================================
