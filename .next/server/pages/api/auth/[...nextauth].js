/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function() {
var exports = {};
exports.id = "pages/api/auth/[...nextauth]";
exports.ids = ["pages/api/auth/[...nextauth]"];
exports.modules = {

/***/ "./src/pages/api/auth/[...nextauth].js":
/*!*********************************************!*\
  !*** ./src/pages/api/auth/[...nextauth].js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/google */ \"next-auth/providers/google\");\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _util_mongodb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/mongodb */ \"./src/util/mongodb.js\");\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (next_auth__WEBPACK_IMPORTED_MODULE_0___default()({\n  providers: [next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1___default()({\n    clientId: process.env.GOOGLE_ID,\n    clientSecret: process.env.GOOGLE_SECRET\n  })],\n  callbacks: {\n    async session({\n      session,\n      token\n    }) {\n      try {\n        const {\n          db\n        } = await (0,_util_mongodb__WEBPACK_IMPORTED_MODULE_2__.connectToDatabase)();\n        const admin = await db.collection(\"admins\").findOne({\n          user: session.user.email\n        });\n        session.admin = !!admin;\n        return session;\n      } catch (error) {\n        console.error(\"Session callback error:\", error);\n        session.admin = false;\n        return session;\n      }\n    },\n\n    async jwt({\n      token,\n      user\n    }) {\n      if (user) {\n        token.admin = user.admin;\n      }\n\n      return token;\n    }\n\n  },\n  pages: {\n    signIn: '/admin-login'\n  },\n  secret: process.env.NEXTAUTH_SECRET || \"your-secret-key\",\n  session: {\n    strategy: \"jwt\"\n  }\n}));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly96aW5nZXIvLi9zcmMvcGFnZXMvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS5qcz82M2YwIl0sIm5hbWVzIjpbIk5leHRBdXRoIiwicHJvdmlkZXJzIiwiR29vZ2xlUHJvdmlkZXIiLCJjbGllbnRJZCIsInByb2Nlc3MiLCJlbnYiLCJHT09HTEVfSUQiLCJjbGllbnRTZWNyZXQiLCJHT09HTEVfU0VDUkVUIiwiY2FsbGJhY2tzIiwic2Vzc2lvbiIsInRva2VuIiwiZGIiLCJjb25uZWN0VG9EYXRhYmFzZSIsImFkbWluIiwiY29sbGVjdGlvbiIsImZpbmRPbmUiLCJ1c2VyIiwiZW1haWwiLCJlcnJvciIsImNvbnNvbGUiLCJqd3QiLCJwYWdlcyIsInNpZ25JbiIsInNlY3JldCIsIk5FWFRBVVRIX1NFQ1JFVCIsInN0cmF0ZWd5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQSwrREFBZUEsZ0RBQVEsQ0FBQztBQUN0QkMsV0FBUyxFQUFFLENBQ1RDLGlFQUFjLENBQUM7QUFDYkMsWUFBUSxFQUFFQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsU0FEVDtBQUViQyxnQkFBWSxFQUFFSCxPQUFPLENBQUNDLEdBQVIsQ0FBWUc7QUFGYixHQUFELENBREwsQ0FEVztBQVF0QkMsV0FBUyxFQUFFO0FBQ1QsVUFBTUMsT0FBTixDQUFjO0FBQUVBLGFBQUY7QUFBV0M7QUFBWCxLQUFkLEVBQWtDO0FBQ2hDLFVBQUk7QUFDRixjQUFNO0FBQUVDO0FBQUYsWUFBUyxNQUFNQyxnRUFBaUIsRUFBdEM7QUFDQSxjQUFNQyxLQUFLLEdBQUcsTUFBTUYsRUFBRSxDQUNuQkcsVUFEaUIsQ0FDTixRQURNLEVBRWpCQyxPQUZpQixDQUVUO0FBQUVDLGNBQUksRUFBRVAsT0FBTyxDQUFDTyxJQUFSLENBQWFDO0FBQXJCLFNBRlMsQ0FBcEI7QUFJQVIsZUFBTyxDQUFDSSxLQUFSLEdBQWdCLENBQUMsQ0FBQ0EsS0FBbEI7QUFDQSxlQUFPSixPQUFQO0FBQ0QsT0FSRCxDQVFFLE9BQU9TLEtBQVAsRUFBYztBQUNkQyxlQUFPLENBQUNELEtBQVIsQ0FBYyx5QkFBZCxFQUF5Q0EsS0FBekM7QUFDQVQsZUFBTyxDQUFDSSxLQUFSLEdBQWdCLEtBQWhCO0FBQ0EsZUFBT0osT0FBUDtBQUNEO0FBQ0YsS0FmUTs7QUFnQlQsVUFBTVcsR0FBTixDQUFVO0FBQUVWLFdBQUY7QUFBU007QUFBVCxLQUFWLEVBQTJCO0FBQ3pCLFVBQUlBLElBQUosRUFBVTtBQUNSTixhQUFLLENBQUNHLEtBQU4sR0FBY0csSUFBSSxDQUFDSCxLQUFuQjtBQUNEOztBQUNELGFBQU9ILEtBQVA7QUFDRDs7QUFyQlEsR0FSVztBQWdDdEJXLE9BQUssRUFBRTtBQUNMQyxVQUFNLEVBQUU7QUFESCxHQWhDZTtBQW9DdEJDLFFBQU0sRUFBRXBCLE9BQU8sQ0FBQ0MsR0FBUixDQUFZb0IsZUFBWixJQUErQixpQkFwQ2pCO0FBc0N0QmYsU0FBTyxFQUFFO0FBQ1BnQixZQUFRLEVBQUU7QUFESDtBQXRDYSxDQUFELENBQXZCIiwiZmlsZSI6Ii4vc3JjL3BhZ2VzL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0uanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IEdvb2dsZVByb3ZpZGVyIGZyb20gXCJuZXh0LWF1dGgvcHJvdmlkZXJzL2dvb2dsZVwiO1xuaW1wb3J0IHsgY29ubmVjdFRvRGF0YWJhc2UgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbC9tb25nb2RiXCI7XG5cbmV4cG9ydCBkZWZhdWx0IE5leHRBdXRoKHtcbiAgcHJvdmlkZXJzOiBbXG4gICAgR29vZ2xlUHJvdmlkZXIoe1xuICAgICAgY2xpZW50SWQ6IHByb2Nlc3MuZW52LkdPT0dMRV9JRCxcbiAgICAgIGNsaWVudFNlY3JldDogcHJvY2Vzcy5lbnYuR09PR0xFX1NFQ1JFVCxcbiAgICB9KSxcbiAgXSxcblxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBkYiB9ID0gYXdhaXQgY29ubmVjdFRvRGF0YWJhc2UoKTtcbiAgICAgICAgY29uc3QgYWRtaW4gPSBhd2FpdCBkYlxuICAgICAgICAgIC5jb2xsZWN0aW9uKFwiYWRtaW5zXCIpXG4gICAgICAgICAgLmZpbmRPbmUoeyB1c2VyOiBzZXNzaW9uLnVzZXIuZW1haWwgfSk7XG4gICAgICAgIFxuICAgICAgICBzZXNzaW9uLmFkbWluID0gISFhZG1pbjtcbiAgICAgICAgcmV0dXJuIHNlc3Npb247XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiU2Vzc2lvbiBjYWxsYmFjayBlcnJvcjpcIiwgZXJyb3IpO1xuICAgICAgICBzZXNzaW9uLmFkbWluID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBzZXNzaW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIgfSkge1xuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgdG9rZW4uYWRtaW4gPSB1c2VyLmFkbWluO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH0sXG4gIH0sXG4gIFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogJy9hZG1pbi1sb2dpbicsXG4gIH0sXG4gIFxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCB8fCBcInlvdXItc2VjcmV0LWtleVwiLFxuICBcbiAgc2Vzc2lvbjoge1xuICAgIHN0cmF0ZWd5OiBcImp3dFwiLFxuICB9LFxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/pages/api/auth/[...nextauth].js\n");

/***/ }),

/***/ "./src/util/mongodb.js":
/*!*****************************!*\
  !*** ./src/util/mongodb.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"connectToDatabase\": function() { return /* binding */ connectToDatabase; }\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MONGODB_URI = process.env.MONGODB_URI;\nconst MONGODB_DB = process.env.MONGODB_DB;\n\nif (!MONGODB_URI) {\n  throw new Error(\"Please define the MONGODB_URI environment variable inside .env.local\");\n}\n\nif (!MONGODB_DB) {\n  throw new Error(\"Please define the MONGODB_DB environment variable inside .env.local\");\n}\n/**\n * Global is used here to maintain a cached connection across hot reloads\n * in development. This prevents connections growing exponentially\n * during API Route usage.\n */\n\n\nlet cached = global.mongo;\n\nif (!cached) {\n  cached = global.mongo = {\n    conn: null,\n    promise: null\n  };\n}\n\nasync function connectToDatabase() {\n  if (cached.conn) {\n    return cached.conn;\n  }\n\n  if (!cached.promise) {\n    const opts = {\n      useNewUrlParser: true,\n      useUnifiedTopology: true\n    };\n    cached.promise = mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient.connect(MONGODB_URI, opts).then(client => {\n      return {\n        client,\n        db: client.db(MONGODB_DB)\n      };\n    });\n  }\n\n  cached.conn = await cached.promise;\n  return cached.conn;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly96aW5nZXIvLi9zcmMvdXRpbC9tb25nb2RiLmpzPzA4NDYiXSwibmFtZXMiOlsiTU9OR09EQl9VUkkiLCJwcm9jZXNzIiwiZW52IiwiTU9OR09EQl9EQiIsIkVycm9yIiwiY2FjaGVkIiwiZ2xvYmFsIiwibW9uZ28iLCJjb25uIiwicHJvbWlzZSIsImNvbm5lY3RUb0RhdGFiYXNlIiwib3B0cyIsInVzZU5ld1VybFBhcnNlciIsInVzZVVuaWZpZWRUb3BvbG9neSIsIk1vbmdvQ2xpZW50IiwidGhlbiIsImNsaWVudCIsImRiIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUVBLE1BQU1BLFdBQVcsR0FBR0MsT0FBTyxDQUFDQyxHQUFSLENBQVlGLFdBQWhDO0FBQ0EsTUFBTUcsVUFBVSxHQUFHRixPQUFPLENBQUNDLEdBQVIsQ0FBWUMsVUFBL0I7O0FBRUEsSUFBSSxDQUFDSCxXQUFMLEVBQWtCO0FBQ2hCLFFBQU0sSUFBSUksS0FBSixDQUNKLHNFQURJLENBQU47QUFHRDs7QUFFRCxJQUFJLENBQUNELFVBQUwsRUFBaUI7QUFDZixRQUFNLElBQUlDLEtBQUosQ0FDSixxRUFESSxDQUFOO0FBR0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFJQyxNQUFNLEdBQUdDLE1BQU0sQ0FBQ0MsS0FBcEI7O0FBRUEsSUFBSSxDQUFDRixNQUFMLEVBQWE7QUFDWEEsUUFBTSxHQUFHQyxNQUFNLENBQUNDLEtBQVAsR0FBZTtBQUFFQyxRQUFJLEVBQUUsSUFBUjtBQUFjQyxXQUFPLEVBQUU7QUFBdkIsR0FBeEI7QUFDRDs7QUFFTSxlQUFlQyxpQkFBZixHQUFtQztBQUN4QyxNQUFJTCxNQUFNLENBQUNHLElBQVgsRUFBaUI7QUFDZixXQUFPSCxNQUFNLENBQUNHLElBQWQ7QUFDRDs7QUFFRCxNQUFJLENBQUNILE1BQU0sQ0FBQ0ksT0FBWixFQUFxQjtBQUNuQixVQUFNRSxJQUFJLEdBQUc7QUFDWEMscUJBQWUsRUFBRSxJQUROO0FBRVhDLHdCQUFrQixFQUFFO0FBRlQsS0FBYjtBQUtBUixVQUFNLENBQUNJLE9BQVAsR0FBaUJLLHdEQUFBLENBQW9CZCxXQUFwQixFQUFpQ1csSUFBakMsRUFBdUNJLElBQXZDLENBQTZDQyxNQUFELElBQVk7QUFDdkUsYUFBTztBQUNMQSxjQURLO0FBRUxDLFVBQUUsRUFBRUQsTUFBTSxDQUFDQyxFQUFQLENBQVVkLFVBQVY7QUFGQyxPQUFQO0FBSUQsS0FMZ0IsQ0FBakI7QUFNRDs7QUFDREUsUUFBTSxDQUFDRyxJQUFQLEdBQWMsTUFBTUgsTUFBTSxDQUFDSSxPQUEzQjtBQUNBLFNBQU9KLE1BQU0sQ0FBQ0csSUFBZDtBQUNEIiwiZmlsZSI6Ii4vc3JjL3V0aWwvbW9uZ29kYi5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vbmdvQ2xpZW50IH0gZnJvbSBcIm1vbmdvZGJcIjtcblxuY29uc3QgTU9OR09EQl9VUkkgPSBwcm9jZXNzLmVudi5NT05HT0RCX1VSSTtcbmNvbnN0IE1PTkdPREJfREIgPSBwcm9jZXNzLmVudi5NT05HT0RCX0RCO1xuXG5pZiAoIU1PTkdPREJfVVJJKSB7XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICBcIlBsZWFzZSBkZWZpbmUgdGhlIE1PTkdPREJfVVJJIGVudmlyb25tZW50IHZhcmlhYmxlIGluc2lkZSAuZW52LmxvY2FsXCJcbiAgKTtcbn1cblxuaWYgKCFNT05HT0RCX0RCKSB7XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICBcIlBsZWFzZSBkZWZpbmUgdGhlIE1PTkdPREJfREIgZW52aXJvbm1lbnQgdmFyaWFibGUgaW5zaWRlIC5lbnYubG9jYWxcIlxuICApO1xufVxuXG4vKipcbiAqIEdsb2JhbCBpcyB1c2VkIGhlcmUgdG8gbWFpbnRhaW4gYSBjYWNoZWQgY29ubmVjdGlvbiBhY3Jvc3MgaG90IHJlbG9hZHNcbiAqIGluIGRldmVsb3BtZW50LiBUaGlzIHByZXZlbnRzIGNvbm5lY3Rpb25zIGdyb3dpbmcgZXhwb25lbnRpYWxseVxuICogZHVyaW5nIEFQSSBSb3V0ZSB1c2FnZS5cbiAqL1xubGV0IGNhY2hlZCA9IGdsb2JhbC5tb25nbztcblxuaWYgKCFjYWNoZWQpIHtcbiAgY2FjaGVkID0gZ2xvYmFsLm1vbmdvID0geyBjb25uOiBudWxsLCBwcm9taXNlOiBudWxsIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0VG9EYXRhYmFzZSgpIHtcbiAgaWYgKGNhY2hlZC5jb25uKSB7XG4gICAgcmV0dXJuIGNhY2hlZC5jb25uO1xuICB9XG5cbiAgaWYgKCFjYWNoZWQucHJvbWlzZSkge1xuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICB1c2VOZXdVcmxQYXJzZXI6IHRydWUsXG4gICAgICB1c2VVbmlmaWVkVG9wb2xvZ3k6IHRydWUsXG4gICAgfTtcblxuICAgIGNhY2hlZC5wcm9taXNlID0gTW9uZ29DbGllbnQuY29ubmVjdChNT05HT0RCX1VSSSwgb3B0cykudGhlbigoY2xpZW50KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjbGllbnQsXG4gICAgICAgIGRiOiBjbGllbnQuZGIoTU9OR09EQl9EQiksXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG4gIGNhY2hlZC5jb25uID0gYXdhaXQgY2FjaGVkLnByb21pc2U7XG4gIHJldHVybiBjYWNoZWQuY29ubjtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/util/mongodb.js\n");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ (function(module) {

"use strict";
module.exports = require("mongodb");;

/***/ }),

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ (function(module) {

"use strict";
module.exports = require("next-auth");;

/***/ }),

/***/ "next-auth/providers/google":
/*!*********************************************!*\
  !*** external "next-auth/providers/google" ***!
  \*********************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next-auth/providers/google");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__("./src/pages/api/auth/[...nextauth].js"));
module.exports = __webpack_exports__;

})();