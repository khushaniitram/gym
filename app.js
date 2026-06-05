// AURA AI — Application Controller & State Engine

// Web Audio API Sound Generator
const audio = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    playBeep(frequency = 800, duration = 0.15, type = 'sine') {
        try {
            this.init();
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn("Audio feedback block or unsupported: ", e);
        }
    },
    playSuccess() {
        this.playBeep(523.25, 0.08, 'triangle'); // C5
        setTimeout(() => {
            this.playBeep(659.25, 0.15, 'triangle'); // E5
        }, 80);
    },
    playAlert() {
        this.playBeep(880, 0.15, 'sawtooth'); // A5
        setTimeout(() => {
            this.playBeep(880, 0.15, 'sawtooth');
        }, 150);
    },
    playTick() {
        this.playBeep(1200, 0.02, 'sine');
    }
};

// Circular Rest Timer Module
const timer = {
    totalSeconds: 60,
    remainingSeconds: 60,
    intervalId: null,
    isRunning: false,

    setPreset(seconds) {
        this.reset();
        this.totalSeconds = seconds;
        this.remainingSeconds = seconds;
        this.updateDisplay();
        audio.playTick();
    },

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    },

    start() {
        if (this.isRunning) return;
        audio.init();
        this.isRunning = true;
        document.getElementById('timerToggleBtn').innerHTML = '<i data-lucide="pause"></i> Pause';
        lucide.createIcons();
        
        this.intervalId = setInterval(() => {
            this.remainingSeconds--;
            this.updateDisplay();
            
            if (this.remainingSeconds <= 0) {
                this.complete();
            } else if (this.remainingSeconds <= 3) {
                audio.playTick(); // Tick-tock warning for last 3 seconds
            }
        }, 1000);
    },

    pause() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        document.getElementById('timerToggleBtn').innerHTML = '<i data-lucide="play"></i> Start';
        lucide.createIcons();
    },

    reset() {
        this.pause();
        this.remainingSeconds = this.totalSeconds;
        this.updateDisplay();
    },

    complete() {
        this.pause();
        audio.playAlert();
        app.showToast("Rest completed! Get back to it!");
        this.remainingSeconds = this.totalSeconds;
        this.updateDisplay();
    },

    updateDisplay() {
        // Update countdown text
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        document.getElementById('timerCountdown').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Update circular dash offset
        const ring = document.getElementById('timerProgressRing');
        const circumference = 2 * Math.PI * 70; // r=70
        const percent = this.remainingSeconds / this.totalSeconds;
        ring.style.strokeDasharray = `${circumference}`;
        ring.style.strokeDashoffset = `${circumference * (1 - percent)}`;
    }
};

// Default Pre-Compiled Fitness and Nutrition Plan for Khushan (Gemma 2 Optimized Model Plan)
const defaultKhushanState = {
    profile: {
        name: "Khushan",
        gender: "Male",
        age: 20,
        weight: 64,
        height: 175,
        activityLevel: "Sedentary",
        currentBody: "Moderately fit, don't have too much fat but have an average stomach, otherwise good and fit",
        targetBody: "Visible abs, fit all body muscles, lean and athletic shape. Not bulky or big, just slim, defined, and overall good muscle tone.",
        dailyFood: "Light breakfast, sometimes light lunch, and heavy dinner."
    },
    aiPlan: {
        assessment: {
            currentBodyType: "Moderately fit with an average stomach (moderate body fat percentage around 16-18%).",
            estimatedMaintenanceCalories: 2000,
            calorieAnalysis: "Your eating pattern of light breakfast and lunch followed by a heavy dinner can cause evening calorie spikes. Spacing protein intake throughout the day will help build lean muscle and reduce stomach fat.",
            targetBodyAnalysis: "To reveal your abs and build full-body tone without bulk, we will target a mild calorie deficit (1800 kcal) combined with high protein and structured resistance training.",
            weeklyGoalText: "Recomp & Reveal Abs (Lean Gains)"
        },
        targets: {
            dailyCalories: 1800,
            proteinGrams: 140,
            carbsGrams: 175,
            fatGrams: 60,
            proteinPercent: 31,
            carbsPercent: 39,
            fatPercent: 30
        },
        workoutPlan: {
            routineName: "Abs & Full-Body Definition Split",
            splitDescription: "A 5-day focus split targeting core stability, abdominal definition, and lean muscle hypertrophy.",
            weeklySchedule: [
                {
                    dayName: "Monday",
                    focus: "Chest, Shoulders & Abs",
                    restDay: false,
                    exercises: [
                        { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: "12-15kg", notes: "Build upper chest shape" },
                        { name: "Dumbbell Lateral Raises", sets: 4, reps: "12-15", weight: "5-7.5kg", notes: "Focus on shoulder width" },
                        { name: "Hanging Knee Raises", sets: 3, reps: "15-20", weight: "Bodyweight", notes: "Lower abs focus" },
                        { name: "Plank to Shoulder Tap", sets: 3, reps: "45 sec", weight: "Bodyweight", notes: "Core stability" }
                    ]
                },
                {
                    dayName: "Tuesday",
                    focus: "Back, Biceps & Core",
                    restDay: false,
                    exercises: [
                        { name: "Lat Pulldowns", sets: 3, reps: "10-12", weight: "35-45kg", notes: "Squeeze shoulder blades" },
                        { name: "Dumbbell Row", sets: 3, reps: "10", weight: "15kg", notes: "Keep elbow close to body" },
                        { name: "Incline Dumbbell Curls", sets: 3, reps: "12", weight: "7.5-10kg", notes: "Full biceps stretch" },
                        { name: "Ab Wheel Rollouts", sets: 3, reps: "10-12", weight: "Bodyweight", notes: "Engage lower back and abs" }
                    ]
                },
                {
                    dayName: "Wednesday",
                    focus: "Active Recovery & Cardio",
                    restDay: true,
                    exercises: []
                },
                {
                    dayName: "Thursday",
                    focus: "Legs, Glutes & Abs",
                    restDay: false,
                    exercises: [
                        { name: "Goblet Squats", sets: 3, reps: "12", weight: "15-20kg", notes: "Keep torso upright" },
                        { name: "Romanian Deadlifts", sets: 3, reps: "12", weight: "20-25kg", notes: "Target hamstrings and glutes" },
                        { name: "Lying Leg Raises", sets: 3, reps: "15", weight: "Bodyweight", notes: "Lower abs tension" },
                        { name: "Bicycle Crunches", sets: 3, reps: "20 per side", weight: "Bodyweight", notes: "Oblique activation" }
                    ]
                },
                {
                    dayName: "Friday",
                    focus: "Triceps, Shoulders & Abs",
                    restDay: false,
                    exercises: [
                        { name: "Triceps Rope Pushdowns", sets: 3, reps: "12-15", weight: "15-20kg", notes: "Lock elbows at sides" },
                        { name: "Dumbbell Arnold Press", sets: 3, reps: "10", weight: "10-12kg", notes: "Full shoulder movement" },
                        { name: "Russian Twists", sets: 3, reps: "20 per side", weight: "Bodyweight", notes: "Rotate shoulders fully" },
                        { name: "Mountain Climbers", sets: 3, reps: "45 sec", weight: "Bodyweight", notes: "High intensity conditioning" }
                    ]
                },
                {
                    dayName: "Saturday",
                    focus: "Active Recovery & Cardio",
                    restDay: true,
                    exercises: []
                },
                {
                    dayName: "Sunday",
                    focus: "Rest Day",
                    restDay: true,
                    exercises: []
                }
            ]
        },
        mealPlan: {
            guidelines: "Consume high-protein meals to build muscle, space foods out, and avoid large late-night dinner spikes.",
            meals: [
                { type: "Breakfast", recommendation: "2 boiled eggs, a slice of whole wheat toast, and green tea.", approxCalories: 250, protein: 18 },
                { type: "Lunch", recommendation: "Grilled chicken breast (150g) with mixed green salad and olive oil drizzle.", approxCalories: 350, protein: 35 },
                { type: "Dinner", recommendation: "Baked salmon or lean beef (150g) with sautéed broccoli and a small cup of brown rice.", approxCalories: 600, protein: 40 },
                { type: "Snacks", recommendation: "Whey protein shake or Greek yogurt (200g) with a handful of almonds.", approxCalories: 250, protein: 25 }
            ]
        }
    },
    meals: [],
    history: [
        { date: "May 30", weight: 64.6, calories: 1750 },
        { date: "May 31", weight: 64.5, calories: 1820 },
        { date: "Jun 1", weight: 64.3, calories: 1680 },
        { date: "Jun 2", weight: 64.2, calories: 1790 },
        { date: "Jun 3", weight: 64.1, calories: 1850 },
        { date: "Jun 4", weight: 64.0, calories: 0 }
    ],
    chatHistory: [
        { sender: "coach", text: "Hello Khushan! I have generated your customized program: **Abs & Full-Body Definition Split**. Your target intake is **1800 kcal** daily. Let's make today count!" }
    ],
    activeTab: "dashboard",
    currentWorkoutDayIdx: 0,
    completedWorkoutsToday: false,
    burnedCaloriesToday: 0
};

// Main App Controller
const app = {
    state: {
        profile: null,
        aiPlan: null,
        meals: [],
        history: [], // [{date, weight, calories}]
        chatHistory: [],
        apiKey: '',
        groqApiKey: '',
        hasServerKey: false,
        activeTab: 'dashboard',
        currentWorkoutDayIdx: 0,
        completedWorkoutsToday: false,
        burnedCaloriesToday: 0
    },
    
    chartInstance: null,

    async init() {
        this.loadState();
        this.setupEventListeners();
        this.routeOnboardingState();
        this.updateDateDisplay();
        
        if (this.state.profile) {
            this.renderDashboard();
            this.renderWorkouts();
            this.renderNutrition();
            this.renderCoachTab();
        }
        
        const apiKeyInput = document.getElementById('groqApiKeyInput');
        if (apiKeyInput) {
            apiKeyInput.value = this.state.groqApiKey || '';
        }
        
        lucide.createIcons();
    },

    loadState() {
        const stored = localStorage.getItem('aura_fitness_state');
        let parsed = null;
        if (stored) {
            try {
                parsed = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse local state", e);
            }
        }
        
        if (parsed && parsed.profile) {
            this.state = { ...this.state, ...parsed };
        } else {
            // Pre-populate with Khushan's custom plan!
            this.state = { ...this.state, ...defaultKhushanState };
            this.saveState();
        }
    },

    saveState() {
        localStorage.setItem('aura_fitness_state', JSON.stringify(this.state));
    },

    setupEventListeners() {
        // Navigation clicks
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Onboarding form submit
        document.getElementById('onboardingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleOnboarding();
        });

        // Food Logger submit (AI)
        document.getElementById('foodLogForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAIFoodLog();
        });

        // Food Logger submit (Manual)
        document.getElementById('manualFoodForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleManualFoodLog();
        });

        // Chat form submit
        document.getElementById('chatForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSendChatMessage();
        });

        // Chart tab selectors
        document.getElementById('btnWeightChart').addEventListener('click', (e) => {
            document.getElementById('btnWeightChart').classList.add('active');
            document.getElementById('btnCalorieChart').classList.remove('active');
            this.renderChart('weight');
        });
        document.getElementById('btnCalorieChart').addEventListener('click', (e) => {
            document.getElementById('btnCalorieChart').classList.add('active');
            document.getElementById('btnWeightChart').classList.remove('active');
            this.renderChart('calorie');
        });
    },

    // Connection checks removed as API Key is handled securely on the server-side

    routeOnboardingState() {
        const navWorkouts = document.getElementById('navWorkouts');
        const navNutrition = document.getElementById('navNutrition');
        const navCoach = document.getElementById('navCoach');
        
        if (!this.state.profile) {
            // Lock tabs until onboarding completes
            navWorkouts.style.opacity = '0.4';
            navWorkouts.style.pointerEvents = 'none';
            navNutrition.style.opacity = '0.4';
            navNutrition.style.pointerEvents = 'none';
            navCoach.style.opacity = '0.4';
            navCoach.style.pointerEvents = 'none';
            
            this.switchTab('onboarding');
        } else {
            navWorkouts.style.opacity = '1';
            navWorkouts.style.pointerEvents = 'auto';
            navNutrition.style.opacity = '1';
            navNutrition.style.pointerEvents = 'auto';
            navCoach.style.opacity = '1';
            navCoach.style.pointerEvents = 'auto';
            
            // Set User profile pill elements
            document.getElementById('userProfileName').textContent = this.state.profile.name;
            document.getElementById('userProfileGoal').textContent = `Target: ${this.state.aiPlan?.assessment?.weeklyGoalText || 'Active'}`;
            document.getElementById('userAvatar').textContent = this.state.profile.name.charAt(0).toUpperCase();
            
            this.switchTab('dashboard');
        }
    },

    switchTab(tabId) {
        // Prevent tab switching if not onboarded (except settings)
        if (!this.state.profile && tabId !== 'onboarding' && tabId !== 'settings') {
            this.showToast("Please compile your Onboarding plan first!");
            return;
        }

        this.state.activeTab = tabId;
        
        // Toggle active navigation UI
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Show/hide content panels
        document.querySelectorAll('.main-content > section').forEach(panel => {
            if (panel.id === `${tabId}Tab`) {
                panel.classList.remove('hidden');
            } else {
                panel.classList.add('hidden');
            }
        });

        // Initialize elements specific to tabs
        if (tabId === 'dashboard') {
            this.renderDashboard();
        } else if (tabId === 'workouts') {
            this.renderWorkouts();
        } else if (tabId === 'nutrition') {
            this.renderNutrition();
        }
        
        lucide.createIcons();
    },

    updateDateDisplay() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const todayStr = new Date().toLocaleDateString('en-US', options);
        document.getElementById('currentDateText').textContent = todayStr;
    },

    showToast(message) {
        const toast = document.getElementById('toastNotification');
        document.getElementById('toastMessage').textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    },

    // Secure wrapper to call local server proxy running Groq API
    async callGemini(contents, systemInstruction, jsonMode = false) {
        // Detect if hosted on GitHub Pages or if local server connection is offline
        const isStaticDeploy = window.location.hostname.endsWith('github.io') || !this.state.hasServerKey;
        const localKey = this.state.groqApiKey || '';

        if (isStaticDeploy && localKey.trim() !== '') {
            // Direct client-side fetch call to Groq API
            const messages = [];
            if (systemInstruction) {
                messages.push({ role: 'system', content: systemInstruction });
            }
            contents.forEach(item => {
                let role = item.role || 'user';
                if (role === 'model') role = 'assistant';
                const text = item.parts && Array.isArray(item.parts)
                    ? item.parts.map(p => p.text).join('\n')
                    : (typeof item.text === 'string' ? item.text : '');
                messages.push({ role: role, content: text });
            });

            const bodyParams = {
                model: 'llama-3.1-8b-instant',
                messages: messages,
                temperature: 0.5
            };
            if (jsonMode) {
                bodyParams.response_format = { type: 'json_object' };
            }

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localKey}`
                },
                body: JSON.stringify(bodyParams)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || "Failed direct request to Groq API.");
            }

            const data = await response.json();
            const responseText = data.choices && data.choices[0] && data.choices[0].message
                ? data.choices[0].message.content
                : '';
            return { text: responseText };
        }

        // Fallback local proxy call
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contents,
                systemInstruction: systemInstruction,
                jsonMode: jsonMode
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Failed request to AI model.");
        }

        return await response.json();
    },

    parseJSONFromResponse(text) {
        let cleanText = text.trim();
        // Strip markdown backticks if returned
        if (cleanText.startsWith("```")) {
            const firstNewLine = cleanText.indexOf("\n");
            const lastBackticks = cleanText.lastIndexOf("```");
            if (firstNewLine !== -1 && lastBackticks !== -1) {
                cleanText = cleanText.substring(firstNewLine + 1, lastBackticks).trim();
            }
            // Sometimes it has ```json
            if (cleanText.startsWith("json")) {
                cleanText = cleanText.substring(4).trim();
            }
        }
        return JSON.parse(cleanText);
    },

    // 1. ONBOARDING SUBMIT HANDLER
    async handleOnboarding() {
        const btn = document.getElementById('generatePlanBtn');
        const origContent = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span>Compiling Plan via AI...</span><div class="typing-indicator" style="display:inline-flex; padding:0; margin-left:10px;"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
        
        try {
            const profile = {
                name: document.getElementById('name').value,
                gender: document.getElementById('gender').value,
                age: Number(document.getElementById('age').value),
                weight: Number(document.getElementById('weight').value),
                height: Number(document.getElementById('height').value),
                activityLevel: document.getElementById('activityLevel').value,
                currentBody: document.getElementById('currentBody').value,
                targetBody: document.getElementById('targetBody').value,
                dailyFood: document.getElementById('dailyFood').value
            };

            const systemInstruction = `You are Aura, an elite AI Fitness Architect & Dietitian. Analyze the user profile (physical parameters, body description, target body goal, and current typical eating routine).
            Create a highly detailed physical transformation plan in JSON format.
            You must output ONLY raw JSON. Do not include markdown codeblocks (no \`\`\`json).
            
            JSON schema constraints:
            {
              "assessment": {
                "currentBodyType": "description of their current physical state",
                "estimatedMaintenanceCalories": number,
                "calorieAnalysis": "explanation of their current diet and why it might be hindering them",
                "targetBodyAnalysis": "outline of the transformation journey to reach the target body",
                "weeklyGoalText": "e.g., Lose 0.5kg per week"
              },
              "targets": {
                "dailyCalories": number (target daily calories, calculated based on deficit/surplus required),
                "proteinGrams": number,
                "carbsGrams": number,
                "fatGrams": number,
                "proteinPercent": number,
                "carbsPercent": number,
                "fatPercent": number
              },
              "workoutPlan": {
                "routineName": "e.g., Push/Pull/Legs Split or Upper/Lower split",
                "splitDescription": "Brief explanation of routine focus",
                "weeklySchedule": [
                  {
                    "dayName": "Monday",
                    "focus": "Upper Body Push",
                    "restDay": false,
                    "exercises": [
                      { "name": "Dumbbell Bench Press", "sets": 3, "reps": "8-12", "weight": "Challenging", "notes": "Focus on slow negative phase" },
                      { "name": "Overhead Press", "sets": 3, "reps": "8-10", "weight": "Moderate", "notes": "Keep core tight" },
                      { "name": "Lateral Raises", "sets": 4, "reps": "12-15", "weight": "Light", "notes": "Control the descent" }
                    ]
                  },
                  {
                    "dayName": "Tuesday",
                    "focus": "Rest Day",
                    "restDay": true,
                    "exercises": []
                  }
                  // Include a split for Monday through Sunday
                ]
              },
              "mealPlan": {
                "guidelines": "Core dietary rules for weight loss/gain",
                "meals": [
                  { "type": "Breakfast", "recommendation": "recommendation details", "approxCalories": number, "protein": number },
                  { "type": "Lunch", "recommendation": "recommendation details", "approxCalories": number, "protein": number },
                  { "type": "Dinner", "recommendation": "recommendation details", "approxCalories": number, "protein": number },
                  { "type": "Snacks", "recommendation": "recommendation details", "approxCalories": number, "protein": number }
                ]
              }
            }`;

            const prompt = `User profile:
            - Name: ${profile.name}
            - Gender: ${profile.gender}
            - Age: ${profile.age} years old
            - Weight: ${profile.weight} kg
            - Height: ${profile.height} cm
            - Activity level: ${profile.activityLevel}
            - Current Body State: ${profile.currentBody}
            - Target Physique Goal: ${profile.targetBody}
            - Current Diet Habits: ${profile.dailyFood}`;

            const contents = [{ parts: [{ text: prompt }] }];
            
            const responseData = await this.callGemini(contents, systemInstruction, true);
            const planText = responseData.text;
            const parsedPlan = this.parseJSONFromResponse(planText);
            
            // Initialize history data (with mock previous 6 days to populate trends instantly)
            const history = [];
            const today = new Date();
            for (let i = 6; i >= 1; i--) {
                const pastDate = new Date();
                pastDate.setDate(today.getDate() - i);
                const dateStr = pastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                // Simulate progressive weight loss/gain towards goal
                let wOffset = 0;
                if (parsedPlan.assessment.weeklyGoalText.toLowerCase().includes("lose")) {
                    wOffset = (i * 0.1);
                } else if (parsedPlan.assessment.weeklyGoalText.toLowerCase().includes("gain")) {
                    wOffset = -(i * 0.1);
                }
                history.push({
                    date: dateStr,
                    weight: Number((profile.weight + wOffset).toFixed(1)),
                    calories: Math.round(parsedPlan.targets.dailyCalories * (0.9 + Math.random() * 0.2)) // random fluctuation around target
                });
            }
            
            // Add today
            history.push({
                date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                weight: profile.weight,
                calories: 0
            });

            // Set state
            this.state.profile = profile;
            this.state.aiPlan = parsedPlan;
            this.state.history = history;
            this.state.meals = [];
            this.state.chatHistory = [
                { sender: 'coach', text: `Welcome, ${profile.name}! I have compiled your profile. Based on your target body of "${profile.targetBody}", I recommend a daily limit of **${parsedPlan.targets.dailyCalories} kcal**.` },
                { sender: 'coach', text: `Your customized workout plan is the **${parsedPlan.workoutPlan.routineName}**. Check the Workouts tab to see today's split!` }
            ];
            
            this.saveState();
            audio.playSuccess();
            this.routeOnboardingState();
            this.showToast("Plan successfully compiled by Aura!");

        } catch (e) {
            console.error("Onboarding failed", e);
            alert("Error generating workout plan: " + e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = origContent;
        }
    },

    // 2. DASHBOARD RENDERING
    renderDashboard() {
        if (!this.state.profile || !this.state.aiPlan) return;
        
        // Welcome name
        document.getElementById('welcomeUser').textContent = `Welcome back, ${this.state.profile.name}!`;
        
        // Calorie calculation
        const target = this.state.aiPlan.targets.dailyCalories;
        const eaten = this.state.meals.reduce((sum, m) => sum + m.calories, 0);
        const burned = this.state.burnedCaloriesToday;
        const remaining = Math.max(0, target - eaten + burned);
        
        document.getElementById('caloriesRemaining').textContent = remaining;
        document.getElementById('caloriesTargetText').textContent = `Goal: ${target} kcal`;
        document.getElementById('caloriesEaten').textContent = eaten;
        document.getElementById('caloriesBudget').textContent = target;
        document.getElementById('caloriesBurned').textContent = burned;

        // Update circular ring offset
        const ring = document.getElementById('calorieProgressRing');
        const circumference = 2 * Math.PI * 85; // r=85
        const ratio = eaten / (target + burned);
        const offset = circumference * (1 - Math.min(1, ratio));
        ring.style.strokeDasharray = `${circumference}`;
        ring.style.strokeDashoffset = `${offset}`;

        // Macronutrients Progress Bars
        const targetP = this.state.aiPlan.targets.proteinGrams;
        const targetC = this.state.aiPlan.targets.carbsGrams;
        const targetF = this.state.aiPlan.targets.fatGrams;
        
        const eatenP = this.state.meals.reduce((sum, m) => sum + m.protein, 0);
        const eatenC = this.state.meals.reduce((sum, m) => sum + m.carbs, 0);
        const eatenF = this.state.meals.reduce((sum, m) => sum + m.fat, 0);

        document.getElementById('proteinGramProgress').textContent = `${eatenP}g / ${targetP}g`;
        document.getElementById('carbsGramProgress').textContent = `${eatenC}g / ${targetC}g`;
        document.getElementById('fatsGramProgress').textContent = `${eatenF}g / ${targetF}g`;

        document.getElementById('proteinBar').style.width = `${Math.min(100, (eatenP / targetP) * 100)}%`;
        document.getElementById('carbsBar').style.width = `${Math.min(100, (eatenC / targetC) * 100)}%`;
        document.getElementById('fatsBar').style.width = `${Math.min(100, (eatenF / targetF) * 100)}%`;

        // Coach Assessment card
        document.getElementById('coachAssessmentHeader').textContent = this.state.aiPlan.workoutPlan.routineName;
        document.getElementById('coachAssessmentText').textContent = this.state.aiPlan.assessment.calorieAnalysis;

        // Goals Status Checklist on Dashboard
        const goalsContainer = document.getElementById('coachGoalsStatusList');
        goalsContainer.innerHTML = '';
        
        const goalItems = [
            `Current Body: ${this.state.aiPlan.assessment.currentBodyType}`,
            `Target Strategy: ${this.state.aiPlan.assessment.targetBodyAnalysis}`,
            `Weekly Goal: ${this.state.aiPlan.assessment.weeklyGoalText}`
        ];
        
        goalItems.forEach(goal => {
            const div = document.createElement('div');
            div.className = 'goal-status-item';
            div.innerHTML = `<i data-lucide="compass"></i><span>${goal}</span>`;
            goalsContainer.appendChild(div);
        });

        // Calorie Advisor Suggestions
        this.updateCalorieAdvisor(remaining, eatenP, targetP);

        // Update history daily calorie entry for today
        if (this.state.history.length > 0) {
            this.state.history[this.state.history.length - 1].calories = eaten;
            this.saveState();
        }

        // Render Weight/Calorie chart
        this.renderChart(document.getElementById('btnCalorieChart').classList.contains('active') ? 'calorie' : 'weight');
        lucide.createIcons();
    },

    updateCalorieAdvisor(remaining, eatenP, targetP) {
        const advisorTextDiv = document.getElementById('caloriesStatusReport');
        const suggestionsDiv = document.getElementById('foodSuggestionsContainer');
        suggestionsDiv.innerHTML = '';

        if (remaining > 0) {
            advisorTextDiv.innerHTML = `<p class="report-text">You have <strong>${remaining} kcal</strong> remaining for the day. To hit your target body type, try to fulfill your remaining macro metrics.</p>`;
            
            // Suggest foods based on what macros are lacking
            const suggestions = [];
            const proteinLeft = targetP - eatenP;

            if (proteinLeft > 15) {
                suggestions.push({
                    name: 'Grilled Chicken Breast (150g)',
                    desc: 'High protein, low fat to hit macro target',
                    cal: 165,
                    prot: '31g P'
                });
                suggestions.push({
                    name: 'Egg Whites Scramble (4 eggs)',
                    desc: 'Pure lean protein, zero carbs',
                    cal: 70,
                    prot: '16g P'
                });
                suggestions.push({
                    name: 'Greek Yogurt (Non-fat, 200g)',
                    desc: 'Great quick protein source with calcium',
                    cal: 120,
                    prot: '20g P'
                });
            } else {
                suggestions.push({
                    name: 'Handful of Mixed Almonds (30g)',
                    desc: 'Healthy unsaturated fats and trace protein',
                    cal: 180,
                    prot: '6g P'
                });
                suggestions.push({
                    name: 'Medium Banana or Apple',
                    desc: 'Quick digestive carbs for muscle glycogen',
                    cal: 95,
                    prot: '1g P'
                });
            }

            suggestions.forEach(food => {
                const item = document.createElement('div');
                item.className = 'suggested-food';
                item.innerHTML = `
                    <div class="suggested-food-info">
                        <h5>${food.name}</h5>
                        <span>${food.desc}</span>
                    </div>
                    <div class="suggested-food-macro">
                        <span class="cal">+${food.cal} kcal</span>
                        <span class="prot">${food.prot}</span>
                    </div>
                `;
                suggestionsDiv.appendChild(item);
            });

        } else {
            advisorTextDiv.innerHTML = `<p class="report-text" style="color: #ff9e8a;"><strong>Limit Reached:</strong> You have fully consumed your daily budget! Restrict further food intake to water, green tea, or black coffee to maintain your body transition trajectory.</p>`;
        }
    },

    // 3. WORKOUT ROUTINE HANDLING
    renderWorkouts() {
        if (!this.state.profile || !this.state.aiPlan) return;

        const schedule = this.state.aiPlan.workoutPlan.weeklySchedule;
        document.getElementById('routineNameText').textContent = this.state.aiPlan.workoutPlan.routineName;

        // Generate Split days list on Left Panel
        const daysContainer = document.getElementById('daysListContainer');
        daysContainer.innerHTML = '';

        schedule.forEach((day, idx) => {
            const btn = document.createElement('button');
            btn.className = `day-btn ${idx === this.state.currentWorkoutDayIdx ? 'active' : ''}`;
            btn.innerHTML = `
                <div class="day-meta">
                    <strong>${day.dayName}</strong>
                    <span>${day.focus}</span>
                </div>
                <i data-lucide="${day.restDay ? 'coffee' : 'chevron-right'}"></i>
            `;
            btn.addEventListener('click', () => {
                this.state.currentWorkoutDayIdx = idx;
                this.renderWorkouts();
            });
            daysContainer.appendChild(btn);
        });

        // Generate selected day exercises on Right Panel
        const selectedDay = schedule[this.state.currentWorkoutDayIdx];
        document.getElementById('currentWorkoutDayFocus').textContent = `${selectedDay.dayName}: ${selectedDay.focus}`;
        
        const descDiv = document.getElementById('currentWorkoutDescription');
        const completeBtn = document.getElementById('completeWorkoutBtn');
        const exercisesContainer = document.getElementById('exercisesContainer');
        exercisesContainer.innerHTML = '';

        if (selectedDay.restDay) {
            descDiv.textContent = 'Active Recovery / Full Rest. Let your muscle fibers repair and synthesize.';
            completeBtn.classList.add('hidden');
            exercisesContainer.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="coffee"></i>
                    <p>It's a Rest Day! Focus on recovery, hydration, and stretching. Keep calories within your limit.</p>
                </div>
            `;
        } else {
            descDiv.textContent = 'Complete the sets below. Mark sets checked when finished. Remember to log your weights.';
            completeBtn.classList.remove('hidden');

            selectedDay.exercises.forEach((ex, exIdx) => {
                const exCard = document.createElement('div');
                exCard.className = 'exercise-card';
                
                // Track sets completed state (dynamic key: dayIdx_exIdx)
                const key = `workout_${this.state.currentWorkoutDayIdx}_ex_${exIdx}`;
                const checkedSetsCount = this.state[key] || 0;
                
                let setsRowsHTML = '';
                for (let s = 1; s <= ex.sets; s++) {
                    const isChecked = s <= checkedSetsCount;
                    setsRowsHTML += `
                        <div class="set-input-row">
                            <span class="set-num">Set ${s}</span>
                            <input type="text" placeholder="${ex.weight}" class="set-weight" id="weight_${key}_s${s}">
                            <input type="text" placeholder="${ex.reps}" class="set-reps" id="reps_${key}_s${s}">
                            <label class="set-check">
                                <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="app.toggleSetCheck(${exIdx}, ${s}, this)">
                                <div class="set-checkbox-visual">
                                    <i data-lucide="check"></i>
                                </div>
                            </label>
                        </div>
                    `;
                }

                exCard.innerHTML = `
                    <div class="exercise-card-header">
                        <div class="exercise-title-wrap">
                            <div class="exercise-title-info">
                                <h4>${ex.name}</h4>
                                <p>${ex.sets} Sets x ${ex.reps} Reps</p>
                            </div>
                        </div>
                        <span class="exercise-badge-target">Weight Target: ${ex.weight}</span>
                    </div>
                    <div class="exercise-details">
                        <p class="exercise-notes">${ex.notes}</p>
                        
                        <div class="sets-tracker-table">
                            <span class="table-header">Set</span>
                            <span class="table-header">Weight</span>
                            <span class="table-header">Reps</span>
                            <span class="table-header">Log</span>
                            ${setsRowsHTML}
                        </div>
                    </div>
                `;
                exercisesContainer.appendChild(exCard);
            });
        }
        lucide.createIcons();
    },

    toggleSetCheck(exIdx, setNum, checkbox) {
        const key = `workout_${this.state.currentWorkoutDayIdx}_ex_${exIdx}`;
        let checkedSetsCount = this.state[key] || 0;

        if (checkbox.checked) {
            // Checked set: increment count
            checkedSetsCount = Math.max(checkedSetsCount, setNum);
            audio.playSuccess();
            this.showToast("Set logged!");
        } else {
            // Unchecked: decrease count
            checkedSetsCount = Math.min(checkedSetsCount, setNum - 1);
            audio.playBeep(400, 0.05, 'sine');
        }

        this.state[key] = checkedSetsCount;
        this.saveState();
        this.renderWorkouts();
    },

    completeWorkout() {
        // Workout finished, award calories burned
        this.state.burnedCaloriesToday += 350; // average workout burns ~350 kcal
        this.state.completedWorkoutsToday = true;
        this.saveState();
        audio.playSuccess();
        alert("Awesome job! You completed today's training split and burned 350 kcal. Check your dashboard!");
        this.switchTab('dashboard');
    },

    // 4. NUTRITION AND DIET LOGGING
    renderNutrition() {
        if (!this.state.profile || !this.state.aiPlan) return;

        // Render macro circle percentages
        const tCal = this.state.aiPlan.targets.dailyCalories;
        const tProt = this.state.aiPlan.targets.proteinGrams;
        const tCarb = this.state.aiPlan.targets.carbsGrams;
        const tFat = this.state.aiPlan.targets.fatGrams;

        document.getElementById('proteinMacroTarget').textContent = `${tProt}g Target`;
        document.getElementById('carbsMacroTarget').textContent = `${tCarb}g Target`;
        document.getElementById('fatsMacroTarget').textContent = `${tFat}g Target`;

        document.getElementById('proteinPercentageCircle').textContent = `${this.state.aiPlan.targets.proteinPercent}%`;
        document.getElementById('carbsPercentageCircle').textContent = `${this.state.aiPlan.targets.carbsPercent}%`;
        document.getElementById('fatsPercentageCircle').textContent = `${this.state.aiPlan.targets.fatPercent}%`;

        // Load today's food items
        const foodList = document.getElementById('foodLogList');
        foodList.innerHTML = '';

        const totalEaten = this.state.meals.reduce((sum, m) => sum + m.calories, 0);
        document.getElementById('todayFoodTotalCal').textContent = `${totalEaten} kcal logged`;

        if (this.state.meals.length === 0) {
            foodList.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="salad"></i>
                    <p>No meals logged today. Describe what you ate on the left or add manually to start tracking.</p>
                </div>
            `;
        } else {
            this.state.meals.forEach((meal, idx) => {
                const item = document.createElement('div');
                item.className = 'food-log-item';
                item.innerHTML = `
                    <div class="food-item-name-wrap">
                        <h5>${meal.name}</h5>
                        <div class="food-item-macros">
                            <span class="macro-badge cal">${meal.calories} kcal</span>
                            <span class="macro-badge p">P: ${meal.protein}g</span>
                            <span class="macro-badge c">C: ${meal.carbs}g</span>
                            <span class="macro-badge f">F: ${meal.fat}g</span>
                        </div>
                    </div>
                    <button class="food-item-delete" onclick="app.deleteMeal(${idx})">
                        <i data-lucide="trash-2"></i>
                    </button>
                `;
                foodList.appendChild(item);
            });
        }
        lucide.createIcons();
    },

    // 4a. LOG FOOD USING NATURAL LANGUAGE AI
    async handleAIFoodLog() {
        const promptInput = document.getElementById('foodPrompt');
        const desc = promptInput.value.trim();
        if (!desc) return;

        const btn = document.getElementById('logFoodBtn');
        const origContent = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span>Analyzing ingredients...</span>';

        try {
            const systemInstruction = `You are Aura Nutritionist AI. Analyze the food described by the user and estimate its macronutrients (Protein, Carbs, Fats) and total calories.
            You must output a single JSON object. Do not include markdown codeblocks (no \`\`\`json).
            
            JSON schema constraints:
            {
              "foodName": "A concise summary of the items entered (e.g., 2 Scrambled Eggs & Whole Wheat Toast)",
              "calories": number,
              "protein": number (grams),
              "carbs": number (grams),
              "fat": number (grams),
              "coachingTip": "A friendly, expert one-sentence tip about this meal's nutritional profile."
            }`;

            const contents = [{ parts: [{ text: `Estimate macros for: ${desc}` }] }];
            const responseData = await this.callGemini(contents, systemInstruction, true);
            const rawText = responseData.text;
            const mealData = this.parseJSONFromResponse(rawText);

            // Add to meals log
            this.state.meals.push({
                name: mealData.foodName,
                calories: Math.round(mealData.calories),
                protein: Math.round(mealData.protein),
                carbs: Math.round(mealData.carbs),
                fat: Math.round(mealData.fat)
            });

            this.saveState();
            audio.playSuccess();
            promptInput.value = '';
            this.renderNutrition();
            
            // Add coach tip to history
            this.state.chatHistory.push({ sender: 'coach', text: `🥦 *Nutrition Logging Tip for your ${mealData.foodName}*: ${mealData.coachingTip}` });
            this.saveState();
            
            this.showToast(`Logged ${mealData.foodName}! (+${mealData.calories} kcal)`);
        } catch (e) {
            console.error("AI food logging failed", e);
            alert("Could not process food description: " + e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = origContent;
        }
    },

    // 4b. MANUAL FOOD LOGGING
    handleManualFoodLog() {
        const nameInput = document.getElementById('manualFoodName');
        const calInput = document.getElementById('manualCalories');
        const protInput = document.getElementById('manualProtein');
        const carbInput = document.getElementById('manualCarbs');
        const fatInput = document.getElementById('manualFat');

        const meal = {
            name: nameInput.value,
            calories: Number(calInput.value),
            protein: Number(protInput.value) || 0,
            carbs: Number(carbInput.value) || 0,
            fat: Number(fatInput.value) || 0
        };

        this.state.meals.push(meal);
        this.saveState();
        audio.playSuccess();
        
        // Clear fields
        nameInput.value = '';
        calInput.value = '';
        protInput.value = '';
        carbInput.value = '';
        fatInput.value = '';

        this.renderNutrition();
        this.showToast(`Logged ${meal.name} manually!`);
    },

    deleteMeal(idx) {
        this.state.meals.splice(idx, 1);
        this.saveState();
        audio.playBeep(400, 0.05, 'sine');
        this.renderNutrition();
        this.showToast("Meal removed.");
    },

    // 5. AI COACH CHAT SCREEN
    renderCoachTab() {
        const chatContainer = document.getElementById('chatMessages');
        chatContainer.innerHTML = '';

        this.state.chatHistory.forEach(msg => {
            const div = document.createElement('div');
            div.className = `message ${msg.sender}`;
            div.innerHTML = `
                <div class="message-content">
                    <p>${this.formatChatMessageText(msg.text)}</p>
                </div>
            `;
            chatContainer.appendChild(div);
        });

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    },

    formatChatMessageText(text) {
        // Simple markdown parsing for bold and bullet points
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    },

    async handleSendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const query = chatInput.value.trim();
        if (!query) return;

        // Display user message immediately
        this.state.chatHistory.push({ sender: 'user', text: query });
        this.renderCoachTab();
        chatInput.value = '';

        // Display typing indicator
        const chatContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message coach';
        typingDiv.id = 'typingIndicatorElement';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        try {
            // Setup context for Gemini
            const tCal = this.state.aiPlan.targets.dailyCalories;
            const eaten = this.state.meals.reduce((sum, m) => sum + m.calories, 0);
            const burned = this.state.burnedCaloriesToday;
            const remaining = tCal - eaten + burned;

            const systemInstruction = `You are Aura, an elite AI Personal Trainer, Nutritionist, and Fitness Coach.
            You are assisting the user. They are on a body transformation journey.
            Here is the user's status context:
            - Profile Name: ${this.state.profile.name}
            - Current Body: ${this.state.profile.currentBody}
            - Target Body: ${this.state.profile.targetBody}
            - Gender: ${this.state.profile.gender}, Age: ${this.state.profile.age}, Weight: ${this.state.profile.weight}kg, Height: ${this.state.profile.height}cm
            - Daily Calorie Target: ${tCal} kcal
            - Macronutrient target: Protein: ${this.state.aiPlan.targets.proteinGrams}g, Carbs: ${this.state.aiPlan.targets.carbsGrams}g, Fats: ${this.state.aiPlan.targets.fatGrams}g
            - Calories consumed today: ${eaten} kcal
            - Calories burned via workout today: ${burned} kcal
            - Remaining Calories: ${remaining} kcal
            - Training Routine Name: ${this.state.aiPlan.workoutPlan.routineName}
            
            Always keep your responses highly motivational, clear, and focused on physical and dietary guidelines. Be concise, avoiding paragraphs that are too long.`;

            // Prepare history payloads (limit to last 6 chat history messages to stay within token boundaries)
            const chatPayload = [];
            const slicedHistory = this.state.chatHistory.slice(-6);
            slicedHistory.forEach(msg => {
                chatPayload.push({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                });
            });

            const responseData = await this.callGemini(chatPayload, systemInstruction, false);
            const coachReply = responseData.text;

            // Remove typing indicator
            const el = document.getElementById('typingIndicatorElement');
            if (el) el.remove();

            // Save reply
            this.state.chatHistory.push({ sender: 'coach', text: coachReply });
            this.saveState();
            this.renderCoachTab();
            audio.playBeep(600, 0.08, 'triangle');

        } catch (e) {
            console.error("Chat failure", e);
            const el = document.getElementById('typingIndicatorElement');
            if (el) el.remove();
            
            this.state.chatHistory.push({ sender: 'coach', text: "Sorry, I ran into a connection glitch. Please check backend settings." });
            this.renderCoachTab();
        }
    },

    clearChat() {
        if (confirm("Reset chat history?")) {
            this.state.chatHistory = [
                { sender: 'coach', text: `Chat refreshed. Let's tackle your ${this.state.profile?.name ? 'goals' : 'parameters'}!` }
            ];
            this.saveState();
            this.renderCoachTab();
        }
    },

    // 6. SETTINGS ACTIONS
    saveGroqApiKey() {
        const input = document.getElementById('groqApiKeyInput');
        if (input) {
            this.state.groqApiKey = input.value.trim();
            this.saveState();
            this.showToast("Groq API Key saved in local storage.");
        }
    },

    logNewWeight() {
        const input = document.getElementById('newWeightInput');
        const weight = Number(input.value);
        if (!weight || weight <= 30 || weight >= 250) {
            alert("Please enter a valid weight between 30kg and 250kg.");
            return;
        }

        // Update profile current weight
        this.state.profile.weight = weight;
        
        // Add new record to history
        const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        // If today's entry already exists, update weight, otherwise push
        const todayEntry = this.state.history.find(h => h.date === todayStr);
        if (todayEntry) {
            todayEntry.weight = weight;
        } else {
            this.state.history.push({
                date: todayStr,
                weight: weight,
                calories: this.state.meals.reduce((sum, m) => sum + m.calories, 0)
            });
        }

        this.saveState();
        input.value = '';
        audio.playSuccess();
        this.renderDashboard();
        this.showToast("Weight updated successfully!");
    },

    resetAllData() {
        if (confirm("Are you absolutely sure? This will wipe your profile, workouts, and eating history logs forever.")) {
            localStorage.removeItem('aura_fitness_state');
            location.reload();
        }
    },

    // 7. CHART RENDERING VIA CHART.JS
    renderChart(type) {
        const canvas = document.getElementById('historyChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        let labels = [];
        let data = [];
        let labelText = '';
        let borderColor = '#8a2be2';
        let backgroundColor = 'rgba(138, 43, 226, 0.08)';

        const history = this.state.history || [];

        if (type === 'weight') {
            labels = history.map(h => h.date);
            data = history.map(h => h.weight);
            labelText = 'Weight (kg)';
            borderColor = '#00d2ff';
            backgroundColor = 'rgba(0, 210, 255, 0.08)';
        } else {
            labels = history.map(h => h.date);
            data = history.map(h => h.calories);
            labelText = 'Calorie Log (kcal)';
            borderColor = '#ff4b2b';
            backgroundColor = 'rgba(255, 75, 43, 0.08)';
        }

        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: labelText,
                    data: data,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: borderColor,
                    pointHoverRadius: 6,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.03)' },
                        ticks: { color: '#8d8a9e', font: { family: 'Outfit', size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.03)' },
                        ticks: { color: '#8d8a9e', font: { family: 'Outfit', size: 10 } }
                    }
                }
            }
        });
    }
};

// Initialize app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    app.init();
});
