// Modal System for Tribe Interactions
const tribeData = {
    1: {
        name: 'Builders of Worlds',
        poem: '"Sometimes the player dreamed it created"',
        description: 'Architects of possibility, transforming vision into reality.',
        actions: [
            'Design sustainable infrastructure',
            'Mentor emerging creators',
            'Prototype transformative technologies'
        ]
    },
    2: {
        name: 'Keepers of Memory',
        poem: '"We are the ones who remember"',
        description: 'Guardians of collective wisdom and ancestral knowledge.',
        actions: [
            'Preserve oral histories',
            'Create knowledge networks',
            'Facilitate intergenerational dialogue'
        ]
    },
    3: {
        name: 'Dreamers of Possibility',
        poem: '"The universe said you are the daylight"',
        description: 'Visionaries who explore the boundaries of imagination.',
        actions: [
            'Explore consciousness frontiers',
            'Create immersive narrative experiences',
            'Challenge existing paradigms'
        ]
    }
};

function openModal(tribeId) {
    const tribe = tribeData[tribeId];
    const modal = document.getElementById('tribeModal');
    
    modal.innerHTML = `
        <div class="modal-event-horizon">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${tribe.name}</h2>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <blockquote>"${tribe.poem}"</blockquote>
                    <p>${tribe.description}</p>
                    <h3>Community Actions:</h3>
                    <ul class="action-steps">
                        ${tribe.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('tribeModal');
    modal.style.display = 'none';
}
