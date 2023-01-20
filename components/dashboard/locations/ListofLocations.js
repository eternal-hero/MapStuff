import React, { useState, useEffect, Fragment } from 'react'
/* CD (EV on 20200204): import useQuery apollo client */
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import * as XLSX from "xlsx";

import {
  LOCATIONS_QUERY,
  LOCATION_DELETE,
} from '../../../graphql/dashboard/locations/location.query'

import {
  LOCATION_QUERY as LOCATION_QUERY_ALL  
} from "../../../graphql/dashboard/admin/apps/location.query";

import { PLAN_QUERY } from '../../../graphql/dashboard/locations/plan.query'

import AppSlideOverPanel from '../../global/AppSlideOverPanel'

import AppModal from '../../global/AppModal'

import AppNotification from '../../global/AppNotification'
import { ChevronDownIcon } from '@heroicons/react/solid'
/* CD (EV on 20200204): import AppTable */
import AppTable from '../../../components/global/AppTable'

import AppBadge from '../../../components/global/AppBadge'

import AppButton from '../../../components/global/AppButton'

import EditLocation from './EditLocation'

import AddLocation from './AddLocation'

import UpgradePlanModalContent from './UpgradePlanModalContent'

import BulkUpload from './BulkUpload'

import DeleteLocation from './DeleteLocation'
import { useTranslation } from 'react-i18next'
import { LOCATION_UPDATE_ONE_MUTATION } from '../../../graphql/dashboard/admin/apps/location.query'
import { Menu, Transition } from '@headlessui/react'

const ListofLocations = props => {
  const { app_id, filters, session } = props
  const { t } = useTranslation()

  const plan = session.plan

  const [locations, setLocations] = useState(null)  

  const [sliderTitle, setSlideTitle] = useState('')
  const [sliderContent, setSlideContent] = useState('')
  const [sliderOpen, setSliderOpen] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModaltitle] = useState('')
  const [modalContent, setModalContent] = useState('')
  const [modalFooter, setModalFooter] = useState('')
  const [selected, setSelected] = useState([])

  /* CD (EV on 20200204): App Notif*/
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationContent, setNotificationContent] = useState('')
  const [notificationTitle, setNotificationTitle] = useState('')

  /* CD (EV on 20210213): query the location */
  const { loading, error, data, refetch } = useQuery(LOCATIONS_QUERY, {
    variables: { input: { app_id: app_id } },
    fetchPolicy: 'no-cache',
    awaitRefetchQueries: true,
  })

  const { loading: planLoading, data: planData } = useQuery(PLAN_QUERY, {
    fetchPolicy: 'no-cache',
    variables: { query: { price_id: plan.id } },
  })

  const [publishLocation, { loading: publishLoadin }] = useMutation(
    LOCATION_UPDATE_ONE_MUTATION,
    {
      refetchQueries: [
        LOCATIONS_QUERY, // DocumentNode object parsed with gql
        'GetLocations', // Query name
      ],
      onCompleted(data) {},
    }
  )

  const [unpublishLocation, { loading: unpublishLoading }] = useMutation(
    LOCATION_UPDATE_ONE_MUTATION,
    {
      refetchQueries: [
        LOCATIONS_QUERY, // DocumentNode object parsed with gql
        'GetLocations', // Query name
      ],
      onCompleted(data) {},
    }
  )

  const [deleteLocation, { loading: deleteLoading }] = useMutation(
    LOCATION_DELETE,
    {
      refetchQueries: [
        LOCATIONS_QUERY, // DocumentNode object parsed with gql
        'GetLocations', // Query name
      ],
      onCompleted(data) {},
    }
  )

  const handleCheckboxAll = () => {
    if (selected.length === locations?.length) setSelected([])
    else setSelected(locations?.map(a => a._id))
  }

  const headers = [
    <input
      type='checkbox'
      checked={selected.length === locations?.length && locations.length > 0}
      onClick={handleCheckboxAll}
      className='flex flex-row self-center m-auto rounded-[3px] px-2'
    />,
    t('locations.location_header.location_name'),
    t('locations.location_header.address'),
    t('locations.location_header.email'),
    t('locations.location_header.tags'),
    t('locations.location_header.status'),
    t('locations.location_header.action'),
  ]

  const handleClickEditLocation = item => e => {
    let index = locations.indexOf(item)

    setSliderOpen(true)
    setSlideTitle(t('locations.edit'))
    setSlideContent(
      <EditLocation
        location={item}
        locations={locations}
        index={index}
        setLocations={setLocations}
        setSliderOpen={setSliderOpen}
        filters={filters}
        locationsLimit={planData.plansAcl.cms.maxLocation}
        setModalOpen={setModalOpen}
        setModaltitle={setModaltitle}
        setModalContent={setModalContent}
        setModalFooter={setModalFooter}
        setNotificationOpen={setNotificationOpen}
        setNotificationContent={setNotificationContent}
        setNotificationTitle={setNotificationTitle}
      />
    )
  }

  const onSubmit = async type => {
    const locationsLimit = planData.plansAcl.cms.maxLocation

    let locationsCount = locations.filter(location => {
      return location.status == 'Published' || selected.includes(location._id)
    }).length

    if (
      locationsLimit >= locationsCount ||
      locationsLimit === 0 ||
      type !== 'Published'
    ) {
      setModalOpen(true)
      const title =
        type === 'Published'
          ? t('general.publish.title')
          : type === 'Unpublished'
          ? t('general.unpublish.title')
          : t('general.delete.title')
      setModaltitle(title)
      const content = <p>{t('general.are_you_sure')}</p>
      setModalContent(content)
      const footer = (
        <div>
          <AppButton
            label={t('cancel')}
            className='tertiary'
            handleClick={() => {
              setModalOpen(false)
              setModalFooter('')
            }}
          />
          &nbsp; &nbsp;
          <AppButton
            label={t('confirm')}
            className='primary'
            handleClick={() => {
              onConfirm(type)
              setModalOpen(false)
            }}
          />
        </div>
      )
      setModalFooter(footer)
    } else {
      setModalOpen(true)
      const title = t('general.max_location')
      setModaltitle(title)
      setModalContent(<UpgradePlanModalContent />)
    }
  }

  const onConfirm = async type => {
    setLocations(null)
    setModalFooter('')
    const res = selected.map(async id => {
      const query = {
        _id: id,
      }

      const set = {
        status: type,
      }

      if (type === 'delete') {
        await deleteLocation({
          variables: {
            query: query,
          },
        })
      } else if (type === 'Published') {
        await publishLocation({
          variables: {
            query: query,
            set: set,
          },
        })
      } else {
        await unpublishLocation({
          variables: {
            query: query,
            set: set,
          },
        })
      }
    })
    await Promise.all(res)
    setSelected([])
    setNotificationOpen(true)
    const title = t('saved')
    setNotificationTitle(title)
    const content = (
      <p>
        {t(
          `general.${
            type === 'Published'
              ? 'publish'
              : type === 'Unpublished'
              ? 'unpublish'
              : 'delete'
          }.success`
        )}
      </p>
    )
    setNotificationContent(content)
  }


  const handleClickDeleteLocation = item => e => {
    setModalOpen(true)
    setModaltitle(t('general.delete.title'))
    const content = <p>{t('general.are_you_sure')}</p>
    setModalContent(content)
    const footer = (
      <div>
        <AppButton
          label={t('cancel')}
          className='tertiary'
          handleClick={() => setModalOpen(false)}
        />
        &nbsp; &nbsp;
        <DeleteLocation
          locations={locations}
          setLocations={setLocations}
          setModalOpen={setModalOpen}
          item={item}
        />
      </div>
    )
    setModalFooter(footer)
  }

  const handleCheckbox = e => {
    if (selected.includes(e._id)) setSelected(selected.filter(a => a !== e._id))
    else setSelected([...selected, e._id])
  }
  const handleClickAddLocation = e => {
    const locationsLimit = planData.plansAcl.cms.maxLocation
    const locationsCount = locations.filter(location => {
      return location.status == t('general.published')
    }).length

    if (locationsLimit > locationsCount || locationsLimit == 0) {
      setSliderOpen(true)
      setSlideTitle(t('locations.add'))
      setSlideContent(
        <AddLocation
          app_id={app_id}
          filters={filters}
          locations={locations}
          setLocations={setLocations}
          setSliderOpen={setSliderOpen}
          setNotificationOpen={setNotificationOpen}
          setNotificationContent={setNotificationContent}
          setNotificationTitle={setNotificationTitle}
        />
      )
    } else {
      setModalOpen(true)
      const title = t('lorem_ipsum')
      setModaltitle(title)
      setModalContent(<UpgradePlanModalContent />)
    }
  } 
    

  const handleClickExportLocations = e => {
        
    const rows = locations.map(row => ({
      'Location Name': row.name,
      'Street': row.properties.address,
      'City': row.properties.city,
      'State / Province': row.properties.state,
      'Country': row.properties.country,
      'Zip Code': row.properties.postalCode,
      'Email': row.properties.email,
      'Contact Number': row.properties.phone,
      'Website URL (start with https:// or http://)': row.properties.url      
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(rows);    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "mapstuff-locations-template");

    XLSX.writeFile(workbook, "locations.xlsx");
  }

  useEffect(() => {
    setLocations(data?.locations)
  }, [data])


  if (
    loading ||
    planLoading ||
    locations == null ||
    publishLoadin ||
    unpublishLoading ||
    deleteLoading
  )
    return <h1 className='mt-10 text-center animate-pulse'>Loading...</h1>
  if (error) return `${t('error')} ${error.message}`

  return (
    <div>
      <AppNotification
        isOpen={notificationOpen}
        setIsOpen={setNotificationOpen}
        content={notificationContent}
        title={notificationTitle}
      />
      <AppSlideOverPanel
        isOpen={sliderOpen}
        setIsOpen={setSliderOpen}
        title={sliderTitle}
        content={sliderContent}
      />
      <AppModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        content={modalContent}
        title={modalTitle}
        footer={modalFooter}
      />

      <div>
        <BulkUpload
          session={session}
          app_id={app_id}
          setModalOpen={setModalOpen}
          setModaltitle={setModaltitle}
          setModalContent={setModalContent}
          setModalFooter={setModalFooter}
          locationsLimit={planData.plansAcl.cms.maxLocation}
          currentLocations={locations}
          setLocations={setLocations}
          setNotificationOpen={setNotificationOpen}
          setNotificationContent={setNotificationContent}
          setNotificationTitle={setNotificationTitle}
          refetch={refetch}
        />
        <br />
        <div className='flex flex-row justify-between'>
          <AppButton
            label={t('locations.add')}
            className='primary'
            handleClick={handleClickAddLocation}
          />
          
          <div>
          
            <AppButton
            label={t('locations.export')}
            className='tertiary'
            handleClick={handleClickExportLocations}
          />
          
            <Menu
              as='div'
              className={`${
                sliderOpen ? 'none' : 'auto relative'
              }  inline-block text-left pl-2`}
            >
              <div>
                <Menu.Button className='inline-flex w-full justify-center rounded-md bg-white  px-4 py-2 text-sm font-medium text-black border border-gray border-solid hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
                  Actions {selected.length}
                  <ChevronDownIcon
                    className='ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100'
                    aria-hidden='true'
                  />
                </Menu.Button>
              </div>
              <Menu.Items className='absolute right-0 mt-2 origin-top-right w-[10rem] divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='px-1 py-1 '>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onSubmit('Published')}
                        className={`${
                          active ? 'text-black' : 'text-black'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Publish
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onSubmit('Unpublished')}
                        className={`${
                          active ? 'text-black' : 'text-black'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Unpublish
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onSubmit('delete')}
                        className={`${
                          active ? 'text-black' : 'text-black'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>

      <br />

      <AppTable
        headers={headers}
        items={[]}
        name={t('locations.title')}
        total={locations.length}
      >
        {locations &&
          locations.map((item, index) => {
            return (
              <tr className='bg-white' key={index}>
                <td>
                  <input
                    type='checkbox'
                    className='flex flex-row self-center m-auto rounded-[3px]'
                    checked={selected.includes(item._id)}
                    onChange={() => handleCheckbox(item)}
                  />
                </td>
                <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                  {item.name}
                </td>
                <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                  {item.properties.address}
                </td>
                <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                  {item.properties.email}
                </td>
                <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                  {item.tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </td>
                <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                  <AppBadge
                    label={item.status}
                    className={item.status == 'Published' ? 'green' : 'red'}
                  />
                </td>
                <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                  <a  href="#"
                    className='cursor-pointer'
                    onClick={handleClickEditLocation(item)}
                  >
                    {t('edit')}
                  </a>
                  &nbsp; &nbsp;
                  <a href='#'
                    className='cursor-pointer'
                    onClick={handleClickDeleteLocation(item)}
                  >
                    {t('delete')}
                  </a>
                </td>
              </tr>
            )
          })}
      </AppTable>
    </div>
  )
}

export default ListofLocations
