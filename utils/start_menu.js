// requiring dependancies
const {prompt} = require('inquirer');
const cTable = require('console.table');

// requiring database connection
const db = require('../db/connection');

// requiring validation functions
const { validateName, validateId, validateSalary } = require('./validations');

// function starts app's Start Menu
const startPrompts = () => {
    return prompt([
        // Prompts Start Menu options 
        {
            name: 'startMenu',
            type: 'list',
            message: 'Employee Manager: Please choose one of the following.',
            choices: [
                'View All Employees (By ID)', 
                'View All Employees (By Alphabetical Last Name)',
                'View All Employees (By Department)',
                'View All Employees (By Manager)',
                'View All Roles (By ID)',
                'View All Roles (By Department)',
                'View All Departments (By ID)',
                'View Utilized Budget (By Department)',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Update Employee Role',
                'Update Employee Manager',
                'Exit'
            ]
        }
    ])
    // takes in User choice
    .then(({startMenu}) => {
        // switch statement for each potential user choice
        switch (startMenu) {
            
            // 'View All Employees (By ID)' case 
            case 'View All Employees (By ID)':
                // MySQL query to show * Employees 
                db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept_name, roles.salary, 
                    concat(a.last_name, ', ', a.first_name) 
                    AS manager
                    FROM employees
                    LEFT JOIN roles
                    ON employees.role_id = roles.id
                    LEFT JOIN departments
                    ON roles.department_id = departments.id
                    JOIN employees a
                    ON employees.manager_id = a.id
                    `, (err, rows) => {
                        err
                            // if error console.log(err)                        
                            ? console.log(err)
                            // else display table with query results
                            : console.table(rows);
                    
                        // function sends user back to Start Menu
                        startPrompts();
                    }
                );
                
                break;

            // 'View All Employees (Alphabetical Last Name)' case    
            case 'View All Employees (By Alphabetical Last Name)':
                db.query(`SELECT employees.id, employees.last_name, employees.first_name, roles.title, departments.dept_name, roles.salary, 
                    concat(a.last_name, ', ', a.first_name) 
                    AS manager
                    FROM employees
                    LEFT JOIN roles
                    ON employees.role_id = roles.id
                    LEFT JOIN departments
                    ON roles.department_id = departments.id
                    JOIN employees a
                    ON employees.manager_id = a.id
                    ORDER BY employees.last_name
                    `, (err, rows) => {
                        err                     
                                ? console.log(err)
                                : console.table(rows);

                        startPrompts();
                    }
                );

                break;
            
            // 'View All Employees (By Department)' case    
            case 'View All Employees (By Department)':
                db.query(`SELECT employees.id, employees.last_name, employees.first_name, roles.title, departments.dept_name, roles.salary, 
                    concat(a.last_name, ', ', a.first_name) 
                    AS manager
                    FROM employees
                    LEFT JOIN roles
                    ON employees.role_id = roles.id
                    LEFT JOIN departments
                    ON roles.department_id = departments.id
                    JOIN employees a
                    ON employees.manager_id = a.id
                    ORDER BY departments.dept_name
                    `, (err, rows) => {
                        err                     
                        ? console.log(err)
                        : console.table(rows);

                        startPrompts();
                    }
                );

                break;
            
            // 'View All Employees (By Manager)' case 
            case 'View All Employees (By Manager)':
                db.query(`SELECT employees.id, employees.last_name, employees.first_name, roles.title, departments.dept_name, roles.salary, 
                    concat(a.last_name, ', ', a.first_name) 
                    AS manager
                    FROM employees
                    LEFT JOIN roles
                    ON employees.role_id = roles.id
                    LEFT JOIN departments
                    ON roles.department_id = departments.id
                    JOIN employees a
                    ON employees.manager_id = a.id 
                    ORDER BY employees.manager_id, employees.last_name
                    `, (err, rows) => {
                        err                     
                            ? console.log(err)
                            : console.table(rows);

                        startPrompts();
                    }
                ); 

                break;
            
            // 'View All Roles (By ID)' case
            case 'View All Roles (By ID)':
                db.query(`SELECT roles.id, roles.title, roles.salary, departments.dept_name
                    FROM roles
                    LEFT JOIN departments
                    ON roles.department_id = departments.id
                    `, (err, rows) => {
                        err                     
                        ? console.log(err)
                        : console.table(rows);

                        startPrompts();
                    }
                );
                
                break;
            
            // 'View All Roles (By Department)' case
            case 'View All Roles (By Department)':
                db.query(`SELECT roles.id, roles.title, roles.salary, departments.dept_name
                    FROM roles
                    LEFT JOIN departments
                    ON roles.department_id = departments.id 
                    ORDER BY department_id
                    `, (err, rows) => {
                        err                     
                        ? console.log(err)
                        : console.table(rows);

                        startPrompts();
                    }
                );

                break;
            
            // 'View All Departments (By ID)' case
            case 'View All Departments (By ID)':
                db.query(`SELECT * 
                    FROM departments   
                    `, (err, rows) => {
                        err                     
                        ? console.log(err)
                        : console.table(rows);

                        startPrompts();
                    }
                );

                break;
            
            // 'View Utilized Budget (By Department)' case
            case 'View Utilized Budget (By Department)':
                db.query (`SELECT SUM(roles.salary) AS salary, departments.dept_name
                    FROM employees 
                    LEFT JOIN roles  
                    ON employees.role_id = roles.id 
                    LEFT JOIN departments 
                    ON roles.department_id = departments.id
                    GROUP BY departments.id
                    `,(err, rows) => {
                        err                     
                        ? console.log(err)
                        : console.table(rows);

                        startPrompts();
                    }
                );
                
                break;

            // 'Add Employee' case
            case 'Add Employee':
                console.log(`
                                ======================================================
                                                   ADDING EMPLOYEE
                                ======================================================
                `);
                
                // declaring variables
                let first;
                let last;
                let role;
                let manager;
                
                // prompts user for employee's first and last names
                return prompt([
                    {
                       name: 'firstName',
                       type: 'input',
                       message: "What is the new employee's first name?",
                       validate: firstNameInput => validateName(firstNameInput) 
                    },
                    {
                        name: 'lastName',
                        type: 'input',
                        message: "What is the new employee's last name?",
                        validate: lastNameInput => validateName(lastNameInput)
                    }
                ])
                .then(({firstName, lastName}) => {
                    first = JSON.stringify(firstName);
                    last = JSON.stringify(lastName);
                })
                .then(()=>{
                    db.query(`
                        SELECT roles.id, roles.title 
                        FROM roles
                        `, (err, rows) => {
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
                            validate: empRoleInput => validateId(empRoleInput)
                        }
                    ])
                })
                .then(({empRole}) => {
                    role = parseInt(empRole)
                    console.log(role)
                })    
                .then(() => {
                    db.query(`SELECT employees.id,
                        concat(employees.last_name, ', ', employees.first_name)
                        AS employee_name
                        FROM employees 
                        ORDER BY employees.last_name
                        `, (err, rows) => {
                        console.table(rows);

                        console.log(`
                                ======================================================
                                               REFERENCE TABLE ABOVE
                                ======================================================
                                Who is the new employee's manager? (Enter manager's id number)
                        `);
                    });
                                       
                    return prompt([
                        {
                            name: 'empManager',
                            type: 'input',
                            message: "Who is the new employee's manager? (Enter manager's id number)",
                            validate: empManagerInput => validateId(empManagerInput)
                        }
                    ]);
                })
                .then(({empManager}) => {
                    manager = parseInt(empManager);

                    // MySQL query to add employee to employees table based on user input
                    db.query(`
                    INSERT INTO employees (first_name, last_name, role_id, manager_id)
                    VALUES (${first}, ${last}, ${role}, ${manager})
                    `, (err, result) => {
                        err
                            ? console.log(`
                                ======================================================
                                INCORRECT ID NUMBERS WERE ENTERED. PLEASE START AGAIN.
                                ======================================================
                            `)
                        
                            : console.log(`
                                ======================================================
                                            ${first} ${last} WAS ADDED!
                                ======================================================
                            `);
                        
                        startPrompts();
                    });
                });

                break;
            
            // 'Add Role' case
            case 'Add Role':
                console.log(`
                                ======================================================
                                                    ADDING ROLE
                                ======================================================
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
                        message: 'What is the salary for this role?',
                        validate: roleSalaryInput => validateSalary(roleSalaryInput)
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
                                ======================================================
                                                REFERENCE TABLE ABOVE
                                ======================================================
                                            (Enter department id number)
                        `);                                                           
                    });
                    
                    return prompt([
                        {
                            name: 'roleDepartment',
                            type: 'input',
                            message: 'What department does this role belong to? (Enter department id number)',
                            validate: roleDeptInput => validateId(roleDeptInput)
                        }
                    ]);
                })
                .then(({roleDepartment}) => {
                    department = parseInt(roleDepartment);

                    db.query(`
                        INSERT INTO roles (title, salary, department_id)
                        VALUES (${title}, ${salary}, ${department})
                        `, (err, result) => {
                            err
                                ? console.log(`
                                ======================================================
                                INCORRECT ID NUMBERS WERE ENTERED. PLEASE START AGAIN.
                                ======================================================
                                `)
                            
                                : console.log(`
                                ======================================================
                                                    ROLE ADDED!
                                ======================================================
                                `);
                        
                            startPrompts();
                    });                   
                });
    
                break;
            
            // 'Add Department' case
            case 'Add Department':
                console.log(`
                                ======================================================
                                                 ADDING DEPARTMENT
                                ======================================================
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
                    `, (err, result) => {
                        err
                            ? console.log(`
                                ======================================================
                                INCORRECT ID NUMBERS WERE ENTERED. PLEASE START AGAIN.
                                ======================================================
                            `) 
                        
                            : console.log(`
                                ======================================================
                                                DEPARTMENT ADDED!
                                ======================================================
                            `);                       
                        
                        startPrompts();
                    });                                      
                })

                break;

            // 'Remove Employee' case
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
                                ======================================================
                                                  REMOVING EMPLOYEE
                                ======================================================
                        `); 
                })
                .then(() => {
                    db.query(`SELECT employees.id,
                        concat(employees.last_name, ', ', employees.first_name)
                        AS employee_name
                        FROM employees 
                        ORDER BY employees.last_name
                        `, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                                ======================================================
                                                REFERENCE TABLE ABOVE
                                ======================================================
                                              (Enter employee id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'rmvEmp',
                            type: 'input',
                            message: 'Which employee would you like to remove? (Enter employee id number)',
                            validate: rmvEmpInput => validateId(rmvEmpInput)
                        }
                    ]);
                })
                .then(({rmvEmp}) => {
                    let id = parseInt(rmvEmp);

                    db.query(`
                        DELETE FROM employees 
                        WHERE id = ${id} 
                        `, (err, result) => {
                            err
                                ? console.log(`
                                ======================================================
                                INCORRECT ID NUMBERS WERE ENTERED. PLEASE START AGAIN.
                                ======================================================
                                `)
                            
                                : console.log(`
                                ======================================================
                                          EMPLOYEE ${id} HAS BEEN REMOVED!
                                ======================================================
                                `);
                            
                            startPrompts();
                        });
                });
             
                break;
            
            // 'Remove Role' case
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
                                ======================================================
                                                    REMOVING ROLE
                                ======================================================
                        `); 
                })
                .then(() => {
                    db.query(`SELECT roles.id, roles.title FROM roles`, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                                ======================================================
                                                REFERENCE TABLE ABOVE
                                ======================================================
                                                (Enter role id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'rmvRole',
                            type: 'input',
                            message: 'Which role would you like to remove? (Enter role id number)',
                            validate: rmvRoleInput => validateId(rmvRoleInput)
                        }
                    ]);
                })
                .then(({rmvRole}) => {
                    let id = parseInt(rmvRole);

                    db.query(`
                        DELETE FROM roles 
                        WHERE id = ${id} 
                        `, (err, result) => {
                            err
                                ? console.log(`
                                ======================================================
                                INCORRECT ID NUMBERS WERE ENTERED. PLEASE START AGAIN.
                                ======================================================
                                `)
                            
                                : console.log(`
                                ======================================================
                                            ROLE ${id} HAS BEEN REMOVED!
                                ======================================================
                                `);
                            
                            startPrompts();
                        });
                });
            
                break;

            // 'Remove Department' case
            case 'Remove Department':
                prompt([
                    {
                        name: 'confirmRmvDept',
                        type: 'confirm',
                        message: 'Are you sure you want to remove a department from the database?'
                    }
                ])
                .then(({confirmRmvDept}) => {
                    !confirmRmvDept 
                        ? startPrompts()
                        : console.log(`
                                ======================================================
                                                REMOVING DEPARTMENT
                                ======================================================
                        `); 
                })
                .then(() => {
                    db.query(`SELECT * FROM departments`, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                                ======================================================
                                                REFERENCE TABLE ABOVE
                                ======================================================
                                             (Enter department id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'rmvDept',
                            type: 'input',
                            message: 'Which department would you like to remove? (Enter department id number)',
                            validate: rmvDeptInput => validateId(rmvDeptInput)
                        }
                    ]);
                })
                .then(({rmvDept}) => {
                    let id = parseInt(rmvDept);

                    db.query(`
                        DELETE FROM departments 
                        WHERE id = ${id} 
                        `, (err, result) => {
                            err
                                ? console.log(`
                                ======================================================
                                INCORRECT ID NUMBERS WERE ENTERED. PLEASE START AGAIN.
                                ======================================================
                                `)
                            
                                : console.log(`
                                ======================================================
                                          DEPARTMENT ${id} HAS BEEN REMOVED!
                                ======================================================
                                `);
                            
                            startPrompts();
                        });
                });
            
                break;

            // 'Update Employee Role' case
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
                                ======================================================
                                            UPDATING EMPLOYEE ROLE
                                ======================================================
                        `); 

                    db.query(`SELECT employees.id,
                        concat(employees.last_name, ', ', employees.first_name)
                        AS employee_name
                        FROM employees 
                        ORDER BY employees.last_name
                        `, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                                ======================================================
                                                REFERENCE TABLE ABOVE
                                ======================================================
                                             (Enter employee's id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'updEmpRole',
                            type: 'input',
                            message: "For which employee would you like to update role? (Enter employee's id number)",
                            validate: updEmpRoleInput => validateId(updEmpRoleInput)
                        }
                    ]);
                })
                .then(({updEmpRole}) => {
                    empId = parseInt(updEmpRole);

                    db.query(`SELECT roles.id, roles.title FROM roles`, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                                ======================================================
                                                REFERENCE TABLE ABOVE
                                ======================================================
                                                (Enter role id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'idRole',
                            type: 'input',
                            message: "What is the employee's new role? (Enter role id number)",
                            validate: idRoleInput => validateId(idRoleInput)
                        }
                    ]);
                })
                .then(({idRole}) => {
                    roleId = parseInt(idRole);
                  
                    db.query(`
                        UPDATE employees
                        SET role_id = ${roleId} 
                        WHERE id = ${empId} 
                        `, (err, result) => {
                            err
                                ? console.log(`
                                ======================================================
                                INCORRECT ID NUMBERS WERE ENTERED. PLEASE START AGAIN.
                                ======================================================
                                `)
                            
                                : console.log(`
                                ======================================================
                                        EMPLOYEE ${empId} HAS BEEN UPDATED!
                                ======================================================
                                `);
                            
                            startPrompts();
                        });
                });
            
                break;

            // 'Update Employee Manager' case
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
                                ======================================================
                                        UPDATING EMPLOYEE'S MANAGER
                                ======================================================
                        `); 
                })
                .then(() => {
                    db.query(`SELECT employees.id,
                        concat(employees.last_name, ', ', employees.first_name)
                        AS employee_name
                        FROM employees 
                        ORDER BY employees.last_name
                        `, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                                ======================================================
                                                REFERENCE TABLE ABOVE
                                ======================================================
                                             (Enter employee's id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'updEmpMgr',
                            type: 'input',
                            message: "For which employee would you like to update manager? (Enter employee's id number)",
                            validate: updEmpMgrInput => validateId(updEmpMgrInput)
                        }
                    ]);
                })
                .then(({updEmpMgr}) => {
                    idEmp = parseInt(updEmpMgr);

                    db.query(`SELECT employees.id,
                        concat(employees.last_name, ', ', employees.first_name)
                        AS employee_name
                        FROM employees 
                        ORDER BY employees.last_name
                        `, (err, rows) => {
                        console.table(rows);
                    
                        console.log(`
                                ======================================================
                                               REFERENCE TABLE ABOVE
                                ======================================================
                                            (Enter manager's id number)
                        `);                                                           
                    });

                    return prompt([
                        {
                            name: 'mgrId',
                            type: 'input',
                            message: "Who is the employee's new manager? (Enter manager's id number)",
                            validate: mgrIdInput => validateId(mgrIdInput)
                        }
                    ]);
                })
                .then(({mgrId}) => {
                    idMgr = parseInt(mgrId);
                  
                    db.query(`
                        UPDATE employees
                        SET manager_id = ${idMgr} 
                        WHERE id = ${idEmp} 
                        `, (err, result) => {
                            err
                                ? console.log(`
                                ======================================================
                                INCORRECT ID NUMBERS WERE ENTERED. PLEASE START AGAIN.
                                ======================================================
                                `)
                            
                                : console.log(`
                                ======================================================
                                        EMPLOYEE ${idEmp} HAS BEEN UPDATED!
                                ======================================================
                                `);
                            
                            startPrompts();
                        });
                });
            
                break;
            
            // 'Exit' case
            case 'Exit':
                console.log('GOOD BYE!');
                
                // end database connection and exit app
                db.end();
                break;
                        
        };
    });                
};

module.exports = startPrompts;