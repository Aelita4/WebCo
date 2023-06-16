import chalk from "chalk"

function getTypeColor(type: string | null) {
    let typeColor = chalk.magentaBright;

    if(type === "WEB") typeColor = chalk.greenBright;
    if(type === "DB") typeColor = chalk.blueBright;
    if(type === "ERR") typeColor = chalk.redBright;

    return typeColor;
}

function getExtraColor(extra: string | null) {
    let extraColor = chalk.magenta;

    if(extra === "Request") extraColor = chalk.yellow;
    if(extra === "Route") extraColor = chalk.blue;
    if(extra === "Server") extraColor = chalk.blue;
    if(extra === "Login") extraColor = chalk.cyan;
    
    if(extra === "Query") extraColor = chalk.blue;
    if(extra === "Create") extraColor = chalk.green;
    if(extra === "Get") extraColor = chalk.blue;
    if(extra === "Delete") extraColor = chalk.red;
    if(extra === "Change") extraColor = chalk.yellow;

    return extraColor;
}

export default async function(type: string | null, extra: string | null, msg: string) {
    if(type === null || extra === null) console.log(`[${chalk.cyanBright(process.uptime().toFixed(6))}] ${msg}`);
    else {
        let typeColor = getTypeColor(type);
        let extraColor = getExtraColor(extra);

        console.log(`[${chalk.cyanBright(process.uptime().toFixed(6))}] [${typeColor(type)}/${extraColor(extra)}] ${msg}`);
    }
}