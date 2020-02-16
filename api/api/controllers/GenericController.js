
exports.response405 = async (req, res) => {
    res.status(405).json({
        msg: "Method Not Allowed."
    })
};