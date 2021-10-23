import { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AddCount from '../components/addCount'
import Clock from '../components/Clock'
import { serverRenderClock, startClock } from '../lib/redux/tick/actions'
import { wrapper } from '../lib/redux/store'
import { addCount } from '../lib/redux/counter/actions'
import Link from 'next/link';

const Other = (props) => {
  useEffect(() => {
    const timer = props.startClock()

    return () => {
      clearInterval(timer)
    }
  }, [props])

  return (
    <div>
      <h1>{`other`}</h1>
      <Clock lastUpdate={props.tick.lastUpdate} light={props.tick.light} />
      <AddCount />
      <nav>
        <Link href={'/'}>
          <a>Navigate</a>
        </Link>
      </nav>
    </div>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {
  store.dispatch(serverRenderClock(true))
  store.dispatch(addCount())
  return{
    props:{
      posts:[]
    }
  }
})
const mapStateToProps = (state) => {
  return state
}
const mapDispatchToProps = (dispatch) => {
  return {
    addCount: bindActionCreators(addCount, dispatch),
    startClock: bindActionCreators(startClock, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Other)
