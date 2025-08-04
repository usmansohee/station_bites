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
exports.id = "pages/admin";
exports.ids = ["pages/admin"];
exports.modules = {

/***/ "./src/pages/admin/index.js":
/*!**********************************!*\
  !*** ./src/pages/admin/index.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/router */ \"next/router\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_3__);\n\n\nvar _jsxFileName = \"/Users/usmanahmed/Desktop/projects/station_bites/src/pages/admin/index.js\";\n\n\n\n\nfunction Admin() {\n  const router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();\n  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {\n    // Check if admin is logged in\n    const adminSession = localStorage.getItem(\"adminSession\");\n\n    if (adminSession) {\n      try {\n        const sessionData = JSON.parse(adminSession);\n\n        if (new Date(sessionData.expires) > new Date()) {\n          window.location.href = \"/admin/dashboard\";\n        } else {\n          localStorage.removeItem(\"adminSession\");\n          localStorage.removeItem(\"adminSessionId\");\n          window.location.href = \"/admin-login\";\n        }\n      } catch (err) {\n        localStorage.removeItem(\"adminSession\");\n        localStorage.removeItem(\"adminSessionId\");\n        window.location.href = \"/admin-login\";\n      }\n    } else {\n      window.location.href = \"/admin-login\";\n    }\n  }, []);\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_3___default()), {\n      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n        children: \"Station Bites | Admin Panel\"\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 34,\n        columnNumber: 9\n      }, this)\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 33,\n      columnNumber: 7\n    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n      className: \"heightFixAdmin px-6 flex items-center justify-center\",\n      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"max-w-screen-xs mx-auto lg:text-lg xs:text-base text-sm text-center font-medium text-primary-light\",\n        children: [\"Welcome to Admin Panel\", /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"br\", {}, void 0, false, {\n          fileName: _jsxFileName,\n          lineNumber: 39,\n          columnNumber: 11\n        }, this), \"Wait while redirecting to Dashboard\"]\n      }, void 0, true, {\n        fileName: _jsxFileName,\n        lineNumber: 37,\n        columnNumber: 9\n      }, this)\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 36,\n      columnNumber: 7\n    }, this)]\n  }, void 0, true);\n}\n\nAdmin.admin = true;\n/* harmony default export */ __webpack_exports__[\"default\"] = (Admin);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly96aW5nZXIvLi9zcmMvcGFnZXMvYWRtaW4vaW5kZXguanM/ZjRiOCJdLCJuYW1lcyI6WyJBZG1pbiIsInJvdXRlciIsInVzZVJvdXRlciIsInVzZUVmZmVjdCIsImFkbWluU2Vzc2lvbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXNzaW9uRGF0YSIsIkpTT04iLCJwYXJzZSIsIkRhdGUiLCJleHBpcmVzIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwicmVtb3ZlSXRlbSIsImVyciIsImFkbWluIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUEsU0FBU0EsS0FBVCxHQUFpQjtBQUNmLFFBQU1DLE1BQU0sR0FBR0Msc0RBQVMsRUFBeEI7QUFFQUMsa0RBQVMsQ0FBQyxNQUFNO0FBQ2Q7QUFDQSxVQUFNQyxZQUFZLEdBQUdDLFlBQVksQ0FBQ0MsT0FBYixDQUFxQixjQUFyQixDQUFyQjs7QUFDQSxRQUFJRixZQUFKLEVBQWtCO0FBQ2hCLFVBQUk7QUFDRixjQUFNRyxXQUFXLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXTCxZQUFYLENBQXBCOztBQUNBLFlBQUksSUFBSU0sSUFBSixDQUFTSCxXQUFXLENBQUNJLE9BQXJCLElBQWdDLElBQUlELElBQUosRUFBcEMsRUFBZ0Q7QUFDOUNFLGdCQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCLGtCQUF2QjtBQUNELFNBRkQsTUFFTztBQUNMVCxzQkFBWSxDQUFDVSxVQUFiLENBQXdCLGNBQXhCO0FBQ0FWLHNCQUFZLENBQUNVLFVBQWIsQ0FBd0IsZ0JBQXhCO0FBQ0FILGdCQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCLGNBQXZCO0FBQ0Q7QUFDRixPQVRELENBU0UsT0FBT0UsR0FBUCxFQUFZO0FBQ1pYLG9CQUFZLENBQUNVLFVBQWIsQ0FBd0IsY0FBeEI7QUFDQVYsb0JBQVksQ0FBQ1UsVUFBYixDQUF3QixnQkFBeEI7QUFDQUgsY0FBTSxDQUFDQyxRQUFQLENBQWdCQyxJQUFoQixHQUF1QixjQUF2QjtBQUNEO0FBQ0YsS0FmRCxNQWVPO0FBQ0xGLFlBQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBaEIsR0FBdUIsY0FBdkI7QUFDRDtBQUNGLEdBckJRLEVBcUJOLEVBckJNLENBQVQ7QUF1QkEsc0JBQ0U7QUFBQSw0QkFDRSw4REFBQyxrREFBRDtBQUFBLDZCQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQURGLGVBSUU7QUFBSyxlQUFTLEVBQUMsc0RBQWY7QUFBQSw2QkFDRTtBQUFLLGlCQUFTLEVBQUMsb0dBQWY7QUFBQSwwREFFRTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUZGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFKRjtBQUFBLGtCQURGO0FBY0Q7O0FBRURkLEtBQUssQ0FBQ2lCLEtBQU4sR0FBYyxJQUFkO0FBQ0EsK0RBQWVqQixLQUFmIiwiZmlsZSI6Ii4vc3JjL3BhZ2VzL2FkbWluL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSBcIm5leHQvcm91dGVyXCI7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBIZWFkIGZyb20gXCJuZXh0L2hlYWRcIjtcblxuZnVuY3Rpb24gQWRtaW4oKSB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gQ2hlY2sgaWYgYWRtaW4gaXMgbG9nZ2VkIGluXG4gICAgY29uc3QgYWRtaW5TZXNzaW9uID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhZG1pblNlc3Npb25cIik7XG4gICAgaWYgKGFkbWluU2Vzc2lvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbkRhdGEgPSBKU09OLnBhcnNlKGFkbWluU2Vzc2lvbik7XG4gICAgICAgIGlmIChuZXcgRGF0ZShzZXNzaW9uRGF0YS5leHBpcmVzKSA+IG5ldyBEYXRlKCkpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2FkbWluL2Rhc2hib2FyZFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWRtaW5TZXNzaW9uXCIpO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWRtaW5TZXNzaW9uSWRcIik7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9hZG1pbi1sb2dpblwiO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhZG1pblNlc3Npb25cIik7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWRtaW5TZXNzaW9uSWRcIik7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvYWRtaW4tbG9naW5cIjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9hZG1pbi1sb2dpblwiO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxIZWFkPlxuICAgICAgICA8dGl0bGU+U3RhdGlvbiBCaXRlcyB8IEFkbWluIFBhbmVsPC90aXRsZT5cbiAgICAgIDwvSGVhZD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVpZ2h0Rml4QWRtaW4gcHgtNiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LXNjcmVlbi14cyBteC1hdXRvIGxnOnRleHQtbGcgeHM6dGV4dC1iYXNlIHRleHQtc20gdGV4dC1jZW50ZXIgZm9udC1tZWRpdW0gdGV4dC1wcmltYXJ5LWxpZ2h0XCI+XG4gICAgICAgICAgV2VsY29tZSB0byBBZG1pbiBQYW5lbFxuICAgICAgICAgIDxiciAvPlxuICAgICAgICAgIFdhaXQgd2hpbGUgcmVkaXJlY3RpbmcgdG8gRGFzaGJvYXJkXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gICk7XG59XG5cbkFkbWluLmFkbWluID0gdHJ1ZTtcbmV4cG9ydCBkZWZhdWx0IEFkbWluO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/admin/index.js\n");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/head");;

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/router");;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ (function(module) {

"use strict";
module.exports = require("react/jsx-dev-runtime");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__("./src/pages/admin/index.js"));
module.exports = __webpack_exports__;

})();