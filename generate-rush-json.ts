const arr: any[] = []
for (let i = 1; i <= 100; i++) {
    arr.push({
        packageName: `lib-${i}`,
        projectFolder: `libs/lib-${i}`
    });
}

console.log(JSON.stringify(arr, null, 4));