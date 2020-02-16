//https://www.mcieslar.com/pagination-with-sequelize-explained
exports.paginate = ({ page, pageSize }) => {
    const offset = page * pageSize;
    const limit = pageSize;

    return {
        offset,
        limit,
    };
};

exports.order = ({sortColumn, sortDirection, sortScope}) => {
    if (!sortColumn) {
        return {};
    }

    return {
        order: [[sortScope, sortColumn, sortDirection]]
    }
}
