import connection from "../database/db.js";

async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
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

    try {
        const query = await connection.query("SELECT * FROM customers;")
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
        await connection.query("UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;", [name, phone, cpf, birthday, id]);

        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { getCostumers, getIdCostumers, postCustomers, putCostumers }