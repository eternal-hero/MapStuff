/*CD (CT on 20210810): There are 3 sets of code below. The only differences are the color and icons. Using slots, I placed the {title} and {content} already. Since the icon is also varying, can we also a slot for that? something like {icon} maybe. */


/*can we assign className=yellow for this ui?

export default function Example() {
  return (
    <div className="p-4 rounded-md bg-yellow-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">{title}</h3>
        </div>
        <div className="flex-1 ml-3 md:flex md:justify-between">
          <p className="text-sm text-yellow-700">{content}</p>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            <a href="#" className="font-medium text-yellow-700 whitespace-nowrap hover:text-yellow-600">
              {link}<span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
*/

/*can we assign className=red for this ui? 

export default function Example() {
  return (
    <div className="p-4 rounded-md bg-red-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
        </div>
        <div className="flex-1 ml-3 md:flex md:justify-between">
          <p className="text-sm text-red-700">{content}</p>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            <a href="#" className="font-medium text-red-700 whitespace-nowrap hover:text-red-600">
              {link}<span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

*/

/*can we assign className=green for this ui? 

export default function Example() {
  return (
    <div className="p-4 rounded-md bg-green-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">{title}</h3>
        </div>
        <div className="flex-1 ml-3 md:flex md:justify-between">
          <p className="text-sm text-green-700">{content}</p>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            <a href="#" className="font-medium text-green-700 whitespace-nowrap hover:text-green-600">
              {link}<span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

*/