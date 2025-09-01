
// Script injetado na página
console.log('CDforge Extension: Script injetado')

// Função para processamento local de imagens
window.cdforgeLocalProcessor = {
  // Algoritmo de remoção de fundo local
  removeBackground: (imageData, width, height) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    
    // Carregar imagem
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      
      // Obter dados da imagem
      const imageDataObj = ctx.getImageData(0, 0, width, height)
      const data = imageDataObj.data
      
      // Algoritmo de remoção de fundo
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        // Detectar fundos claros
        if (r > 240 && g > 240 && b > 240) {
          data[i + 3] = 0 // Tornar transparente
        }
      }
      
      ctx.putImageData(imageDataObj, 0, 0)
    }
    img.src = imageData
    
    return canvas.toDataURL('image/png')
  }
}

console.log('CDforge Extension: Processador local disponível')
