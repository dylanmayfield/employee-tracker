const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { query, response } = require('express');

const connection = mysql.createConnection({


    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

});
function startPrompt() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
            },
        ])
        .then((res) => {
            console.log(res)
            switch (res.action) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    quit();
                    return;
            }



        });

}

function viewAllEmployees() {
    let query = `SELECT 
                e.id,
                e.first_name,
                e.last_name, 
                r.role_title,
                d.department_name,
                r.salary,
                CONCAT(m.first_name, ' ', m.last_name) AS manager_name
            FROM employee e
            INNER JOIN role r ON e.role_id = r.id
            INNER JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id`;

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log('\nAll Employees\n');
        console.table(res);
        startPrompt();
    })
};

function addEmployee() {

    connection.query("SELECT id, role_title FROM role", function (err, role) {
        if (err) throw err;
    
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employee", function (err, manager) {
        if (err) throw err;

    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'What is the employees id?',
        },
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?',
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'What is the employees role?',
            choices: role.map(role => ({ value: role.id, name: role.role_title }))
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Who is the employees manager?',
            choices: manager.map(manager => ({ value: manager.id, name: manager.manager_name }))
        },
    ])
        .then((answers) => {
            connection.query("INSERT INTO employee SET ?",
                {
                    id: answers.id,
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                    role_id: answers.roleId,
                    manager_id: answers.managerId,
                },
                function (err, res) {
                    console.log('employee added');
                    if (err) throw err;
                    console.table(res);
                    startPrompt();
                })
        })
        })
    });
};

function updateEmployeeRole() {

    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee", function (err, employee) {
        if (err) throw err;

        connection.query("SELECT id, role_title FROM role", function (err, role) {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select an employee to update their role:',
                    choices: employee.map(employee => ({ value: employee.id, name: employee.full_name }))
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'What is the employees new role?',
                    choices: role.map(role => ({ value: role.id, name: role.role_title }))
                },
            ])
                .then((res) => {
                    connection.query("UPDATE employee SET ? WHERE ?",
                        [
                            {
                                role_id: res.roleId,
                            },
                            {
                                id: res.employeeId,
                            },
                        ],
                        function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            console.log('employee role updated successfully!')
                            startPrompt();
                        }
                    )
                });
        });
    });
}

function viewAllRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log('\nAll Roles\n');
        console.table(res);
        startPrompt();
    })
}
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'What is the new role id?',
        },
        {
            type: 'input',
            name: 'role_title',
            message: 'What is the new role title?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the new role salary?',
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'What is the new role department id?',
        },
    ])
        .then((res) => {
            connection.query("INSERT INTO role SET ?",
                {
                    id: res.id,
                    role_title: res.role_title,
                    salary: res.salary,
                    department_id: res.departmentId,
                },
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    console.log('role added');
                    startPrompt();
                })
        })
}

function viewAllDepartments() {
    let query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log('\nAll Departments\n');
        console.table(res);
        startPrompt();
    })

}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'What is the new department name?',
        },
    ])
        .then((res) => {
            connection.query("INSERT INTO department SET ?",
                {
                    department_name: res.department_name,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log('department added');
                    console.table(res);
                    startPrompt();
                })
        })
}

function quit() {
    connection.end();
    process.exit();
}


startPrompt();

