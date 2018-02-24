import React from 'react'
import Alert from 'antd/lib/alert'

const Unauthorised = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 50px)', display: 'block' }}>
    <Alert
      message="Oops! You're not logged in!"
      description="You must be logged in before you can access this content."
      type="info"
      showIcon
      style={{
        maxWidth: 500,
        marginLeft: 'auto',
        marginRight: 'auto',
        top: '5vh'
      }}
    />
  </div>
)
export default Unauthorised
