"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import {
  Phone,
  Mail,
  MessageCircle,
  Hash,
  Send,
  Users,
  Headphones,
  Briefcase,
  CheckCircle,
} from "lucide-react"
import type { ContactMethod, ContactStats } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useContactConfig } from "@/hooks/use-contact-config"



export function ContactManager() {
  const { toast } = useToast()
  const { 
    config, 
    updateConfig, 
    getWhatsAppNumber, 
    getTelegramNumber, 
    getActiveContactsCount,
    openWhatsApp, 
    openInstagram, 
    openTelegram, 
    openDiscord, 
    loading: configLoading 
  } = useContactConfig()
  const [savingConfig, setSavingConfig] = useState(false)

  const stats: ContactStats = {
    totalContacts: getActiveContactsCount(),
    activeContacts: getActiveContactsCount(),
    contactsByType: {},
    contactsByCategory: {},
  }



  const handleSaveConfig = async () => {
    setSavingConfig(true)
    try {
      await updateConfig(config)
      toast({
        title: "Configurações salvas",
        description: "As configurações do WhatsApp foram atualizadas e sincronizadas em todo o sistema.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setSavingConfig(false)
    }
  }



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Contatos</h1>
        <p className="text-gray-400">Configure e gerencie todos os canais de atendimento ao cliente</p>
      </div>

             <div className="space-y-6">

                 <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total de Contatos</CardTitle>
                <Phone className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.totalContacts}</div>
                <p className="text-xs text-gray-400">canais configurados</p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Contatos Ativos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.activeContacts}</div>
                <p className="text-xs text-gray-400">de {stats.totalContacts} total</p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Canais de Suporte</CardTitle>
                <Headphones className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">{stats.contactsByCategory.support || 0}</div>
                <p className="text-xs text-gray-400">canais de suporte</p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Canais Comerciais</CardTitle>
                <Briefcase className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.contactsByCategory.commercial || 0}</div>
                <p className="text-xs text-gray-400">canais comerciais</p>
              </CardContent>
            </Card>
          </div>

                     {/* Configurações de Contato */}
           <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="text-white flex items-center">
                 <MessageCircle className="mr-2 h-5 w-5 text-red-400" />
                 Configurações de Contato
               </CardTitle>
               <CardDescription className="text-gray-400">
                 Configure os links de contato que serão usados em todo o sistema e nos PDFs
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
               {configLoading ? (
                 <div className="flex items-center justify-center py-8">
                   <div className="text-center">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400 mx-auto mb-4"></div>
                     <p className="text-gray-400">Carregando configurações...</p>
                   </div>
                 </div>
               ) : (
                 <>
                                       {/* WhatsApp */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="whatsapp" className="text-white text-sm flex items-center">
                          <MessageCircle className="mr-2 h-4 w-4 text-green-400" />
                          WhatsApp
                        </Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">Ativo</span>
                          <Switch
                            checked={config.whatsappActive}
                            onCheckedChange={(checked) => updateConfig({ whatsappActive: checked })}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="whatsappNumber" className="text-white text-xs">
                            Número
                          </Label>
                          <Input
                            id="whatsappNumber"
                            placeholder="(11) 99999-9999"
                            value={config.whatsappNumber}
                            onChange={(e) => updateConfig({ whatsappNumber: e.target.value })}
                            className="bg-black/50 border-red-600/20 text-white placeholder:text-gray-400"
                            disabled={!config.whatsappActive}
                          />
                        </div>
                        <div>
                          <Label htmlFor="whatsappLink" className="text-white text-xs">
                            Link
                          </Label>
                          <Input
                            id="whatsappLink"
                            type="url"
                            placeholder="https://wa.me/5511999999999"
                            value={config.whatsappLink}
                            onChange={(e) => updateConfig({ whatsappLink: e.target.value })}
                            className="bg-black/50 border-red-600/20 text-white placeholder:text-gray-400"
                            disabled={!config.whatsappActive}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openWhatsApp}
                          disabled={!config.whatsappActive}
                          className="border-green-600/30 text-green-400 hover:bg-green-600/10 disabled:opacity-50"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Testar
                        </Button>
                        <span className="text-xs text-gray-500 flex items-center">
                          Número: {getWhatsAppNumber()}
                        </span>
                      </div>
                    </div>

                                       {/* Instagram */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="instagram" className="text-white text-sm flex items-center">
                          <Send className="mr-2 h-4 w-4 text-pink-400" />
                          Instagram
                        </Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">Ativo</span>
                          <Switch
                            checked={config.instagramActive}
                            onCheckedChange={(checked) => updateConfig({ instagramActive: checked })}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="instagram"
                          type="url"
                          placeholder="https://instagram.com/cdforge"
                          value={config.instagramLink}
                          onChange={(e) => updateConfig({ instagramLink: e.target.value })}
                          className="flex-1 bg-black/50 border-red-600/20 text-white placeholder:text-gray-400"
                          disabled={!config.instagramActive}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openInstagram}
                          disabled={!config.instagramActive}
                          className="border-pink-600/30 text-pink-400 hover:bg-pink-600/10 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                          Testar
                        </Button>
                      </div>
                    </div>

                                       {/* Telegram */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="telegram" className="text-white text-sm flex items-center">
                          <Send className="mr-2 h-4 w-4 text-cyan-400" />
                          Telegram
                        </Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">Ativo</span>
                          <Switch
                            checked={config.telegramActive}
                            onCheckedChange={(checked) => updateConfig({ telegramActive: checked })}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="telegramNumber" className="text-white text-xs">
                            Username
                          </Label>
                          <Input
                            id="telegramNumber"
                            placeholder="@cdforge"
                            value={config.telegramNumber}
                            onChange={(e) => updateConfig({ telegramNumber: e.target.value })}
                            className="bg-black/50 border-red-600/20 text-white placeholder:text-gray-400"
                            disabled={!config.telegramActive}
                          />
                        </div>
                        <div>
                          <Label htmlFor="telegramLink" className="text-white text-xs">
                            Link
                          </Label>
                          <Input
                            id="telegramLink"
                            type="url"
                            placeholder="https://t.me/cdforge"
                            value={config.telegramLink}
                            onChange={(e) => updateConfig({ telegramLink: e.target.value })}
                            className="bg-black/50 border-red-600/20 text-white placeholder:text-gray-400"
                            disabled={!config.telegramActive}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openTelegram}
                          disabled={!config.telegramActive}
                          className="border-cyan-600/30 text-cyan-400 hover:bg-cyan-600/10 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                          Testar
                        </Button>
                        <span className="text-xs text-gray-500 flex items-center">
                          Username: {getTelegramNumber()}
                        </span>
                      </div>
                    </div>

                                       {/* Discord */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="discord" className="text-white text-sm flex items-center">
                          <Hash className="mr-2 h-4 w-4 text-indigo-400" />
                          Discord
                        </Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">Ativo</span>
                          <Switch
                            checked={config.discordActive}
                            onCheckedChange={(checked) => updateConfig({ discordActive: checked })}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="discord"
                          type="url"
                          placeholder="https://discord.gg/cdforge"
                          value={config.discordLink}
                          onChange={(e) => updateConfig({ discordLink: e.target.value })}
                          className="flex-1 bg-black/50 border-red-600/20 text-white placeholder:text-gray-400"
                          disabled={!config.discordActive}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openDiscord}
                          disabled={!config.discordActive}
                          className="border-indigo-600/30 text-indigo-400 hover:bg-indigo-600/10 disabled:opacity-50"
                        >
                          <Hash className="h-4 w-4" />
                          Testar
                        </Button>
                      </div>
                    </div>

                                       {/* Email */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email" className="text-white text-sm flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-blue-400" />
                          Email de Contato
                        </Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">Ativo</span>
                          <Switch
                            checked={config.emailActive}
                            onCheckedChange={(checked) => updateConfig({ emailActive: checked })}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          type="email"
                          placeholder="contato@cdforge.dev"
                          value={config.email}
                          onChange={(e) => updateConfig({ email: e.target.value })}
                          className="flex-1 bg-black/50 border-red-600/20 text-white placeholder:text-gray-400"
                          disabled={!config.emailActive}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEmail()}
                          disabled={!config.emailActive}
                          className="border-blue-600/30 text-blue-400 hover:bg-blue-600/10 disabled:opacity-50"
                        >
                          <Mail className="h-4 w-4" />
                          Testar
                        </Button>
                      </div>
                    </div>

                   {/* Botão Salvar */}
                   <div className="flex justify-end pt-4 border-t border-red-600/20">
                     <Button
                       onClick={handleSaveConfig}
                       disabled={savingConfig}
                       className="bg-red-600 hover:bg-red-700 text-white"
                     >
                       {savingConfig ? (
                         <>
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                           Salvando...
                         </>
                       ) : (
                         <>
                           <MessageCircle className="h-4 w-4 mr-2" />
                           Salvar e Sincronizar
                         </>
                       )}
                     </Button>
                   </div>

                   {/* Informações */}
                   <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                     <h4 className="text-blue-400 font-medium mb-2">ℹ️ Como funciona</h4>
                     <div className="space-y-2 text-sm text-gray-400">
                       <p>• <strong>Sincronização Automática:</strong> As configurações são salvas no Firebase e sincronizadas em todo o sistema</p>
                       <p>• <strong>PDF Atualizado:</strong> Os contatos aparecerão automaticamente nos PDFs gerados</p>
                       <p>• <strong>Botões Funcionais:</strong> Todos os botões de contato usarão estas configurações</p>
                       <p>• <strong>Persistência:</strong> As configurações são mantidas mesmo após reiniciar o sistema</p>
                     </div>
                   </div>
                 </>
               )}
             </CardContent>
           </Card>

           
                 </div>
       </div>
    </div>
  )
}
