import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/github-webhook-json', (req, res) => {
    console.log(req.body);

    res.sendStatus(204);
});

app.post('/github-webhook-form', (req, res) => {
    console.log(req.body);

    res.sendStatus(204);
});

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => console.log('Listening on port', PORT));