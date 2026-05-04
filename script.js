// 🔥 النطاق (Polygon)
const polygon = [
  { lat: 28.430263, lng: 45.974300 },
  { lat: 28.431594, lng: 45.983996 },
  { lat: 28.420405, lng: 45.987023 },
  { lat: 28.419397, lng: 45.975896 }
];

document.addEventListener("DOMContentLoaded", () => {

  const button = document.getElementById("checkBtn");
  const message = document.getElementById("message");

  button.addEventListener("click", () => {

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

        // 🔥 التحقق من النطاق
        if (isPointInPolygon(userLat, userLng, polygon)) {
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
      }
    );
  });
});


// 🔥 دالة التحقق داخل النطاق
function isPointInPolygon(lat, lng, polygon) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;

    const intersect =
      ((yi > lng) !== (yj > lng)) &&
      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}