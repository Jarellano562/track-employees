USE employeeDB;

-- DEPARTMENTS --
INSERT INTO department (name) VALUES ("Front Office");
INSERT INTO department (name) VALUES ("Back Office");
INSERT INTO department (name) VALUES ("Relationship");

-- ROLES --
INSERT INTO role (title, salary, department_id) VALUES ("RM", 10, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Admin", 20, 2);
INSERT INTO role (title, salary, department_id) VALUES ("MD", 30, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Director", 10, 3);
INSERT INTO role (title, salary, department_id) VALUES ("AVP", 15, 3);


-- EMPLOYEES --
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Nick", "AA", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Pick", "BB", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Lick", "CC", 3, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Sick", "DD", 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kick", "EE", 5, 4);


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;