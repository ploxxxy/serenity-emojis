import { stringify } from '@std/yaml'
import { BlobReader, BlobWriter, ZipReader } from '@zip-js/zip-js'

const cleanEmojiName = (name: string) => {
  return name
    .replaceAll('&amp; ', '')
    .replaceAll(' ', '_')
    .replaceAll(/\W/g, '')
    .toLowerCase()
}

const cleanFileName = (filename: string) => {
  return filename.replaceAll('+', '').toLowerCase()
}

const downloadEmojis = async () => {
  const res = await fetch(
    'https://emoji.serenityos.net/SerenityOS-RGI-emoji.zip'
  )
  const blob = await res.blob()

  const zipFileReader = new BlobReader(blob)
  const zipReader = new ZipReader(zipFileReader)
  const entries = await zipReader.getEntries()

  for (const entry of entries) {
    if (entry.filename == 'README.txt') continue

    const writer = new BlobWriter()
    if (!entry.getData) continue
    await entry.getData(writer)

    const blob = await writer.getData()

    if (entry.filename == 'LIST_OF_EMOJI.txt') {
      return await blob.text()
    }

    const buffer = await blob.arrayBuffer()

    try {
      await Deno.writeFile(
        'output/pack/textures/default/serenity/' + cleanFileName(entry.filename),
        new Uint8Array(buffer)
      )
    } catch (e) {
      console.error('Failed to write file', entry.filename)
      console.error(e)
    }
  }
}

const parseEmojis = (emojiList: string) => {
  const matches = emojiList.matchAll(/(.+?) - (.+) - (.+)/g)

  const emojis: string[][] = []

  for (const match of matches) {
    emojis.push([match[1], cleanEmojiName(match[2]), cleanFileName(match[3])])
  }

  return emojis
}

const createYaml = (emojis: string[][]) => {
  const obj: Record<string, unknown> = {}

  emojis.forEach((emoji, index) => {
    const [_symbol, name, filename] = emoji

    const textureName = filename.replace('.png', '')
    const placeholder = `:${name}:`

    // Create a unicode character for the emoji, starting in the Private Use Area (E000)
    const unicode = 0xE000 + index
    const char = String.fromCharCode(unicode)

    obj[name] = {
      texture: `default/serenity/${textureName}`,
      is_emoji: true,
      ascent: 8,
      height: 8,
      chat: {
        tabcomplete: true,
        placeholders: [placeholder],
        permision: `oraxen.serenity.${name}`,
      },
      char,
    }
  })

  return stringify(obj)
}

const main = async () => {
  try {
    console.log('Creating output folder...')
    Deno.mkdir('output/glyphs', { recursive: true })
    Deno.mkdir('output/pack/textures/default/serenity', { recursive: true })
  } catch (e) {
    console.error('Failed to create output folder')
    console.error(e)
  }

  let emojiList: string | undefined

  try {
    console.log('Downloading the emoji archive...')
    emojiList = await downloadEmojis()
  } catch (e) {
    console.error('Failed to download the emoji archive')
    console.error(e)
  }

  if (!emojiList) {
    throw new Error('Failed to download emoji archive')
  }

  const emojis = parseEmojis(emojiList)
  const yaml = createYaml(emojis)

  try {
    console.log('Writing the YAML file...')
    await Deno.writeTextFile('output/glyphs/serenity.yml', yaml, {
      create: true,
    })
  } catch (e) {
    console.error('Failed to write the YAML file')
    console.error(e)
  }
}

main()