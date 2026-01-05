

interface PageProps {
    params:  Promise<{
        credentialId:string
    }>
}
const page = async ({params}: PageProps) => {
    const {credentialId} = await params;
  return (
    <div>cid: {credentialId}</div>
  )
}

export default page
