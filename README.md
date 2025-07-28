# 📦 Test Technique – Groupe MIH

## 🎯 Objectif du projet

Ce projet a été réalisé dans le cadre du test d’évaluation technique proposé par le Groupe MIH.  
Il s'agit d'une interface simple permettant d’afficher les produits d’une boutique Shopify, avec la possibilité de consulter et de modifier le stock.

---

## ⚙️ Instructions d'installation

### 🗄️ Backend

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/LionelDuff/InvenTree-backend.git
   cd mon-projet/backend
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Créer un fichier `.env` à la racine du dossier backend avec le contenu suivant :
   ```
   SHOP=nom-de-la-boutique.myshopify.com
   ADMIN_API_ACCESS_TOKEN=clé-d’accès-admin
   API_KEY=clé-publique-shopify  
   API_SECRET=clé-secrète-shopify 
   SCOPES=["read_products", "read_inventory", "write_inventory"]
   ```

4. Lancer le serveur :
   ```bash
   npm start
   ```

### 🖥️ Frontend

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/LionelDuff/InvenTree-frontend.git
   cd mon-projet/frontend
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Créer un fichier `.env` à la racine du dossier frontend :
   ```
   REACT_APP_API_URL=url-du-backend
   ```

4. Lancer le frontend :
   ```bash
   npm start
   ```

---

## 🔑 Configuration des clés Shopify

Pour faire fonctionner l’API Shopify :

1. Connectez-vous à votre boutique Shopify.
2. Créez une application personnalisée via : Paramètres > Applications > Développer des
applications.
3. Activez les permissions suivantes pour l’API Admin REST :
- read_products
- read_inventory
- write_inventory
4. Générez votre Access Token.
5. Renseigner les variables `SHOP`, `API_KEY`, `API_SECRET` et `ADMIN_API_ACCESS_TOKEN` dans le fichier `.env` du backend.

---

## 🔐 Nom de l'application, scopes choisis et leur utilisation

- **Nom de l’application Shopify** : `InvenTree`  

- **Scopes sélectionnés** : `"read_products", "read_inventory", "write_inventory"`

---

### 📋 Détail des scopes et de leur usage dans le projet

| Scope            | Description                                                               | Utilisation concrète dans le projet                                                             |
|------------------|---------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `read_products`  | Permet de lire les produits, leurs titres, identifiants, et variantes.    | Utilisé pour afficher la liste des produits et variantes dans le tableau React.                 |
| `read_inventory` | Autorise l'accès aux niveaux de stock des produits.                       | Utilisé pour récupérer et afficher la quantité de stock disponible par variante.                |
| `write_inventory`| Autorise la modification des niveaux de stock.                            | Utilisé pour mettre à jour manuellement le stock via un champ de saisie dans l’interface React. |

Ces autorisations sont **essentielles** pour permettre à l’application d’interagir dynamiquement avec les produits Shopify :
- Lecture des **informations produits** pour afficher les données dans l’interface.
- Consultation et **mise à jour du stock** en temps réel, sans passer par l'interface Shopify.

---

## ▶️ Comment exécuter le projet

1. Lancer le backend :
   ```bash
   cd backend && npm start
   ```

2. Dans un second terminal, lancer le frontend :
   ```bash
   cd frontend && npm start
   ```

## 🧱 Structure du code

```
mon-projet/
│
├── backend/
│   ├── routes/
│   │   └── index.js          # Route pour mise à jour du stock
│   ├── app.js                # Point d'entrée du backend
│   └── .env                  # Configuration des variables d’environnement
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── product_row.js # Composant d’affichage d’une ligne de produit
│   │   ├── App.js             # Composant principal
│   │   └── index.js           # Point d’entrée React
│   └── .env                   # Variable pour l’URL de l’API
```

---

## 🚀 Suggestions d'améliorations

- Authentification sécurisée pour restreindre l’accès à l’interface de gestion
- Affichage plus complet des informations produit (images, statut, etc.)
- Ajout de notifications en cas d’erreur ou de succès (via toast)

---

## ⏱️ Temps passé

Environ **10 heures** réparties entre :

- Mise en place du backend + intégration API Shopify
- Construction de l’interface utilisateur avec React
- Ajustements UI / UX

---

N'hésitez pas à me contacter pour toute question ou clarification ! 😊
