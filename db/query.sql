SELECT 
    e.id AS employee_id,
    e.first_name,
    e.last_name, 
    r.id AS role_id,
    r.role_title,
    r.salary,
    d.id AS department_id,
    d.department_name,
    e.manager_id AS manager_employee_id,
    m.first_name AS manager_first_name,
    m.last_name AS manager_last_name
FROM employee e
INNER JOIN role r ON e.role_id = r.id
INNER JOIN department d ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id;