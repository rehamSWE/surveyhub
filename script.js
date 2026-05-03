// 🔑 الكود الصحيح
const correctCode = "12345";

// 📍 إحداثيات حفر الباطن
const allowedLat = 28.4328;
const allowedLng = 45.9706;

// 📏 نصف القطر
const allowedRadius = 10000;

// 🔘 زر المتابعة
const button = document.getElementById("checkBtn");
const message = document.getElementById("message");

button.addEventListener("click", () => {
  const userCode = document.getElementById("codeInput").value.trim();

  // تحقق الكود
  if (userCode !== correctCode) {
    message.style.color = "red";
    message.textContent = "رمز التحقق غير صحيح";
    return;
  }

  message.style.color = "yellow";
  message.textContent = "جاري تحديد الموقع...";

  // 🔥 الطلب المباشر (مهم جدًا)
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
        message.textContent = "📍 تأكد من تفعيل الموقع من إعدادات Safari";
      } else {
        message.textContent = "تعذر تحديد الموقع";
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
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