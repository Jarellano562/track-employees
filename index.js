const mysql = require("mysql");
const inquirer = require("inquirer");
let cTable = require("console.table");
let Database = require("./asyncdb");
// const util = require("util");

let db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "employeeDB"
});

//VIEWING INFORMATION queries//
// SELECT * FROM department;

async function viewAllDepts() {
    let query = "SELECT * FROM department";
    const rows = await db.query(query);
    console.table(rows);
};

// SELECT * FROM role;

async function viewAllRoles() {
    console.log("");
    let query = "SELECT * FROM role";
    const rows = await db.query(query);
    console.table(rows);
    return rows;
};

// SELECT * FROM employee;

async function viewAllEmployees() {
    console.log("");
    let query = "SELECT * FROM employee";
    const rows = await db.query(query);
    console.table(rows);
};

//DEPARTMENT INFORMATION//
//GETTING ALL DEPARTMENT NAMES//

async function getDeptNames() {
    let query = "SELECT name FROM department";
    const rows = await db.query(query);
    let depts = [];
    for (const row of rows) {
        depts.push(row.name);
    }
    return depts;
};

//FINDS DEPARTMENT BY ID//
async function getDeptId(deptName) {
    let query = "SELECT * FROM department WHERE department.name=?";
    let args = [deptName];
    const rows = await db.query(query, args);
    return rows[0].id;
};

//ADD DEPARTMENT//
async function addDept(deptInfo) {
    const deptName = deptInfo.deptName;
    let query = 'INSERT into department (name) VALUES (?)';
    let args = [deptName];
    const rows = await db.query(query, args);
    console.log(`Added department named ${deptName}`);
};

//PROMPTS FOR NEW DEPARTMENT//
async function getDeptInfo() {
    return inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the new department?",
                name: "deptName"
            }
        ])
};

//ROLE INFORMATION//
//GET ROLES//
async function getRoles() {
    let query = "SELECT title FROM role";
    const rows = await db.query(query);
    let roles = [];
    for (const row of rows) {
        roles.push(row.title);
    }
    return roles;
};

//GETS ROLE BY ID//
async function getRoleId(roleName) {
    let query = "SELECT * FROM role WHERE role.title=?";
    let args = [roleName];
    const rows = await db.query(query, args);
    return rows[0].id;
};

//ADD ROLE//
async function addRole(roleInfo) {
    const deptId = await getDeptId(roleInfo.deptName);
    const salary = roleInfo.salary;
    const title = roleInfo.roleName;
    let query = 'INSERT into role (title, salary, department_id) VALUES (?,?,?)';
    let args = [title, salary, deptId];
    const rows = await db.query(query, args);
    console.log(`Added role ${title}`);
};

//PROMPTS FOR WHEN NEW ROLE IS ADDED//
async function getRoleInfo() {
    const depts = await getDeptNames();
    return inquirer
        .prompt([
            {
                type: "input",
                message: "What is the title of the new role?",
                name: "roleName"
            },
            {
                type: "input",
                message: "What is the salary of the new role?",
                name: "salary"
            },
            {
                type: "list",
                message: "Which department uses this role?",
                name: "deptName",
                choices: [
                    ...depts
                ]
            }
        ])
};

//EMPLOYEE INFORMATION//
//FIND EMPLOYEES BY ID AND FULL NAME//
async function getEmpId(fullName) {
    let employee = getFullName(fullName);

    let query = 'SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?';
    let args = [employee[0], employee[1]];
    const rows = await db.query(query, args);
    return rows[0].id;
};

//OBTAINS FULL NAME OF EMPLOYEES, SPLITS IF FIRST NAME IS TWO NAMES//
function getFullName(fullName) {
    let employee = fullName.split(" ");
    if (employee.length == 2) {
        return employee;
    }

    const last_name = employee[employee.length - 1];
    let first_name = " ";
    for (let i = 0; i < employee.length - 1; i++) {
        first_name = first_name + employee[i] + " ";
    }
    return [first_name.trim(), last_name];
};

//GETS NAMES OF EMPLOYEES WHO DO NOT HAVE A MANAGER//
async function getManagerNames() {
    let query = "SELECT * FROM employee WHERE manager_id IS NULL";

    const rows = await db.query(query);
    let employeeNames = [];
    for (const employee of rows) {
        employeeNames.push(employee.first_name + " " + employee.last_name);
    }
    return employeeNames;
};

//ADDING NEW EMPLOYEE//
async function addEmployee(employeeInfo) {
    let roleId = await getRoleId(employeeInfo.role);
    let managerId = await getEmpId(employeeInfo.manager);

    let query = "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
    let args = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];
    const rows = await db.query(query, args);
    console.log(`Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`);
};

//PROMPTS FOR WHEN NEW EMPLOYEE IS ADDED//
async function addEmployeeInfo() {
    const managers = await getManagerNames();
    const roles = await getRoles();
    return inquirer
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "role",
                choices: [
                    ...roles
                ]
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "manager",
                choices: [
                    ...managers
                ]
            }
        ])
};

//MAIN QUESTIONS//
async function mainPrompt() {
    return inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "action",
                choices: [
                    "View All Employees",
                    "View All Departments",
                    "View All Roles",
                    "Add a Department",
                    "Add a Role",
                    "Add an Employee",
                    "Exit"
                ]
            }
        ])
};

async function mainQuestions() {
    let exitLoop = false;
    while (!exitLoop) {
        const prompt = await mainPrompt();
        switch (prompt.action) {
            case 'View All Employees': {
                await viewAllEmployees();
                break;
            }
            case 'View All Departments': {
                await viewAllDepts();
                break;
            }
            case 'View All Roles': {
                await viewAllRoles();
                break;
            }
            case 'Add a Department': {
                const newDeptName = await getDeptInfo();
                await addDept(newDeptName);
                break;
            }
            case 'Add a Role': {
                const newRole = await getRoleInfo();
                console.log("add a role");
                await addRole(newRole);
                break;
            }
            case 'Add an Employee': {
                const newEmployee = await addEmployeeInfo();
                await addEmployee(newEmployee);
                break;
            }
            case 'Exit': {
                exitLoop = true;
                process.exit(0);
                // return;
            }
            default:
                console.log(`Error: ${prompt.action}`);
        };
    };
};

mainQuestions();