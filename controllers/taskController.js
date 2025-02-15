const knex = require('../db/knex');
const { createTaskSchema, updateTaskSchema, validate } = require('../validations/taskValidation');

async function adjustPositions(trx, status, fromPosition, increment) {
    await trx('tasks')
        .where('status', status)
        .andWhere('position', '>=', fromPosition)
        .increment('position', increment);
}

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await knex('tasks').orderBy(['status', 'position']);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

exports.getTask = async (req, res) => {
    try {
        const task = await trx('tasks').where({ id: req.params.id }).first();
        if (!task) return res.status(404).json({ error: 'Task not found' });

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

exports.createTask = async (req, res) => {
    const { error, value } = validate(createTaskSchema, req.body);
    if (error) return res.status(422).json({ error });

    try {
        await knex.transaction(async trx => {
            if (value.position !== undefined) {
                await adjustPositions(trx, value.status, value.position, 1);
            }
            const [id] = await trx('tasks').insert(value);
            res.status(201).json({ id, ...value });
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

exports.updateTask = async (req, res) => {

    const { error, value } = validate(updateTaskSchema, req.body);
    if (error) return res.status(422).json({ error });

    try {
        await knex.transaction(async trx => {
            const task = await trx('tasks').where({ id: req.params.id }).first();
            if (!task) return res.status(404).json({ error: 'Task not found' });

            const statusChanged = value.status && value.status !== task.status;
            const positionChanged = statusChanged || value.position !== undefined;

            if (statusChanged || positionChanged) {
                if (statusChanged) {
                    await adjustPositions(trx, task.status, task.position + 1, -1);
                }
                if (positionChanged) {
                    await adjustPositions(trx, value.status, value.position | 0, 1);
                }
            }

            value.updated_at = knex.fn.now();

            const updated = await trx('tasks').where({ id: req.params.id }).update(value);
            if (!updated) return res.status(404);

            res.status(200).end();
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await knex.transaction(async trx => {
            const task = await trx('tasks').where({ id: req.params.id }).first();
            if (!task) return res.status(404).json({ error: 'Task not found' });

            await trx('tasks').where({ id: req.params.id }).del();

            await adjustPositions(trx, task.status, task.position + 1, -1);

            res.status(204).end();
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
};
