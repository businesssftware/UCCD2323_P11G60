function setCookie(name, value, minutes) {
  const date = new Date();
  date.setTime(date.getTime() + minutes * 1000 * 60);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

document.addEventListener("DOMContentLoaded", function () {
  const cookiePopup = document.getElementById("cookiePopup");
  const overlay = document.getElementById("overlay");
  const acceptAllBtn = document.getElementById("acceptAllBtn");
  const necessaryBtn = document.getElementById("necessaryBtn");

  if (!getCookie("cookie_consent")) {
    setTimeout(() => {
      cookiePopup.classList.add("show");
      overlay.classList.add("show");
    }, 1000);
  }
  acceptAllBtn.addEventListener("click", function () {
    setCookie("cookie_consent", "all", 5);
    setCookie("analytics_cookies", "true", 5);
    setCookie("marketing_cookies", "true", 5);
    closePopup();
  });
  necessaryBtn.addEventListener("click", function () {
    setCookie("cookie_consent", "necessary", 5);
    setCookie("analytics_cookies", "false", 5);
    setCookie("marketing_cookies", "false", 5);
    closePopup();
  });

  function closePopup() {
    cookiePopup.classList.remove("show");
    overlay.classList.remove("show");
  }
});