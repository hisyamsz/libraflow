import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dictionary } from "../src/utils/i18n-dictionary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to extract keys and parameters recursively
function extractNodes(obj: any, currentPath: string = ""): { key: string; params: string[] }[] {
  let results: { key: string; params: string[] }[] = [];

  for (const [k, v] of Object.entries(obj)) {
    const newPath = currentPath ? `${currentPath}.${k}` : k;

    if (v && typeof v === "object" && "id" in v) {
      // This is a translation leaf node
      const idText = (v as any).id as string;
      // Extract {placeholders} using regex
      const matches = idText.match(/\{([a-zA-Z0-9_]+)\}/g);
      const params = matches ? matches.map((m) => m.slice(1, -1)) : [];
      results.push({ key: newPath, params });
    } else if (v && typeof v === "object") {
      // Recurse deeper
      results = results.concat(extractNodes(v, newPath));
    }
  }

  return results;
}

const nodes = extractNodes(dictionary);

let typesOutput = `// FILE INI DI-GENERATE OTOMATIS OLEH scripts/generate-i18n-types.ts
// JANGAN DIEDIT SECARA MANUAL.

/**
 * Union type dari semua path yang tersedia di kamus i18n.
 */
export type TranslationKey =
`;

// Add keys to union
nodes.forEach((node, index) => {
  typesOutput += `  | "${node.key}"${index === nodes.length - 1 ? ";" : ""}\n`;
});

typesOutput += `
/**
 * Tipe parameter wajib berdasarkan placeholder yang ada pada kamus terjemahan.
 */
export type TranslationParams<K extends TranslationKey> =
`;

// Add conditional types for params
nodes.forEach((node) => {
  typesOutput += `  K extends "${node.key}" ? `;
  if (node.params.length === 0) {
    typesOutput += `Record<never, string | number>\n  : `;
  } else {
    const keys = node.params.map(p => `"${p}"`).join(" | ");
    typesOutput += `Record<${keys}, string | number>\n  : `;
  }
});

typesOutput += `never;\n`;

const outputPath = path.resolve(__dirname, "../src/types/i18n-generated.ts");

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, typesOutput, "utf-8");
console.log(`✅ Berhasil men-generate tipe statis i18n ke: ${outputPath}`);
