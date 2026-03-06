const ADMIN_PASSWORD = "admin123";
let isAdmin = false;
let selected = null;

let defaultTeachers = [
"Kae P. Dilla","Anna Lea Casela","Azenith Recile","Laine Veron",
"Jaime Castro","Rosavilla Galang Aquino","Reyna Mantala","Maria Cristina Cuevas"
];

let teachers = JSON.parse(localStorage.getItem("teachers"));
if(!teachers){
    teachers = defaultTeachers.map(name=>({name:name,photo:null,schedule:null}));
    saveTeachers();
}

const grid=document.getElementById("teacherGrid");

// --- RENDER GRID ---
function render(){
    grid.innerHTML="";
    let search=document.getElementById("searchBar").value.toLowerCase();

    teachers.sort((a,b)=>a.name.localeCompare(b.name)).forEach((t,i)=>{
        if(!t.name.toLowerCase().includes(search)) return;
        let div=document.createElement("div");
        div.className="teacher";
        let initials=t.name.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0,2);
        let imgSrc=t.photo ? t.photo : `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff`;
        div.innerHTML=`<img src="${imgSrc}" alt="${t.name}"><div class="teacher-name">${t.name}</div>`;
        div.onclick=()=>openProfile(i);
        grid.appendChild(div);
    });
}

// --- LOCAL STORAGE ---
function saveTeachers(){
    localStorage.setItem("teachers",JSON.stringify(teachers));
}

// --- ADMIN LOGIN ---
function loginAdmin(){
    let pass=document.getElementById("adminPass").value;
    if(pass===ADMIN_PASSWORD){
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

// --- PROFILE ---
function openProfile(i){
    selected=i;
    document.getElementById("profileModal").style.display="flex";
    document.getElementById("profileName").innerText=teachers[i].name;
    const img=document.getElementById("profilePhoto");
    img.src="";
    img.src=teachers[i].photo ? teachers[i].photo : "https://via.placeholder.com/120";
}
function closeProfile(){document.getElementById("profileModal").style.display="none";}

// --- CHANGE PHOTO ---
function changePhoto(){
    const fileInput=document.getElementById("changePhoto");
    const file=fileInput.files[0];
    if(!file) return alert("Select a photo first");

    const reader=new FileReader();
    reader.onload=function(e){
        teachers[selected].photo=e.target.result;
        const img=document.getElementById("profilePhoto");
        img.src=""; img.src=e.target.result;
        render();
        fileInput.value=null;
        try{saveTeachers();} catch(e){alert("Photo too large.");}
    };
    reader.readAsDataURL(file);
}

// --- SCHEDULE ---
function uploadSchedule(){
    const file=document.getElementById("scheduleUpload").files[0];
    if(!file) return alert("No file selected");
    const reader=new FileReader();
    reader.onload=function(e){
        teachers[selected].schedule=e.target.result;
        saveTeachers();
        alert("Schedule uploaded");
    };
    reader.readAsDataURL(file);
}

function viewSchedule(){
    const sched=teachers[selected].schedule;
    if(!sched) return alert("No schedule uploaded");
    const viewer=document.getElementById("scheduleViewer");
    viewer.style.display="flex";
    document.getElementById("scheduleFull").src=sched;
}
document.getElementById("scheduleViewer").onclick=()=>{document.getElementById("scheduleViewer").style.display="none";};

// --- ADD / EDIT / DELETE ---
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
    } else {teachers.push({name:name,photo:null,schedule:null}); saveTeachers(); render(); closeAdd();}
}

function editTeacher(){
    let n=prompt("New name:",teachers[selected].name);
    if(n){teachers[selected].name=n; saveTeachers(); render(); document.getElementById("profileName").innerText=n;}
}
function deleteTeacher(){
    if(confirm("Delete this teacher?")){teachers.splice(selected,1); saveTeachers(); render(); closeProfile();}
}

// --- SEARCH ---
document.getElementById("searchBar").oninput=render;

// --- CLOCK ---
function startClock(){setInterval(()=>{document.getElementById("clock").innerText=new Date().toLocaleString();},1000);}
startClock();
render();