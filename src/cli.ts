import meow from "meow";
import * as fs from "fs/promises";
import * as path from "path";
import { globby } from "globby";
import { updateNodeVersions } from "./github-actions-node-versions.js";

export const cli = meow(
    `
    Usage
      $ github-actions-node-versions
 
    Options
        --githubDir     path to .github dir (default: {cwd}/.github)
 
    Examples
      $ github-actions-node-versions
`,
    {
        importMeta: import.meta,
        flags: {
            githubDir: {
                type: "string",
                default: path.join(process.cwd(), ".github")
            }
        },
        autoHelp: true,
        autoVersion: true
    }
);

export const run = async (
    _input = cli.input,
    flags = cli.flags
): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    const workflows = await globby(flags.githubDir.split(path.sep).join("/") + "/workflows/*.{yml,yaml}");
    const workflowContents = await Promise.all(
        workflows.map((workflowFilePath) => fs.readFile(workflowFilePath, "utf-8"))
    );
    const transformContents = await Promise.all(
        workflowContents.map((workflowContent) => updateNodeVersions(workflowContent))
    );
    await Promise.all(
        transformContents.map((transformContent, index) => {
            if (transformContent !== workflowContents[index]) {
                return fs.writeFile(workflows[index], transformContent, "utf-8");
            }
            return Promise.resolve();
        })
    );
    return {
        stdout: null,
        stderr: null,
        exitStatus: 0
    };
};
