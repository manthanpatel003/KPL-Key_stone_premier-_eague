import BidComponent from "./BidComponent";

export default async function page({ params }) {
  console.log(params);

  return <BidComponent playerType={params?.userType} />;
}
