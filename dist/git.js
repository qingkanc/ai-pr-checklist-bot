import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
export async function getChangedFilesFromGit(root, baseRef) {
    const { stdout } = await execFileAsync('git', ['diff', '--name-only', `${baseRef}...HEAD`], {
        cwd: root
    });
    return stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}
