// ===== Veri =====
let players = [];
let matches = [];

// ===== HTML Elemanları =====
const playerInput = document.getElementById("playerName");
const addPlayerBtn = document.getElementById("addPlayer");
const fixtureBtn = document.getElementById("fixtureBtn");

const playerList = document.getElementById("playerList");

const homePlayer = document.getElementById("homePlayer");
const awayPlayer = document.getElementById("awayPlayer");

const homeScore = document.getElementById("homeScore");
const awayScore = document.getElementById("awayScore");

const saveMatchBtn = document.getElementById("saveMatch");

const standings = document.getElementById("standings");
const history = document.getElementById("matchHistory");

// ===== Başlat =====
window.onload = () => {
    loadData();
    render();
};

// ===== Oyuncu Ekle =====
addPlayerBtn.onclick = () => {

    const name = playerInput.value.trim();

    if(name==="") return;

    players.push({
        id:Date.now(),
        name:name,
        played:0,
        win:0,
        draw:0,
        lose:0,
        gf:0,
        ga:0,
        gd:0,
        point:0
    });

    playerInput.value="";

    saveData();

    render();

};

// ===== Render =====
function render(){

    renderPlayers();

    renderSelects();

    renderTable();

    renderHistory();

}

// =========================
// Oyuncu Listesi
// =========================

function renderPlayers(){

    playerList.innerHTML="";

    players.forEach(p=>{

        const div=document.createElement("div");

        div.className="match";

        div.innerHTML=`
        <span>${p.name}</span>

        <button onclick="deletePlayer(${p.id})">
        🗑
        </button>
        `;

        playerList.appendChild(div);

    });

}

function deletePlayer(id){

    if(!confirm("Oyuncu silinsin mi?")) return;

    players=players.filter(p=>p.id!==id);

    matches=matches.filter(m=>m.home!==id && m.away!==id);

    recalculate();

}

// =========================
// Select Kutuları
// =========================

function renderSelects(){

    homePlayer.innerHTML="";
    awayPlayer.innerHTML="";

    players.forEach(p=>{

        homePlayer.innerHTML+=`
        <option value="${p.id}">
        ${p.name}
        </option>`;

        awayPlayer.innerHTML+=`
        <option value="${p.id}">
        ${p.name}
        </option>`;

    });

}

// =========================
// Maç Kaydet
// =========================

saveMatchBtn.onclick=()=>{

const home=Number(homePlayer.value);
const away=Number(awayPlayer.value);

if(home===away){

alert("Aynı oyuncu seçilemez.");

return;

}

const hs=Number(homeScore.value);
const as=Number(awayScore.value);

if(isNaN(hs)||isNaN(as)){

alert("Skor gir.");

return;

}

matches.push({

id:Date.now(),

home,

away,

hs,

as,

date:new Date().toLocaleString("tr-TR")

});

homeScore.value="";
awayScore.value="";

recalculate();

};

// =========================
// Puan Tablosunu Hesapla
// =========================

function recalculate(){

    // İstatistikleri sıfırla
    players.forEach(p=>{

        p.played=0;
        p.win=0;
        p.draw=0;
        p.lose=0;
        p.gf=0;
        p.ga=0;
        p.gd=0;
        p.point=0;

    });

    // Tüm maçları yeniden hesapla
    matches.forEach(m=>{

        const home=players.find(x=>x.id===m.home);
        const away=players.find(x=>x.id===m.away);

        if(!home || !away) return;

        home.played++;
        away.played++;

        home.gf+=m.hs;
        home.ga+=m.as;

        away.gf+=m.as;
        away.ga+=m.hs;

        if(m.hs>m.as){

            home.win++;
            away.lose++;

            home.point+=3;

        }else if(m.hs<m.as){

            away.win++;
            home.lose++;

            away.point+=3;

        }else{

            home.draw++;
            away.draw++;

            home.point++;
            away.point++;

        }

    });

    players.forEach(p=>{
        p.gd=p.gf-p.ga;
    });

    players.sort((a,b)=>{

        if(b.point!==a.point)
            return b.point-a.point;

        if(b.gd!==a.gd)
            return b.gd-a.gd;

        return b.gf-a.gf;

    });

    saveData();

    render();

}

// =========================
// Puan Tablosu
// =========================

function renderTable(){

    standings.innerHTML="";

    players.forEach((p,index)=>{

        let medal="";

        if(index===0) medal="🏆";
        else if(index===1) medal="🥈";
        else if(index===2) medal="🥉";

        standings.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${medal} ${p.name}</td>

<td>${p.played}</td>

<td>${p.win}</td>

<td>${p.draw}</td>

<td>${p.lose}</td>

<td>${p.gf}</td>

<td>${p.ga}</td>

<td>${p.gd}</td>

<td>${p.point}</td>

</tr>

`;

    });

}

// =========================
// Maç Geçmişi
// =========================

function renderHistory(){

    history.innerHTML="";

    matches.forEach(m=>{

        const home=players.find(x=>x.id===m.home);
        const away=players.find(x=>x.id===m.away);

        history.innerHTML+=`

<div class="match">

<div>

<b>${home?.name}</b>

${m.hs}-${m.as}

<b>${away?.name}</b>

<br>

<small>${m.date}</small>

</div>

</div>

`;

    });

}

// =========================
// Veriyi Kaydet
// =========================

function saveData(){

localStorage.setItem("ef_players",JSON.stringify(players));
localStorage.setItem("ef_matches",JSON.stringify(matches));

}

// =========================
// Veriyi Yükle
// =========================

function loadData(){

const p=localStorage.getItem("ef_players");
const m=localStorage.getItem("ef_matches");

players=p?JSON.parse(p):[];
matches=m?JSON.parse(m):[];

recalculate();

}

// =========================
// Fikstür
// =========================

fixtureBtn.onclick=()=>{

let text="";

for(let i=0;i<players.length;i++){

for(let j=i+1;j<players.length;j++){

text+=`${players[i].name} ⚔️ ${players[j].name}\n`;

}

}

if(text===""){

alert("En az 2 oyuncu ekleyin.");

return;

}

alert(text);

};

// =========================
// PNG Kaydet
// =========================

document
.getElementById("downloadImage")
.onclick=()=>{

html2canvas(
document.getElementById("scoreCard"),
{
backgroundColor:"#0b1220",
scale:3
}

).then(canvas=>{

const link=document.createElement("a");

link.download="PuanTablosu.png";

link.href=canvas.toDataURL();

link.click();

});

};

