# 1️⃣ Inizializza il repository (se non lo hai già fatto)

git init

# 2️⃣ Aggiungi il remote (sostituisci con il tuo repo)

git remote add origin https://github.com/TUO-UTENTE/TUO-REPO-BACKEND.git
git remote add origin https://github.com/endriazizi/pizzeria-backend.git

# 3️⃣ Aggiungi tutti i file del progetto al commit

git add .

# 4️⃣ Crea un commit con un messaggio chiaro

git commit -m "🚀 Prima versione backend con logging Winston e connessione DB"

git commit -m "🚀 node version"

# 5️⃣ Push su branch principale (main o master)

git branch -M main
git push -u origin main

npm run start

rmdir /s /q node_modules

rmdir /s /q node_modules && del /f /q package-lock.json
rmdir /s /q node_modules → rimuove la cartella node_modules e tutto il suo contenuto senza

      `💾 Connessione al DB riuscita! Host: ${process.env.DB_HOST}, User: ${process.env.DB_USER}, Database: ${process.env.DB_NAME},Password: ${process.env.DB_PASSWORD}`

librerire per plesk versione 17.9.1
{
"dependencies": {
"express": "^4.18.2",
"mysql2": "^3.5.2",
"dotenv": "^16.3.1",
"jsonwebtoken": "^9.0.2",
"bcryptjs": "^2.4.3",
"winston": "^3.9.0",
"joi": "^17.10.0",
"cors": "^2.8.5",
"morgan": "^1.10.0"
}
}

versione per node 18:

"dependencies": {
"bcryptjs": "^3.0.2",
"cors": "^2.8.5",
"dotenv": "^17.2.2",
"express": "^5.1.0",
"joi": "^18.0.1",
"jsonwebtoken": "^9.0.2",
"morgan": "^1.10.1",
"mysql2": "^3.15.0",
"winston": "^3.17.0"
},
