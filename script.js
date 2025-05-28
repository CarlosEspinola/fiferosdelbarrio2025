document.getElementById('match-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const player1 = document.getElementById('player1').value.trim();
    const player2 = document.getElementById('player2').value.trim();
    const score1 = parseInt(document.getElementById('score1').value);
    const score2 = parseInt(document.getElementById('score2').value);

    const match = {
        id: Date.now(),
        player1, player2, score1, score2,
        date: new Date().toLocaleDateString()
    };

    let matches = JSON.parse(localStorage.getItem('matches')) || [];
    matches.unshift(match);
    localStorage.setItem('matches', JSON.stringify(matches));

    document.getElementById('match-form').reset();
    renderMatches();
    renderStats();
});

function deleteMatch(id) {
    let matches = JSON.parse(localStorage.getItem('matches')) || [];
    matches = matches.filter(match => match.id !== id);
    localStorage.setItem('matches', JSON.stringify(matches));
    renderMatches();
    renderStats();
}

function renderMatches() {
    const matches = JSON.parse(localStorage.getItem('matches')) || [];
    const list = document.getElementById('match-history');
    list.innerHTML = '';

    matches.forEach(match => {
        const li = document.createElement('li');
        li.innerHTML = `[${match.date}] ${match.player1} ${match.score1} - ${match.score2} ${match.player2}
            <button onclick="deleteMatch(${match.id})" class="delete-button">🗑️</button>`;
        if (match.score1 > match.score2) li.className = 'win';
        else if (match.score1 < match.score2) li.className = 'loss';
        else li.className = 'draw';
        list.appendChild(li);
    });
}

function renderStats() {
    const matches = JSON.parse(localStorage.getItem('matches')) || [];
    const stats = {};
    matches.forEach(({ player1, player2, score1, score2 }) => {
        if (!stats[player1]) stats[player1] = { played: 0, won: 0, lost: 0, draw: 0 };
        if (!stats[player2]) stats[player2] = { played: 0, won: 0, lost: 0, draw: 0 };

        stats[player1].played++;
        stats[player2].played++;

        if (score1 > score2) { stats[player1].won++; stats[player2].lost++; }
        else if (score1 < score2) { stats[player2].won++; stats[player1].lost++; }
        else { stats[player1].draw++; stats[player2].draw++; }
    });

    const statsDiv = document.getElementById('player-stats');
    statsDiv.innerHTML = '';
    for (const player in stats) {
        const s = stats[player];
        statsDiv.innerHTML += `<p><strong>${player}</strong>: ${s.played} partidos | 🟢 ${s.won} | 🟡 ${s.draw} | 🔴 ${s.lost}</p>`;
    }
}

renderMatches();
renderStats();