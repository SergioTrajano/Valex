export function anauthorizedCompanyError() {
    return { type: "invalid_APIKey", message: "anathorized_apikey"}
}

export function notFoundError(entity: string) {
    return { type: "invalid_employee", message: `invalid_${entity}_id`};
}

export function creationNotAllowedError() {
    return { type: "card_already_exists", message: "card_already_exists"};
}

export function expirateCardError() {
    return { type: "card_expired", message: "card_already_expired"};
}

export function ActivatedCardError() {
    return { type: "card_is_activated", message: "card_already_activated"};
}

export function invalidCVC() {
    return { type: "invalid_CVC", message: "anathourized_CVC"}
}

export function badPasswordError() {
    return { type: "invalid_password", message: "invalid_password"}
}