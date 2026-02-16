# Migrações de Banco de Dados

## Para Desenvolvimento Local

As migrações já foram aplicadas no seu ambiente local.

## Para Produção/Servidor Remoto

### Opção 1: Rodar migração via npm script

```bash
# No servidor de produção, com DATABASE_URL configurada
npm run db:migrate
```

### Opção 2: Rodar SQL direto no banco

Se preferir aplicar manualmente no banco de dados de produção:

```sql
-- Adicionar coluna video_url (se não existir)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_url TEXT;
```

### Opção 3: Via psql

```bash
# Conectar ao banco de produção e rodar:
psql $DATABASE_URL -c "ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_url TEXT;"
```

## O que mudou?

- ✅ Adicionada coluna `video_url` (TEXT, opcional) na tabela `properties`
- ✅ Permite armazenar links de vídeos do YouTube para cada imóvel

## Verificar se a migração foi aplicada

```sql
-- Verificar estrutura da tabela properties
\d properties

-- Ou via SQL
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'properties';
```

## Arquivos de Migração

- `migrations/0000_free_serpent_society.sql` - Schema completo (para novos ambientes)
- `migrate.ts` - Script TypeScript para aplicar migrações automaticamente

## Importante

⚠️ **Antes de fazer deploy em produção:**

1. Faça backup do banco de dados
2. Rode a migração em um ambiente de staging/teste primeiro
3. Verifique que a coluna foi adicionada corretamente
4. Só então aplique em produção
