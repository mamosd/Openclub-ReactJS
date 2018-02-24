import React from 'react'
import { Match, MatchGroup } from 'teardrop'
import { ContentArea } from 'components/layout'
import Landing from './Landing'
import Search from './Search'

const DiscoverRoute = props => (
  <ContentArea>
    <MatchGroup>
      <Match pattern="/discover" component={Landing} />
      <Match pattern="/search" component={Search} />
    </MatchGroup>
  </ContentArea>
)

export default DiscoverRoute
