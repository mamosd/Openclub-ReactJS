import { asyncComponent } from 'react-async-component'
import asyncExtensions from 'utils/asyncExtensions'

export default asyncComponent({
  resolve: () => import('./Profile'),
  ...asyncExtensions
})
