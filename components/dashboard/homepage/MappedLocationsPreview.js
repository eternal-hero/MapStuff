import React, { useEffect, useState } from 'react'
import AppBadge from '../../../components/global/AppBadge'
import AppTable from '../../../components/global/AppTable'

import { useQuery } from '@apollo/client'
import { LOCATIONS_QUERY } from '../../../graphql/dashboard/index/location.query'
import { useTranslation } from 'react-i18next'

const MappedLocationsPreview = ({ children, session }) => {
  const { t } = useTranslation()

  const headers = [
    t('mapped_locations.table.location_name'),
    t('mapped_locations.table.address'),
    t('mapped_locations.table.email'),
    t('mapped_locations.table.status'),
  ]

  const { loading, error, data } = useQuery(LOCATIONS_QUERY, {
    variables: {
      input: {
        created_by_id: session.user.sub.replace('auth0|', ''),
      },
    },
  })
  const [locations, setLocations] = useState([])

  useEffect(() => {
    if (!loading && data) {
      setLocations(
        data.locations.map((obj) =>
          Object.values([
            obj['name'],
            obj['properties']['address'],
            obj['properties']['email'],
            <AppBadge
              label={obj['status']}
              className={obj['status'] === 'Published' ? 'green' : 'red'}
            />,
          ]),
        ),
      )
    }
  }, [loading, data])

  if (loading) return null
  if (error) return `Error! ${error}`

  return (
    <>
      <div>
        <div className="mt-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            {t('mapped_locations.title')}
          </h2>
          <AppTable headers={headers} items={locations} />
        </div>
      </div>
    </>
  )
}

export default MappedLocationsPreview
