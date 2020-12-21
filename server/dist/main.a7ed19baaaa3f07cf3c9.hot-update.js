exports.id = "main";
exports.modules = {

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
var resolvers_1 = __importDefault(__webpack_require__(/*! ./resolvers */ "./src/resolvers.ts"));
var type_defs_1 = __importDefault(__webpack_require__(/*! ./type-defs */ "./src/type-defs.ts"));
var server = new apollo_server_1.ApolloServer({ resolvers: resolvers_1.default, typeDefs: type_defs_1.default });
server.listen()
    .then(function (_a) {
    var url = _a.url;
    return console.log("Server ready at " + url + ". ");
});
if (true) {
    module.hot.accept();
    module.hot.dispose(function () { return console.log('Module disposed. '); });
}


/***/ }),

/***/ "./src/resolvers.ts":
/*!**************************!*\
  !*** ./src/resolvers.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Query: {
        numberSixTwo: function () {
            return 6 * 2;
        },
        serverName: function () {
            return "The server name is sola's server";
        }
    },
};


/***/ })

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzb2x2ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBLDRDQUE0QztBQUM1QztBQUNBLDhDQUE4QyxjQUFjO0FBQzVELHNCQUFzQixtQkFBTyxDQUFDLG9DQUFlO0FBQzdDLGtDQUFrQyxtQkFBTyxDQUFDLHVDQUFhO0FBQ3ZELGtDQUFrQyxtQkFBTyxDQUFDLHVDQUFhO0FBQ3ZELCtDQUErQyxnRUFBZ0U7QUFDL0c7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsSUFBSSxJQUFVO0FBQ2Q7QUFDQSxvQ0FBb0MseUNBQXlDLEVBQUU7QUFDL0U7Ozs7Ozs7Ozs7Ozs7QUNqQmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wiLCJmaWxlIjoibWFpbi5hN2VkMTliYWFhYTNmMDdjZjNjOS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgYXBvbGxvX3NlcnZlcl8xID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXJcIik7XG52YXIgcmVzb2x2ZXJzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVzb2x2ZXJzXCIpKTtcbnZhciB0eXBlX2RlZnNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi90eXBlLWRlZnNcIikpO1xudmFyIHNlcnZlciA9IG5ldyBhcG9sbG9fc2VydmVyXzEuQXBvbGxvU2VydmVyKHsgcmVzb2x2ZXJzOiByZXNvbHZlcnNfMS5kZWZhdWx0LCB0eXBlRGVmczogdHlwZV9kZWZzXzEuZGVmYXVsdCB9KTtcbnNlcnZlci5saXN0ZW4oKVxuICAgIC50aGVuKGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciB1cmwgPSBfYS51cmw7XG4gICAgcmV0dXJuIGNvbnNvbGUubG9nKFwiU2VydmVyIHJlYWR5IGF0IFwiICsgdXJsICsgXCIuIFwiKTtcbn0pO1xuaWYgKG1vZHVsZS5ob3QpIHtcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xuICAgIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbiAoKSB7IHJldHVybiBjb25zb2xlLmxvZygnTW9kdWxlIGRpc3Bvc2VkLiAnKTsgfSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgICBRdWVyeToge1xuICAgICAgICBudW1iZXJTaXhUd286IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiA2ICogMjtcbiAgICAgICAgfSxcbiAgICAgICAgc2VydmVyTmFtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiVGhlIHNlcnZlciBuYW1lIGlzIHNvbGEncyBzZXJ2ZXJcIjtcbiAgICAgICAgfVxuICAgIH0sXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==