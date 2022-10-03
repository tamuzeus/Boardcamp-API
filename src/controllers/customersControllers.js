import connection from "../database/db.js";
import joi from 'joi';

const postCustomersSchema = joi.object({
    name: joi.string().trim().min(3).empty(' ').required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().length(11).required(),
    birthday: joi.date().less("now").required()
});

async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {

        const validation = postCustomersSchema.validate(req.body, { abortEarly: false })
        if(validation.error){
            const err = validation.error.details.map(detail => detail.message);
            return  res.status(400).send(err);
        }

        const getCpf = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
        if (getCpf.rows.length !== 0) {
            return res.sendStatus(409)
        }
        await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);', [name, phone, cpf, birthday])

        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function getCostumers(req, res) {
    const { cpf } = req.query

    try {
        const query = await connection.query("SELECT * FROM customers;")

        if (cpf) {
            const query = await connection.query(` SELECT * FROM customers WHERE customers.cpf LIKE $1;`, [cpf + '%']);
            return res.send(query.rows)
        }

        if (!query) {
            return res.sendStatus(404)
        }

        res.send(query.rows)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function getIdCostumers(req, res) {
    const { id } = req.params

    try {
        const query = await connection.query("SELECT * FROM customers WHERE id =$1;", [id])

        if (query.rowCount === 0) {
            return res.sendStatus(404);
        }

        res.send(query.rows)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function putCostumers(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        const validation = postCustomersSchema.validate(req.body, { abortEarly: false })

        if(validation.error){
            const err = validation.error.details.map(detail => detail.message);

            return  res.status(400).send(err);
        }

        const getCpf = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
        if (getCpf.rows.length !== 0) {
            return res.sendStatus(409)
        }

        await connection.query("UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;", [name, phone, cpf, birthday, id]);
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { getCostumers, getIdCostumers, postCustomers, putCostumers }