import {
  XCircleIcon,
  ExclamationIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XIcon,
} from '@heroicons/react/solid';

// Types
export type NotificationProps = {
  visible: boolean;
  type?: 'success' | 'warn' | 'error' | 'info';
  title: string;
  description?: string;
  onClose: () => void;
};

// Component
const Notification = ({
  visible,
  type = 'info',
  title,
  description,
  onClose,
}: NotificationProps) => (
  <div
    aria-live="assertive"
    className="pointer-events-none fixed inset-0 z-20 flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end sm:p-6"
  >
    <div
      className={
        `w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition` +
        (visible
          ? ` pointer-events-auto translate-y-0 opacity-100 duration-300 ease-out sm:translate-x-0`
          : ` pointer-events-none translate-y-2 opacity-0 duration-100 ease-in sm:translate-y-0 sm:translate-x-2`)
      }
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {type === 'success' ? (
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
            ) : type === 'warn' ? (
              <ExclamationIcon className="h-6 w-6 text-yellow-400" />
            ) : type === 'error' ? (
              <XCircleIcon className="h-6 w-6 text-red-400" />
            ) : type === 'info' ? (
              <InformationCircleIcon className="h-6 w-6 text-blue-400" />
            ) : null}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            {description && <p className="mt-1 text-sm text-gray-500">{description}.</p>}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => onClose()}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Notification;
