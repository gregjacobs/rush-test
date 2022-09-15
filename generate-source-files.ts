import fse from 'fs-extra';

for (let char = 'a'; char !== 'u'; char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    // Generate file contents
    let fileContents = '';
    for (let i = 0; i < 100000; i++) {
        fileContents += `\
export function doThing${i}() {
    console.log('Hi ${char} ${i}4');
}
`;
    }

    // Output the source file
    fse.outputFileSync(`libs/lib-${char}/src/index.ts`, fileContents);

    fse.outputFileSync(`libs/lib-${char}/tsconfig.json`, JSON.stringify({
      extends: '../../tsconfig.base.json',
      compilerOptions: {
        rootDir: './src',
        outDir: './dist'
      }
  }, null, 4));
  fse.outputFileSync(`libs/lib-${char}/package.json`, JSON.stringify({
      name: `lib-${char}`,
      version: '0.0.0',
      scripts: {
        build: 'rm -rf dist && tsc'
      },
      devDependencies: {
        typescript: '4.8.3'
      }
  }, null, 4));
}