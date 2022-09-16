import dedent from 'dedent';
import fse from 'fs-extra';

// Generate 10 packages that rely on each other
for (let i = 1; i <= 10; i++) {
    // Generate file contents
    let fileContents = ``;
    for (let j = 0; j < 100000; j++) {
        fileContents +=
            dedent`
                export function doThing${j}() {
                    console.log('Hi ${i} ${j}');
                }
            ` + '\n';
    }

    // Output the source file
    fse.outputFileSync(`libs/lib-with-dep-${i}/src/functions.ts`, fileContents);

    // Output a source file with a change
    fse.outputFileSync(
        `libs/lib-with-dep-${i}/src/index.ts`,
        dedent`
            import { doThing0 } from './functions';
            ${i === 1 ? '' : `export * from 'lib-with-dep-${i - 1}';`}

            console.log('update #${Date.now()}');
            console.log(doThing0);

            export function myFn${i}() {
                console.log('myFn${i}');
            }
        `
    );

    if (i === 1) {
        generateSupportFiles(`lib-with-dep-${i}`);
    } else {
        generateSupportFiles(`lib-with-dep-${i}`, {
            [`lib-with-dep-${i - 1}`]: "workspace:*"
        });
    }
}

for (let i = 1; i <= 100; i++) {
    // Generate file contents
    // let fileContents = ``;
    // for (let j = 0; j < 100000; j++) {
    //     fileContents +=
    //         dedent`
    //             export function doThing${j}() {
    //                 console.log('Hi ${i} ${j}');
    //             }
    //         ` + '\n';
    // }

    // // Output the source file
    // fse.outputFileSync(`libs/lib-${i}/src/functions.ts`, fileContents);

    // // Output a source file with a change
    // fse.outputFileSync(
    //     `libs/lib-${i}/src/index.ts`,
    //     dedent`
    //     export * from './functions';

    //     console.log('update #${Date.now()}');
    // `
    // );

    generateSupportFiles(`lib-${i}`);
}

/**
 * Generates package.json, tsconfig.json, tsconfig.lib.json, and tsconfig.spec.json
 */
function generateSupportFiles(libName: string, extraDependencies: {[key: string]: string} = {}) {
    fse.outputFileSync(
        `libs/${libName}/package.json`,
        JSON.stringify(
            {
                name: libName,
                version: '0.0.0-LOCAL',
                scripts: {
                    build: 'rm -rf dist && tsc -p tsconfig.lib.json',
                },
                main: "./dist/index.js",
                typings: "./dist/index.d.ts",

                // Note: same dependency list as Nx repo
                devDependencies: {
                    typescript: '4.8.3',
                    tslib: '2.4.0',
                    "@types/dedent": "^0.7.0",
                    "@types/fs-extra": "^9.0.13",
                    "core-js": "^3.6.5",
                    "dedent": "^0.7.0",
                    "fs-extra": "^10.1.0",
                    "react": "18.2.0",
                    "react-dom": "18.2.0",
                    "regenerator-runtime": "0.13.7",
                    "@nrwl/cli": "14.6.5",
                    "@nrwl/cypress": "14.6.5",
                    "@nrwl/eslint-plugin-nx": "14.6.5",
                    "@nrwl/jest": "14.6.5",
                    "@nrwl/linter": "14.6.5",
                    "@nrwl/nx-cloud": "latest",
                    "@nrwl/react": "14.6.5",
                    "@nrwl/web": "14.6.5",
                    "@nrwl/workspace": "14.6.5",
                    "@testing-library/react": "13.3.0",
                    "@types/jest": "28.1.1",
                    "@types/node": "16.11.7",
                    "@types/react": "18.0.18",
                    "@types/react-dom": "18.0.6",
                    "@typescript-eslint/eslint-plugin": "~5.33.1",
                    "@typescript-eslint/parser": "~5.33.1",
                    "babel-jest": "28.1.1",
                    "cypress": "^10.2.0",
                    "eslint": "~8.15.0",
                    "eslint-config-prettier": "8.1.0",
                    "eslint-plugin-cypress": "^2.10.3",
                    "eslint-plugin-import": "2.26.0",
                    "eslint-plugin-jsx-a11y": "6.6.1",
                    "eslint-plugin-react": "7.31.1",
                    "eslint-plugin-react-hooks": "4.6.0",
                    "jest": "28.1.1",
                    "jest-environment-jsdom": "28.1.1",
                    "nx": "14.6.5",
                    "prettier": "^2.6.2",
                    "react-test-renderer": "18.2.0",
                    "ts-jest": "28.0.5",
                    "ts-node": "10.9.1",
                    ...extraDependencies,
                },
            },
            null,
            4
        )
    );

    fse.outputFileSync(
        `libs/${libName}/tsconfig.json`,
        JSON.stringify(
            {
                extends: '../../tsconfig.base.json',
                compilerOptions: {
                    module: 'commonjs',
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
                        path: './tsconfig.lib.json',
                    },
                    {
                        path: './tsconfig.spec.json',
                    },
                ],
            },
            null,
            4
        )
    );

    fse.outputFileSync(
        `libs/${libName}/tsconfig.lib.json`,
        JSON.stringify(
            {
                extends: './tsconfig.json',
                compilerOptions: {
                    rootDir: './src',
                    outDir: './dist',
                    declaration: true,
                    types: [],
                },
                include: ['**/*.ts'],
                exclude: ['jest.config.ts', '**/*.spec.ts', '**/*.test.ts'],
            },
            null,
            4
        )
    );

    fse.outputFileSync(
        `libs/${libName}/tsconfig.spec.json`,
        JSON.stringify(
            {
                extends: './tsconfig.json',
                compilerOptions: {
                    rootDir: './src',
                    outDir: './dist',
                    module: 'commonjs',
                    types: ['jest', 'node'],
                },
                include: ['jest.config.ts', '**/*.test.ts', '**/*.spec.ts', '**/*.d.ts'],
            },
            null,
            4
        )
    );
}
