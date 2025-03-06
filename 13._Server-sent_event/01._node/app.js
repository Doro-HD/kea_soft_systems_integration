import express from 'express';

const app = express();

app.use(express.static('public'));

app.get('/syncrhonizetime', (req, res) => {
	res.writeHead(200, {
		'Connection': 'keep-alive',
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache'
	});

	setInterval(() => sendTimeToClient(res), 1000);
});

function sendTimeToClient(res) {
	const time = new Date().toISOString();

	// key must be data
	res.write('data: ' + time + '\n\n');
}

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log('Listening on port', PORT));
