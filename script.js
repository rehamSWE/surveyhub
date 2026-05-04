// 🔑 رمز التحقق
const correctCode = "12345";

// 📍 إحداثيات حفر الباطن
const allowedLat = 28.4328;
const allowedLng = 45.9706;

// 📏 نصف القطر
const allowedRadius = 10000;

document.addEventListener("DOMContentLoaded", () => {
  // 🔢 يسمح بالأرقام فقط
  const codeInput = document.getElementById("codeInput");

  codeInput.addEventListener("input", () => {
    codeInput.value = codeInput.value.replace(/\D/g, "");
  });

  // 🔘 العناصر
  const button = document.getElementById("checkBtn");
  const message = document.getElementById("message");

  button.addEventListener("click", () => {
    const userCode = codeInput.value.trim(); // 🔥 استخدمناه مباشرة

    // التحقق من الرمز
    if (userCode !== correctCode) {
      message.style.color = "#dc3545";
      message.textContent = "رمز التحقق غير صحيح. يرجى التأكد وإعادة المحاولة.";
      return;
    }

    // 🔥 الرسالة
    message.style.color = "#ffc107";
    message.textContent = "جارٍ تحديد الموقع .. يرجى السماح بالوصول عند الطلب";

    if (!navigator.geolocation) {
      message.style.color = "#dc3545";
      message.textContent = "هذا المتصفح لا يدعم خدمة تحديد الموقع.";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const distance = getDistance(userLat, userLng, allowedLat, allowedLng);

        if (distance <= allowedRadius) {
          message.style.color = "#198754";
          message.textContent = "تم التحقق بنجاح.";

          window.location.href =
            "https://docs.google.com/forms/d/e/1FAIpQLSc7gTrd_dHVri96fGb5t63qB5ZesP4R5_n85YPxqLM54LnO5A/formResponse";
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
            "تعذر الوصول إلى الموقع. يرجى تفعيل خدمة الموقع ثم إعادة المحاولة.";
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
