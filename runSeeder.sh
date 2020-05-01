## Shell code to run the seeder with the dotenv set in the shell because of
## the ES6 modules.

node -r dotenv/config ./seeder.js $1 dotenv_config_path=./config/config.env