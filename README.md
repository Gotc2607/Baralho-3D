# Baralho-3D

Projeto de um baralho interativo em 3D com Three.js, executado como site estático (sem build).

## Como executar localmente

1. Abra um servidor HTTP simples na pasta do projeto.
   - Com Python 3:
     ```bash
     python3 -m http.server 5173
     ```
   - Ou, se tiver Node instalado, com `npx`:
     ```bash
     npx serve -l 5173 .
     ```
2. Acesse `http://localhost:5173` no navegador (Chrome/Edge/Firefox modernos).

Controles:
- Arraste com o mouse para orbitar
- Scroll para zoom
- Clique numa carta para virar

## Estrutura
- `index.html`: página principal com import de módulos via CDN
- `main.js`: cena Three.js, cartas e interações

## Próximos passos (ideias)
- Texturas completas das 52 cartas
- Embaralhar, distribuir e animações de empilhar
- UI para escolher baralhos/temas
