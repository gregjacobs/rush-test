import { doThing0 } from './functions';
export * from 'lib-with-dep-1';

console.log('update #1663299631061');
console.log(doThing0);

export function myFn2() {
    console.log('myFn2');
}