const {prompt} = require('inquirer');
const cTable = require('console.table');

const db = require('../db/connection');
const options = require('./options');

// const startPrompts = () => {
//     db.promise().query('SELECT employee.first_name FROM employees').then(res => {
//         prompt([
//             {
//                 name: 'toDo',
//                 type: 'list',
//                 message: 'What would you like to do',
//                 choices: res
//             }
//         ]).then(response => {
//             if (response === 'View All Employees') {
    
//             }
//         })
//     })
    
// };

const startPrompts = () => {
    return prompt([
        {
            name: 'startMenu',
            type: 'list',
            message: 'Employee Manager: Please choose one of the following.',
            choices: [
                'View All Employees', 
                'View All Employees (Alphabetical Last Name)',
                'View All Employees By Department',
                'View All Employees By Manager',
                'View All Roles',
                'View All Roles (By Department)',
                'View All Departments',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Remove Employee',
                'Remove Role',
                'Update Employee Role',
                'Update Employee Manager',
                'Exit'
            ]
        }
    ])
    .then(({startMenu}) => {
        switch (startMenu) {
            case 'View All Employees':
                db.query('SELECT * FROM employees', (err, rows) => {
                    console.table(rows);
                    startPrompts();
                });
                
                break;

            case 'View All Employees (Alphabetical Last Name)':
                db.query('SELECT * FROM employees ORDER BY last_name', (err, rows) => {
                    console.table(rows);
                    startPrompts();
                });

                break;

            case 'View All Employees By Department':
                db.query('SELECT * FROM employees ORDER BY department_id', (err, rows) => {
                    console.table(rows);
                    startPrompts();
                });

                break;

            case 'View All Employees By Manager':
                db.query(`
                    SELECT * 
                    FROM employees 
                    ORDER BY manager_id, last_name
                    `, 
                    (err, rows) => {
                        console.table(rows)
                        startPrompts();
                    }
                ); 

                break;
            
            case 'View All Roles':
                db.query(`SELECT * FROM roles`, (err, rows) => {
                        console.table(rows)
                        startPrompts();
                });
                
                break;
            
            case    'View All Roles (By Department)':
                db.query(`SELECT * FROM roles ORDER BY department_id`, (err, rows) => {
                    console.table(rows)
                    startPrompts();
                });

                break;
            
            case 'View All Departments':
                db.query(`SELECT * FROM departments`, (err, rows) => {
                    console.table(rows)
                    startPrompts();
                });

                break;
            
            case 'Add Employee':
                console.log(`
                    ================================
                            ADDING EMPLOYEE
                    ================================
                `);

                let first;
                let last;
                let role;
                let manager;

                return prompt([
                    {
                       name: 'firstName',
                       type: 'input',
                       message: "What is the new employee's first name?" 
                    },
                    {
                        name: 'lastName',
                        type: 'input',
                        message: "What is the new employee's last name?"
                    }
                ])
                .then(({firstName, lastName}) => {
                    first = JSON.stringify(firstName);
                    last = JSON.stringify(lastName);
                })
                .then(()=>{
                    db.query(`SELECT * FROM roles`, (err, rows) => {
                        console.table(rows);

                        console.log(`
                        ======================================================
                                        REFERENCE TABLE ABOVE
                        ======================================================
                        What is the new employee's role? (Enter role id number)
                        `);
                    });
                   
                    return prompt([
                        {
                            name: 'empRole',
                            type: 'input',
                            message: "What is the new employee's role? (Enter role id number)",
                        }
                    ])
                })
                .then(({empRole}) => {
                    role = parseInt(empRole)
                    console.log(role)
                })    
                .then(() => {
                    db.query(`SELECT * FROM employees ORDER BY last_name`, (err, rows) => {
                        console.table(rows);

                        console.log(`
                        ==============================================================
                                            REFERENCE TABLE ABOVE
                        ==============================================================
                        Who is the new employee's manager? (Enter manager's id number)
                        `);
                    });
                                       
                    return prompt([
                        {
                            name: 'empManager',
                            type: 'input',
                            message: "Who is the new employee's manager? (Enter manager's id number)"
                        }
                    ]);
                })
                .then(({empManager}) => {
                    manager = parseInt(empManager);

                    db.query(`
                    INSERT INTO employees (first_name, last_name, role_id, manager_id)
                    VALUES (${first}, ${last}, ${role}, ${manager})
                    `);

                    console.log(`
                    =====================================
                    ${first} ${last} was added!
                    =====================================
                    `);

                    startPrompts();
                });

                break;
            
            case 'Add Role':
                console.log(`
                    ================================
                              ADDING ROLE
                    ================================
                `);

                let title;
                let salary;
                let department;

                return prompt([
                    {
                       name: 'roleTitle',
                       type: 'input',
                       message: 'What is the title of the role you would like to add?' 
                    },
                    {
                        name: 'roleSalary',
                        type: 'input',
                        message: 'What is the salary for this role?'
                    }
                ])
                .then(({roleTitle, roleSalary}) => {
                    title = JSON.stringify(roleTitle);
                    salary = JSON.stringify(roleSalary);
                })
                .then(()=>{
                    db.query(`SELECT * FROM departments`, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                        ================================
                             REFERENCE TABLE ABOVE
                        ================================
                          (Enter department id number)
                        `);                                                           
                    });
                    
                    return prompt([
                        {
                            name: 'roleDepartment',
                            type: 'input',
                            message: 'What department does this role belong to? (Enter department id number)',
                        }
                    ]);
                })
                .then(({roleDepartment}) => {
                    department = parseInt(roleDepartment);

                    db.query(`
                        INSERT INTO roles (title, salary, department_id)
                        VALUES (${title}, ${salary}, ${department})
                    `)

                    console.log(`
                    ================================
                              ROLE ADDED!
                    ================================
                    `);

                    startPrompts();
                });
            
                break;

            case 'Add Department':
                console.log(`
                ================================
                        ADDING DEPARTMENT
                ================================
                `);

                let name;

                return prompt([
                    {
                    name: 'deptName',
                    type: 'input',
                    message: 'What is the name of the department you would like to add?' 
                    }
                ])
                .then(({deptName}) => {
                    name = JSON.stringify(deptName);

                    db.query(`
                    INSERT INTO departments (dept_name)
                    VALUES (${name})
                    `)

                    console.log(`
                    ================================
                            DEPARTMENT ADDED!
                    ================================
                    `);

                    startPrompts();
                })

                break;

            case 'Remove Employee':
                prompt([
                    {
                        name: 'confirmRmvEmp',
                        type: 'confirm',
                        message: 'Are you sure you want to remove an employee from the database?'
                    }
                ])
                .then(({confirmRmvEmp}) => {
                    !confirmRmvEmp 
                        ? startPrompts()
                        : console.log(`
                            ================================
                                   REMOVING EMPLOYEE
                            ================================
                        `); 
                })
                .then(() => {
                    db.query(`SELECT * FROM employees`, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                        ================================
                             REFERENCE TABLE ABOVE
                        ================================
                          (Enter employee id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'rmvEmp',
                            type: 'input',
                            message: 'Which employee would you like to remove? (Enter employee id number)'
                        }
                    ]);
                })
                .then(({rmvEmp}) => {
                    let id = parseInt(rmvEmp);

                    db.query(`
                        DELETE FROM employees 
                        WHERE id = ${id} 
                    `);

                    console.log(`
                        ================================
                        EMPLOYEE ${id} HAS BEEN REMOVED!
                        ================================
                    `);

                    startPrompts();
                });
             
                break;
    
            case 'Remove Role':
                prompt([
                    {
                        name: 'confirmRmvRole',
                        type: 'confirm',
                        message: 'Are you sure you want to remove a role from the database?'
                    }
                ])
                .then(({confirmRmvRole}) => {
                    !confirmRmvRole 
                        ? startPrompts()
                        : console.log(`
                            ================================
                                     REMOVING ROLE
                            ================================
                        `); 
                })
                .then(() => {
                    db.query(`SELECT * FROM roles`, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                        ================================
                             REFERENCE TABLE ABOVE
                        ================================
                          (Enter role id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'rmvRole',
                            type: 'input',
                            message: 'Which role would you like to remove? (Enter role id number)'
                        }
                    ]);
                })
                .then(({rmvRole}) => {
                    let id = parseInt(rmvRole);

                    db.query(`
                        DELETE FROM employees 
                        WHERE id = ${id} 
                    `);

                    console.log(`
                        ================================
                          ROLE ${id} HAS BEEN REMOVED!
                        ================================
                    `);

                    startPrompts();
                });
            
                break;

            case 'Update Employee Role':
                let empId;
                let roleId;

                return prompt([
                    {
                        name: 'confirmUpdateEmpRole',
                        type: 'confirm',
                        message: "Are you sure you want to update an employee's role?"
                    }
                ])
                .then(({confirmUpdateEmpRole}) => {
                    !confirmUpdateEmpRole 
                        ? startPrompts()
                        : console.log(`
                            ================================
                                UPDATING EMPLOYEE ROLE
                            ================================
                        `); 

                    db.query(`SELECT * FROM employees`, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                        ================================
                             REFERENCE TABLE ABOVE
                        ================================
                          (Enter employee's id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'updEmpRole',
                            type: 'input',
                            message: "For which employee would you like to update role? (Enter employee's id number)"
                        }
                    ]);
                })
                .then(({updEmpRole}) => {
                    empId = parseInt(updEmpRole);

                    db.query(`SELECT * FROM roles`, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                        ================================
                             REFERENCE TABLE ABOVE
                        ================================
                             (Enter role id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'idRole',
                            type: 'input',
                            message: "Who is the employee's new manager?"
                        }
                    ]);
                })
                .then(({idRole}) => {
                    roleId = parseInt(idRole);
                  
                    db.query(`
                        UPDATE employees
                        SET role_id = ${roleId} 
                        WHERE id = ${empId} 
                    `);

                    console.log(`
                        ================================
                        EMPLOYEE ${empId} HAS BEEN UPDATED!
                        ================================
                    `);

                    startPrompts();
                })
                .catch(err => {
                    if (err) { 
                        console.log(err);
                        throw err;
                    }
                })
            
                break;

            case 'Update Employee Manager':      
                let idEmp;
                let idMgr;

                prompt([
                    {
                        name: 'confirmUpdEmpMgr',
                        type: 'confirm',
                        message: "Are you sure you want to update an employee's manager?"
                    }
                ])
                .then(({confirmUpdEmpMgr}) => {
                    !confirmUpdEmpMgr 
                        ? startPrompts()
                        : console.log(`
                            ================================
                              UPDATING EMPLOYEE'S MANAGER
                            ================================
                        `); 
                })
                .then(() => {
                    db.query(`SELECT * FROM employees`, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                        ================================
                             REFERENCE TABLE ABOVE
                        ================================
                          (Enter employee's id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'updEmpMgr',
                            type: 'input',
                            message: "For which employee would you like to update manager? (Enter employee's id number)"
                        }
                    ]);
                })
                .then(({updEmpMgr}) => {
                    idEmp = parseInt(updEmpMgr);

                    db.query(`SELECT * FROM employees`, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                        ================================
                             REFERENCE TABLE ABOVE
                        ================================
                          (Enter manager's id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'mgrId',
                            type: 'input',
                            message: "Who is the employee's new manager?"
                        }
                    ]);
                })
                .then(({mgrId}) => {
                    idMgr = parseInt(mgrId);
                  
                    db.query(`
                        UPDATE employees
                        SET manager_id = ${idMgr} 
                        WHERE id = ${idEmp} 
                    `);

                    console.log(`
                        ================================
                        EMPLOYEE ${idEmp} HAS BEEN UPDATED!
                        ================================
                    `);

                    startPrompts();
                });
            
                break;
            
            case 'Exit':
                console.log('Good Bye!');
                db.end();
                break;
        }
    })
};













// const promptUser = () => {
//     return inquirer.prompt([ 
//         {
//             name: 'toDo',
//             type: 'list',
//             message: 'What would you like to do',
//             choices: [
//                 'View All Employees', 
//                 'View All Employees By Department',
//                 'View All Employees By Manager',
//                 'Add Employee',
//                 'Remove Employee',
//                 'Update Employee Role',
//                 'Update Employee Manager',
//                 'View All Departments',
//                 'View All Roles',
//                 'Add Department',
//                 'Add Role',
//                 'Remove Role',
//                 'Exit'
//             ]
//         },
//         {
//             name: 'firstName',
//             type: 'input',
//             message: "What is new employee's first name?",
//             when: ({toDo}) => {
//                 if (toDo === 'Add Employee') {
//                    return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }
//         },
//         {
//             name: 'lastName',
//             type: 'input',
//             message: "What is new employee's last name?",
//             when: ({toDo}) => {
//                 if (toDo === 'Add Employee') {
//                    return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }
//         },
//         {
//             name: 'role',
//             type: 'list',
//             message: "What is new employee's role?",
//             choices: [
//                 'Pharmacist', 
//                 'Department Manager - Appliances', 
//                 'Department Manager - Electronics',
//                 "Department Manager - Men's",
//                 "Department Manager - Women's",
//                 'Department Manager - Kids',
//                 'Department Manager - Furniture',
//                 'Department Manager - Sports',
//                 'Department Manager - Grocery',
//                 'Department Manager - Office',
//                 'Assistant Manager - Pharmacy', 
//                 'Assistant Manager - Appliances',    
//                 'Assistant Manager - Electronics',  
//                 "Assistant Manager - Men's",    
//                 "Assistant Manager - Women's",      
//                 'Assistant Manager - Kids', 
//                 'Assistant Manager - Furniture',    
//                 'Assistant Manager - Sports',   
//                 'Assistant Manager - Grocery',  
//                 'Assistant Manager - Office',   
//                 'Salesman - Appliances',    
//                 'Salesman - Electronics',   
//                 'Salesman - Furniture', 
//                 'Associate - Pharmacy', ,
//                 'Associate - Appliances',   
//                 'Associate - Electronics',    
//                 "Associate - Men's",    
//                 "Associate - Women's",  
//                 'Associate - Kids', 
//                 'Associate - Furniture',    
//                 'Associate - Sports',   
//                 'Associate - Grocery',  
//                 'Associate - Office'   
//             ],
//             when: ({toDo}) => {
//                 if (toDo === 'Add Employee') {
//                    return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }
//         },
//         {
//             name: 'removeEmployee',
//             type: 'list',
//             message: 'Which employee would you like to remove?',
//             choices: [
//                 // ?????????????? Add choices here, grab seeds??? how to access sql db tables?
//             ],
//             when: ({toDo}) => {
//                 return toDo === 'Remove Employee' ? true : false;
//             } 
           
            
//         },
//         {
//             name: 'updateEmpRole',
//             type: 'list',
//             message: 'For which employee would you like to update their role?',
//             choices: [
//                 // ??????????? 
//             ],
//             when: ({toDo}) => {
//                 if (toDo === 'Update Employee Role') {
//                     return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }
//         },
//         {
//             name: 'empRoleUpdated',
//             type: 'list',
//             message: "What is the employee's new roll?",
//             choices: [
//                 // ??????
//             ],
//             when: ({toDo}) => {
//                 if (toDo === 'Update Employee Role') {
//                     return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }  
//         },
//         {
//             name: 'updateEmpManager',
//             type: 'list',
//             message: 'For which employee would you like to update their manager?',
//             choices: [
//                 // ??????????? 
//             ],
//             when: ({toDo}) => {
//                 if (toDo === 'Update Employee Manager') {
//                     return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }
//         },
//         {
//             name: 'empManagerUpdated',
//             type: 'list',
//             message: "Who is the employee's new manager?",
//             choices: [
//                 // ??????
//             ],
//             when: ({toDo}) => {
//                 if (toDo === 'Update Employee Manager') {
//                     return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }  
//         },
//         {
//             name: 'newDepartment',
//             type: 'input',
//             message: 'What is the name of the new department you would like to add?',
//             when: ({toDo}) => {
//                 if (toDo === 'Add Department') {
//                     return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }

//         },
//         {
//             name: 'newRole',
//             type: 'input',
//             message: 'What is the name of the new role you would like to add?',
//             when: ({toDo}) => {
//                 if (toDo === 'Add Role') {
//                     return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }

//         },
//         {
//             name: 'roleSalary',
//             type: 'input',
//             message: 'What is the salary for this role?',
//             when: ({toDo}) => {
//                 if (toDo === 'Add Role') {
//                     return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }
//         },
//         {
//             name: 'roleDepartment',
//             type: 'list',
//             message: 'What department does this role belong too?',
//             choices: [
//                 // ???
//             ],
//             when: ({toDo}) => {
//                 if (toDo === 'Add Role') {
//                     return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }
//         },
//         {
//             name: 'removeRole',
//             type: 'list',
//             message: 'What role would you like to remove?',
//             choices: [
//                 // ???
//             ],
//             when: ({toDo}) => {
//                 if (toDo === 'Remove Role') {
//                     return true;
//                 }
//                 else {
//                     return false;
//                 }
//             }

//         }
//     ])
//     .then(response => {
//         if (response.toDo === 'Exit') {
//             return 'Exit';
//         }
//         else {
//             return options(response);        
//         }    
//     })
//     .then(sql => {
//         if (sql === 'Exit') {
//             console.log('Good Bye!!!');
//             db.end();
//         }
//         return db.query(sql);
//         // });
        
//         // console.log(sql);
//         // prompts(toDo);
// //     })
// //     .then(result => {
// //         const table = cTable.getTable([result]);
// //         console.log([table]);

//     });
// };

module.exports = startPrompts;