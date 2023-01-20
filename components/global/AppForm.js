import { useState } from 'react'
import { Transition, Listbox } from '@headlessui/react'
import AppToggle from '../global/AppToggle'

const DisableMessage = ({ text, hasIcon }) => {
  return (
    <div className="flex items-center ml-2 mr-2">
      {hasIcon && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          viewBox="0 0 20 20"
          fill="#AA0000"
        >
          <path
            fill-rule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clip-rule="evenodd"
          />
        </svg>
      )}
      <span className="text-cd-primary font-bold text-xs">{text}</span>
    </div>
  )
}

const AppForm = ({ formInput }) => {
  const inputs = formInput.map((formInput, index) => {
    var style = ''
    if (formInput.type == 'text') {
      style =
        'focus:ring-sky-500 focus:border-sky-500 flex-1 block w-full rounded-none rounded-md sm:text-sm border-gray-300'
    } else if (formInput.type == 'password') {
      style =
        'focus:ring-sky-500 focus:border-sky-500 flex-1 block w-full rounded-none rounded-md sm:text-sm border-gray-300'
    } else if (formInput.type == 'email') {
      style =
        'focus:ring-sky-500 focus:border-sky-500 flex-1 block w-full rounded-none rounded-md sm:text-sm border-gray-300'
    } else if (formInput.type == 'search') {
      style =
        'focus:ring-sky-500 focus:border-sky-500 flex-1 block w-full rounded-none rounded-md sm:text-sm border-gray-300'
    } else if (formInput.type == 'radio') {
      style = 'focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300'
    } else if (formInput.type == 'checkbox') {
      style = 'focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded'
    } else if (formInput.type == 'file') {
      style = ''
    }

    if (formInput.type !== 'radio' && formInput.disabled) {
      style = style + ' bg-gray-200'
    }

    if (formInput.type == 'textarea')
      return (
        <div key={index} className={formInput.disabled && 'opacity-60'}>
          <label>
            <div className="flex items-center">
              {formInput.label}
              {formInput.disabled && (
                <DisableMessage
                  text={formInput.disabledText}
                  hasIcon={formInput.hasDisabledIcon}
                />
              )}
            </div>
            <input
              type={formInput.type}
              value={formInput.value}
              onChange={formInput.handleInput}
              className={style}
            />
            <textarea
              onChange={formInput.handleInput}
              rows="3"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            ></textarea>
          </label>
          <br />
          <br />
        </div>
      )
    else if (formInput.type == 'select') {
      return (
        <div key={index} className={formInput.disabled && 'opacity-60'}>
          <Listbox
            as="div"
            className="space-y-1"
            value={formInput.value}
            onChange={formInput.handleInput}
            disabled={formInput.disabled}
          >
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                  <div className="flex items-center">
                    {formInput.label}
                    {formInput.disabled && (
                      <DisableMessage
                        text={formInput.disabledText}
                        hasIcon={formInput.hasDisabledIcon}
                      />
                    )}
                  </div>
                </Listbox.Label>
                <div className={`${formInput.relative ? '' : 'relative'}`}>
                  <span className="inline-block w-full rounded-md shadow-sm">
                    <Listbox.Button
                      className={`${
                        formInput.relative ? '' : 'relative'
                      } cursor-default  w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
                        formInput.disabled ? 'bg-gray-200' : ''
                      }
                      `}
                    >
                      <span className="block truncate">
                        {formInput?.value?.app_url ||
                          formInput?.placeholder ||
                          ''}
                      </span>
                    </Listbox.Button>
                  </span>

                  <Transition
                    show={open}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
                  >
                    <Listbox.Options
                      static
                      className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                    >
                      {formInput.items.map((item) => (
                        <Listbox.Option key={item._id} value={item}>
                          {({ selected, active }) => (
                            <div
                              className={`${
                                active
                                  ? 'text-white bg-blue-600'
                                  : 'text-gray-900'
                              } cursor-default select-none relative py-2 pl-8 pr-4`}
                            >
                              <span
                                className={`${
                                  selected ? 'font-semibold' : 'font-normal'
                                } block truncate`}
                              >
                                {item.app_url}
                              </span>
                              {selected && (
                                <span
                                  className={`${
                                    active ? 'text-white' : 'text-blue-600'
                                  } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                >
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
          <br />
        </div>
      )
    } else if (formInput.type == 'toggle') {
      return (
        <div key={index} className={formInput.disabled && 'opacity-60'}>
          <label>
            <div className="flex items-center mr-2">
              {formInput.label}
              {formInput.disabled && (
                <DisableMessage
                  text={formInput.disabledText}
                  hasIcon={formInput.hasDisabledIcon}
                />
              )}
            </div>
            {formInput.value == true || formInput.value == false ? (
              <AppToggle
                value={formInput.value}
                onChange={formInput.handleInput}
              />
            ) : (
              ''
            )}
          </label>
        </div>
      )
    } else if (formInput.type == 'file') {
      return (
        <div key={index} className={formInput.disabled && 'opacity-60'}>
          <label>
            <div className="flex items-center mb-2">
              {formInput.label}
              {formInput.disabled && (
                <DisableMessage
                  text={formInput.disabledText}
                  hasIcon={formInput.hasDisabledIcon}
                />
              )}
            </div>
            <input
              type={formInput.type}
              value={formInput.value}
              onChange={formInput.handleInput}
              className={style}
              readOnly={formInput.readOnly}
              disabled={formInput.disabled}
            />
          </label>
        </div>
      )
    } else if (formInput.type == 'radio') {
      return (
        <div key={index}>
          <div className="flex items-center mb-2">
            {formInput.label}
            {formInput.disabled && (
              <DisableMessage
                text={formInput.disabledText}
                hasIcon={formInput.hasDisabledIcon}
              />
            )}
          </div>
          {formInput.items.map((item, index) => (
            <label key={index} className={item.disabled && 'opacity-60'}>
              {item.label}
              <input
                type={'radio'}
                value={item.value}
                onChange={formInput.handleInput}
                checked={formInput.value == item.value}
                className={style}
                disabled={item.disabled}
                // readOnly={formInput.readOnly}
                // disabled={formInput.disabled}
              />
              &nbsp;&nbsp;
            </label>
          ))}
          <br />
          <br />
        </div>
      )
    } else
      return (
        <div key={index} className={formInput.disabled && 'opacity-60'}>
          <label
            className={`${
              formInput.type === 'color' ? 'flex items-center' : ''
            }`}
          >
            <div
              className={`${
                formInput.type === 'color'
                  ? 'flex items-center'
                  : 'flex items-center mb-2'
              }`}
            >
              {formInput.label}
              {formInput.disabled && (
                <DisableMessage
                  text={formInput.disabledText}
                  hasIcon={formInput.hasDisabledIcon}
                />
              )}
            </div>
            <input
              type={formInput.type}
              value={formInput.value}
              onChange={formInput.handleInput}
              className={style}
              readOnly={formInput.readOnly}
              disabled={formInput.disabled}
              /* CD (JD on 20210827): Add keyboard enter handler */
              onKeyDown={formInput.handleOnKeyDown}
            />
          </label>
          <br />
          <br />
        </div>
      )
  })
  return inputs
}

export default AppForm
