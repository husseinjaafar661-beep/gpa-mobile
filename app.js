// عناصر DOM
const coursesDiv = document.getElementById('courses');
const addBtn = document.getElementById('add-course');
const clearBtn = document.getElementById('clear-all');
const gpaSpan = document.getElementById('gpa');
const totalCreditsSpan = document.getElementById('total-credits');

addBtn.addEventListener('click', addCourse);
clearBtn.addEventListener('click', clearAll);

// عند تحميل الصفحة: نعيد استرجاع من localStorage أو نضيف 2 مواد جاهزين
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('gpa_courses_v1');
  if (saved) {
    const arr = JSON.parse(saved);
    arr.forEach(data => addCourse(data));
  } else {
    // مثال: نضيف صفين افتراضياً لتجربة سريعة
    addCourse();
    addCourse();
  }
  calculateGPA();
});

// دالة إضافة مادة جديدة
function addCourse(initial = null) {
  const courseDiv = document.createElement('div');
  courseDiv.className = 'course';

  // قيم افتراضية لو مافيش initial
  const name = initial?.name ?? '';
  const creditsVal = initial?.credits ?? '3';
  const gradeVal = initial?.grade ?? '3';

  courseDiv.innerHTML = `
    <input type="text" class="course-name" placeholder="اسم المادة" value="${escapeHtml(name)}">

    <select class="credits">
      <option value="1">1 ساعة</option>
      <option value="2">2 ساعة</option>
      <option value="3">3 ساعات</option>
      <option value="4">4 ساعات</option>
    </select>

    <select class="grade">
      <option value="4">A</option>
      <option value="3.7">A-</option>
      <option value="3.3">B+</option>
      <option value="3">B</option>
      <option value="2.7">B-</option>
      <option value="2.3">C+</option>
      <option value="2">C</option>
      <option value="1">D</option>
      <option value="0">F</option>
    </select>

    <div class="course-gpa">0.00</div>

    <button class="delete-btn">حذف مادة</button>
  `;

  // اضبط القيم الافتراضية للمحددات
  courseDiv.querySelector('.credits').value = creditsVal;
  courseDiv.querySelector('.grade').value = gradeVal;

  // حدث التغيير لإعادة الحساب
  courseDiv.querySelector('.credits').addEventListener('change', () => {
    calculateGPA();
    saveToLocal();
  });
  courseDiv.querySelector('.grade').addEventListener('change', () => {
    calculateGPA();
    saveToLocal();
  });
  courseDiv.querySelector('.course-name').addEventListener('input', () => {
    saveToLocal();
  });

  // زر الحذف
  courseDiv.querySelector('.delete-btn').addEventListener('click', () => {
    courseDiv.remove();
    calculateGPA();
    saveToLocal();
  });

  coursesDiv.appendChild(courseDiv);
  calculateGPA();
  saveToLocal();
}

// حساب المعدل وعرض نقاط كل مادة
function calculateGPA() {
  let totalPoints = 0;
  let totalCredits = 0;

  const courseElems = document.querySelectorAll('.course');
  courseElems.forEach(course => {
    const credits = parseFloat(course.querySelector('.credits').value) || 0;
    const grade = parseFloat(course.querySelector('.grade').value) || 0;

    const points = credits * grade;
    // عرض نقاط المادة
    course.querySelector('.course-gpa').textContent = points.toFixed(2);

    totalPoints += points;
    totalCredits += credits;
  });

  const gpa = totalCredits ? (totalPoints / totalCredits) : 0;
  gpaSpan.textContent = gpa.toFixed(2);
  totalCreditsSpan.textContent = totalCredits;
}

// مسح كل العناصر
function clearAll() {
  if (!confirm('هل تريد مسح كل المواد؟')) return;
  coursesDiv.innerHTML = '';
  calculateGPA();
  saveToLocal();
}

// حفظ وقراءة من localStorage
function saveToLocal() {
  const arr = [];
  document.querySelectorAll('.course').forEach(course => {
    arr.push({
      name: course.querySelector('.course-name').value || '',
      credits: course.querySelector('.credits').value,
      grade: course.querySelector('.grade').value
    });
  });
  localStorage.setItem('gpa_courses_v1', JSON.stringify(arr));
}

// دالة بسيطة للهروب من الأحرف عند وضع value داخل HTML
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
