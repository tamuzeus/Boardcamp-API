import connection from "../database/db.js";
import joi from "joi";

const categorySchema = joi.object({
    name: joi.string().empty(' ').trim()});

async function postCategories(req, res) {
    const { name } = req.body

    try {

        const validation = categorySchema.validate(req.body, { abortEarly: false })
        if(validation.error){
            const err = validation.error.details.map(detail => detail.message);
            return  res.status(400).send(err);
        }

        const getName = await connection.query('SELECT * FROM categories WHERE name = $1', [name]); //está pegando o mesmo name que o posto no body
        if (getName.rows.length !== 0) { //entrando no rows e conferindo se a quantidade do length é diferente de 0, isso indica se existe um com o mesmo name
            return res.sendStatus(409)
        }

        await connection.query("INSERT INTO categories (name) VALUES ($1);", [name])
        if (!name) {
            return res.sendStatus(400)
        }
        
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function getCategories(req, res) {

    try {
        const query = await connection.query('SELECT * FROM categories;')
        res.status(201).send(query.rows)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { getCategories, postCategories };