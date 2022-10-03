import dayjs from "dayjs"
import connection from "../database/db.js"
import joi from "joi"
import { Collection } from "mongo";

const rentalsSchema = joi.object({
    customerId: joi.number().integer().empty(' ').required(),
    gameId: joi.number().integer().empty(' ').required(),
    daysRented: joi.number().integer().min(1).empty(' ').required()
});

async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body

    if (daysRented <= 0) {
        return res.sendStatus(400)
    };

    try {

        const validation = rentalsSchema.validate(req.body, { abortEarly: false })
        if (validation.error) {
            const err = validation.error.details.map(detail => detail.message);
            return res.status(400).send(err);
        }

        const getCostumer = await connection.query(` SELECT * FROM customers WHERE id=$1;`, [customerId])
        if (!getCostumer.rows[0]) {
            return res.sendStatus(400)
        }

        const getGame = await connection.query(`SELECT * FROM games WHERE id=$1;`, [gameId])
        if (!getGame.rows[0]) {
            return res.sendStatus(400)
        }

        const catchRental = await connection.query(`SELECT * FROM rentals WHERE rentals."gameId"=$1 AND rentals."returnDate" IS NULL;`, [gameId])

        const confirmRental = getGame.rows[0].stockTotal - catchRental.rows.length
        if (confirmRental <= 0) {
            return res.sendStatus(400)
        }

        const originalPrice = daysRented * getGame.rows[0].pricePerDay

        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`, [customerId, gameId, daysRented, dayjs().format('YYYY-MM-DD'), null, originalPrice, null])

        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function getRentals(req, res) {
    const { customerId, gameId } = req.query
    let rentals
    try {

        if (customerId && gameId) {
            rentals = (await connection.query(`SELECT rentals.*, 
            json_build_object(
                'id', customers.id,
                'name', customers.name
            ) AS customer, 
            json_build_object(
                'id', games.id,
                'name', games.name,
                'categoryId', games."categoryId",
                'categoryName', categories.name
            ) AS game
            FROM rentals 
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
            JOIN categories on games."categoryId" = categories.id
            WHERE "customerId" = $1 AND "gameId" = $2
            ;`, [customerId, gameId])).rows
        }

        if (customerId) {
            rentals = (await connection.query(`SELECT rentals.*, 
            json_build_object(
                'id', customers.id,
                'name', customers.name
            ) AS customer, 
            json_build_object(
                'id', games.id,
                'name', games.name,
                'categoryId', games."categoryId",
                'categoryName', categories.name
            ) AS game
            FROM rentals 
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
            JOIN categories on games."categoryId" = categories.id
            WHERE "customerId" = $1
            ;`, [customerId])).rows
        }

        if (gameId) {
            rentals = (await connection.query(`SELECT rentals.*, 
            json_build_object(
                'id', customers.id,
                'name', customers.name
            ) AS customer, 
            json_build_object(
                'id', games.id,
                'name', games.name,
                'categoryId', games."categoryId",
                'categoryName', categories.name
            ) AS game
            FROM rentals 
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
            JOIN categories on games."categoryId" = categories.id
            WHERE "gameId" = $1
            ;`, [gameId])).rows
        }

        if (!gameId && !customerId) {
            rentals = (await connection.query(`SELECT rentals.*, 
        json_build_object(
            'id', customers.id,
            'name', customers.name
        ) AS customer, 
        json_build_object(
            'id', games.id,
            'name', games.name,
            'categoryId', games."categoryId",
            'categoryName', categories.name
        ) AS game
        FROM rentals 
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id
        JOIN categories on games."categoryId" = categories.id
        ;`)).rows
        }

        rentals.forEach((obj) => {
            obj.rentDate = obj.rentDate.toISOString().split('T')[0];
        })

        res.send(rentals)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

}

async function postRentalsReturn(req, res) {

    try {

    } catch (error) {

    }

}

async function deleteRentals(req, res) {
    const { id } = req.params

    try {
        const getRental = await connection.query(`SELECT * FROM rentals WHERE id=$1;`, [id])

        if (!getRental.rows) {
            return res.sendStatus(404)
        }

        if (!getRental.rows[0].returnDate) {
            return res.sendStatus(400)
        }

        await connection.query(`DELETE FROM rentals WHERE id=$1;`, [id])

        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

export { postRentals, deleteRentals, getRentals, postRentalsReturn }