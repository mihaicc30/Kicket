import VueCookies from "vue-cookies";
import { encryptData, decryptData } from "@/utils/crypto";

import { createRouter, createWebHistory } from "vue-router";
import Auth from "../viewAuth/Auth.vue";
import store from "../store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ----------------------------------------------------------------------------------
    // common path
    {
      path: "/",
      name: "auth",
      // best not to lazy load auth page
      component: Auth,
    },
    // ----------------------------------------------------------------------------------
    // user path
    {
      path: "/dashboard",
      name: "dashboard",
      components: {
        user: () => import("@/viewUser/Dashboard.vue"),
        admin: () => import("@/viewAdmin/Dashboard.vue"),
      },
    },
    {
      path: "/profile",
      name: "profile",
      components: {
        user: () => import("@/viewUser/Profile.vue"),
        admin: () => import("@/viewAdmin/Profile.vue"),
      },
    },
    {
      path: "/tickets",
      name: "tickets",
      components: {
        user: () => import("@/viewUser/Tickets.vue"),
        admin: () => import("@/viewAdmin/Tickets.vue"),
      },
    },
    {
      path: "/users",
      name: "users",
      components: {
        admin: () => import("@/viewAdmin/Users.vue"),
      },
    },
    // ----------------------------------------------------------------------------------
  ],
});

router.beforeEach(async (to, from, next) => {
  try {
    await handleAuthentication(to, next);
  } catch (error) {
    // dont think user will be able to trigger this but just in case
    alert(error);
    next();
  }
});

// checking and revalidating authentication status
async function handleAuthentication(to, next) {
  const cookieName = "_auth";
  const encryptedCookie = VueCookies.get(cookieName);
  const isAuthenticated = store.getters.isAuthenticated;

  // just some optional extra steps in security with a simple device identifier props
  const navigatorInfo = window.navigator;
  const userAgent = JSON.stringify(navigatorInfo.userAgent) || "";
  const deviceMemory = JSON.stringify(navigatorInfo.deviceMemory) || "";
  const hardwareConcurrency = JSON.stringify(navigatorInfo.hardwareConcurrency) || "";
  const webdriver = JSON.stringify(navigatorInfo.webdriver) || "";
  const cookieObtained = new Date().toLocaleDateString("en-GB");
  const deviceIdentifier = userAgent + deviceMemory + hardwareConcurrency + webdriver + cookieObtained;

  // if user navigates to a private path and is not authed
  if (to.name !== "auth" && !isAuthenticated && !encryptedCookie) {
    router.push({ name: "auth" });
    return next();
  }

  // if user has no cookie but is trying to auth and is successfull
  else if (!encryptedCookie && isAuthenticated) {
    const userDetails = JSON.stringify({
      ...store.getters.getUserDetails,
      deviceIdentifier: deviceIdentifier,
      cookieObtained: cookieObtained,
    });
    setEncryptedCookie(cookieName, userDetails);
    return next();
  }

  // if user has cookie, validate cookie and if successful then auth
  else if (encryptedCookie) {
    try {
      console.log("Cookie ! Checking if cookie is valid.");
      if (cookieIsValid(encryptedCookie, cookieName, router, deviceIdentifier, cookieObtained)) {
        handleEncryptedCookie(encryptedCookie);
        return next();
      } else {
        store.dispatch("logout");
        VueCookies.remove("_auth");
        router.push("/");
        return next();
      }
    } catch (error) {
      alert(error);
    }
  }
  next();
}

// helper functions

function cookieIsValid(encryptedCookie, cookieName, router, deviceIdentifier, cookieObtained) {
  try {
    const decryptedData = decryptData(encryptedCookie, import.meta.env.VITE_VUE_SK);
    const parsedData = JSON.parse(decryptedData);

    // check1
    if (!decryptedData || !parsedData) {
      VueCookies.remove(cookieName);
      router.push({ name: "auth" });
      console.log("Cookie data is corrupted.");
      return;
    }

    // check2
    else if (cookieNotBelongsToDevice(deviceIdentifier, parsedData.deviceIdentifier)) {
      console.log("Cookie does not belong to this device or browser.");
      VueCookies.remove(cookieName);
      router.push({ name: "auth" });
      return false;
    }

    // check3
    else if (cookieIsExpired(cookieObtained, parsedData.cookieObtained)) {
      console.log("Cookie is expired.");
      VueCookies.remove(cookieName);
      router.push({ name: "auth" });
      return false;
    }

    // All checks passed, cookie is valid
    console.log("Cookie is valid. Authing user.");
    return true;
  } catch (error) {
    alert(error);
    return false;
  }
}

function cookieIsExpired(todaysDate, cookieObtainedDate) {
  return todaysDate !== cookieObtainedDate;
}

function cookieNotBelongsToDevice(thisDevice, cookieDeviceData) {
  return thisDevice !== cookieDeviceData;
}

function setEncryptedCookie(cookieName, data) {
  const expiryDate = new Date();

  // give cookie 1h to live
  expiryDate.setHours(expiryDate.getHours() + 1);
  const encryptedData = encryptData(data, import.meta.env.VITE_VUE_SK);
  VueCookies.set(cookieName, encryptedData, expiryDate);
}

function handleEncryptedCookie(encryptedCookie) {
  const decryptedData = decryptData(encryptedCookie, import.meta.env.VITE_VUE_SK);
  let parsedData = JSON.parse(decryptedData);
  store.dispatch("cookieLogin", parsedData);
}

export default router;
