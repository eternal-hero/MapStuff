import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { PLANS_QUERY } from '../../../../graphql/dashboard/admin/cms/plan.query'
import { PLANS_MUTATION_UPDATE_MANY } from '../../../../graphql/dashboard/admin/cms/plan.mutation'
import AppTable from '../../../global/AppTable'

import Text from '../cms/forms/Text'

import AppButton from '../../../global/AppButton'
import AppToggle from '../../../global/AppToggle'
import AppNotification from '../../../../components/global/AppNotification'

import * as Realm from 'realm-web'
const app = Realm.App.getApp(process.env.REALM_APP_ID)

const NOTIFICATION_DEFAULT = {
  isOpen: false,
  title: '',
  content: '',
}

const PLAN_NAMES = {
  FREE_PLAN: 'FREE PLAN',
  LITE_PLAN: 'LITE PLAN',
  PLUS_PLAN: 'Plus PLAN',
}

const PLAN_FIELD_LABELS_MAP = new Map()
PLAN_FIELD_LABELS_MAP.set('filterButtonName', 'Filter Button Name')
PLAN_FIELD_LABELS_MAP.set('fontColor1', 'Font Color 1')
PLAN_FIELD_LABELS_MAP.set('header', 'Header')
PLAN_FIELD_LABELS_MAP.set('headingBackgroundColor', 'Heading Background Color')
PLAN_FIELD_LABELS_MAP.set('language', 'Language')
PLAN_FIELD_LABELS_MAP.set('marker', 'Marker')
PLAN_FIELD_LABELS_MAP.set('provider', 'Provider')
PLAN_FIELD_LABELS_MAP.set('updateHeight', 'Update Height')
PLAN_FIELD_LABELS_MAP.set('zoomLevel', 'Zoom Level')
PLAN_FIELD_LABELS_MAP.set('mapStyles', 'Map Styles')
PLAN_FIELD_LABELS_MAP.set('maxLocation', 'Max Location')

const AclPlans = () => {
  const PlanList = () => {
    const { loading, error, data } = useQuery(PLANS_QUERY)

    const [plans, setPlans] = useState([])
    const [notification, setNotification] = useState(NOTIFICATION_DEFAULT)

    const [
      updatePlans,
      { data: mutationData, loading: mutationLoading, error: mutationError },
    ] = useMutation(PLANS_MUTATION_UPDATE_MANY)

    const handleSaveSettings = () => {
      const promises = []

      ;[0, 1, 2].forEach((planIndex) => {
        const planPromise = new Promise(async (resolve, reject) => {
          const query = {
            _id: plans[planIndex]._id,
          }
          const set = {
            cms: plans[planIndex].cms,
          }

          try {
            await updatePlans({
              variables: {
                query,
                set,
              },
            })

            resolve()
          } catch (e) {
            console.log('Error on saving plan', e)
            reject()
          }
        })

        promises.push(planPromise)
      })

      Promise.all(promises)
        .then(() => {
          setNotification({
            isOpen: true,
            content: 'Your changes have been applied to plans.',
            title: 'CMS Settings Saved',
          })
        })
        .catch((e) => {
          console.log(e)
          setNotification({
            isOpen: true,
            content: 'There was an error saving plans.',
            title: 'CMS Settings Error',
          })
        })
    }

    useEffect(() => {
      if (!loading && data) {
        // sort based on FREE PLAN - LITE PLAN - PLUS PLAN
        data.plansAcls.sort((a, b) => {
          if (
            a.name === PLAN_NAMES.FREE_PLAN &&
            b.name !== PLAN_NAMES.FREE_PLAN
          )
            return -1
          if (
            a.name === PLAN_NAMES.LITE_PLAN &&
            b.name !== PLAN_NAMES.LITE_PLAN
          )
            return 1

          return 0
        })

        setPlans(data.plansAcls)
      }
    }, [loading, data])

    const handleUpdateLocation = (plan, value) => {
      // find target plan
      const targetPlanIndex = plans.findIndex((p) => p.name === plan.name)

      if (targetPlanIndex !== -1) {
        // update target plan location if it exists
        // create a deep copy of plans
        const copiedPlans = JSON.parse(JSON.stringify(plans))
        copiedPlans[targetPlanIndex].cms.maxLocation = Number(value)

        setPlans(copiedPlans)
      }
    }

    const handleUpdateStyles = (planIndex, field, isEnabled) => {
      // create a deep copy of plans
      const copiedPlans = JSON.parse(JSON.stringify(plans))
      // find target style
      const targetStyleIndex = copiedPlans[
        planIndex
      ].cms.mapBoxMapSettings.mapStyles.findIndex(
        (style) => style.value === field.value,
      )

      if (targetStyleIndex !== -1) {
        // update target style if it exists
        copiedPlans[planIndex].cms.mapBoxMapSettings.mapStyles[
          targetStyleIndex
        ].enable = isEnabled

        setPlans(copiedPlans)
      }
    }

    const handleUpdateSettingToggle = (planIndex, toggleKey, isEnabled) => {
      // create a deep copy of plans
      const copiedPlans = JSON.parse(JSON.stringify(plans))
      if (
        typeof copiedPlans[planIndex].cms.mapBoxMapSettings[toggleKey] !==
        'undefined'
      ) {
        copiedPlans[planIndex].cms.mapBoxMapSettings[toggleKey] = isEnabled

        setPlans(copiedPlans)
      }
    }

    return (
      <div className="sheet">
        {!loading && plans.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                {plans.map((plan) => (
                  <th key={plan.name}>{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{PLAN_FIELD_LABELS_MAP.get('maxLocation')}</td>
                {plans.map((plan) => (
                  <td key={plan.name}>
                    <Text
                      type="number"
                      value={plan.cms.maxLocation}
                      onChange={(e) =>
                        handleUpdateLocation(plan, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
              {Object.keys(plans[0]?.cms.mapBoxMapSettings).map(
                (settingKey) => (
                  <tr>
                    <td>{PLAN_FIELD_LABELS_MAP.get(settingKey)}</td>

                    {[0, 1, 2].map((i) =>
                      Array.isArray(
                        plans[i]?.cms.mapBoxMapSettings[settingKey],
                      ) ? (
                        <td>
                          {plans[i]?.cms.mapBoxMapSettings[settingKey].map(
                            (field) => (
                              <div
                                key={field.label}
                                className="flex items-center m-2"
                              >
                                <span className="mr-1">{field.label}</span>
                                <AppToggle
                                  value={field.enable}
                                  onChange={(e) =>
                                    handleUpdateStyles(i, field, e)
                                  }
                                />
                              </div>
                            ),
                          )}
                        </td>
                      ) : (
                        <td>
                          <AppToggle
                            value={plans[i]?.cms.mapBoxMapSettings[settingKey]}
                            onChange={(e) =>
                              handleUpdateSettingToggle(i, settingKey, e)
                            }
                          />
                        </td>
                      ),
                    )}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}

        <br />
        <br />
        <AppButton
          className="secondary"
          label="Cancel"
          handleClick={() => alert('not working ')}
        />
        <AppButton
          className="primary"
          label="Save Settings"
          handleClick={handleSaveSettings}
          disabled={mutationLoading}
        />
        <AppNotification
          isOpen={notification.isOpen}
          setIsOpen={() => setNotification(NOTIFICATION_DEFAULT)}
          content={notification.content}
          title={notification.title}
        />
      </div>
    )
  }

  return <PlanList />
}

export default AclPlans
