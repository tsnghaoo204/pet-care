import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  /** @type {LoaderReturnData} */
  const {customer} = useLoaderData();

  const heading = customer
    ? customer.firstName
      ? `Welcome back, ${customer.firstName}! 🐾`
      : `Welcome to your Pet Care Account.`
    : 'Account Overview';

  return (
    <div className="pet-container" style={{paddingTop: '3rem', paddingBottom: '4rem'}}>
      <div className="pet-account-header">
        <div className="pet-account-avatar">
          <span>🐾</span>
        </div>
        <div>
          <h1 className="pet-account-title">{heading}</h1>
          <p className="pet-account-email">{customer?.emailAddress?.emailAddress || 'Pet Lover'}</p>
        </div>
      </div>

      <AccountMenu />

      <div className="pet-account-content">
        <Outlet context={{customer}} />
      </div>
    </div>
  );
}

function AccountMenu() {
  return (
    <nav className="pet-account-nav" role="navigation">
      <NavLink
        to="/account/orders"
        className={({isActive}) => (isActive ? 'pet-account-tab active' : 'pet-account-tab')}
      >
        📦 Order History
      </NavLink>
      <NavLink
        to="/account/profile"
        className={({isActive}) => (isActive ? 'pet-account-tab active' : 'pet-account-tab')}
      >
        👤 Profile Details
      </NavLink>
      <NavLink
        to="/account/addresses"
        className={({isActive}) => (isActive ? 'pet-account-tab active' : 'pet-account-tab')}
      >
        📍 Shipping Addresses
      </NavLink>
      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      <button type="submit" className="pet-logout-btn">
        🚪 Sign Out
      </button>
    </Form>
  );
}

/** @typedef {import('./+types/account').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
