build:
	@poetry export --without-hashes  -f requirements.txt | sed 's/-e //g' > requirements.txt
	@docker-compose build

up:
	@docker-compose up

upd:
	@docker-compose up -d

down:
	@docker-compose down