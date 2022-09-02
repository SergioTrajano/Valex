export function anauthorizedCompanyError() {
    return { type: "invalid_APIKey", message: "anathorized_apikey"}
}

export function notFoundEmployeeError() {
    return { type: "invalid_employee", message: "invalid_employee_id"};
}

export function creationNotAllowedError() {
    return { type: "card_already_exists", message: "card_already_exists"};
}