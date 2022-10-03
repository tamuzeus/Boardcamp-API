import connection from "../database/db.js"
import joi from "joi"

const postGamesSchema = joi.object({
    name: joi.string().min(1).empty(' ').trim().required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().integer().min(1).required(),
    categoryId: joi.number().integer().required(),
    pricePerDay: joi.number().integer().min(1).required()
})


async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body

    try {
        
        const validation = postGamesSchema.validate(req.body, { abortEarly: false })
        if(validation.error){
            const err = validation.error.details.map(detail => detail.message);
            return  res.status(400).send(err);
        }


        const getId = await connection.query('SELECT * FROM categories WHERE id = $1', [categoryId])

        if (getId.rows.length === 0) {
            return res.sendStatus(400)
        }


        const getName = await connection.query('SELECT * FROM games WHERE name = $1', [name])
        if (getName.rows.length !== 0) {
            return res.sendStatus(409)
        }

        await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);', [name, image, stockTotal, categoryId, pricePerDay])
        res.sendStatus(201)
    } catch (error) {

        console.log(error)
        res.sendStatus(500)
    }
}

async function getGames(req, res) {
    const { name } = req.query

    try {

        if(name){
            const games = await connection.query(`
            SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" =categories.id WHERE LOWER(games.name) LIKE LOWER($1);`, [name + '%'])
            return res.send(games.rows)
        }

        const games = await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON "categoryId" = categories.id;')
        res.send(games.rows)

    } catch (error) {
        res.status(500).send(error);
    }
}

export { postGames, getGames }