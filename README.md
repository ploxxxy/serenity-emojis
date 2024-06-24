# SerenityOS emoji pack for Oraxen

[<img src="https://img.shields.io/github/downloads/ploxxxy/serenity-emojis/latest/Oraxen.zip">](https://github.com/ploxxxy/serenity-emojis/releases/latest) [<img src="https://img.shields.io/badge/View_all_emojis-8A2BE2">](https://emoji.serenityos.net/)

This script generates more than 1,700 emoji glyphs for your Minecraft server using [Oraxen](https://www.spigotmc.org/resources/%E2%98%84%EF%B8%8F-oraxen-custom-items-blocks-emotes-furniture-resourcepack-and-gui-1-18-1-21.72448/), thanks to [SerenityOS](https://serenityos.org/) and [Are we emoji yet?](https://emoji.serenityos.net/) website.

### Some of the emojis in-game, in no particular order
![alt text](images/image.png)
![alt text](images/image-1.png)
![alt text](images/image-2.png)

## Building the pack yourself
Using [Deno](https://docs.deno.com/runtime/manual#install-deno) (version 1.44.4 used):
```sh
# Run inside of the project folder

deno task start

mv output/* path_to_your_server/plugins/Oraxen
```
