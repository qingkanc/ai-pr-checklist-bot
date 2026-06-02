#!/usr/bin/env node
export interface CliOptions {
    root: string;
    base: string;
    files: string[];
    output?: string;
}
export declare function parseArgs(argv: string[], env?: NodeJS.ProcessEnv, cwd?: string): CliOptions | {
    help: true;
} | {
    version: true;
};
