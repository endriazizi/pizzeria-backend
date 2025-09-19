# 1️⃣ Inizializza il repository (se non lo hai già fatto)

git init

# 2️⃣ Aggiungi il remote (sostituisci con il tuo repo)

git remote add origin https://github.com/TUO-UTENTE/TUO-REPO-BACKEND.git
git remote add origin https://github.com/endriazizi/pizzeria-backend.git

# 3️⃣ Aggiungi tutti i file del progetto al commit

git add .

# 4️⃣ Crea un commit con un messaggio chiaro

git commit -m "🚀 Prima versione backend con logging Winston e connessione DB"

# 5️⃣ Push su branch principale (main o master)

git branch -M main
git push -u origin main
