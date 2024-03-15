# Especifica a imagem base
FROM node:16-alpine

# Define o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copia os arquivos package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia os arquivos do projeto para o diretório de trabalho
COPY . .

# Compila o projeto
RUN npm run build

# Expõe a porta que a aplicação utiliza
EXPOSE 8006

# Comando para executar a aplicação
CMD ["npm", "run", "start:prod"]
