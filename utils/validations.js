// validation function to return error or true
const userInput = (input, blankError, regex, inputError) => {
    if (!input) {
        return blankError;
    }
    
    if (!regex.test(input)) {
        return inputError;
    }
    
    return true;
};

const validateName = input => {
    let nameBlankError = 'Please enter a name.';
    let nameRegex = /^[a-zA-Z]+$/;
    let nameInputError = 'Please enter letters only.';

    return userInput(input, nameBlankError, nameRegex, nameInputError);
};

const validateId = input => {
    let idRegex = /^[0-9]{1,4}$/;
    let idBlankError = "Please enter an id number.";
    let idInputError = 'Please enter only numbers (Max 4).';
    
    return userInput(input, idBlankError, idRegex, idInputError);
};

const validateSalary = input => {
    let salaryRegex = /^[0-9]{1,10}$/;
    let salaryBlankError = "Please enter an annual salary.";
    let salaryInputError = 'Please enter only numbers (Max 10).';
    
    return userInput(input, salaryBlankError, salaryRegex, salaryInputError);
};

module.exports = { validateName, validateId, validateSalary };