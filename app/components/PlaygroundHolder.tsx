export const PlaygroundHolder = ({ project_id }: { project_id: string }) => (
  <div className="flex flex-col max-w-[500px]">
    <span className="text-[18px] text-white font-bold">Playground</span>
    <span className="text-gray-300">
      Test out your component and customize it the way you want. This is
      code-only so it won't save unless you copy the code with the settings.
    </span>
    <div className="w-full shrink-0 rounded-xl p-4 bg-gray-800/25 ring-1 ring-white/10 backdrop-blur mt-[40px]">
      <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0" />
      <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0" />
      <h3 className="text-lg font-bold text-white">Code-only customization</h3>
      <div className="mt-4 w-full">
        <div className=" ring-white/10 transition-all relative rounded-xl ring-1 bg-gray-800/25  backdrop-blur">
          <div className="pl-4 pt-4">
            <svg
              aria-hidden="true"
              viewBox="0 0 42 10"
              fill="none"
              className="h-2.5 w-auto stroke-slate-500/30"
            >
              <circle cx={5} cy={5} r="4.5" />
              <circle cx={21} cy={5} r="4.5" />
              <circle cx={37} cy={5} r="4.5" />
            </svg>
            <div className=" pb-[4px] flex items-start justify-between px-1 text-xs ">
              <code className="flex-1 overflow-auto text-white py-[2px] bg-transparent">
                npm install doc-navigator
              </code>
              <button className="ml-2 w-6 h-6 rounded-md p-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700">
                <svg
                  className="h-4 w-4 stroke-current text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-4 ">
        <div className=" ring-white/10 transition-all relative rounded-xl ring-1 bg-gray-800/25  backdrop-blur">
          <div className="pl-4 pt-4">
            <svg
              aria-hidden="true"
              viewBox="0 0 42 10"
              fill="none"
              className="h-2.5 w-auto stroke-slate-500/30"
            >
              <circle cx={5} cy={5} r="4.5" />
              <circle cx={21} cy={5} r="4.5" />
              <circle cx={37} cy={5} r="4.5" />
            </svg>
            <div className=" flex items-start justify-between px-1 text-xs ">
              <pre className="flex-1 overflow-auto text-white bg-transparent">
                {`
import { SearchComponent } from "doc-navigator";
<SearchComponent
  url="${window?.location?.origin}"
  projectId="${project_id}"
  variant="dark" //light
  welcomeMessage="Hi, how can I help you?"
/>
                            `}
              </pre>
              <button className="ml-2 w-6 h-6 -mt-4 rounded-md p-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700">
                <svg
                  className="h-4 w-4 stroke-current text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
