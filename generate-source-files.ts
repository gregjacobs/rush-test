import dedent from "dedent";
import fse from "fs-extra";

for (let i = 1; i <= 100; i++) {
  // Generate file contents
  let fileContents = ``;
  for (let j = 0; j < 100000; j++) {
    fileContents +=
      dedent`
            export function doThing${j}() {
                console.log('Hi ${i} ${j}');
            }
        ` + "\n";
  }

  // Output the source file
  fse.outputFileSync(`libs/lib-${i}/src/functions.ts`, fileContents);

  // Output a source file with a change
  fse.outputFileSync(
    `libs/lib-${i}/src/index.ts`,
    dedent`
        export * from './functions';

        console.log('update #${Date.now()}');
    `
  );
      
  fse.outputFileSync(
    `libs/lib-${i}/package.json`,
    JSON.stringify(
      {
        name: `lib-${i}`,
        version: "0.0.0",
        scripts: {
          build: "rm -rf dist && tsc -p tsconfig.lib.json",
        },
        devDependencies: {
          typescript: "4.8.3",
          tslib: "2.4.0",
        },
      },
      null,
      4
    )
  );

  fse.outputFileSync(
    `libs/lib-${i}/tsconfig.json`,
    JSON.stringify(
      {
        extends: "../../tsconfig.base.json",
        compilerOptions: {
          module: "commonjs",
          forceConsistentCasingInFileNames: true,
          strict: true,
          noImplicitOverride: true,
          noPropertyAccessFromIndexSignature: true,
          noImplicitReturns: true,
          noFallthroughCasesInSwitch: true,
        },
        files: [],
        include: [],
        references: [
          {
            path: "./tsconfig.lib.json",
          },
          {
            path: "./tsconfig.spec.json",
          },
        ],
      },
      null,
      4
    )
  );

  fse.outputFileSync(
    `libs/lib-${i}/tsconfig.lib.json`,
    JSON.stringify({
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "outDir": "../../dist/out-tsc",
        "declaration": true,
        "types": []
      },
      "include": ["**/*.ts"],
      "exclude": ["jest.config.ts", "**/*.spec.ts", "**/*.test.ts"]
    }, null, 4)
  );

  fse.outputFileSync(
    `libs/lib-${i}/tsconfig.spec.json`,
    JSON.stringify({
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "outDir": "../../dist/out-tsc",
        "module": "commonjs",
        "types": ["jest", "node"]
      },
      "include": ["jest.config.ts", "**/*.test.ts", "**/*.spec.ts", "**/*.d.ts"]
    }, null, 4)
  );
}
