const arr: any[] = []
for (let char = 'a'; char !== 'u'; char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    arr.push({
        packageName: `lib-${char}`,
        projectFolder: `libs/lib-${char}`
    });
}

console.log(JSON.stringify(arr, null, 4));