alert("app.js yüklendi");
//======================================
// eFootball League Manager
//======================================

//--------------- VERİLER ---------------

let league = {
    name: "eFootball League",
    season: "2026"
};

let players = [];
let matches = [];
let currentRound = 1;

//--------------- HTML ------------------

const leagueName = document.getElementById("leagueName");
const seasonName = document.getElementById("seasonName");

const saveLeague = document.getElementById("saveLeague");

const playerName = document.getElementById("playerName");
const addPlayer = document.getElementById("addPlayer");
const playerList = document.getElementById("playerList");

const roundSelect = document.getElementById("roundSelect");

const homePlayer = document.getElementById("homePlayer");
const awayPlayer = document.getElementById("awayPlayer");

const addMatch = document.getElementById("addMatch");
const newRound = document.getElementById("newRound");

const fixtureList = document.getElementById("fixtureList");

const standings = document.getElementById("standings");
const shareMatches = document.getElementById("shareMatches");

// İstatistik

const playerCount=document.getElementById("playerCount");
const matchCount=document.getElementById("matchCount");
const playedCount=document.getElementById("playedCount");
const remainCount=document.getElementById("remainCount");
const goalCount=document.getElementById("goalCount");
const goalAverage=document.getElementById("goalAverage");

//======================================
// Başlat
//======================================

window.onload=()=>{

    loadData();

    render();

};

//======================================
// Lig Bilgisi
//======================================

saveLeague.onclick=()=>{

    league.name=leagueName.value.trim();

    league.season=seasonName.value.trim();

    if(league.name==="")
        league.name="eFootball League";

    if(league.season==="")
        league.season="2026";

    saveData();

};

//======================================
// Oyuncu
//======================================

addPlayer.onclick=()=>{

    const name=playerName.value.trim();

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

    playerName.value="";

    saveData();

    render();

};

function deletePlayer(id){

    if(!confirm("Oyuncu silinsin mi?"))
        return;

    players=players.filter(p=>p.id!==id);

    matches=matches.filter(m=>m.home!==id && m.away!==id);

    saveData();

    render();

}

//======================================
// Yeni Hafta
//======================================

newRound.onclick=()=>{

    currentRound++;

    saveData();

    renderRounds();

};

//======================================
// Maç Ekle
//======================================

addMatch.onclick=()=>{

    const home=Number(homePlayer.value);
    const away=Number(awayPlayer.value);

    if(home===away){

        alert("Aynı oyuncu seçilemez.");

        return;

    }

    matches.push({

        id:Date.now(),

        round:Number(roundSelect.value),

        home,

        away,

        hs:null,

        as:null

    });

    saveData();

    render();

};

//======================================
// Render
//======================================

function render(){

    renderPlayers();

    renderPlayersSelect();

    renderRounds();

}

//======================================
// Oyuncu Listesi
//======================================

function renderPlayers(){

    playerList.innerHTML="";

    players.forEach(player=>{

        playerList.innerHTML+=`

        <div class="playerItem">

            <span>${player.name}</span>

            <button
            class="deleteBtn"
            onclick="deletePlayer(${player.id})">

            Sil

            </button>

        </div>

        `;

    });

}

//======================================
// Oyuncu Selectleri
//======================================

function renderPlayersSelect(){

    homePlayer.innerHTML="";
    awayPlayer.innerHTML="";

    players.forEach(player=>{

        homePlayer.innerHTML+=`
        <option value="${player.id}">
        ${player.name}
        </option>`;

        awayPlayer.innerHTML+=`
        <option value="${player.id}">
        ${player.name}
        </option>`;

    });

}

//======================================
// Haftalar
//======================================

function renderRounds(){

    roundSelect.innerHTML="";

    for(let i=1;i<=currentRound;i++){

        roundSelect.innerHTML+=`
        <option value="${i}">
        ${i}. Hafta
        </option>`;

    }

    renderMatches();

}

//======================================
// Maçlar
//======================================

function renderMatches(){

    fixtureList.innerHTML="";

    for(let round=1;round<=currentRound;round++){

        fixtureList.innerHTML+=`

        <h3 class="roundTitle">

        ${round}. HAFTA

        </h3>

        `;

        matches
        .filter(m=>m.round===round)
        .forEach(match=>{

            const home=players.find(x=>x.id===match.home);
            const away=players.find(x=>x.id===match.away);

            fixtureList.innerHTML+=`

            <div class="fixtureCard">

            <div class="matchRow">

            <b>${home.name}</b>

            <input
            type="number"
            min="0"
            id="hs${match.id}"
            value="${match.hs??""}">

            <span>-</span>

            <input
            type="number"
            min="0"
            id="as${match.id}"
            value="${match.as??""}">

            <b>${away.name}</b>

            <button
            onclick="saveScore(${match.id})">

            Kaydet

            </button>

            <button
            class="deleteBtn"
            onclick="deleteMatch(${match.id})">

            🗑

            </button>

            </div>

            </div>

            `;

        });

    }

}

//======================================
// Skor Kaydet
//======================================

function saveScore(id){

    const match=matches.find(m=>m.id===id);

    const hs=Number(document.getElementById("hs"+id).value);
    const as=Number(document.getElementById("as"+id).value);

    if(isNaN(hs)||isNaN(as)){

        alert("Skor giriniz.");

        return;

    }

    match.hs=hs;
    match.as=as;

    calculateTable();

}

//======================================
// Maç Sil
//======================================

function deleteMatch(id){

    if(!confirm("Maç silinsin mi?"))
        return;

    matches=matches.filter(m=>m.id!==id);

    calculateTable();

}

//======================================
// Puan Hesabı
//======================================

function calculateTable(){

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

    let totalGoals=0;
    let played=0;

    matches.forEach(match=>{

        if(match.hs===null||match.as===null)
            return;

        played++;

        totalGoals+=match.hs+match.as;

        const home=players.find(x=>x.id===match.home);
        const away=players.find(x=>x.id===match.away);

        home.played++;
        away.played++;

        home.gf+=match.hs;
        home.ga+=match.as;

        away.gf+=match.as;
        away.ga+=match.hs;

        if(match.hs>match.as){

            home.win++;
            away.lose++;

            home.point+=3;

        }

        else if(match.hs<match.as){

            away.win++;
            home.lose++;

            away.point+=3;

        }

        else{

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

        if(b.gf!==a.gf)
            return b.gf-a.gf;

        return a.name.localeCompare(b.name);

    });

    renderStandings();

    playerCount.textContent=players.length;
    matchCount.textContent=matches.length;
    playedCount.textContent=played;
    remainCount.textContent=matches.length-played;

    goalCount.textContent=totalGoals;

    goalAverage.textContent=
        played==0
        ?0
        :(totalGoals/played).toFixed(2);

    saveData();

}

//======================================
// Puan Tablosu
//======================================

function renderStandings(){

    standings.innerHTML="";

    players.forEach((p,index)=>{

        let medal="";

        if(index==0) medal="🏆";
        else if(index==1) medal="🥈";
        else if(index==2) medal="🥉";

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

        <td>${p.gd>0?"+":""}${p.gd}</td>

        <td><b>${p.point}</b></td>

        </tr>

        `;

    });

}

//======================================
// Local Storage
//======================================

function saveData(){

    localStorage.setItem("league",JSON.stringify(league));

    localStorage.setItem("players",JSON.stringify(players));

    localStorage.setItem("matches",JSON.stringify(matches));

    localStorage.setItem("currentRound",currentRound);

}

function loadData(){

    const l=localStorage.getItem("league");
    const p=localStorage.getItem("players");
    const m=localStorage.getItem("matches");
    const r=localStorage.getItem("currentRound");

    if(l) league=JSON.parse(l);
    if(p) players=JSON.parse(p);
    if(m) matches=JSON.parse(m);
    if(r) currentRound=Number(r);

    leagueName.value=league.name;
    seasonName.value=league.season;

    calculateTable();

}

//======================================
// YAYIN GRAFİĞİ OLUŞTUR
//======================================

//======================================
// YAYIN GRAFİĞİ
//======================================

const downloadImage=document.getElementById("downloadImage");


downloadImage.onclick=()=>{

    const matchBox = document.getElementById("shareMatches");
    document.getElementById("shareLeague").innerText =
    league.name;


    document.getElementById("shareSeason").innerText =
    league.season;



    const body=document.getElementById("shareStandings");

    body.innerHTML="";



    players.forEach((p,index)=>{


        body.innerHTML+=`

        <tr>

        <td>${index+1}</td>

        <td>${p.name}</td>

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




    shareMatches.innerHTML = "";



    matches.forEach(match=>{


        const home=players.find(
            p=>p.id===match.home
        );


        const away=players.find(
            p=>p.id===match.away
        );


        if(!home || !away)
            return;



        shareMatches.innerHTML += `

        <div class="shareMatch">

        <span>
        ${match.round}. Hafta
        </span>


        <b>
        ${home.name}
        </b>


        <strong>

        ${
            match.hs===null
            ?
            "-"
            :
            match.hs+" - "+match.as
        }

        </strong>


        <b>
        ${away.name}
        </b>


        </div>

        `;


    });



    const card=document.getElementById("shareCard");


    card.style.opacity="1";
    card.style.zIndex="9999";


    html2canvas(card,{

        scale:2,

        backgroundColor:"#111",

        width:1920,

        height:1080,

        useCORS:true

    })
    .then(canvas=>{


        card.style.opacity="0";
        card.style.zIndex="-1";


        canvas.toBlob(async(blob)=>{


            const file=new File(

                [blob],

                "efootball-lig.png",

                {
                    type:"image/png"
                }

            );


            if(
                navigator.canShare &&
                navigator.canShare({
                    files:[file]
                })
            ){

                await navigator.share({

                    files:[file],

                    title:league.name

                });

            }
            else{

                let link=document.createElement("a");

                link.download="efootball-lig.png";

                link.href=canvas.toDataURL();

                link.click();

            }


        });


    });


};

const downloadImage = document.getElementById("downloadImage");

console.log(downloadImage);

downloadImage.addEventListener("click", () => {
    alert("Buton çalışıyor");
});