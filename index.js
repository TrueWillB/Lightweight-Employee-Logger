import inquirer from "inquirer";

var deptArray = []; //Might use this later for a dynamic department list
const questions = [
  {
    name: "initQuestion",
    type: "list",
    message:
      "Welcome to Lightweight Employee Logger! Please choose an option below",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Update an Employee Role",
      "Exit",
    ],
  },
  {
    name: "addDepartment",
    type: "input",
    message: "What is the name of the department?",
  },
  {
    name: "addRoleName",
    type: "input",
    message: "What is the name of the role?",
  },
  {
    name: "addRoleSalary",
    type: "input",
    message: "What is the salary of the role?",
  },
  {
    name: "addRoleDept",
    type: "input",
    message: "What is the department ID of the role?",
  },
  {
    name: "addEmployeeFirstName",
    type: "input",
    message: "What is the first name of the employee?",
  },
  {
    name: "addEmployeeLastName",
    type: "input",
    message: "What is the last name of the employee?",
  },
  {
    name: "addEmployeeRole",
    type: "input",
    message: "What is the role ID of the employee?",
  },
  {
    name: "addEmployeeManager",
    type: "input",
    message: "What is the manager ID of the employee?",
  },
  {
    name: "updateEmployee",
    type: "input",
    message: "What is the ID of the employee you would like to update?",
  },
];
