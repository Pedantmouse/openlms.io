const utils = require('../../utils');
const Sequelize = require('sequelize');
const database = require('../../../config/databases');

const db = database.lms;

//////////////////////////////////////////////////////////////
// Many Below
// ===========================================================

exports.getMany = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const pageSize = parseInt(req.query.page) || 15;
        const sortColumn = req.query["sort-column"] || 'name';
        const sortDirection = req.query["sort-direction"] || 'asc';

        if (sortColumn !== 'name' && sortColumn !== 'is_deleted') {
            if (!utils.StringValidation.isAlphaNumericWithUnderscore(sortColumn)) {
                return res.status(400).json({
                    "msg": "Bad Request: 'sortColumn' isn't a properly formated permission (Alphanumeric with underscore). Use link to find valid 'sortColumns'",
                    "link": "/api/v1/admin/permissions"
                });
            }

            const permissionsColumnNames = await db.query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'permissions'", { type: Sequelize.QueryTypes.SELECT });
            let doesPermissionExist = false;

            // delete permissionsColumnNames.user_id;
            for (var i = 0; i < permissionsColumnNames.length; i++) {
                let col = permissionsColumnNames[i].COLUMN_NAME;

                if (col === "id" || col === "user_id" || col === "is_deleted") {
                    continue;
                }

                if (col === sortColumn) {
                    doesPermissionExist = true;
                }
            }

            if (!doesPermissionExist) {
                return res.status(400).json({
                    "msg": "Bad Request: 'sortColumn' isn't a valid permissions. Use link to find valid 'sortColumns'",
                    "humanMsg": "You are sorting by a permissions that doesn't exist.",
                    "link": "/api/v1/admin/permissions"
                });
            }
        }


        const rows = (await db.query(`SELECT * FROM roles ORDER BY ${sortColumn} ${sortDirection} LIMIT ${page * pageSize}, ${pageSize}`, { raw: true, type: Sequelize.QueryTypes.SELECT }));
        const count = (await db.query(`SELECT count(*) as count FROM roles ORDER BY ${sortColumn} ${sortDirection} LIMIT ${page * pageSize}, ${pageSize}`, { raw: true, type: Sequelize.QueryTypes.SELECT }))[0];

        res.status(200).json(Object.assign({ rows }, count));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }

}

exports.createOne = async (req, res) => {
    try {
        const permissionsColumnNames = await db.query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'permissions'", { type: Sequelize.QueryTypes.SELECT });
        const { body } = req;
        let permissionsNames = [];
        let permissionsValues = [];

        if (!body.name) {
            return res.status(400).json({
                "msg": "Bad Request: role 'name' is required",
                "humanMsg": "Please enter the name of the role."
            });
        }


        const exisingNameQuery = (await db.query(`SELECT count(*) AS count FROM roles WHERE name = :name`, { replacements: { name: body.name }, raw: true, type: Sequelize.QueryTypes.SELECT }))[0];

        if (exisingNameQuery.count > 0) {
            return res.status(409).json({
                "msg": `Bad Request: role named '${body.name}' already assigned.`,
                "humanMsg": "The name for this role is already in use."
            });
        }

        for (var prop in body) {
            let doesPermissionExist = false;
            if (prop === 'name' || prop === 'is_deleted') {
                continue;
            }

            if (!utils.StringValidation.isAlphaNumericWithUnderscore(prop)) {
                return res.status(400).json({
                    "msg": `Bad Request: permission named '${prop}' isn't a properly formated permission (Alphanumeric with underscore).`
                });
            }

            for (var i = 0; i < permissionsColumnNames.length; i++) {
                let col = permissionsColumnNames[i].COLUMN_NAME;

                if (col === "id" || col === "user_id" || col === "is_deleted") {
                    continue;
                }

                if (col === prop) {
                    doesPermissionExist = true;
                    break;
                }
            }

            if (!doesPermissionExist) {
                return res.status(400).json({
                    "msg": `Bad Request: '${prop}' isn't a valid permission. Use link to find valid permissions`,
                    "humanMsg": `You have assigned permission '${prop}' to a role, but that permission doesn't exist.`,
                    "link": "/api/v1/admin/permissions"
                });
            } else {
                permissionsNames.push(prop);
                permissionsValues.push(body[prop] ? 1 : 0)
            }
        }

        const id = (await db.query(`INSERT INTO roles (id, name${permissionsValues.length !== 0 ? ',' : ''} ${permissionsNames.join(',')}) VALUES (NULL, :name${permissionsValues.length !== 0 ? ',' : ''} ${permissionsValues.join(',')});`, { replacements: { name: body.name }, raw: true, type: Sequelize.QueryTypes.INSERT }))[0];

        res.status(201).json({ id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.updateMany = async (req, res) => {
    try {
        const { roles } = req.body;

        if (!roles) {
            return res.status(400).json({
                "msg": `Bad Request: body requires an array of roles called roles.`
            });
        }

        //set a limit to 50 updates at once.
        if (roles.length > 50) {
            return res.status(400).json({
                "msg": `Bad Request: Bulk update has a limit of 50 records.`
            });
        }

        for (var i = 0; i < roles.length; i++) {
            //check all objects for ids
            if (roles[i].id === undefined) {
                return res.status(400).json({
                    "msg": `Bad Request: All roles should have an id.`
                });
            }

            //check to insure all ids are valid.
            const id = (await db.query(`SELECT COUNT(*) as doesExist FROM roles WHERE id = :id`, { replacements: { id: roles[i].id }, raw: true, type: Sequelize.QueryTypes.SELECT }))[0];

            if (!id.doesExist) {
                return res.status(400).json({
                    "msg": `Bad Request: Id '${roles[i].id}' does not exist.`
                });
            }
        }

        //check all names for repeats
        for (var i = 0; i < roles.length; i++) {
            const exisingNameQuery = (await db.query(`SELECT count(*) AS count FROM roles WHERE name = :name`, { replacements: { name: roles[i].name }, raw: true, type: Sequelize.QueryTypes.SELECT }))[0];

            if (exisingNameQuery.count > 0) {
                return res.status(409).json({
                    "msg": `Bad Request: role named '${roles[i].name}' already assigned. Index '${roles[i].id}' cannot use this name current.`
                });
            }
        }

        //check all permissions are valid
        const permissionsColumnNames = await db.query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'permissions'", { type: Sequelize.QueryTypes.SELECT });
        for (var i = 0; i < roles.length; i++) {

            for (var prop in roles[i]) {
                let doesPermissionExist = false;

                if (prop == 'id' || prop === 'name' || prop === 'is_deleted' || prop === 'user_id') {
                    continue;
                }

                //prevents sql injection
                if (!utils.StringValidation.isAlphaNumericWithUnderscore(prop)) {
                    return res.status(400).json({
                        "msg": `Bad Request: permission named '${prop}' isn't a properly formated permission (Alphanumeric with underscore allowed).`
                    });
                }

                for (var x = 0; x < permissionsColumnNames.length; x++) {
                    let col = permissionsColumnNames[x].COLUMN_NAME;

                    if (col === prop) {
                        doesPermissionExist = true;
                        break;
                    }
                }

                if (!doesPermissionExist) {
                    return res.status(400).json({
                        "msg": `Bad Request: '${prop}' isn't a valid permission on id '${roles[i].id}'. Use link to find valid permissions`,
                        "link": "/api/v1/admin/permissions"
                    });
                } 
            }
        }

        //update all records
        for (var i = 0; i < roles.length; i++) {
            let updateColsSQL = [];
            let updateColsReplace = [];

            for (var prop in roles[i]) {
                if (prop === 'id') {
                    continue;
                }
                
                updateColsSQL.push(`${prop} = ?`);
                updateColsReplace.push(roles[i][prop]);
            }

            updateColsReplace.push(roles[i].id);
            const updatedRole = await db.query(`UPDATE roles SET ${updateColsSQL.join(', ')} WHERE id = ?`, { replacements: updateColsReplace, raw: true, type: Sequelize.QueryTypes.UPDATE });
        }

        res.status(200).json({ "msg": "All roles have been successfully updated." });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

//////////////////////////////////////////////////////////////
// Many Above
// ===========================================================
// Single Below
//////////////////////////////////////////////////////////////

exports.getOne = async (req, res) => {

}

exports.updateOne = async (req, res) => {

}

exports.deleteOne = async (req, res) => {

}
