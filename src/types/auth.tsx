export type SessionData = {
    state: string;
}

export type AppToken = {
    token: string,
    iat: Date,
    exp: Date,
}

export type UserLocalSessionData = {
    email: string,
    given_name: string,
    family_name: string,
    picture_link: string,
}