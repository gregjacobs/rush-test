import dedent from 'dedent';
import fse from 'fs-extra';

for (let i = 1; i <= 100; i++) {
    // Generate file contents
    let fileContents = ``;
    for (let j = 0; j < 100000; j++) {
        fileContents += dedent`
            export function doThing${j}() {
                console.log('Hi ${i} ${j}');
            }
        ` + '\n';
    }

    // Output the source file
    fse.outputFileSync(`libs/lib-${i}/src/functions.ts`, fileContents);

    // Output a source file with a change
    fse.outputFileSync(`libs/lib-${i}/src/index.ts`, dedent`
        export * from './functions';

        console.log('update #${Date.now()}');
    `);


    fse.outputFileSync(`libs/lib-${i}/tsconfig.json`, JSON.stringify({
        extends: '../../tsconfig.base.json',
        compilerOptions: {
          rootDir: './src',
          outDir: './dist'
        }
    }, null, 4));
    
    fse.outputFileSync(`libs/lib-${i}/package.json`, JSON.stringify({
        name: `lib-${i}`,
        version: '0.0.0',
        scripts: {
          build: 'rm -rf dist && tsc'
        },
        devDependencies: {
          typescript: '4.8.3'
        }
    }, null, 4));
}