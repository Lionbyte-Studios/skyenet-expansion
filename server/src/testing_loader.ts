/*
    This file loads the "testing.ts" file and runs the "run()" function in it, only if the file exists.
    The testing.ts file is used for testing different things without modifying code that would be committed.
*/

import * as fs from "node:fs";

export async function testing_loader() {
    const dirname = __dirname;

    const readDirRes = fs.readdirSync(dirname);
    if(!readDirRes.includes("testing.ts")) return;
    // real
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const testing = await import("./testing");
    testing.run();
}
