const END_DATE = new Date('2024-11-15');
const proposals = [
    { id: 1, image: '../papagaio.jpg', title: 'Proposta 1' },
    { id: 2, image: '../onc.jpeg', title: 'Proposta 2' },
    { id: 3, image: '../papagaio.jpg', title: 'Proposta 3' },
    { id: 4, image: '../papagaio.jpg', title: 'Proposta 4' },
    { id: 5, image: '../papagaio.jpg', title: 'Proposta 5' },
    { id: 6, image: '../dourado.jpg', title: 'Proposta 6' },
    { id: 7, image: '../papagaio.jpg', title: 'Proposta 7' },
    { id: 8, image: '../papagaio.jpg', title: 'Proposta 8' }
];

// Inicializa os votos a partir do localStorage
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
function toggleLike(proposalId, likeButton, voteCount) {
    const userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};
    const currentVote = Object.values(userVotes).find((vote) => vote.voted);

    // Verifica se o usuário já votou em outra proposta
    if (currentVote && !userVotes[proposalId]?.voted) {
        showAlert('⚠️ Você já votou em uma proposta! Retire seu voto atual para escolher outra.');
        return;
    }

    // Se o usuário já votou nesta proposta, remover o voto
    if (userVotes[proposalId]?.voted) {
        userVotes[proposalId].votes -= 1;
        userVotes[proposalId].voted = false;
        likeButton.classList.remove('liked');
        likeButton.querySelector('.heart-icon').style.fill = 'currentColor';
    } else {
        // Remover voto da proposta anterior, se houver
        if (currentVote) {
            const previousProposalId = proposals.find(p => userVotes[p.id]?.voted)?.id;
            userVotes[previousProposalId].votes -= 1;
            userVotes[previousProposalId].voted = false;

            // Atualizar o botão da proposta anterior
            const previousButton = document.querySelector(`button[data-id="${previousProposalId}"]`);
            previousButton.classList.remove('liked');
            previousButton.querySelector('.heart-icon').style.fill = 'currentColor';
            const previousCount = previousButton.nextElementSibling;
            previousCount.textContent = userVotes[previousProposalId].votes;
        }

        // Adicionar o voto na nova proposta
        userVotes[proposalId].votes += 1;
        userVotes[proposalId].voted = true;
        likeButton.classList.add('liked');
        likeButton.querySelector('.heart-icon').style.fill = '#ff0000';
    }

    // Atualizar o localStorage e o contador de votos
    localStorage.setItem('userVotes', JSON.stringify(userVotes));
    voteCount.textContent = userVotes[proposalId].votes;

    // Animação do coração
    likeButton.classList.add('heart-animation');
    setTimeout(() => likeButton.classList.remove('heart-animation'), 600);
}

// Atualiza a contagem regressiva
function updateCountdown() {
    const now = new Date();
    const timeDiff = END_DATE - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const countdownElement = document.getElementById('countdown');

    if (daysLeft > 0) {
        countdownElement.innerHTML = `<h3><strong>FALTAM ${daysLeft} DIAS !!</strong></h3>`;
        countdownElement.style.color = '#ff4444';
    } else {
        countdownElement.innerHTML = '<strong>A votação começou! Faça sua escolha agora.</strong>';
        countdownElement.style.color = '#28a745';
    }
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

        const likeButton = document.createElement('button');
        likeButton.classList.add('btn', 'btn-light', 'like-button');
        likeButton.innerHTML = getHeartSVG();
        likeButton.setAttribute('data-id', proposal.id);

        const voteCount = document.createElement('span');
        voteCount.classList.add('vote-count');
        voteCount.textContent = userVotes[proposal.id]?.votes || 0;

        if (userVotes[proposal.id]?.voted) {
            likeButton.classList.add('liked');
            likeButton.querySelector('.heart-icon').style.fill = '#ff0000';
        }

        likeButton.onclick = () => toggleLike(proposal.id, likeButton, voteCount);

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(likeButton);
        card.appendChild(voteCount);
        proposalGrid.appendChild(card);
    });
}

// Ícone SVG do coração
function getHeartSVG() {
    return `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="heart-icon">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
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

// Estilos adicionais para alerta e animação
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
    .heart-animation {
        animation: heart-pulse 0.6s;
    }
    @keyframes heart-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }
`;
document.head.appendChild(style);

// Inicializar contagem regressiva, votos e renderizar propostas
document.addEventListener('DOMContentLoaded', () => {
    initializeVotes();
    updateCountdown();
    setInterval(updateCountdown, 1000 * 60 * 60);
    renderProposals();
});
