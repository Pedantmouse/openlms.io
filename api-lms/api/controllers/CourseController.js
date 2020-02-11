const Course = require('../models/Course');
const utils = require('../utils');


//////////////////////////////////////////////////////////////
// Many Below
// ===========================================================

exports.getCourses = async (req, res) => {
    try {

        req.status(200).json({ success: "Method hit!" })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.createCourse = async (req, res) => {
    try {

        req.status(200).json({success: "Method hit!"})


    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.updateCourses = async (req, res) => {
    try {

        req.status(200).json({success: "Method hit!"})


    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.deleteCourses = async (req, res) => {
    try {

        req.status(200).json({success: "Method hit!"})


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

exports.getCourse = async (req, res) => {
    try {

        req.status(200).json({success: "Method hit!"})


    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.updateCourse = async (req, res) => {
    try {

        req.status(200).json({success: "Method hit!"})


    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {

        req.status(200).json({success: "Method hit!"})


    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};






