'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const errorMessages: Record<string, { title: string; message: string }> = {
  Configuration: {
    title: 'Erro de Configuração',
    message: 'Há um problema com a configuração do servidor. Por favor, tente novamente mais tarde.'
  },
  AccessDenied: {
    title: 'Acesso Negado',
    message: 'Você não tem permissão para acessar esta página.'
  },
  Verification: {
    title: 'Erro de Verificação',
    message: 'O link de verificação pode ter expirado ou já foi usado.'
  },
  OAuthSignin: {
    title: 'Erro de Login',
    message: 'Erro ao iniciar o processo de login. Por favor, tente novamente.'
  },
  OAuthCallback: {
    title: 'Erro de Callback',
    message: 'Erro no retorno do provedor de autenticação.'
  },
  OAuthCreateAccount: {
    title: 'Erro ao Criar Conta',
    message: 'Não foi possível criar sua conta. Por favor, tente novamente.'
  },
  EmailCreateAccount: {
    title: 'Erro ao Criar Conta',
    message: 'Não foi possível criar sua conta com este email.'
  },
  Callback: {
    title: 'Erro de Callback',
    message: 'Ocorreu um erro durante o processo de autenticação.'
  },
  OAuthAccountNotLinked: {
    title: 'Conta Não Vinculada',
    message: 'Esta conta já está vinculada a outro perfil.'
  },
  EmailSignin: {
    title: 'Erro de Login',
    message: 'Não foi possível enviar o email de login. Verifique se o endereço está correto.'
  },
  CredentialsSignin: {
    title: 'Credenciais Inválidas',
    message: 'O email ou a senha estão incorretos. Por favor, verifique e tente novamente.'
  },
  SessionRequired: {
    title: 'Sessão Necessária',
    message: 'Por favor, faça login para acessar esta página.'
  },
  Default: {
    title: 'Erro de Autenticação',
    message: 'Ocorreu um erro durante a autenticação. Por favor, tente novamente.'
  }
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const errorType = searchParams?.get('error') || 'Default'
  
  const { title, message } = errorMessages[errorType] || errorMessages.Default

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <span className="text-red-600 text-2xl font-bold">StreamFlix</span>
          </Link>
        </div>

        {/* Error Card */}
        <div className="bg-black/80 backdrop-blur-md p-8 rounded-lg border border-red-800/50">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              {title}
            </h1>
            
            <p className="text-gray-400 mb-6">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                asChild
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
              
              <Button
                asChild
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Link href="/auth/signin">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>
            Se o problema persistir, entre em contato com o suporte.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
