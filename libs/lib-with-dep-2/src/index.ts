import { doThing0 } from './functions';
export * from 'lib-with-dep-1';

console.log('update #1663289943262');
console.log(doThing0);

export function myFn2() {
    console.log('myFn2');
}