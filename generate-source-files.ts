import dedent from 'dedent';
import fse from 'fs-extra';

// Generate 5 packages that rely on each other
for (let i = 1; i <= 5; i++) {
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
                devDependencies: {
                    typescript: '4.8.3',
                    tslib: '2.4.0',
                    ...extraDependencies
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
