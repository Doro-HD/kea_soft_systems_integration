import express from 'express';

const app = express();

app.use(express.static('public'));


app.get('/randomnumbers', (_req, res) => {
	const randomNumbers = [0, 0, 0].map(_ => getRandomInt(0, 100));

	res.send({ data: randomNumbers });
});

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const PORT = 8080;
app.listen(PORT, () => console.log('listening on port ', PORT));

