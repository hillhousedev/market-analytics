// console.log('Hello World!');

console.log("Welcome to graphql server");

// Hot Module Replacement

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => console.log('Module disposed. '));
    
}