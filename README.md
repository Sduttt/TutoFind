# Tutofind

**A simple platform concept for connecting learners with tutors and educational resources — created purely as a learning & practice project.**

This is **not** a production-ready application or commercial service. 

The main purpose of open-sourcing this code is to serve as a reference for personal learning and academic projects  

**Please read the license section carefully before using any part of this code.**

## ✨ Features Implemented (so far)

- User registration & login (student / tutor roles)
- Basic profile creation (tutor: subjects, location, hourly rate, bio)
- Simple search/filter tutors by subject, topic etc
- View tutor profile with listed subjects and contact button
- Create post for tutors based on what they want to teach
- Connect and chat with tutor/student

## 🖥️ Tech Stack

- React Native 
- React Navigation
- Tailwind CSS  
- Zustand
- Supabase for backend


## 🚀 How to Run Locally (for study & learning only)

### Prerequisites

- Node.js 22+
- npm or yarn
- Supabase account

### 1. Clone the repository

```bash
git clone https://github.com/sduttt/tutofind.git
cd tutofind
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create Supabase Project

Create the project in your supabase account and create the necessery tables and buckets. For more informations about it, connect me directly.

### 4. Env variables 

Create .env file and provide values for these:
```bash
SUPABASE_URL="your value"
SUPABASE_API_KEY="your value"
```

### 5. Environment setup

Set up the proper enviorenment to run a React Native application in your local computer including installing required softwares like Android studio, Xcode.

### 6. Run the applicatiion

Run the following command in 2 different terminal window:
```bash
npm start  ###and
npm run android ###for android
npm run ios ###for ios
```

## License

This project (tutofind) is licensed under **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)**.

- You can view, copy, and share the code for **personal, educational, or non-commercial learning purposes**.
- You **must** give credit to the original author (Subham Dutta / @sdutttttt).
- You **cannot** modify the code and distribute the changes.
- You **cannot** use it for any commercial purpose, monetization, paid products, services, or courses.

Full license → https://creativecommons.org/licenses/by-nc-nd/4.0/