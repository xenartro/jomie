# Jomie: your place in the digital world

Requirements:
- Composer. https://getcomposer.org/download/
- PHP 7.4+
- Node stable
- Yarn
- SQLite extension enabled

```bash
# backend
cd backend
composer install
copy .env.example .env
touch database/database.sqlite
# Make sure you have a .env file with DB_CONNECTION=sqlite
php artisan migrate
php artisan serve

# frontend
cd frontend
yarn install
yarn start
```

 ## Something went wrong

 Most likely, you're missing dependencies or migrations. Try the following:

 - `cd frontend && yarn install`
 - `cd backend && composer install`
 - `cd backend && php artisan migrate`
 
