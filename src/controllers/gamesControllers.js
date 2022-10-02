import connection from "../database/db.js";

async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body

    try {
        const getId = await connection.query('SELECT * FROM categories WHERE id = $1', [categoryId]);

        if (!name || stockTotal <= 0 || getId.rows.length === 0 || pricePerDay <= 0) {
            return res.sendStatus(400)
        }

        const getName = await connection.query('SELECT * FROM games WHERE name = $1', [name]);
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

    try {
        const games = await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON "categoryId" = categories.id;') //games.* define que apenas todos de games virá e os categorys irão vir de acordo com o pedido "on"
        res.send(games.rows);

        //falta regras de negocio
    } catch (error) {
        res.status(500).send(error);
    }
}

export { postGames, getGames }