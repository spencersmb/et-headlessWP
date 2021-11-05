import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addCount } from '../../lib/redux/counter/actions'
import { startClock } from '../../lib/redux/tick/actions'

const MetaDataWrapper = (Page: any) => {

  const Inner = () => {

    return (
      <div>
        Render Wrapper
      </div>
    )
  }
  return connect(null, mapDispatchToProps)(Inner)
}
const mapDispatchToProps = (dispatch) => {
  return {
    addCount: bindActionCreators(addCount, dispatch),
    startClock: bindActionCreators(startClock, dispatch),
  }
}
export default MetaDataWrapper

export const getStaticProps = async () => {
  console.log('serverSide')
}
