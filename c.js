// ===== DARK MODE =====
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark')?'dark':'light');
});
if(localStorage.getItem('theme')==='dark'){document.body.classList.add('dark');}

// ===== CGPA CONVERTER =====
const cgpaInput = document.getElementById('cgpaInput');
const cgpaPreset = document.getElementById('cgpaPreset');
const customFormula = document.getElementById('customFormula');
const formulaA = document.getElementById('formulaA');
const formulaB = document.getElementById('formulaB');
const cgpaResult = document.getElementById('cgpaResult');

cgpaPreset.addEventListener('change',()=>{
  customFormula.classList.toggle('hidden', cgpaPreset.value!=='custom');
});

function convertCGPA(){
  let cgpa=parseFloat(cgpaInput.value);
  if(isNaN(cgpa)){cgpaResult.innerText="Enter valid CGPA";return;}
  let a=9.5,b=0;
  switch(cgpaPreset.value){
    case '10': a=9.5;b=0; break;
    case '7': a=14.28;b=0; break;
    case '4': a=23.75;b=0; break;
    case 'custom': a=parseFloat(formulaA.value); b=parseFloat(formulaB.value); break;
  }
  let percent = a*cgpa+b;
  cgpaResult.innerText = `Percentage: ${percent.toFixed(2)}% (Formula: ${a}*CGPA + ${b})`;
  addHistory(`CGPA: ${cgpa} → ${percent.toFixed(2)}%`);
  updateURL({cgpa:cgpa, scale:cgpaPreset.value, a:a, b:b});
}

function copyCGPAResult(){
  navigator.clipboard.writeText(cgpaResult.innerText);
  alert('CGPA result copied!');
}

// ===== UNIT CONVERTER =====
const unitInput = document.getElementById('unitInput');
const unitType = document.getElementById('unitType');
const unitResult = document.getElementById('unitResult');

function convertUnit(){
  let value=parseFloat(unitInput.value);
  if(isNaN(value)){unitResult.innerText="Enter valid number"; return;}
  let result;
  switch(unitType.value){
    case "kmToMiles": result=value*0.621371; break;
    case "milesToKm": result=value/0.621371; break;
    case "cToF": result=(value*9/5)+32; break;
    case "fToC": result=(value-32)*5/9; break;
    case "kgToLbs": result=value*2.20462; break;
    case "lbsToKg": result=value/2.20462; break;
  }
  unitResult.innerText = `Result: ${result.toFixed(2)}`;
  addHistory(`Unit: ${value} → ${result.toFixed(2)}`);
  navigator.clipboard.writeText(unitResult.innerText);
}

// ===== HISTORY =====
const historyList = document.getElementById('historyList');
let history = JSON.parse(localStorage.getItem('history')||'[]');

function addHistory(item){
  history.unshift(item);
  if(history.length>20) history.pop();
  localStorage.setItem('history',JSON.stringify(history));
  renderHistory();
}
function renderHistory(){
  historyList.innerHTML='';
  history.forEach(i=>{
    let li=document.createElement('li'); li.innerText=i; historyList.appendChild(li);
  });
}
function clearHistory(){ history=[]; localStorage.setItem('history',JSON.stringify(history)); renderHistory(); }
renderHistory();

// ===== SHAREABLE URL =====
function updateURL(params){
  const url = new URL(window.location);
  Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));
  window.history.replaceState({}, '', url);
}

// ===== LOAD FROM URL =====
window.addEventListener('load',()=>{
  const params = new URLSearchParams(window.location.search);
  if(params.has('cgpa')){
    cgpaInput.value = params.get('cgpa');
    cgpaPreset.value = params.get('scale')||'10';
    formulaA.value = params.get('a')||9.5;
    formulaB.value = params.get('b')||0;
    convertCGPA();
  }
});
