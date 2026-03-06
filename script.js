const ADMIN_PASSWORD = "admin123";
let isAdmin = false;
let selected = null;

// Default teachers with their uploaded photos in the same repo
let defaultTeachers = [
  { name: "Kae P. Dilla", photo: "kae.png", schedule: "schedule.png" },
  { name: "Anna Lea Casela", photo: "anna.png", schedule: "schedule.png" },
  { name: "Azenith Recile", photo: "azenith.png", schedule: "schedule.png" },
  { name: "Laine Veron", photo: "laine.png", schedule: "schedule.png" },
  { name: "Jaime Castro", photo: "jaime.png", schedule: "schedule.png" },
  { name: "Rosavilla Galang Aquino", photo: "rosavilla.png", schedule: "schedule.png" },
  { name: "Reyna Mantala", photo: "reyna.png", schedule: "schedule.png" },
  { name: "Maria Cristina Cuevas", photo: "maria.png", schedule: "schedule.png" }
];

let teachers = JSON.parse(localStorage.getItem("teachers"));
if(!teachers){
    teachers = defaultTeachers;
    saveTeachers();
}

const grid = document.getElementById("teacherGrid");

// Render Grid
function render(){
    grid.innerHTML = "";
    let search = document.getElementById("searchBar").value.toLowerCase();
    teachers.sort((a,b)=>a.name.localeCompare(b.name)).forEach((t,i)=>{
        if(!t.name.toLowerCase().includes(search)) return;
        let div = document.createElement("div");
        div.className = "teacher";
        let imgSrc = t.photo ? t.photo : `https://ui-avatars.com/api/?name=${t.name}&background=random&color=fff`;
        div.innerHTML = `<img src="${imgSrc}" alt="${t.name}"><div class="teacher-name">${t.name}</div>`;
        div.onclick = ()=>openProfile(i);
        grid.appendChild(div);
    });
}

// Local Storage
function saveTeachers(){ localStorage.setItem("teachers",JSON.stringify(teachers)); }

// Admin Login
function loginAdmin(){
    let pass = document.getElementById("adminPass").value;
    if(pass === ADMIN_PASSWORD){
        isAdmin=true;
        document.querySelectorAll(".admin-only").forEach(e=>e.style.display="block");
        document.getElementById("loginModal").style.display="none";
        document.getElementById("adminLoginBtn").style.display="none";
        document.getElementById("logoutBtn").style.display="inline-block";
        document.getElementById("adminPass").value="";
        alert("Admin mode enabled");
    } else alert("Incorrect password");
}
function closeLogin(){document.getElementById("loginModal").style.display="none";}
document.getElementById("logoutBtn").onclick=()=>{
    isAdmin=false;
    document.querySelectorAll(".admin-only").forEach(e=>e.style.display="none");
    document.getElementById("adminLoginBtn").style.display="inline-block";
    document.getElementById("logoutBtn").style.display="none";
};
document.getElementById("adminLoginBtn").onclick=()=>{document.getElementById("loginModal").style.display="flex";};

// Profile
function openProfile(i){
    selected=i;
    document.getElementById("profileModal").style.display="flex";
    document.getElementById("profileName").innerText = teachers[i].name;
    const img = document.getElementById("profilePhoto");
    img.src = teachers[i].photo ? teachers[i].photo : "https://via.placeholder.com/120";
}
function closeProfile(){document.getElementById("profileModal").style.display="none";}

// Change Photo
function changePhoto(){
    const fileInput = document.getElementById("changePhoto");
    const file = fileInput.files[0];
    if(!file) return alert("Select a photo first");
    const reader = new FileReader();
    reader.onload = function(e){
        teachers[selected].photo = e.target.result;
        document.getElementById("profilePhoto").src = e.target.result;
        render(); fileInput.value=null; saveTeachers();
    };
    reader.readAsDataURL(file);
}

// Upload Schedule
function uploadSchedule(){
    const file=document.getElementById("scheduleUpload").files[0];
    if(!file) return alert("No file selected");
    const reader=new FileReader();
    reader.onload=function(e){
        teachers[selected].schedule = e.target.result;
        saveTeachers(); alert("Schedule uploaded");
    };
    reader.readAsDataURL(file);
}

function viewSchedule(){
    const sched = teachers[selected].schedule;
    if(!sched) return alert("No schedule uploaded");
    const viewer = document.getElementById("scheduleViewer");
    viewer.style.display="flex";
    document.getElementById("scheduleFull").src = sched;
}
document.getElementById("scheduleViewer").onclick = ()=>{document.getElementById("scheduleViewer").style.display="none";};

// Add / Edit / Delete
function openAdd(){document.getElementById("addModal").style.display="flex";}
function closeAdd(){document.getElementById("addModal").style.display="none";}
function saveTeacher(){
    const name=document.getElementById("teacherName").value;
    const file=document.getElementById("teacherPhoto").files[0];
    if(!name) return alert("Enter teacher name");
    if(file){
        const reader=new FileReader();
        reader.onload=function(e){
            teachers.push({name:name,photo:e.target.result,schedule:null});
            saveTeachers(); render(); closeAdd();
        };
        reader.readAsDataURL(file);
    } else {
        teachers.push({name:name,photo:null,schedule:null}); saveTeachers(); render(); closeAdd();
    }
}
function editTeacher(){
    let n=prompt("New name:",teachers[selected].name);
    if(n){teachers[selected].name=n; saveTeachers(); render(); document.getElementById("profileName").innerText=n;}
}
function deleteTeacher(){
    if(confirm("Delete this teacher?")){teachers.splice(selected,1); saveTeachers(); render(); closeProfile();}
}

// Search & Clock
document.getElementById("searchBar").oninput=render;
setInterval(()=>{document.getElementById("clock").innerText=new Date().toLocaleString();},1000);

render();
