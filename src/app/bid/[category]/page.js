import BidComponent from './BidComponent';

export default async function page({ params }) {
  console.log(params);

  return <BidComponent category={params?.category} />;
}
