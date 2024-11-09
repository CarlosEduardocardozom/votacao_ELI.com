const proposals = [
    { id: 1, image: '../Downloads/papagaio.jpg', title: 'Proposta 1' },
    { id: 2, image: '../Downloads/onc.jpeg', title: 'Proposta 2' },
    { id: 3, image: '../Downloads/papagaio.jpg', title: 'Proposta 3' }
];

// Inicializa os votos
function initializeVotes() {
    const userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};
    proposals.forEach((proposal) => {
        if (!userVotes[proposal.id]) {
            userVotes[proposal.id] = { voted: false, votes: 0 };
        }
    });
    localStorage.setItem('userVotes', JSON.stringify(userVotes));
}

// Alternar voto
function toggleVote(proposalId, voteButton, voteCount) {
    const userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};
    const currentVote = Object.values(userVotes).find((vote) => vote.voted);

    if (currentVote && !userVotes[proposalId]?.voted) {
        showAlert('⚠️ Você já votou em uma proposta! Retire seu voto atual para escolher outra.');
        return;
    }

    // Verifica se o usuário já votou nesta proposta
    if (userVotes[proposalId]?.voted) {
        userVotes[proposalId].votes -= 1;
        userVotes[proposalId].voted = false;
        voteButton.classList.remove('voted');
    } else {
        if (currentVote) {
            const previousProposalId = proposals.find(p => userVotes[p.id]?.voted)?.id;
            userVotes[previousProposalId].votes -= 1;
            userVotes[previousProposalId].voted = false;

            const previousButton = document.querySelector(`button[data-id="${previousProposalId}"]`);
            previousButton.classList.remove('voted');
            const previousCount = previousButton.nextElementSibling;
            previousCount.textContent = userVotes[previousProposalId].votes;
        }

        userVotes[proposalId].votes += 1;
        userVotes[proposalId].voted = true;
        voteButton.classList.add('voted');
    }

    localStorage.setItem('userVotes', JSON.stringify(userVotes));
    voteCount.textContent = userVotes[proposalId].votes;

    // Animação do ícone de voto
    voteButton.classList.add('vote-animation');
    setTimeout(() => voteButton.classList.remove('vote-animation'), 600);
}
// Renderiza as propostas
function renderProposals() {
    const proposalGrid = document.getElementById('proposalGrid');
    proposalGrid.innerHTML = '';

    const userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};

    proposals.forEach((proposal) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = proposal.image;
        img.alt = proposal.title;

        const title = document.createElement('h5');
        title.textContent = proposal.title;

        const voteButton = document.createElement('button');
        voteButton.classList.add('btn', 'btn-light', 'vote-button');
        voteButton.innerHTML = getVoteSVG();
        voteButton.setAttribute('data-id', proposal.id);

        const voteCount = document.createElement('span');
        voteCount.classList.add('vote-count');
        voteCount.textContent = userVotes[proposal.id]?.votes || 0;

        if (userVotes[proposal.id]?.voted) {
            voteButton.classList.add('voted');
        }

        voteButton.onclick = () => toggleVote(proposal.id, voteButton, voteCount);

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(voteButton);
        card.appendChild(voteCount);
        proposalGrid.appendChild(card);
    });
}

// Ícone SVG de votação (dedo indicador)
function getVoteSVG() {
    return `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="vote-icon">
            <path d="M12 2c1.1 0 2 .9 2 2v10h4.5c1.1 0 2 .9 2 2v3.5c0 1.1-.9 2-2 2h-13c-1.1 0-2-.9-2-2V13c0-1.1.9-2 2-2H10V4c0-1.1.9-2 2-2z" fill="currentColor"/>
        </svg>
    `;
}

// Mostrar alerta estilizado
function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box');
    alertBox.innerHTML = message;
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.classList.add('fade-out');
        setTimeout(() => alertBox.remove(), 500);
    }, 2000);
}

// Estilos adicionais
const style = document.createElement('style');
style.textContent = `
    .alert-box {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ff4444;
        color: #fff;
        padding: 10px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        font-size: 1.1em;
        z-index: 1000;
        transition: opacity 0.5s;
    }
    .fade-out {
        opacity: 0;
    }
    .vote-animation {
        animation: vote-bounce 0.6s;
    }
    @keyframes vote-bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    .voted {
        color: #28a745;
    }
`;
document.head.appendChild(style);

// Inicializar votos e contagem regressiva
document.addEventListener('DOMContentLoaded', () => {
    initializeVotes();
    renderProposals();
});
