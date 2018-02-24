import { asyncComponent } from 'react-async-component'
import asyncExtensions from 'utils/asyncExtensions'

export default asyncComponent({
  async resolve() {
    return System.import('routes/Events/CreateEvent/CreateEvent');
  },
  ...asyncExtensions
})
