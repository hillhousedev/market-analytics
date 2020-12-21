// console.log('Hello World!');

console.log("Welcome to graphql server, welcome sola");

// Hot Module Replacement

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => console.log('Module disposed. '));

}