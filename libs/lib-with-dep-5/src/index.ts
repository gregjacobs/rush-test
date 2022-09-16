import { doThing0 } from './functions';
export * from 'lib-with-dep-4';

console.log('update #1663299631928');
console.log(doThing0);

export function myFn5() {
    console.log('myFn5');
}