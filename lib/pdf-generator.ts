import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { Project } from './types'
import { getContactConfig, getWhatsAppFromConfig, getTelegramFromConfig } from './contact-config'

export class PDFGenerator {
  static async generateOrderPDF(project: Project): Promise<string> {
    // Criar elemento HTML temporário para o PDF
    const pdfElement = document.createElement('div')
    
    // Configurar elemento com estilos inline
    Object.assign(pdfElement.style, {
      position: 'fixed',
      left: '-9999px',
      top: '0',
      width: '800px',
      backgroundColor: '#ffffff',
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      color: '#333333',
      borderRadius: '0',
      boxShadow: 'none',
      margin: '0',
      border: 'none',
      outline: 'none',
      overflow: 'visible',
      zIndex: '-1',
      transform: 'translateZ(0)'
    })
    
    // Carregar configurações de contato
    const [email, whatsapp] = await Promise.all([
      this.getContactEmail(),
      this.getContactWhatsApp()
    ])

    // Conteúdo do PDF com estilos inline completos
    pdfElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; font-family: Arial, sans-serif;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
          <div style="width: 40px; height: 40px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <svg width="24" height="24" viewBox="0 0 543 567" fill="white" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(0.000000,567.000000) scale(0.100000,-0.100000)">
                <path d="M2505 4923 c-98 -21 -116 -53 -161 -272 -49 -247 -67 -279 -162 -306 -31 -9 -64 -19 -72 -22 -8 -3 -17 -7 -20 -8 -3 -1 -18 -7 -35 -14 -16 -7 -61 -24 -100 -38 -38 -14 -95 -38 -125 -53 -51 -25 -58 -26 -105 -15 -27 6 -77 29 -110 50 -76 49 -228 157 -235 166 -3 4 -24 12 -47 19 -53 16 -90 3 -148 -54 -99 -99 -213 -205 -252 -234 -54 -42 -103 -117 -103 -157 0 -29 75 -163 106 -190 6 -5 42 -57 80 -115 88 -136 89 -154 18 -300 -28 -58 -61 -136 -74 -175 -34 -106 -62 -162 -90 -179 -14 -8 -57 -20 -95 -26 -39 -7 -92 -18 -120 -26 -27 -7 -85 -21 -128 -29 -177 -36 -177 -36 -177 -366 0 -324 3 -332 145 -358 90 -17 315 -71 363 -88 23 -8 42 -20 42 -26 0 -6 6 -18 14 -26 8 -9 26 -52 40 -96 15 -44 52 -132 83 -195 43 -87 56 -126 57 -160 0 -52 -12 -72 -151 -254 -140 -183 -137 -218 30 -376 61 -58 151 -144 199 -192 86 -86 89 -88 136 -88 46 0 58 7 196 104 81 58 167 112 191 122 65 24 68 23 360 -106 22 -9 72 -25 110 -34 39 -10 79 -25 90 -34 32 -26 60 -114 90 -277 32 -175 44 -207 94 -237 35 -22 44 -23 276 -23 212 0 244 2 273 18 46 25 66 64 86 165 10 48 21 101 26 117 4 17 13 57 20 90 25 125 48 154 142 184 70 22 325 126 342 140 18 14 98 6 140 -14 22 -10 73 -43 114 -72 41 -30 91 -62 111 -73 20 -10 51 -30 70 -44 26 -19 47 -26 81 -26 59 0 92 26 352 277 95 92 133 154 122 200 -8 37 -59 128 -99 178 -18 22 -60 79 -94 128 -82 115 -84 145 -18 267 25 47 62 126 82 175 53 129 74 170 97 184 18 11 133 37 273 62 28 5 86 19 129 31 123 35 121 30 121 358 0 241 -2 268 -18 294 -29 43 -60 53 -412 126 -113 23 -128 39 -180 193 -21 61 -60 156 -87 210 -60 123 -62 156 -13 223 20 27 52 74 73 104 20 30 49 71 63 90 44 58 69 117 69 162 0 59 -37 112 -147 210 -48 44 -102 94 -118 112 -17 17 -56 55 -87 84 -53 48 -60 52 -107 52 -37 0 -57 -6 -78 -23 -81 -67 -171 -132 -240 -174 -69 -41 -85 -46 -133 -46 -37 1 -67 8 -91 22 -51 30 -238 107 -308 127 -62 17 -102 47 -126 94 -13 27 -45 155 -71 290 -28 147 -46 165 -186 186 -86 13 -336 18 -383 7z m462 -1043 c251 -41 492 -162 677 -340 120 -115 205 -231 276 -375 102 -209 141 -371 142 -595 1 -356 -129 -668 -395 -947 -163 -171 -420 -305 -700 -365 -150 -32 -391 -32 -537 0 -266 60 -472 175 -676 377 -263 262 -394 569 -394 926 0 319 113 616 328 863 233 268 564 430 957 470 59 6 250 -2 322 -14z"/>
              </g>
            </svg>
          </div>
          <h1 style="color: #3b82f6; margin: 0; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif;">CDforge</h1>
        </div>
        <p style="color: #666666; margin: 5px 0; font-size: 16px; font-family: Arial, sans-serif;">Comprovante de Pedido</p>
        <div style="width: 100px; height: 3px; background: #3b82f6; margin: 20px auto;"></div>
      </div>

      <div style="margin-bottom: 30px; font-family: Arial, sans-serif;">
        <h2 style="color: #3b82f6; font-size: 24px; margin-bottom: 20px; font-family: Arial, sans-serif;">📋 Detalhes do Pedido</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="font-family: Arial, sans-serif;">
            <h3 style="color: #333333; font-size: 18px; margin-bottom: 10px; font-family: Arial, sans-serif;">👤 Informações do Cliente</h3>
            <p style="margin: 5px 0; font-family: Arial, sans-serif;"><strong>Nome:</strong> ${project.client}</p>
            <p style="margin: 5px 0; font-family: Arial, sans-serif;"><strong>Email:</strong> ${project.email}</p>
            <p style="margin: 5px 0; font-family: Arial, sans-serif;"><strong>Data do Pedido:</strong> ${new Date(project.date).toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div style="font-family: Arial, sans-serif;">
            <h3 style="color: #333333; font-size: 18px; margin-bottom: 10px; font-family: Arial, sans-serif;">🔧 Detalhes do Projeto</h3>
            <p style="margin: 5px 0; font-family: Arial, sans-serif;"><strong>Plataforma:</strong> ${this.getPlatformName(project.platform)}</p>
            <p style="margin: 5px 0; font-family: Arial, sans-serif;"><strong>Complexidade:</strong> ${this.getComplexityName(project.complexity)}</p>
            <p style="margin: 5px 0; font-family: Arial, sans-serif;"><strong>Prazo:</strong> ${this.getTimelineName(project.timeline)}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px; font-family: Arial, sans-serif;">
          <h3 style="color: #333333; font-size: 18px; margin-bottom: 10px; font-family: Arial, sans-serif;">📝 Descrição do Projeto</h3>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; line-height: 1.6; margin: 0; font-family: Arial, sans-serif;">${project.description}</p>
        </div>

        <div style="margin-bottom: 20px; font-family: Arial, sans-serif;">
          <h3 style="color: #333333; font-size: 18px; margin-bottom: 10px; font-family: Arial, sans-serif;">✨ Funcionalidades Solicitadas</h3>
          <ul style="background: #f5f5f5; padding: 15px 15px 15px 35px; border-radius: 8px; margin: 0; font-family: Arial, sans-serif;">
            ${project.features.map(feature => `<li style="margin-bottom: 8px; font-family: Arial, sans-serif;">${feature}</li>`).join('')}
          </ul>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-family: Arial, sans-serif;">
          <div>
            <h3 style="color: #333333; font-size: 18px; margin-bottom: 10px; font-family: Arial, sans-serif;">💰 Valor do Projeto</h3>
            <p style="font-size: 24px; font-weight: bold; color: #3b82f6; margin: 0; font-family: Arial, sans-serif;">R$ ${project.price.toLocaleString('pt-BR')}</p>
          </div>
          
          <div>
            <h3 style="color: #333333; font-size: 18px; margin-bottom: 10px; font-family: Arial, sans-serif;">📞 Contato Preferido</h3>
            <p style="margin: 0; font-family: Arial, sans-serif;">${project.contactMethod === 'email' ? '📧 Email' : '📱 WhatsApp'}</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 30px; font-family: Arial, sans-serif;">
        <h2 style="color: #3b82f6; font-size: 24px; margin-bottom: 20px; font-family: Arial, sans-serif;">📋 Próximos Passos</h2>
        
        <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; font-family: Arial, sans-serif;">
          <ol style="margin: 0; padding-left: 20px; font-family: Arial, sans-serif;">
            <li style="margin-bottom: 10px; font-family: Arial, sans-serif;">Envie este comprovante para o WhatsApp da CDforge</li>
            <li style="margin-bottom: 10px; font-family: Arial, sans-serif;">Aguarde nossa análise e confirmação do projeto</li>
            <li style="margin-bottom: 10px; font-family: Arial, sans-serif;">Receberá um cronograma detalhado de desenvolvimento</li>
            <li style="margin-bottom: 10px; font-family: Arial, sans-serif;">Iniciaremos o desenvolvimento após aprovação</li>
          </ol>
        </div>
      </div>

      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #eeeeee; font-family: Arial, sans-serif;">
        <p style="color: #666666; margin: 0; font-size: 14px; font-family: Arial, sans-serif;">
          <strong>CDforge</strong> - Desenvolvimento de soluções digitais personalizadas<br>
          📧 ${email} | 📱 WhatsApp: ${whatsapp}
        </p>
        <p style="color: #999999; margin: 10px 0 0 0; font-size: 12px; font-family: Arial, sans-serif;">
          Comprovante gerado em ${new Date().toLocaleString('pt-BR')}
        </p>
      </div>
    `

    // Adicionar ao DOM temporariamente
    document.body.appendChild(pdfElement)

    try {
      // Aguardar um pouco para o DOM ser renderizado
      await new Promise(resolve => setTimeout(resolve, 100))

      // Converter para canvas com configurações otimizadas
      const canvas = await html2canvas(pdfElement, {
        scale: 2,
        useCORS: false,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: pdfElement.scrollHeight,
        foreignObjectRendering: false,
        removeContainer: true,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          // Garantir que o elemento clonado tenha os estilos corretos
          const clonedElement = clonedDoc.body.firstChild as HTMLElement
          if (clonedElement) {
            Object.assign(clonedElement.style, {
              position: 'relative',
              left: '0',
              top: '0',
              width: '800px',
              backgroundColor: '#ffffff',
              padding: '40px',
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              margin: '0',
              border: 'none',
              outline: 'none',
              overflow: 'visible'
            })
          }
        }
      })

      // Remover elemento temporário
      document.body.removeChild(pdfElement)

      // Criar PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Adicionar primeira página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Adicionar páginas adicionais se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Salvar PDF
      const fileName = `comprovante-cdforge-${project.client.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.pdf`
      pdf.save(fileName)

      return fileName
    } catch (error) {
      // Remover elemento temporário em caso de erro
      if (document.body.contains(pdfElement)) {
        document.body.removeChild(pdfElement)
      }
      throw error
    }
  }

  private static getPlatformName(platform: string): string {
    const platforms: Record<string, string> = {
      'discord-bot': 'Discord Bot',
      'instagram-bot': 'Instagram Bot',
      'website': 'Website',
      'system': 'Sistema Personalizado'
    }
    return platforms[platform] || platform
  }

  private static getComplexityName(complexity: string): string {
    const complexities: Record<string, string> = {
      'basic': 'Básico',
      'intermediate': 'Intermediário',
      'advanced': 'Avançado'
    }
    return complexities[complexity] || complexity
  }

  private static getTimelineName(timeline: string): string {
    const timelines: Record<string, string> = {
      'urgent': 'Urgente (1-3 dias)',
      'normal': 'Normal (1-2 semanas)',
      'flexible': 'Flexível (2-4 semanas)'
    }
    return timelines[timeline] || timeline
  }

  private static async getContactEmail(): Promise<string> {
    try {
      const config = await getContactConfig()
      return config.email || 'contato@cdforge.dev'
    } catch (error) {
      return 'contato@cdforge.dev'
    }
  }

  private static async getContactWhatsApp(): Promise<string> {
    try {
      const config = await getContactConfig()
      return config.whatsappNumber || '(11) 99999-9999'
    } catch (error) {
      return '(11) 99999-9999'
    }
  }
}

