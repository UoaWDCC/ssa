import type { CollectionConfig } from 'payload'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        if (data.isSponsorOfTheWeek !== true) {
          return data
        }

        const weeklySponsors = await req.payload.find({
          collection: 'sponsors',
          where: {
            isSponsorOfTheWeek: {
              equals: true,
            },
          },
          limit: 0,
          req,
        })

        const currentSponsorId = operation === 'update' ? originalDoc?.id : undefined

        await Promise.all(
          weeklySponsors.docs
            .filter((sponsor) => sponsor.id !== currentSponsorId)
            .map((sponsor) =>
              req.payload.update({
                collection: 'sponsors',
                id: sponsor.id,
                data: {
                  isSponsorOfTheWeek: false,
                },
                req,
              }),
            ),
        )

        return data
      },
    ],
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'websiteUrl',
      type: 'text',
    },
    {
      name: 'isSponsorOfTheWeek',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'FOOD',
      options: [
        { label: 'Food', value: 'FOOD' },
        { label: 'Retail', value: 'RETAIL' },
        { label: 'Services', value: 'SERVICES' },
        { label: 'Entertainment', value: 'ENTERTAINMENT' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'memberPerks',
      type: 'text',
    },
  ],
}
