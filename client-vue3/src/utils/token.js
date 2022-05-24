import { mapState } from "pinia";
import { useAuthStore } from "@/store/auth";

export default function (config) {
  const getters = mapState(useAuthStore, ["authUser"]);
  const user = getters.authUser();
  if (user && user.token) {
    config.headers["User-Token"] = user.token;
  }
  return config;
}
