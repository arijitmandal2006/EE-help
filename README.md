<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Circuit Transient Analyzer ⚡</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <style>
        /* Custom colors based on the theme */
        :root {
            --color-electric-blue: #0077ff; /* Primary/Interactive */
            --color-neon-green: #00ffaa; /* Accent/Highlight */
            --color-soft-purple: #bb88ff; /* Secondary/Background Accent */
        }
        /* Dark Mode Styling */
        .dark {
            --bg-color: #1a1a2e; /* Deep Dark Blue */
            --text-color: #f0f0f0;
            --card-color: #2c2c44;
            --border-color: #444466;
        }
        /* Light Mode Styling */
        .light {
            --bg-color: #f0f4f8; /* Soft Light Gray */
            --text-color: #1a1a2e;
            --card-color: #ffffff;
            --border-color: #cccccc;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
        }
        .card {
            background-color: var(--card-color);
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s, border-color 0.3s;
        }

        .circuit-button {
            transition: all 0.3s ease;
            cursor: pointer;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            background-color: var(--card-color);
            border: 1px solid var(--border-color);
        }
        .circuit-button:hover {
            border-color: var(--color-electric-blue);
            box-shadow: 0 0 10px var(--color-electric-blue);
        }
        .circuit-button.active {
            background-color: var(--color-electric-blue);
            color: white;
            box-shadow: 0 0 15px var(--color-neon-green);
            border-color: var(--color-neon-green);
            font-weight: 600;
        }
        .input-group input, .input-group select {
            border: 1px solid var(--border-color);
            background-color: transparent;
            color: var(--text-color);
            padding: 0.5rem;
            border-radius: 0.375rem;
            transition: border-color 0.3s;
        }
        .input-group input:focus, .input-group select:focus {
            outline: none;
            border-color: var(--color-neon-green);
            box-shadow: 0 0 5px var(--color-neon-green);
        }
        /* Subtle "Energy Wave" Background Effect (CSS only for minimal overhead) */
        .wave-bg {
            background-image: radial-gradient(circle at top left, var(--color-soft-purple) 0%, transparent 20%),
                              radial-gradient(circle at bottom right, var(--color-electric-blue) 0%, transparent 20%);
            background-blend-mode: multiply;
            opacity: 0.1;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            transition: opacity 0.5s;
        }
    </style>
</head>
<body class="dark min-h-screen">
    <div class="wave-bg"></div>
    <div id="app" class="relative z-10 p-4 md:p-8 lg:p-12">
        <!-- Header & Mode Toggle -->
        <header class="flex justify-between items-center mb-8">
            <h1 class="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-soft-purple to-neon-green">
                Transient Circuit Lab ⚡
            </h1>
            <button id="mode-toggle" class="p-2 rounded-full border border-soft-purple hover:bg-soft-purple hover:text-white transition duration-300">
                <!-- SVG Icon for Dark/Light Mode -->
                <svg id="moon-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                <svg id="sun-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </button>
        </header>

        <!-- Main Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left Panel: Input & Controls (Col 1 of 3) -->
            <div class="lg:col-span-1 space-y-8">
                <!-- Circuit Selection -->
                <div class="card p-6 rounded-xl">
                    <h2 class="text-xl font-semibold mb-4 border-b pb-2" style="border-color: var(--color-soft-purple);">
                        Circuit Selection 💡
                    </h2>
                    <div id="circuit-selector" class="grid grid-cols-2 gap-3">
                        <button class="circuit-button active" data-circuit="RC_SERIES">RC Series</button>
                        <button class="circuit-button" data-circuit="RC_PARALLEL">RC Parallel</button>
                        <button class="circuit-button" data-circuit="RL_SERIES">RL Series</button>
                        <button class="circuit-button" data-circuit="RL_PARALLEL">RL Parallel</button>
                        <button class="circuit-button" data-circuit="RLC_SERIES">RLC Series</button>
                        <button class="circuit-button" data-circuit="RLC_PARALLEL">RLC Parallel</button>
                    </div>
                </div>

                <!-- Component Input -->
                <div class="card p-6 rounded-xl">
                    <h2 class="text-xl font-semibold mb-4 border-b pb-2" style="border-color: var(--color-soft-purple);">
                        Component Values
                    </h2>
                    <div class="space-y-4">
                        <!-- Voltage Source - FIX: Responsive layout for mobile -->
                        <div class="input-group flex flex-col sm:flex-row sm:space-x-2 items-start sm:items-center space-y-1 sm:space-y-0">
                            <label for="input-Vs" class="w-full sm:w-20">Source Voltage (Vs)</label>
                            <input type="number" id="input-Vs" value="10" min="0.1" step="0.1" class="flex-grow">
                            <span class="w-12 text-center text-neon-green font-bold">V</span>
                            <div class="tooltip-container relative">
                                <span class="text-lg cursor-help text-soft-purple hover:text-electric-blue" title="DC voltage source magnitude">?</span>
                            </div>
                        </div>

                        <!-- Resistance - FIX: Responsive layout for mobile -->
                        <div id="input-R-group" class="input-group flex flex-col sm:flex-row sm:space-x-2 items-start sm:items-center space-y-1 sm:space-y-0">
                            <label for="input-R" class="w-full sm:w-20">Resistance (R)</label>
                            <input type="number" id="input-R" value="1000" min="0.1" step="0.1" class="flex-grow">
                            <select id="unit-R" class="w-16">
                                <option value="1">Ω</option>
                                <option value="1000">kΩ</option>
                            </select>
                            <div class="tooltip-container relative">
                                <span class="text-lg cursor-help text-soft-purple hover:text-electric-blue" title="Resistance in Ohms (Ω)">?</span>
                            </div>
                        </div>

                        <!-- Inductance - FIX: Responsive layout for mobile -->
                        <div id="input-L-group" class="input-group flex flex-col sm:flex-row sm:space-x-2 items-start sm:items-center space-y-1 sm:space-y-0">
                            <label for="input-L" class="w-full sm:w-20">Inductance (L)</label>
                            <input type="number" id="input-L" value="10" min="0.1" step="0.1" class="flex-grow">
                            <select id="unit-L" class="w-16">
                                <option value="1">H</option>
                                <option value="0.001">mH</option>
                                <option value="0.000001">µH</option>
                            </select>
                            <div class="tooltip-container relative">
                                <span class="text-lg cursor-help text-soft-purple hover:text-electric-blue" title="Inductance in Henries (H)">?</span>
                            </div>
                        </div>

                        <!-- Capacitance - FIX: Responsive layout for mobile -->
                        <div id="input-C-group" class="input-group flex flex-col sm:flex-row sm:space-x-2 items-start sm:items-center space-y-1 sm:space-y-0">
                            <label for="input-C" class="w-full sm:w-20">Capacitance (C)</label>
                            <input type="number" id="input-C" value="1" min="0.1" step="0.1" class="flex-grow">
                            <select id="unit-C" class="w-16">
                                <option value="1">F</option>
                                <option value="0.000001">µF</option>
                                <option value="0.000000000001">pF</option>
                            </select>
                            <div class="tooltip-container relative">
                                <span class="text-lg cursor-help text-soft-purple hover:text-electric-blue" title="Capacitance in Farads (F)">?</span>
                            </div>
                        </div>
                        
                        <!-- Max Runtime Control - FIX: Responsive layout for mobile -->
                        <div id="input-Tmax-group" class="input-group flex flex-col sm:flex-row sm:space-x-2 items-start sm:items-center space-y-1 sm:space-y-0">
                            <label for="input-Tmax" class="w-full sm:w-20">Max Time (Tmax)</label>
                            <input type="number" id="input-Tmax" placeholder="Auto" min="0.001" step="0.01" class="flex-grow">
                            <select id="unit-Tmax" class="w-16">
                                <option value="1">s</option>
                                <option value="0.001">ms</option>
                                <option value="0.000001">µs</option>
                            </select>
                            <div class="tooltip-container relative">
                                <span class="text-lg cursor-help text-soft-purple hover:text-electric-blue" title="Maximum time for analysis (leave blank for automatic calculation based on settling time)">?</span>
                            </div>
                        </div>

                    </div>
                    <button onclick="calculateAndPlot()" class="mt-6 w-full py-2 rounded-lg font-bold transition duration-300" style="background-color: var(--color-neon-green); color: black;">
                        Analyze Transient Response
                    </button>
                </div>
            </div>

            <!-- Right Panel: Results & Graph (Col 2-3 of 3) -->
            <div class="lg:col-span-2 space-y-8">
                
                <!-- Results Card -->
                <div class="card p-6 rounded-xl">
                    <h2 class="text-xl font-semibold mb-4 border-b pb-2" style="border-color: var(--color-electric-blue);">
                        Analysis Results 💡
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                        <p>Time Constant ($\tau$): <span id="result-tau" class="text-neon-green font-mono text-lg font-bold">N/A</span></p>
                        <p>Damping Ratio ($\zeta$): <span id="result-zeta" class="text-neon-green font-mono text-lg font-bold">N/A</span></p>
                        <p>Damping Type: <span id="result-damping" class="text-electric-blue font-bold text-lg">N/A</span></p>
                        <p>Response Metric: <span id="result-metric" class="text-soft-purple font-bold text-lg">N/A</span></p>
                    </div>
                </div>

                <!-- Graph Card -->
                <div class="card p-6 rounded-xl">
                    <h2 class="text-xl font-semibold mb-4 border-b pb-2" style="border-color: var(--color-electric-blue);">
                        Transient Response Graph
                    </h2>
                    <div class="relative">
                        <canvas id="responseCanvas" class="w-full" height="400"></canvas>
                        <div id="graph-placeholder" class="absolute inset-0 flex items-center justify-center text-gray-500 font-light text-xl bg-opacity-80 rounded-lg" style="background-color: var(--card-color);">
                            Enter values and click 'Analyze' to generate the plot.
                        </div>
                    </div>
                    <!-- Save Button -->
                    <div class="mt-4 flex justify-end">
                        <button onclick="saveCanvasAsPNG()" class="px-4 py-2 rounded-lg text-sm transition duration-300 border hover:opacity-90" style="background-color: var(--color-soft-purple); color: white; border-color: var(--color-soft-purple);">
                            Save Graph (PNG)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Global state
        let currentCircuit = 'RC_SERIES';
        const canvas = document.getElementById('responseCanvas');
        const ctx = canvas.getContext('2d');
        const root = document.documentElement;

        // --- Utility Functions ---

        /** Converts a value from its unit multiplier (e.g., kΩ, µF) to base unit. */
        function getBaseValue(idPrefix) {
            const value = parseFloat(document.getElementById(`input-${idPrefix}`).value);
            const unitMultiplier = parseFloat(document.getElementById(`unit-${idPrefix}`).value);
            return value * unitMultiplier;
        }

        /** Formats a number for display using appropriate engineering notation. */
        function formatEngineering(value, unit) {
            if (value === 0) return `0 ${unit}`;
            const exponents = [
                { suffix: 'p', multiplier: 1e-12 },
                { suffix: 'n', multiplier: 1e-9 },
                { suffix: 'µ', multiplier: 1e-6 },
                { suffix: 'm', multiplier: 1e-3 },
                { suffix: '', multiplier: 1 },
                { suffix: 'k', multiplier: 1e3 },
                { suffix: 'M', multiplier: 1e6 },
            ];

            // Find the best prefix
            let bestExponent = exponents.find(e => Math.abs(value) >= e.multiplier && Math.abs(value) < e.multiplier * 1000) || exponents[4];

            // If value is very small, use the smallest prefix
            if (Math.abs(value) < 1e-12) bestExponent = exponents[0];
            // If value is very large, use the largest prefix
            if (Math.abs(value) >= 1e9) bestExponent = exponents[exponents.length - 1];

            // Scale the value and format to 3 significant figures
            const scaledValue = value / bestExponent.multiplier;
            return `${scaledValue.toPrecision(3)} ${bestExponent.suffix}${unit}`;
        }

        // --- Core Logic Functions ---

        /** Updates the visibility of R, L, C input fields based on the selected circuit. */
        function updateInputVisibility(circuit) {
            const inputs = {
                'R': document.getElementById('input-R-group'),
                'L': document.getElementById('input-L-group'),
                'C': document.getElementById('input-C-group'),
                'Tmax': document.getElementById('input-Tmax-group'), // Tmax is always visible
            };

            // Set all to hidden (flex) by default, then selectively show
            Object.values(inputs).forEach(el => el.style.display = 'none');
            
            // Tmax is always visible
            inputs.Tmax.style.display = 'flex';

            if (circuit.includes('RC')) {
                inputs.R.style.display = 'flex';
                inputs.C.style.display = 'flex';
            } else if (circuit.includes('RLC')) {
                inputs.R.style.display = 'flex';
                inputs.L.style.display = 'flex';
                inputs.C.style.display = 'flex';
            } else if (circuit.includes('RL')) {
                inputs.R.style.display = 'flex';
                inputs.L.style.display = 'flex';
            }
        }

        /** Calculates the time constant (tau) and RLC parameters. */
        function calculateParameters(R, L, C, Vs) {
            let tau = NaN, zeta = NaN, dampingType = 'N/A', metric = 'N/A';
            const R_Ohms = R;
            const L_Henries = L;
            const C_Farads = C;

            switch (currentCircuit) {
                case 'RC_SERIES':
                case 'RC_PARALLEL':
                    tau = R_Ohms * C_Farads;
                    metric = 'Voltage $V_C(t)$';
                    break;
                case 'RL_SERIES':
                case 'RL_PARALLEL':
                    tau = L_Henries / R_Ohms;
                    metric = 'Current $I_L(t)$';
                    break;
                case 'RLC_SERIES':
                case 'RLC_PARALLEL':
                    const alpha = R_Ohms / (2 * L_Henries); // Neper frequency
                    const omega0 = 1 / Math.sqrt(L_Henries * C_Farads); // Resonant frequency
                    zeta = alpha / omega0;

                    if (zeta > 1) {
                        dampingType = 'Overdamped';
                    } else if (zeta < 1) {
                        dampingType = 'Underdamped';
                    } else {
                        dampingType = 'Critically Damped';
                    }
                    metric = 'Voltage $V_C(t)$';
                    break;
            }

            return { tau, zeta, dampingType, Vs, metric };
        }

        /**
         * Returns the transient response value (y) at time t.
         * Assumes a step input (charging/energizing transient).
         */
        function getResponseValue(t, R, L, C, Vs, parameters) {
            const { tau, zeta } = parameters;
            const V_final = Vs;
            const I_final = Vs / R;

            switch (currentCircuit) {
                case 'RC_SERIES':
                case 'RC_PARALLEL':
                    // Voltage across C: Vc(t) = V_final * (1 - e^(-t/tau))
                    return V_final * (1 - Math.exp(-t / tau));

                case 'RL_SERIES':
                case 'RL_PARALLEL':
                    // Current through L: I(t) = I_final * (1 - e^(-t/tau))
                    return I_final * (1 - Math.exp(-t / tau));

                case 'RLC_SERIES':
                case 'RLC_PARALLEL':
                    const alpha = R / (2 * L);
                    const omega0 = 1 / Math.sqrt(L * C);

                    if (zeta === 1) { // Critically Damped
                        // Vc(t) = V_final * [1 - e^(-alpha*t) * (1 + alpha*t)]
                        return V_final * (1 - Math.exp(-alpha * t) * (1 + alpha * t));
                    } else if (zeta > 1) { // Overdamped
                        // Vc(t) = V_final * [1 - e^(-alpha*t) * (A*e^(beta*t) + B*e^(-beta*t))]
                        const s1 = -alpha + Math.sqrt(alpha * alpha - omega0 * omega0);
                        const s2 = -alpha - Math.sqrt(alpha * alpha - omega0 * omega0);
                        const A1 = -s2 / (s1 - s2);
                        const A2 = s1 / (s1 - s2);
                        return V_final * (1 - A1 * Math.exp(s1 * t) - A2 * Math.exp(s2 * t));
                    } else { // Underdamped (zeta < 1)
                        // Vc(t) = V_final * [1 - (e^(-alpha*t)/sqrt(1-zeta^2)) * sin(w_d*t + theta)]
                        const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
                        return V_final * (1 - Math.exp(-alpha * t) * (Math.cos(omegaD * t) + (alpha / omegaD) * Math.sin(omegaD * t)));
                    }
            }
            return 0;
        }

        /** Draws the transient response on the canvas with animation. */
        function plotResponse(R, L, C, Vs, params, Tmax_user) {
            // Clear graph placeholder
            document.getElementById('graph-placeholder').style.display = 'none';

            // Constants for Plotting
            const W = canvas.width;
            const H = canvas.height;
            const PADDING = 40;
            const finalValue = params.metric.includes('Voltage') ? Vs : (Vs / R);
            
            // --- FIX: Dynamic MAX_Y Calculation to include Overshoot ---
            let MAX_Y = finalValue * 1.1; // Default: 10% margin above final value
            
            // Check for overshoot in underdamped RLC circuits (zeta < 1)
            if (currentCircuit.includes('RLC') && params.zeta < 1 && params.zeta > 0) {
                const zeta = params.zeta;
                // Calculate Peak Overshoot (PO) factor: e^(-zeta*pi / sqrt(1-zeta^2))
                const PO_factor = Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta));
                
                // Peak value is Final Value * (1 + PO factor)
                const peakValue = finalValue * (1 + PO_factor);
                
                // Set MAX_Y to the calculated peak value plus a small margin (e.g., 5%)
                MAX_Y = peakValue * 1.05; 
            }
            // --------------------------------------------------------

            
            // Determine max X-axis time (t_max).
            let t_max;
            
            if (Tmax_user && Tmax_user > 0) {
                // Use user defined Tmax if valid
                t_max = Tmax_user;
            } else if (currentCircuit.includes('RLC') && !isNaN(params.zeta) && isFinite(params.zeta)) {
                // For RLC, use a time based on 5*tau_equivalent for automatic calculation
                const alpha = R / (2 * L);
                t_max = 5 * Math.max(0.01, 1 / alpha); 
            } else if (!isNaN(params.tau) && params.tau > 0) {
                // For RC/RL (1st order), use 5*tau
                t_max = 5 * params.tau; 
            }

            if (isNaN(t_max) || t_max === 0 || !isFinite(t_max)) {
                t_max = 0.01; // Default minimum time for display if auto-calc fails
            }
            
            const step = t_max / 1000; // 1000 data points

            // Scaling functions
            const scaleX = (x) => PADDING + (x / t_max) * (W - 2 * PADDING);
            const scaleY = (y) => H - PADDING - (y / MAX_Y) * (H - 2 * PADDING);

            // Clear canvas
            ctx.clearRect(0, 0, W, H);

            // --- Draw Grid Background (mm grid style) ---
            const numMajorDivs = 5; // 0, 25%, 50%, 75%, 100%
            const numMinorDivs = 20; // 5 steps per major division
            
            // Minor Grid Lines (Thin, dotted)
            ctx.setLineDash([1, 2]); // Dotted look
            ctx.strokeStyle = root.style.getPropertyValue('--border-color') + '40'; // Low opacity
            ctx.lineWidth = 0.5;

            // Minor Horizontal Lines
            for (let i = 1; i < numMinorDivs; i++) {
                const yValue = (MAX_Y / numMinorDivs) * i;
                ctx.beginPath();
                ctx.moveTo(PADDING, scaleY(yValue));
                ctx.lineTo(W - PADDING, scaleY(yValue));
                ctx.stroke();
            }
            // Minor Vertical Lines
            for (let i = 1; i < numMinorDivs; i++) {
                const xTime = (t_max / numMinorDivs) * i;
                ctx.beginPath();
                ctx.moveTo(scaleX(xTime), H - PADDING);
                ctx.lineTo(scaleX(xTime), PADDING);
                ctx.stroke();
            }

            // Major Grid Lines (Thicker, solid)
            ctx.setLineDash([]); // Solid line
            ctx.strokeStyle = root.style.getPropertyValue('--border-color') + '80'; // Medium opacity
            ctx.lineWidth = 0.6;

            // Major Horizontal Lines
            for (let i = 1; i < numMajorDivs; i++) {
                const yValue = (MAX_Y / numMajorDivs) * i;
                ctx.beginPath();
                ctx.moveTo(PADDING, scaleY(yValue));
                ctx.lineTo(W - PADDING, scaleY(yValue));
                ctx.stroke();
            }
            // Major Vertical Lines
            for (let i = 1; i < numMajorDivs; i++) {
                const xTime = (t_max / numMajorDivs) * i;
                ctx.beginPath();
                ctx.moveTo(scaleX(xTime), H - PADDING);
                ctx.lineTo(scaleX(xTime), PADDING);
                ctx.stroke();
            }
            // --- End Draw Grid Background ---
            
            // Draw Axes and Final Value Line
            ctx.setLineDash([]); // Reset to solid line for axes
            
            // Y-Axis (Final Value Line) - Neon Green (Solid)
            ctx.strokeStyle = root.style.getPropertyValue('--color-neon-green');
            ctx.lineWidth = 2; // Increased thickness for prominence
            ctx.beginPath();
            ctx.moveTo(PADDING, scaleY(finalValue));
            ctx.lineTo(W - PADDING, scaleY(finalValue));
            ctx.stroke();

            // X and Y Main Axes (Solid) - Reset line width and style
            ctx.lineWidth = 1; 
            ctx.strokeStyle = root.style.getPropertyValue('--border-color');
            ctx.beginPath();
            ctx.moveTo(PADDING, PADDING); // Top Y
            ctx.lineTo(PADDING, H - PADDING); // Bottom Y
            ctx.lineTo(W - PADDING, H - PADDING); // Right X
            ctx.stroke();

            // Axis Labels
            ctx.fillStyle = root.style.getPropertyValue('--text-color');
            ctx.font = '14px Inter';
            
            // Set text alignment for left axis labels (right aligned to PADDING line)
            ctx.textAlign = 'right';
            // Y-Axis Max Value
            ctx.fillText(params.metric.includes('Voltage') ? `${MAX_Y.toPrecision(3)} V` : `${MAX_Y.toPrecision(3)} A`, PADDING - 5, PADDING + 10);
            // Y-Axis Final Value (Vs or I_final)
            ctx.fillText(params.metric.includes('Voltage') ? `${Vs} V` : `${finalValue.toPrecision(3)} A`, PADDING - 5, scaleY(finalValue) + 5);

            // Reset alignment to left for other labels
            ctx.textAlign = 'left';
            // Y-Axis Label (e.g., Voltage V_C(t))
            ctx.fillText(params.metric, PADDING + 5, PADDING - 15);
            
            // X-Axis label
            ctx.fillText('Time (s)', W / 2 - 20, H - PADDING + 30);
            
            // X-Axis origin (0)
            ctx.fillText('0', PADDING - 10, H - PADDING + 15);
            
            // X-Axis Max Value
            ctx.textAlign = 'right';
            ctx.fillText(`${t_max.toPrecision(3)} s`, W - PADDING, H - PADDING + 15);


            // --- Animation Loop ---
            let t = 0;
            let currentX = scaleX(0);
            let currentY = scaleY(getResponseValue(0, R, L, C, Vs, params));
            let i = 0;

            function animatePlot() {
                if (t > t_max) {
                    // Draw Key Points after animation is complete
                    drawKeyPoints(R, L, C, Vs, params, scaleX, scaleY, finalValue, W, H, PADDING);
                    return;
                }

                // Plot Line (Electric Blue)
                ctx.beginPath();
                ctx.strokeStyle = root.style.getPropertyValue('--color-electric-blue');
                ctx.lineWidth = 3;
                ctx.moveTo(currentX, currentY);

                // Advance time
                for (let j = 0; j < 5; j++) { // Draw 5 points per frame for speed
                    t += step;
                    i++;
                    if (t > t_max) break;
                    const nextX = scaleX(t);
                    const nextY = scaleY(getResponseValue(t, R, L, C, Vs, params));
                    ctx.lineTo(nextX, nextY);
                    currentX = nextX;
                    currentY = nextY;
                }
                ctx.stroke();

                requestAnimationFrame(animatePlot);
            }
            
            animatePlot();
        }

        /** Draws key points (tau, settling time, etc.) after the plot animation. */
        function drawKeyPoints(R, L, C, Vs, params, scaleX, scaleY, finalValue, W, H, PADDING) {
            // Draw Key Points (Tau) - Applicable to 1st Order
            if (!currentCircuit.includes('RLC') && params.tau > 0) {
                const tau_x = params.tau;
                const tau_y = getResponseValue(tau_x, R, L, C, Vs, params);
                const x_coord = scaleX(tau_x);
                const y_coord = scaleY(tau_y);
                const tau_val = finalValue * 0.632; // 63.2% of final value

                // Dot at Tau
                ctx.fillStyle = root.style.getPropertyValue('--color-soft-purple');
                ctx.beginPath();
                ctx.arc(x_coord, y_coord, 5, 0, Math.PI * 2);
                ctx.fill();

                // Dotted lines for Tau
                ctx.setLineDash([2, 4]);
                ctx.strokeStyle = root.style.getPropertyValue('--color-soft-purple');
                ctx.lineWidth = 1;
                // Vertical
                ctx.beginPath();
                ctx.moveTo(x_coord, H - PADDING);
                ctx.lineTo(x_coord, y_coord);
                ctx.stroke();
                // Horizontal
                ctx.beginPath();
                ctx.moveTo(PADDING, y_coord);
                ctx.lineTo(x_coord, y_coord);
                ctx.stroke();

                // Tau Label
                ctx.fillStyle = root.style.getPropertyValue('--color-soft-purple');
                ctx.textAlign = 'left';
                ctx.fillText(`τ = ${formatEngineering(params.tau, 's')}`, x_coord + 5, H - PADDING + 15);
                ctx.textAlign = 'right';
                ctx.fillText('63.2%', PADDING - 5, y_coord + 5);
            }

            // Draw Settling Time (Ts) vertical line (2nd Order approximation for 2% criterion)
            let t_settle;
            if (currentCircuit.includes('RLC') && R > 0 && L > 0 && C > 0) {
                // RLC Settling Time: Ts ≈ 4 / alpha
                const alpha = R / (2 * L);
                t_settle = 4 / alpha; 
            } else if (params.tau > 0) {
                // RC/RL Settling Time: 4 * tau
                t_settle = 4 * params.tau;
            }

            if (t_settle > 0 && isFinite(t_settle)) {
                const settle_x_coord = scaleX(t_settle);

                // Settling Time vertical line (dashed)
                ctx.setLineDash([5, 2]);
                ctx.strokeStyle = root.style.getPropertyValue('--color-neon-green');
                ctx.beginPath();
                ctx.moveTo(settle_x_coord, H - PADDING);
                ctx.lineTo(settle_x_coord, PADDING); // Draw line from bottom axis to top of graph area
                ctx.stroke();
                
                // Label
                ctx.fillStyle = root.style.getPropertyValue('--color-neon-green');
                ctx.textAlign = 'left';
                ctx.fillText(`Ts ≈ ${formatEngineering(t_settle, 's')}`, settle_x_coord + 5, H - PADDING + 15);
            }

            // Reset dash and alignment
            ctx.setLineDash([]);
            ctx.textAlign = 'left';
        }


        // --- Event Handlers & Main Function ---

        /** Main function to run calculation and plotting. */
        function calculateAndPlot() {
            // Get base values (ensure R is non-zero for RL circuits)
            const R = getBaseValue('R');
            const L = getBaseValue('L') || 1e-9; // Use small non-zero L for RLC/RL if L is not required but present in calculation
            const C = getBaseValue('C') || 1e-12; // Use small non-zero C for RLC/RC if C is not required but present
            const Vs = parseFloat(document.getElementById('input-Vs').value) || 10;
            
            // Get user-defined Tmax (will be null if blank or invalid)
            const Tmax_user_input = parseFloat(document.getElementById('input-Tmax').value);
            const Tmax_multiplier = parseFloat(document.getElementById('unit-Tmax').value);
            const Tmax_user = (!isNaN(Tmax_user_input) && Tmax_user_input > 0) ? Tmax_user_input * Tmax_multiplier : null;

            if (R === 0) {
                // Simple error message box replacement
                const errorBox = document.createElement('div');
                errorBox.textContent = "Resistance R cannot be zero for this analysis type.";
                errorBox.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #ff4444; color: white; padding: 10px; border-radius: 5px; z-index: 1000;';
                document.body.appendChild(errorBox);
                setTimeout(() => document.body.removeChild(errorBox), 3000);
                return;
            }

            const params = calculateParameters(R, L, C, Vs);

            // 1. Update Results Display
            document.getElementById('result-tau').textContent = isNaN(params.tau) ? 'N/A' : formatEngineering(params.tau, 's');
            document.getElementById('result-zeta').textContent = isNaN(params.zeta) ? 'N/A' : params.zeta.toFixed(3);
            document.getElementById('result-damping').textContent = params.dampingType;
            document.getElementById('result-damping').style.color = 
                params.dampingType === 'Underdamped' ? 'var(--color-electric-blue)' :
                params.dampingType === 'Critically Damped' ? 'var(--color-neon-green)' :
                params.dampingType === 'Overdamped' ? 'var(--color-soft-purple)' :
                root.style.getPropertyValue('--text-color');
            document.getElementById('result-metric').textContent = params.metric;

            // 2. Plotting - Pass the user-defined Tmax
            plotResponse(R, L, C, Vs, params, Tmax_user);
        }

        /** Handles circuit selection buttons. */
        function handleCircuitSelection(event) {
            const button = event.target.closest('.circuit-button');
            if (!button) return;

            // Remove active state from all buttons
            document.querySelectorAll('.circuit-button').forEach(btn => btn.classList.remove('active'));

            // Set active state on clicked button
            button.classList.add('active');
            currentCircuit = button.dataset.circuit;
            
            // Update input fields based on selection
            updateInputVisibility(currentCircuit);

            // Rerun calculation to update display immediately
            calculateAndPlot();
        }

        /** Initializes event listeners. */
        function initialize() {
            // Initial input visibility setup
            updateInputVisibility(currentCircuit);

            // Attach listeners for circuit selection
            document.getElementById('circuit-selector').addEventListener('click', handleCircuitSelection);

            // Attach listeners for input changes to trigger recalculation
            document.querySelectorAll('input, select').forEach(el => {
                if (el.id !== 'mode-toggle') {
                    el.addEventListener('change', calculateAndPlot);
                    el.addEventListener('keyup', calculateAndPlot);
                }
            });

            // Initial calculation run
            calculateAndPlot();

            // Dark/Light Mode Toggle
            const modeToggle = document.getElementById('mode-toggle');
            const moonIcon = document.getElementById('moon-icon');
            const sunIcon = document.getElementById('sun-icon');
            
            modeToggle.addEventListener('click', () => {
                const isDark = root.classList.toggle('light');
                root.classList.toggle('dark', !isDark);
                
                // Toggle icons
                moonIcon.classList.toggle('hidden', isDark);
                sunIcon.classList.toggle('hidden', !isDark);
                
                // Re-plot to ensure canvas axes/text color updates immediately
                calculateAndPlot();
            });
        }

        /** Helper to save the canvas as a PNG file. */
        function saveCanvasAsPNG() {
            try {
                const dataURL = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = dataURL;
                a.download = `TransientResponse_${currentCircuit}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (error) {
                console.error("Error saving canvas:", error);
                // Simple error message box replacement
                const errorBox = document.createElement('div');
                errorBox.textContent = "Could not save graph. Please try again or check browser settings.";
                errorBox.style.cssText = 'position: fixed; top: 20px; right: 20px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 1000;';
                document.body.appendChild(errorBox);
                setTimeout(() => document.body.removeChild(errorBox), 3000);
            }
        }
        
        // Ensure canvas dimensions are set correctly on window load (for responsiveness)
        window.addEventListener('resize', () => {
            const canvasContainer = canvas.parentElement;
            // The -50 margin adjustment is likely incorrect if the canvas is w-full.
            // Let's set the canvas width equal to the container width.
            canvas.width = canvasContainer.clientWidth; 
            calculateAndPlot(); // Redraw graph after resize
        });

        // Set initial canvas width
        window.onload = () => {
            const canvasContainer = canvas.parentElement;
            canvas.width = canvasContainer.clientWidth;
            initialize();
        }
    </script>
</body>
</html>
