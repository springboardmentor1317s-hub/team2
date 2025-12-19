# 🛠️ Detailed Installation (Commands) : 
If you are setting this up for the first time, you will need to install these specifically:

**For Backend:**
```bash
cd backend
npm install express mongoose dotenv cors jsonwebtoken bcryptjs
# For development
npm install -D nodemon
# To run the backend 
node server.js
```
**For Frontend:**
```bash
cd frontend
npm i
npm install lucide-react recharts clsx tailwind-merge
# Tailwind CSS Initialization
npx tailwindcss init -p
# To run the frontend 
npm run dev

```
# 🔑 Environment Configuration

**Ensure your backend/.env file contains the following keys:**
```bash
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/CampusEventHub
JWT_SECRET=your_jwt_secret_key_here
```
