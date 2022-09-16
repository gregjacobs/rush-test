import { doThing0 } from './functions';
export * from 'lib-with-dep-3';

console.log('update #1663300751946');
console.log(doThing0);

export function myFn4() {
    console.log('myFn4');
}