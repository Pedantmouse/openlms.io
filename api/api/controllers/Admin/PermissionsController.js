const utils = require('../../utils');
const Sequelize = require('sequelize');
const database = require('../../../config/databases');

const db = database.lms;

//////////////////////////////////////////////////////////////
// Meta Below
// ===========================================================
//Permissions
exports.getMany = async (req, res) => {
    try {
        const permissionsColumnNames = await db.query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'permissions'", { type: Sequelize.QueryTypes.SELECT });
        let permissions = [];
        // delete permissionsColumnNames.user_id;
        for (var i = 0; i < permissionsColumnNames.length; i++) {
            let col = permissionsColumnNames[i].COLUMN_NAME;

            if (col === "id" || col === "user_id" || col === "is_deleted") {
                continue;
            }

            permissions.push(col);
        }

        res.status(200).json({ permissions });
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

exports.deleteOne = async (req, res) => {
    try {
        const { name } = req.params;
        const permissionsColumnNames = await db.query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'permissions'", { type: Sequelize.QueryTypes.SELECT });
        let isExistingName = false;

        for (var i = 0; i < permissionsColumnNames.length; i++) {
            let col = permissionsColumnNames[i].COLUMN_NAME;

            if (col === name) {
                isExistingName = true;
            }
        }

        if (!isExistingName) {
            return res.status(400).json({
                "msg": "Bad Request: Can not delete a permission that doesn't exist. Use the link to get a link to valid permission names.",
                "link": "/api/v1/admin/permissions"
            });
        }

        await db.query(`ALTER TABLE permissions DROP COLUMN ${name}`);
        await db.query(`ALTER TABLE roles DROP COLUMN ${name}`);

        res.status(200).json({ 
            "msg": "This permission was successfully deleted."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}
