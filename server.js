const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { query } = require('express');

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
                break;
        }
    });

function viewAllEmployees() {
    let query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
    })
};

function addEmployee() {
    inquirer.prompt([
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
            type: 'input',
            name: 'roleId',
            message: 'What is the employees role id?',
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'What is the employees manager id?',
        },
    ])
        .then((res) => {
            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: res.firstName,
                    last_name: res.lastName,
                    role_id: res.roleId,
                    manager_id: res.managerId,
                },
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                })
        })
};

function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'What is the employees id?',
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'What is the employees new role id?',
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
                })
        })
};

function viewAllRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
    })
};
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
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
                    title: res.title,
                    salary: res.salary,
                    department_id: res.departmentId,
                },
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                })
        })
};

function viewAllDepartments() {
    let query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
    })

}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the new department name?',
        },
    ])
        .then((res) => {
            connection.query("INSERT INTO department SET ?",
                {
                    name: res.name,
                },
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                })
        })
}

function quit() {
    connection.end();
    process.exit();
}
