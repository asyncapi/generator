import Path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { isJsFile } from '.';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

class GetFilesResponse{
    files: string[];
    dirs: string[];
    constructor (files: string[], dirs: string[]) {
        this.files = files;
        this.dirs = dirs;
    }
}

/**
 * Function which finds all the files and dirs in folders
 * @private
 * @param dir directory to find files and dirs in.
 * @param includeSubDirs should the function iterate through subdirectories to search for files and dirs?
 */
export async function getStatsInDir(dir: string){
    const allFiles = await readdir(dir);
    let files: string[] = [];
    let dirs: string[] = [];
    for (const filename of allFiles) {
        const res = Path.resolve(dir, filename);
        const stats = await stat(res);
        if (stats.isDirectory()) {
            dirs.push(res)
        } else if (isJsFile(filename)) {
            files.push(res);
        }
    }
    const resolveFilenameCallback = (filename: string) => {
        return Path.resolve(dir, filename); 
    }
    files = files.map(resolveFilenameCallback);
    dirs = dirs.map(resolveFilenameCallback);
    return new GetFilesResponse(files, dirs);
}
