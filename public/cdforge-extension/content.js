
// Content script para detectar a extensão
console.log('CDforge Extension: Content script carregado')

// Injetar script na página
const script = document.createElement('script')
script.src = chrome.runtime.getURL('injected.js')
script.onload = () => script.remove()
document.head.appendChild(script)

// Expor API da extensão
window.cdforgeExtension = {
  version: '1.0.0',
  isInstalled: true,
  processImage: (imageData) => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: 'PROCESS_IMAGE',
        imageData: imageData
      }, (response) => {
        resolve(response)
      })
    })
  },
  removeBackground: (imageData) => {
    // Algoritmo local de remoção de fundo
    return new Promise((resolve) => {
      // Simular processamento local
      setTimeout(() => {
        resolve({
          success: true,
          processedImage: imageData,
          message: 'Fundo removido com sucesso'
        })
      }, 500)
    })
  }
}

console.log('CDforge Extension: API disponível em window.cdforgeExtension')
