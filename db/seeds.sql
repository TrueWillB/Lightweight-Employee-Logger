INSERT INTO department (name)
VALUES ("Fish Processing"),
       ("Bloviation");

INSERT INTO role (title, salary, department_id)
VALUES ("Fish Descaler", "90000", 1),
("Fish Rescaler", 5000, 1),
("Fish Manager", 200000, 1),
("Talker", 50000, 2),
("Rambler", 80000, 2),
("Bloviation Manager", 350000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bartholomew","Shlorpenheimer", 3, null),
("Janice","Joe-Plain", 2, 1),
("Frederick", "Graniel", 1, 1),
("Maximillian", "von Popoff", 6, null),
("Davonte", "Toksallot", 5, 4),
("Charlene", "Mombler", 4, 4);