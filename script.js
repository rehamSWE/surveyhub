// 🔑 الكود الصحيح
const correctCode = "12345";

// 📍 إحداثيات حفر الباطن
const allowedLat = 28.4328;
const allowedLng = 45.9706;

// 📏 نصف القطر
const allowedRadius = 10000;

// 🔘 الأزرار
const button = document.getElementById("checkBtn");
const locationBtn = document.getElementById("locationBtn");
const message = document.getElementById("message");


// 🔥 زر تفعيل الموقع
locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    message.style.color = "red";
    message.textContent = "المتصفح لا يدعم تحديد الموقع";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    () => {
      message.style.color = "lightgreen";
      message.textContent = "تم تفعيل الموقع بنجاح ✔";
      locationBtn.style.display = "none";
    },
    () => {
      message.style.color = "red";
      message.innerHTML = `
      📍 لا يمكن تفعيل الموقع <br><br>
      يرجى السماح بالوصول من إعدادات المتصفح <br><br>
      <small>
      لمستخدمي iPhone:<br>
      اضغط على (aA) أعلى الصفحة → إعدادات الموقع → الموقع → سماح
      </small>
      `;
    }
  );
});


// 🔘 زر المتابعة
button.addEventListener("click", () => {
  const userCode = document.getElementById("codeInput").value.trim();

  // تحقق الكود
  if (userCode !== correctCode) {
    message.style.color = "red";
    message.textContent = "رمز التحقق غير صحيح";
    return;
  }

  message.style.color = "#ffd166";
  message.textContent = "يرجى السماح بالوصول للموقع عند الطلب...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const distance = getDistance(userLat, userLng, allowedLat, allowedLng);

      if (distance <= allowedRadius) {
        message.style.color = "lightgreen";
        message.textContent = "تم التحقق بنجاح";

        window.location.href = "https://example.com";
      } else {
        message.style.color = "red";
        message.textContent = "أنت خارج النطاق المسموح";
      }
    },
    (error) => {
      message.style.color = "red";

      if (error.code === 1) {
        message.innerHTML = `
        📍 لا يمكن إتمام التحقق بدون تفعيل الموقع <br><br>
        يرجى السماح بالوصول من إعدادات المتصفح <br><br>
        <small>
        لمستخدمي iPhone:<br>
        اضغط على (aA) أعلى الصفحة → إعدادات الموقع → الموقع → سماح
        </small>
        `;
      } else {
        message.textContent = "تعذر تحديد الموقع";
      }
    }
  );
});


// 📐 حساب المسافة
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2 - lat1) * Math.PI/180;
  const Δλ = (lon2 - lon1) * Math.PI/180;

  const a =
    Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}