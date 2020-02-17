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
        const sortColumn = req.query.sortColumn || 'name';
        const sortDirection = req.query.sortDirection || 'asc';

        if (sortColumn) {
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
                    "msg": "Bad Request: 'sortColumn' isn't a valid permissions",
                    "humanMsg": "You are sorting by a permissions that doesn't exist."
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

}

exports.updateMany = async (req, res) => {

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
