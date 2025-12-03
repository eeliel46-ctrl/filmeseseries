/*
  # Criar tabelas para sistema de streaming

  1. Novas Tabelas
    - `users` - Usuários do sistema
    - `favorites` - Favoritos dos usuários
    - `Account` - Contas NextAuth
    - `Session` - Sessões NextAuth
    - `VerificationToken` - Tokens de verificação

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas restritivas por usuário
*/

-- Criar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela users
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  password TEXT,
  "firstName" TEXT,
  "lastName" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- Criar tabela Account (NextAuth)
CREATE TABLE IF NOT EXISTS "Account" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, "providerAccountId")
);

-- Criar tabela Session (NextAuth)
CREATE TABLE IF NOT EXISTS "Session" (
  id TEXT PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

-- Criar tabela VerificationToken
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  UNIQUE(identifier, token)
);

-- Criar tabela Favorite
CREATE TABLE IF NOT EXISTS "Favorite" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "contentId" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  title TEXT NOT NULL,
  poster TEXT,
  year TEXT,
  rating TEXT,
  "addedAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE("userId", "contentId")
);

-- Habilitar RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Favorite" ENABLE ROW LEVEL SECURITY;

-- Políticas para User (sem autenticação por enquanto)
CREATE POLICY "Allow insert for signup"
  ON "User" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own data"
  ON "User" FOR SELECT
  USING (id = (SELECT auth.uid()::text));

CREATE POLICY "Users can update own data"
  ON "User" FOR UPDATE
  USING (id = (SELECT auth.uid()::text))
  WITH CHECK (id = (SELECT auth.uid()::text));

-- Políticas para Account
CREATE POLICY "Users can read own accounts"
  ON "Account" FOR SELECT
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "Users can insert own accounts"
  ON "Account" FOR INSERT
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

-- Políticas para Session
CREATE POLICY "Users can read own sessions"
  ON "Session" FOR SELECT
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "Users can insert own sessions"
  ON "Session" FOR INSERT
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "Users can delete own sessions"
  ON "Session" FOR DELETE
  USING ("userId" = (SELECT auth.uid()::text));

-- Políticas para VerificationToken (restrita)
CREATE POLICY "Verification tokens are restricted"
  ON "VerificationToken" FOR ALL
  USING (false)
  WITH CHECK (false);

-- Políticas para Favorite
CREATE POLICY "Users can read own favorites"
  ON "Favorite" FOR SELECT
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "Users can insert own favorites"
  ON "Favorite" FOR INSERT
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "Users can delete own favorites"
  ON "Favorite" FOR DELETE
  USING ("userId" = (SELECT auth.uid()::text));

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS "idx_Account_userId" ON "Account"("userId");
CREATE INDEX IF NOT EXISTS "idx_Session_userId" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "idx_Favorite_userId" ON "Favorite"("userId");
CREATE INDEX IF NOT EXISTS "idx_Favorite_userId_contentId" ON "Favorite"("userId", "contentId");
