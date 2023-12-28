<?php
// country_image.php

// Verifica se o parâmetro 'flag' está presente na solicitação
if (isset($_GET['flag'])) {
    // Obtém o valor do parâmetro 'flag' e valida
    $flagValue = basename($_GET['flag']); // Garante que o valor é seguro

    // Constrói o caminho completo do arquivo
    $filePath = 'flags/' . $flagValue . '.png';

    // Verifica se o arquivo existe antes de tentar lê-lo
    if (file_exists($filePath)) {
        // Obtém o conteúdo da imagem
        $imageContent = file_get_contents($filePath);

        // Configura o cabeçalho para indicar que o conteúdo é uma imagem
        header('Content-Type: image/png'); // Substitua 'image/png' pelo tipo MIME correto, se necessário

        // Envia os dados da imagem
        echo $imageContent;
    } else {
        // Se o arquivo não existir, retorna uma resposta de erro
        $response = array('status' => 'error', 'message' => 'Arquivo de imagem não encontrado.');
        echo json_encode($response);
    }
} else {
    // Se 'flag' não estiver presente, retorna uma resposta de erro
    $response = array('status' => 'error', 'message' => 'Parâmetro "flag" ausente.');
    echo json_encode($response);
}
?>
