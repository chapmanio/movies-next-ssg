import { useRouter } from 'next/router';

import Loading from './Loading';

import { useUserState } from '../../hooks/useUser';

// Types
type WithAuthProps = {
  restricted?: boolean;
};

// Component
const WithAuth: React.FC<WithAuthProps> = ({ restricted = true, children }) => {
  // Hooks
  const router = useRouter();
  const userState = useUserState();

  // Derived state
  const authedUser = userState.status === 'resolved' && userState.data.auth;

  // Render
  if (userState.status === 'pending') {
    return <Loading />;
  }

  if ((restricted && !authedUser) || (!restricted && authedUser)) {
    router.replace('/');
  }

  return <>{children}</>;
};

export default WithAuth;
