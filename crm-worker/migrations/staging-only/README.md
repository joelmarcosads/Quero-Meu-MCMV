# Migrations — Apenas Staging / PoC

Este diretório contém arquivos SQL que **NÃO devem ser aplicados em produção**.

## Arquivo neste diretório

| Arquivo | Conteúdo | Aplica em produção? |
|---------|----------|---------------------|
| `0002_seed_fictitious_data.sql` | 3 usuários fictícios, 2 empreendimentos fictícios, 4 tipologias fictícias | ❌ NUNCA |

## Por que está aqui?

O arquivo original estava em `crm-worker/migrations/` com prefixo `0002_`, o mesmo
prefixo da migration estrutural `0002_add_leads_dados_extras.sql`.

Isso causaria **conflito de versão** na tabela `_migrations` se ambos fossem aplicados
na mesma instância D1.

A cópia foi movida para cá e o original renomeado para `.staging-only` para evitar que
o `wrangler d1 migrations apply` o detecte automaticamente.

## Migrations corretas para produção

Aplique **exatamente** estas, nesta ordem:

```bash
# 1. Schema completo + configurações LGPD
wrangler d1 migrations apply market-imobi-prod --env production --remote \
  --migration-file migrations/0001_initial_schema.sql

# 2. Coluna dados_extras_json (não-destrutiva)
wrangler d1 migrations apply market-imobi-prod --env production --remote \
  --migration-file migrations/0002_add_leads_dados_extras.sql
```

Ou via `wrangler d1 migrations apply` padrão — o wrangler ignora `.staging-only`
e aplica somente os `.sql` numerados em `migrations/`.
