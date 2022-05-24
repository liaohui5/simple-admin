
import { createPinia } from "pinia";
import persistedstate from 'pinia-plugin-persistedstate'

const store = createPinia();

store.use(persistedstate);

export default store;

