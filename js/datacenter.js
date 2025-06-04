document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
    // Your existing datacenter.js code here...
    // When submitting the configuration:
    
    async function submitConfiguration() {
        if (!config.projectName) {
            alert('Please enter a project name');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        try {
            const response = await fetch('/api/datacenters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    projectName: config.projectName,
                    type: config.type,
                    racks: config.racks,
                    power: config.power,
                    cooling: config.cooling,
                    redundancy: config.redundancy,
                    security: config.security,
                    remoteMonitoring: config.remoteMonitoring,
                    onSiteSupport: config.onSiteSupport,
                    notes: config.notes,
                    estimatedCost: parseInt(estimatedCost.textContent.replace(/[^0-9]/g, ''))
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Your data center configuration has been submitted successfully! A Vertiv representative will contact you shortly.');
                window.location.href = '/dashboard.html';
            } else {
                alert(data.message || 'An error occurred while submitting your configuration');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('An error occurred while submitting your configuration');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit to Vertiv';
        }
    }
    
    // Add this to your existing event listeners
    if (submitBtn) {
        submitBtn.addEventListener('click', submitConfiguration);
    }
});