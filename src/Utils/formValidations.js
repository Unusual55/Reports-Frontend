import { VALID } from "../constants";


/**
 * employeeName validations
 */

export function checkNameEmpty(name){
    return (name.length === 0) ? "Employee name is a mandatory property." : VALID;
}

export function checkNameLength(name){
    return (name.length > 50) ? "Employee name can be no more than 50 characters" : VALID;
}

/**
 * time logic validations
 */

export function checkTimeLogic(start, end){
    if(start.isBefore(end)){
        return VALID;
    }
    return "Start hour must be before end hour";
}