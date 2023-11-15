SELECT e.id as employee_id, e.first_name, e.last_name, r.role_title, d.department_name, r.salary
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON e.roleid = r.id
WHERE department d ON r.department_id = d.id;
