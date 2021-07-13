const user = {
  name: 'Debbie Lewis',
  handle: 'deblewis',
  email: 'debbielewis@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=320&h=320&q=80',
};

export function UserPhoto() {
  return (
    <div tw="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0">
      <p tw="text-sm font-medium text-gray-700" aria-hidden="true">
        Photo
      </p>
      <div tw="mt-1 lg:hidden">
        <div tw="flex items-center">
          <div
            tw="flex-shrink-0 inline-block rounded-full overflow-hidden h-12 w-12"
            aria-hidden="true"
          >
            <img tw="rounded-full h-full w-full" src={user.imageUrl} alt="" />
          </div>
          <div tw="ml-5 rounded-md shadow-sm">
            <div
              className="group"
              tw="relative border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <label
                htmlFor="user-photo"
                tw="relative text-sm leading-4 font-medium text-gray-700 pointer-events-none"
              >
                <span>Change</span>
                <span tw="sr-only"> user photo</span>
              </label>
              <input
                id="user-photo"
                name="user-photo"
                type="file"
                tw="absolute w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div tw="hidden relative rounded-full overflow-hidden lg:block">
        <img tw="relative rounded-full w-40 h-40" src={user.imageUrl} alt="" />
        <label
          htmlFor="user-photo"
          tw="absolute inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100"
        >
          <span>Change</span>
          <span tw="sr-only"> user photo</span>
          <input
            type="file"
            id="user-photo"
            name="user-photo"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
          />
        </label>
      </div>
    </div>
  );
}
