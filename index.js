const inquirer = require("inquirer");
const mysql = require("mysql2");
// Connect to database
//credentials go here:
const db = mysql.createConnection({
  host: "localhost",
  // MySQL username,
  user: "root",
  // MySQL password
  password: "root",
  database: "company_db",
});

//This function handles nearly all of the work
async function init() {
  //These are a series of variables used to properly display and match up the user's input with the correct id
  let roleArray = [];
  let roleNameArray = [];
  let deptArray = [];
  let deptNameArray = [];
  let employeeArray = [];
  let employeeNameArray = [];

  //I decided to use promise objects to control the flow of the program and wait for the proper time to get the SQL data
  //These 3 promises load the data from the tables into variables that can be used later
  let queryPromise = new Promise((resolve, reject) => {
    db.query("SELECT * FROM role", function (err, results) {
      roleArray = results;
      roleNameArray = roleArray.map(
        (role, index) => `${role.title}, id: ${role.id}`
      );
      resolve();
    });
  });
  await queryPromise;
  queryPromise = new Promise((resolve, reject) => {
    db.query("SELECT * FROM department", function (err, results) {
      deptArray = results;
      deptNameArray = deptArray.map(
        (dept, index) => `${dept.name}, id: ${dept.id}`
      );
      resolve();
    });
  });
  await queryPromise;
  queryPromise = new Promise((resolve, reject) => {
    db.query("SELECT * FROM employee", function (err, results) {
      employeeArray = results;
      employeeNameArray = employeeArray.map(
        (employee, index) =>
          `${employee.first_name} ${employee.last_name}, id: ${employee.id}`
      );
      resolve();
    });
  });
  await queryPromise;

  //This is the list of questions used in prompts for the user input
  let questions = [
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
      when: (answers) => answers.initQuestion === "Add a Department",
    },
    {
      name: "addRoleName",
      type: "input",
      message: "What is the name of the role?",
      when: (answers) => answers.initQuestion === "Add a Role",
    },
    {
      name: "addRoleSalary",
      type: "input",
      message: "What is the salary of the role?",
      when: (answers) => answers.initQuestion === "Add a Role",
    },
    {
      name: "addRoleDept",
      type: "list",
      message: "What is the department of the role?",
      when: (answers) => answers.initQuestion === "Add a Role",
      choices: deptNameArray,
    },
    {
      name: "addEmployeeFirstName",
      type: "input",
      message: "What is the first name of the employee?",
      when: (answers) => answers.initQuestion === "Add an Employee",
    },
    {
      name: "addEmployeeLastName",
      type: "input",
      message: "What is the last name of the employee?",
      when: (answers) => answers.initQuestion === "Add an Employee",
    },
    {
      name: "addEmployeeRole",
      type: "list",
      message: "What is the role of the employee?",
      when: (answers) => answers.initQuestion === "Add an Employee",
      choices: roleNameArray,
    },
    {
      name: "addEmployeeManager",
      type: "list",
      message: "Who is the manager of the employee?",
      when: (answers) => answers.initQuestion === "Add an Employee",
      choices: employeeNameArray,
    },
    {
      name: "updateEmployee",
      type: "list",
      message: "What is the name of the employee you would like to update?",
      when: (answers) => answers.initQuestion === "Update an Employee Role",
      choices: employeeNameArray,
    },
    {
      name: "updateEmployeeRole",
      type: "list",
      message: "What is the new role of the employee?",
      when: (answers) => answers.initQuestion === "Update an Employee Role",
      choices: roleNameArray,
    },
  ];

  var answers = await inquirer.prompt(questions);

  //This allows the user to immediately exit
  if (answers.initQuestion !== "Exit") {
    switch (answers.initQuestion) {
      case "View All Departments":
        queryPromise = new Promise((resolve, reject) => {
          db.query("SELECT * FROM department", function (err, results) {
            console.table(results);
            resolve();
          });
        });
        await queryPromise;

        init();
        break;

      //Displays the requested information from roles, joining with department
      case "View All Roles":
        queryPromise = new Promise((resolve, reject) => {
          db.query(
            "SELECT role.id, role.title, role.salary, department.name FROM role JOIN department ON role.department_id = department.id;",
            function (err, results) {
              console.table(results);
              resolve();
            }
          );
        });
        await queryPromise;

        init();
        break;

      case "View All Employees":
        queryPromise = new Promise((resolve, reject) => {
          //This query was made after lots of painstaking research about self joins and lots of trial and error in mysql workbench
          db.query(
            "SELECT e1.id, e1.first_name, e1.last_name, r.title, r.salary, d.name AS department_name, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM employee AS e1 JOIN role AS r ON e1.role_id = r.id JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS e2 ON e1.manager_id = e2.id;",
            function (err, results) {
              console.table(results);
              resolve();
            }
          );
        });
        await queryPromise;
        init();
        break;
      case "Add a Department":
        queryPromise = new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO department (name) VALUES (?)",
            answers.addDepartment,
            function (err, results) {
              console.log("Added Successfully!");
              resolve();
            }
          );
        });
        await queryPromise;
        init();
        break;
      case "Add a Role":
        queryPromise = new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
            [
              answers.addRoleName,
              answers.addRoleSalary,
              deptArray[deptNameArray.indexOf(answers.addRoleDept)].id,
            ],
            function (err, results) {
              console.log("Added Successfully!");
              resolve();
            }
          );
        });
        await queryPromise;
        init();
        break;

      case "Add an Employee":
        queryPromise = new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
            [
              answers.addEmployeeFirstName,
              answers.addEmployeeLastName,
              roleArray[roleNameArray.indexOf(answers.addEmployeeRole)].id,
              employeeArray[
                employeeNameArray.indexOf(answers.addEmployeeManager)
              ].id,
            ],
            function (err, results) {
              console.log("Added Successfully!");
              resolve();
            }
          );
        });
        await queryPromise;
        init();
        break;
      case "Update an Employee Role":
        queryPromise = new Promise((resolve, reject) => {
          db.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [
              roleArray[roleNameArray.indexOf(answers.updateEmployeeRole)].id,
              employeeArray[employeeNameArray.indexOf(answers.updateEmployee)]
                .id,
            ],
            function (err, results) {
              console.log("Updated Successfully!");
              resolve();
            }
          );
        });
        await queryPromise;
        init();
        break;
    }
  } else {
    console.log("Goodbye!");
    //exits processes to escape from loop
    process.exit();
  }
}

init();
