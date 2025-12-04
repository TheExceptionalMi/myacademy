// Frontend interactions and API wiring to PHP backend
const API_BASE = '/backend/public/?path=/api'; // when deploying, adjust to actual base

// Helper
async function postJSON(url, data){
  const res = await fetch(url, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  return res.json();
}

async function getJSON(url, token){
  const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
  const res = await fetch(url, { headers });
  return res.json();
}

// Login form
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const resp = await postJSON('/backend/public/?path=/auth/login', { email, password });
    if(resp.token){
      localStorage.setItem('sms_token', resp.token);
      alert('Login successful');
      window.location.href = '/frontend/admin.html';
    } else {
      alert(resp.message || 'Login failed');
    }
  });
}

// Signup
const signupForm = document.getElementById('signupForm');
if(signupForm){
  signupForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('emailS').value;
    const password = document.getElementById('passwordS').value;
    const role = document.getElementById('role').value;
    const resp = await postJSON('/backend/public/?path=/auth/register', { name, email, password, role });
    if(resp.success){
      alert('Account created. Please login');
      window.location.href = '/frontend/login.html';
    } else {
      alert(resp.message || 'Signup failed');
    }
  });
}

// Form purchase - create payment
const formPurchase = document.getElementById('formPurchase');
if(formPurchase){
  formPurchase.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = document.getElementById('buyerName').value;
    const email = document.getElementById('buyerEmail').value;
    const phone = document.getElementById('buyerPhone').value;
    const token = localStorage.getItem('sms_token');
    const resp = await postJSON('/backend/public/?path=/payments', { amount:2000, currency:'NGN' });
    if(resp.reference){
      alert('Payment initiated. Reference: ' + resp.reference + '\n(Integrate gateway to complete payment)');
    } else alert('Payment failed');
  });
}

// Admin dashboard tabs
document.querySelectorAll('.tablink').forEach(el=>{
  el.addEventListener('click', (e)=>{
    e.preventDefault();
    const tab = el.dataset.tab;
    document.querySelectorAll('.tab').forEach(t=>t.classList.add('hidden'));
    document.getElementById(tab).classList.remove('hidden');
  });
});

// Load students
const loadStudentsBtn = document.getElementById('loadStudents');
if(loadStudentsBtn){
  loadStudentsBtn.addEventListener('click', async ()=>{
    const token = localStorage.getItem('sms_token');
    const data = await getJSON('/backend/public/?path=/students', token);
    const list = document.getElementById('studentsList');
    list.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
  });
}

// Load staff
const loadStaffBtn = document.getElementById('loadStaff');
if(loadStaffBtn){
  loadStaffBtn.addEventListener('click', async ()=>{
    const token = localStorage.getItem('sms_token');
    const data = await getJSON('/backend/public/?path=/staff', token);
    document.getElementById('staffList').innerHTML = '<pre>' + JSON.stringify(data,null,2) + '</pre>';
  });
}

// Save result
const resultForm = document.getElementById('resultForm');
if(resultForm){
  resultForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const payload = {
      student_id: document.getElementById('resStudentId').value,
      term: document.getElementById('resTerm').value,
      subject: document.getElementById('resSubject').value,
      score: parseInt(document.getElementById('resScore').value,10)
    };
    const token = localStorage.getItem('sms_token');
    const resp = await postJSON('/backend/public/?path=/results', payload);
    alert(JSON.stringify(resp));
  });
}
