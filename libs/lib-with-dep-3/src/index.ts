import { doThing0 } from './functions';
export * from 'lib-with-dep-2';

console.log('update #1663300751683');
console.log(doThing0);

export function myFn3() {
    console.log('myFn3');
}