const inquirer = require('inquirer');
const mysql = require('mysql2');


inquirer
    .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        },
        {
        
        }
    ])
    .then((res) => console.log(res)
    );