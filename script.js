// 🔑 رمز التحقق
const correctCode = "12345";

// 📍 إحداثيات حفر الباطن
const allowedLat = 28.4328;
const allowedLng = 45.9706;

// 📏 نصف القطر
const allowedRadius = 10000;

// 🔘 العناصر
const button = document.getElementById("checkBtn");
const message = document.getElementById("message");

button.addEventListener("click", () => {
  const userCode = document.getElementById("codeInput").value.trim();

  // 1️⃣ التحقق من الرمز
  if (userCode !== correctCode) {
    message.style.color = "#dc3545";
    message.textContent = "رمز التحقق غير صحيح. يرجى التأكد وإعادة المحاولة.";
    return;
  }

  message.style.color = "#ffc107";
  message.textContent = "جارٍ التحقق من الموقع...";

  // 2️⃣ التحقق من دعم الموقع
  if (!navigator.geolocation) {
    message.style.color = "#dc3545";
    message.textContent = "هذا المتصفح لا يدعم خدمة تحديد الموقع.";
    return;
  }

  // 3️⃣ طلب الموقع
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const distance = getDistance(userLat, userLng, allowedLat, allowedLng);

      if (distance <= allowedRadius) {
        message.style.color = "#198754";
        message.textContent = "تم التحقق بنجاح.";

        window.location.href = "https://example.com";
      } else {
        message.style.color = "#dc3545";
        message.textContent =
          "عذرًا، الوصول متاح فقط ضمن النطاق الجغرافي المحدد.";
      }
    },
    (error) => {
      message.style.color = "#dc3545";

      if (error.code === 1) {
        message.textContent =
          "تعذر الوصول إلى الموقع. يرجى التأكد من تفعيل خدمة الموقع ثم إعادة المحاولة.";
      } else if (error.code === 2) {
        message.textContent = "تعذر تحديد الموقع. يرجى المحاولة لاحقًا.";
      } else {
        message.textContent = "حدث خطأ أثناء تحديد الموقع.";
      }
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
    },
  );
});

// 📐 حساب المسافة
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
