import { AppError } from "../middleware";
function validateEnvVariable(variable, name) {
    if (variable == null || variable === undefined) {
        throw new AppError(500, `Environment variable ${name} is not defined.`);
    }
    return variable;
}
const config = {
    consumerSecret: validateEnvVariable(process.env.consumerSecret, "consumerSecret"),
    consumerKey: validateEnvVariable(process.env.consumerKey, "consumerKey"),
    shortcode: validateEnvVariable(process.env.shortcode, "shortcode"),
    passkey: validateEnvVariable(process.env.passkey, "passkey"),
};
const url = {
    authUrl: validateEnvVariable(process.env.authUrl, "authUrl"),
    stkUrl: validateEnvVariable(process.env.stkUrl, "stkUrl"),
    CallBackURL: validateEnvVariable(process.env.CallBackURL, "CallBackURL"),
    queryUrl: validateEnvVariable(process.env.mpsExpressQueryUrl, "mpsExpressQueryUrl"),
};
export { config, url };
