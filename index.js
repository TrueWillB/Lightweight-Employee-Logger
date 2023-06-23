const inquirer = require("inquirer");
const mysql = require("mysql2");
var exitProg = false;
// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "root",
    database: "company_db",
  },
  console.log(`Connected to the classlist_db database.`)
);

// const questions = [
//   {
//     name: "initQuestion",
//     type: "list",
//     message:
//       "Welcome to Lightweight Employee Logger! Please choose an option below",
//     choices: [
//       "View All Departments",
//       "View All Roles",
//       "View All Employees",
//       "Add a Department",
//       "Add a Role",
//       "Add an Employee",
//       "Update an Employee Role",
//       "Exit",
//     ],
//   },
//   {
//     name: "addDepartment",
//     type: "input",
//     message: "What is the name of the department?",
//     when: (answers) => answers.initQuestion === "Add a Department",
//   },
//   {
//     name: "addRoleName",
//     type: "input",
//     message: "What is the name of the role?",
//     when: (answers) => answers.initQuestion === "Add a Role",
//   },
//   {
//     name: "addRoleSalary",
//     type: "input",
//     message: "What is the salary of the role?",
//     when: (answers) => answers.initQuestion === "Add a Role",
//   },
//   {
//     name: "addRoleDept",
//     type: "input",
//     message: "What is the department ID of the role?",
//     when: (answers) => answers.initQuestion === "Add a Role",
//   },
//   {
//     name: "addEmployeeFirstName",
//     type: "input",
//     message: "What is the first name of the employee?",
//     when: (answers) => answers.initQuestion === "Add an Employee",
//   },
//   {
//     name: "addEmployeeLastName",
//     type: "input",
//     message: "What is the last name of the employee?",
//     when: (answers) => answers.initQuestion === "Add an Employee",
//   },
//   {
//     name: "addEmployeeRole",
//     type: "input",
//     message: "What is the role ID of the employee?",
//     when: (answers) => answers.initQuestion === "Add an Employee",
//   },
//   {
//     name: "updateEmployee",
//     type: "input",
//     message: "What is the ID of the employee you would like to update?",
//     when: (answers) => answers.initQuestion === "Update an Employee Role",
//   },
//   {
//     name: "updateEmployeeRole",
//     type: "input",
//     message: "What is the new role ID of the employee?",
//     when: (answers) => answers.initQuestion === "Update an Employee Role",
//   },
// ];

async function init() {
  let roleArray = [];
  let roleNameArray = [];
  let deptArray = [];
  let deptNameArray = [];
  let employeeArray = [];
  let employeeNameArray = [];
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
    },
  ];

  var answers = await inquirer.prompt(questions);

  console.log(answers);
  //This allows the user to immediately exit
  if (answers.initQuestion !== "Exit") {
    switch (answers.initQuestion) {
      case "View All Departments":
        // db.query("SELECT * FROM department").then((results) => {
        //   console.table(results);
        // });
        queryPromise = new Promise((resolve, reject) => {
          db.query("SELECT * FROM department", function (err, results) {
            console.table(results);
            console.log(results);
            resolve();
          });
        });
        await queryPromise;
        // console.log("finished query");
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
        // console.log("finished query");
        init();
        break;

      case "View All Employees":
        queryPromise = new Promise((resolve, reject) => {
          db.query("SELECT * FROM employee", function (err, results) {
            console.table(results);
            resolve();
          });
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
              //   console.log(
              //     `Here's the index returned: ${
              //       deptArray[deptNameArray.indexOf(answers.addRoleDept)].id
              //     }`
              //   );
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
    }
  } else {
    exitProg = true;
    console.log("Goodbye!");
    process.exit();
  }
  //   process.exit();
}
//
//
//
//
//
//
//
//
//
init();
// process.exit();
