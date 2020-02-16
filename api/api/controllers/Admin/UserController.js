const User = require('../../models/User');
const UserProfile = require('../../models/UserProfile');
const utils = require('../../utils');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//////////////////////////////////////////////////////////////
// Many Below
// ===========================================================

exports.getUsers = async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const shouldIncludeProfile = req.query.profile === "true";
        const shouldFilterForAdmins = req.query.admin === "true";
        const shouldFilterForOrganizational = req.query.organizational === "true";
        const shouldFilterForNormalUsers = req.query.user === "true";
        const page = parseInt(req.query.page) || 0;
        const pageSize = parseInt(req.query.page) || 15;
        const sortColumn = req.query.sortColumn;
        const sortDirection = req.query.sortDirection || 'asc';
        const sortScope = req.query.sortScope || 'user';


        let sqlWhere = {
            where: {
                isDeleted: false
            }
        };

        if (searchQuery && !shouldIncludeProfile) {
            // sqlWhere.where.email = { [Op.like]: '%' + searchQuery + '%' }

            sqlWhere.where[Op.or] = {
                email: { [Op.like]: '%' + searchQuery + '%' }
            }
        }

        if (shouldIncludeProfile) {
            sqlWhere.include = [{
                model: UserProfile,
                as: 'profile'
            }]

            if (searchQuery) {
                sqlWhere.include[0].where = sqlWhere.include[0].where || {};
                sqlWhere.include[0].where[Op.or] = {
                    username: { [Op.like]: '%' + searchQuery + '%' },
                    firstName: { [Op.like]: '%' + searchQuery + '%' },
                    lastName: { [Op.like]: '%' + searchQuery + '%' },
                    phoneNumber: { [Op.like]: '%' + searchQuery + '%' },
                    website: { [Op.like]: '%' + searchQuery + '%' },
                    '$User.email$': {
                        [Op.like]: '%' + searchQuery + '%'
                    },
                }
            }
        }

        if (shouldFilterForAdmins && shouldFilterForOrganizational && shouldFilterForNormalUsers) {
            // do nothing.
        } else if (shouldFilterForAdmins && shouldFilterForOrganizational && !shouldFilterForNormalUsers) {
            sqlWhere.where[Op.or] = {
                isAdmin: true,
                isOrganizationMember: true
            }
        } else if (shouldFilterForAdmins && !shouldFilterForOrganizational && shouldFilterForNormalUsers) {
            sqlWhere.where.isOrganizationMember = false;

        } else if (!shouldFilterForAdmins && shouldFilterForOrganizational && shouldFilterForNormalUsers) {
            sqlWhere.where.isAdmin = false;

        } else if (shouldFilterForAdmins && !shouldFilterForOrganizational && !shouldFilterForNormalUsers) {
            sqlWhere.where.isAdmin = true;

        } else if (!shouldFilterForAdmins && !shouldFilterForOrganizational && shouldFilterForNormalUsers) {
            sqlWhere.where.isAdmin = false;
            sqlWhere.where.isOrganizationMember = false;

        } else if (!shouldFilterForAdmins && shouldFilterForOrganizational && !shouldFilterForNormalUsers) {
            sqlWhere.where.isOrganizationMember = true;
        }


        //missing sort

        const users = await User.findAndCountAll({
            ...sqlWhere,
            ...utils.Database.paginate({ page, pageSize }),
            ...utils.Database.order({sortColumn, sortDirection, sortScope})
        });
        // order: [['profileImages', 'id', 'desc']]

        console.log("users", users);

        res.status(200).json(users);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.createUser = async (req, res) => {
    try {

        res.status(201).json({ success: "Method hit!" })


    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.updateUsers = async (req, res) => {
    try {

        res.status(200).json({ success: "Method hit!" })


    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

//////////////////////////////////////////////////////////////
// Many Above
// ===========================================================
// Single Below
//////////////////////////////////////////////////////////////
exports.getUser = async (req, res) => {
    try {

        res.status(200).json({ success: "Method hit!" })


    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {

        res.status(200).json({ success: "Method hit!" })


    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {

        res.status(200).json({ success: "Method hit!" })


    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};





// SELECT `User`.`id`, `User`.`email`, `User`.`password`, `User`.`isAdmin`, `User`.`isBanned`, `User`.`isDisabled`, `User`.`isOrganizationMember`, `User`.`isDeleted`, `User`.`createdAt`, `User`.`updatedAt`, `Profile`.`id` AS `Profile.id`, `Profile`.`userId` AS `Profile.userId`, `Profile`.`firstName` AS `Profile.firstName`, `Profile`.`lastName` AS `Profile.lastName`, `Profile`.`username` AS `Profile.username`, `Profile`.`phoneNumber` AS `Profile.phoneNumber`, `Profile`.`website` AS `Profile.website`, `Profile`.`createdAt` AS `Profile.createdAt`, `Profile`.`updatedAt` AS `Profile.updatedAt` FROM `users` AS `User` 
// INNER JOIN `users_profile` AS `Profile` 
// ON `User`.`id` = `Profile`.`userId` 
// AND ((`Profile`.`username` LIKE '%bugs%' 
// AND `Profile`.`firstName` LIKE '%bugs%' 
// AND `Profile`.`lastName` LIKE '%bugs%' 
// AND `Profile`.`phoneNumber` LIKE '%bugs%' 
// AND `Profile`.`website` LIKE '%bugs%')) 
// WHERE (`User`.`email` LIKE '%bugs%') AND `User`.`isDeleted` = false LIMIT 0, 15;
// Executing (default): SELECT count(*) AS `count` FROM `users` AS `User`;
