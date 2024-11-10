const END_DATE = new Date('2024-11-15');
const proposals = [
    { id: 1, image: '../Downloads/papagaio.jpg', title: 'Proposta 1' },
    { id: 2, image: '../Downloads/onc.jpeg', title: 'Proposta 2' },
    { id: 3, image: '../Downloads/papagaio.jpg', title: 'Proposta 3' },
    { id: 4, image: '../Downloads/papagaio.jpg', title: 'Proposta 4' },
    { id: 5, image: '../Downloads/papagaio.jpg', title: 'Proposta 5' },
    { id: 6, image: '../Downloads/dourado.jpg', title: 'Proposta 6' },
    { id: 7, image: '../Downloads/papagaio.jpg', title: 'Proposta 7' },
    { id: 8, image: '../Downloads/papagaio.jpg', title: 'Proposta 8' }
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

    if (currentVote && !userVotes[proposalId]?.voted) {
        showAlert('⚠️ Você já votou em uma proposta! Retire seu voto atual para escolher outra.');
        return;
    }

    if (userVotes[proposalId]?.voted) {
        userVotes[proposalId].votes -= 1;
        userVotes[proposalId].voted = false;
        likeButton.classList.remove('liked');
        likeButton.querySelector('.heart-icon').style.fill = 'currentColor';
    } else {
        if (currentVote) {
            const previousProposalId = proposals.find(p => userVotes[p.id]?.voted)?.id;
            userVotes[previousProposalId].votes -= 1;
            userVotes[previousProposalId].voted = false;

            const previousButton = document.querySelector(`button[data-id="${previousProposalId}"]`);
            previousButton.classList.remove('liked');
            previousButton.querySelector('.heart-icon').style.fill = 'currentColor';
            const previousCount = previousButton.nextElementSibling;
            previousCount.textContent = userVotes[previousProposalId].votes;
        }

        userVotes[proposalId].votes += 1;
        userVotes[proposalId].voted = true;
        likeButton.classList.add('liked');
        likeButton.querySelector('.heart-icon').style.fill = '#ff0000';
    }

    localStorage.setItem('userVotes', JSON.stringify(userVotes));
    voteCount.textContent = userVotes[proposalId].votes;

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

// Mostrar alerta
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

// Verificar status de login
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show(); // Exibe o modal usando o Bootstrap 5.3
    } else {
        renderProposals(); // Carrega as propostas se o usuário estiver logado
    }
}

// Evento de login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        localStorage.setItem('isLoggedIn', 'true');
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide(); // Fecha o modal após o login
        renderProposals(); // Carrega as propostas após o login
    } else {
        alert('Por favor, insira um email e senha válidos.');
    }
});

// Inicializar contagem regressiva, votos e renderizar propostas
document.addEventListener('DOMContentLoaded', () => {
    initializeVotes();
    updateCountdown();
    setInterval(updateCountdown, 1000 * 60 * 60);
    checkLoginStatus(); // Verifica se o usuário está logado
});
