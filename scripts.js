const END_DATE = new Date('2024-11-15');
const proposals = [
    { id: 1, image: 'images/Ecossistema de Inovacao de Jardim e Guia Lopes da Laguna - xayanne nunes.jpeg', title: 'Proposta 1' },
    { id: 2, image: 'images/Ecoa_Miranda.jpg', title: 'Proposta 2' },
    { id: 3, image: 'images/Ecoa Veredas do Miranda .jpg', title: 'Proposta 3' },
    { id: 4, image: 'images/Ecoserra Lopes.jpg', title: 'Proposta 4' },
    { id: 5, image: 'images/inova jardim - MARIA EDUARDA ROJAS BENITES (1).jpg', title: 'Proposta 5' },
    { id: 6, image: 'images/Inova Laguna - Ecossistema de Inovação de Jardim e Guia Lopes da Laguna - MS.jpg', title: 'Proposta 6' },
    { id: 7, image: 'images/Raizes_de_Lopes.jpg', title: 'Proposta 7' },
    { id: 8, image: 'images/Rota Verde - ISADORA FERREIRA GRUBERT.jpg', title: 'Proposta 8' },
    { id: 9, image: 'images/caninde inova-06 - Ana Cecília Braga.png', title: 'Proposta 9' },
    { id: 10, image: 'images/ECO - PALOMA LOHANE DE MELO BATISTA.png', title: 'Proposta 10' },
    { id: 11, image: 'images/Eco Laguna - Bruno Romero.png', title: 'Proposta 11' },
    { id: 12, image: 'images/Ecossistema Inovação Jardim e Guia (1) - ALEX FABIO OLIVEIRA.png', title: 'Proposta 12' },
    { id: 13, image: 'images/ELI-LOGO - Tiago Tavares.png', title: 'Proposta 13' },
    { id: 14, image: 'images/Elis - ANA BEATRIZ FERNADES MENDES.png', title: 'Proposta 14' },
    { id: 15, image: 'images/garden valley - THALITA BELINE VAREIRO.png', title: 'Proposta 15' },
    { id: 16, image: 'images/INNOVASUL (9) - BÁRBARA DA COSTA ALEM NOGUEIRA.png', title: 'Proposta 16' },
    { id: 17, image: 'images/INOVASUL LOGO - Jhamis Wanderson.png', title: 'Proposta 17' },
    { id: 18, image: 'images/LOCALMS - Bruno Sentorion Bito.png', title: 'Proposta 18' },
    { id: 19, image: 'images/LOGO - ECOS DO PANTANAL - Jhamis Rodrigues.png', title: 'Proposta 19' },
    { id: 20, image: 'images/miranda - DORA ESTELA LEITE.png', title: 'Proposta 20' },
    { id: 21, image: 'images/MIRANDA TECH.png', title: 'Proposta 21' },
    { id: 22, image: 'images/Ponte_de_Inovações.png', title: 'Proposta 22' },
    { id: 23, image: 'images/PRATASYS - ALAN VICTOR BARROS GODOY.png', title: 'Proposta 23' },
    { id: 24, image: 'images/ROTA INOVA - Fernanda Ajala.png', title: 'Proposta 24' },
    { id: 25, image: 'images/TecnoLaguna - KEISE PÂMELA SANTOS DE MORAIS.png', title: 'Proposta 25' },
    { id: 26, image: 'images/Belezas_do_sul_Sarah_Almeida.png', title: 'Proposta 26' },

];

// Inicializar votos
function initializeVotes() {
    const userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};
    proposals.forEach(proposal => {
        if (!userVotes[proposal.id]) {
            userVotes[proposal.id] = { voted: false, votes: 0 };
        }
    });
    localStorage.setItem('userVotes', JSON.stringify(userVotes));
}

// Alternar voto
function toggleLike(proposalId, likeButton, voteCount) {
    const userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};

    if (userVotes[proposalId]?.voted) {
        userVotes[proposalId].votes -= 1;
        userVotes[proposalId].voted = false;
        likeButton.classList.remove('liked', 'animate');
        likeButton.innerHTML = '<i class="fa-regular fa-heart"></i>';
    } else {
        userVotes[proposalId].votes += 1;
        userVotes[proposalId].voted = true;
        likeButton.classList.add('liked', 'animate');
        likeButton.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }

    localStorage.setItem('userVotes', JSON.stringify(userVotes));
    voteCount.textContent = userVotes[proposalId].votes;
}

// Atualizar contagem regressiva
function updateCountdown() {
    const now = new Date();
    const timeDiff = END_DATE - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const countdownElement = document.getElementById('countdown');

    countdownElement.textContent = daysLeft > 0 ? `Faltam ${daysLeft} dias!` : 'A votação começou!';
}

// Renderizar propostas
function renderProposals() {
    const proposalGrid = document.getElementById('proposalGrid');
    proposalGrid.innerHTML = '';

    const userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};

    proposals.forEach(proposal => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = proposal.image;
        img.alt = proposal.title;
        img.classList.add('proposal-image');

        const title = document.createElement('h5');
        title.textContent = proposal.title;

        const likeButton = document.createElement('button');
        likeButton.classList.add('btn', 'btn-light', 'like-button');
        likeButton.innerHTML = userVotes[proposal.id]?.voted
            ? '<i class="fa-solid fa-heart"></i>'
            : '<i class="fa-regular fa-heart"></i>';
        likeButton.onclick = () => toggleLike(proposal.id, likeButton, voteCount);

        const voteCount = document.createElement('span');
        voteCount.textContent = userVotes[proposal.id]?.votes || 0;

        card.append(img, title, likeButton, voteCount);
        proposalGrid.appendChild(card);
    });
}

// Inicializar tudo
document.addEventListener('DOMContentLoaded', () => {
    initializeVotes();
    updateCountdown();
    setInterval(updateCountdown, 1000 * 60 * 60);
    renderProposals();
});
