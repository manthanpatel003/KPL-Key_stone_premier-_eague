import AdminPage from './AdminPage';

export default async function page({ params }) {
  console.log(params);

  return <AdminPage category={params?.category} />;
}
