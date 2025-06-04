document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabBtns = document.querySelectorAll('.designer-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.designer-container .tab-content');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const viewBtns = document.querySelectorAll('.view-btn');
    const typeCards = document.querySelectorAll('.type-card');
    
    // Form elements
    const rackCount = document.getElementById('rack-count');
    const powerUsage = document.getElementById('power-usage');
    const cooling = document.getElementById('cooling');
    const redundancy = document.getElementById('redundancy');
    const security = document.getElementById('security');
    const remoteMonitoring = document.getElementById('remote-monitoring');
    const onSiteSupport = document.getElementById('on-site-support');
    const projectName = document.getElementById('project-name');
    const notes = document.getElementById('notes');
    
    // Summary elements
    const summaryType = document.getElementById('summary-type');
    const summaryRacks = document.getElementById('summary-racks');
    const summaryPower = document.getElementById('summary-power');
    const summaryCooling = document.getElementById('summary-cooling');
    const summaryRedundancy = document.getElementById('summary-redundancy');
    const summarySecurity = document.getElementById('summary-security');
    
    // Preview elements
    const estimatedCost = document.getElementById('estimated-cost');
    const estimatedFootprint = document.getElementById('estimated-footprint');
    const estimatedPUE = document.getElementById('estimated-pue');
    
    // Current step
    let currentStep = 0;
    const steps = ['type', 'capacity', 'infrastructure', 'review'];
    
    // Data center configuration
    const config = {
        type: null,
        racks: 10,
        power: 100,
        cooling: 'standard',
        redundancy: 'n+1',
        security: 'standard',
        remoteMonitoring: false,
        onSiteSupport: false,
        projectName: '',
        notes: ''
    };
    
    // Initialize
    updateStep();
    updateRangeValues();
    updateSummary();
    calculateEstimate();
    
    // Event Listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            goToStep(steps.indexOf(tabId));
        });
    });
    
    nextBtn.addEventListener('click', goToNextStep);
    prevBtn.addEventListener('click', goToPrevStep);
    submitBtn.addEventListener('click', submitConfiguration);
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            setActiveView(view);
        });
    });
    
    typeCards.forEach(card => {
        card.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            selectType(type);
        });
    });
    
    rackCount.addEventListener('input', function() {
        config.racks = parseInt(this.value);
        document.getElementById('rack-value').textContent = this.value;
        updateSummary();
        calculateEstimate();
    });
    
    powerUsage.addEventListener('input', function() {
        config.power = parseInt(this.value);
        document.getElementById('power-value').textContent = this.value;
        updateSummary();
        calculateEstimate();
    });
    
    cooling.addEventListener('change', function() {
        config.cooling = this.value;
        updateSummary();
        calculateEstimate();
    });
    
    redundancy.addEventListener('change', function() {
        config.redundancy = this.value;
        updateSummary();
        calculateEstimate();
    });
    
    security.addEventListener('change', function() {
        config.security = this.value;
        updateSummary();
        calculateEstimate();
    });
    
    remoteMonitoring.addEventListener('change', function() {
        config.remoteMonitoring = this.checked;
        calculateEstimate();
    });
    
    onSiteSupport.addEventListener('change', function() {
        config.onSiteSupport = this.checked;
        calculateEstimate();
    });
    
    projectName.addEventListener('input', function() {
        config.projectName = this.value;
    });
    
    notes.addEventListener('input', function() {
        config.notes = this.value;
    });
    
    // Functions
    function goToNextStep() {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStep();
            }
        }
    }
    
    function goToPrevStep() {
        if (currentStep > 0) {
            currentStep--;
            updateStep();
        }
    }
    
    function goToStep(stepIndex) {
        if (validateStep(currentStep)) {
            currentStep = stepIndex;
            updateStep();
        }
    }
    
    function updateStep() {
        // Update tabs
        tabBtns.forEach((btn, index) => {
            if (index <= currentStep) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update content
        tabContents.forEach((content, index) => {
            if (index === currentStep) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update navigation buttons
        prevBtn.disabled = currentStep === 0;
        
        if (currentStep === steps.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }
    
    function validateStep(step) {
        switch(step) {
            case 0: // Type selection
                if (!config.type) {
                    alert('Please select a data center type');
                    return false;
                }
                return true;
            default:
                return true;
        }
    }
    
    function setActiveView(view) {
        viewBtns.forEach(btn => {
            if (btn.getAttribute('data-view') === view) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        document.querySelector('.preview-3d').classList.toggle('active', view === '3d');
        document.querySelector('.preview-floorplan').classList.toggle('active', view === 'floorplan');
    }
    
    function selectType(type) {
        config.type = type;
        typeCards.forEach(card => {
            if (card.getAttribute('data-type') === type) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        updateSummary();
        calculateEstimate();
    }
    
    function updateRangeValues() {
        document.getElementById('rack-value').textContent = rackCount.value;
        document.getElementById('power-value').textContent = powerUsage.value;
    }
    
    function updateSummary() {
        summaryType.textContent = config.type ? config.type.charAt(0).toUpperCase() + config.type.slice(1) : 'Not selected';
        summaryRacks.textContent = config.racks;
        summaryPower.textContent = config.power + ' kW';
        summaryCooling.textContent = document.getElementById('cooling').options[document.getElementById('cooling').selectedIndex].text;
        summaryRedundancy.textContent = document.getElementById('redundancy').options[document.getElementById('redundancy').selectedIndex].text;
        summarySecurity.textContent = document.getElementById('security').options[document.getElementById('security').selectedIndex].text;
    }
    
    function calculateEstimate() {
        // Simple estimation logic - replace with actual calculations
        let baseCost = 0;
        let footprint = 0;
        let pue = 1.5;
        
        if (config.type === 'modular') {
            baseCost = config.racks * 15000;
            footprint = config.racks * 30;
            pue = 1.4;
        } else if (config.type === 'traditional') {
            baseCost = config.racks * 20000;
            footprint = config.racks * 40;
            pue = 1.6;
        }
        
        // Adjust for power
        baseCost += config.power * 500;
        
        // Adjust for cooling
        if (config.cooling === 'liquid') {
            baseCost *= 1.3;
            pue = 1.2;
        } else if (config.cooling === 'hybrid') {
            baseCost *= 1.15;
            pue = 1.3;
        }
        
        // Adjust for redundancy
        if (config.redundancy === 'n+1') {
            baseCost *= 1.2;
        } else if (config.redundancy === '2n') {
            baseCost *= 1.5;
        } else if (config.redundancy === '2n+1') {
            baseCost *= 1.8;
        }
        
        // Adjust for security
        if (config.security === 'standard') {
            baseCost += 10000;
        } else if (config.security === 'high') {
            baseCost += 25000;
        }
        
        // Add services
        if (config.remoteMonitoring) {
            baseCost += 5000;
        }
        
        if (config.onSiteSupport) {
            baseCost += config.racks * 2000;
        }
        
        // Update display
        estimatedCost.textContent = '$' + baseCost.toLocaleString();
        estimatedFootprint.textContent = footprint + ' sq.ft';
        estimatedPUE.textContent = pue.toFixed(1);
    }
    
    function submitConfiguration() {
        if (!config.projectName) {
            alert('Please enter a project name');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // In a real application, this would be an API call
        setTimeout(() => {
            alert(`Thank you for your submission!\n\nA Vertiv representative will contact you shortly to discuss your ${config.type} data center project.\n\nProject Name: ${config.projectName}\nEstimated Cost: ${estimatedCost.textContent}`);
            
            // Reset form
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit to Vertiv';
            
            // Here you would typically redirect to a confirmation page or dashboard
            // window.location.href = 'dashboard.html';
        }, 1500);
    }
});