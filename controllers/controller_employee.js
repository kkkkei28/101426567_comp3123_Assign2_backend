/**
 * @author: Kei Ishikawa
 */

const Employee = require('../models/employee');

// GETTING ALL EMPLOYEES
// THIS THROWS AN ERROR IF NO EMPLOYEES FOUND
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        if (employees.length === 0) {
            return res.status(404).json({ 
                status: false, 
                message: 'No employees found.' 
            });
        }
        res.status(200).json({ status: true, 
            employees: employees.map(employee => ({
                id: employee._id,         
                firstname: employee.firstname,
                lastname: employee.lastname,
                email: employee.email,
                position: employee.position,
                salary: employee.salary,
                date_of_joining: employee.date_of_joining,
                department: employee.department
            }))
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employees', error: err.message });
    }
};


// CREATING EMPLOYEE
// THROW AN ERROR IF USER IS ALREADY EXISTING
exports.createEmployee = async (req, res) => {
    const { firstname, lastname, email, position, salary, date_of_joining, department } = req.body;

    try {
        const existingEmployee = await Employee.findOne({ firstname, lastname, email });
        if (existingEmployee) {
            return res.status(400).json({
                message: 'Employee with the same name and email already exists.',
                status: false
            });
        }

        const newEmployee = new Employee({ firstname, lastname, email, position, salary, date_of_joining, department });
        const savedEmployee = await newEmployee.save();
        res.status(201).json({message: 'Employee successfully created.', employee_id: savedEmployee._id, status: true});
    } catch (err) {
        res.status(500).json({ 
            message: 'Error creating employee.', 
            error: err.message 
        });
    }
};


// GETTING EMPLOYEE USING THEIR ID
// THROW AN ERROR OF THERE'S NO EMPLOYEE WITH THAT SPECIFIC ID
exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.eid);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.', status: false });
        }
        res.status(200).json({ employee });
    } catch (err) {
        res.status(500).json({ message: 'Error finding the employee.', status: false });
    }
}


// UPDATING AN EMPLOYEE USING THEIR ID
// THROW AN ERROR IF THERE'S NO EMPLOYEE WITH THAT SPECIFIC ID
exports.updateEmployee = async (req, res) => {
    try {
        const originalEmployee = await Employee.findById(req.params.eid);
        if (!originalEmployee) {
            return res.status(404).json({ message: 'Employee not found.', status: false });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.eid, req.body, { new: true });

        const changes = {};
        for (let key in req.body) {
            if (originalEmployee[key] !== updatedEmployee[key]) {
                changes[key] = {
                    before: originalEmployee[key],
                    after: updatedEmployee[key]
                };
            }
        }

        res.status(200).json({ 
            message: 'Employee updated successfully.',
            changedFields: changes,
            updatedEmployee
        });
    } catch (err) {
        res.status(500).json({ message: 'Updating employee failed', error: err.message, status: false });
    }
};


// DELETING AN EMPLOYEE USING THEIR ID
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id); // Use path param instead
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.', status: false });
        }

        await Employee.findByIdAndDelete(req.params.id);
        console.log(`Employee ${employee.firstname} ${employee.lastname} (ID: ${employee._id}) was deleted successfully.`);
        res.status(200).json({ message: 'Employee deleted successfully.', deletedEmployee: employee });
    } catch (err) {
        res.status(500).json({ message: 'Deleting employee failed', error: err.message, status: false });
    }
};



// ADDITIONAL CODES FOR ASSIGNMENT 2:
// SEARCHING AN EMPLOYEE
exports.searchEmployees = async (req, res) => {
    const { department, position } = req.query;

    try {
        console.log("Query Parameters:", { department, position }); // Log query params

        const query = {};
        if (department) query.department = department;
        if (position) query.position = position;

        console.log("Database Query:", query); // Log the query being sent to MongoDB

        const employees = await Employee.find(query);
        console.log("Search Results:", employees); // Log the search results

        if (!employees.length) {
            return res.status(404).json({
                message: 'No employees found matching the criteria.',
                status: false,
            });
        }

        res.status(200).json({ status: true, employees });
    } catch (err) {
        console.error("Error in searchEmployees:", err); // Log any errors
        res.status(500).json({
            message: 'Error finding the employee.',
            error: err.message,
            status: false,
        });
    }
};



