import { Router } from "express";

const usersRouter = Router();


const users = [
	{
		id: 0,
		name: 'Arne'
	},
	{
		id: 1,
		name: 'Minho'
	},
	{
		id: 2,
		name: 'Charlie'
	}
];
let nextId = users.length;

/**
 * @openapi
 * /api/users:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Returns all users
 */
usersRouter.get('/', (_req, res) => {
	res.send({ data: { users } });
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     description: Create a new user
 *     responses:
 *       200:
 *         description: Returns the users that was created
 * 
 */
usersRouter.post('/', (req, res) => {
	const newUser = req.body;
	newUser.id = nextId++;

	users.push(newUser);

	res.send({ data: newUser });
});


export default usersRouter;
