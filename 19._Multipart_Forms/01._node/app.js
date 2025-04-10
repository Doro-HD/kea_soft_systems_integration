import express from 'express';
import multer from 'multer';

const app = express();
app.use(express.urlencoded({ extended: true }));

//const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(undefined, './uploads');
	},
	filename: (_req, file, cb) => {
		const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		const uniqueFileName = `${uniquePrefix}__${file.originalname}`;

		cb(undefined, uniqueFileName);
	}
});

const fileFilter = (_req, file, cb) => {
	const validTypes = ['image/png', 'image/svg', 'image/jpeg'];

	if (!validTypes.includes(file.mimetype)) {
		cb(new Error('File type not allowed: ' + file.mimetype), false);
	} else {
		cb(null, true);
	}
};

const upload = multer({
	storage,
	limits: {
		fileSize: 20 * 1024 * 1024
	},
	fileFilter
});

app.post('/form', (req, res) => {
	delete req.body.password;

	res.send(req.body);
});

app.post('/fileform', upload.single('file'), (req, res) => {
	console.log(req.body);

	res.send({});
});

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
