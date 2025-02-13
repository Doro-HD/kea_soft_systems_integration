import express from 'express';

const app = express();

app.get('/express-data', (_req, res) => {
	res.send({ data: 'This is the data from Express' });
});

app.get('/request-fast-api-data', async (_req, res) => {
	const fastApiRes = await fetch('http://127.0.0.1:8000/fast-api-data', {
		headers: {
			'Content-Type': 'Application/json'
		}
	});
	const fastAPIData = await fastApiRes.json();

	res.send({ fastAPI: fastAPIData });
});

app.get('/names/:name', (req, res) => {

	res.send({ name: req.params.name });
});

app.get('/play-next', async (_req, res) => {
	const gameRes = await fetch('https://api.rawg.io/api/games?key=86c8deb7760f4db7868bae5943b2b769');
	const gameData = await gameRes.json();

	res.send(gameData);
})


const PORT = 8080;
app.listen(PORT, () => {
	console.log('Listening on port', PORT);
});
