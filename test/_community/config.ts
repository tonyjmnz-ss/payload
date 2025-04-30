import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { MediaCollection } from './collections/Media/index.js'
import { PostsCollection, postsSlug } from './collections/Posts/index.js'
import { MenuGlobal } from './globals/Menu/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const PG_DATABASE = 'local'
const PG_HOST = '127.0.0.1'
const PG_PASSWORD = '123456'
const PG_PORT = '54321'
const PG_SCHEMA = 'payload_repro'
const PG_USERNAME = 'postgres'

const DATABASE_URI = `postgres://${PG_USERNAME}:${encodeURIComponent(PG_PASSWORD || '')}@${PG_HOST}${PG_PORT ? `:${PG_PORT}` : ''}/${PG_DATABASE}`

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [PostsCollection, MediaCollection],
  secret: 'notsecret',
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  db: postgresAdapter({
    schemaName: PG_SCHEMA,
    pool: {
      connectionString: DATABASE_URI || '',
    },
  }),
  editor: lexicalEditor({}),
  globals: [
    // ...add more globals here
    MenuGlobal,
  ],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })
    await payload.create({
      collection: postsSlug,
      data: {
        title: 'example post',
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
