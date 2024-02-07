// Aguarde o carregamento completo da página
window.addEventListener('load', function () {
    // Defina a exibição do corpo da página para 'block'
    document.body.style.display = 'block';

    // Inicialize o jogo
    initializeGame();
});

// Variáveis globais do jogo
let attempts = 0;
let chances = 5;
let percentageRevealed = 0;
let currentCountry;
let countriesData;
let countriesData_aux;

// Função para remover acentos de uma string
function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Função para criar um ícone de chance
function createChanceIcon() {
    const chanceIcon = document.createElement('img');
    chanceIcon.src = 'chance_icon.png';
    chanceIcon.alt = 'Chance';
    return chanceIcon;
}

// Função para atualizar os ícones de chances
function updateChances() {
    const chancesContainer = document.getElementById('chances-icons');

    if (!chancesContainer) {
        console.error("Elemento 'chances-icons' não encontrado.");
        return;
    }

    // Limpa os ícones antigos
    chancesContainer.innerHTML = '';

    // Adiciona os novos ícones com base no número de chances
    for (let i = 0; i < chances; i++) {
        chancesContainer.appendChild(createChanceIcon());
    }
}

// Adicione seu script JavaScript aqui
async function chooseRandomCountry() {
    attempts = 0;
    chances = 5;
    percentageRevealed = 0;

    const chancesText = document.getElementById('chances-text');
    chancesText.innerText = 'Chances:';

    try {
        const response = await fetch('random_country.php');
        const data = await response.json();

        const countryImage = document.getElementById('country-image');

        // Atualize o src da imagem com a URL correta
        countryImage.src = data.country_image;

        currentCountry = data;
        document.getElementById('country-guess').focus();
    } catch (error) {
        console.error('Erro ao buscar país aleatório:', error);
    }
    updateChances();
}


// Função para reiniciar o jogo
function restartGame() {
    countriesData = countriesData_aux;
    const restartButton = document.getElementById('restart-button');
    const image = document.getElementById('country-image');
    const feedbackContainer = document.getElementById('feedback-container');
    const guessContainer = document.getElementById('guess-container');

    feedbackContainer.innerHTML = '';
    feedbackContainer.classList.add('active');
    image.style.transition = 'clip-path 0s ease-in-out';
    image.style.clipPath = `polygon(0 0, 100% 0, 100% 0%, 0 0%)`;
    feedbackContainer.classList.remove('active', 'incorrect', 'correct');

    setTimeout(() => {
        image.src = '';
        image.style.transition = 'clip-path 0.5s ease-in-out';
        chooseRandomCountry();
        restartButton.classList.remove('active');
        guessContainer.style.display = 'flex';
    }, 0);
}

// Função para revelar a imagem gradualmente
function revealImage() {
    const image = document.getElementById('country-image');
    const feedbackContainer = document.getElementById('feedback-container');
    const testImage = document.getElementById('teste');
    const guessInput = document.getElementById('country-guess');

    percentageRevealed += 20;
    percentageRevealed = Math.min(percentageRevealed, 100);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height * (percentageRevealed/100);

    context.drawImage(image, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    
    testImage.src = canvas.toDataURL('image/png');
    
    image.style.clipPath = `polygon(0 0, 100% 0, 100% ${percentageRevealed}%, 0 ${percentageRevealed}%)`;

    const isCorrectGuess = attempts > 0 && removeAccents(currentCountry.name.toLowerCase()) === removeAccents(guessInput.value.toLowerCase());

    if (isCorrectGuess) {
        feedbackContainer.classList.add('correct', 'active');
        feedbackContainer.innerHTML = `<p>Parabéns! Você acertou. O país é ${currentCountry.name}!</p>`;
        document.getElementById('restart-button').classList.add('active');
    }
}

// Função para verificar o palpite
function checkGuess() {
    const guessInput = document.getElementById('country-guess');
    const feedbackContainer = document.getElementById('feedback-container');
    const guessContainer = document.getElementById('guess-container');
    const countryList = document.getElementById('countries-list'); // Adicionado

    const normalizedGuess = removeAccents(guessInput.value.toLowerCase());
    const normalizedCountry = removeAccents(currentCountry.name.toLowerCase());

    countryList.style.display = 'none';
    guessInput.value = '';

    if (!isGuessInCountryList(normalizedGuess)) {
        return;
    }

    const selectedCountry = document.querySelector('.selected');
    if(selectedCountry){
        selectedCountry.remove('selected');
    }

    remove_guessed_country(normalizedGuess);

    attempts++;

    if (normalizedGuess === normalizedCountry) {
        const restartButton = document.getElementById('restart-button');
        restartButton.classList.add('active');
        feedbackContainer.innerHTML = `<p>Parabéns! Você acertou. O país é ${currentCountry.name}!</p>`;
        feedbackContainer.classList.remove('incorrect');
        feedbackContainer.classList.add('correct', 'active');
        guessContainer.style.display = 'none';

        percentageRevealed = 100;
        revealImage();
    } else {
        if (attempts >= 5) {
            const chancesIcons = document.getElementById('chances-icons');
            const restartButton = document.getElementById('restart-button');
            const chancesText = document.getElementById('chances-text');

            chancesText.innerText = '';
            feedbackContainer.innerHTML = `<p>Você atingiu o número máximo de tentativas. O país era ${currentCountry.name}.</p>`;
            guessContainer.style.display = 'none';

            chancesIcons.innerHTML = '';
            restartButton.classList.add('active');

            revealImage();
        } else {
            chances--;

            if (chances > 1) {
                feedbackContainer.innerHTML = '<p>Palpite incorreto. Tente novamente!</p>';
            } else {
                feedbackContainer.innerHTML = '<p>Imagem totalmente revelada. Faça seu palpite!</p>';
            }

            feedbackContainer.classList.remove('correct');
            feedbackContainer.classList.add('incorrect', 'active');

            updateChances();
            revealImage();
        }
    }
}

function isGuessInCountryList(guess) {
    const countryList = document.getElementById('countries-list');

    // Verifica se o elemento 'countries-list' existe
    if (countryList) {
        return Array.from(countryList.children).some(option => removeAccents(option.textContent.toLowerCase()) === guess);
    }
    // Retorna false se o elemento 'countries-list' não existir
    return false;
}

function initializeGame() {
    chooseRandomCountry();

    fetchCountriesData();

    document.getElementById('countries-list').addEventListener('click', function (event) {
        const clickedCountry = event.target.textContent;
        document.getElementById('country-guess').value = clickedCountry;
        checkGuess();
        document.getElementById('country-guess').focus();
    });

    document.getElementById('country-guess').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const selectedCountry = document.querySelector('.selected');
            if (selectedCountry) {
                document.getElementById('country-guess').value = selectedCountry.textContent;
                checkGuess();
            } else {
                checkGuess();
            }
        }
        else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            handleArrowKeys(event);
        }
        else{
            updateCountryList();
        }
    });
}

// Função para buscar a lista de países apenas no início do jogo
async function fetchCountriesData() {
    try {
        const response = await fetch('countries.php');
        countriesData = await response.json();
        countriesData_aux = countriesData;
    } catch (error) {
        console.error('Erro ao buscar lista de países:', error);
    }
}

async function updateCountryList() {
    const input = document.getElementById('country-guess');
    const countryList = document.getElementById('countries-list');

    await fetch('countries.php'); //não retirar

    countryList.innerHTML = '';

    const inputValue = removeAccents(input.value.trim().toLowerCase());

    // Verifica se há pelo menos uma letra na entrada
    if (inputValue.length > 0) {
        // Adicionar opções à lista de países com base no valor digitado
        for (const country of countriesData) {
            const countryName = country.name.toLowerCase();
            const countryNameNoAccents = country.name_no_accents.toLowerCase();

            if (countryName.includes(inputValue) || countryNameNoAccents.includes(inputValue)) {
                const option = document.createElement('div');
                option.textContent = country.name;  // Exibe o nome com acentos
                countryList.appendChild(option);
            }
        }

        // Mostra a lista de países
        countryList.style.display = 'block';
    } else {
        // Esconde a lista de países se não houver texto na entrada
        countryList.style.display = 'none';
    }
}

function remove_guessed_country(country_name_guessed) {
    countriesData = countriesData.filter(country => country.name_no_accents.toLowerCase() !== country_name_guessed)
}



// Função para lidar com a navegação na lista usando as teclas de seta
function handleArrowKeys(event) {
    const countryList = document.getElementById('countries-list');
    const selectedCountry = document.querySelector('.selected');

    // Verifica se a tecla pressionada é Up Arrow
    if (event.key === 'ArrowUp') {
        event.preventDefault();  // Evita que o cursor vá para o início da input

        if (selectedCountry) {
            const prevCountry = selectedCountry.previousElementSibling;
            if (prevCountry) {
                scrollToSelected(prevCountry);
                selectedCountry.classList.remove('selected');
                prevCountry.classList.add('selected');
            } else {
                // Se o primeiro item estiver selecionado e Arrow Up for pressionado, remova a seleção
                selectedCountry.classList.remove('selected');
            }
        } else {
            // Se nenhum país estiver selecionado, return
            return;
        }
    }
    // Verifica se a tecla pressionada é Down Arrow
    else if (event.key === 'ArrowDown') {
        if (selectedCountry) {
            const nextCountry = selectedCountry.nextElementSibling;
            if (nextCountry) {
                scrollToSelected(nextCountry);
                selectedCountry.classList.remove('selected');
                nextCountry.classList.add('selected');
            }
        } else {
            // Se nenhum país estiver selecionado, selecione o primeiro
            const firstCountry = countryList.firstElementChild;
            if (firstCountry) {
                setTimeout(() => {
                    scrollToSelected(firstCountry);
                }, 50);
                firstCountry.classList.add('selected');
            }
        }
    }
}

// Função para rolar até a div selecionada
function scrollToSelected(element) {
    setTimeout(function () {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }, 0);
}
