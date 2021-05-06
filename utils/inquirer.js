const inquirer = require('inquirer');
const cTable = require('console.table');

const db = require('../db/connection');
const options = require('./options');
    
const promptUser = () => {
    return inquirer.prompt([ 
        {
            name: 'toDo',
            type: 'list',
            message: 'What would you like to do',
            choices: [
                'View All Employees', 
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Departments',
                'View All Roles',
                'Add Department',
                'Add Role',
                'Remove Role',
                'Exit'
            ]
        },
        {
            name: 'firstName',
            type: 'input',
            message: "What is new employee's first name?",
            when: ({toDo}) => {
                if (toDo === 'Add Employee') {
                   return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            name: 'lastName',
            type: 'input',
            message: "What is new employee's last name?",
            when: ({toDo}) => {
                if (toDo === 'Add Employee') {
                   return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            name: 'role',
            type: 'list',
            message: "What is new employee's role?",
            choices: [
                'Pharmacist', 
                'Department Manager - Appliances', 
                'Department Manager - Electronics',
                "Department Manager - Men's",
                "Department Manager - Women's",
                'Department Manager - Kids',
                'Department Manager - Furniture',
                'Department Manager - Sports',
                'Department Manager - Grocery',
                'Department Manager - Office',
                'Assistant Manager - Pharmacy', 
                'Assistant Manager - Appliances',    
                'Assistant Manager - Electronics',  
                "Assistant Manager - Men's",    
                "Assistant Manager - Women's",      
                'Assistant Manager - Kids', 
                'Assistant Manager - Furniture',    
                'Assistant Manager - Sports',   
                'Assistant Manager - Grocery',  
                'Assistant Manager - Office',   
                'Salesman - Appliances',    
                'Salesman - Electronics',   
                'Salesman - Furniture', 
                'Associate - Pharmacy', ,
                'Associate - Appliances',   
                'Associate - Electronics',    
                "Associate - Men's",    
                "Associate - Women's",  
                'Associate - Kids', 
                'Associate - Furniture',    
                'Associate - Sports',   
                'Associate - Grocery',  
                'Associate - Office'   
            ],
            when: ({toDo}) => {
                if (toDo === 'Add Employee') {
                   return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            name: 'removeEmployee',
            type: 'list',
            message: 'Which employee would you like to remove?',
            choices: [
                // ?????????????? Add choices here, grab seeds??? how to access sql db tables?
            ],
            when: ({toDo}) => {
                if (toDo === 'Remove Employee') {
                    return true;
                }
                else {
                    return false;
                }
            }   
        },
        {
            name: 'updateEmpRole',
            type: 'list',
            message: 'For which employee would you like to update their role?',
            choices: [
                // ??????????? 
            ],
            when: ({toDo}) => {
                if (toDo === 'Update Employee Role') {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            name: 'empRoleUpdated',
            type: 'list',
            message: "What is the employee's new roll?",
            choices: [
                // ??????
            ],
            when: ({toDo}) => {
                if (toDo === 'Update Employee Role') {
                    return true;
                }
                else {
                    return false;
                }
            }  
        },
        {
            name: 'updateEmpManager',
            type: 'list',
            message: 'For which employee would you like to update their manager?',
            choices: [
                // ??????????? 
            ],
            when: ({toDo}) => {
                if (toDo === 'Update Employee Manager') {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            name: 'empManagerUpdated',
            type: 'list',
            message: "Who is the employee's new manager?",
            choices: [
                // ??????
            ],
            when: ({toDo}) => {
                if (toDo === 'Update Employee Manager') {
                    return true;
                }
                else {
                    return false;
                }
            }  
        },
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name of the new department you would like to add?',
            when: ({toDo}) => {
                if (toDo === 'Add Department') {
                    return true;
                }
                else {
                    return false;
                }
            }

        },
        {
            name: 'newRole',
            type: 'input',
            message: 'What is the name of the new role you would like to add?',
            when: ({toDo}) => {
                if (toDo === 'Add Role') {
                    return true;
                }
                else {
                    return false;
                }
            }

        },
        {
            name: 'roleSalary',
            type: 'input',
            message: 'What is the salary for this role?',
            when: ({toDo}) => {
                if (toDo === 'Add Role') {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            name: 'roleDepartment',
            type: 'list',
            message: 'What department does this role belong too?',
            choices: [
                // ???
            ],
            when: ({toDo}) => {
                if (toDo === 'Add Role') {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            name: 'removeRole',
            type: 'list',
            message: 'What role would you like to remove?',
            choices: [
                // ???
            ],
            when: ({toDo}) => {
                if (toDo === 'Remove Role') {
                    return true;
                }
                else {
                    return false;
                }
            }

        }
    ])
    .then(response => {
        if (response.toDo === 'Exit') {
            return 'Exit';
        }
        else {
            return options(response);        
        }    
    })
    .then(sql => {
        if (sql === 'Exit') {
            console.log('Good Bye!!!');
            return;
        }
        return db.query(sql);
        // });
        
        // console.log(sql);
        // prompts(toDo);
    })
    .then(result => {
        const table = cTable.getTable([result]);
        console.log([table]);

    });
};

module.exports = promptUser;