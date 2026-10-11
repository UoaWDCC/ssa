import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'
import { DEFAULT_SITE_SETTINGS } from './src/globals/siteSettingsDefaults'

void (async () => {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: DEFAULT_SITE_SETTINGS,
  })
  console.log('UPDATED site-settings global row with current default content')

  const saved = await payload.findGlobal({ slug: 'site-settings' })
  console.log(JSON.stringify(saved, null, 2))
})()
