import React from 'react'
import { Link } from 'teardrop'
import { Row, Col, Icon, Alert } from 'antd'
import { ContentPage, PageHeader } from 'components/layout'
import { TextInfoIcon } from 'components/display'
import moment from 'moment'

const About = ({ club, perm }) => {

  let minAge = 'This club has no age restrictions on members'
  if(club.details && club.details.minimum_age && club.details.minimum_age !== '0'){
    minAge = `This club has a ${club.details.minimum_age}+ age restriction`
  }

  let aboutText = null
  if(club.details && club.details.about){
    aboutText = club.details.about.split('\n')
  }

  return (
    <Row gutter={20}>
      <Col xs={24} md={15}>
        {aboutText && (
          <ContentPage largeFont>
            <PageHeader title="About" />
            <div>
              {aboutText ?
              aboutText.map((i, k) => (<span key={k}>{i}<br/></span>)) :
              (perm.userCanUpdateDetails ? <Alert
                message={(
                  <span>The about text has not been entered for this club. Go to <Link to={`/${club.slug}/settings/profile`}>Settings</Link> to update the club profile.</span>
                )}
                type="info"
                showIcon
              /> : null)}
            </div>
          </ContentPage>
        )}
        <ContentPage largeFont>
          <PageHeader title="Details"/>
          {club.details && club.details.location &&
            <TextInfoIcon icon="calendar" title="Location">
              {club.details.location.formatted_address}
            </TextInfoIcon>
          }
          {club.details && club.details.founded &&
            <TextInfoIcon icon="calendar" title="Founded">
              Club was founded in <b>{moment(club.details.founded).format('MMMM, YYYY')}</b>
            </TextInfoIcon>
          }
          <TextInfoIcon icon="user" title="Minimum Age">
            {minAge}
          </TextInfoIcon>
        </ContentPage>
      </Col>
      <Col xs={24} md={9}>
        <ContentPage largeFont>
          <PageHeader title="Contact Details" />
          { club.details && club.details.email &&
            <TextInfoIcon icon="mail" title="Club Enquiries Email">
              <a href={`mailto:${club.details.email}`}>{club.details.email}</a>
            </TextInfoIcon>
          }
          { club.details && club.details.phone &&
            <TextInfoIcon icon="phone" title="Club Enquiries Phone">
              {club.details.phone}
            </TextInfoIcon>
          }
          { club.details && club.details.website &&
            <TextInfoIcon icon="global" title="Club Website">
              <a href={club.details.website} target="_blank">{club.details.website}</a>
            </TextInfoIcon>
          }
          { club.details && club.details.facebook &&
            <TextInfoIcon icon="like-o" title="Facebook">
              <a href={`http://www.facebook.com/${club.details.facebook}`} target="_blank">fb.me/{club.details.facebook}</a>
            </TextInfoIcon>
          }
          { club.details && club.details.instagram &&
            <TextInfoIcon icon="picture" title="Instagram">
              <a href={`http://www.instagram.com/${club.details.instagram}`} target="_blank">@{club.details.instagram}</a>
            </TextInfoIcon>
          }
          { club.details && club.details.linkedin &&
            <TextInfoIcon icon="contacts" title="LinkedIn">
              <a href={`http://www.linkedin.com/company/${club.details.linkedin}`} target="_blank">linkedin.com/company/{club.details.linkedin}</a>
            </TextInfoIcon>
          }
          { club.details && club.details.twitter &&
            <TextInfoIcon icon="heart-o" title="Twitter">
              <a href={`http://www.twitter.com/${club.details.twitter}`} target="_blank">@{club.details.twitter}</a>
            </TextInfoIcon>
          }
        </ContentPage>
        {/*}
        <ContentPage largeFont>
          <PageHeader title="Membership Details"/>
          Paid membership options
        </ContentPage>
        */}
      </Col>
    </Row>
  )
}

export default About
