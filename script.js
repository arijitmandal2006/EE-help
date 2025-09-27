
 
        // --- CONSTANTS AND DATA ---
        const COLOR_CODES = {
            'Black': { digit: 0, multiplier: 1, tolerance: null, colorClass: 'color-black' },
            'Brown': { digit: 1, multiplier: 10, tolerance:null, colorClass: 'color-brown' },
            'Red': { digit: 2, multiplier: 100, tolerance: null, colorClass: 'color-red' },
            'Orange': { digit: 3, multiplier: 1000, tolerance: null, colorClass: 'color-orange' },
            'Yellow': { digit: 4, multiplier: 10000, tolerance: null, colorClass: 'color-yellow' },
            'Green': { digit: 5, multiplier: 100000, tolerance: null, colorClass: 'color-green' },
            'Blue': { digit: 6, multiplier: 1000000, tolerance: null, colorClass: 'color-blue' },
            'Violet': { digit: 7, multiplier: 10000000, tolerance: null, colorClass: 'color-violet' },
            'Gray': { digit: 8, multiplier: null, tolerance: 0.05, colorClass: 'color-gray' },
            'White': { digit: 9, multiplier: null, tolerance: null, colorClass: 'color-white' },
            'Gold': { digit: null, multiplier: 0.1, tolerance: 5, colorClass: 'color-gold' },
            'Silver': { digit: null, multiplier: 0.01, tolerance: 10, colorClass: 'color-silver' },
            'None': { digit: null, multiplier: null, tolerance: 20, colorClass: 'color-none' } // For 4-band tolerance
        };

        // --- STATE ---
        let selectedColors = {
            1: 'None',
            2: 'None',
            3: 'None',
            4: 'None',
            5: 'None'
        };
        let bandMode = 4; // Default to 5-band

        // --- UTILITY FUNCTIONS ---

        /**
         * Formats a large number into a readable string with metric prefixes (k, M, G).
         * @param {number} ohms - The resistance value in Ohms.
         * @returns {string} Formatted resistance string (e.g., "4.7 kΩ").
         */
        function formatOhms(ohms) {
            if (isNaN(ohms) || ohms === 0) return '0 Ω';
            if (ohms === Infinity) return 'Infinity';

            const units = ['', 'k', 'M', 'G']; // Ω, kΩ, MΩ, GΩ
            let i = 0;

            // Handle very small resistances for Gold/Silver multipliers
            if (ohms < 1) {
                // If it's less than 1 Ohm, just show the full decimal value
                return ohms.toFixed(2).replace(/\.00$/, '') + ' Ω';
            }

            // Standard metric prefix loop
            while (ohms >= 1000) {
                ohms /= 1000;
                i++;
            }

            // Use toFixed(2) for precision and clean up unnecessary trailing zero
            let formatted = ohms.toFixed(2);
            formatted = formatted.endsWith('.00') ? formatted.substring(0, formatted.length - 3) : formatted;
            formatted = formatted.endsWith('0') ? formatted.substring(0, formatted.length - 1) : formatted;
            
            return `${formatted} ${units[i]}Ω`;
        }

        // --- CORE LOGIC ---

        /**
         * Initializes the select dropdowns with available colors and their associated tooltips.
         */
        function initializeSelects() {
            const digitColors = Object.keys(COLOR_CODES).filter(color => COLOR_CODES[color].digit !== null);
            const multiplierColors = Object.keys(COLOR_CODES).filter(color => COLOR_CODES[color].multiplier !== null);
            const toleranceColors = Object.keys(COLOR_CODES).filter(color => COLOR_CODES[color].tolerance !== null || color === 'None');

            const selects = {
                1: document.getElementById('selectBand1'),
                2: document.getElementById('selectBand2'),
                3: document.getElementById('selectBand3'),
                4: document.getElementById('selectBand4'),
                5: document.getElementById('selectBand5'),
            };
            
            // Function to populate a select element
            const populateSelect = (selectEl, colors, type) => {
                selectEl.innerHTML = '<option value="None" class="text-gray-500" disabled selected>-- Select Color --</option>';
                colors.forEach(color => {
                    const code = COLOR_CODES[color];
                    let label = color;

                    if (type === 'digit') {
                        label += ` (${code.digit})`;
                    } else if (type === 'multiplier') {
                        let val = code.multiplier;
                        if (val >= 1000000) label += ` (x${val / 1000000}M)`;
                        else if (val >= 1000) label += ` (x${val / 1000}k)`;
                        else if (val >= 1) label += ` (x${val})`;
                        else label += ` (x${val})`;
                    } else if (type === 'tolerance') {
                        label += code.tolerance !== null ? ` (±${code.tolerance}%)` : ' (±20%)';
                    }

                    const option = new Option(label, color);
                    // Ensure option text is readable against the dark select background
                    option.className = color !== 'None' ? `text-lg text-white font-medium ${code.colorClass.replace('color-', 'bg-')}` : 'text-gray-300';
                    selectEl.appendChild(option);
                });
            };

            // Populate Digit Bands (1, 2, 3)
            [selects[1], selects[2], selects[3]].forEach(select => populateSelect(select, ['None', ...digitColors], 'digit'));
            
            // Populate Multiplier Band (4 or 3)
            populateSelect(selects[4], ['None', ...multiplierColors], 'multiplier');
            
            // Populate Tolerance Band (5 or 4)
            populateSelect(selects[5], ['None', ...toleranceColors], 'tolerance');

            // Apply the initial mode setting
            toggleBandMode(bandMode);
        }

        /**
         * Calculates the total resistance and tolerance range based on selected colors.
         */
        function calculateResistance() {
            let value = 0;
            let multiplier = 0;
            let tolerance = 0;
            let calculationExplanation = 'Awaiting sufficient color selection.';

            // Get band color names
            const c1 = selectedColors[1];
            const c2 = selectedColors[2];
            const c3 = selectedColors[3];
            const c4 = selectedColors[4];
            const c5 = selectedColors[5];

            const d1 = COLOR_CODES[c1]?.digit;
            const d2 = COLOR_CODES[c2]?.digit;
            const d3 = COLOR_CODES[c3]?.digit;
            const m  = COLOR_CODES[c4]?.multiplier;
            let t  = COLOR_CODES[c5]?.tolerance;
            
            // Check for Gold/Silver in digit bands (invalid, must be digit)
            if ((c1 === 'Gold' || c1 === 'Silver') || (c2 === 'Gold' || c2 === 'Silver') || (bandMode === 5 && (c3 === 'Gold' || c3 === 'Silver'))) {
                document.getElementById('resistanceOutput').textContent = 'INVALID CODE';
                document.getElementById('toleranceOutput').textContent = 'Please check Band 1, 2, or 3.';
                document.getElementById('minResistanceOutput').textContent = '---';
                document.getElementById('maxResistanceOutput').textContent = '---';
                return;
            }

            if (bandMode === 5) {
                // 5-Band (B1, B2, B3 = Digit; B4 = Multiplier; B5 = Tolerance)
                if (d1 !== null && d2 !== null && d3 !== null && m !== null && t !== null) {
                    value = (d1 * 100 + d2 * 10 + d3) * m;
                    
                    calculationExplanation = `Digits: (${d1}${d2}${d3}) = ${d1*100 + d2*10 + d3}. Multiplier: x${formatOhms(m)} (${m}). Tolerance: ±${t}%.`;
                } else if (c1 === 'None' && c2 === 'None') {
                     // Not enough bands selected
                } else {
                    calculationExplanation = 'Waiting for all 5 bands to be selected...';
                }

            } else {
                // 4-Band (B1, B2 = Digit; B3 = Multiplier; B4 = Tolerance)
                
                // For 4-band, we only use physical bands 1, 2, 4 (Multiplier), 5 (Tolerance)
                const c_multi = c4;
                const m_4 = COLOR_CODES[c_multi]?.multiplier;
                
                // Handle 'None' tolerance which means ±20% for 4-band
                if (c5 === 'None') {
                    t = 20;
                }

                if (d1 !== null && d2 !== null && m_4 !== null && t !== null) {
                    value = (d1 * 10 + d2) * m_4;
                    
                    calculationExplanation = `Digits: (${d1}${d2}) = ${d1*10 + d2}. Multiplier: x${formatOhms(m_4)} (${m_4}). Tolerance: ±${t}%.`;

                } else if (c1 === 'None' && c2 === 'None') {
                     // Not enough bands selected
                } else {
                    calculationExplanation = 'Waiting for all 4 bands (Digit 1, Digit 2, Multiplier, Tolerance) to be selected...';
                }
            }

            // Output Results
            const resistanceOutput = document.getElementById('resistanceOutput');
            const toleranceOutput = document.getElementById('toleranceOutput');
            const explanationOutput = document.getElementById('explanationOutput');
            const minResistanceOutput = document.getElementById('minResistanceOutput');
            const maxResistanceOutput = document.getElementById('maxResistanceOutput');


            if (value > 0 && t !== null) {
                
                const minVal = value * (1 - t / 100);
                const maxVal = value * (1 + t / 100);

                resistanceOutput.textContent = formatOhms(value);
                toleranceOutput.textContent = `±${t}%`;
                minResistanceOutput.textContent = formatOhms(minVal);
                maxResistanceOutput.textContent = formatOhms(maxVal);

                explanationOutput.innerHTML = `${calculationExplanation} <br> <span class="font-bold">Summary:</span> The resistance value is guaranteed to be between the Minimum and Maximum values listed above.`;

            } else {
                resistanceOutput.textContent = '---';
                toleranceOutput.textContent = '---';
                minResistanceOutput.textContent = '---';
                maxResistanceOutput.textContent = '---';
                explanationOutput.textContent = calculationExplanation;
            }
        }

        /**
         * Updates the visual representation of the resistor bands.
         * @param {HTMLElement} selectElement - The select dropdown that triggered the change.
         */
        function updateBands(selectElement) {
            const bandId = selectElement.dataset.band;
            const colorName = selectElement.value;
            const bandEl = document.getElementById(`band${bandId}`);
            const oldColorName = selectedColors[bandId];

            // 1. Update State
            selectedColors[bandId] = colorName;

            // 2. Update Resistor Visualization
            if (bandEl) {
                // Remove old color class and add new one
                const oldClass = COLOR_CODES[oldColorName]?.colorClass;
                const newClass = COLOR_CODES[colorName]?.colorClass;
                
                if (oldClass) bandEl.classList.remove(oldClass);
                if (newClass) bandEl.classList.add(newClass);
                
                // Force an update for "None" to ensure it's transparent
                if (colorName === 'None') {
                     bandEl.classList.add('color-none');
                } else {
                     bandEl.classList.remove('color-none');
                }
            }
            
            // 3. Recalculate Resistance
            calculateResistance();
        }

        /**
         * Toggles between 4-band and 5-band mode, updating the UI and logic.
         * @param {string} mode - '4' or '5'.
         */
        function toggleBandMode(mode) {
            bandMode = parseInt(mode, 10);
            const band3Control = document.getElementById('band3Control');
            const band3Resistor = document.getElementById('band3');
            const band4Label = document.getElementById('band4Label');
            const band3Label = document.getElementById('band3Label');
            const selectBand3 = document.getElementById('selectBand3');

            if (bandMode === 4) {
                // 4-Band Mode: HIDE Band 3 control/band
                band3Control.classList.add('hidden');
                band3Resistor.style.display = 'none';
                
                // Clear and disable band 3 selection (important for calculation)
                selectBand3.value = 'None';
                selectedColors[3] = 'None';

                // Set labels for clarity
                band3Label.textContent = 'Digit (N/A)';
                band4Label.textContent = 'Multiplier Band';

            } else {
                // 5-Band Mode: SHOW Band 3 control/band
                band3Control.classList.remove('hidden');
                band3Resistor.style.display = 'block';

                // Set labels
                band3Label.textContent = 'Digit';
                band4Label.textContent = 'Multiplier Band';
            }
            
            // Re-apply current selections to update visuals and calculations based on the new mode
            updateBands({ dataset: { band: '1' }, value: selectedColors[1] });
            updateBands({ dataset: { band: '2' }, value: selectedColors[2] });
            updateBands({ dataset: { band: '3' }, value: selectedColors[3] });
            updateBands({ dataset: { band: '4' }, value: selectedColors[4] });
            updateBands({ dataset: { band: '5' }, value: selectedColors[5] });

            calculateResistance();
        }

        /**
         * Resets all selections and outputs to their initial state.
         */
        function resetCalculator() {
            Object.keys(selectedColors).forEach(bandId => {
                selectedColors[bandId] = 'None';
                const selectEl = document.getElementById(`selectBand${bandId}`);
                if (selectEl) {
                    selectEl.value = 'None';
                    // Trigger visual update
                    updateBands({ dataset: { band: bandId }, value: 'None' });
                }
            });
            
            // Reset mode to default 5-band
            document.getElementById('bandMode').value = '4';
            toggleBandMode('4'); 
            
            document.getElementById('resistanceOutput').textContent = '---';
            document.getElementById('toleranceOutput').textContent = '---';
            document.getElementById('minResistanceOutput').textContent = '---';
            document.getElementById('maxResistanceOutput').textContent = '---';
            document.getElementById('explanationOutput').textContent = 'Select colors for Band 1, Band 2, the Multiplier, and Tolerance to see the resistance value.';
        }

        // --- INITIALIZATION ---
        window.onload = () => {
            initializeSelects();
            // Start with a small calculation to clear initial "None" selections if needed
            calculateResistance();
        };

  