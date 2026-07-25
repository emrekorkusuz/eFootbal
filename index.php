<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>eFootball League</title>

  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#0057ff">

  <link rel="stylesheet" href="style.css">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>

<body>

<header>
    <h1>🏆 eFootball League</h1>
    <p>Lig Yönetim Sistemi</p>
</header>

<main>

<section class="card">

<h2>Oyuncular</h2>

<div class="row">

<input
id="playerName"
placeholder="Oyuncu Adı">

<button id="addPlayer">

Oyuncu Ekle

</button>

</div>

<div id="playerList"></div>

<button id="fixtureBtn">

📅 Fikstür Oluştur

</button>

</section>

<section class="card">

<h2>Maç Sonucu</h2>

<select id="homePlayer"></select>

<select id="awayPlayer"></select>

<div class="score">

<input type="number" id="homeScore">

<span>-</span>

<input type="number" id="awayScore">

</div>

<button id="saveMatch">

Sonucu Kaydet

</button>

</section>

<section class="card" id="scoreCard">

<h2>Puan Tablosu</h2>

<table>

<thead>

<tr>

<th>#</th>
<th>Takım</th>
<th>O</th>
<th>G</th>
<th>B</th>
<th>M</th>
<th>AG</th>
<th>YG</th>
<th>AV</th>
<th>P</th>

</tr>

</thead>

<tbody id="standings">

</tbody>

</table>

<br>

<button id="downloadImage">

📷 Puan Tablosunu Kaydet

</button>

</section>

<section class="card">

<h2>Maç Geçmişi</h2>

<div id="matchHistory"></div>

</section>

</main>

<script src="app.js"></script>

</body>
</html>