# Decisões Técnicas — Market Imobi CRM

Registro permanente de decisões arquiteturais e estratégicas tomadas durante o desenvolvimento.
Atualizar este arquivo a cada decisão que afete infraestrutura, integrações ou regras de negócio.

---

## [DEC-001] Número WhatsApp dedicado para Cloud API
**Data:** 2026-11-24
**Status:** DEFINITIVO

### Decisão
O Market Imobi CRM utilizará um **número de WhatsApp exclusivamente dedicado** para a Cloud API oficial da Meta.

### Número comercial preservado
O número `+55 21 96592-8399` é o número comercial ativo do corretor e **não será alterado de nenhuma forma**:
- Não será migrado para Cloud API
- Não terá Coexistence (App + Cloud API simultâneos) habilitado
- Não será registrado como remetente da Cloud API
- Links comerciais existentes (wa.me/5521965928399) permanecem intactos
- Nenhum dispositivo associado será desvinculado

### Número dedicado (futuro)
Um novo número será adquirido especificamente para o CRM. Requisitos:
- Número brasileiro (DDI +55) não previamente associado ao WhatsApp
- Registrado como Business Phone Number numa WABA (WhatsApp Business Account) verificada
- Templates aprovados pela Meta antes de qualquer envio a leads reais
- Usado exclusivamente para automações do CRM

### Fase de testes (atual)
Enquanto o número dedicado não está disponível:
- Usar o **número de teste gratuito do Meta App Developer** (Getting Started)
- Suporta até 5 destinatários de teste registrados
- Template `hello_world` (en_US) pré-aprovado
- Secrets configurados via `configure-wa-secrets.yml` (GitHub Actions)

### Objetivos do número dedicado
- Atendimento automatizado de leads
- Qualificação imobiliária (Método 4M)
- Integração com IA
- Agendamento de visitas
- Follow-up automático
- Transferência para atendimento humano (corretor)

### Impacto no código
Nenhuma mudança de código necessária: o Worker lê `WA_PHONE_NUMBER_ID` e `WA_ACCESS_TOKEN`
via secrets Cloudflare. Trocar para o número dedicado = rotacionar esses dois secrets.

### Referências
- Missão 7: Módulo WhatsApp Cloud API (commit `0c27d4a`)
- Workflow: `.github/workflows/configure-wa-secrets.yml`
- Serviço: `crm-worker/src/services/whatsapp.ts`

---

## [DEC-002] Envio automático a leads reais bloqueado até homologação
**Data:** 2026-11-24
**Status:** DEFINITIVO (Fase 1)

### Decisão
Nenhuma mensagem WhatsApp será enviada automaticamente a leads reais até que:
1. O número dedicado esteja registrado e verificado na WABA
2. Os templates em português (`pt_BR`) estejam aprovados pela Meta
3. O consentimento LGPD para comunicações via WhatsApp esteja implementado no formulário de captação
4. Os fluxos de automação tenham passado por homologação completa em staging

### Implementação atual (Fase 1)
- Endpoint `POST /api/v1/whatsapp/send-test` — apenas admins, apenas destinatários de teste
- Nenhuma trigger automática em eventos de lead (criação, estágio, etc.)
- Campo `tipo` na tabela `whatsapp_mensagens` distingue `'test'` de `'lead_new'` / `'visit_reminder'`

---

## [DEC-003] Separação de Workers por ambiente
**Data:** anterior à Missão 6
**Status:** DEFINITIVO

| Worker | D1 | Propósito |
|--------|-----|-----------|
| `market-imobi-crm-staging` | `market-imobi-staging` (`f214ad6c`) | Desenvolvimento e testes |
| `market-imobi-crm` | `market-imobi-prod` (`00f11ba4`) | Produção |
| `market-imobi-backup` | — | Backup de emergência — nunca alterar |

Produção e backup **nunca são modificados** por workflows de staging ou migrations de desenvolvimento.
