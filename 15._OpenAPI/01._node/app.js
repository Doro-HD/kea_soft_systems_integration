import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import usersRouter from './routers/usersRouter.js';

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter)

const swaggerDefinition = {
	definition: {
		openapi: '3.1.0',
		info: {
			title: 'Users API',
			version: '0.0.1'
		}
	},
	apis: ['./routers/*Router.js']
};

const swaggerOptions = {
	swaggerDefinition,
	apis: ['./routers/*Router.js']
};
const swaggerSpecification = swaggerJSDoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));


const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
