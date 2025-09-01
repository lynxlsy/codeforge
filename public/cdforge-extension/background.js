
// Background script para a extensão CDforge
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extensão CDforge Background Remover instalada!')
})

// Listener para mensagens do content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PROCESS_IMAGE') {
    // Processamento local da imagem
    console.log('Processando imagem localmente...')
    
    // Simular processamento
    setTimeout(() => {
      sendResponse({ 
        success: true, 
        message: 'Imagem processada com sucesso',
        processed: true
      })
    }, 1000)
    
    return true // Indica que a resposta será assíncrona
  }
})
