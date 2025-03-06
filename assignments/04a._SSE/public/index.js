const gameNameHeader = document.getElementById('game-header');
const gameScoreParagraph = document.getElementById('game-score');
const gameLengthParagraph = document.getElementById('game-length');

const eventSource = new EventSource('/random-game');

eventSource.addEventListener('message', event => {
	const data = JSON.parse(event.data);

	gameNameHeader.textContent = data.name;
	gameScoreParagraph.textContent = 'Score: ' + data.metacritic;
	gameLengthParagraph.textContent = 'Playtime: ' + data.playtime;
});

