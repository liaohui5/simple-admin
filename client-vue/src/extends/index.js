// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// + 全局扩展(全局 filter directive component)
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import Vue from "vue";
import * as filters from "./filters";
import * as directives from "./directives";

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]);
});
