SELECT employee.last_name AS employee, role.role_title AS role, department.department_name AS department, role.salary AS salary
LEFT JOIN department ON role.department_id = department.id
ON employee.role_id = role.id
ORDER BY employee.id;
