const options = option => {
    let sql;
    if (option.toDo === 'View All Employees') {
        sql = 'SELECT * FROM employees';
    }
    if (option.toDo === 'View All Employees By Department'){
        sql = 'SELECT * FROM employees WHERE '
    }
    return sql;
};

module.exports = options;