import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { ServerSettings } from "../types";

const env: string = process.env.NODE_ENV || "development";
const production: boolean = (env === "production");
const development: boolean = !production;

const filename: string = `${ (development) ? ".example" : "" }.env`;
const filepath: string = path.join(process.cwd(), filename);

if (fs.existsSync(filepath)) {
    console.log(`Using ${filename} file to supply environment variables.`);
    dotenv.config({ path: filepath });
}

const settings: ServerSettings = {
    __dirname: __dirname,
    name: process.env.APP_NAME || "default",
    version: process.env.APP_VERSION || "none",
    env,
    production,
    development,
    http: {
        port: Number(process.env.PORT) || 9000,
        https: false
    }
};

console.log("Server Settings:", settings);

export default settings;
