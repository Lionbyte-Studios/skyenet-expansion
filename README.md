# Skyenet Expansion

a goofy space game >:3

## Dev

Make sure port `5173`, `8081` and `8082` are not used by any other applications.
For the API to work, you need to install and run MongoDB. Copy the `config.example.json` to `config.json` and modify the `mongo_uri` according to your MongoDB setup.

`pnpm run dev` - start the dev server & client

## Docker

Run the docker container with:

```bash
docker compose up --build
```

to run it in the background, add `-d` to the end, and then use `docker compose down` to stop the background container.

## Official Roadmap:

- youre a spaceship
- starts at starter ship
- destroy asteroids or other ships for them to drop loot
- upgrade ship (there can be different paths too)

## Todo List

- [x] Make animation/texture for spaceship thrust
- [ ] Asteroids
  - [ ] Collision with spaceship -> damage
  - [ ] Spawn randomly (?)
  - [ ] Different sizes
  - [ ] Destroy them -> They drop materials/resources
- [ ] Spaceship upgrading
- [ ] Spaceship shooting stuff (lasers!!)
- [ ] Spaceship combat
- [ ] Power-ups
- [ ] Multiplayer
  - [ ] Host/Join game
  - [ ] Chat
- [ ] Inventory
  - [ ] Show items in inventory
  - [ ] Use items

- [ ] Resources
- [ ] Bosses

### Resources

# Helpful things to use for the project

[Space Background Generator](https://deep-fold.itch.io/space-background-generator)

[Planet Generator](https://deep-fold.itch.io/pixel-planet-generator)
