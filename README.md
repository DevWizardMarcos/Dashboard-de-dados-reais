# Marketing Metrics Dashboard

Dashboard demonstrativo de marketing desenvolvido com React, TypeScript, Vite e Tailwind CSS.

O projeto usa dados simulados em JSON para apresentar uma experiencia completa de painel analitico: metricas, graficos, filtros, busca e tabela de campanhas.

## Funcionalidades

- Cards de resumo com alcance, engajamento, sessoes e conversoes.
- Grafico de crescimento por horario.
- Grafico comparativo por canal.
- Busca por nome de campanha ou canal.
- Filtro por periodo: Hoje, 7 dias e 30 dias.
- Filtro por status: Todos, Ativa, Pausada e Finalizada.
- Navegacao lateral com rolagem suave entre secoes.
- Tabela responsiva de campanhas.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra no navegador:

```text
http://127.0.0.1:5173
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Dados

Os dados demonstrativos ficam em `public/db.json`.

Tambem existe uma copia em `db.json` na raiz do projeto para facilitar testes com ferramentas como JSON Server, se necessario.

## Sobre o Projeto

Este dashboard foi criado para portfolio e apresentacao profissional. Ele simula um painel de acompanhamento de campanhas digitais, com foco em interface, organizacao de dados, filtros e visualizacao clara de metricas.
