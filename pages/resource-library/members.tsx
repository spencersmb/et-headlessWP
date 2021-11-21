import { getResourceLibraryAuthToken } from '../../lib/utilities/cookies'
import { isEmpty } from 'lodash'

const ResourceLibraryMembers = () => {
  return (
    <div>
      Members AREA
    </div>
  )
}
export async function getServerSideProps(context){

  const resourceAuthToken = getResourceLibraryAuthToken(context.req)
  if(isEmpty(resourceAuthToken)){
    context.res.writeHead( 307, {Location: '/resource-library'} );
    context.res.end();
  }

  return {
    props: {

    }
  }
}
export default ResourceLibraryMembers
