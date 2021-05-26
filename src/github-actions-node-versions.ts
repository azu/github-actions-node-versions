import YAML, { Pair } from "yaml";
// @ts-ignore
import alias from "node-version-alias";
import semver from "semver";

const major = (version: string): number => {
    const parse = semver.parse(version);
    if (!parse || !parse.major) {
        throw new Error("Can not parse");
    }
    return parse.major;
};
type YAMLString = string;
export const updateNodeVersions = async (yamlString: YAMLString): Promise<YAMLString> => {
    const doc = YAML.parseDocument(yamlString);
    const active = major(await alias("stable"));
    const currentLts = major(await alias("lts"));
    const previousLts = major(await alias("lts/-2"));
    const versions = (() => {
        // active is lts
        if (active === currentLts) {
            return [currentLts, previousLts];
        }
        if (active % 2 !== 0) {
            // remove unstable active
            return [currentLts, previousLts];
        }
        return [active, currentLts, previousLts];
    })().sort();
    let result = yamlString;
    YAML.visit(doc, {
        Pair(_, pair) {
            if ((pair.key as any).value !== "matrix") {
                return;
            }
            const value = pair.value as { items: Pair[] };
            const nodePair = value.items.find((item) => {
                const value = (item.key as any).value;
                return value === "node" || value === "node_version" || value === "node-version";
            });
            if (!nodePair) {
                return;
            }
            const valueNode = nodePair.value as { items: any[]; range: [number, number, number] };
            if (valueNode.items.length < 2) {
                return; // should be matrix
            }
            const startIndex = valueNode.range[0];
            const endIndex = valueNode.range[1];
            result = result.slice(0, startIndex) + `[ ${versions.join(", ")} ]` + result.slice(endIndex);
        }
    });
    return result;
};
