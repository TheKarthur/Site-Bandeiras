<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jogo de Adivinhação de Países</title>
    <link rel="icon" href="karthur.ico" type="image/x-icon">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <a href="https://www.linkedin.com/in/arthur-padilha/" target="_blank">
        <img src="LinkedIn_icon.png" alt="Imagem PNG" id="custom-image">
    </a>

    <div id="game-container">
        <div id="country">
            <img id="country-image" alt="Imagem do País">
        </div>
        <div id="guess-container">
            <label for="country-guess">Palpite: </label>
            <input type="text" id="country-guess" autocomplete="off" placeholder="Digite o país">
            <div id="countries-list"></div>
            <div id="guessed-countries"></div>
        </div>
        <div id="feedback-container"></div>
        <div id="chances-container">
            <p id="chances-text">Chances:</p>
            <div id="chances-icons"></div>
        </div>
    </div>
    <button id="restart-button" onclick="restartGame();">Recomeçar</button>
    <script src="script.js"></script>
</body>
</html>
