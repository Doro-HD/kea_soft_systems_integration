import express from 'express';

// cors can be used both globally throughout express, a single route or through a router
import cors from 'cors';

const app = express();
app.use(cors({
	origin: '*',
	methods: ['GET'],
}));
//use cors to allow everything app.use(cors());
/* manually apply cors through headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});
*/

app.get('/timestamp', /* cors(), */(_req, res) => {
	res.send({ data: new Date() });
});

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
