"use client"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySerch, ErrorView, LoadingView } from '@/components/entity-components'
import useSuspenceCredentials, { useDeleteCredential } from '../hooks/use-credentials'
import { useRouter } from 'next/navigation'
import { useCredentialsParams } from '../hooks/use-credentials-params'
import { useEntitySearch } from '@/hooks/use-entity-search'

import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { CredentialType } from '@/lib/generated/prisma/enums'
import { Credential } from '@/lib/generated/prisma/browser'

export  const CredentialsSearch = () =>{
 const [params, setParams] = useCredentialsParams()

 const { serachValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
 })
  return (

    <EntitySerch
    value={serachValue}
    onChange={onSearchChange}
    placeholder='Search Credentials'
    />
  )
}

 export const CredentialsList = () => {
    const Credentials = useSuspenceCredentials()
     return (
      <EntityList
      items={Credentials.data.items}
      getKey={(Credentials) => Credentials.id}
      renderItem={(Credential) => <CredentialsItem data={Credential}/>} 
      emptyView={<CredentialEmpty />}
      />
     )  
}

export const CredentialsHeader = ({disabled}: {disabled?:boolean}) =>{


  return(
    <EntityHeader
    title="Credentials"
    description="create and manage your Credentials"
    newButtonLabel='New Credential'
    newButtonHref={"/credentials/new"}
    disabled={disabled}
    />

  )

}
export const CredentialsPagination =()=>{
  const Credentials = useSuspenceCredentials()
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
    disabled={Credentials.isFetching}
    totalPages={Credentials.data.totalPages}
    page={Credentials.data.page}
    onPageChange={(page) => setParams({...params, page})}
    />
  )
}


export const CredentialContainer =({children}:{children:React.ReactNode}) =>{
  return (
    <EntityContainer
    header={<CredentialsHeader/>}
    search={<CredentialsSearch/>}
    pagination={<CredentialsPagination/>}
    >
      {children}
    </EntityContainer>
  )
}

export const CredentialLoading =() =>{
  return <LoadingView message='Loading Credentials' />;
}
export const CredentialError =() =>{
  return <ErrorView message='Error loading Credentials' />;
}

export const CredentialEmpty =() =>{
  const router = useRouter();
  const handleCreate = () => {
    
        router.push(`/credentials/new`)
      
    }
    return(
      <EmptyView
      onNew={handleCreate}
      message="You haven't created any Credentials yet. Get started by 
      creating a new Credential."
      />
    )
  }

  const credentialLogos: Record<CredentialType, string> ={
    [CredentialType.GEMINI]: "/images/gemini.svg",
    [CredentialType.OPENAI]: "/images/openai.svg",
    [CredentialType.ANTHROPHIC]: "/images/anthropic.svg"
  }

  export const CredentialsItem = ({data}: {data:Credential}) =>{

    const removeCredential = useDeleteCredential()

    const handleRemove = () => {
      removeCredential.mutate({id:data.id})
    }
    const logo = credentialLogos[data.type] || "/images/openai.svg"
    return(
      <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, {addSuffix: true})} {'  '}{" "}
             &bull; Created{'  '}
          {formatDistanceToNow(data.createdAt, {addSuffix: true})}
        </>
      }
      image={
        <div className='size-8 flex items-center justify-center'>
          <Image src={logo} alt={data.type} width={20} height={20}/>
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
      />
    )

  }
